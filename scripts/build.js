#!/usr/bin/env node

/**
 * CiberCelia - Static Site Generator (SSG)
 * Compiles Markdown files (content/posts/*.md and content/noticias/*.md)
 * into standalone static HTML pages (like MkDocs, Astro, Hugo),
 * and generates the catalog manifest for search and filtering.
 */

const fs = require('fs');
const path = require('path');
const marked = require(path.join(__dirname, '..', 'assets', 'js', 'marked.min.js'));

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const ASSETS_DATA_DIR = path.join(ROOT_DIR, 'assets', 'data');
const ASSETS_JS_DIR = path.join(ROOT_DIR, 'assets', 'js');

// Helper to parse Markdown file and frontmatter
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
    author_github: 'cibercelia',
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

  // Calculate estimated reading time (~200 words/min)
  const words = content.split(/\s+/).filter(Boolean).length;
  metadata.readingTime = `${Math.max(1, Math.ceil(words / 200))} min`;
  metadata.rawContent = content;

  // Process Callouts & Render Markdown to HTML
  let processedMarkdown = content.replace(/^>\s*\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\s*\n((?:>.*\n?)*)/gim, (match, type, calloutContent) => {
    const cleanContent = calloutContent.replace(/^>\s?/gm, '').trim();
    const typeLower = type.toLowerCase();
    const titles = {
      note: 'Nota',
      important: 'Importante',
      warning: 'Advertencia',
      tip: 'Consejo',
      caution: 'Precaución'
    };
    const innerHtml = marked.parse(cleanContent);
    return `<div class="callout callout-${typeLower}">
      <div class="callout-title"><strong>${titles[typeLower] || type}</strong></div>
      <div class="callout-body">${innerHtml}</div>
    </div>\n\n`;
  });

  marked.setOptions({ gfm: true, breaks: false });
  let htmlContent = marked.parse(processedMarkdown);

  // Wrap pre/code blocks with copy button
  htmlContent = htmlContent.replace(/<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    return `<div class="code-wrapper" style="position: relative;">
      <button class="code-copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
      <pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>
    </div>`;
  });

  htmlContent = htmlContent.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
    return `<div class="code-wrapper" style="position: relative;">
      <button class="code-copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
      <pre class="language-text"><code class="language-text">${code}</code></pre>
    </div>`;
  });

  metadata.htmlContent = htmlContent;

  return metadata;
}

