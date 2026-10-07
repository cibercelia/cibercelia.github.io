#!/usr/bin/env node

/**
 * CiberCelia - Static Site Generator (SSG)
 * Compiles Markdown files (content/posts/*.md and content/noticias/*.md)
 * into standalone static HTML pages using decoupled templates in /templates,
 * and generates the catalog manifest for search and filtering.
 */

const fs = require('fs');
const path = require('path');
const marked = require(path.join(__dirname, '..', 'assets', 'js', 'marked.min.js'));

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const PARTIALS_DIR = path.join(TEMPLATES_DIR, 'partials');
const ASSETS_DATA_DIR = path.join(ROOT_DIR, 'assets', 'data');
const ASSETS_JS_DIR = path.join(ROOT_DIR, 'assets', 'js');

// -----------------------------------------------------------------------------
// 1. Template Engine
// -----------------------------------------------------------------------------

function loadTemplates() {
  const partials = {};
  if (fs.existsSync(PARTIALS_DIR)) {
    fs.readdirSync(PARTIALS_DIR).forEach(file => {
      if (file.endsWith('.html')) {
        const name = path.basename(file, '.html');
        const content = fs.readFileSync(path.join(PARTIALS_DIR, file), 'utf-8');
        partials[name] = content;
        // Aliases para guiones bajos y medios
        partials[name.replace(/-/g, '_')] = content;
        partials[name.replace(/_/g, '-')] = content;
      }
    });
  }

  const templates = {};
  if (fs.existsSync(TEMPLATES_DIR)) {
    fs.readdirSync(TEMPLATES_DIR).forEach(file => {
      if (file.endsWith('.html')) {
        const name = path.basename(file, '.html');
        templates[name] = fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf-8');
      }
    });
  }

  return { templates, partials };
}

function renderTemplate(templateStr, data, partials = {}) {
  let output = templateStr;

  // 1. Expandir partials: {{> partial_name}}
  let prevOutput = '';
  while (prevOutput !== output) {
    prevOutput = output;
    output = output.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (match, partialName) => {
      return partials[partialName] !== undefined ? partials[partialName] : match;
    });
  }

  // 2. Bloques condicionales: {{#key}}...{{/key}} e invertidos: {{^key}}...{{/key}}
  output = output.replace(/\{\{#([\w_]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, inner) => {
    const val = data[key];
    if (val && (!Array.isArray(val) || val.length > 0)) {
      return renderTemplate(inner, data, partials);
    }
    return '';
  });

  output = output.replace(/\{\{\^([\w_]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, inner) => {
    const val = data[key];
    if (!val || (Array.isArray(val) && val.length === 0)) {
      return renderTemplate(inner, data, partials);
    }
    return '';
  });

  // 3. Variables simples: {{key}}
  output = output.replace(/\{\{([\w_]+)\}\}/g, (match, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
    return '';
  });

  return output;
}

// -----------------------------------------------------------------------------
// 2. Markdown Parsing & Enhancement
// -----------------------------------------------------------------------------

function renderMarkdownToHtml(rawMarkdown) {
  // Callouts: > [!NOTE], > [!IMPORTANT], etc.
  const titles = {
    note: 'Nota',
    important: 'Importante',
    warning: 'Advertencia',
    tip: 'Consejo',
    caution: 'Precaución'
  };

  let processed = rawMarkdown.replace(/^>\s*\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\s*\n((?:>.*\n?)*)/gim, (match, type, calloutContent) => {
    const cleanContent = calloutContent.replace(/^>\s?/gm, '').trim();
    const typeLower = type.toLowerCase();
    const innerHtml = marked.parse(cleanContent);
    return `<div class="callout callout-${typeLower}">
      <div class="callout-title"><strong>${titles[typeLower] || type}</strong></div>
      <div class="callout-body">${innerHtml}</div>
    </div>\n\n`;
  });

  marked.setOptions({ gfm: true, breaks: false });
  let html = marked.parse(processed);

  // Diagramas interactivos Mermaid
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
    const rawMermaid = code
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return `<div class="diagram-container">
      <div class="diagram-header">
        <span class="diagram-badge">Diagrama interactivo</span>
      </div>
      <div class="mermaid">${rawMermaid}</div>
    </div>`;
  });

  // Bloques de código con botón de copiado
  html = html.replace(/<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    return `<div class="code-wrapper" style="position: relative;">
      <button class="code-copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
      <pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>
    </div>`;
  });

  html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
    return `<div class="code-wrapper" style="position: relative;">
      <button class="code-copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
      <pre class="language-text"><code class="language-text">${code}</code></pre>
    </div>`;
  });

  // Tablas estilizadas y píldoras de estado
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, (match, tableInner) => {
    let enhanced = tableInner
      .replace(/<td>\s*⚠️\s*Bajo\s*<\/td>/gi, '<td><span class="status-pill status-danger">⚠️ Bajo</span></td>')
      .replace(/<td>\s*🟡\s*Medio\s*<\/td>/gi, '<td><span class="status-pill status-warning">🟡 Medio</span></td>')
      .replace(/<td>\s*🟢\s*Muy Alto\s*<\/td>/gi, '<td><span class="status-pill status-success">🟢 Muy Alto</span></td>')
      .replace(/<td>\s*✅\s*Sí\s*<\/td>/gi, '<td><span class="status-pill status-success">✅ Sí</span></td>')
      .replace(/<td>\s*✅\s*<strong>Sí<\/strong>\s*<\/td>/gi, '<td><span class="status-pill status-success">✅ <strong>Sí</strong></span></td>')
      .replace(/<td>\s*❌\s*No\s*<\/td>/gi, '<td><span class="status-pill status-danger">❌ No</span></td>')
      .replace(/<td>\s*❌\s*No \((.*?)\)\s*<\/td>/gi, '<td><span class="status-pill status-danger">❌ No ($1)</span></td>');
    return `<div class="table-responsive"><table class="styled-table">${enhanced}</table></div>`;
  });

  return html;
}

