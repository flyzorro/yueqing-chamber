import { test, expect } from '@playwright/test';

test.describe('Members API', () => {
  test('should list members', async ({ request }) => {
    const response = await request.get('/api/members');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('should create a member', async ({ request }) => {
    const response = await request.post('/api/members', {
      data: {
        name: 'Playwright Test',
        phone: '13800138999',
        company: 'Test Company'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Playwright Test');
  });

  test('should validate member data', async ({ request }) => {
    const response = await request.post('/api/members', {
      data: {
        name: 'Test'
        // Missing phone and company
      }
    });
    
    expect(response.status()).toBe(400);
  });
});

test.describe('Activities API', () => {
  test('should list activities', async ({ request }) => {
    const response = await request.get('/api/activities');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('should create an activity', async ({ request }) => {
    const response = await request.post('/api/activities', {
      data: {
        title: 'E2E Test Activity',
        description: 'Test Description',
        date: '2026-04-01',
        location: 'Test Location',
        maxParticipants: 50
      }
    });
    
    expect(response.ok()).toBeTruthy();
  });
});

test.describe('Health Check', () => {
  test('should return ok status', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});