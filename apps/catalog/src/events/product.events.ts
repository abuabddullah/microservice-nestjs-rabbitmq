// events will be public contracts between services
// small + stable

import { TProduct } from 'apps/gateway/src/products/products.controller';

export type TProductCreatedEvent = Omit<TProduct, '_id'> & {
  productId: string;
};