// Generate full standalone HTML page template
function renderArticleHtmlPage(item, relativeRoot = '../../') {
  const categoryLabel = item.category === 'noticia' ? 'Noticias' : 'Artículos';
  const authorAvatar = item.author ? item.author.charAt(0).toUpperCase() : 'C';
  const tagsHtml = (item.tags || []).map(t => `<span class="card-tag">#${t}</span>`).join('');
  const githubEditUrl = `https://github.com/cibercelia/cibercelia/blob/main/${item.file}`;

  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title} - CiberCelia</title>
  <meta name="description" content="${item.summary || item.title}">
  <meta name="author" content="${item.author || 'CiberCelia'}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${item.title} - CiberCelia">
  <meta property="og:description" content="${item.summary || item.title}">
  <meta property="og:image" content="${relativeRoot}assets/images/logo.svg">

  <link rel="icon" type="image/svg+xml" href="${relativeRoot}assets/images/favicon.svg">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="${relativeRoot}assets/css/style.css">
  <link rel="stylesheet" href="${relativeRoot}assets/css/prism.css">
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="container nav-inner">
      <a href="${relativeRoot}index.html" class="brand" aria-label="CiberCelia Inicio">
        <img src="${relativeRoot}assets/images/logo.svg" alt="CiberCelia Shield" class="brand-logo" width="36" height="36">
        <div class="brand-text">
          <span class="brand-title">CiberCelia</span>
          <span class="brand-subtitle">Ciberseguridad IES Celia Viñas</span>
        </div>
      </a>

      <ul class="nav-links">
        <li><a href="${relativeRoot}index.html#hub" class="nav-link">Hub</a></li>
        <li><a href="https://cibercelia.github.io/glosario/" target="_blank" rel="noopener noreferrer" class="nav-link">Glosario</a></li>
        <li><a href="${relativeRoot}index.html#contribuir" class="nav-link">Colaborar</a></li>
      </ul>

      <div class="nav-actions">
        <button id="theme-toggle" class="btn-icon" aria-label="Cambiar tema">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
        <a href="https://github.com/cibercelia/cibercelia" target="_blank" rel="noopener noreferrer" class="btn-github">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Article Layout -->
  <main class="container article-page-layout">
    
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav" aria-label="Ruta de navegación">
      <a href="${relativeRoot}index.html">Inicio</a>
      <span class="breadcrumb-separator">/</span>
      <a href="${relativeRoot}index.html#hub">${categoryLabel}</a>
      <span class="breadcrumb-separator">/</span>
      <span style="color: var(--text-primary);">${item.title}</span>
    </nav>

    <!-- Main Article Card -->
    <article class="article-card-main">
      
      <!-- Article Header -->
      <header class="article-header-block">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem;">
          <span class="category-tag ${item.category}">${(item.badge || item.category).toUpperCase()}</span>
          <div class="article-actions-bar">
            <button class="btn-article-action" onclick="copyArticleUrl(this)" title="Copiar enlace">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <span>Compartir</span>
            </button>
            <a href="${githubEditUrl}" target="_blank" rel="noopener noreferrer" class="btn-article-action" title="Editar en GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>Editar en GitHub</span>
            </a>
          </div>
        </div>

        <h1 class="article-main-title">${item.title}</h1>

        <div class="article-author-bar">
          <div class="article-author-left">
            <span class="article-author-avatar">${authorAvatar}</span>
            <div class="article-author-meta">
              <h4>
                ${item.author || 'CiberCelia'}
                ${item.author_github ? `<a href="https://github.com/${item.author_github}" target="_blank" class="nav-badge" style="margin-left: 0.5rem;">@${item.author_github}</a>` : ''}
              </h4>
              <p>${item.date || ''} • Lectura: ${item.readingTime}</p>
            </div>
          </div>
          <div class="card-tags" style="margin-bottom: 0;">${tagsHtml}</div>
        </div>
      </header>

      <!-- Pre-rendered HTML Body -->
      <div class="markdown-body">
        ${item.htmlContent}
      </div>

      <!-- Bottom Contribution Box -->
      <div class="article-contrib-callout">
        <div class="article-contrib-text">
          <h4>¿Tienes correcciones o quieres publicar tu propio artículo?</h4>
          <p>Puedes proponer cambios o enviar tus propias guías técnicas mediante solicitudes de extracción (*pull requests*) en el repositorio de CiberCelia.</p>
        </div>
        <a href="https://github.com/cibercelia/cibercelia/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" class="btn-primary-glow" style="flex-shrink: 0; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
          <span>Guía de contribución</span>
        </a>
      </div>

    </article>

    <!-- Return to Hub Link -->
    <div style="text-align: center; margin-top: 2rem;">
      <a href="${relativeRoot}index.html#hub" class="btn-article-action" style="padding: 0.6rem 1.4rem; font-size: 0.9rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>Volver a todas las publicaciones</span>
      </a>
    </div>

  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container" style="text-align: center;">
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
        CiberCelia • Recurso didáctico independiente para el alumnado del Curso de Especialización de Ciberseguridad del IES Celia Viñas. <em>No es la web oficial del centro.</em>
      </p>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
        <a href="${relativeRoot}index.html">Inicio</a> • <a href="https://cibercelia.github.io/glosario/" target="_blank">Glosario</a> • <a href="https://github.com/cibercelia" target="_blank">GitHub</a>
      </p>
      <p style="font-size: 0.75rem; color: var(--text-muted);">
        Código bajo licencia <a href="https://github.com/cibercelia/cibercelia.github.io/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer">MIT</a> • Contenidos bajo <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>
      </p>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="${relativeRoot}assets/js/prism.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const themeToggleBtn = document.getElementById('theme-toggle');
      let currentTheme = localStorage.getItem('cibercelia-theme') || 'dark';

      function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cibercelia-theme', theme);
        if (themeToggleBtn) {
          themeToggleBtn.innerHTML = theme === 'dark'
            ? \`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>\`
            : \`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>\`;
        }
      }

      applyTheme(currentTheme);

      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
          currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
          applyTheme(currentTheme);
        });
      }

      if (window.Prism) {
        Prism.highlightAll();
      }
    });

    window.copyCodeSnippet = function(btn) {
      const pre = btn.parentElement ? btn.parentElement.querySelector('pre code') : null;
      const code = pre ? pre.innerText : (btn.nextElementSibling ? btn.nextElementSibling.innerText : '');
      navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.innerText;
        btn.innerText = '¡Copiado!';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      });
    };

    window.copyArticleUrl = function(btn) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const span = btn.querySelector('span');
        const orig = span.innerText;
        span.innerText = '¡Copiado!';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        setTimeout(() => {
          span.innerText = orig;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      });
    };
  </script>
</body>
</html>`;
}

