# MERCARDER's blog（Hexo 源码）

线上站点：https://zhiyue8200.github.io

## 分支约定

- `main`：**Hexo 源码**（本分支），不再存放生成产物
- `site-archive`：迁移前由 `hexo-deployer-git` 强推的历史产物快照，仅作备份，可随时删除
- 旧的 `hexo-src` 分支已被 `main` 取代，可删除

## 发布流程

推送到 `main` 即自动发布：

1. GitHub Actions 读取源码，`npm ci` + `npx hexo generate`
2. 产物通过 `actions/deploy-pages` 发布到 GitHub Pages

工作流文件：`.github/workflows/deploy.yml`
仓库 Settings → Pages → Source 必须为 **GitHub Actions**。

## 本地写作

```bash
npm install          # 首次
npx hexo new post "标题"
npx hexo server      # http://localhost:4000 预览
git add -A && git commit -m "post: xxx" && git push
```

## 注意

- `_config.yml` 中的 `deploy` 配置已注释：`hexo-deployer-git` 会用 `--force` 强推，误用会覆盖 `main` 源码
- 主题 `themes/Chic` 已从嵌套 git 仓库改为普通目录（原仓库 `Siricee/hexo-theme-Chic`），升级主题需手动比对
- `public/`、`db.json`、`node_modules/`、`.deploy_git/` 均被忽略
