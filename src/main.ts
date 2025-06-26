import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Interceptor } from './utils/interceptors/interceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new Interceptor());

  const config = new DocumentBuilder()
    .setTitle("Manag'Event API")
    .setDescription(
      "API de gestion d'événements et de bénévoles pour le milieu associatif",
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apiDoc', app, document);

  // Configuration CORS pour autoriser le frontend Netlify
  app.enableCors({
    origin: [
      'https://managevent.netlify.app',
      'http://localhost:3000', // Pour le développement local
      'http://localhost:5173', // Pour Vite en développement
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'Origin',
    ],
    credentials: true, // Pour permettre l'envoi de cookies et headers d'authentification
  });

  await app.listen(process.env.PORT);
  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
