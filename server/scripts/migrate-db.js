const { Client } = require('pg');
const fs = require('fs');

async function migrateDb() {
  const neonUrl = 'postgresql://neondb_owner:npg_weAzWmy14hbZ@ep-flat-dust-a1t2nohn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
  const railwayUrl = process.env.DATABASE_URL;

  if (!railwayUrl) {
    console.error('DATABASE_URL not set in environment');
    process.exit(1);
  }

  const neonClient = new Client({ connectionString: neonUrl });
  const railwayClient = new Client({ connectionString: railwayUrl, ssl: { rejectUnauthorized: false } });

  try {
    await neonClient.connect();
    console.log('Connected to Neon');

    await railwayClient.connect();
    console.log('Connected to Railway');

    // 获取所有表
    const tables = await neonClient.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);

    console.log('Tables found:', tables.rows.map(r => r.table_name));

    // 逐个表迁移数据
    for (const table of tables.rows) {
      const tableName = table.table_name;
      console.log(`Migrating table: ${tableName}`);

      // 获取所有数据
      const result = await neonClient.query(`SELECT * FROM public."${tableName}"`);

      if (result.rows.length === 0) {
        console.log(`  No data in ${tableName}`);
        continue;
      }

      // 构建 INSERT 语句
      for (const row of result.rows) {
        const keys = Object.keys(row);
        const values = keys.map((k, i) => `$${i + 1}`);

        try {
          await railwayClient.query(
            `INSERT INTO public."${tableName}" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING`,
            keys.map(k => row[k])
          );
        } catch (err) {
          console.error(`  Error inserting row into ${tableName}: ${err.message}`);
        }
      }

      console.log(`  Migrated ${result.rows.length} rows`);
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await neonClient.end();
    await railwayClient.end();
  }
}

migrateDb();
