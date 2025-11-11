"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PriceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let PriceService = PriceService_1 = class PriceService {
    logger = new common_1.Logger(PriceService_1.name);
    records = [];
    dataFilePath = path.join(process.cwd(), 'btc_data.json');
    COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
    SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    ONE_HOUR_MS = 1 * 60 * 60 * 1000;
    async onModuleInit() {
        this.logger.log('Initializing Price Service...');
        await this.loadDataFromFile();
        await this.fetchBitcoinPrice();
    }
    async loadDataFromFile() {
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
            const data = JSON.parse(fileContent);
            const now = Date.now();
            this.records = data.filter((record) => {
                const recordTime = new Date(record.time).getTime();
                return now - recordTime <= this.SIX_HOURS_MS;
            });
            this.logger.log(`Loaded ${this.records.length} valid records from ${this.dataFilePath}`);
        }
        catch (error) {
            this.logger.error(`Failed to load data from file: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            this.records = [];
        }
    }
    async saveDataToFile() {
        try {
            await fs.writeFile(this.dataFilePath, JSON.stringify(this.records, null, 2), 'utf-8');
            this.logger.debug(`Saved ${this.records.length} records to file`);
        }
        catch (error) {
            this.logger.error(`Failed to save data to file: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
        }
    }
    async fetchBitcoinPrice() {
        this.logger.log('Fetching Bitcoin price from CoinGecko...');
        try {
            const response = await axios_1.default.get(this.COINGECKO_URL, {
                timeout: 10000,
            });
            const price = response.data?.bitcoin?.usd;
            if (typeof price !== 'number' || isNaN(price)) {
                throw new Error('Invalid price data received from CoinGecko');
            }
            const now = new Date().toISOString();
            const newRecord = { time: now, price };
            this.records.push(newRecord);
            const cutoffTime = Date.now() - this.SIX_HOURS_MS;
            this.records = this.records.filter((record) => {
                const recordTime = new Date(record.time).getTime();
                return recordTime > cutoffTime;
            });
            this.logger.log(`Successfully fetched price: $${price.toFixed(2)} | Total records: ${this.records.length}`);
            await this.saveDataToFile();
        }
        catch (error) {
            this.logger.error(`Failed to fetch Bitcoin price: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
        }
    }
    getLatestData() {
        if (this.records.length === 0) {
            return null;
        }
        const latestRecord = this.records[this.records.length - 1];
        const now = Date.now();
        const oneHourAgo = now - this.ONE_HOUR_MS;
        const oneHourRecords = this.records.filter((record) => {
            const recordTime = new Date(record.time).getTime();
            return recordTime >= oneHourAgo;
        });
        const average_1h = oneHourRecords.length > 0
            ? oneHourRecords.reduce((sum, r) => sum + r.price, 0) /
                oneHourRecords.length
            : latestRecord.price;
        const average_6h = this.records.reduce((sum, r) => sum + r.price, 0) / this.records.length;
        return {
            price: latestRecord.price,
            average_1h: parseFloat(average_1h.toFixed(2)),
            average_6h: parseFloat(average_6h.toFixed(2)),
            last_updated_utc: latestRecord.time,
            samples: this.records.length,
        };
    }
    isDataRecent() {
        if (this.records.length === 0) {
            return false;
        }
        const latestRecord = this.records[this.records.length - 1];
        const latestTime = new Date(latestRecord.time).getTime();
        const now = Date.now();
        const sixMinutes = 6 * 60 * 1000;
        return now - latestTime < sixMinutes;
    }
};
exports.PriceService = PriceService;
__decorate([
    (0, schedule_1.Cron)('*/3 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceService.prototype, "fetchBitcoinPrice", null);
exports.PriceService = PriceService = PriceService_1 = __decorate([
    (0, common_1.Injectable)()
], PriceService);
//# sourceMappingURL=price.service.js.map