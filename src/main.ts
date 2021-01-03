// import { ValidationPipe } from '@nestjs/common';
import { ValidationPipe } from 'src/shared/validation.pipe'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();