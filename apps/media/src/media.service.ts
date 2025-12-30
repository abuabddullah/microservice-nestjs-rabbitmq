import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  getHello(): string {
    return 'Hello World!';
  }

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toISOString(),
    };
  }
}
