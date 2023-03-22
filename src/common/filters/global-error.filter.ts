import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { createLogger } from '../logger';
import { ServiceResponse } from '../ServiceResponse';

const mainLogger = createLogger(__filename);

@Catch(Error)
export class GlobalErrorFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        const logger = mainLogger.child({ traceId: req?.ctx?.traceId });

        logger.error(`Unexpected error at ${req.method} ${req.url}`, { error: exception });

        res.send(ServiceResponse.fail(ServiceResponse.CODES.INTERNAL_SERVER_ERROR));
    }
}