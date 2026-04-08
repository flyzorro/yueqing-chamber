import request from 'supertest';
import express from 'express';
import activitiesRouter from '../routes/activities';
import prisma from '../lib/prisma';

// Mock prisma client
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    activity: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    registration: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    member: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(async (fn) => await fn({
      registration: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      activity: {
        update: jest.fn(),
      },
    })),
  },
}));

// Mock auth middleware - skip authentication in tests
jest.mock('../middleware/auth', () => {
  const actual = jest.requireActual('../middleware/auth');
  return {
    ...actual,
    authenticate: (req: any, res: any, next: any) => {
      // Mock user with phone for tests
      req.user = { phone: '12345678900', id: 'user-1' };
      next();
    },
    requireAdmin: (req: any, res: any, next: any) => {
      next();
    },
  };
});

const app = express();
app.use(express.json());
app.use('/api/activities', activitiesRouter);

describe('Activity Registration - New Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/activities/:id/register', () => {
    it('should successfully register when capacity available', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
        currentparticipants: 45,
        maxparticipants: 50,
        status: 'upcoming',
      };

      const mockMember = {
        id: 'member-1',
        phone: '12345678900',
        name: 'Test User',
      };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);
      (prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        await fn({
          registration: {
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn(),
          },
          activity: {
            update: jest.fn(),
          },
        });
      });

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should reject registration when activity is full', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
        currentparticipants: 50,
        maxparticipants: 50,
        status: 'upcoming',
      };

      const mockMember = {
        id: 'member-1',
        phone: '12345678900',
        name: 'Test User',
      };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('报名人数已满');
    });

    it('should reject registration when activity status is completed', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
        currentparticipants: 45,
        maxparticipants: 50,
        status: 'completed',
      };

      const mockMember = {
        id: 'member-1',
        phone: '12345678900',
        name: 'Test User',
      };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('该活动不接受报名');
    });

    it('should return 400 when member does not exist', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
        currentparticipants: 45,
        maxparticipants: 50,
        status: 'upcoming',
      };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('未找到会员信息，请先注册会员或使用管理员手机号报名');
    });

    it('should reject duplicate registration', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
        currentparticipants: 45,
        maxparticipants: 50,
        status: 'upcoming',
      };

      const mockMember = {
        id: 'member-1',
        phone: '12345678900',
        name: 'Test User',
      };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(mockMember);
      (prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        throw new Error('P2002 Unique constraint violation');
      });

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('您已报名该活动');
    });
  });

  describe('GET /api/activities/:id/registrations', () => {
    it('should return registration list for admin', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
      };

      const mockRegistrations = [
        {
          id: 'reg-1',
          memberId: 'member-1',
          activityId: 'activity-1',
          createdat: new Date(),
          member: {
            id: 'member-1',
            name: 'Test User',
            company: 'Test Company',
            position: 'Manager',
            phone: '12345678900',
          },
        },
      ];

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.registration.findMany as jest.Mock).mockResolvedValue(mockRegistrations);

      const response = await request(app).get('/api/activities/activity-1/registrations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].member.name).toBe('Test User');
    });
  });
});
