import { Module } from '@nestjs/common';
import { PnuController } from './pnu.controller';
import { PnuService } from './pnu.service';

@Module({
  controllers: [PnuController],
  providers: [PnuService],
  exports: [PnuService],
})
export class PnuModule {}
