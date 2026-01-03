import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { isValidObjectId, Model } from 'mongoose';
import { rpcBadRequest, rpcNotFound } from '@app/rpc';
import { CreateProductDto, GetProductByIdDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createNewProduct(input: CreateProductDto) {
    const newlyCreatedProduct = await this.productModel.create({
      name: input.name,
      description: input.description,
      price: input.price,
      status: input.status ?? 'DRAFT',
      imageUrl: input.imageUrl ?? '',
      createdByClerkUserId: input.createdByClerkUserId,
    });

    return newlyCreatedProduct;
  }

  async listProducts() {
    return this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  async getProductById(input: GetProductByIdDto) {
    if (!isValidObjectId(input.id)) {
      rpcBadRequest('Invaid product ID');
    }

    const product = await this.productModel.findById(input.id).exec();

    if (!product) {
      rpcNotFound('Product is not present in DB');
    }

    return product;
  }
}
