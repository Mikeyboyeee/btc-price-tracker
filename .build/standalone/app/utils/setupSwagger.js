"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Bitcoin Price Tracker API')
        .setDescription('A lightweight backend service that tracks Bitcoin (BTC/USD) prices from CoinGecko with 1-hour and 6-hour moving averages')
        .setVersion('1.0')
        .addTag('Bitcoin Price')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
}
//# sourceMappingURL=setupSwagger.js.map