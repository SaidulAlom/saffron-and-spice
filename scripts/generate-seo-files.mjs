import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });
loadEnv({ path: '.env.local', override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const siteUrl = (process.env.VITE_SITE_URL || process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');

const routes = ['/', '/about', '/menu', '/experiences', '/testimonials', '/gallery', '/contact'];
const now = new Date().toISOString();

mkdirSync(publicDir, { recursive: true });

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(route => {
    const url = `${siteUrl}${route === '/' ? '/' : route}`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.7'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');
writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
