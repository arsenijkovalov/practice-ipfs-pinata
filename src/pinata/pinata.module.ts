import { Module } from '@nestjs/common';
import { PinataService } from './pinata.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PinataService],
  exports: [],
})
export class PinataModule {}
