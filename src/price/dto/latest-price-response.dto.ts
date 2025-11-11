import { ApiProperty } from '@nestjs/swagger';

export class LatestPriceResponseDto {
  @ApiProperty({
    example: 103543.0,
    description: 'Latest BTC/USD price from CoinGecko',
  })
  price: number;

  @ApiProperty({
    example: 103512.44,
    description: 'Mean of all prices from past 1 hour',
  })
  average_1h: number;

  @ApiProperty({
    example: 103478.1,
    description: 'Mean of all prices from past 6 hours',
  })
  average_6h: number;

  @ApiProperty({
    example: '2025-11-11T17:11:14Z',
    description: 'ISO timestamp of the latest record',
  })
  last_updated_utc: string;

  @ApiProperty({
    example: 120,
    description: 'Total number of records in the 6-hour window',
  })
  samples: number;
}
