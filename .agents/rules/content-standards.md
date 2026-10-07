---
description: Normas para la redacción y formato de artículos, noticias y recursos en CiberCelia
globs:
  - "content/**"
  - "posts/**"
  - "noticias/**"
---

# Estándares de Contenido para CiberCelia

Al crear o editar contenidos en `content/`:

## 1. Frontmatter Obligatorio en Archivos Markdown (.md)
Todo archivo en `content/posts/` o `content/noticias/` debe incluir el siguiente bloque YAML inicial:

```yaml
---
title: "Título en minúsculas según la RAE (solo mayúscula inicial y nombres propios)"
date: "AAAA-MM-DD"
author: "Nombre del autor o comisión"
author_github: "usuario_github"
category: "post" # o "noticia"
tags: ["etiqueta1", "etiqueta2"]
summary: "Resumen conciso de 1-2 frases para la tarjeta de la página principal."
---
```

## 2. Reglas Ortográficas de la RAE en Títulos
- **Uso estricto de minúsculas (*sentence case*)**: Solo la primera palabra y los nombres propios o siglas llevan mayúscula.
  - *Correcto:* `Análisis de la vulnerabilidad Log4Shell (CVE-2021-44228)`
  - *Incorrecto:* `Análisis De La Vulnerabilidad Log4Shell`
- **Sin puntuación final en encabezados**: No incluir puntos (`.`) ni dos puntos (`:`) al final de títulos `h1`, `h2` o `h3`.
- **Acentuación rigurosa**: Revisar tildes en todas las palabras (*autenticación*, *múltiple*, *análisis*, *práctica*, *guía*).

## 3. Formato del Cuerpo Markdown
- **Bloques de código**: Especificar siempre el lenguaje (`bash`, `python`, `yaml`, `json`, `text`).
- **Alertas y llamadas**: Utilizar la sintaxis estándar de GitHub:
  ```markdown
  > [!NOTE]
  > Información contextual.

  > [!IMPORTANT]
  > Advertencia de seguridad o requisito imprescindible.
  ```
- **Tablas y diagramas**: Utilizar sintaxis Markdown estándar para tablas y diagramas de texto ASCII legibles.
- **Enlace al glosario**: Cuando se expliquen conceptos clave (MFA, Zero Trust, etc.), enlazar a `https://cibercelia.github.io/glosario/terms/<termino>/`.
