'use strict';

// GitHub Pages 以 gh-pages 分支发布时会先跑一遍 Jekyll，
// 这里在 generate 结束后补一个 .nojekyll，让 Pages 直接原样发布静态文件
// （避免 Jekyll 对中文路径、文件夹的处理差异）。
//
// 注意：必须用 generateAfter 事件而不是 after_generate 过滤器，
// 后者在文件真正写入 public/ 之前就触发，public 目录可能还不存在。
const fs = require('fs');
const path = require('path');

hexo.on('generateAfter', () => {
  const file = path.join(hexo.public_dir, '.nojekyll');
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (!fs.existsSync(file)) fs.writeFileSync(file, '');
  } catch (e) {
    hexo.log.warn('failed to write .nojekyll: ' + e.message);
  }
});
