require('dotenv').config();
const pg = require('pg');
const { Client } = pg;

async function checkSchema() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('Connected to Railway database');

  // 检查 Member 表的列
  const memberCols = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'Member'
    ORDER BY ordinal_position
  `);
  console.log('\nMember table columns:', memberCols.rows.map(r => r.column_name));

  // 检查 Member 表是否有数据
  const memberCount = await client.query('SELECT COUNT(*) FROM "Member"');
  console.log('Member row count:', memberCount.rows[0].count);

  // 检查 Company 表是否有数据
  const companyCount = await client.query('SELECT COUNT(*) FROM "Company"');
  console.log('Company row count:', companyCount.rows[0].count);

  // 显示前几条 Member 数据
  const members = await client.query('SELECT * FROM "Member" LIMIT 5');
  console.log('\nFirst 5 members:', members.rows);

  await client.end();
}

checkSchema().catch(e => { console.error(e); process.exit(1); });
