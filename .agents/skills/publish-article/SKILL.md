---
name: publish-article
description: Flujo completo para redactar, formatear, compilar y verificar un nuevo artículo técnico o noticia en CiberCelia siguiendo las normas de la RAE y el flujo SSG.
---

# Skill: Publicar un Artículo o Noticia en CiberCelia

Sigue este procedimiento paso a paso para crear un nuevo artículo técnico o noticia en el portal CiberCelia:

## Paso 1: Determinar la Categoría y el Archivo
- Si es un artículo técnico, guía de laboratorio o análisis: destino `content/posts/<slug>.md`.
- Si es un aviso, evento o noticia de seguridad: destino `content/noticias/<slug>.md`.
- El nombre del archivo (`<slug>.md`) debe estar en minúsculas, con palabras separadas por guiones (ej. `04-auditoria-seguridad-active-directory.md`).

## Paso 2: Redactar con Frontmatter y Normas RAE
1. **Título**: Asegúrate de que cumple las normas de la RAE:
   - Solo mayúscula en la primera palabra y nombres propios/siglas.
   - Sin punto ni dos puntos al final.
2. **Frontmatter completo**:
   ```yaml
   ---
   title: "Título en minúsculas según RAE"
   date: "2026-10-07"
   author: "Nombre del Autor"
   author_github: "usuario_github"
   category: "post"
   tags: ["redteam", "active-directory", "pentesting"]
   summary: "Resumen breve y real de 1-2 frases para la tarjeta de la portada."
   ---
   ```
3. **Cuerpo del documento**:
   - Título principal `# <Mismo título>`
   - Encabezados de sección `## 1. <Sección en minúsculas>`
   - Bloques de código con lenguaje explícito (`bash`, `powershell`, `python`, `yaml`, etc.).
   - Callouts de advertencia o información (`> [!IMPORTANT]`, `> [!NOTE]`).
   - Enlaces al [Glosario de Ciberseguridad](https://cibercelia.github.io/glosario/) cuando se citen términos clave.

## Paso 3: Compilar con el Generador Estático (SSG)
Ejecuta en la raíz del repositorio:
```bash
node scripts/build.js
```
Verifica que la salida indique:
- `📄 Generada página HTML estática: posts/<slug>/index.html`
- `📦 Manifiesto JSON generado: assets/data/content.json`
- `⚡ JS Bundle generado: assets/js/content.js`

## Paso 4: Validar y Hacer Commit
1. Comprueba en tu navegador local que la página generada se visualiza correctamente.
2. Como las carpetas `posts/`, `noticias/` y `assets/data/` están en `.gitignore`, Git únicamente registrará el nuevo archivo `.md`:
   ```bash
   git add content/posts/<slug>.md
   git commit -m "feat(posts): añadir artículo sobre <tema>"
   ```
3. Al hacer push o aprobar la PR en `main`, **GitHub Actions** compilará el HTML automáticamente y lo desplegará en **GitHub Pages**.
