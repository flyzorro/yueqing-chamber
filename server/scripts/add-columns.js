require('dotenv').config();
const { Client } = require('pg');

async function addMissingColumns() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Connected to Railway database');

    // Add contactname column to Company table
    await client.query(`
      ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "contactName" VARCHAR
    `);
    console.log('✓ Added contactName to Company');

    // Add district column to Member table if missing
    await client.query(`
      ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "district" VARCHAR
    `);
    console.log('✓ Added district to Member');

    // Add chamberTitle column to Member table if missing
    await client.query(`
      ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "chamberTitle" VARCHAR
    `);
    console.log('✓ Added chamberTitle to Member');

    // Create indexes if missing
    await client.query(`CREATE INDEX IF NOT EXISTS "Company_status_idx" ON "Company"("status")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Company_name_idx" ON "Company"("name")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Company_industry_idx" ON "Company"("industry")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Member_phone_idx" ON "Member"("phone")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Member_status_idx" ON "Member"("status")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Activity_date_idx" ON "Activity"("date")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Activity_status_idx" ON "Activity"("status")`);
    console.log('✓ Created indexes');

    console.log('\n✅ Database schema updated successfully!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addMissingColumns();
