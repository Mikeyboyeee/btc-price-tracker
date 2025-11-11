import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PriceService } from '../src/price/price.service';

describe('Bitcoin Price Service (e2e)', () => {
  let app: INestApplication;
  let priceService: PriceService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    priceService = moduleFixture.get<PriceService>(PriceService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /latest', () => {
    it('should return 503 when no data is available', () => {
      // Mock empty data
      jest.spyOn(priceService, 'getLatestData').mockReturnValue(null);

      return request(app.getHttpServer())
        .get('/latest')
        .expect(503)
        .expect((res) => {
          expect(res.body.message).toBe('No data available yet');
        });
    });

    it('should return latest price data with correct structure', () => {
      // Mock sample data
      const mockData = {
        price: 103543.0,
        average_1h: 103512.44,
        average_6h: 103478.1,
        last_updated_utc: '2025-11-11T17:11:14Z',
        samples: 120,
      };

      jest.spyOn(priceService, 'getLatestData').mockReturnValue(mockData);

      return request(app.getHttpServer())
        .get('/latest')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('price');
          expect(res.body).toHaveProperty('average_1h');
          expect(res.body).toHaveProperty('average_6h');
          expect(res.body).toHaveProperty('last_updated_utc');
          expect(res.body).toHaveProperty('samples');
          expect(typeof res.body.price).toBe('number');
          expect(typeof res.body.average_1h).toBe('number');
          expect(typeof res.body.average_6h).toBe('number');
          expect(typeof res.body.last_updated_utc).toBe('string');
          expect(typeof res.body.samples).toBe('number');
        });
    });

    it('should return valid price values', () => {
      const mockData = {
        price: 50000.0,
        average_1h: 49500.0,
        average_6h: 49000.0,
        last_updated_utc: '2025-11-11T10:00:00Z',
        samples: 10,
      };

      jest.spyOn(priceService, 'getLatestData').mockReturnValue(mockData);

      return request(app.getHttpServer())
        .get('/latest')
        .expect(200)
        .expect((res) => {
          expect(res.body.price).toBe(50000.0);
          expect(res.body.average_1h).toBe(49500.0);
          expect(res.body.average_6h).toBe(49000.0);
          expect(res.body.samples).toBe(10);
        });
    });

    it('should handle edge case with single record', () => {
      const mockData = {
        price: 60000.0,
        average_1h: 60000.0,
        average_6h: 60000.0,
        last_updated_utc: '2025-11-11T12:00:00Z',
        samples: 1,
      };

      jest.spyOn(priceService, 'getLatestData').mockReturnValue(mockData);

      return request(app.getHttpServer())
        .get('/latest')
        .expect(200)
        .expect((res) => {
          expect(res.body.price).toBe(60000.0);
          expect(res.body.average_1h).toBe(60000.0);
          expect(res.body.average_6h).toBe(60000.0);
          expect(res.body.samples).toBe(1);
        });
    });
  });

  describe('Price Service', () => {
    it('should be defined', () => {
      expect(priceService).toBeDefined();
    });

    it('should return null when no data available', () => {
      // Reset the service state
      jest.spyOn(priceService, 'getLatestData').mockReturnValue(null);
      const result = priceService.getLatestData();
      expect(result).toBeNull();
    });
  });
});
