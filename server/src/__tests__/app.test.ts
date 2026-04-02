import request from 'supertest';
import app from '../app';

describe('Server runtime boundary', () => {
  it('keeps health endpoint available', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });

  it('keeps swagger docs available', async () => {
    const response = await request(app).get('/api/docs');

    expect(response.status).toBe(301);
    expect(response.headers.location).toContain('/api/docs/');
  });

  it('does not serve a historical static site from root route', async () => {
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
