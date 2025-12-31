// check-injection.js
const fs = require('fs');
const path = require('path');

console.log('🔍 检查Cusdis代码注入情况...\n');

const bookDir = '_book';
let foundCount = 0;
let totalHtmlCount = 0;

function checkDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      checkDirectory(fullPath);
    } else if (file.name.endsWith('.html')) {
      totalHtmlCount++;
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('cusdis_thread')) {
        foundCount++;
        if (foundCount <= 3) { // 只显示前3个
          console.log(`✅ 第 ${foundCount} 个: ${fullPath}`);
        }
      }
    }
  }
}

if (fs.existsSync(bookDir)) {
  checkDirectory(bookDir);
  
  console.log(`\n📊 统计结果:`);
  console.log(`   找到包含Cusdis的文件: ${foundCount} 个`);
  console.log(`   总HTML文件数: ${totalHtmlCount} 个`);
  console.log(`   注入比例: ${Math.round((foundCount/totalHtmlCount)*100)}%`);
  
  if (foundCount === 0) {
    console.log('\n❌ 未找到任何Cusdis代码，注入可能失败！');
  } else if (foundCount === totalHtmlCount) {
    console.log('\n🎉 所有HTML文件都已成功注入Cusdis代码！');
  }
} else {
  console.log('❌ _book 目录不存在，请先运行 gitbook build');
}