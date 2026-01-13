import { Injectable } from '@nestjs/common';
import { initCloudinary } from './cloudinary/cloudinary.client';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from './media.schema';
import { Model } from 'mongoose';
import { rpcBadRequest, rpcNotFound } from '@app/rpc';
import { UploadApiResponse } from 'cloudinary';
import { UploadProductImageDto } from './media.dto';
import type { TProductDeletedEvent } from 'apps/catalog/src/events/product.events';

@Injectable()
export class MediaService {
  private readonly cloudinary = initCloudinary();

  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async uploadProductImage(input: UploadProductImageDto) {
    if (!input.base64) {
      rpcBadRequest('Image base64 is needed');
    }

    if (!input.mimeType.startsWith('image/')) {
      rpcBadRequest('Only images are allowed');
    }

    const buffer = Buffer.from(input.base64, 'base64');

    if (!buffer.length) {
      rpcBadRequest('Invalid image data');
    }

    const uploadResult = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'nestjs-microservice/products',
            resource_type: 'image',
          },
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(result);
          },
        );

        stream.end(buffer);
      },
    );

    const url = uploadResult?.secure_url || uploadResult?.url;
    const publicId = uploadResult?.public_id;

    if (!url || !publicId) {
      rpcBadRequest('Cloudinary upload did not return proper response!');
    }

    const mediaDoc = await this.mediaModel.create({
      url,
      publicId,
      uploadByUserId: input.uploadByUserId,
      productId: undefined,
    });

    return {
      mediaId: String(mediaDoc._id),
      url,
      publicId,
    };
  }

  async attachToProduct(input: { mediaId: string; productId: string }) {
    const updated = await this.mediaModel
      .findByIdAndUpdate(
        input.mediaId,
        {
          $set: {
            productId: input.productId,
          },
        },
        {
          new: true,
        },
      )
      .exec();

    if (!updated) {
      rpcNotFound('media not found');
    }

    return {
      mediaId: String(updated._id),
      productId: updated.productId,
      url: updated.url,
      publicId: updated.publicId,
    };
  }

  async deleteMediaOnProductDelete(input: TProductDeletedEvent) {
    try {
      const deletedMedia = await this.mediaModel.findOneAndDelete({
        productId: input.productId,
      });
      if (deletedMedia?.publicId) {
        await this.cloudinary.uploader.destroy(deletedMedia.publicId);
      }
    } catch (err) {
      console.log(err);
    }

    console.log('Media doc deleted as soon as product is deleted');
  }

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toISOString(),
    };
  }
}
