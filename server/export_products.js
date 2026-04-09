const { Client } = require('pg');
const fs = require('fs');

const DATABASE_URL = "postgresql://postgres:SyKDEVmglzgVizbIbZNXPFMBAyfIIPMI@junction.proxy.rlwy.net:28631/railway";

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

client.connect().then(async () => {
  console.error('Connected to database...');
  const result = await client.query(`
    SELECT c.id as "companyId", c.name as "companyName", cp.name as "productName", cp.description, cp."sortOrder"
    FROM "CompanyProduct" cp
    JOIN "Company" c ON cp."companyId" = c.id
    ORDER BY c.name, cp."sortOrder"
  `);

  // Group by company
  const companies = {};
  for (const row of result.rows) {
    if (!companies[row.companyName]) {
      companies[row.companyName] = { companyId: row.companyId, products: [] };
    }
    companies[row.companyName].products.push({
      name: row.productName,
      description: row.description,
      sortOrder: row.sortOrder || 0
    });
  }

  const output = Object.entries(companies).map(([name, data]) => ({
    companyName: name,
    companyId: data.companyId,
    products: data.products.sort((a,b) => a.sortOrder - b.sortOrder)
  }));

  fs.writeFileSync('/tmp/companies_products.json', JSON.stringify(output, null, 2));
  console.error(`Exported ${output.length} companies with products`);
  console.error(`Total products: ${result.rows.length}`);
  await client.end();
}).catch(e => { console.error('Error:', e.message); process.exit(1); });
