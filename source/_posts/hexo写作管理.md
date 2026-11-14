---
title: hexo写作管理
date: 2026-11-14 20:28:58
tags: 'hexo'
categories: 'hexo'
---
### 在新机器上拉取并写作

```bash
# 只拉源码分支（gh-pages 是产物，不需要 checkout）

git clone -b main --single-branch git@github.com:zhiyue8200/zhiyue8200.github.io.git

cd zhiyue8200.github.io

# npm方式
npm ci            # .npmrc 已指定 npmmirror 源
npx hexo new post "标题"
npm run server        # 预览
npm run publish        # 发布产物到 gh-pages

# hexo方式
hexo g
hexo s
hexo d

git add -A && git commit -m "post: 标题" && git push

```