import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as UUID } from 'uuid';

import { SessionContext } from '../helpers/session-context';
import { createLogger } from '../logger';

const mainLogger = createLogger(__filename);

@Injectable()
export class ContextMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        req.ctx = new SessionContext(UUID(), { url: req.url });

        const logger = mainLogger.child({ traceId: req.ctx.traceId });

        logger.info(`Incoming http request: ${req.method} ${req.ctx.data.url}`, { body: req.body });

        next();
    }
}
