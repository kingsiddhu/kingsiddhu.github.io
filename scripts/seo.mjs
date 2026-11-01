import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// Run from the repository root: node scripts/seo.mjs [--check]
const origin = 'https://siddharthk.is-a.dev';
const person = 'Siddharth Katabathula';
const pages = [
  ['index.html', '/', `${person} | Games, AI & Systems`, 'Siddharth Katabathula builds games, AI agents, cybersecurity projects, and self-hosted systems. Explore projects, source code, and CTF write-ups.', 'ProfilePage'],
  ['pages/blogs/new-posts.html', '/pages/blogs/new-posts.html', `Blog posts | ${person}`, 'CTF write-ups, hackathon projects, and early web experiments by Siddharth Katabathula.', 'CollectionPage'],
  ['pages/blogs/bearcat-ctf-2026.html', '/pages/blogs/bearcat-ctf-2026.html', `BearcatCTF 2026 write-ups | ${person}`, 'BearcatCTF 2026 write-up index: 35 challenges solved across crypto, forensics, reverse engineering, web, misc, and OSINT.', 'BlogPosting'],
  ['pages/blogs/ohio-ctf-2026.html', '/pages/blogs/ohio-ctf-2026.html', `OhioCTF: 20th place at Capture Ohio 2026 | ${person}`, 'Siddharth Katabathula reflects on a 20th-place team finish at Capture Ohio 2026 and the competition’s cybersecurity challenges.', 'BlogPosting'],
  ['pages/blogs/learn-html-basics-2021.html', '/pages/blogs/learn-html-basics-2021.html', `Learn HTML: build your first page | ${person}`, 'An archived 2021 introduction to HTML: page structure, headings, paragraphs, links, and images.', 'BlogPosting'],
  ['pages/blogs/money-making-results-2021.html', '/pages/blogs/money-making-results-2021.html', `My money-making experiment: what actually paid | ${person}`, 'An archived personal account of a 2021 online earnings experiment. Historical experience, not current earnings advice.', 'BlogPosting'],
  ['pages/blogs-page.html', '/pages/blogs-page.html', `Blog Archive | ${person}`, 'Archived early writing and web experiments by Siddharth Katabathula. Historical posts may contain outdated references.', 'CollectionPage'],
  ['pages/blogs/make-money-guaranteed.html', '/pages/blogs/make-money-guaranteed.html', `Archived money-making post | ${person}`, 'An early archived money-making post by Siddharth Katabathula. Offers and services reflect the original publication period.', 'WebPage'],
  ['pages/blogs/adithya-website.html', '/pages/blogs/adithya-website.html', `Adithya’s website: early web experiment | ${person}`, 'An archived early website experiment made for Adithya, preserved as part of Siddharth Katabathula’s blog archive.', 'WebPage'],
  ['pages/blogs/siddhu.html', '/pages/blogs/siddhu.html', `Early blog page test | ${person}`, 'An archived early blog page experiment from Siddharth Katabathula’s personal website.', 'WebPage'],
  ['pages/blogs/Learn-HTML.html', '/pages/blogs/Learn-HTML.html', `Archived HTML course announcement | ${person}`, 'An archived announcement for an early HTML course by Siddharth Katabathula. Details reflect the original publication period.', 'WebPage'],
  ['pages/games.html', '/pages/games.html', `Games archive | ${person}`, 'An archived collection of game links from Siddharth Katabathula’s early website.', 'CollectionPage'],
  ['pages/files.html', '/pages/files.html', `Files and downloads | ${person}`, 'Explore Siddharth Katabathula’s archived creative files, board game, handwriting font, and autoclicker release.', 'CollectionPage'],
  ['Boids/Boids.html', '/Boids/Boids.html', `Boids flocking simulation | ${person}`, 'Run an interactive Boids simulation in your browser, exploring autonomous flocking behavior.', 'WebPage'],
];
const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const check = process.argv.includes('--check');
function output(file, content) {
  if (check) assert.ok(fs.readFileSync(file, 'utf8') === content, `${file} is out of date; run node scripts/seo.mjs`);
  else fs.writeFileSync(file, content);
}
const indexed = new Set(pages.map(p => p[0]));
for (const [file, url, title, description, type] of pages) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\s*<!-- SEO:start -->[\s\S]*?<!-- SEO:end -->/g, '');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(title)}</title>`);
  html = html.replace(/\s*<meta\b[^>]*(?:name=["'](?:description|robots|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>/gi, '');
  html = html.replace(/\s*<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '');
  const page = {'@type': type, '@id': origin + url + '#page', url: origin + url, name: title, description, inLanguage: 'en', isPartOf: {'@id': origin + '/#website'}};
  if (type === 'ProfilePage') page.mainEntity = {'@id': origin + '/#person'};
  if (type === 'BlogPosting') {
    page.headline = title.split(' | ')[0];
    page.author = {'@id': origin + '/#person'};
    page.mainEntityOfPage = origin + url;
    const date = html.match(/<time datetime="([^"]+)"/);
    if (date) page.datePublished = date[1];
  }
  const graph = [page, {'@type': 'Person', '@id': origin + '/#person', name: person, url: origin + '/', sameAs: ['https://github.com/kingsiddhu', 'https://www.linkedin.com/in/siddharth-katabathula/', 'https://kingstudios.itch.io/']}, {'@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: `${person} | Portfolio`, author: {'@id': origin + '/#person'}}];
  const metadata = `\n<!-- SEO:start -->
<meta name="description" content="${escape(description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${origin + url}">
<link rel="describedby" href="/llms.txt" type="text/plain">
${file === 'index.html' ? '<link rel="alternate" type="text/markdown" href="/index.md" title="Portfolio in Markdown">\n' : ''}<meta property="og:type" content="${type === 'BlogPosting' ? 'article' : 'website'}">
<meta property="og:site_name" content="${person}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${origin + url}">
<meta property="og:image" content="${origin}/img/logo.jpeg">
<meta property="og:image:alt" content="King Siddhu crown logo">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(description)}">
<meta name="twitter:image" content="${origin}/img/logo.jpeg">
<script type="application/ld+json">${JSON.stringify({'@context': 'https://schema.org', '@graph': graph}).replaceAll('<', '\\u003c')}</script>
<!-- SEO:end -->`;
  html = html.replace(/\s*<\/head>[ \t]*/i, metadata + '\n</head>');
  html = html.replace(/<html>/i, '<html lang="en">');
  output(file, html);
}
// Allow crawling so engines can see noindex on retired experiments and duplicates.
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    if (e.name.startsWith('.') || ['node_modules', 'scripts', '_site'].includes(e.name)) return [];
    const file = path.posix.join(dir === '.' ? '' : dir, e.name);
    return e.isDirectory() ? walk(file) : file.endsWith('.html') ? [file] : [];
  });
}
for (const file of walk('.')) {
  if (indexed.has(file) || file.startsWith('google')) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!/<\/head>/i.test(html)) continue;
  html = html.replace(/\s*<meta\b[^>]*name=["']robots["'][^>]*>/gi, '');
  html = html.replace(/\s*<\/head>[ \t]*/i, '\n<meta name="robots" content="noindex, follow">\n</head>');
  output(file, html);
}
output('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9/">\n${pages.map(p => `  <url><loc>${origin + p[1]}</loc></url>`).join('\n')}\n</urlset>\n`);
output('robots.txt', `# Public pages and assets are available to search and AI crawlers.\nUser-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`${check ? 'Verified' : 'Updated'} SEO metadata, indexing policy, and ${pages.length} sitemap URLs.`);
