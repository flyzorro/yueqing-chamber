const fs = require('fs');
const path = require('path');

// 创建简单的 PNG 占位图片 (1x1 像素，然后拉伸)
// 使用 data URI 格式写入 PNG 文件
function createPlaceholderPNG(productName, category) {
  const colors = {
    '电气': { bg: '#1e40af', text: '#60a5fa' },
    '管道': { bg: '#047857', text: '#34d399' },
    '纺织': { bg: '#be185d', text: '#f472b6' },
    '食品': { bg: '#ea580c', text: '#fb923c' },
    '电子': { bg: '#4338ca', text: '#818cf8' },
    '服务': { bg: '#0891b2', text: '#22d3ee' },
    '医疗': { bg: '#059669', text: '#34d399' },
    '能源': { bg: '#ca8a04', text: '#facc15' },
    '机械': { bg: '#475569', text: '#94a3b8' },
    '车辆': { bg: '#dc2626', text: '#f87171' },
    '照明': { bg: '#7c3aed', text: '#a78bfa' },
    '建材': { bg: '#78716c', text: '#d6d3d1' },
  };

  let color = colors['电气'];
  for (const [key, value] of Object.entries(colors)) {
    if (productName.includes(key) || (category && category.includes(key))) {
      color = value;
      break;
    }
  }

  // 创建一个简单的彩色 PNG (400x300)
  // PNG header + IHDR chunk + IDAT chunk (compressed image data) + IEND chunk
  // 为了简单，我们使用一个更简单的方法：创建 HTML canvas 然后导出
  // 但这里我们用预定义的简单 PNG 模板

  // 使用 Node.js canvas 库创建图片
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(400, 300);
  const ctx = canvas.getContext('2d');

  // 背景
  ctx.fillStyle = color.bg;
  ctx.fillRect(0, 0, 400, 300);

  // 图标
  ctx.font = '64px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = color.text;
  ctx.fillText('📦', 200, 130);

  // 产品名称
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  const shortName = productName.length > 20 ? productName.substring(0, 18) + '...' : productName;
  ctx.fillText(shortName, 200, 180);

  return canvas.toBuffer('image/png');
}

const data = JSON.parse(fs.readFileSync('/tmp/companies_products.json', 'utf8'));
const imageMap = {};

const outputDir = '/Users/zky/yueqing-chamber/server/public/images/products';

let imageCount = 0;
for (const company of data) {
  for (let i = 0; i < company.products.length; i++) {
    const product = company.products[i];
    const safeName = `${company.companyName}-${product.name}`.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `product_${imageCount}_${safeName.substring(0, 50)}.png`;
    const filepath = path.join(outputDir, filename);

    try {
      const pngBuffer = createPlaceholderPNG(product.name, company.industry);
      fs.writeFileSync(filepath, pngBuffer);
      imageMap[`${company.companyName}-${i}`] = `/images/products/${filename}`;
      imageCount++;
    } catch (e) {
      console.error(`Error creating image for ${product.name}:`, e.message);
    }
  }
}

fs.writeFileSync('/tmp/image_map_png.json', JSON.stringify(imageMap, null, 2));
console.log(`Generated ${imageCount} PNG placeholder images`);
