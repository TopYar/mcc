import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { EJwtType } from '../../../common/helpers/jwt';
import { ServiceException } from '../../../common/ServiceException';
import { ServiceResponse } from '../../../common/ServiceResponse';

@Injectable()
export class AuthGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        if (req.ctx.data.jwt?.type !== EJwtType.ACCESS) {
            throw new ServiceException(ServiceResponse.CODES.ERROR_REFRESH_JWT_TOKEN_REQUIRED);
        } else if (req.sessionID !== req.ctx.data.jwt.sessionId) {
            throw new ServiceException(ServiceResponse.CODES.ERROR_SESSION_IS_INVALID);
        } else if (!req.session.userId || !req.session.isLogged) {
            throw new ServiceException(ServiceResponse.CODES.ERROR_NEED_LOGIN);
        }

        return true;
    }
}