import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContextMiddleware } from './common/middlewares/context.middleware';
import { JwtSessionMiddleware } from './common/middlewares/jwt-session.middleware';
import config from './config';
import { ormconfig } from './database/ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { ConditionsModule } from './modules/conditions/conditions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MeasurementsModule } from './modules/measurements/measurements.module';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...ormconfig,
        }),
        JwtModule.register({
            secret: config.server.jwtSecret,
        }),
        UsersModule,
        AuthModule,
        ConditionsModule,
        MeasurementsModule,
        DashboardModule,
    ],
    controllers: [AppController],
    providers: [AppService, UsersService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ContextMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
        consumer.apply(JwtSessionMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
