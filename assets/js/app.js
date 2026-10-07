/**
 * CiberCelia - Main Application Logic
 * Interactive Search, Filters, Theme Switcher, Direct Navigation to Full Articles.
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    activeCategory: 'all',
    activeTag: null,
    searchQuery: '',
    theme: localStorage.getItem('cibercelia-theme') || 'dark'
  };

  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear');
  const filterPills = document.querySelectorAll('.filter-pill');
  const tagFilters = document.querySelectorAll('.tag-filter-btn');
  const cardsContainer = document.getElementById('cards-grid');
  const resultsCountEl = document.getElementById('results-count');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // Initialize Theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cibercelia-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  applyTheme(state.theme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
    });
  }

  // Mobile Menu
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Aggregate All Items
  function getAllItems() {
    const all = [];
    if (CIBERCELIA_CONTENT.posts) all.push(...CIBERCELIA_CONTENT.posts);
    if (CIBERCELIA_CONTENT.noticias) all.push(...CIBERCELIA_CONTENT.noticias);
    if (CIBERCELIA_CONTENT.recursos) all.push(...CIBERCELIA_CONTENT.recursos);
    if (CIBERCELIA_CONTENT.cursos) all.push(...CIBERCELIA_CONTENT.cursos);
    if (CIBERCELIA_CONTENT.proyectos) all.push(...CIBERCELIA_CONTENT.proyectos);
    return all;
  }

  // Filter Items
  function getFilteredItems() {
    let items = getAllItems();

    // Filter by Category
    if (state.activeCategory !== 'all') {
      const catMap = {
        posts: 'post',
        noticias: 'noticia',
        recursos: 'recurso',
        cursos: 'curso',
        proyectos: 'proyecto'
      };
      const targetCat = catMap[state.activeCategory] || state.activeCategory;
      items = items.filter(item => item.category === targetCat);
    }

    // Filter by Tag
    if (state.activeTag) {
      items = items.filter(item => item.tags && item.tags.includes(state.activeTag));
    }

    // Filter by Search Query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase().trim();
      items = items.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(query);
        const summaryMatch = item.summary && item.summary.toLowerCase().includes(query);
        const tagsMatch = item.tags && item.tags.some(t => t.toLowerCase().includes(query));
        const authorMatch = item.author && item.author.toLowerCase().includes(query);
        return titleMatch || summaryMatch || tagsMatch || authorMatch;
      });
    }

    return items;
  }

  // Render Card Template (Direct full page link for posts/news)
  function renderCard(item) {
    const isMarkdownArticle = item.category === 'post' || item.category === 'noticia';
    const articleHref = `post.html?id=${encodeURIComponent(item.id)}`;
    const hasExternalUrl = !!item.url;
    
    let actionBtnHtml = '';
    if (isMarkdownArticle) {
      actionBtnHtml = `<a href="${articleHref}" class="card-action-btn">
        Leer artículo
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </a>`;
    } else if (hasExternalUrl) {
      actionBtnHtml = `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="card-action-btn">
        Visitar enlace
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>`;
    }

    const tagsHtml = (item.tags || []).map(tag => 
      `<span class="card-tag" onclick="selectTag('${tag}')">#${tag}</span>`
    ).join('');

    const authorAvatarLetter = item.author ? item.author.charAt(0).toUpperCase() : 'C';

    return `
      <article class="card card-${item.category}" data-id="${item.id}">
        <div class="card-header">
          <span class="category-tag ${item.category}">${item.badge || item.category}</span>
          <span class="card-meta">
            ${item.date ? `<span>${item.date}</span>` : ''}
            ${item.readingTime ? `<span>• ${item.readingTime}</span>` : ''}
            ${item.level ? `<span>• ${item.level}</span>` : ''}
          </span>
        </div>

        <h3 class="card-title">
          ${isMarkdownArticle 
            ? `<a href="${articleHref}">${item.title}</a>`
            : `<a href="${item.url || '#'}" target="_blank" rel="noopener noreferrer">${item.title}</a>`
          }
        </h3>

        <p class="card-summary">${item.summary || ''}</p>

        <div class="card-tags">${tagsHtml}</div>

        <div class="card-footer">
          <div class="author-info">
            <span class="author-avatar">${authorAvatarLetter}</span>
            <span class="author-name">${item.author || item.provider || 'CiberCelia'}</span>
          </div>
          ${actionBtnHtml}
        </div>
      </article>
    `;
  }

  // Update DOM Grid
  function renderGrid() {
    if (!cardsContainer) return;
    const items = getFilteredItems();

    if (resultsCountEl) {
      resultsCountEl.textContent = `(${items.length})`;
    }

    if (items.length === 0) {
      cardsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No se encontraron resultados</h3>
          <p class="empty-desc">Prueba a buscar con otros términos o elimina los filtros activos.</p>
        </div>
      `;
      return;
    }

    cardsContainer.innerHTML = items.map(renderCard).join('');
  }

  // Category Filter Pill Click
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeCategory = pill.getAttribute('data-category');
      renderGrid();
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
      }
      renderGrid();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClearBtn.style.display = 'none';
      renderGrid();
      searchInput.focus();
    });
  }

  // Tag Selection
  window.selectTag = function(tag) {
    if (state.activeTag === tag) {
      state.activeTag = null; // Toggle off
    } else {
      state.activeTag = tag;
    }
    // Update tag button UI
    tagFilters.forEach(btn => {
      if (btn.getAttribute('data-tag') === state.activeTag) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    renderGrid();
  };

  tagFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      window.selectTag(tag);
    });
  });

  // Initial Grid Render
  renderGrid();
});
