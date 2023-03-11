import { SetMetadata } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { EJwtType } from '../../../common/helpers/jwt';
import { ServiceResponse } from '../../../common/ServiceResponse';


// export function NeedJwt<This, Args extends any[], Return>(
//     originalMethod: (this: This, ...args: Args) => Return,
//     context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
// ) {
//     return function(this: This, ...args: Args): Return {
//         const [req, res, next] = args;
//
//         context;
//
//         if (req.ctx.data.jwt?.type !== EJwtType.REFRESH) {
//             res.send(ServiceResponse.fail(ServiceResponse.CODES.ERROR_REFRESH_JWT_TOKEN_REQUIRED));
//         } else if (req.sessionID !== req.ctx.data.jwt.sessionId) {
//             res.send(ServiceResponse.fail(ServiceResponse.CODES.ERROR_SESSION_IS_INVALID));
//         } else {
//             return originalMethod.call(this, ...args);
//         }
//     };
// }

// export function NeedJwt(type: EJwtType) {
//     console.log('second(): factory evaluated');
//
//     return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log('second(): called');
//     };
// }