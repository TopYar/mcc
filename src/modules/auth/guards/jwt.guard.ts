import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { EJwtType } from '../../../common/helpers/jwt';
import { ServiceException } from '../../../common/ServiceException';
import { ServiceResponse } from '../../../common/ServiceResponse';


export const CheckJwt = (type: EJwtType) => {
    return applyDecorators(
        SetMetadata('JwtType', type),
        UseGuards(JwtGuard));
};


@Injectable()
class JwtGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        const type = this.reflector.get<EJwtType>('JwtType', context.getHandler()) ?? EJwtType.REFRESH;
        const req = context.switchToHttp().getRequest();

        if (req.ctx.data.jwt?.type !== type) {
            switch (type) {
                case EJwtType.ACCESS:
                    throw new ServiceException(ServiceResponse.CODES.ERROR_ACCESS_JWT_TOKEN_REQUIRED);
                case EJwtType.REFRESH:
                    throw new ServiceException(ServiceResponse.CODES.ERROR_REFRESH_JWT_TOKEN_REQUIRED);
                case EJwtType.CONFIRMATION:
                    throw new ServiceException(ServiceResponse.CODES.ERROR_CONFIRMATION_JWT_TOKEN_REQUIRED);
                default:
                    throw new ServiceException(ServiceResponse.CODES.ERROR_BAD_REQUEST);
            }
        } else if (req.sessionID !== req.ctx.data.jwt.sessionId) {
            throw new ServiceException(ServiceResponse.CODES.ERROR_JWT_TOKEN_IS_INVALID);
        }

        return true;
    }
}