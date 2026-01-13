import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ProductCreatedDto } from './dto/product-events.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { Payload } from '@nestjs/microservices';
import type { TProductDeletedEvent } from 'apps/catalog/src/events/product.events';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @EventPattern('product.created')
  async onProductCreated(@Payload() payload: ProductCreatedDto) {
    await this.searchService.upsertFromCatalogEvent({
      productId: payload.productId,
      name: payload.name,
      description: payload.description,
      status: payload.status,
      price: payload.price,
    });
  }

  @EventPattern('product.deleted')
  async onProductDeleted(@Payload() payload: TProductDeletedEvent) {
    await this.searchService.deleteFromCatalogEvent({
      productId: payload.productId,
    });
  }

  @MessagePattern('search.query')
  async query(@Payload() payload: SearchQueryDto) {
    return this.searchService.query({
      q: payload.q,
      limit: payload.limit,
    });
  }

  @Get()
  getHello(): string {
    return this.searchService.getHello();
  }

  @MessagePattern('service.ping')
  ping() {
    return this.searchService.ping();
  }
}
