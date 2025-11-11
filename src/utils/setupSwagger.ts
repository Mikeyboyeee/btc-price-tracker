import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Bitcoin Price Tracker API')
    .setDescription(
      'A lightweight backend service that tracks Bitcoin (BTC/USD) prices from CoinGecko with 1-hour and 6-hour moving averages',
    )
    .setVersion('1.0')
    .addTag('Bitcoin Price')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
