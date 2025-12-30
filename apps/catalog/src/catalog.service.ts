import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  getHello(): string {
    return 'Hello World!';
  }

  ping() {
    return {
      ok: true,
      service: 'catalog',
      now: new Date().toISOString(),
    };
  }
}
