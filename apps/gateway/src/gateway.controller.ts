import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('health')
  health() {
    return {
      ok: true,
      service: 'gateway',
      now: new Date().toLocaleString(),
    };
  }
}