function parseMarkdownFile(filePath, category) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  const filename = path.basename(filePath, '.md');

  let metadata = {
    id: filename,
    title: filename,
    category: category,
    date: new Date().toISOString().split('T')[0],
    author: 'CiberCelia',
    author_github: '',
    tags: [],
    summary: '',
    file: relPath,
    permalink: `${category === 'post' ? 'posts' : 'noticias'}/${filename}/`
  };

  let content = raw;

  if (raw.startsWith('---')) {
    const end = raw.indexOf('---', 3);
    if (end !== -1) {
      const frontmatter = raw.slice(3, end).trim();
      content = raw.slice(end + 3).trim();

      frontmatter.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
          const key = line.slice(0, colonIdx).trim();
          let val = line.slice(colonIdx + 1).trim();

          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          } else if (val.startsWith('[') && val.endsWith(']')) {
            try {
              val = JSON.parse(val.replace(/'/g, '"'));
            } catch (e) {
              val = val.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
            }
          }
          metadata[key] = val;
        }
      });
    }
  }

  const words = content.split(/\s+/).filter(Boolean).length;
  metadata.readingTime = `${Math.max(1, Math.ceil(words / 200))} min`;
  metadata.rawContent = content;
  metadata.htmlContent = renderMarkdownToHtml(content);

  return metadata;
}

// -----------------------------------------------------------------------------
// 3. Scan & Build Engine
// -----------------------------------------------------------------------------

