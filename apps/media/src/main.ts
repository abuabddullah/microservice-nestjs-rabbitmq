import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MediaModule } from './media.module';

async function bootstrap() {
  process.title = 'media';

  const logger = new Logger('MediaBootstrap');

  const port = process.env.MEDIA_TCP_PORT
    ? parseInt(process.env.MEDIA_TCP_PORT, 10)
    : 4013;

  //create an microservices instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port,
      },
    },
  );

  app.enableShutdownHooks();

  await app.listen();

  logger.log(`Media Microservice [TCP] listening on port ${port}`);
}

bootstrap();
