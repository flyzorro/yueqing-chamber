import request from 'supertest';
import express from 'express';
import informationRouter from '../routes/information';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    information: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('../middleware/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    // 默认未认证
    return next ? next() : undefined;
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/information', informationRouter);

describe('Information API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/information', () => {
    it('should return paginated information list (public)', async () => {
      const mockInfos = [
        {
          id: 'info-1',
          title: '求购电子元器件',
          content: '长期采购电子元器件，有需要请联系',
          category: 'product',
          contactname: '张先生',
          contactphone: '13800138000',
          publisherid: 'user-1',
          createdat: new Date('2026-04-01'),
          updatedat: new Date('2026-04-01'),
        },
        {
          id: 'info-2',
          title: '技术转让：智能制造系统',
          content: '自主研发的智能制造系统寻求合作伙伴',
          category: 'technology',
          contactname: null,
          contactphone: null,
          publisherid: 'user-2',
          createdat: new Date('2026-04-02'),
          updatedat: new Date('2026-04-02'),
        },
      ];

      (prisma.information.findMany as jest.Mock).mockResolvedValue(mockInfos);
      (prisma.information.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get('/api/information?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('求购电子元器件');
      expect(response.body.data[0].category).toBe('product');
      expect(response.body.data[1].category).toBe('technology');
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    it('should filter by category', async () => {
      const mockInfos = [
        {
          id: 'info-1',
          title: '金融产品推介',
          content: '银行授信产品',
          category: 'finance',
          contactname: null,
          contactphone: null,
          publisherid: 'user-1',
          createdat: new Date(),
          updatedat: new Date(),
        },
      ];

      (prisma.information.findMany as jest.Mock).mockResolvedValue(mockInfos);
      (prisma.information.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/api/information?category=finance');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('finance');
    });

    it('should handle empty result', async () => {
      (prisma.information.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.information.count as jest.Mock).mockResolvedValue(0);

      const response = await request(app).get('/api/information');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/information/categories', () => {
    it('should return category list', async () => {
      const mockCategories = ['product', 'technology', 'finance', 'other'];

      (prisma.information.findMany as jest.Mock).mockResolvedValue(
        mockCategories.map((c) => ({ category: c }))
      );

      const response = await request(app).get('/api/information/categories');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCategories);
    });
  });

  describe('GET /api/information/:id', () => {
    it('should return information detail by id', async () => {
      const mockInfo = {
        id: 'info-1',
        title: '求购信息',
        content: '详细内容',
        category: 'product',
        contactname: '张先生',
        contactphone: '13800138000',
        publisherid: 'user-1',
        createdat: new Date(),
        updatedat: new Date(),
      };

      (prisma.information.findUnique as jest.Mock).mockResolvedValue(mockInfo);

      const response = await request(app).get('/api/information/info-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('info-1');
      expect(response.body.data.title).toBe('求购信息');
    });

    it('should return 404 when information not found', async () => {
      (prisma.information.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/information/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('信息不存在');
    });
  });

  describe('POST /api/information', () => {
    const mockUser = { userId: 'user-1', phone: '13800138000' };

    beforeEach(() => {
      (authenticate as jest.Mock).mockImplementation((req, res, next) => {
        req.user = mockUser;
        next();
      });
    });

    afterEach(() => {
      (authenticate as jest.Mock).mockReset();
    });

    it('should create information with valid input', async () => {
      const newInfo = {
        id: 'info-new',
        title: '新发布信息',
        content: '详细内容',
        category: 'market',
        contactname: '李先生',
        contactphone: '13900139000',
        publisherid: 'user-1',
        createdat: new Date(),
        updatedat: new Date(),
      };

      (prisma.information.create as jest.Mock).mockResolvedValue(newInfo);

      const response = await request(app)
        .post('/api/information')
        .send({
          title: '新发布信息',
          content: '详细内容',
          category: 'market',
          contactname: '李先生',
          contactphone: '13900139000',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('新发布信息');
      expect(prisma.information.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: '新发布信息',
          content: '详细内容',
          category: 'market',
          publisherid: 'user-1',
        }),
      });
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/information')
        .send({
          content: '详细内容',
          category: 'market',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('标题');
    });

    it('should return 400 when content is missing', async () => {
      const response = await request(app)
        .post('/api/information')
        .send({
          title: '标题',
          category: 'market',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('内容');
    });

    it('should return 400 when category is invalid', async () => {
      const response = await request(app)
        .post('/api/information')
        .send({
          title: '标题',
          content: '内容',
          category: 'invalid-category',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('分类');
    });
  });

  describe('PUT /api/information/:id', () => {
    const mockUser = { userId: 'user-1', phone: '13800138000' };

    beforeEach(() => {
      (authenticate as jest.Mock).mockImplementation((req, res, next) => {
        req.user = mockUser;
        next();
      });
    });

    afterEach(() => {
      (authenticate as jest.Mock).mockReset();
    });

    it('should update information when user is publisher', async () => {
      const existingInfo = {
        id: 'info-1',
        title: '原标题',
        content: '原内容',
        category: 'product',
        publisherid: 'user-1',
        createdat: new Date(),
        updatedat: new Date(),
      };

      const updatedInfo = {
        ...existingInfo,
        title: '新标题',
        updatedat: new Date(),
      };

      (prisma.information.findUnique as jest.Mock).mockResolvedValue(existingInfo);
      (prisma.information.update as jest.Mock).mockResolvedValue(updatedInfo);

      const response = await request(app)
        .put('/api/information/info-1')
        .send({
          title: '新标题',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('新标题');
    });

    it('should return 403 when user is not publisher', async () => {
      const existingInfo = {
        id: 'info-1',
        title: '原标题',
        content: '原内容',
        category: 'product',
        publisherid: 'user-2',
        createdat: new Date(),
        updatedat: new Date(),
      };

      (prisma.information.findUnique as jest.Mock).mockResolvedValue(existingInfo);

      const response = await request(app)
        .put('/api/information/info-1')
        .send({
          title: '新标题',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('权限');
    });

    it('should return 404 when information not found', async () => {
      (prisma.information.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/information/non-existent')
        .send({
          title: '新标题',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('信息不存在');
    });
  });

  describe('DELETE /api/information/:id', () => {
    const mockAdminUser = { userId: 'user-1', phone: '13800138000' };
    const mockNormalUser = { userId: 'user-2', phone: '13800138001' };

    beforeEach(() => {
      process.env.ADMIN_PHONES = '13800138000,13900139000';
    });

    afterEach(() => {
      delete process.env.ADMIN_PHONES;
      (authenticate as jest.Mock).mockReset();
    });

    it('should delete information when user is admin', async () => {
      (authenticate as jest.Mock).mockImplementation((req, res, next) => {
        req.user = mockAdminUser;
        next();
      });

      const existingInfo = {
        id: 'info-1',
        title: '信息',
        content: '内容',
        category: 'product',
        publisherid: 'user-2',
        createdat: new Date(),
        updatedat: new Date(),
      };

      (prisma.information.findUnique as jest.Mock).mockResolvedValue(existingInfo);
      (prisma.information.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/api/information/info-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(prisma.information.delete).toHaveBeenCalledWith({
        where: { id: 'info-1' },
      });
    });

    it('should return 403 when user is not admin', async () => {
      (authenticate as jest.Mock).mockImplementation((req, res, next) => {
        req.user = mockNormalUser;
        next();
      });

      const response = await request(app).delete('/api/information/info-1');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('管理员');
    });
  });
});
