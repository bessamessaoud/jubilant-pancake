import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger-service.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config.service';
import { Task } from './tasks/entities/tasks.entity';
import { User } from './users/users.entity';
import { TaskLabel } from './tasks/entities/task-label.entity';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './users/guards/auth.guard';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get('database'),
        entities: [Task, User, TaskLabel]
      })

    }),
    ConfigModule.forRoot({
      isGlobal : true,
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnknown: false
        abortEarly: true
      }
    }),
    TasksModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService, LoggerService, MessageFormatterService, {
    provide: TypedConfigService,
    useExisting: ConfigService
  }],
})
export class AppModule { }
