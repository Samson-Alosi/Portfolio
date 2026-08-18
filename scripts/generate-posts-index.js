const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'posts');
const outFile = path.join(postsDir, 'index.json');

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

function buildIndex(){
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const items = files.map(f => {
    const slug = path.basename(f, '.md');
    const text = fs.readFileSync(path.join(postsDir, f), 'utf8');
    const {meta} = parseFrontmatter(text);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || null,
      excerpt: meta.excerpt || null,
      author: meta.author || null
    };
  }).sort((a,b)=> (b.date||'').localeCompare(a.date||''));

  fs.writeFileSync(outFile, JSON.stringify(items, null, 2), 'utf8');
  console.log('Wrote', outFile);
}

if(require.main === module){
  try{
    buildIndex();
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}
