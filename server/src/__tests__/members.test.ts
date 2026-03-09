import request from 'supertest';
import express from 'express';
import membersRouter from '../routes/members';
import prisma from '../lib/prisma';
import { MemberStore } from '../models/Member';

// Mock prisma client
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
app.use('/api/members', membersRouter);

describe('Members API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/members/:id/details', () => {
    it('should return member details with recent activities', async () => {
      const mockMember = {
        id: 'test-member-id',
        name: 'Test Member',
        phone: '13800138000',
        email: 'test@example.com',
        company: 'Test Company',
        position: 'CEO',
        joindate: new Date('2024-01-01'),
        status: 'active',
        createdat: new Date('2024-01-01'),
        updatedat: new Date('2024-01-01'),
        registrations: [
          {
            id: 'reg-1',
            memberId: 'test-member-id',
            activityId: 'activity-1',
            status: 'registered',
            createdat: new Date('2024-02-01'),
            activity: {
              id: 'activity-1',
              title: 'Annual Meeting 2024',
              description: 'Annual gathering',
              date: new Date('2024-03-01'),
              location: 'Shanghai',
              maxparticipants: 100,
              currentparticipants: 50,
              status: 'upcoming',
              createdat: new Date('2024-01-15'),
              updatedat: new Date('2024-01-15'),
            },
          },
          {
            id: 'reg-2',
            memberId: 'test-member-id',
            activityId: 'activity-2',
            status: 'attended',
            createdat: new Date('2024-01-15'),
            activity: {
              id: 'activity-2',
              title: 'Networking Event',
              description: 'Monthly networking',
              date: new Date('2024-02-15'),
              location: 'Beijing',
              maxparticipants: 50,
              currentparticipants: 30,
              status: 'completed',
              createdat: new Date('2024-01-10'),
              updatedat: new Date('2024-01-10'),
            },
          },
        ],
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);
      (prisma.registration.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get('/api/members/test-member-id/details');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe('test-member-id');
      expect(response.body.data.name).toBe('Test Member');
      expect(response.body.data.recentActivities).toHaveLength(2);
      expect(response.body.data.recentActivities[0].activityTitle).toBe('Annual Meeting 2024');
      expect(response.body.data.recentActivities[1].activityTitle).toBe('Networking Event');
      expect(response.body.data.registrationCount).toBe(2);
    });

    it('should return 404 when member does not exist', async () => {
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/members/non-existent-id/details');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('会员不存在');
    });

    it('should return 500 on database error', async () => {
      (prisma.member.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/members/test-id/details');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取会员详情失败');
    });

    it('should handle member with no registrations', async () => {
      const mockMember = {
        id: 'test-member-id',
        name: 'Test Member',
        phone: '13800138000',
        email: 'test@example.com',
        company: 'Test Company',
        position: 'CEO',
        joindate: new Date('2024-01-01'),
        status: 'active',
        createdat: new Date('2024-01-01'),
        updatedat: new Date('2024-01-01'),
        registrations: [],
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);
      (prisma.registration.count as jest.Mock).mockResolvedValue(0);

      const response = await request(app).get('/api/members/test-member-id/details');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.recentActivities).toHaveLength(0);
      expect(response.body.data.registrationCount).toBe(0);
    });

    it('should limit recent activities to 10', async () => {
      const mockMember = {
        id: 'test-member-id',
        name: 'Test Member',
        phone: '13800138000',
        email: 'test@example.com',
        company: 'Test Company',
        position: 'CEO',
        joindate: new Date('2024-01-01'),
        status: 'active',
        createdat: new Date('2024-01-01'),
        updatedat: new Date('2024-01-01'),
        registrations: Array(10).fill(null).map((_, i) => ({
          id: `reg-${i}`,
          memberId: 'test-member-id',
          activityId: `activity-${i}`,
          status: 'registered',
          createdat: new Date('2024-01-01'),
          activity: {
            id: `activity-${i}`,
            title: `Activity ${i}`,
            description: 'Test activity',
            date: new Date('2024-03-01'),
            location: 'Shanghai',
            maxparticipants: 100,
            currentparticipants: 50,
            status: 'upcoming',
            createdat: new Date('2024-01-15'),
            updatedat: new Date('2024-01-15'),
          },
        })),
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);
      (prisma.registration.count as jest.Mock).mockResolvedValue(15);

      const response = await request(app).get('/api/members/test-member-id/details');

      expect(response.status).toBe(200);
      expect(response.body.data.recentActivities).toHaveLength(10);
    });
  });

  describe('GET /api/members', () => {
    it('should return paginated members', async () => {
      const mockMembers = [
        { id: '1', name: 'Member 1', company: 'Company 1' },
        { id: '2', name: 'Member 2', company: 'Company 2' },
      ];

      (prisma.member.findMany as jest.Mock).mockResolvedValue(mockMembers);
      (prisma.member.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get('/api/members?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });
  });

  describe('GET /api/members/:id', () => {
    it('should return a single member', async () => {
      const mockMember = {
        id: 'test-id',
        name: 'Test Member',
        company: 'Test Company',
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);

      const response = await request(app).get('/api/members/test-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('test-id');
    });

    it('should return 404 for non-existent member', async () => {
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/members/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/members', () => {
    it('should create a new member', async () => {
      const newMember = {
        name: 'New Member',
        phone: '13800138000',
        company: 'New Company',
      };

      const mockCreatedMember = { id: 'new-id', ...newMember, status: 'active' };

      (prisma.member.create as jest.Mock).mockResolvedValue(mockCreatedMember);

      const response = await request(app)
        .post('/api/members')
        .send(newMember);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Member');
    });
  });

  describe('PUT /api/members/:id', () => {
    it('should update a member', async () => {
      const updatedMember = {
        id: 'test-id',
        name: 'Updated Name',
        company: 'Updated Company',
      };

      (prisma.member.update as jest.Mock).mockResolvedValue(updatedMember);

      const response = await request(app)
        .put('/api/members/test-id')
        .send({ name: 'Updated Name', company: 'Updated Company' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
    });

    it('should return 404 when updating non-existent member', async () => {
      (prisma.member.update as jest.Mock).mockRejectedValue(new Error('Member not found'));

      const response = await request(app)
        .put('/api/members/non-existent')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/members/:id', () => {
    it('should delete a member', async () => {
      (prisma.member.delete as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/api/members/test-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 500 on delete error', async () => {
      (prisma.member.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const response = await request(app).delete('/api/members/test-id');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});

describe('MemberStore', () => {
  let store: MemberStore;

  beforeEach(() => {
    store = new MemberStore();
    jest.clearAllMocks();
  });

  describe('getDetails', () => {
    it('should return member details with registrations', async () => {
      const mockMember = {
        id: 'test-id',
        name: 'Test Member',
        phone: '13800138000',
        company: 'Test Company',
        registrations: [
          {
            id: 'reg-1',
            activityId: 'activity-1',
            status: 'registered',
            createdat: new Date('2024-01-01'),
            activity: {
              id: 'activity-1',
              title: 'Test Activity',
              date: new Date('2024-02-01'),
              location: 'Test Location',
            },
          },
        ],
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);
      (prisma.registration.count as jest.Mock).mockResolvedValue(1);

      const result = await store.getDetails('test-id');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-id');
      expect(result?.recentActivities).toHaveLength(1);
      expect(result?.registrationCount).toBe(1);
    });

    it('should return null for non-existent member', async () => {
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await store.getDetails('non-existent');

      expect(result).toBeNull();
    });

    it('should transform registration data correctly', async () => {
      const mockMember = {
        id: 'test-id',
        name: 'Test Member',
        phone: '13800138000',
        company: 'Test Company',
        registrations: [
          {
            id: 'reg-1',
            memberId: 'test-id',
            activityId: 'activity-1',
            status: 'registered',
            createdat: new Date('2024-01-01T10:00:00Z'),
            activity: {
              id: 'activity-1',
              title: 'Annual Meeting',
              description: 'Annual gathering',
              date: new Date('2024-02-01T14:00:00Z'),
              location: 'Shanghai Center',
              maxparticipants: 100,
              currentparticipants: 50,
              status: 'upcoming',
            },
          },
        ],
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);
      (prisma.registration.count as jest.Mock).mockResolvedValue(1);

      const result = await store.getDetails('test-id');

      expect(result?.recentActivities[0]).toEqual({
        id: 'reg-1',
        activityId: 'activity-1',
        activityTitle: 'Annual Meeting',
        activityDate: expect.any(Date),
        activityLocation: 'Shanghai Center',
        status: 'registered',
        registeredAt: expect.any(Date),
      });
    });
  });
});
