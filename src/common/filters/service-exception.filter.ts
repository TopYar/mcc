import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { ServiceException } from '../ServiceException';
import { ServiceResponse } from '../ServiceResponse';

@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
    catch(exception: ServiceException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        res.send(ServiceResponse.fail(exception.code));
    }
}