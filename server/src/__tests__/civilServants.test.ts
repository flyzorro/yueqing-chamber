import request from 'supertest';
import express from 'express';
import civilServantsRouter from '../routes/civilServants';
import prisma from '../lib/prisma';

// Mock prisma client
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    civilServant: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use('/api/civil-servants', civilServantsRouter);

describe('Civil Servants API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/civil-servants', () => {
    it('should return paginated civil servants', async () => {
      const mockCivilServants = [
        {
          id: 'cs-1',
          name: '张恺毅',
          department: '乐清市经济和信息化局',
          position: '局长',
          phone: '13800139101',
          email: 'zhangkaiyi@yueqing.gov.cn',
          status: 'active',
        },
        {
          id: 'cs-2',
          name: '王小明',
          department: '乐清市商务局',
          position: '副局长',
          phone: '13800139102',
          status: 'active',
        },
      ];

      (prisma.civilServant.findMany as jest.Mock).mockResolvedValue(mockCivilServants);
      (prisma.civilServant.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get('/api/civil-servants?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('张恺毅');
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    it('should support keyword search', async () => {
      const mockCivilServants = [
        { id: '1', name: '张恺毅', department: '经济和信息化局', status: 'active' },
      ];

      (prisma.civilServant.findMany as jest.Mock).mockResolvedValue(mockCivilServants);
      (prisma.civilServant.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/api/civil-servants?keyword=张');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.filters).toEqual({ keyword: '张', status: 'all' });
      expect(prisma.civilServant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });

    it('should support status filter', async () => {
      const mockCivilServants = [
        { id: '1', name: '张恺毅', department: '经济和信息化局', status: 'active' },
      ];

      (prisma.civilServant.findMany as jest.Mock).mockResolvedValue(mockCivilServants);
      (prisma.civilServant.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/api/civil-servants?status=active');

      expect(response.status).toBe(200);
      expect(response.body.filters).toEqual({ keyword: '', status: 'active' });
      expect(prisma.civilServant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'active',
          }),
        })
      );
    });

    it('should return 500 on database error', async () => {
      (prisma.civilServant.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/civil-servants');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取公务员名单失败');
    });
  });
});
