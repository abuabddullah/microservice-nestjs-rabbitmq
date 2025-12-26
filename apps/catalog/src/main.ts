import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CatalogModule } from './catalog.module';

async function bootstrap() {
  process.title = 'catalog';

  const logger = new Logger('CatalogBootstrap');

  const port = process.env.CATALOG_TCP_PORT
    ? parseInt(process.env.CATALOG_TCP_PORT, 10)
    : 4011;

  //create an microservices instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
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

  logger.log(`Catalog Microservice [TCP] listening on port ${port}`);
}

bootstrap();
