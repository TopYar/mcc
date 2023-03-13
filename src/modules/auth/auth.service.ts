import { Injectable } from '@nestjs/common';
import randomstring from 'randomstring';
import { v4 as UUID } from 'uuid';

import { EmailTemplate } from '../../common/helpers/email-templates';
import { redisClient } from '../../common/redis';
import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import config from '../../config';
import { SafeCall } from '../../utils/safeCall';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
    ) {}
    async register({ name, email, password }: RegisterDto): Promise<TResult<User>> {
        const registerResponse = await SafeCall.call<typeof this.usersService.registerUser>(
            this.usersService.registerUser({ name, email, password }),
        );

        if (registerResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_REGISTER_USER);
        }

        if (!registerResponse.success) {
            return registerResponse;
        }

        const userInstance = registerResponse.result;

        const sendCodeResponse = await this.sendCode(userInstance.id, userInstance.email);

        if (!sendCodeResponse.success) {
            return sendCodeResponse;
        }

        return ServiceResponse.ok(registerResponse.result);
    }

    async resendCode(id: string) {
        const userResponse = await SafeCall.call<typeof this.usersService.getOne>(
            this.usersService.getOne({ id, attributes: ['id', 'email'] }),
        );

        if (userResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_USER);
        }

        if (!userResponse.success) {
            return userResponse;
        }

        const userInstance = userResponse.result;

        const sendCodeResponse = await this.sendCode(userInstance.id, userInstance.email);

        if (!sendCodeResponse.success) {
            return sendCodeResponse;
        }

        return ServiceResponse.ok(userResponse.result);
    }

    async login({ email, password }: LoginDto): Promise<TResult<User>> {
        const userResponse = await SafeCall.call<typeof this.usersService.getByEmail>(
            this.usersService.getByEmail({ email, attributes: ['id', 'password', 'confirmedAt'] }),
        );

        if (userResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_USER);
        }

        if (!userResponse) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_USER_NOT_FOUND);
        }

        const userInstance = userResponse.result;

        const correctCredentials = await userInstance.comparePassword(password);

        if (!correctCredentials) {
            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_INCORRECT_CREDENTIALS);
        }

        if (!userInstance.confirmedAt) {
            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_EMAIL_IS_NOT_CONFIRMED);
        }

        return ServiceResponse.ok({ id: userInstance.id });
    }


    async recoverPassword(email: string) {
        const userResponse = await SafeCall.call<typeof this.usersService.getByEmail>(
            this.usersService.getByEmail({ email, attributes: ['id', 'email'] }),
        );

        if (userResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_USER);
        }

        if (!userResponse.success) {
            return userResponse;
        }

        const userInstance = userResponse.result;

        return this.sendRecoverLink(userInstance.id, userInstance.email);
    }

    async setPassword(id: string, password: string) {
        const key = `${config.server.recoverLinkPrefix}${id}`;
        const userId: string | null = await redisClient.GETDEL(key);

        if (!userId) {
            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_RECOVER_LINK_IS_EXPIRED);
        }

        const userResponse = await SafeCall.call<typeof this.usersService.updateUser>(
            this.usersService.updateUser({ id: userId, password }),
        );

        if (userResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_UPDATE_USER);
        }

        if (!userResponse.success) {
            return userResponse;
        }

        return ServiceResponse.ok();
    }

    async getRecoverInfo(id: string) {
        const key = `${config.server.recoverLinkPrefix}${id}`;
        const userId: string | null = await redisClient.GET(key);

        if (!userId) {
            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_RECOVER_LINK_IS_EXPIRED);
        }

        const userResponse = await SafeCall.call<typeof this.usersService.getOne>(
            this.usersService.getOne({ id: userId, attributes: ['id', 'email'] }),
        );

        if (userResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_USER);
        }

        if (!userResponse.success) {
            return userResponse;
        }

        return ServiceResponse.ok(userResponse.result.email);
    }

    private async sendCode(userId: string, email: string) {
        const key = `${config.server.confirmationPrefix}${userId}`;
        const code = randomstring.generate({
            length: 6,
            charset: 'numeric',
        });

        await redisClient.HSET(key, Date.now().toString(), code);
        await redisClient.EXPIRE(key, 60 * 60);

        const emailResponse = await SafeCall.call<typeof this.emailService.send>(
            this.emailService.send({
                email: email,
                template: EmailTemplate.CONFIRMATION,
                subject: 'Complete registration',
                params: {
                    code,
                },
            }),
        );

        if (emailResponse instanceof Error) {
            console.error(emailResponse);

            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_SEND_MAIL);
        }

        return ServiceResponse.ok();
    }

    private async sendRecoverLink(userId: string, email: string) {
        const linkId = UUID();
        const key = `${config.server.recoverLinkPrefix}${linkId}`;

        await redisClient.SET(key, userId);
        await redisClient.EXPIRE(key, 15 * 60); // 15 min

        const emailResponse = await SafeCall.call<typeof this.emailService.send>(
            this.emailService.send({
                email: email,
                template: EmailTemplate.RECOVER,
                subject: 'Recover your password',
                params: {
                    link: config.baseUrl + `/auth/recover/${linkId}`,
                },
            }),
        );

        if (emailResponse instanceof Error) {
            console.error(emailResponse);

            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_SEND_MAIL);
        }

        return ServiceResponse.ok();
    }
}
