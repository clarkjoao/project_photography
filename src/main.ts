// import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from  'src/shared/exception/http-exception.filter.ts'
import { MongoExceptionFilter } from  'src/shared/exception/mongo-exception.filter'
import { ValidationPipe } from 'src/shared/validation.pipe'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  await app.listen(3000);
}
bootstrap();