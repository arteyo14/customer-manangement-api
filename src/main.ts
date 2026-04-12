import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const formattedErrors: Record<string, string> = {};

      errors.forEach(err => {
        formattedErrors[err.property] = err.constraints
          ? Object.values(err.constraints)[0]
          : 'Validation failed';
      });

      return new BadRequestException(formattedErrors);
    },
  }));

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
