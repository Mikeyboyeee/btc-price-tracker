import {
  Controller,
  Get,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { LatestPriceResponseDto } from './dto/latest-price-response.dto';

@ApiTags('Bitcoin Price')
@Controller()
export class PriceController {
  private readonly logger = new Logger(PriceController.name);

  constructor(private readonly priceService: PriceService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Simple health check to verify service is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('latest')
  @ApiOperation({
    summary: 'Get latest Bitcoin price with moving averages',
    description:
      'Returns the latest BTC/USD price along with 1-hour and 6-hour moving averages',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved price data',
    type: LatestPriceResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable - no data available yet',
  })
  getLatest(): LatestPriceResponseDto {
    this.logger.debug('GET /latest endpoint called');

    const data = this.priceService.getLatestData();

    if (!data) {
      this.logger.warn('No data available - returning 503');
      throw new ServiceUnavailableException('No data available yet');
    }

    return data;
  }
}
