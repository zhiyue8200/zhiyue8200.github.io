# MERCARDER's blog（Hexo 源码）

线上站点：https://zhiyue8200.github.io

## 分支约定

- `main`：**Hexo 源码**（本分支）
- `gh-pages`：构建产物，由本地 `npm run publish` 推送，GitHub Pages 从这里发布
- `site-archive`：迁移前 `hexo-deployer-git` 强推的历史快照，仅作备份，可删除

## 为什么不用 GitHub Actions

`.github/workflows/deploy.yml` 已写好（Actions 构建 + `actions/deploy-pages`），但当前账号因账单问题被锁，
Actions 作业无法启动（报错：`The job was not started because your account is locked due to a billing issue`）。
账单恢复后可切回该方案：把 Settings → Pages 的 Source 改回 **GitHub Actions** 即可，其他不用动。

## 本地预览

```bash
npm install               # 首次
npx hexo new post "标题"   # 新建文章
npm run server            # http://localhost:4000 预览
```

WSL 下的 Node 装在 `~/.local/node`（v20.20.2，PATH 已写入 `~/.bashrc`）。

## 发布

```bash
npm run publish           # = hexo clean && hexo generate -d，构建并强推 gh-pages
git add -A && git commit -m "post: xxx" && git push   # 源码同步到 main
```

两条都要做：`publish` 只更新线上站点，`push` 只更新源码仓库。

## 注意

- `deploy` 配置里 `ignore_hidden: false` 是必需的，否则 `public/.nojekyll` 不会被部署
- `.nojekyll` 由 `scripts/nojekyll.js` 在 `generateAfter` 事件里生成；不要改成 `after_generate` 过滤器（那时 public 目录还不存在）
- 主题 `themes/Chic` 已从嵌套 git 仓库改为普通目录（原仓库 `Siricee/hexo-theme-Chic`），升级主题需手动比对
- `public/`、`db.json`、`node_modules/`、`.deploy_git/` 均被忽略
