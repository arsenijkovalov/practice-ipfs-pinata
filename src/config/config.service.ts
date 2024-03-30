import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { Injectable, Logger } from '@nestjs/common';
import {
  ClassType,
  transformAndValidateSync,
} from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { ConfigSchema } from './config.schema';
import { parse } from 'dotenv';

@Injectable()
export class ConfigService<T = any> {
  private static readonly schemaToService = new Map();
  private readonly configSchema: ConfigSchema;
  private readonly logger: Logger = new Logger(ConfigService.name);

  constructor(private readonly envSchema: ClassType<T>) {
    this.loadEnv();
    this.configSchema = this.transformAndValidateConfigSchema();
  }

  get<Y>(key: keyof T): Y {
    return (this.configSchema as any)[key];
  }

  static create<Y = ConfigSchema>(envSchema: ClassType<Y>): ConfigService<Y> {
    if (this.schemaToService.has(envSchema)) {
      return this.schemaToService.get(envSchema);
    }
    const instance = new ConfigService(envSchema);
    this.schemaToService.set(envSchema, instance);
    return instance;
  }

  private loadEnv(): void {
    try {
      const dotenvPath = resolve(
        process.cwd(),
        process.env['ENV_FILE'] || '.env',
      );
      const envParsedData = parse(readFileSync(dotenvPath, 'utf-8'));
      Object.assign(process.env, envParsedData);
    } catch (error) {
      /* ignore error */
    }
  }

  private transformAndValidateConfigSchema(): ConfigSchema {
    try {
      return transformAndValidateSync(this.envSchema as any, process.env);
    } catch (errors) {
      const error = this.getValidationError(errors as ValidationError[]);
      this.logger.error('Failed to transform and validate config schema');
      throw new Error(error);
    }
  }

  private getValidationError(errors: ValidationError[]): string | null {
    const [error] = errors;
    if (!error.constraints) {
      return null;
    }
    const [errorKey] = Object.keys(error.constraints);
    return error.constraints[errorKey];
  }
}
