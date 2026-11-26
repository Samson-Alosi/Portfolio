const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..');
const postsDir = path.join(siteDir, 'posts');
const outFile = path.join(postsDir, 'index.json');
const postTemplateFile = path.join(siteDir, 'blog', 'post.html');
const sitemapFile = path.join(siteDir, 'sitemap.xml');
const siteUrl = 'https://samclinicalpsychologist.netlify.app';

function parseFrontmatter(text){
  const fmMatch = text.match(/^-{3}[\s\S]*?-{3}/);
  if(!fmMatch) return {meta: {}, body: text};
  const raw = fmMatch[0].replace(/^-{3}/,'').replace(/-{3}$/,'').trim();
  const body = text.slice(fmMatch[0].length).trim();
  const meta = {};
  raw.split('\n').forEach(line => {
    const i = line.indexOf(':');
    if(i>0){
      const key = line.slice(0,i).trim();
      const val = line.slice(i+1).trim().replace(/^"|"$/g,'');
      meta[key]=val;
    }
  });
  return {meta, body};
}

function escapeHtml(value){
  return String(value || '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function buildPostPage(post, template){
  const postUrl = `${siteUrl}/blog/${encodeURIComponent(post.slug)}.html`;
  const title = post.title || 'Untitled';
  const description = post.excerpt || '';
  const image = post.image || '';
  const socialImage = /^https?:\/\//i.test(image)
    ? image
    : image
      ? `${siteUrl}/${image.replace(/^\.\.\//, '').replace(/^\.\//, '').replace(/^\//, '')}`
      : '';
  const imageAlt = post.imageAlt || title;
  const socialMetadata = [
    `<link rel="canonical" href="${escapeHtml(postUrl)}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:url" content="${escapeHtml(postUrl)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:image" content="${escapeHtml(socialImage)}">`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(socialImage)}">`
  ].join('\n    ');
  const page = template
    .replace('<title>Post — Samson Alosi Obongo</title>', `<title>${escapeHtml(title)} — Samson Alosi Obongo</title>`)
    .replace('</head>', `    ${socialMetadata}\n  </head>`)
    .replace('<body>', `<body data-post-slug="${escapeHtml(post.slug)}">`);

  if (!page.includes(`data-post-slug="${escapeHtml(post.slug)}"`)) {
    throw new Error(`Could not add post slug to generated page for "${post.slug}"`);
  }
  return page;
}

function buildSitemap(posts){
  const staticPages = ['/', '/blog/', '/privacy.html', '/terms.html'];
  const postPages = posts.map(post => `/blog/${encodeURIComponent(post.slug)}.html`);
  const urls = [...staticPages, ...postPages]
    .map(page => `  <url>\n    <loc>${siteUrl}${page}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildIndex(){
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const postTemplate = fs.readFileSync(postTemplateFile, 'utf8');
  const items = files.map(f => {
    const slug = path.basename(f, '.md');
    const text = fs.readFileSync(path.join(postsDir, f), 'utf8');
    const {meta} = parseFrontmatter(text);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || null,
      excerpt: meta.excerpt || null,
      author: meta.author || null,
      featured: meta.featured === 'true',
      image: meta.image || null,
      imageAlt: meta.imageAlt || null,
      imageCredit: meta.imageCredit || null,
      imageSource: meta.imageSource || null,
      imageLicense: meta.imageLicense || null,
      imageLicenseUrl: meta.imageLicenseUrl || null
    };
  }).sort((a,b)=> Number(b.featured) - Number(a.featured) || (b.date||'').localeCompare(a.date||''));

  fs.writeFileSync(outFile, JSON.stringify(items, null, 2), 'utf8');
  console.log('Wrote', outFile);

  items.forEach(post => {
    const pageFile = path.join(siteDir, 'blog', `${post.slug}.html`);
    fs.writeFileSync(pageFile, buildPostPage(post, postTemplate), 'utf8');
    console.log('Wrote', pageFile);
  });

  fs.writeFileSync(sitemapFile, buildSitemap(items), 'utf8');
  console.log('Wrote', sitemapFile);
}

if(require.main === module){
  try{
    buildIndex();
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}
