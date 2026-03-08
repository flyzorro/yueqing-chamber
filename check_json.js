const fs = require('fs');
try {
  const content = fs.readFileSync('/Users/zky/.openclaw/openclaw.json', 'utf8');
  JSON.parse(content);
  console.log('JSON格式正确');
} catch (error) {
  console.log('JSON格式错误:', error.message);
  console.log('错误位置:', error);
}