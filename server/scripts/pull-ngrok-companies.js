/**
 * Pull companies from ngrok dev server and insert into Railway's local PostgreSQL.
 * Called once on startup, then self-destructs.
 * Run: railway run -- node server/scripts/pull-ngrok-companies.js
 */

const NGROK_URL = 'https://hisako-huskiest-jacquelyn.ngrok-free.dev';

async function fetchNgrok(path) {
  const resp = await fetch(NGROK_URL + path);
  if (!resp.ok) throw new Error(`Ngrok error ${resp.status} on ${path}`);
  return resp.json();
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL not set');

  const { Client } = await import('pg');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to Railway PostgreSQL');

  // Fetch all companies from ngrok
  const allCompanies = [];
  let page = 1;
  while (true) {
    const resp = await fetchNgrok('/api/companies?page=' + page + '&limit=100');
    allCompanies.push(...resp.data);
    if (!resp.data.length || resp.data.length < 100) break;
    page++;
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('Ngrok has', allCompanies.length, 'companies');

  let inserted = 0, skipped = 0, failed = 0;

  for (const company of allCompanies) {
    try {
      const res = await client.query(
        `INSERT INTO "Company" (id, name, industry, contactName, phone, address, logo, status, "createdat", "updatedat")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
         ON CONFLICT (name) DO NOTHING
         RETURNING id`,
        [company.id, company.name, company.industry || null, company.contactName,
         company.phone || null, company.address || null, company.logo || null, company.status || 'active']
      );
      if (res.rowCount > 0) {
        console.log('\u2705', company.name);
        inserted++;
      } else {
        console.log('\u23ed skipped (exists):', company.name);
        skipped++;
      }
    } catch (e) {
      console.log('\u274c', company.name, '-', e.message);
      failed++;
    }
  }

  console.log('\nDone:', inserted, 'inserted,', skipped, 'skipped,', failed, 'failed');
  await client.end();
}

main().catch(console.error);
