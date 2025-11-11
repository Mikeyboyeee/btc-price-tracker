import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

interface PriceRecord {
  time: string; // ISO string
  price: number;
}

@Injectable()
export class PriceService implements OnModuleInit {
  private readonly logger = new Logger(PriceService.name);
  private records: PriceRecord[] = [];
  private readonly dataFilePath = path.join(process.cwd(), 'btc_data.json');
  private readonly COINGECKO_URL =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
  private readonly SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  private readonly ONE_HOUR_MS = 1 * 60 * 60 * 1000;

  async onModuleInit() {
    this.logger.log('Initializing Price Service...');
    await this.loadDataFromFile();
    // Fetch immediately on startup
    await this.fetchBitcoinPrice();
  }

  /**
   * Load existing data from btc_data.json and filter out stale records (> 6 hours old)
   */
  private async loadDataFromFile(): Promise<void> {
    try {
      const fileExists = await fs
        .access(this.dataFilePath)
        .then(() => true)
        .catch(() => false);

      if (!fileExists) {
        this.logger.log('No existing data file found. Starting fresh.');
        return;
      }

      const fileContent = await fs.readFile(this.dataFilePath, 'utf-8');
      const data = JSON.parse(fileContent) as PriceRecord[];

      // Filter out stale records (older than 6 hours)
      const now = Date.now();
      this.records = data.filter((record) => {
        const recordTime = new Date(record.time).getTime();
        return now - recordTime <= this.SIX_HOURS_MS;
      });

      this.logger.log(
        `Loaded ${this.records.length} valid records from ${this.dataFilePath}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to load data from file: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      this.records = [];
    }
  }

  /**
   * Save current records to btc_data.json
   */
  private async saveDataToFile(): Promise<void> {
    try {
      await fs.writeFile(
        this.dataFilePath,
        JSON.stringify(this.records, null, 2),
        'utf-8',
      );
      this.logger.debug(`Saved ${this.records.length} records to file`);
    } catch (error) {
      this.logger.error(
        `Failed to save data to file: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  /**
   * Scheduled task: Fetch Bitcoin price every 3 minutes
   */
  @Cron('*/3 * * * *')
  async fetchBitcoinPrice(): Promise<void> {
    this.logger.log('Fetching Bitcoin price from CoinGecko...');

    try {
      const response = await axios.get<{
        bitcoin?: { usd?: number };
      }>(this.COINGECKO_URL, {
        timeout: 10000,
      });

      const price = response.data?.bitcoin?.usd;

      if (typeof price !== 'number' || isNaN(price)) {
        throw new Error('Invalid price data received from CoinGecko');
      }

      const now = new Date().toISOString();
      const newRecord: PriceRecord = { time: now, price };

      // Add new record
      this.records.push(newRecord);

      // Remove records older than 6 hours
      const cutoffTime = Date.now() - this.SIX_HOURS_MS;
      this.records = this.records.filter((record) => {
        const recordTime = new Date(record.time).getTime();
        return recordTime > cutoffTime;
      });

      this.logger.log(
        `Successfully fetched price: $${price.toFixed(2)} | Total records: ${this.records.length}`,
      );

      // Persist to file
      await this.saveDataToFile();
    } catch (error) {
      this.logger.error(
        `Failed to fetch Bitcoin price: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      // Continue serving last known data
    }
  }

  /**
   * Get the latest price data with computed averages
   */
  getLatestData(): {
    price: number;
    average_1h: number;
    average_6h: number;
    last_updated_utc: string;
    samples: number;
  } | null {
    if (this.records.length === 0) {
      return null;
    }

    const latestRecord = this.records[this.records.length - 1];
    const now = Date.now();

    // Calculate 1-hour average
    const oneHourAgo = now - this.ONE_HOUR_MS;
    const oneHourRecords = this.records.filter((record) => {
      const recordTime = new Date(record.time).getTime();
      return recordTime >= oneHourAgo;
    });

    const average_1h =
      oneHourRecords.length > 0
        ? oneHourRecords.reduce((sum, r) => sum + r.price, 0) /
          oneHourRecords.length
        : latestRecord.price;

    // Calculate 6-hour average
    const average_6h =
      this.records.reduce((sum, r) => sum + r.price, 0) / this.records.length;

    return {
      price: latestRecord.price,
      average_1h: parseFloat(average_1h.toFixed(2)),
      average_6h: parseFloat(average_6h.toFixed(2)),
      last_updated_utc: latestRecord.time,
      samples: this.records.length,
    };
  }

  /**
   * Check if data is recent (last update < 6 minutes ago)
   */
  isDataRecent(): boolean {
    if (this.records.length === 0) {
      return false;
    }

    const latestRecord = this.records[this.records.length - 1];
    const latestTime = new Date(latestRecord.time).getTime();
    const now = Date.now();
    const sixMinutes = 6 * 60 * 1000;

    return now - latestTime < sixMinutes;
  }
}
