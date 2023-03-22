import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { Session } from 'express-session';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { aesDecrypt } from '../../utils/cryptox';
import { IJwtPayload } from '../helpers/jwt';
import { createLogger } from '../logger';
import { ServiceResponse } from '../ServiceResponse';

const mainLogger = createLogger(__filename);

@Injectable()
export class JwtSessionMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {
    }
    async use(req: Request, res: Response, next: NextFunction) {
        const logger = mainLogger.child({ traceId: req.ctx.traceId });

        try {
            if (req.headers.authorization || req.headers['jwt']) {
                const token = req.headers['jwt'] ?? req.headers.authorization!.split(' ')?.[1];

                // If token was provided in header
                if (token) {
                    const data = this.jwtService.verify<IJwtPayload>(token as string);

                    const sessionId = aesDecrypt(data.sessionId);

                    req.ctx.data.jwt = {
                        userId: data.userId,
                        sessionId: sessionId,
                        type: data.type,
                    };

                    if (req.sessionStore) {
                        req.sessionStore.get(sessionId, async function(err, session) {
                            if (err) {
                                console.error('error while restoring a session by id', err);
                            }

                            if (session) {
                                req.sessionID = sessionId;
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                req.session = new Session(req, session);

                                // await new Promise<void>(resolve => {
                                //     req.session.reload(function(err) {
                                //         if (err) {
                                //             console.error('error while reloading session from jwt', err);
                                //         }
                                //         resolve();
                                //     });
                                // });


                                next();
                            } else {
                                next();
                            }
                            // if (req.session) {
                            //     req.session.destroy(function(err) {
                            //         if (err) {
                            //             console.error('error while destroying initial session', err);
                            //         }
                            //         makeNew(req, res, next, sessionId);
                            //     });
                            // } else {
                            //     makeNew(req, res, next, sessionId);
                            // }
                        });
                    } else {
                        console.error('req.sessionStore isn\'t available');
                        next();
                    }
                } else {
                    next();
                }
            } else {
                next();
            }
        } catch (error: any) {
            if (error instanceof TokenExpiredError) {
                logger.warn('Token was expired. Request rejected');

                return res.send(ServiceResponse.fail(ServiceResponse.CODES.ERROR_JWT_TOKEN_IS_INVALID));
            } else if (error instanceof JsonWebTokenError) {
                logger.warn('Token is invalid. Request rejected');

                return res.send(ServiceResponse.fail(ServiceResponse.CODES.ERROR_JWT_TOKEN_IS_INVALID));
            }

            logger.error('Unexpected error', { error });

            return res.send(ServiceResponse.fail(ServiceResponse.CODES.INTERNAL_SERVER_ERROR));
        }
    }
}
