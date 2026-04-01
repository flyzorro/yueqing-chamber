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
      updateMany: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use('/api/activities', activitiesRouter);

describe('Activity Registration - Race Condition Fix', () => {
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
      };

      // Mock updateMany returning count: 1 (successful update)
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.activity.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(prisma.activity.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'activity-1',
          currentparticipants: { lt: 50 }
        },
        data: {
          currentparticipants: { increment: 1 }
        }
      });
    });

    it('should reject registration when activity is full', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
        currentparticipants: 50,
        maxparticipants: 50,
      };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      // Mock updateMany returning count: 0 (no rows updated - activity was full)
      (prisma.activity.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('报名人数已满');
    });

    it('should handle concurrent registrations correctly (race condition prevention)', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting',
        currentparticipants: 49,
        maxparticipants: 50,
      };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);

      // First concurrent request succeeds
      (prisma.activity.updateMany as jest.Mock)
        .mockResolvedValueOnce({ count: 1 })
        // Second concurrent request fails (count: 0 because first request already incremented)
        .mockResolvedValueOnce({ count: 0 });

      // Simulate two concurrent requests
      const [response1, response2] = await Promise.all([
        request(app).post('/api/activities/activity-1/register'),
        request(app).post('/api/activities/activity-1/register'),
      ]);

      // One should succeed, one should fail
      expect([response1.body.success, response2.body.success]).toContain(true);
      expect([response1.body.success, response2.body.success]).toContain(false);

      // The one that failed should have the correct error message
      const failedResponse = response1.body.success ? response2 : response1;
      expect(failedResponse.body.error).toBe('报名人数已满');
    });

    it('should return 400 when activity does not exist', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/activities/non-existent/register');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('活动不存在');
    });

    it('should return 500 on database error', async () => {
      (prisma.activity.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/api/activities/activity-1/register');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('报名失败');
    });
  });
});
