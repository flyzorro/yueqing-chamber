import request from 'supertest';
import express from 'express';
import companyDirectoryRouter from '../routes/companyDirectory';
import prisma from '../lib/prisma';
import { CompanyDirectoryStore } from '../models/CompanyDirectory';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    member: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    registration: {
      count: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use('/api/company-directory', companyDirectoryRouter);

describe('Company Directory API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/company-directory', () => {
    it('should return aggregated companies with deterministic ordering and pagination', async () => {
      (prisma.member.findMany as jest.Mock).mockResolvedValue([
        { company: 'Beta Labs' },
        { company: 'Acme Co' },
        { company: 'Acme Co' },
        { company: 'Zenith Group' },
      ]);

      const response = await request(app).get('/api/company-directory?page=1&limit=2');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([
        { name: 'Acme Co', memberCount: 2 },
        { name: 'Beta Labs', memberCount: 1 },
      ]);
      expect(response.body.pagination).toEqual({
        total: 3,
        page: 1,
        limit: 2,
        totalPages: 2,
      });
      expect(response.body.filters).toEqual({ keyword: '' });
    });

    it('should support keyword filtering', async () => {
      (prisma.member.findMany as jest.Mock).mockResolvedValue([
        { company: '月清科技' },
        { company: '乐清制造集团' },
        { company: '月清科技' },
      ]);

      const response = await request(app).get('/api/company-directory?page=1&limit=10&keyword=月清');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([{ name: '月清科技', memberCount: 2 }]);
      expect(response.body.pagination.total).toBe(1);
      expect(response.body.filters).toEqual({ keyword: '月清' });
    });

    it('should fall back to fixture data when prisma member access is unavailable', async () => {
      const prismaError = new Error('The table public.Member does not exist') as Error & { code?: string };
      prismaError.code = 'P2021';

      (prisma.member.findMany as jest.Mock).mockRejectedValue(prismaError);

      const response = await request(app).get('/api/company-directory?page=1&limit=5&keyword=科技');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([{ name: '月清科技', memberCount: 1 }]);
      expect(response.body.pagination.total).toBe(1);
    });

    it('should return 500 when prisma fails without matching fallback conditions', async () => {
      (prisma.member.findMany as jest.Mock).mockRejectedValue(new Error('Unexpected database error'));

      const response = await request(app).get('/api/company-directory');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取企业名录失败');
    });
  });
});

describe('CompanyDirectoryStore', () => {
  let store: CompanyDirectoryStore;

  beforeEach(() => {
    store = new CompanyDirectoryStore();
    jest.clearAllMocks();
  });

  it('should aggregate unique company names and ignore blank company values', async () => {
    (prisma.member.findMany as jest.Mock).mockResolvedValue([
      { company: 'Acme Co' },
      { company: ' Acme Co ' },
      { company: 'Beta Labs' },
      { company: '' },
      { company: '   ' },
    ]);

    const result = await store.getPaginated({ page: 1, limit: 10 });

    expect(result).toEqual({
      data: [
        { name: 'Acme Co', memberCount: 2 },
        { name: 'Beta Labs', memberCount: 1 },
      ],
      total: 2,
      page: 1,
      limit: 10,
    });
  });

  it('should paginate filtered company results deterministically', async () => {
    (prisma.member.findMany as jest.Mock).mockResolvedValue([
      { company: 'Gamma Tech' },
      { company: 'Acme Tech' },
      { company: 'Beta Tech' },
      { company: 'Delta Foods' },
    ]);

    const result = await store.getPaginated({ page: 2, limit: 1, keyword: 'tech' });

    expect(result).toEqual({
      data: [{ name: 'Beta Tech', memberCount: 1 }],
      total: 3,
      page: 2,
      limit: 1,
    });
  });

  it('should use fixture-backed aggregation in non-production fallback scenarios', async () => {
    const prismaError = new Error("Can't reach database server") as Error & { code?: string };

    (prisma.member.findMany as jest.Mock).mockRejectedValue(prismaError);

    const result = await store.getPaginated({ page: 1, limit: 20, keyword: '集团' });

    expect(result.data).toEqual([{ name: '乐清制造集团', memberCount: 1 }]);
    expect(result.total).toBe(1);
  });
});
