import app, { createApp } from './app';
import pg from 'pg';

const { Client } = pg;

const NGROK_URL = 'https://hisako-huskiest-jacquelyn.ngrok-free.dev';

async function fetchNgrok(path: string) {
  const resp = await fetch(NGROK_URL + path);
  if (!resp.ok) throw new Error(`Ngrok error ${resp.status} on ${path}`);
  return resp.json();
}

async function migrateCompanies() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL, skipping migration'); return; }

  console.log('Starting company migration from ngrok...');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const allCompanies = [];
  let page = 1;
  while (true) {
    const resp = await fetchNgrok('/api/companies?page=' + page + '&limit=100');
    allCompanies.push(...resp.data);
    if (!resp.data.length || resp.data.length < 100) break;
    page++;
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('Found', allCompanies.length, 'companies on ngrok');

  let inserted = 0, skipped = 0, failed = 0;
  for (const company of allCompanies) {
    try {
      const res = await client.query(
        `INSERT INTO "Company" (id, name, industry, "contactName", phone, address, logo, status, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
         ON CONFLICT (name) DO NOTHING RETURNING id`,
        [company.id, company.name, company.industry || null, company.contactName,
         company.phone || null, company.address || null, company.logo || null, company.status || 'active']
      );
      if ((res.rowCount ?? 0) > 0) { console.log('  ✓', company.name); inserted++; }
      else { skipped++; }
    } catch (e) {
      console.log('  ✗', company.name, '-', (e as Error).message);
      failed++;
    }
  }

  console.log('Migration done:', inserted, 'inserted,', skipped, 'skipped,', failed, 'failed');
  await client.end();
}

// Root route contract: Use /api, /api/docs, or /health.

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  migrateCompanies().catch(e => console.error('Migration error:', e)).finally(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  });
}

export { createApp };
export default app;
