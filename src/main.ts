import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './utils/setupSwagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for public access
  app.enableCors();

  // Setup Swagger documentation
  setupSwagger(app);

  // Get port from environment or default to 8080
  const port = process.env.PORT || 8080;

  await app.listen(port);
  logger.log(`🚀 Bitcoin Price Service is running on port ${port}`);
  logger.log(
    `📚 Swagger documentation available at http://localhost:${port}/api-docs`,
  );
}

void bootstrap();
