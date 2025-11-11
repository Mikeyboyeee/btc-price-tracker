import { OnModuleInit } from '@nestjs/common';
export declare class PriceService implements OnModuleInit {
    private readonly logger;
    private records;
    private readonly dataFilePath;
    private readonly COINGECKO_URL;
    private readonly SIX_HOURS_MS;
    private readonly ONE_HOUR_MS;
    onModuleInit(): Promise<void>;
    private loadDataFromFile;
    private saveDataToFile;
    fetchBitcoinPrice(): Promise<void>;
    getLatestData(): {
        price: number;
        average_1h: number;
        average_6h: number;
        last_updated_utc: string;
        samples: number;
    } | null;
    isDataRecent(): boolean;
}
