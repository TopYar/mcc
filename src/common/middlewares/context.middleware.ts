import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as UUID } from 'uuid';

import { SessionContext } from '../helpers/session-context';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        req.ctx = new SessionContext(UUID(), { url: req.url });

        // TODO: настроить логгирование, класть логи на хост сервер
        next();
    }
}
