import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';

@Module({
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
