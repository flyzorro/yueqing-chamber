import pg from 'pg';
const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const res = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['Company']);
console.log(JSON.stringify(res.rows, null, 2));
await client.end();
