import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  getHello(): string {
    return 'Hello World!';
  }

  ping() {
    return {
      ok: true,
      service: 'search',
      now: new Date().toISOString(),
    };
  }
}
