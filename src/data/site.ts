export const site = {
  name: '留白',
  enName: 'LIUBAI',
  tagline: '信息越嘈杂，留白越珍贵',
  url: 'https://shiji-hub.pages.dev',
  description: '留白 — 精选数字资源指南：逐条人工核实的 AI 工具、开源项目、效率软件与学习资源。',
  github: 'https://github.com/vipmocc/shiji-hub',
  startYear: 2026,
  // Cloudflare Web Analytics token（可选）：在 CF Dashboard → Web Analytics 添加站点后填入
  // 留空则完全跳过统计脚本，不影响网站功能
  analyticsToken: '',
};

export const categories = [
  { id: 'ai', name: 'AI 工具', desc: '大模型对话、AI 搜索与智能助手', color: '#B23A2E' },
  { id: 'efficiency', name: '效率软件', desc: '本地小工具与工作流加速器', color: '#3E6B4F' },
  { id: 'dev', name: '开发工具', desc: '编辑器、AI 编程与开发协作', color: '#2C5F8A' },
  { id: 'design', name: '设计图像', desc: '在线设计、图片与图标处理', color: '#8A5A83' },
  { id: 'knowledge', name: '知识管理', desc: '笔记、写作与信息整理', color: '#4A6FA5' },
  { id: 'learning', name: '学习资源', desc: '教程、文档与开源课程', color: '#9A6B2F' },
] as const;

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export const pricingLabels: Record<string, string> = {
  free: '免费',
  freemium: '免费 + 付费',
  'open-source': '开源免费',
  paid: '付费',
};
