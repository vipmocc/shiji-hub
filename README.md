# 拾集 ShiJi Hub

精选数字资源指南：经人工核实的 AI 工具、效率软件、开发工具与学习资源的中文策展站。

**技术栈**：Astro 5（静态生成）+ 原生 CSS 设计系统 + Content Collections（Markdown 内容管理）
**托管**：Cloudflare Pages 免费额度
**成本**：0 元/月（无付费数据库、无付费 API、无追踪脚本）

## 本地开发

```bash
npm install          # 已用 npmmirror 镜像（见 .npmrc）
npm run dev          # 本地开发 http://localhost:4321
npm run build        # 构建到 dist/
npm run preview      # 预览构建产物
```

## 内容管理（加 / 改 / 删资源）

### 新增一条资源

1. 在 `src/data/resources/` 下新建 `xxx.md`（文件名即 URL 后缀，用英文小写+连字符）
2. 按此模板填写：

```markdown
---
name: 资源名称
enName: English Name（可选）
url: https://官网地址
category: ai              # ai / efficiency / dev / design / knowledge / learning
tags: [标签1, 标签2]
pricing: 个人免费           # 人类可读的价格描述
pricingType: free         # free / freemium / open-source / paid
platforms: 网页 / Win / macOS   # 可选
summary: 一句话简介（20-50 字）
featured: false           # true 则上首页精选
added: 2026-10-11
verifiedDate: 2026-10-11  # 最近核实日期
---

## 主要功能

- 要点一
- 要点二

## 适用人群

…

## 优缺点

- ✅ 优点
- ❌ 缺点

## 使用建议

…
```

3. `npm run build` 后即可看到效果；`git push` 后自动部署

### 编辑 / 删除

- **编辑**：直接改对应的 `.md` 文件，改完记得更新 `verifiedDate`
- **删除**：删除 `.md` 文件即可；若某专题合集引用了它，一并从 `src/data/collections/` 对应文件里移除

### 维护脚本

```bash
node scripts/check-links.mjs    # 批量检测所有资源官网是否可访问，输出异常清单
```

建议每月跑一次，失效的标 `verifiedDate` 更新或直接下架。

## 部署（Cloudflare Pages）

**当前状态：已上线** → https://shiji-hub.pages.dev

- Pages 项目：`shiji-hub`（wrangler 4.149 通过 OAuth 创建，凭证在 `C:\Users\Eric\AppData\Roaming\xdg.config\.wrangler\config\default.toml`）
- 生产分支：`main`

### 更新部署（本地直传）

改完内容或代码后：

```bash
npm run build                            # 重新构建 dist/
npx wrangler pages deploy dist --project-name=shiji-hub --branch=main
```

部署后会得到一个 `xxx.pages.dev` 预览地址，生产地址始终是 `shiji-hub.pages.dev`。

### 绑定自有域名（可选，免费）

Pages 项目 → Custom domains → 添加子域（如 `nav.你的域名.com`），按提示加 CNAME 记录即可。域名已在 Cloudflare 管理时不产生新费用。

> 注意：本机 `12356495.xyz` 已有 Workers（jack/gemini-proxy）在占用 DNS，新增子域不会冲突，但操作前建议先确认。

## 可选增强：Cloudflare Web Analytics（免费统计）

1. Cloudflare Dashboard → Analytics → Web Analytics → 添加站点（填 `xxx.pages.dev`）
2. 复制生成的 token
3. 把 token 填进 `src/data/site.ts` 的 `analyticsToken` 字段（代码已预留注入逻辑）
4. 重新构建部署

统计脚本为异步加载，失效不影响网站主体功能；不追踪个人隐私，符合国内合规要求。

## 文件结构

```
src/
├── components/       # Header / Footer / ResourceCard / FilterableGrid
├── data/
│   ├── site.ts       # 站点配置、分类、价格标签（改品牌信息改这里）
│   ├── resources/    # 资源数据（每条一个 md）
│   └── collections/  # 专题合集（每条一个 md）
├── layouts/          # BaseLayout（SEO/OG/主题）
├── pages/            # 首页 / 资源目录 / 详情 / 专题 / 关于 / 404
└── styles/global.css # 设计系统（暗色优先，琥珀品牌色）
scripts/
├── check-links.mjs   # 失效链接检测
└── make-og.mjs       # OG 封面图再生成（改了 og-cover.svg 后跑一次）
public/
├── favicon.svg
├── og-cover.png      # 社交分享封面
└── robots.txt
```

## 备份与恢复

- 内容 = `src/data/` 下的 Markdown 文件，随 git 仓库自动备份
- 恢复 = `git clone` + `npm install` + `npm run build` 即可还原
- 部署端无状态：任何时候本地重新构建推上去就是全量恢复
