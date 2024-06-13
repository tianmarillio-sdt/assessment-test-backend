import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // TODO: config module
  // TODO: package.json scripts

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Assessment Test - Backend Developer')
    .setVersion('1.0')
    .addTag('users')
    .addTag('locations')
    .addTag('messages')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // FIXME: port to env
  await app.listen(3000, () => {
    console.log('Listening to port: 3000');
  });
}
bootstrap();
