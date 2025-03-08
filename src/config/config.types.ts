import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AppConfig } from "./app.config";
import * as JOi from 'joi';
import { Db } from "typeorm";
import { AuthConfig } from "./auth.config";

export interface ConfigType {
    app : AppConfig,
    database : TypeOrmModuleOptions
    auth : AuthConfig
}

export const appConfigSchema = JOi.object({
    APP_MESSAGE_PREFIX: JOi.string().default('Default Message Prefix'),
    DB_HOST: JOi.string().default('localhost'),
    DB_PPORT: JOi.number().default(5432),
    DB_USER: JOi.string().required(),
    DB_PASSWORD: JOi.string().required(),
    DB_DATABASE: JOi.string().required(),
    DB_SYNCHRONIZE: JOi.number().valid(0, 1).required(),
    JWT_SECRET: JOi.string().required(),
    JWT_EXPIRES_IN: JOi.string().required(),
});