import { PriceService } from './price.service';
import { LatestPriceResponseDto } from './dto/latest-price-response.dto';
export declare class PriceController {
    private readonly priceService;
    private readonly logger;
    constructor(priceService: PriceService);
    getLatest(): LatestPriceResponseDto;
}
