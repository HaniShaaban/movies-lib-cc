import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error if unknown props are sent
      transform: true, // automatically transforms payloads to DTO types
      forbidUnknownValues: true, // ensures objects match the DTO
    }),
  );

  await app.listen(3000);
}
bootstrap();
