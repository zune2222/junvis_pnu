import { Body, Controller, Post } from '@nestjs/common';
import { TransportService } from './transport.service';
import {
  RealTimeBusPayloadDto,
  RealTimeSubwayPayloadDto,
  RoutePayloadDto,
} from './dto/route.dto';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post('route')
  async route(@Body() payload: RoutePayloadDto) {
    return this.transportService.route(payload);
  }

  @Post('realtime')
  async realTime(
    @Body() payload: RealTimeBusPayloadDto | RealTimeSubwayPayloadDto,
  ) {
    return this.transportService.realTime(payload);
  }
}
