/**
 * Batch fill company summaries via Ollama (local) + Railway API.
 * Run: RAILWAY_URL=https://xxx.railway.app RAILWAY_TOKEN=xxx node scripts/batch-fill.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const OLLAMA_URL = 'http://localhost:11434/api/generate';

const RAILWAY_URL = process.env.RAILWAY_URL || 'http://localhost:3000';
const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN || '';

async function fetchRailway(path, options) {
  const url = RAILWAY_URL + path;
  const headers = { 'Content-Type': 'application/json' };
  if (RAILWAY_TOKEN) headers['Authorization'] = 'Bearer ' + RAILWAY_TOKEN;
  const resp = await fetch(url, { ...options, headers: { ...headers, ...options?.headers } });
  if (!resp.ok) throw new Error('Railway error ' + resp.status + ' on ' + path);
  return resp.json();
}

async function generateDescription(name, industry) {
  const industryHint = industry && industry.trim() ? '行业：' + industry.trim() + '。' : '';
  const prompt = '请详细介绍公司"' + name + '"，包括成立时间、主营业务、产品类型、企业规模、核心优势等，写150字以内。' + industryHint + '直接输出介绍文字，不要前缀，不要markdown格式。';

  const resp = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5:7b',
      prompt: prompt,
      stream: false,
      options: { temperature: 0.3, num_predict: 400 }
    })
  });

  if (!resp.ok) throw new Error('Ollama error ' + resp.status);

  const data = await resp.json();
  let text = (data.response || '').trim();
  text = text.replace(/^['"【\[（(].*?[\]】）"']+\s*/, '').replace(/^##?\s*/, '').replace(/\*\*/g, '');
  if (text.length < 10) throw new Error('Empty');

  return text.slice(0, 300);
}

async function writeSummary(companyId, description) {
  return fetchRailway('/api/companies/' + companyId + '/summary', {
    method: 'POST',
    body: JSON.stringify({ description })
  });
}

async function main() {
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
      const description = await generateDescription(company.name, company.industry);
      await writeSummary(company.id, description);
      console.log('\u2705 (' + description.length + ' chars) ' + description.slice(0, 30));
      filled++;
    } catch (e) {
      if (e.message.indexOf('Empty') !== -1) { console.log('\u23ed empty'); skipped++; }
      else { console.log('\u274c ' + e.message.slice(0, 80)); failed++; }
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\nDone: ' + filled + ' filled, ' + skipped + ' empty, ' + failed + ' failed');
  await prisma.$disconnect();
}

main().catch(console.error);
