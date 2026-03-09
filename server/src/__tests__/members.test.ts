import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import memberRoutes from '../routes/members';

const app = express();
app.use(express.json());
app.use('/api/members', memberRoutes);

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    member: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Members API', () => {
  const prisma = new PrismaClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/members', () => {
    it('should return paginated members list', async () => {
      const mockMembers = [
        { id: '1', name: '张三', company: 'ABC公司', phone: '13800138000' },
        { id: '2', name: '李四', company: 'XYZ公司', phone: '13900139000' },
      ];

      (prisma.member.findMany as jest.Mock).mockResolvedValue(mockMembers);
      (prisma.member.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app)
        .get('/api/members?page=1&limit=10')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should handle search query', async () => {
      const mockMembers = [{ id: '1', name: '张三', company: 'ABC公司' }];

      (prisma.member.findMany as jest.Mock).mockResolvedValue(mockMembers);
      (prisma.member.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/members?search=张三')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/members/:id', () => {
    it('should return member by id', async () => {
      const mockMember = { id: '1', name: '张三', company: 'ABC公司' };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);

      const response = await request(app)
        .get('/api/members/1')
        .expect(200);

      expect(response.body.id).toBe('1');
    });

    it('should return 404 for non-existent member', async () => {
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app)
        .get('/api/members/999')
        .expect(404);
    });
  });

  describe('POST /api/members', () => {
    it('should create new member', async () => {
      const newMember = {
        name: '王五',
        company: '新公司',
        phone: '13700137000',
        email: 'wangwu@example.com',
      };

      const createdMember = { id: '3', ...newMember };

      (prisma.member.create as jest.Mock).mockResolvedValue(createdMember);

      const response = await request(app)
        .post('/api/members')
        .send(newMember)
        .expect(201);

      expect(response.body.id).toBe('3');
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/members')
        .send({ company: '新公司' }) // missing name
        .expect(400);
    });
  });

  describe('PUT /api/members/:id', () => {
    it('should update member', async () => {
      const updateData = { name: '张三更新' };
      const updatedMember = { id: '1', ...updateData, company: 'ABC公司' };

      (prisma.member.update as jest.Mock).mockResolvedValue(updatedMember);

      const response = await request(app)
        .put('/api/members/1')
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('张三更新');
    });
  });

  describe('DELETE /api/members/:id', () => {
    it('should delete member', async () => {
      (prisma.member.delete as jest.Mock).mockResolvedValue({ id: '1' });

      await request(app)
        .delete('/api/members/1')
        .expect(204);
    });
  });
});
