const fs = require('fs');
const path = require('path');

// 创建简单的 SVG 占位图片
function createPlaceholderSVG(productName, category) {
  const colors = {
    '电气': { bg: '#1e40af', icon: '#60a5fa' },
    '管道': { bg: '#047857', icon: '#34d399' },
    '纺织': { bg: '#be185d', icon: '#f472b6' },
    '食品': { bg: '#ea580c', icon: '#fb923c' },
    '电子': { bg: '#4338ca', icon: '#818cf8' },
    '服务': { bg: '#0891b2', icon: '#22d3ee' },
    '医疗': { bg: '#059669', icon: '#34d399' },
    '能源': { bg: '#ca8a04', icon: '#facc15' },
    '机械': { bg: '#475569', icon: '#94a3b8' },
    '车辆': { bg: '#dc2626', icon: '#f87171' },
    '照明': { bg: '#7c3aed', icon: '#a78bfa' },
    '建材': { bg: '#78716c', icon: '#d6d3d1' },
  };

  let color = colors['电气'];
  for (const [key, value] of Object.entries(colors)) {
    if (productName.includes(key) || (category && category.includes(key))) {
      color = value;
      break;
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color.bg}"/>
  <text x="200" y="130" text-anchor="middle" fill="${color.icon}" font-size="64" font-family="Arial, sans-serif">📦</text>
  <text x="200" y="180" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif">${productName.substring(0, 20)}</text>
</svg>`;

  return svg;
}

const data = JSON.parse(fs.readFileSync('/tmp/companies_products.json', 'utf8'));

let imageCount = 0;
const imageMap = {};

for (const company of data) {
  for (let i = 0; i < company.products.length; i++) {
    const product = company.products[i];
    const safeName = `${company.companyName}-${product.name}`.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `product_${imageCount}_${safeName.substring(0, 50)}.svg`;
    const filepath = path.join('/Users/zky/yueqing-chamber/server/public/images/products', filename);

    const svg = createPlaceholderSVG(product.name, company.industry);
    fs.writeFileSync(filepath, svg);

    imageMap[`${company.companyName}-${i}`] = `/images/products/${filename}`;
    imageCount++;
  }
}

fs.writeFileSync('/tmp/image_map.json', JSON.stringify(imageMap, null, 2));
console.log(`Generated ${imageCount} placeholder images`);
console.log('Image map saved to /tmp/image_map.json');
