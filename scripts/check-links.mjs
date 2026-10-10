#!/usr/bin/env node
// 失效链接检查：批量访问 src/data/resources/*.md 中记录的官网
// 用法：node scripts/check-links.mjs
// 输出：每个资源的 HTTP 状态与耗时，最后汇总不可访问清单
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/data/resources');

const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
const urls = files.map((f) => {
  const md = readFileSync(join(dir, f), 'utf-8');
  const name = (md.match(/^name:\s*(.+)$/m) || [])[1] || f;
  const url = (md.match(/^url:\s*(\S+)$/m) || [])[1];
  return { name: name.trim(), url };
});

const TIMEOUT = 15000;

async function check({ name, url }) {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    // 先试 HEAD，失败再退化为 GET（部分站点屏蔽 HEAD）
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; shiji-hub-linkchecker/1.0)' },
    });
    if (res.status >= 400 || res.status === 405) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; shiji-hub-linkchecker/1.0)' },
      });
    }
    const ms = Date.now() - start;
    const ok = res.status < 400;
    return { name, url, status: res.status, ms, ok };
  } catch (e) {
    return { name, url, status: 0, ms: Date.now() - start, ok: false, error: e.name };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (const item of urls) {
  const r = await check(item);
  results.push(r);
  const mark = r.ok ? '✅' : '❌';
  console.log(`${mark} ${r.name} — ${r.url} → ${r.status || r.error} (${r.ms}ms)`);
}

const bad = results.filter((r) => !r.ok);
console.log(`\n共检查 ${results.length} 个链接，异常 ${bad.length} 个`);
if (bad.length) {
  console.log('以下资源需要人工复核：');
  bad.forEach((b) => console.log(` - ${b.name}: ${b.url}`));
  process.exitCode = 1;
}
