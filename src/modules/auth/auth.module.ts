import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import config from '../../config';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [UsersModule, EmailModule,
        JwtModule.register({
            secret: config.server.jwtSecret,
        })],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {
}
