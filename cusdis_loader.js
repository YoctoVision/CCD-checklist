// cusdis_loader.js
(function() {
  console.log('[Cusdis] 加载器初始化...');
  
  // 当GitBook切换页面时，重新加载评论框
  gitbook.events.on('page.change', function() {
    setTimeout(loadCusdis, 100);
  });

  function loadCusdis() {
    console.log('[Cusdis] 开始为当前页面加载评论框');
    
    // --- 1. 清理旧元素 ---
    var oldThread = document.getElementById('cusdis_thread');
    var oldScript = document.querySelector('script[src*="cusdis.com/js/cusdis.es.js"]');
    if (oldThread) oldThread.remove();
    if (oldScript) oldScript.remove();

    // --- 2. 创建评论容器 ---
    var container = document.createElement('div');
    container.id = 'cusdis_thread';
    // 添加一些样式让它更明显
    container.style.cssText = 'margin-top: 50px; padding-top: 20px; border-top: 2px dashed #4CAF50; min-height: 300px;';
    
    // --- 3. 找到GitBook页面内容末尾并插入容器 ---
    // 尝试几个常见的GitBook内容容器选择器
    var contentParent = document.querySelector('.page-inner, .book-body, .body-inner, section.book');
    if (contentParent) {
      contentParent.appendChild(container);
    } else {
      // 如果都找不到，加到body最后
      document.body.appendChild(container);
    }
    console.log('[Cusdis] 评论容器已添加到页面');

    // --- 4. 动态创建并加载Cusdis官方脚本 ---
    var script = document.createElement('script');
    script.async = true;
    script.defer = true;
    // 这是Cusdis的核心脚本地址，来自您后台的代码片段
    script.src = 'https://cusdis.com/js/cusdis.es.js';
    
    // --- 5. 设置必需的数据属性 (使用您自己后台的 app-id) ---
    script.setAttribute('data-host', 'https://cusdis.com');
    script.setAttribute('data-app-id', '24a2671a-d7a9-4a16-8c77-a5126f9cfb10'); // 您的唯一ID
    script.setAttribute('data-page-id', window.location.pathname);
    script.setAttribute('data-page-url', window.location.href);
    script.setAttribute('data-page-title', document.title);
    script.setAttribute('data-theme', 'light'); // 可选：主题

    // --- 6. 将脚本添加到页面，触发Cusdis加载 ---
    document.body.appendChild(script);
    console.log('[Cusdis] 核心脚本已加载，评论框应很快出现。');
  }

  // 页面首次加载时也执行一次
  setTimeout(loadCusdis, 500);
})();