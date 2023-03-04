import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            load: [configuration],
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService, UsersService],
})
export class AppModule {}
