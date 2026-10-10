#!/usr/bin/env node
// 种子脚本：把 data-sources/resources-verified.json（人工核实数据）
// 转换为 src/data/resources/ 与 src/data/collections/ 下的 Markdown 内容文件。
// 用法：node scripts/seed-content.mjs
// 说明：正文（主要功能/优缺点等）为本脚本内置的策展内容，基于核实时的公开信息撰写。
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(
  readFileSync(join(root, 'data-sources/resources-verified.json'), 'utf-8')
);

// 分类映射（中文 → 站点 id）
const CAT = {
  'AI 工具': 'ai',
  '效率软件': 'efficiency',
  '开发工具': 'dev',
  '设计/图像': 'design',
  '知识/笔记': 'knowledge',
  '学习资源': 'learning',
};

// 每条资源的站点元数据：slug / 价格类型 / 标签 / 平台 / 正文
const META = {
  'DeepSeek（深度求索）': {
    slug: 'deepseek',
    pricingType: 'freemium',
    platforms: '网页 / iOS / Android',
    tags: ['国产大模型', '免费', 'API便宜', '深度思考'],
    featured: true,
    body: `## 主要功能

- **深度思考对话**：网页与 App 免费提供推理型对话，数学与代码场景表现突出
- **联网搜索**：对话中可联网查资料，答案带来源
- **API 开放平台**：按 token 计费，定价页公开，高峰/空闲时段不同价
- **开源权重**：模型权重开源，可自行部署

## 适用人群

日常需要中文 AI 对话、又希望免费且国内直连的用户；开发者可用 API 低成本构建应用。

## 优缺点

- ✅ 网页和 App 完全免费，无次数焦虑
- ✅ 国内访问流畅，无需代理
- ✅ API 便宜，开源生态活跃
- ❌ 高峰期偶尔排队或响应变慢
- ❌ 多模态能力弱于部分付费竞品

## 使用建议

日常问答、写作、编程直接用网页版；构建应用时对比 API 价格再选型，空闲时段调用更省。`,
  },
  'Kimi（月之暗面）': {
    slug: 'kimi',
    pricingType: 'freemium',
    platforms: '网页 / iOS / Android',
    tags: ['长文本', '深度研究', 'Agent', '免费'],
    featured: true,
    body: `## 主要功能

- **长文本理解**：主打超长文档阅读与摘要
- **深度研究模式**：自动多轮检索、汇总，输出带引用的研究报告
- **智能体任务**：可执行多步骤的 Agent 任务
- **API**：按 token 计价，缓存命中单独计费

## 适用人群

需要精读长文档（论文、合同、财报）、做资料整理与调研的用户。

## 优缺点

- ✅ 长文档能力国内第一梯队，网页端免费
- ✅ 深度研究适合替代人工翻资料
- ❌ API 按量计费，重度调用有成本
- ❌ 高峰期免费档可能限流

## 使用建议

读长文档先用网页版；接 API 时注意缓存计费规则能显著降本。`,
  },
  '豆包（字节跳动）': {
    slug: 'doubao',
    pricingType: 'freemium',
    platforms: '网页 / iOS / Android',
    tags: ['字节跳动', '多模态', '免费', '图像视频'],
    body: `## 主要功能

- **对话问答与写作**：中文语境优化，风格自然
- **图像与视频生成**：内置文生图、文生视频能力
- **AI 搜索**：联网问答带来源
- **生态联动**：与字节系产品深度整合

## 适用人群

日常问答、内容创作，以及需要快速出图、出短视频的用户。

## 优缺点

- ✅ 基础功能免费，功能全面
- ✅ 中文场景体验好，App 端流畅
- ❌ 付费订阅档位价格未在官网直接公示（媒体报道约 ¥68/¥200/¥500 每月）
- ❌ 生成内容质量偶有不稳定

## 使用建议

重度使用者留意官方 App 内的订阅说明，以实时价格为准。`,
  },
  '通义千问（Qwen）': {
    slug: 'qwen',
    pricingType: 'freemium',
    platforms: '网页 / iOS / Android',
    tags: ['阿里云', '开源模型', '免费额度', '千问'],
    body: `## 主要功能

- **C 端对话免费**：网页与 App 免费（未登录限 1 轮体验）
- **开源 Qwen 模型**：系列模型权重开源，生态庞大
- **API 免费额度**：新用户可领大额免费 token，超出按量计费
- **办公场景**：文档解析、PPT、代码等场景化能力

## 适用人群

个人用户问答写作；开发者调用国内合规的国产模型 API。

## 优缺点

- ✅ 开源模型生态国内最强之一
- ✅ API 新用户免费额度大方
- ❌ 未登录时限制明显
- ❌ 功能迭代快，文档偶有滞后

## 使用建议

开发者先领免费额度验证效果；选型时关注上下文长度与价格档位。`,
  },
  '智谱清言（ChatGLM）': {
    slug: 'chatglm',
    pricingType: 'freemium',
    platforms: '网页 / iOS / Android',
    tags: ['智谱AI', '开源', '学术', '长文档'],
    body: `## 主要功能

- **注册免费对话**：GLM 系列模型，中文能力扎实
- **开源模型**：GLM 权重开源，可本地部署
- **学术与数据分析**：论文解读、数据分析场景见长
- **开放平台**：免费 Flash 模型 + 按量付费高阶模型

## 适用人群

学术研究、长文档处理、需要私有化部署的团队。

## 优缺点

- ✅ 开源可自部署，合规友好
- ✅ 学术场景能力突出
- ❌ 会员价格未在官网直接公示（第三方资料约 ¥79/月）
- ❌ 高峰期免费档限流

## 使用建议

团队私有化部署优先看开源 GLM；个人用免费档即可覆盖日常需求。`,
  },
  '秘塔 AI 搜索': {
    slug: 'metaso',
    pricingType: 'freemium',
    platforms: '网页 / iOS / Android',
    tags: ['AI搜索', '无广告', '带引用', '论文'],
    body: `## 主要功能

- **无广告 AI 搜索**：结果聚合为结构化答案，附来源引用
- **学术模式**：检索中英文论文，适合写文献综述
- **学点啥**：把搜索结果整理成学习大纲
- **视频与幻灯片生成**：辅助内容创作

## 适用人群

查资料要看到来源的写作者、学生、研究人员。

## 优缺点

- ✅ 答案带引用，可溯源核验
- ✅ 无广告，界面干净
- ❌ 会员功能需付费（第三方核实约 ¥39/月，以实时价格为准）
- ❌ 冷门领域语料覆盖有限

## 使用建议

写论文、做调研时作为第一检索入口；引用前点开来源核对原文。`,
  },
  '腾讯元宝': {
    slug: 'yuanbao',
    pricingType: 'free',
    platforms: '网页 / iOS / Android / 微信小程序',
    tags: ['腾讯', '混元', 'DeepSeek', '微信生态'],
    body: `## 主要功能

- **双引擎**：混元 + DeepSeek 模型，可按需切换
- **微信生态信源**：可检索公众号、视频号内容，独家优势
- **文档解析**：支持上传文档问答
- **完全免费**：网页版与 App 均无付费墙

## 适用人群

想免费使用国产大模型、且需要检索微信生态内容的用户。

## 优缺点

- ✅ 完全免费，无使用门槛
- ✅ 微信生态信源检索独此一家
- ❌ 需现代浏览器（旧浏览器可能打不开）
- ❌ 功能迭代节奏快，稳定性偶有波动

## 使用建议

查公众号相关内容优先用它；多模型对比回答质量时切换引擎试试。`,
  },
  '讯飞星火': {
    slug: 'xinghuo',
    pricingType: 'freemium',
    platforms: '网页 / iOS / Android',
    tags: ['科大讯飞', '语音', '办公', '免费额度'],
    body: `## 主要功能

- **语音交互**：语音输入输出体验成熟，适合开车、办公场景
- **文档能力**：长文档解析、PPT 生成
- **API 免费额度**：Lite 版可领免费额度，高阶模型按量付费
- **行业方案**：教育、办公等垂直场景优化

## 适用人群

重度语音交互用户、办公文档处理、需要 API 接入的开发者。

## 优缺点

- ✅ 语音交互国内第一梯队
- ✅ 基础对话免费
- ❌ 高阶模型（Ultra 等）按量付费不便宜
- ❌ 套餐调整频繁（Max 已于 2026-03 并入 Ultra）

## 使用建议

语音场景直接用 App；接 API 先用 Lite 免费额度验证再评估付费。`,
  },
  'uTools': {
    slug: 'utools',
    pricingType: 'freemium',
    platforms: 'Windows / macOS / Linux',
    tags: ['插件平台', '快捷启动', 'OCR', '截图'],
    featured: true,
    body: `## 主要功能

- **快捷启动**：Alt+Space 呼出搜索框，直达文件、软件、网页与插件
- **超级面板**：选中文字一键翻译、搜索、截图 OCR、以图搜图
- **3000+ 插件**：官方插件市场覆盖翻译、正则、压缩、JSON 处理等
- **数据同步**：会员支持跨设备配置同步

## 适用人群

Windows/macOS 重度用户；希望用一个工具替代多个零散小软件的效率玩家。

## 优缺点

- ✅ 基础功能永久免费（官方 FAQ 核实），本地运行无隐私顾虑
- ✅ 插件按需安装，启动速度快
- ❌ 部分高级插件与数据同步需要会员（第三方资料约 ¥99/年）
- ❌ 插件质量参差，需自行甄别

## 使用建议

先只用免费功能体验一周，习惯后再决定是否订阅会员。`,
  },
  'Quicker': {
    slug: 'quicker',
    pricingType: 'freemium',
    platforms: 'Windows',
    tags: ['Windows', '快捷面板', '自动化', 'OCR'],
    body: `## 主要功能

- **鼠标中键弹出面板**：为常用操作建立捷径，一键直达
- **动作库**：社区共享大量现成动作（OCR、翻译、批量处理）
- **自动化**：组合键、脚本扩展，Windows 上少有的轻量自动化工具
- **免费版可用**：10 个应用设置、OCR 每日 100 次等限制

## 适用人群

Windows 用户，尤其是鼠标重度使用者与重复操作多的办公人群。

## 优缺点

- ✅ 免费版覆盖基础需求，专业版也不贵（限时约 ¥57.6/年）
- ✅ 动作库生态成熟
- ❌ 免费版有明确次数/数量限制
- ❌ 仅支持 Windows

## 使用建议

轻度使用免费版足够；每天重复操作超过 20 次就值得上专业版。`,
  },
  'Snipaste': {
    slug: 'snipaste',
    pricingType: 'freemium',
    platforms: 'Windows / macOS',
    tags: ['截图', '贴图', '取色', '标注'],
    body: `## 主要功能

- **截图贴图**：F1 截图、F3 把截图钉在屏幕上，对照资料不切窗口
- **标注取色**：内置标注工具与屏幕取色器
- **历史回放**：回看截图过程，方便找细节
- **轻量**：安装包小，常驻内存低

## 适用人群

经常边看资料边操作的办公、学习、设计人群。

## 优缺点

- ✅ 个人使用永久免费（官网明确）
- ✅ 贴图功能护城河，替代品少
- ❌ 2.0 起商业使用需付费授权（1.x 仍免费）
- ❌ 无云同步

## 使用建议

个人学习工作免费版完全够用；公司商用前确认授权条款。`,
  },
  'Everything': {
    slug: 'everything',
    pricingType: 'free',
    platforms: 'Windows',
    tags: ['文件搜索', '秒搜', '轻量', 'Windows'],
    body: `## 主要功能

- **文件名秒搜**：基于名称实时索引，百万文件毫秒级出结果
- **高级语法**：支持通配符、正则、布尔检索
- **HTTP/FTP 服务器**：可搭建局域网文件搜索服务（服务器商业部署需站点许可）
- **极致轻量**：安装包 MB 级，常驻内存极小

## 适用人群

所有 Windows 用户；文件多、找文件痛苦的人群尤甚。

## 优缺点

- ✅ 完全免费（官方 FAQ 明确 Freeware，MIT 风格许可）
- ✅ 速度是 Windows 自带搜索的几十倍
- ❌ 仅索引文件名，不搜索文件内容
- ❌ 界面朴素，进阶语法有学习成本

## 使用建议

装完设开机自启+全局热键，替代系统搜索；找文件内容再搭配 AnyTXT 之类。`,
  },
  'Microsoft PowerToys': {
    slug: 'powertoys',
    pricingType: 'open-source',
    platforms: 'Windows',
    tags: ['微软官方', '窗口布局', '批量重命名', '开源'],
    body: `## 主要功能

- **窗口布局**：FancyZones 自定义分屏区域
- **批量重命名**：PowerRename 支持正则批量改名
- **取色/标尺/文本提取**：Color Picker、Screen Ruler、Text Extractor
- **20+ 实用工具**：按需开关，微软官方持续维护

## 适用人群

Windows 高级用户，想要系统级增强但不想装杂牌工具的人。

## 优缺点

- ✅ 微软官方出品，完全免费开源
- ✅ 每个模块独立开关，不强制全开
- ❌ 部分功能与其他第三方工具重叠，按需取舍
- ❌ 仅 Windows

## 使用建议

优先开启 FancyZones + PowerToys Run + 文本提取三件套，覆盖多数场景。`,
  },
  'DropIt': {
    slug: 'dropit',
    pricingType: 'open-source',
    platforms: 'Windows',
    tags: ['文件整理', '拖拽', '归档', '便携'],
    body: `## 主要功能

- **拖拽即整理**：把文件拖到悬浮图标上，按预设规则自动分类
- **规则灵活**：按扩展名/名称/日期自动移动、复制、压缩、重命名
- **便携版**：免安装，U 盘随身带
- **GPL 开源**：完全免费

## 适用人群

下载文件夹长期混乱、需要自动归档规则的人。

## 优缺点

- ✅ 规则一次配置长期生效，彻底告别手动整理
- ✅ 开源免费，便携版友好
- ❌ 近年更新停滞（最新版 2018），界面老派
- ❌ 规则设置对新手有门槛

## 使用建议

给它 10 分钟配好「下载文件夹」归档规则，之后每月省几小时。`,
  },
  'Visual Studio Code（VS Code）': {
    slug: 'vscode',
    pricingType: 'open-source',
    platforms: 'Windows / macOS / Linux',
    tags: ['编辑器', '插件生态', '跨平台', '开源'],
    featured: true,
    body: `## 主要功能

- **跨平台编辑器**：一套配置三端通用
- **插件生态**：市场数万插件，语言/工具/主题全覆盖
- **内置 AI**：Copilot 补全、多智能体开发模式
- **远程开发**：SSH/WSL/容器远程开发体验成熟

## 适用人群

几乎所有写代码的人；前端、脚本、运维、数据都是主力场景。

## 优缺点

- ✅ 完全免费（MIT 开源，官方许可核实）
- ✅ 插件生态与教程资源无人能及
- ❌ 大项目启动与索引速度不如部分 IDE
- ❌ 插件装太多会明显拖慢启动

## 使用建议

坚持「少插件、精配置」；配置同步用 Settings Sync 官方方案。`,
  },
  'Cursor': {
    slug: 'cursor',
    pricingType: 'freemium',
    platforms: 'Windows / macOS / Linux',
    tags: ['AI编辑器', 'Agent', 'Composer', '免费额度'],
    body: `## 主要功能

- **AI 优先编辑器**：基于 VS Code 深度改造，AI 融入每个环节
- **Agent 模式**：描述需求，AI 跨文件自主改代码
- **Composer**：多文件同时生成的编辑模式
- **前沿模型**：可用 Claude、GPT 等最新模型

## 适用人群

想用 AI 大幅提速的开发者；愿意付费换效率的团队。

## 优缺点

- ✅ Hobby 免费档可体验核心功能
- ✅ Agent 编程体验目前第一梯队
- ❌ Individual $20/月 起，重度使用成本高
- ❌ 免费档 Agent 请求次数有限

## 使用建议

先用免费档跑一周真实项目评估效率提升，再决定是否订阅。`,
  },
  'GitHub Copilot': {
    slug: 'copilot',
    pricingType: 'freemium',
    platforms: 'VS Code / JetBrains / Neovim / CLI',
    tags: ['GitHub', '代码补全', '免费档', 'Agent模式'],
    body: `## 主要功能

- **代码补全**：行内/整段补全，支持主流编辑器
- **Agent 模式**：在编辑器内自主完成多文件任务
- **CLI**：命令行里的 AI 助手
- **免费档**：Free 计划每月 2000 次补全 + 有限聊天用量（仅个人）

## 适用人群

所有开发者；学生、开源贡献者、想低成本尝鲜 AI 编程的人。

## 优缺点

- ✅ Free 计划个人免费，门槛低
- ✅ 与 GitHub 工作流深度整合
- ❌ 免费档额度用完体验受限，Pro $15/月 起
- ❌ 2026-06 起付费用量改走 AI Credits，计费方式变复杂

## 使用建议

个人用户先用 Free 档；学生和热门开源项目维护者可申请免费 Pro。`,
  },
  'Trae（字节跳动）': {
    slug: 'trae',
    pricingType: 'freemium',
    platforms: 'Windows / macOS / Linux',
    tags: ['字节跳动', '中文界面', '免费积分', 'AI IDE'],
    body: `## 主要功能

- **免费 AI 编程 IDE**：中文界面，基于 VS Code 生态
- **注册送积分**：新用户 4500 积分免费体验
- **Builder 模式**：描述需求生成完整项目骨架
- **国产模型加持**：国内访问稳定，无需代理

## 适用人群

想免费用 AI 编程 IDE 的国内开发者；Windsurf 老用户找替代的人。

## 优缺点

- ✅ 中文界面 + 国内直连，零门槛
- ✅ 注册送积分，免费期够深度体验
- ❌ 积分用完需购买积分包或订阅
- ❌ 生态插件少于 Cursor/VS Code

## 使用建议

作为 Windsurf 的国内可用替代先体验；重度用户对比积分消耗速度再付费。`,
  },
  'Photopea': {
    slug: 'photopea',
    pricingType: 'freemium',
    platforms: '浏览器',
    tags: ['在线PS', 'PSD', '免安装', '修图'],
    featured: true,
    body: `## 主要功能

- **浏览器里的 Photoshop**：完整图层、滤镜、蒙版、钢笔工具
- **PSD 全兼容**：打开/导出 PSD，与本地 PS 无缝衔接
- **本地运行**：文件不上传服务器，隐私友好
- **格式齐全**：Sketch、XD、RAW 等都能处理

## 适用人群

临时要修图但没装 PS 的人；处理 PSD 的跨平台协作场景。

## 优缺点

- ✅ 全部功能免费（带广告，官网明示）
- ✅ 打开即用，文件本地处理
- ❌ 免费版有广告
- ❌ 复杂大文件（几百 MB）会卡

## 使用建议

日常修图、改稿直接开网页用；广告烦了再考虑 Premium（第三方报道约 $5/月）。`,
  },
  'TinyPNG': {
    slug: 'tinypng',
    pricingType: 'freemium',
    platforms: '浏览器 / API',
    tags: ['图片压缩', '批量', 'WebP', '建站必备'],
    body: `## 主要功能

- **智能压缩**：PNG/JPEG/WebP/AVIF 拖入即压，肉眼无损
- **批量网页版**：每次最多 20 张、单张 ≤5MB
- **开发者 API**：每月前 500 张免费，超出 $0.009/张
- **Photoshop 插件**：设计流程内直接压缩导出

## 适用人群

建站者（图片体积直接影响加载速度）、需要批量瘦身的运营。

## 优缺点

- ✅ 压缩率高，画质损失肉眼难辨
- ✅ 网页版即开即用，免费额度日常够用
- ❌ 超过 500 张/月要付费
- ❌ 单张上限 5MB

## 使用建议

建站图片上传前统一过一遍；月压缩量超 500 张再考虑 API 付费或本地工具替代。`,
  },
  'IconPark（字节图标库）': {
    slug: 'iconpark',
    pricingType: 'open-source',
    platforms: 'Web / 代码库',
    tags: ['图标库', '字节跳动', '开源', '可商用'],
    body: `## 主要功能

- **2600+ 图标**：覆盖常见 UI 场景
- **多主题风格**：线性、填充、双色、多色一套图标多风格
- **多格式导出**：SVG/PNG/React/Vue 组件直接复制
- **Apache 2.0**：可免费商用（GitHub 仓库核实）

## 适用人群

UI 设计师、前端开发者找成套图标。

## 优缺点

- ✅ 免费可商用，授权干净
- ✅ 风格统一，导出格式全
- ❌ GitHub 仓库已归档（2023-02 后停更），但站点仍可用
- ❌ 图标风格偏字节体系，品牌个性项目需甄选

## 使用建议

中后台项目成套使用效率最高；品牌向项目挑单图标用。`,
  },
  '可画 Canva': {
    slug: 'canva',
    pricingType: 'freemium',
    platforms: '浏览器 / iOS / Android',
    tags: ['在线设计', '模板', 'PPT', '社媒配图'],
    body: `## 主要功能

- **海量模板**：海报、PPT、公众号封面、社媒图，改字即用
- **拖拽编辑**：零设计基础也能出图
- **AI 工具**：Magic Write 文案、AI 生图等（免费档有终身额度）
- **团队协作**：品牌套件、评论协作（Pro 档）

## 适用人群

不会 PS 但要经常做图的人：运营、自媒体、教师、小商家。

## 优缺点

- ✅ 免费版 8 万+ 模板、5GB 存储，日常够用
- ✅ 上手零门槛，出图快
- ❌ AI 功能免费档额度有限（Magic Write 终身 50 次）
- ❌ Pro 功能（品牌套件等）需 CN¥168/年

## 使用建议

日常配图免费版足够；注意 AI 额度是终身制，省着用。`,
  },
  'Obsidian': {
    slug: 'obsidian',
    pricingType: 'freemium',
    platforms: 'Windows / macOS / Linux / iOS / Android',
    tags: ['双链笔记', '本地优先', '知识图谱', '插件'],
    featured: true,
    body: `## 主要功能

- **本地 Markdown 笔记**：文件就是纯文本 md，永不锁定
- **双链与图谱**：笔记间互链，关系图谱可视化
- **插件生态**：社区插件数千个，Dataview、Excalidraw 等
- **可选付费服务**：官方 Sync 同步 $4/月、Publish 发布 $8/月

## 适用人群

想建个人知识库、重视数据所有权的人；学生、研究者、知识工作者。

## 优缺点

- ✅ 个人使用完全免费（官网明确：Free without limits）
- ✅ 本地纯文本，迁移成本为零
- ❌ 同步/发布要付费（或用第三方网盘+Git 平替）
- ❌ 插件玩法多，新手容易陷入「折腾工具」

## 使用建议

先只用核心功能写两周笔记，再按需装插件；同步用 iCloud/Git 平替官方 Sync。`,
  },
  '思源笔记': {
    slug: 'siyuan',
    pricingType: 'freemium',
    platforms: 'Windows / macOS / Linux / iOS / Android / Docker',
    tags: ['块编辑', '双链', '自托管', '隐私'],
    body: `## 主要功能

- **块级引用**：块是基本单位，引用粒度细到段落
- **双向链接**：自动反链，知识网络自动生长
- **本地优先 + 加密同步**：数据在本地，端到端加密同步
- **开源可自托管**：AGPL-3.0，Docker 一把梭部署服务器

## 适用人群

重视隐私、想完全掌控数据的用户；Notion 类工具的数据焦虑者。

## 优缺点

- ✅ 本地功能完全免费，开源可审计
- ✅ 自托管方案成熟，数据 100% 自己掌握
- ❌ 部分功能特性需一次付费 ¥80（或订阅 ¥148/年含 8G 云存储）
- ❌ 上手有学习曲线

## 使用建议

技术用户直接 Docker 自托管；纯本地使用免费版已覆盖 90% 需求。`,
  },
  'Notion': {
    slug: 'notion',
    pricingType: 'freemium',
    platforms: '浏览器 / 桌面端 / iOS / Android',
    tags: ['数据库', '协作', 'AI工作空间', '模板'],
    body: `## 主要功能

- **All-in-one**：文档、数据库、看板、日历、Wiki 一个工具全包
- **数据库视图**：同一份数据切换表格/看板/画廊/日历
- **协作**：评论、@提醒、权限管理成熟
- **Notion AI**：内置 AI 写作与问答（免费版含试用）

## 适用人群

个人知识管理 + 轻项目协作；内容团队、学生项目组。

## 优缺点

- ✅ 免费版个人功能完整（官网定价核实）
- ✅ 模板生态极大，抄模板就能用
- ❌ 国内访问速度不稳定，偶有卡顿
- ❌ 深度使用后数据库变大可能变慢

## 使用建议

从官方模板起步，不要从空白页开始；数据定期导出备份。`,
  },
  '菜鸟教程': {
    slug: 'runoob',
    pricingType: 'free',
    platforms: '网页',
    tags: ['编程入门', '在线实例', '速查', '中文'],
    body: `## 主要功能

- **中文编程入门**：HTML/CSS/JS/Python/Java/数据库等全科覆盖
- **在线实例**：每个知识点配「试一试」编辑器，边学边跑
- **速查手册**：API 语法速查表，当字典翻
- **完全免费**：无需注册，全部教程开放

## 适用人群

编程零基础入门者；需要快速回忆语法点的开发者。

## 优缺点

- ✅ 中文教程里覆盖最全的入门站之一
- ✅ 在线实例降低上手门槛
- ❌ 内容靠广告维持，页面有广告
- ❌ 深度不如官方文档，进阶需换资料

## 使用建议

用它建立知识地图，具体细节查 MDN/官方文档；注意甄别过时章节。`,
  },
  '现代 JavaScript 教程（中文版）': {
    slug: 'javascript-tutorial',
    pricingType: 'open-source',
    platforms: '网页',
    tags: ['JavaScript', '系统教程', '开源', '前端'],
    body: `## 主要功能

- **系统 JS 教程**：从变量、类型到异步、模块，循序渐进
- **习题与任务**：每章配练习，答案可验证
- **中文开源**：GitHub 中文版仓库持续更新
- **被官方推荐**：React 官网与 MDN 都推荐过它

## 适用人群

想系统学前端的人；JS 基础不牢想补课的老手。

## 优缺点

- ✅ 体系完整，质量是中文教程天花板级
- ✅ 永久免费开源
- ❌ 纯文字教程，需要自制力
- ❌ 无视频讲解

## 使用建议

作为前端主线教材配合练习过一遍；之后按章节当参考书回查。`,
  },
  'freeCodeCamp（中文）': {
    slug: 'freecodecamp',
    pricingType: 'open-source',
    platforms: '网页',
    tags: ['免费课程', '认证证书', '实战项目', '非营利'],
    body: `## 主要功能

- **免费课程体系**：响应式设计、JS 算法、前端库、数据分析等
- **实战项目**：每阶段以真实项目收尾，做完才能拿证
- **认证证书**：通过项目后获得免费证书，可放 LinkedIn
- **社区**：论坛与 Discord 活跃

## 适用人群

想系统自学编程并拿证书背书的人；转行储备期学习者。

## 优缺点

- ✅ 完全免费（501(c)(3) 非营利，靠捐赠运营）
- ✅ 项目制学习，学完即有作品集
- ❌ 证书行业认可度有限，不如系统学历/大厂实习
- ❌ 部分课程更新慢于技术演进

## 使用建议

每天固定 1-2 小时按顺序推进；把项目部署上线放进作品集。`,
  },
};

