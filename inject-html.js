// inject-html.js - 用于在构建后向HTML文件注入Cusdis代码
const fs = require('fs');
const path = require('path');

console.log('🔧 开始注入Cusdis评论代码到HTML文件...');

// 要注入的Cusdis代码（简化版，确保可工作）
const cusdisCode = `
<!-- 由构建脚本自动注入的Cusdis评论框 -->
<div id="cusdis_thread"
  data-host="https://cusdis.com"
  data-app-id="24a2671a-d7a9-4a16-8c77-a5126cfb10"
  data-page-id="yocto-docs"
  data-page-title="Yocto文档"
  data-theme="light"
  style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee;"
></div>
<script async defer src="https://cusdis.com/js/cusdis.es.js"></script>
<!-- 注入结束 -->
`;

// 处理单个HTML文件
function processFile(filePath) {
  try {
    console.log(`  处理: ${path.relative(process.cwd(), filePath)}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经处理过
    if (content.includes('cusdis_thread')) {
      console.log('    ⏩ 已包含Cusdis，跳过');
      return false;
    }
    
    // 在</body>标签前插入代码
    if (content.includes('</body>')) {
      const newContent = content.replace('</body>', `${cusdisCode}\n</body>`);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('    ✅ 注入成功');
      return true;
    } else {
      console.log('    ⚠️  未找到</body>标签，跳过');
      return false;
    }
  } catch (error) {
    console.log(`    ❌ 错误: ${error.message}`);
    return false;
  }
}

// 主函数
function main() {
  const bookDir = path.join(__dirname, '_book');
  
  if (!fs.existsSync(bookDir)) {
    console.error('❌ 错误: _book 目录不存在，请先运行 gitbook build');
    process.exit(1);
  }
  
  console.log(`📁 扫描目录: ${bookDir}`);
  
  let processedCount = 0;
  let skippedCount = 0;
  
  // 递归遍历目录
  function walk(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.html')) {
        if (processFile(fullPath)) {
          processedCount++;
        } else {
          skippedCount++;
        }
      }
    }
  }
  
  walk(bookDir);
  
  console.log('\n📊 注入结果:');
  console.log(`  成功注入: ${processedCount} 个文件`);
  console.log(`  跳过: ${skippedCount} 个文件`);
  console.log(`  总计处理: ${processedCount + skippedCount} 个HTML文件`);
  
  if (processedCount > 0) {
    console.log('\n✅ 注入完成！请检查 _book 目录下的HTML文件。');
  } else {
    console.log('\n⚠️  未注入任何文件，可能已经包含Cusdis或没有HTML文件。');
  }
}

// 运行
main();