export const site = {
  name: '拾集',
  enName: 'ShiJi Hub',
  tagline: '把真正好用的数字工具，收进你的收藏夹',
  url: 'https://shiji-hub.pages.dev',
  description: '精选数字资源指南：经人工核实的 AI 工具、效率软件、开发工具与学习资源。',
  github: 'https://github.com/vipmocc/shiji-hub',
  startYear: 2026,
  // Cloudflare Web Analytics token（可选）：在 CF Dashboard → Web Analytics 添加站点后填入
  // 留空则完全跳过统计脚本，不影响网站功能
  analyticsToken: '',
};

export const categories = [
  { id: 'ai', name: 'AI 工具', desc: '大模型对话、AI 搜索与智能助手', color: '#8b7cf6' },
  { id: 'efficiency', name: '效率软件', desc: '本地小工具与工作流加速器', color: '#4caf7d' },
  { id: 'dev', name: '开发工具', desc: '编辑器、AI 编程与开发协作', color: '#4a9edf' },
  { id: 'design', name: '设计图像', desc: '在线设计、图片与图标处理', color: '#e86a92' },
  { id: 'knowledge', name: '知识管理', desc: '笔记、写作与信息整理', color: '#3fa8a0' },
  { id: 'learning', name: '学习资源', desc: '教程、文档与开源课程', color: '#d0624a' },
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
