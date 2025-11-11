import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceController } from './price/price.controller';
import { PriceService } from './price/price.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [PriceController],
  providers: [PriceService],
})
export class AppModule {}
