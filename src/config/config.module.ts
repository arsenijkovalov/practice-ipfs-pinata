import { Module, Global, DynamicModule } from '@nestjs/common';
import { ClassType } from 'class-transformer-validator';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static register<T = any>(schema: ClassType<T>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useValue: ConfigService.create<T>(schema),
        },
      ],
      exports: [ConfigService],
    };
  }
}
