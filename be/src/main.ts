import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API for managing movies, directors, and genres')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
