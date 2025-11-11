"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const setupSwagger_1 = require("./utils/setupSwagger");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    (0, setupSwagger_1.setupSwagger)(app);
    const port = process.env.PORT || 8080;
    await app.listen(port);
    logger.log(`🚀 Bitcoin Price Service is running on port ${port}`);
    logger.log(`📚 Swagger documentation available at http://localhost:${port}/api-docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map