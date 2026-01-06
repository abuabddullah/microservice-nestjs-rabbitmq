import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { UserContext } from '../auth/auth.types';
import { mapRpcErrorToHttp } from '@app/rpc';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProductStatus } from 'apps/catalog/src/products/product.schema';
import { Public } from '../auth/decorators/public.decorator';
import { AdminOnly } from '../auth/decorators/admin.decorator';

type TProduct = {
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
  ) {}

  //   media and image logic later placeholder
  @Post('products')
  @AdminOnly()
  async createProduct(
    @CurrentUser() user: UserContext,
    @Body()
    body: Partial<TProduct>,
  ) {
    let product: TProduct;

    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl: body.imageUrl ?? '',
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
