import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger-service.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/config.types';
import { AppConfig } from './config/app.config';

@Injectable()
export class AppService {
  constructor(
    private readonly messageformatter: MessageFormatterService,
    private readonly logger : LoggerService,
    private readonly configService : ConfigService<ConfigType>
  ) {}
  getHello(): string {
    const message = this.configService.get<AppConfig>('app')?.messagePrefix;
    return this.messageformatter.format('Hello World!');
  }
}
