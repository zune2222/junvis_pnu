import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://junvis-pnu-web.vercel.app',
      ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // 정적 파일 서빙 설정
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/api/photos/',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 API Server running on http://localhost:${port}/api`);
}
bootstrap();
