import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TProductCreatedEvent, TProductDeletedEvent } from './product.events';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductEventsPubliser implements OnModuleInit {
  private readonly logger = new Logger(ProductEventsPubliser.name);

  constructor(
    @Inject('SEARCH_EVENTS_CLIENT')
    private readonly searchEventsClient: ClientProxy,

    @Inject('MEDIA_EVENTS_CLIENT')
    private readonly mediaEventsClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.searchEventsClient.connect();
    await this.mediaEventsClient.connect();
    this.logger.log('Connected to search queue');
    this.logger.log('Connected to media queue');
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

  async productDeleted(event: TProductDeletedEvent) {
    try {
      console.log(event, 'Event is now logging here!');
      // await firstValueFrom(
      //   this.searchEventsClient.emit('product.deleted', event),
      // );
      // await firstValueFrom(
      //   this.mediaEventsClient.emit('product.deleted', event),
      // );
      await Promise.all([
        firstValueFrom(this.searchEventsClient.emit('product.deleted', event)),
        firstValueFrom(this.mediaEventsClient.emit('product.deleted', event)),
      ]);
    } catch (err) {
      console.log('🚀 ~ ProductEventsPubliser ~ productDeleted ~ err:', err);
      this.logger.warn('Failed to publish product deleted event');
    }
  }
}
