import request from 'supertest';
import express from 'express';
import companiesRouter from '../routes/companies';
import membersRouter from '../routes/members';
import prisma from '../lib/prisma';
import { CompanyStore } from '../models/Company';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    company: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
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
app.use('/api/companies', companiesRouter);
app.use('/api/members', membersRouter);

describe('Companies API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/companies', () => {
    it('should return paginated companies', async () => {
      const mockCompanies = [
        {
          id: 'company-1',
          name: '月清科技',
          industry: '科技服务',
          contactName: '张恺毅',
          contactPhone: '13800139001',
          summary: '数字化服务',
          status: 'active',
          sortorder: 1,
        },
        {
          id: 'company-2',
          name: '乐清制造集团',
          industry: '智能制造',
          contactName: '王小明',
          contactPhone: '13800139002',
          summary: '工业制造',
          status: 'active',
          sortorder: 2,
        },
      ];

      (prisma.company.findMany as jest.Mock).mockResolvedValue(mockCompanies);
      (prisma.company.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get('/api/companies?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('月清科技');
      expect(response.body.pagination.total).toBe(2);
      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ sortorder: 'asc' }, { createdat: 'desc' }],
        })
      );
    });

    it('should support keyword and status filters', async () => {
      const mockCompanies = [{ id: '1', name: '月清科技', industry: '科技服务', status: 'active' }];

      (prisma.company.findMany as jest.Mock).mockResolvedValue(mockCompanies);
      (prisma.company.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get(
        '/api/companies?page=1&limit=10&keyword=科技&status=active'
      );

      expect(response.status).toBe(200);
      expect(response.body.filters).toEqual({ keyword: '科技', status: 'active' });
      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'active',
            OR: expect.any(Array),
          }),
        })
      );
    });

    it('should fall back to fixture companies when prisma table is missing', async () => {
      const prismaError = new Error('The table public.Company does not exist') as Error & { code?: string };
      prismaError.code = 'P2021';

      (prisma.company.findMany as jest.Mock).mockRejectedValue(prismaError);
      (prisma.company.count as jest.Mock).mockRejectedValue(prismaError);

      const response = await request(app).get('/api/companies?page=1&limit=10&keyword=科技&status=active');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain('科技');
      expect(response.body.filters).toEqual({ keyword: '科技', status: 'active' });
    });

    it('should return 500 on unexpected database error', async () => {
      (prisma.company.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/companies');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取企业名录失败');
    });
  });
});

describe('CompanyStore', () => {
  let store: CompanyStore;

  beforeEach(() => {
    store = new CompanyStore();
    jest.clearAllMocks();
  });

  it('should return paginated company data from prisma', async () => {
    const mockCompanies = [{ id: 'company-1', name: '月清科技', industry: '科技服务', sortorder: 1 }];

    (prisma.company.findMany as jest.Mock).mockResolvedValue(mockCompanies);
    (prisma.company.count as jest.Mock).mockResolvedValue(1);

    const result = await store.getPaginated({ page: 1, limit: 10, keyword: '科技', status: 'active' });

    expect(result.data).toEqual(mockCompanies);
    expect(result.total).toBe(1);
    expect(prisma.company.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'active',
          OR: expect.any(Array),
        }),
      })
    );
  });

  it('should use fixture data fallback when prisma company table is unavailable', async () => {
    const prismaError = new Error('The table public.Company does not exist') as Error & { code?: string };
    prismaError.code = 'P2021';

    (prisma.company.findMany as jest.Mock).mockRejectedValue(prismaError);
    (prisma.company.count as jest.Mock).mockRejectedValue(prismaError);

    const result = await store.getPaginated({ page: 1, limit: 10, keyword: '科技', status: 'active' });

    expect(result.total).toBeGreaterThan(0);
    expect(result.data[0].name).toContain('科技');
  });

  it('should sort fixture data by sortorder', async () => {
    const prismaError = new Error('The table public.Company does not exist') as Error & { code?: string };
    prismaError.code = 'P2021';

    (prisma.company.findMany as jest.Mock).mockRejectedValue(prismaError);
    (prisma.company.count as jest.Mock).mockRejectedValue(prismaError);

    const result = await store.getPaginated({ page: 1, limit: 10 });

    expect(result.data.map((company) => company.sortorder)).toEqual([1, 2, 3, 4]);
  });
});
