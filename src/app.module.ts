import { Module } from '@nestjs/common';
import { PinataModule } from './pinata/pinata.module';
import { ConfigModule } from './config/config.module';
import { ConfigSchema } from './config/config.schema';

@Module({
  imports: [ConfigModule.register(ConfigSchema), PinataModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
