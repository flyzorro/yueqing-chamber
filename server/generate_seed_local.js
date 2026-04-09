const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/tmp/companies_products.json', 'utf8'));
const imageMap = JSON.parse(fs.readFileSync('/tmp/image_map.json', 'utf8'));

// Generate TypeScript code
let tsCode = `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding companies...');

  // Company address data (184 companies)
  const companies = [
`;

// Add all company addresses
const companyNames = data.map(d => d.companyName);
for (const company of companyNames) {
  tsCode += `    { name: "${company.replace(/"/g, '\\"')}", address: "", industry: "" },\n`;
}

tsCode += `  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: { address: company.address },
      create: company,
    });
  }

  console.log(\`Seeded \${companies.length} companies.\`);

  // Product data for 178 companies with local placeholder images
  const productSeeds = [
`;

// Add product seeds for all companies
for (const company of data) {
  tsCode += `    {\n`;
  tsCode += `      companyName: '${company.companyName.replace(/'/g, "\\'")}',\n`;
  tsCode += `      products: [\n`;

  for (let i = 0; i < company.products.length; i++) {
    const product = company.products[i];
    const imageUrl = imageMap[`${company.companyName}-${i}`] || '/images/products/placeholder.svg';
    const desc = (product.description || '').replace(/'/g, "\\'");
    tsCode += `        { seedKey: '${company.companyName}-${i}', name: '${product.name.replace(/'/g, "\\'")}', description: '${desc}', sortOrder: ${product.sortOrder || 0}, imageUrl: '${imageUrl}' },\n`;
  }

  tsCode += `      ],\n`;
  tsCode += `    },\n`;
}

tsCode += `  ];

  for (const seed of productSeeds) {
    const company = await prisma.company.findUnique({ where: { name: seed.companyName } });
    if (!company) {
      console.warn(\`Company not found: \${seed.companyName}, skipping products\`);
      continue;
    }
    for (const product of seed.products) {
      const existing = await prisma.companyProduct.findFirst({
        where: { companyId: company.id, seedKey: product.seedKey },
      });
      if (existing) {
        await prisma.companyProduct.update({
          where: { id: existing.id },
          data: { name: product.name, description: product.description, sortOrder: product.sortOrder, imageUrl: product.imageUrl },
        });
      } else {
        await prisma.companyProduct.create({
          data: {
            companyId: company.id,
            seedKey: product.seedKey,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            sortOrder: product.sortOrder,
          },
        });
      }
    }
    console.log(\`Seeded \${seed.products.length} products for \${seed.companyName}\`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
`;

fs.writeFileSync('/Users/zky/yueqing-chamber/server/prisma/seed_companies.ts', tsCode);
console.log('Generated seed_companies.ts with local image paths');
