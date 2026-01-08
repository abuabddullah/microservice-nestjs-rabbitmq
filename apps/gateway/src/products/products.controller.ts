import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { UserContext } from '../auth/auth.types';
import { mapRpcErrorToHttp } from '@app/rpc';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProductStatus } from 'apps/catalog/src/products/product.schema';
import { Public } from '../auth/decorators/public.decorator';
import { AdminOnly } from '../auth/decorators/admin.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

export type TProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  imageUrl: string | undefined;
  createdByClerkUserId: string | undefined;
};

@Controller()
export class ProductsHttpController {
  constructor(
    // gateway talks to catalog via RMQ client
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,

    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  //   media and image logic later placeholder
  @Post('products')
  @AdminOnly()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fieldSize: 5 * 1024 * 1024,
      },
    }),
  )
  async createProduct(
    @CurrentUser() user: UserContext,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body()
    body: Partial<TProduct>,
  ) {
    // do the basic validation -> just for practice

    let imageUrl: string | undefined = undefined;
    let mediaId: string | undefined = undefined;

    if (file) {
      const base64 = file.buffer.toString('base64');

      try {
        const uploadResult = await firstValueFrom(
          this.mediaClient.send('media.uploadProductImage', {
            fileName: file.originalname,
            mimeType: file.mimetype,
            base64,
            uploadByUserId: user.clerkUserId,
          }),
        );

        imageUrl = uploadResult.url;
        mediaId = uploadResult.mediaId;
      } catch (error) {
        mapRpcErrorToHttp(error);
      }
    }

    let product: TProduct;

    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl,
      createdByClerkUserId: user.clerkUserId,
    };

    // RMQ request and response pattern

    try {
      product = await firstValueFrom(
        this.catalogClient.send('product.create', payload),
      );
    } catch (err) {
      mapRpcErrorToHttp(err);
    }

    if (mediaId) {
      try {
        await firstValueFrom(
          this.mediaClient.send('media.attachToProduct', {
            mediaId,
            productId: String(product._id),
            attachedByUserId: user.clerkUserId,
          }),
        );
      } catch (err) {
        mapRpcErrorToHttp(err);
      }
    }

    return product;
  }

  @Get('products')
  @Public()
  async listProducts() {
    try {
      return await firstValueFrom(this.catalogClient.send('product.list', {}));
    } catch (err) {
      mapRpcErrorToHttp(err);
    }
  }

  @Get('products/:id')
  @Public()
  async getProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.catalogClient.send('product.getById', { id }),
      );
    } catch (err) {
      mapRpcErrorToHttp(err);
    }
  }
}
