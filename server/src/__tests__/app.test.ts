import request from 'supertest';
import { createApp } from '../index';

describe('Server runtime boundary', () => {
  const app = createApp();

  it('keeps health endpoint available', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });

  it('does not serve dashboard from root route', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        error: 'Not Found',
      })
    );
    expect(response.body.message).toContain('/api');
  });
});
