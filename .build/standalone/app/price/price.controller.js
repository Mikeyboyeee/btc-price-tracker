"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PriceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const price_service_1 = require("./price.service");
const latest_price_response_dto_1 = require("./dto/latest-price-response.dto");
let PriceController = PriceController_1 = class PriceController {
    priceService;
    logger = new common_1.Logger(PriceController_1.name);
    constructor(priceService) {
        this.priceService = priceService;
    }
    getLatest() {
        this.logger.debug('GET /latest endpoint called');
        const data = this.priceService.getLatestData();
        if (!data) {
            this.logger.warn('No data available - returning 503');
            throw new common_1.ServiceUnavailableException('No data available yet');
        }
        return data;
    }
};
exports.PriceController = PriceController;
__decorate([
    (0, common_1.Get)('latest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get latest Bitcoin price with moving averages',
        description: 'Returns the latest BTC/USD price along with 1-hour and 6-hour moving averages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved price data',
        type: latest_price_response_dto_1.LatestPriceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Service unavailable - no data available yet',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", latest_price_response_dto_1.LatestPriceResponseDto)
], PriceController.prototype, "getLatest", null);
exports.PriceController = PriceController = PriceController_1 = __decorate([
    (0, swagger_1.ApiTags)('Bitcoin Price'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [price_service_1.PriceService])
], PriceController);
//# sourceMappingURL=price.controller.js.map