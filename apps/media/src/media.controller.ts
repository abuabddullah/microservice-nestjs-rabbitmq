import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  getHello(): string {
    return this.mediaService.getHello();
  }

  @MessagePattern('service.ping')
  ping() {
    return this.mediaService.ping();
  }
}
