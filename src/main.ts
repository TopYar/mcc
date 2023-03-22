import { NestFactory } from '@nestjs/core';
import session from 'express-session';

import { AppModule } from './app.module';
import { FastestValidatorExceptionFilter } from './common/filters/fastest-validator-exception.filter';
import { GlobalErrorFilter } from './common/filters/global-error.filter';
import { ServiceExceptionFilter } from './common/filters/service-exception.filter';
import { SessionContext } from './common/helpers/session-context';
import { store } from './common/redis';
import config from './config';
import { FastestValidatorPipe } from './utils/validator';


// Augment express-session with a custom SessionData object
declare module 'express-session' {
    interface SessionData {
        userId: string;
        isLogged: boolean;
    }
}

declare module 'express' {
    interface Request {
        ctx: SessionContext;
    }
}

export const sessionInstance = session({
    store: store,
    secret: config.server.sessionKey!,
    saveUninitialized: false,
    resave: false,
});


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = config.server.port;

    app.use(sessionInstance);

    app.useGlobalFilters(new GlobalErrorFilter());
    app.useGlobalFilters(new ServiceExceptionFilter());
    app.useGlobalPipes(new FastestValidatorPipe());
    app.useGlobalFilters(new FastestValidatorExceptionFilter({
        showStack: false,
    }));

    await app.listen(port);
}
bootstrap();
