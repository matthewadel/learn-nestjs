import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  app.use(helmet());

  const swagger = new DocumentBuilder()
    .setTitle('Mis APIs')
    .setDescription('my apis descrition')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .build();
  const dicumentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, dicumentation);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap', err);
});
