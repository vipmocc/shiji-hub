import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 站点地址：部署后需改为真实域名（Cloudflare Pages 分配的 xxx.pages.dev）
export default defineConfig({
  site: 'https://shiji-hub.pages.dev',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
