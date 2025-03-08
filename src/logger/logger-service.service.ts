import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from '../message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {

    constructor(private readonly messageformatter: MessageFormatterService) { }
    log(message: string): void {
        console.log(this.messageformatter.format(message));
        //return `[${new Date().toISOString()}] ${message}`;
    }
}