function scanMarkdownDir(dirName, category) {
  const dirPath = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  return files.map(file => parseMarkdownFile(path.join(dirPath, file), category))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function loadJsonDataset(filename) {
  const filePath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error al cargar ${filename}:`, err);
    return [];
  }
}

function build() {
  console.log('🚀 Iniciando Compilador Estático (SSG) de CiberCelia con plantillas independientes...');

  const { templates, partials } = loadTemplates();
  const articleTemplate = templates['article'] || '';

  if (!articleTemplate) {
    console.error('❌ Error: No se encontró la plantilla templates/article.html');
    process.exit(1);
  }

  const posts = scanMarkdownDir('posts', 'post');
  const noticias = scanMarkdownDir('noticias', 'noticia');
  const recursos = loadJsonDataset(path.join('recursos', 'index.json'));
  const cursos = loadJsonDataset(path.join('cursos', 'index.json'));
  const proyectos = loadJsonDataset(path.join('proyectos', 'index.json'));

  // 1. Generate Static HTML pages for Posts
  posts.forEach(post => {
    const postDir = path.join(ROOT_DIR, 'posts', post.id);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    const templateData = {
      title: post.title,
      summary: post.summary || post.title,
      author: post.author || 'CiberCelia',
      author_avatar: post.author ? post.author.charAt(0).toUpperCase() : 'C',
      author_github: post.author_github || '',
      date: post.date || '',
      reading_time: post.readingTime || '2 min',
      category: post.category,
      category_label: 'Artículos',
      badge: (post.badge || post.category).toUpperCase(),
      tags_html: (post.tags || []).map(t => `<span class="card-tag">#${t}</span>`).join(''),
      content: post.htmlContent,
      relative_root: '../../',
      github_edit_url: `https://github.com/cibercelia/cibercelia/blob/main/${post.file}`,
      file: post.file
    };

    const html = renderTemplate(articleTemplate, templateData, partials);
    fs.writeFileSync(path.join(postDir, 'index.html'), html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, 'posts', `${post.id}.html`), html, 'utf-8');
    console.log(`📄 Generada página HTML estática: posts/${post.id}/index.html`);
  });

  // 2. Generate Static HTML pages for Noticias
  noticias.forEach(noticia => {
    const noticiaDir = path.join(ROOT_DIR, 'noticias', noticia.id);
    if (!fs.existsSync(noticiaDir)) {
      fs.mkdirSync(noticiaDir, { recursive: true });
    }

    const templateData = {
      title: noticia.title,
      summary: noticia.summary || noticia.title,
      author: noticia.author || 'CiberCelia',
      author_avatar: noticia.author ? noticia.author.charAt(0).toUpperCase() : 'C',
      author_github: noticia.author_github || '',
      date: noticia.date || '',
      reading_time: noticia.readingTime || '2 min',
      category: noticia.category,
      category_label: 'Noticias',
      badge: (noticia.badge || noticia.category).toUpperCase(),
      tags_html: (noticia.tags || []).map(t => `<span class="card-tag">#${t}</span>`).join(''),
      content: noticia.htmlContent,
      relative_root: '../../',
      github_edit_url: `https://github.com/cibercelia/cibercelia/blob/main/${noticia.file}`,
      file: noticia.file
    };

    const html = renderTemplate(articleTemplate, templateData, partials);
    fs.writeFileSync(path.join(noticiaDir, 'index.html'), html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, 'noticias', `${noticia.id}.html`), html, 'utf-8');
    console.log(`📄 Generada página HTML estática: noticias/${noticia.id}/index.html`);
  });

  // 3. Write compiled JSON manifest
  const lightweightPosts = posts.map(({ htmlContent, rawContent, ...rest }) => rest);
  const lightweightNoticias = noticias.map(({ htmlContent, rawContent, ...rest }) => rest);

  const manifest = {
    posts: lightweightPosts,
    noticias: lightweightNoticias,
    recursos,
    cursos,
    proyectos
  };

  if (!fs.existsSync(ASSETS_DATA_DIR)) {
    fs.mkdirSync(ASSETS_DATA_DIR, { recursive: true });
  }

  const jsonPath = path.join(ASSETS_DATA_DIR, 'content.json');
  fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`📦 Manifiesto JSON generado: assets/data/content.json`);

  // 4. Generate assets/js/content.js for client-side search/filtering
  const jsContent = `/**
 * CiberCelia - Content Manifest
 * Auto-generated by scripts/build.js
 */

const CIBERCELIA_CONTENT = ${JSON.stringify(manifest, null, 2)};
`;

  const jsPath = path.join(ASSETS_JS_DIR, 'content.js');
  fs.writeFileSync(jsPath, jsContent, 'utf-8');
  console.log(`⚡ JS Bundle generado: assets/js/content.js`);

  console.log(`\n✨ ¡Compilación completada con plantillas independientes!`);
  console.log(`   - ${posts.length} páginas HTML de artículos compiladas en /posts/`);
  console.log(`   - ${noticias.length} páginas HTML de noticias compiladas en /noticias/`);
  console.log(`   - Plantillas desacopladas cargadas desde /templates/.`);
}

build();
