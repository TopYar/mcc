import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
} from '@nestjs/common';

import { FastestValidationException } from '../../utils/validator';
import { createLogger } from '../logger';
import { ServiceResponse } from '../ServiceResponse';

const mainLogger = createLogger(__filename);

export interface FastestValidatorExceptionFilterOption {
    showStack: boolean;
}

@Catch(FastestValidationException)
export class FastestValidatorExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly options: FastestValidatorExceptionFilterOption,
    ) {}
    catch(exception: FastestValidationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const status = exception.getStatus();

        // {
        //     status: status,
        //     message: exception.message,
        //     ...(this.options.showStack && { stack: exception.stack }),
        //     payload: exception.errors,
        // };

        const logger = mainLogger.child({ traceId: req?.ctx?.traceId });

        logger.error(`Validation error`, { details: exception.errors });

        return res.send(ServiceResponse.fail(
            {
                ...ServiceResponse.CODES.VALIDATION_ERROR,
                details: exception.errors,
            },
        ));
    }
}