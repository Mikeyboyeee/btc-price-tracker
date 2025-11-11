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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestPriceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class LatestPriceResponseDto {
    price;
    average_1h;
    average_6h;
    last_updated_utc;
    samples;
}
exports.LatestPriceResponseDto = LatestPriceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 103543.0,
        description: 'Latest BTC/USD price from CoinGecko',
    }),
    __metadata("design:type", Number)
], LatestPriceResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 103512.44,
        description: 'Mean of all prices from past 1 hour',
    }),
    __metadata("design:type", Number)
], LatestPriceResponseDto.prototype, "average_1h", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 103478.1,
        description: 'Mean of all prices from past 6 hours',
    }),
    __metadata("design:type", Number)
], LatestPriceResponseDto.prototype, "average_6h", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-11-11T17:11:14Z',
        description: 'ISO timestamp of the latest record',
    }),
    __metadata("design:type", String)
], LatestPriceResponseDto.prototype, "last_updated_utc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 120,
        description: 'Total number of records in the 6-hour window',
    }),
    __metadata("design:type", Number)
], LatestPriceResponseDto.prototype, "samples", void 0);
//# sourceMappingURL=latest-price-response.dto.js.map