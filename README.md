# MERCARDER's blog（Hexo 源码）

线上站点：https://zhiyue8200.github.io

## 分支约定

- `main`：**Hexo 源码**（本分支）
- `gh-pages`：构建产物，由本地 `npm run publish` 推送，GitHub Pages 从这里发布
- `site-archive`：迁移前 `hexo-deployer-git` 强推的历史快照，仅作备份，可删除

## 部署方式（二选一，不要混用）

Settings → Pages → Build and deployment 的 Source 决定了谁来构建站点，两种模式互斥：

### 方案 A：`gh-pages` 分支发布（当前采用）

- Source：**Deploy from a branch**
- Branch：**`gh-pages`**，目录 **`/ (root)`**

`main` 只放源码，产物由本地 `npm run publish` 推到 `gh-pages`。该分支根目录有 `.nojekyll`，
GitHub Pages 会直接原样发布，不再跑 Jekyll。Actions 不参与构建，`deploy.yml` 保持改名后的
`deploy.yml.disable`（当前账号因账单被锁，Actions 作业无法启动：
`The job was not started because your account is locked due to a billing issue`）。

### 方案 B：GitHub Actions 发布（账单恢复后可选）

- Source：**GitHub Actions**
- 把 `.github/workflows/deploy.yml.disable` 改回 `.github/workflows/deploy.yml` 并提交

之后 push 到 `main` 会自动跑 Hexo 构建，再用 `actions/deploy-pages` 发布，
这时 `gh-pages` 分支不再需要，也不要让 Source 指回分支。

## 常见报错

### `github-pages 232 | Error: The chic theme could not be found.`

**这不是 Hexo 的报错**，而是 GitHub Pages 内置的 Jekyll 构建在报错：
日志里的 `github-pages 232` 是 Jekyll 的 `github-pages` gem 版本。

原因：Pages 的 Source 被设成了「Deploy from a branch」并指向 **`main`**。Jekyll 读到 Hexo 的
`_config.yml`，把 `theme: Chic` 当成一个 Jekyll 主题 gem 去找，自然找不到。

修复：

- 继续用 `gh-pages`：按「方案 A」把 Source 分支改为 **`gh-pages`**（根目录的 `.nojekyll` 会让 Jekyll 跳过）；
- 或改用 Actions：按「方案 B」把 Source 改成 **GitHub Actions** 并恢复 workflow。

验证 `gh-pages` 内容：`git ls-tree origin/gh-pages .nojekyll` 应当能查到文件。

## 在新机器上拉取并写作

```bash
# 只拉源码分支（gh-pages 是产物，不需要 checkout）
git clone -b main --single-branch git@github.com:zhiyue8200/zhiyue8200.github.io.git
cd zhiyue8200.github.io
npm ci                       # .npmrc 已指定 npmmirror 源
npx hexo new post "标题"
npm run server               # 预览
npm run publish              # 发布产物到 gh-pages
git add -A && git commit -m "post: 标题" && git push
```

前置条件：

- 该机器已把公钥加到 GitHub（推送走 SSH，勿用 HTTPS，国内 `github.com:443` 常常不通）
- 有 Node 18+（本地用户级安装即可：`~/.local/node`）

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
- `.gitattributes` 统一为 LF，避免 Windows 侧 checkout 产生整文件 CRLF 差异
- 每次 `npm run publish` 都是对 `gh-pages` 的强推（`--force`），换机器后 `gh-pages` 历史会重新开始；产物分支无需保留历史
