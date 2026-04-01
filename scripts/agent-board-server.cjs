const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3030);
const ROOT = process.cwd();
const DASHBOARD = path.join(ROOT, 'dashboard', 'index.html');
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/zky/.openclaw/workspace';
const REGISTRY = path.join(WORKSPACE, 'tasks', 'active-tasks.json');

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function buildBoard() {
  const reg = readJson(REGISTRY, { tasks: [] });
  const tasks = Array.isArray(reg.tasks) ? reg.tasks : [];
  const active = [];
  const recentlyClosed = [];
  for (const t of tasks) {
    const item = {
      agent: t.agent,
      task: t.id,
      status: t.status,
      summary: t.description || '',
      updatedAt: t.lastRunAt || t.cleanupAt || t.closedAt || null,
      sample: false,
    };
    if (['done', 'cancelled', 'merged', 'closed'].includes(t.status)) recentlyClosed.push(item);
    else active.push(item);
  }
  recentlyClosed.sort((a,b) => String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
  return { active, recentlyClosed };
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/agent-board') {
    const body = JSON.stringify(buildBoard());
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(body);
  }
  if (req.url === '/' || req.url === '/index.html') {
    try {
      const html = fs.readFileSync(DASHBOARD, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Failed to load dashboard');
    }
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Agent Board running at http://127.0.0.1:${PORT}/`);
});
