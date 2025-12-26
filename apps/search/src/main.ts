import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SearchModule } from './search.module';

async function bootstrap() {
  process.title = 'search';

  const logger = new Logger('SearchBootstrap');

  const port = process.env.SEARCH_TCP_PORT
    ? parseInt(process.env.SEARCH_TCP_PORT, 10)
    : 4014;

  //create an microservices instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
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

  logger.log(`Search Microservice [TCP] listening on port ${port}`);
}

bootstrap();
