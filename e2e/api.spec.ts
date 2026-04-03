import { test, expect, request as createRequest } from '@playwright/test';

// Shared auth token and API context across tests
let authToken: string;
const TEST_PHONE = `138${Date.now().toString().slice(-8)}`;
let api: Awaited<ReturnType<typeof createRequest.newContext>>;

test.beforeAll(async () => {
  // Register a test user
  api = await createRequest.newContext({ baseURL: 'http://localhost:3000' });

  const regRes = await api.post('/api/auth/register', {
    data: { phone: TEST_PHONE, password: 'test123456', name: 'E2E Test User' },
  });
  if (!regRes.ok()) {
    // User might already exist, try to login
    const loginRes = await api.post('/api/auth/login', {
      data: { phone: TEST_PHONE, password: 'test123456' },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    authToken = loginData.data.token;
  } else {
    const regData = await regRes.json();
    authToken = regData.data.token;
  }
});

test.afterAll(async () => {
  await api?.dispose();
});

test.describe('Members API', () => {
  test('should list members', async ({ request: req }) => {
    const response = await req.get('/api/members', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('should create a member', async ({ request: req }) => {
    const response = await req.post('/api/members', {
      data: {
        name: 'Playwright Test',
        phone: `139${Date.now().toString().slice(-8)}`,
        company: 'Test Company',
      },
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Playwright Test');
  });

  test('should validate member data', async ({ request: req }) => {
    const response = await req.post('/api/members', {
      data: {
        name: 'Test',
        // Missing phone and company
      },
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Activities API', () => {
  test('should list activities', async ({ request: req }) => {
    const response = await req.get('/api/activities');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('should create an activity', async ({ request: req }) => {
    const response = await req.post('/api/activities', {
      data: {
        title: 'E2E Test Activity',
        description: 'Test Description',
        date: '2026-04-01',
        location: 'Test Location',
        maxParticipants: 50,
      },
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();
  });
});

test.describe('Health Check', () => {
  test('should return ok status', async ({ request: req }) => {
    const response = await req.get('/health');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});