// Helper to scan directory for Markdown files
function scanMarkdownDir(dirName, category) {
  const dirPath = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  return files.map(file => parseMarkdownFile(path.join(dirPath, file), category))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

// Helper to load JSON datasets
function loadJsonDataset(filename) {
  const filePath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error loading ${filename}:`, err);
    return [];
  }
}

function build() {
  console.log('🚀 Iniciando Compilador Estático (SSG) de CiberCelia...');

  const posts = scanMarkdownDir('posts', 'post');
  const noticias = scanMarkdownDir('noticias', 'noticia');
  const recursos = loadJsonDataset(path.join('recursos', 'index.json'));
  const cursos = loadJsonDataset(path.join('cursos', 'index.json'));
  const proyectos = loadJsonDataset(path.join('proyectos', 'index.json'));

  // 1. Generate Static HTML pages for each Post
  posts.forEach(post => {
    const postDir = path.join(ROOT_DIR, 'posts', post.id);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    const html = renderArticleHtmlPage(post, '../../');
    fs.writeFileSync(path.join(postDir, 'index.html'), html, 'utf-8');
    // Also generate posts/<id>.html for direct access
    fs.writeFileSync(path.join(ROOT_DIR, 'posts', `${post.id}.html`), html, 'utf-8');
    console.log(`📄 Generada página HTML estática: posts/${post.id}/index.html`);
  });

  // 2. Generate Static HTML pages for each Noticia
  noticias.forEach(noticia => {
    const noticiaDir = path.join(ROOT_DIR, 'noticias', noticia.id);
    if (!fs.existsSync(noticiaDir)) {
      fs.mkdirSync(noticiaDir, { recursive: true });
    }
    const html = renderArticleHtmlPage(noticia, '../../');
    fs.writeFileSync(path.join(noticiaDir, 'index.html'), html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, 'noticias', `${noticia.id}.html`), html, 'utf-8');
    console.log(`📄 Generada página HTML estática: noticias/${noticia.id}/index.html`);
  });

  // Strip large htmlContent for manifest JSON to keep it lightweight
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

  // 3. Write compiled JSON manifest
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

  console.log(`\n✨ ¡Compilación completada!`);
  console.log(`   - ${posts.length} páginas HTML de artículos compiladas en /posts/`);
  console.log(`   - ${noticias.length} páginas HTML de noticias compiladas en /noticias/`);
  console.log(`   - Catálogo preparado para búsqueda y filtrado.`);
}

build();
