import { AuthConfig } from './../config/auth.config';
import { TypedConfigService } from './../config/typed-config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordService } from './password/password.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { User } from './users.entity';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: TypedConfigService) => ({
                secret: config.get<AuthConfig>('auth')?.jwt.secret,
                signOptions: {
                    expiresIn: config.get<AuthConfig>('auth')?.jwt.expiresIn,
                },
            }),
        }),
    ],
    providers: [
        PasswordService,
        UserService,
        AuthService,        
        AuthGuard, 
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        RolesGuard,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    controllers: [AuthController],
})
export class UsersModule { }