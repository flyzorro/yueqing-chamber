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
    },
    activityPhoto: {
      findMany: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use('/api/activities', activitiesRouter);

describe('Activity Photos API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/activities/:id/photos', () => {
    it('should return activity photos', async () => {
      const mockActivity = {
        id: 'activity-1',
        title: 'Annual Meeting 2024',
      };

      const mockPhotos = [
        {
          id: 'photo-1',
          activityId: 'activity-1',
          imageUrl: 'https://example.com/photo1.jpg',
          caption: 'Group photo',
          sortorder: 1,
        },
        {
          id: 'photo-2',
          activityId: 'activity-1',
          imageUrl: 'https://example.com/photo2.jpg',
          caption: 'Keynote speech',
          sortorder: 2,
        },
      ];

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.activityPhoto.findMany as jest.Mock).mockResolvedValue(mockPhotos);

      const response = await request(app).get('/api/activities/activity-1/photos');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activity.id).toBe('activity-1');
      expect(response.body.data.activity.title).toBe('Annual Meeting 2024');
      expect(response.body.data.photos).toHaveLength(2);
      expect(response.body.data.photos[0].caption).toBe('Group photo');
    });

    it('should return 404 when activity not found', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/activities/non-existent/photos');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('活动不存在');
    });

    it('should return empty photos array when no photos exist', async () => {
      const mockActivity = { id: 'activity-1', title: 'Event' };

      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.activityPhoto.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/activities/activity-1/photos');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.photos).toHaveLength(0);
    });

    it('should return 500 on database error', async () => {
      (prisma.activity.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/activities/activity-1/photos');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('获取活动相册失败');
    });
  });
});
