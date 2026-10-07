---
description: Requisitos y flujo de compilación SSG para CiberCelia
globs:
  - "scripts/**"
  - "content/**"
  - "templates/**"
  - ".github/workflows/**"
---

# Flujo de Compilación Estática (SSG)

CiberCelia utiliza un generador de sitios estáticos personalizado en Node.js (`scripts/build.js`).

## 1. Regla de Compilación Obligatoria
Siempre que se añada o modifique cualquier archivo dentro de `content/` o `scripts/`:
```bash
node scripts/build.js
```

## 2. Salida Generada y .gitignore
El comando `node scripts/build.js` genera:
1. `posts/<slug>/index.html` y `posts/<slug>.html` para cada artículo.
2. `noticias/<slug>/index.html` y `noticias/<slug>.html` para cada noticia.
3. `assets/data/content.json` con el manifiesto completo y ligero para el buscador.
4. `assets/js/content.js` como bundle JavaScript compatible con el navegador.

> **Importante:** Todos estos archivos y carpetas generados están incluidos en `.gitignore`. Git solo almacena los archivos Markdown (`content/**/*.md`) y fuentes. El HTML final es compilado y publicado automáticamente en **GitHub Pages** mediante el flujo de **GitHub Actions** (`.github/workflows/deploy.yml`).

## 3. URLs Limpias y Sin Modales
- Toda publicación debe ser accesible mediante su URL canónica limpia: `/posts/<slug>/` o `/noticias/<slug>/`.
- Está terminantemente prohibido utilizar ventanas modales o páginas con parámetros de consulta (`post.html?id=...`) para la lectura de artículos.

## 4. Plantillas Desacopladas en /templates/
- Todas las plantillas HTML residen en `templates/` (p. ej. `templates/article.html`) y sus fragmentos en `templates/partials/*.html`.
- NUNCA incrustar código HTML completo dentro de cadenas en `scripts/build.js`. Utilizar la sintaxis `{{variable}}` y `{{> partial}}`.
