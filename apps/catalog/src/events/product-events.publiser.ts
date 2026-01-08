import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TProductCreatedEvent } from './product.events';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductEventsPubliser implements OnModuleInit {
  private readonly logger = new Logger(ProductEventsPubliser.name);

  constructor(
    @Inject('SEARCH_EVENTS_CLIENT')
    private readonly searchEventsClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.searchEventsClient.connect();

    this.logger.log('Connected to search queue');
  }

  async productCreated(event: TProductCreatedEvent) {
    try {
      console.log(event, 'Event is now logging here!');
      await firstValueFrom(
        this.searchEventsClient.emit('product.created', event),
      );
    } catch (err) {
      console.log('🚀 ~ ProductEventsPubliser ~ productCreated ~ err:', err);
      this.logger.warn('Failed to publish product created event');
    }
  }
}
