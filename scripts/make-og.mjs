// 一次性脚本：把 og-cover.svg 转成 og-cover.png（社交平台 OG 图片用 PNG）
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/og-cover.svg');
await sharp(svg, { density: 144 })
  .png({ quality: 90 })
  .toFile('public/og-cover.png');
console.log('og-cover.png generated');
