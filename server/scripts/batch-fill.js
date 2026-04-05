/**
 * Batch fill company summaries via Bocha web search + Railway API.
 * Run: BOCHA_API_KEY=xxx RAILWAY_URL=https://xxx.railway.app RAILWAY_TOKEN=xxx node scripts/batch-fill.js
 */

const RAILWAY_URL = process.env.RAILWAY_URL || 'http://localhost:3000';
const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN || '';
const BOCHA_API_KEY = process.env.BOCHA_API_KEY || '';
const BOCHA_BASE_URL = 'https://api.bochaai.com';

async function fetchBocha(query) {
  const resp = await fetch(BOCHA_BASE_URL + '/v1/web-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + BOCHA_API_KEY },
    body: JSON.stringify({ query, count: 5, summary: true }),
  });
  return resp.json();
}

async function fetchRailway(path, options) {
  const url = RAILWAY_URL + path;
  const headers = { 'Content-Type': 'application/json' };
  if (RAILWAY_TOKEN) headers['Authorization'] = 'Bearer ' + RAILWAY_TOKEN;
  const resp = await fetch(url, { ...options, headers: { ...headers, ...options?.headers } });
  if (!resp.ok) throw new Error('Railway error ' + resp.status + ' on ' + path);
  return resp.json();
}

async function generateDescription(name) {
  const result = await fetchBocha(name);

  if (!result.data?.webPages?.value?.length) {
    throw new Error('No results');
  }

  // Collect snippets from top results
  const snippets = result.data.webPages.value
    .map(r => r.snippet)
    .filter(Boolean)
    .join('\n\n');

  if (snippets.length < 20) {
    throw new Error('Empty');
  }

  // Clean up HTML artifacts and trim
  const cleaned = snippets
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.slice(0, 500);
}

async function writeSummary(companyId, description) {
  return fetchRailway('/api/companies/' + companyId + '/summary', {
    method: 'POST',
    body: JSON.stringify({ description })
  });
}

async function main() {
  if (!BOCHA_API_KEY) {
    console.error('BOCHA_API_KEY environment variable is required');
    process.exit(1);
  }

  // Fetch all companies from Railway
  const allCompanies = [];
  let page = 1;
  while (true) {
    const resp = await fetchRailway('/api/companies?page=' + page + '&limit=100');
    allCompanies.push(...resp.data);
    if (resp.data.length < 100 || !resp.total || allCompanies.length >= resp.total) break;
    page++;
    await new Promise(r => setTimeout(r, 500));
  }

  const companies = allCompanies;
  console.log('Found ' + companies.length + ' companies\n');

  let filled = 0, skipped = 0, failed = 0;

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    process.stdout.write('[' + (i + 1) + '/' + companies.length + '] ' + company.name + '... ');

    try {
      const description = await generateDescription(company.name);
      await writeSummary(company.id, description);
      console.log('\u2705 (' + description.length + ' chars) ' + description.slice(0, 50) + '...');
      filled++;
    } catch (e) {
      if (e.message.indexOf('Empty') !== -1) { console.log('\u23ed empty'); skipped++; }
      else { console.log('\u274c ' + e.message.slice(0, 80)); failed++; }
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nDone: ' + filled + ' filled, ' + skipped + ' empty, ' + failed + ' failed');
}

main().catch(console.error);
