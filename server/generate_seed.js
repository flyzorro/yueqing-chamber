const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/tmp/companies_products.json', 'utf8'));

// Unsplash photo IDs by category
const imageMap = {
  // 电气/电力
  '断路器': '1558619290-a9a4668428f7',
  '开关': '1507670253-e184d4b3f568',
  '电缆': '1604174462244-12c8c67471e0',
  '电线': '1604174462244-12c8c67471e0',
  '配电': '1558619290-a9a4668428f7',
  '变压器': '1581091226825-a6a2a9923314',
  '接触器': '1558619290-a9a4668428f7',
  '柜': '1600219370-ab1623f08556',
  '泵': '1581092149559-3a38e7a4a0c7',
  '阀门': '1581092149559-3a38e7a4a0c7',
  '电力': '1497484843679-6a4c50f4a1a8',
  '电气': '1558619290-a9a4668428f7',
  '高压': '1581091226825-a6a2a9923314',
  '低压': '1558619290-a9a4668428f7',
  '塑壳': '1558619290-a9a4668428f7',
  '万能式': '1558619290-a9a4668428f7',
  '交流接触器': '1558619290-a9a4668428f7',
  '箱式变电站': '1581091226825-a6a2a9923314',
  '开关柜': '1600219370-ab1623f08556',

  // 管道/建材
  '管道': '1581092149559-3a38e7a4a0c7',
  '管材': '1504915783-7e9f7d5b4f17',
  'PVC': '1581092149559-3a38e7a4a0c7',
  'PE': '1504915783-7e9f7d5b4f17',
  'PPR': '1504915783-7e9f7d5b4f17',
  '排水': '1581092149559-3a38e7a4a0c7',
  '给水': '1581092149559-3a38e7a4a0c7',
  '建材': '1503380056-a24851806ba1',
  '建筑': '1486404931741-80f7f721fb44',

  // 纺织/服装
  '纺织': '1528459806-f752f2a6a960',
  '服装': '1483985917599-18c44103237a',
  '刺绣': '1479714828517-66e60a67b6f5',
  '丝绸': '1528459806-f752f2a6a960',
  '家纺': '1522778939232-ae1c12a648ea',
  '床上用品': '1522778939232-ae1c12a648ea',

  // 食品/农业
  '食品': '1490464596296-8b6e45a89782',
  '农业': '1500382017468-9049fed7747ef',
  '酒': '1506377286629-10c9626f0c2f',
  '餐饮': '1414294163535-1fb7002d0acf',

  // 电子/科技
  '电子': '1518770523000-9715898db5bf',
  '科技': '1519389950473-47ba0277781c',
  '信息': '1550499060-94287951981c',
  '软件': '1571119244388-86521f61d5cb',
  '电路': '1518770523000-9715898db5bf',
  '元件': '1518770523000-9715898db5bf',
  '连接器': '1518770523000-9715898db5bf',

  // 服务/商业
  '法律': '1589824964234-c6a3c57c7033',
  '律师': '1589824964234-c6a3c57c7033',
  '物流': '1586528423060-48b050840a30',
  '快递': '1616424420246-e40c2a8a914e',
  '投资': '1579533524962-1be39d5dd3a9',
  '金融': '1565514029079-86606d90a5e7',
  '管理': '1497372195151-3b6e331ecf00',
  '实业': '1590244875088-6f9a7c5a5f69',
  '物业': '1486404931741-80f7f721fb44',
  '产业园': '1486404931741-80f7f721fb44',
  '典当': '1589824964234-c6a3c57c7033',

  // 医疗/健康
  '医疗': '1519489985013-54a93f6d59f3',
  '康复': '1576091168172-9c6a5a4f8fb6',
  '医院': '1519489985013-54a93f6d59f3',
  '理疗': '1576091168172-9c6a5a4f8fb6',
  '健康': '1576091168172-9c6a5a4f8fb6',

  // 能源/新能源
  '储能': '1548375921-4e18a0a5a3ca',
  '充电': '1593945699-4e0a6e7a1b0f',
  '光伏': '1509394196231-4953c9c4e8d1',
  '太阳能': '1509394196231-4953c9c4e8d1',
  '风电': '1532606789892-088665a5e7f7',
  '能源': '1497484843679-6a4c50f4a1a8',

  // 机械/设备
  '机械': '1504915783-7e9f7d5b4f17',
  '设备': '1581091226825-a6a2a9923314',
  '机电': '1581091226825-a6a2a9923314',
  '制造': '1581092149559-3a38e7a4a0c7',
  '工业': '1581091226825-a6a2a9923314',

  // 车辆/交通
  '汽车': '1494905998402-395930813141',
  '车辆': '1494905998402-39539361',
  '电动': '1593945699-4e0a6e7a1b0f',
  '摩托': '1558981888-ed199316e04c',
  '自行车': '1485967594922-6f28c8746afc',

  // 照明
  '照明': '1565279338-9b877f5a5b2a',
  '灯具': '1565279338-9b877f5a5b2a',
  '应急灯': '1565279338-9b877f5a5b2a',
  '防爆': '1565279338-9b877f5a5b2a',

  // 电缆/电线
  '线缆': '1604174462244-12c8c67471e0',
  '电线': '1604174462244-12c8c67471e0',
  '耐火': '1604174462244-12c8c67471e0',
  '阻燃': '1604174462244-12c8c67471e0',

  // 泵/阀
  '离心泵': '1581092149559-3a38e7a4a0c7',
  '消防泵': '1581092149559-3a38e7a4a0c7',
  '排污泵': '1581092149559-3a38e7a4a0c7',

  // Default
  'default': '1581091226825-a6a2a9923314'
};

function getImageUrl(productName, index) {
  let photoId = imageMap['default'];

  for (const [keyword, id] of Object.entries(imageMap)) {
    if (keyword !== 'default' && productName.includes(keyword)) {
      photoId = id;
      break;
    }
  }

  return `https://images.unsplash.com/photo-${photoId}?w=400&h=300&fit=crop`;
}

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

  // Product data for 178 companies with Unsplash images
  const productSeeds = [
`;

// Add product seeds for all companies
for (const company of data) {
  tsCode += `    {\n`;
  tsCode += `      companyName: '${company.companyName.replace(/'/g, "\\'")}',\n`;
  tsCode += `      products: [\n`;

  for (let i = 0; i < company.products.length; i++) {
    const product = company.products[i];
    const imageUrl = getImageUrl(product.name, i);
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

fs.writeFileSync('/tmp/seed_companies_new.ts', tsCode);
console.log('Generated seed_companies_new.ts');
console.log(`Total companies: ${companyNames.length}`);
console.log(`Companies with products: ${data.length}`);
