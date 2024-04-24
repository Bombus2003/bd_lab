import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.setGlobalPrefix('api');

  const documentConfig = new DocumentBuilder()
    .setTitle('Laba api ')
    .setVersion('alpha')
    .build();

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, documentConfig),
  );

  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  await app.listen(3000, () => {
    console.log('Service start on http://localhost:3000/api');
    console.log('Swagger start on http://localhost:3000/docs');
  });
}
bootstrap();
