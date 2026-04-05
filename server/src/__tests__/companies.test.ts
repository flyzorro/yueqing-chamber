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
      findUnique: jest.fn(),
    },
    member: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    registration: {
      count: jest.fn(),
    },
    companyProduct: {
      findMany: jest.fn(),
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
          phone: '13800139001',
          address: '乐清市总部经济园',
          logo: 'https://example.com/logo.png',
          status: 'active',
          createdat: new Date(),
          updatedat: new Date(),
        },
        {
          id: 'company-2',
          name: '乐清制造集团',
          industry: '智能制造',
          contactName: '王小明',
          phone: '13800139002',
          address: '乐清市经济开发区',
          logo: 'https://example.com/logo2.png',
          status: 'active',
          createdat: new Date(),
          updatedat: new Date(),
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
          orderBy: { createdat: 'desc' },
        })
      );
    });

    it('should support keyword, status and industry filters', async () => {
      const mockCompanies = [{ id: '1', name: '月清科技', industry: '科技服务', status: 'active' }];

      (prisma.company.findMany as jest.Mock).mockResolvedValue(mockCompanies);
      (prisma.company.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get(
        '/api/companies?page=1&limit=10&keyword=科技&status=active&industry=科技服务'
      );

      expect(response.status).toBe(200);
      expect(response.body.filters).toEqual({ keyword: '科技', status: 'active', industry: '科技服务' });
      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'active',
            industry: '科技服务',
            OR: expect.any(Array),
          }),
        })
      );
    });

    it('should fall back to empty result when prisma table is missing and fixtures are empty', async () => {
      const prismaError = new Error('The table public.Company does not exist') as Error & { code?: string };
      prismaError.code = 'P2021';

      (prisma.company.findMany as jest.Mock).mockRejectedValue(prismaError);
      (prisma.company.count as jest.Mock).mockRejectedValue(prismaError);

      const response = await request(app).get('/api/companies?page=1&limit=10&keyword=科技&status=active');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
      expect(response.body.filters).toEqual({ keyword: '科技', status: 'active', industry: 'all' });
    });

    it('should return 500 on unexpected database error', async () => {
      (prisma.company.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/companies');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取企业列表失败');
    });
  });

  describe('GET /api/companies/:id/products', () => {
    const mockCompany = {
      id: 'company-1',
      name: '测试公司',
      industry: '科技',
      contactName: '张三',
      phone: '13800138000',
      address: '杭州',
      logo: null,
      status: 'active',
      summary: null,
      createdat: new Date(),
      updatedat: new Date(),
    };

    it('should return product list for existing company', async () => {
      const mockProducts = [
        { id: 'p1', companyId: 'company-1', seedKey: 'product-a', name: '产品A', description: '描述A', imageUrl: null, sortOrder: 0, createdat: new Date(), updatedat: new Date() },
        { id: 'p2', companyId: 'company-1', seedKey: 'product-b', name: '产品B', description: '描述B', imageUrl: 'https://x.com/b.jpg', sortOrder: 1, createdat: new Date(), updatedat: new Date() },
      ];

      (prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany);
      (prisma.member.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.companyProduct.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/companies/company-1/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toEqual({ id: 'p1', name: '产品A', description: '描述A', imageUrl: null });
      expect(response.body.data[1].imageUrl).toBe('https://x.com/b.jpg');
      expect(prisma.companyProduct.findMany).toHaveBeenCalledWith({
        where: { companyId: 'company-1' },
        orderBy: [{ sortOrder: 'asc' }, { createdat: 'desc' }],
      });
    });

    it('should return empty array when company has no products', async () => {
      (prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany);
      (prisma.member.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.companyProduct.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/companies/company-1/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return 404 when company not found', async () => {
      (prisma.company.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.member.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/companies/nonexistent/products');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('企业不存在');
    });

    it('should return 500 on database error', async () => {
      (prisma.company.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/companies/company-1/products');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取产品列表失败');
    });
  });

  describe('GET /api/companies/industries', () => {
    it('should return list of industries', async () => {
      const mockIndustries = ['科技服务', '智能制造', '商贸服务'];

      (prisma.company.findMany as jest.Mock).mockResolvedValue(
        mockIndustries.map((industry) => ({ industry }))
      );

      const response = await request(app).get('/api/companies/industries');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockIndustries);
    });

    it('should return 500 on database error', async () => {
      (prisma.company.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/companies/industries');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取行业分类失败');
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
    const mockCompanies = [{ id: 'company-1', name: '月清科技', industry: '科技服务' }];

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

  it('should fall back to empty result when prisma company table is unavailable and fixtures are empty', async () => {
    const prismaError = new Error('The table public.Company does not exist') as Error & { code?: string };
    prismaError.code = 'P2021';

    (prisma.company.findMany as jest.Mock).mockRejectedValue(prismaError);
    (prisma.company.count as jest.Mock).mockRejectedValue(prismaError);

    const result = await store.getPaginated({ page: 1, limit: 10, keyword: '科技', status: 'active' });

    expect(result.total).toBe(0);
    expect(result.data).toEqual([]);
  });

  it('should return industries list from prisma', async () => {
    const mockIndustries = [{ industry: '科技服务' }, { industry: '智能制造' }];

    (prisma.company.findMany as jest.Mock).mockResolvedValue(mockIndustries);

    const result = await store.getIndustries();

    expect(result).toEqual(['科技服务', '智能制造']);
    expect(prisma.company.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: { industry: true },
        distinct: ['industry'],
      })
    );
  });

  it('should fall back to empty industries when prisma unavailable and fixtures are empty', async () => {
    const prismaError = new Error('The table public.Company does not exist') as Error & { code?: string };
    prismaError.code = 'P2021';

    (prisma.company.findMany as jest.Mock).mockRejectedValue(prismaError);

    const result = await store.getIndustries();

    // Fixtures are empty — expect empty list, not fallback fixture data
    expect(result).toEqual([]);
  });
});
