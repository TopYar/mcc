import { Injectable } from '@nestjs/common';
import randomstring from 'randomstring';

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
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_REGISTER_USER);
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
        const user = await SafeCall.call<typeof this.usersService.getByEmail>(
            this.usersService.getByEmail({ email, attributes: ['id', 'password', 'confirmedAt'] }),
        );

        if (user instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_USER);
        }

        if (!user) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_USER_NOT_FOUND);
        }

        const correctCredentials = await user.comparePassword(password);

        if (!correctCredentials) {
            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_INVALID_CREDENTIALS);
        }

        if (!user.confirmedAt) {
            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_INVALID_CREDENTIALS);
        }

        return ServiceResponse.ok({ id: user.id });
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
}