// 未核实资源跳过（Windsurf 已并入 Devin）
const skipped = [];

const resDir = join(root, 'src/data/resources');
const colDir = join(root, 'src/data/collections');
mkdirSync(resDir, { recursive: true });
mkdirSync(colDir, { recursive: true });

// 清空旧资源目录（重新生成，保证与核实数据一致）
for (const f of ['deepseek.md', 'utools.md']) {
  const p = join(resDir, f);
  if (existsSync(p)) rmSync(p);
}

const slugSet = new Set();
const catCount = {};
for (const item of raw) {
  const meta = META[item.name];
  if (!meta) {
    skipped.push(`${item.name}（无站点元数据，跳过）`);
    continue;
  }
  if (!item.verified) {
    skipped.push(`${item.name}（官网未核实，跳过）`);
    continue;
  }
  if (slugSet.has(meta.slug)) {
    skipped.push(`${item.name}（slug 重复：${meta.slug}）`);
    continue;
  }
  slugSet.add(meta.slug);

  const cat = CAT[item.category];
  if (!cat) {
    skipped.push(`${item.name}（未知分类：${item.category}）`);
    continue;
  }
  catCount[cat] = (catCount[cat] || 0) + 1;

  const enName = (item.name.match(/（(.+?)）/) || [])[1] || '';
  const fm = [
    '---',
    `name: ${item.name.split('（')[0].trim()}`,
    ...(enName ? [`enName: ${enName}`] : []),
    `url: ${item.url}`,
    `category: ${cat}`,
    `tags: [${meta.tags.join(', ')}]`,
    `pricing: ${JSON.stringify(item.pricing)}`,
    `pricingType: ${meta.pricingType}`,
    `platforms: ${meta.platforms}`,
    `summary: ${JSON.stringify(item.summary)}`,
    `featured: ${meta.featured ? 'true' : 'false'}`,
    `added: ${item.verified_date}`,
    `verifiedDate: ${item.verified_date}`,
    '---',
    '',
  ].join('\n');

  writeFileSync(join(resDir, `${meta.slug}.md`), fm + meta.body + '\n', 'utf-8');
}

