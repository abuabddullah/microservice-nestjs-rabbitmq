import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  getHello(): string {
    return this.searchService.getHello();
  }

  @MessagePattern('service.ping')
  ping() {
    return this.searchService.ping();
  }
}
