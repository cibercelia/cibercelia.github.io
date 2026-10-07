---
description: Requisitos y flujo de compilación SSG para CiberCelia
globs:
  - "scripts/**"
  - "content/**"
  - ".github/workflows/**"
---

# Flujo de Compilación Estática (SSG)

CiberCelia utiliza un generador de sitios estáticos personalizado en Node.js (`scripts/build.js`).

## 1. Regla de Compilación Obligatoria
Siempre que se añada o modifique cualquier archivo dentro de `content/` o `scripts/`:
```bash
node scripts/build.js
```

## 2. Salida Generada
El comando `node scripts/build.js` genera:
1. `posts/<slug>/index.html` y `posts/<slug>.html` para cada artículo.
2. `noticias/<slug>/index.html` y `noticias/<slug>.html` para cada noticia.
3. `assets/data/content.json` con el manifiesto completo y ligero para el buscador.
4. `assets/js/content.js` como bundle JavaScript compatible con el navegador.

## 3. URLs Limpias y Sin Modales
- Toda publicación debe ser accesible mediante su URL canónica limpia: `/posts/<slug>/` o `/noticias/<slug>/`.
- Está terminantemente prohibido utilizar ventanas modales o páginas con parámetros de consulta (`post.html?id=...`) para la lectura de artículos.
