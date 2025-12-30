import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getHello(): string {
    return this.catalogService.getHello();
  }

  @MessagePattern('service.ping')
  ping() {
    return this.catalogService.ping();
  }
}
