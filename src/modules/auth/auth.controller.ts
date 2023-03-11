import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Session } from 'express-session';
import moment from 'moment';

import { EJwtType } from '../../common/helpers/jwt';
import { redisClient } from '../../common/redis';
// import { Session } from 'express-session';
import { ServiceResponse } from '../../common/ServiceResponse';
import config from '../../config';
import { aesEncrypt } from '../../utils/cryptox';
import { SafeCall } from '../../utils/safeCall';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ConfirmDto } from './dto/confirm.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CheckJwt } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService) {}

    @Post('register')
    async register(@Body() body: RegisterDto, @Req() req: Request) {
        const response = await SafeCall.call<typeof this.authService.register>(
            this.authService.register(body),
        );

        if (response instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_REGISTER_USER);
        }

        if (!response.success) {
            return response;
        }

        req.session.userId = response.result.id;

        const token = this.createJwtToken(req.session.userId, req.session.id, EJwtType.CONFIRMATION, '1h');

        req.session.save((err: any) => {
            // Store registration session only for an hour
            redisClient.EXPIRE(config.server.sessionPrefix + req.session.id, 60 * 60);
        });


        return ServiceResponse.ok({ token });
    }



    @CheckJwt(EJwtType.CONFIRMATION)
    @Get('resend-code')
    async resendCode(@Req() req: Request) {
        const response = await SafeCall.call<typeof this.authService.resendCode>(
            this.authService.resendCode(req.session.userId!),
        );

        if (response instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_REGISTER_USER);
        }

        if (!response.success) {
            return response;
        }

        req.session.save((err: any) => {
            // Store registration session only for an hour
            redisClient.EXPIRE(config.server.sessionPrefix + req.session.id, 60 * 60);
        });

        return ServiceResponse.ok();
    }

    @CheckJwt(EJwtType.CONFIRMATION)
    @Post('confirm')
    async confirm(@Body() body: ConfirmDto, @Req() req: Request) {
        const key = `${config.server.confirmationPrefix}${req.session.userId}`;
        const data = await redisClient.HGETALL(key);

        let found = false;

        for (const iat of Object.keys(data)) {
            const hourAgo = moment().subtract(1, 'hour');

            // If code is correct and issued not more than 1 hour ago
            if (body.code === data[iat] && Number(iat) > hourAgo.valueOf()) {
                found = true;
            }
        }

        if (!found) {
            req.session.save((err: any) => {
                // Store registration session only for an hour
                redisClient.EXPIRE(config.server.sessionPrefix + req.session.id, 60 * 60);
            });

            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_CONFIRMATION_CODE_IS_INVALID);
        }


        const updateResponse = await SafeCall.call<typeof this.userService.updateUser>(
            this.userService.updateUser({
                id: req.session.userId!,
                confirmedAt: new Date(),
            }),
        );

        if (updateResponse instanceof Error) {
            console.error(updateResponse);

            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CONFIRM_USER);
        }

        if (!updateResponse.success) {
            return updateResponse;
        }

        req.session.isLogged = true;

        const tokens = this.createJwtTokens(req.session.userId!, req.session.id);

        // await redisClient.EXPIRE(config.server.sessionPrefix + ':' + req.session.id, ttl);

        return ServiceResponse.ok(tokens);
    }

    @Post('login')
    async login(@Body() body: LoginDto, @Req() req: Request) {
        const authResponse = await this.authService.login(body);

        if (!authResponse.success) {
            switch (authResponse.error.code) {
                case ServiceResponse.CODES.FAIL_USER_NOT_FOUND.code:
                case ServiceResponse.CODES.ERROR_INVALID_CREDENTIALS.code:
                    return ServiceResponse.fail(ServiceResponse.CODES.ERROR_INVALID_CREDENTIALS);
                default:
                    return ServiceResponse.fail(ServiceResponse.CODES.ERROR_UNEXPECTED);
            }
        }

        req.session.userId = authResponse.result.id;
        req.session.isLogged = true;

        const tokens = this.createJwtTokens(req.session.userId!, req.session.id);

        return ServiceResponse.ok(tokens);
    }




    @CheckJwt(EJwtType.REFRESH)
    @Get('refresh-token')
    async refreshToken(@Req() req: Request) {
        const sessionToDestroy = req.session.id;

        await new Promise<void>(resolve => {
            req.sessionStore.generate(req);
            req.sessionStore.get(sessionToDestroy, async function(err, session) {
                if (err) {
                    console.error('error while restoring a session by id', err);
                }

                if (session) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    req.session = new Session(req, session);
                }
                req.sessionStore.destroy(sessionToDestroy, function(err) {
                    if (err) {
                        console.error('error while destroying initial session', err);
                    }
                    resolve();
                });
            });
        });

        const tokens = this.createJwtTokens(req.session.userId!, req.session.id);

        return ServiceResponse.ok(tokens);
    }

    createJwtToken(userId: string, sessionId: string, type: EJwtType, expiresIn?: string) {
        const encryptedSessionId = aesEncrypt(sessionId);
        const opts: any = {};

        if (expiresIn) {
            opts.expiresIn = expiresIn;
        }

        return this.jwtService.sign(
            {
                userId,
                sessionId: encryptedSessionId,
                type: type,
            }, opts);
    }
    createJwtTokens(userId: string, sessionId: string) {
        return {
            accessToken: this.createJwtToken(userId, sessionId, EJwtType.ACCESS, config.server.jwt.accessExpiration + 'h'),
            refreshToken: this.createJwtToken(userId, sessionId, EJwtType.REFRESH),
        };
    }
}