// 专题合集
const collections = [
  {
    slug: 'ai-toolbox',
    title: '国产 AI 助手大全',
    description: '八个免费或基础免费的国产 AI 对话与搜索工具：长文档、深度研究、多模态、语音交互各有强项，按需选用。',
    icon: '🤖',
    featured: true,
    resources: ['deepseek', 'kimi', 'doubao', 'qwen', 'chatglm', 'metaso', 'yuanbao', 'xinghuo'],
  },
  {
    slug: 'windows-toolbox',
    title: 'Windows 效率利器',
    description: '装机必备的免费效率工具组合：秒搜文件、快捷启动、截图贴图、窗口布局、自动归档，一次配好长期受益。',
    icon: '🧰',
    featured: true,
    resources: ['everything', 'utools', 'snipaste', 'powertoys', 'quicker', 'dropit', 'vscode'],
  },
  {
    slug: 'learn-to-code',
    title: '零基础学编程路线',
    description: '免费的自学路线：中文入门教程打底、系统教程补基础、项目实战拿证书，配套编辑器与 AI 助手提速。',
    icon: '🎓',
    featured: true,
    resources: ['runoob', 'javascript-tutorial', 'freecodecamp', 'vscode', 'copilot'],
  },
  {
    slug: 'free-design',
    title: '免费做设计',
    description: '不会 PS 也能出图：浏览器里的修图利器、图片压缩、开源图标库与在线模板平台，全部有免费档。',
    icon: '🎨',
    featured: false,
    resources: ['photopea', 'tinypng', 'iconpark', 'canva'],
  },
  {
    slug: 'knowledge-base',
    title: '个人知识管理',
    description: '把笔记、资料、想法管起来：本地优先与云端协作两条路线，个人使用都有免费方案。',
    icon: '📚',
    featured: false,
    resources: ['obsidian', 'siyuan', 'notion'],
  },
];

for (const c of collections) {
  const missing = c.resources.filter((s) => !slugSet.has(s));
  if (missing.length) {
    skipped.push(`合集 ${c.slug} 引用了不存在的资源：${missing.join(', ')}`);
    continue;
  }
  const fm = [
    '---',
    `title: ${c.title}`,
    `description: ${JSON.stringify(c.description)}`,
    `icon: ${c.icon}`,
    `featured: ${c.featured ? 'true' : 'false'}`,
    `resources: [${c.resources.join(', ')}]`,
    '---',
    '',
    c.description,
    '',
  ].join('\n');
  writeFileSync(join(colDir, `${c.slug}.md`), fm, 'utf-8');
}

// 删除旧的测试合集
const oldCol = join(colDir, 'free-productivity.md');
if (existsSync(oldCol)) rmSync(oldCol);

console.log(`生成资源文件: ${slugSet.size} 个`);
console.log('分类分布:', catCount);
console.log(`生成合集: ${collections.length} 个`);
if (skipped.length) {
  console.log('跳过项:');
  skipped.forEach((s) => console.log(' -', s));
}
