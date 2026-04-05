import request from 'supertest';
import express from 'express';

jest.mock('../services/companyFillQueue', () => ({
  enqueueCompanyFill: jest.fn(),
}));

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    company: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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

// Import router after mocks are set up
import companiesRouter from '../routes/companies';
import prisma from '../lib/prisma';
import { enqueueCompanyFill } from '../services/companyFillQueue';

// Import real functions for unit tests
const { parseCompanyPageText, buildBlocks } = jest.requireActual(
  '../services/companyFillService'
) as typeof import('../services/companyFillService');

const app = express();
app.use(express.json());
app.use('/api/companies', companiesRouter);

describe('POST /api/companies/auto-fill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/api/companies/auto-fill')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('企业名称不能为空');
  });

  it('should return 400 when name is empty string', async () => {
    const response = await request(app)
      .post('/api/companies/auto-fill')
      .send({ name: '   ' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('企业名称不能为空');
  });

  it('should create a company and enqueue auto-fill', async () => {
    const mockCompany = {
      id: 'company-new-1',
      name: '测试企业',
      industry: '科技',
      status: 'active',
      summary: null,
      createdat: new Date(),
      updatedat: new Date(),
    };

    (prisma.company.create as jest.Mock).mockResolvedValue(mockCompany);

    const response = await request(app)
      .post('/api/companies/auto-fill')
      .send({ name: '测试企业', industry: '科技' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('company-new-1');
    expect(response.body.data.name).toBe('测试企业');
    expect(response.body.data.industry).toBe('科技');
    expect(response.body.data.summary).toBeNull();
    expect(response.body.data.status).toBe('pending');
    expect(prisma.company.create).toHaveBeenCalledWith({
      data: { name: '测试企业', industry: '科技', status: 'active' },
    });
    expect(enqueueCompanyFill).toHaveBeenCalledWith({
      companyId: 'company-new-1',
      name: '测试企业',
      industry: '科技',
      attempt: 1,
    });
  });

  it('should create company without industry', async () => {
    const mockCompany = {
      id: 'company-new-2',
      name: '测试企业2',
      industry: null,
      status: 'active',
      summary: null,
    };

    (prisma.company.create as jest.Mock).mockResolvedValue(mockCompany);

    const response = await request(app)
      .post('/api/companies/auto-fill')
      .send({ name: '测试企业2' });

    expect(response.status).toBe(200);
    expect(response.body.data.industry).toBeNull();
    expect(enqueueCompanyFill).toHaveBeenCalledWith({
      companyId: 'company-new-2',
      name: '测试企业2',
      industry: undefined,
      attempt: 1,
    });
  });

  it('should return 500 on database error', async () => {
    (prisma.company.create as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/api/companies/auto-fill')
      .send({ name: '测试企业' });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('创建企业失败');
  });
});

describe('parseCompanyPageText', () => {
  it('should extract meta description and ogImage', () => {
    const raw =
      '__META__: description=这是企业简介|ogImage=https://example.com/logo.jpg\n\n正文内容在这里';
    const result = parseCompanyPageText(raw);
    expect(result.description).toBe('这是企业简介');
    expect(result.imageUrl).toBe('https://example.com/logo.jpg');
  });

  it('should fall back to plain text when no meta', () => {
    const raw = '这是企业的一些介绍文字';
    const result = parseCompanyPageText(raw);
    expect(result.description).toContain('这是企业的一些介绍文字');
    expect(result.imageUrl).toBeNull();
  });

  it('should truncate long descriptions at 500 chars', () => {
    const raw = '__META__: description=|ogImage=\n' + 'x'.repeat(600);
    const result = parseCompanyPageText(raw);
    expect(result.description.length).toBeLessThanOrEqual(500);
  });
});

describe('buildBlocks', () => {
  it('should build heading + paragraph blocks', () => {
    const blocks = buildBlocks({ description: '企业简介内容', imageUrl: null });
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toEqual({ type: 'heading', level: 2, text: '公司简介' });
    expect(blocks[1]).toEqual({ type: 'paragraph', text: '企业简介内容' });
  });

  it('should include image block when imageUrl is provided', () => {
    const blocks = buildBlocks({
      description: '企业简介',
      imageUrl: 'https://example.com/photo.jpg',
    });
    expect(blocks).toHaveLength(3);
    expect(blocks[2]).toEqual({
      type: 'image',
      url: 'https://example.com/photo.jpg',
      caption: '企业图片',
    });
  });

  it('should skip paragraph block when description is empty', () => {
    const blocks = buildBlocks({ description: '', imageUrl: null });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('heading');
  });

  it('should clean up whitespace in description', () => {
    const blocks = buildBlocks({ description: '  企业   简介  内容  ', imageUrl: null });
    expect(blocks[1]).toEqual({ type: 'paragraph', text: '企业 简介 内容' });
  });
});
