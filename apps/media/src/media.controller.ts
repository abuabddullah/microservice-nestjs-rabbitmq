import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AttachToProductDto, UploadProductImageDto } from './media.dto';
import type { TProductDeletedEvent } from 'apps/catalog/src/events/product.events';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('media.uploadProductImage')
  uploadProductImage(@Payload() payload: UploadProductImageDto) {
    return this.mediaService.uploadProductImage(payload);
  }

  @MessagePattern('media.attachToProduct')
  attachToProduct(@Payload() payload: AttachToProductDto) {
    return this.mediaService.attachToProduct(payload);
  }

  @EventPattern('product.deleted')
  async onProductDeleted(@Payload() payload: TProductDeletedEvent) {
    await this.mediaService.deleteMediaOnProductDelete({
      productId: payload.productId,
    });
  }

  @Get()
  getHello(): string {
    return this.mediaService.getHello();
  }

  @MessagePattern('service.ping')
  ping() {
    return this.mediaService.ping();
  }
}
