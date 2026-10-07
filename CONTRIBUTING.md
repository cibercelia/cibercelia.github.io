# 🛡️ Guía de contribución para estudiantes - CiberCelia

¡Bienvenido/a al repositorio del **Portal CiberCelia**! Este espacio es un recurso didáctico colaborativo creado para el alumnado del **Curso de Especialización de Ciberseguridad del IES Celia Viñas**.

> **Nota:** Este portal es un proyecto educativo de apoyo a clase y prácticas, no es la web oficial institucional del centro.

Aquí aprenderás y aplicarás la metodología **Docs-as-Code**: tratar la documentación, los artículos técnicos y los recursos con el mismo rigor, control de versiones y flujo de trabajo que el código software profesional.

---

## 📋 Índice
1. [Flujo de trabajo con Git (paso a paso)](#1-flujo-de-trabajo-con-git-paso-a-paso)
2. [Cómo publicar un nuevo artículo](#2-cómo-publicar-un-nuevo-artículo)
3. [Cómo publicar una noticia](#3-cómo-publicar-una-noticia)
4. [Cómo añadir enlaces, cursos o recursos](#4-cómo-añadir-enlaces-cursos-o-recursos)
5. [Enlazar con el glosario de ciberseguridad](#5-enlazar-con-el-glosario-de-ciberseguridad)
6. [Buenas prácticas de redacción y Markdown](#6-buenas-prácticas-de-redacción-y-markdown)

---

## 1. Flujo de trabajo con Git (paso a paso)

Para publicar contenido en la web de CiberCelia, sigue estos sencillos pasos:

### Paso 1: Hacer un fork
1. Entra en el repositorio principal: [https://github.com/cibercelia/cibercelia](https://github.com/cibercelia/cibercelia).
2. Haz clic en el botón superior derecho **Fork** para crear una copia en tu cuenta personal de GitHub.

### Paso 2: Clonar tu fork en local
Abre tu terminal en Linux/Mac o Git Bash en Windows:
```bash
git clone https://github.com/TU_USUARIO/cibercelia.git
cd cibercelia
```

### Paso 3: Crear una rama de trabajo
Nunca trabajes directamente sobre `main`. Crea una rama descriptiva:
```bash
git checkout -b post/analisis-malware-yara
# o para un recurso:
git checkout -b recurso/nueva-herramienta-osint
```

### Paso 4: Añadir o editar tus archivos
Crea tu archivo en la carpeta correspondiente (`content/posts/`, `content/noticias/`, etc.).

### Paso 5: Probar en local
Puedes abrir `index.html` directamente en tu navegador web o usar cualquier servidor estático local:
```bash
# Con Python:
python3 -m http.server 8000
# Abre http://localhost:8000 en tu navegador
```

### Paso 6: Hacer commit y push
```bash
git add .
git commit -m "feat(posts): añadir artículo sobre análisis con YARA"
git push origin post/analisis-malware-yara
```

### Paso 7: Abrir la pull request (PR)
1. Ve a GitHub y verás el botón **Compare & pull request**.
2. Rellena la plantilla de PR marcando las casillas correspondientes.
3. El profesorado o compañeros revisarán tu PR y, una vez aprobada, ¡se publicará automáticamente en la web!

---

## 2. Cómo publicar un nuevo artículo

Crea un nuevo archivo `.md` dentro de `content/posts/` con un nombre representativo en minúsculas y separado por guiones:

> **Ejemplo:** `content/posts/analisis-malware-yara.md`

### Estructura de encabezado (frontmatter) obligatoria

```markdown
---
title: "Título claro y descriptivo del artículo"
date: "2026-10-10"
author: "Tu Nombre y Apellido"
author_github: "tu_usuario_github"
category: "post"
tags: ["malware", "yara", "forense", "blueteam"]
summary: "Breve resumen de 1-2 frases que aparecerá en la tarjeta de la página principal."
---

# Título del artículo

Aquí comienza tu artículo técnico...
```

---

## 3. Cómo publicar una noticia

Crea tu archivo en `content/noticias/` (ej: `content/noticias/vulnerabilidad-critica-cve-2026.md`):

```markdown
---
title: "Título de la noticia o aviso de seguridad"
date: "2026-10-10"
author: "Tu Nombre o Comisión"
author_github: "tu_usuario_github"
category: "noticia"
tags: ["cve", "alerta", "incibe"]
summary: "Resumen conciso del aviso o evento."
---

# Título de la noticia

Detalle de la noticia...
```

---

## 4. Cómo añadir enlaces, cursos o recursos

Si quieres recomendar una herramienta o laboratorio, añade una entrada en `content/recursos/index.json` o `content/cursos/index.json`:

```json
{
  "id": "rec-mi-herramienta",
  "title": "Nombre de la herramienta o plataforma",
  "category": "recurso",
  "url": "https://enlace-oficial.com/",
  "summary": "Explicación de para qué sirve y por qué es útil.",
  "tags": ["osint", "herramienta", "gratis"],
  "badge": "Herramienta",
  "author": "Tu Nombre",
  "date": "2026-10-10"
}
```

---

## 5. Enlazar con el glosario de ciberseguridad

El [Glosario Colaborativo de Ciberseguridad](https://cibercelia.github.io/glosario/) es uno de los proyectos de la organización.

Siempre que en tu artículo utilices términos técnicos clave (como *MFA*, *Zero Trust*, *Ransomware*, *SIEM*, etc.), puedes añadir un enlace o referencia al glosario:

```markdown
Para profundizar en este concepto, consulta el término [MFA en el glosario](https://cibercelia.github.io/glosario/terms/mfa/).
```

---

## 6. Buenas prácticas de redacción y Markdown

- **Bloques de código con lenguaje**: Especifica siempre el lenguaje (`bash`, `python`, `yaml`, `json`, `text`):
  ```bash
  nmap -sV -p- 192.168.1.1
  ```
- **Llamadas y alertas (Callouts)**:
  ```markdown
  > [!NOTE]
  > Explicación o detalle de contexto.

  > [!IMPORTANT]
  > Requisito imprescindible o precaución de seguridad.

  > [!WARNING]
  > Advertencia de impacto o riesgo.
  ```
- **Diagramas y esquemas**: Utiliza diagramas en texto o tablas para clarificar flujos de ataque o arquitecturas defensivas.
- **Ética y legalidad**: Todo el contenido debe orientarse a fines educativos, éticos y de defensa en entornos de laboratorio autorizados.

¡Muchas gracias por colaborar en hacer crecer **CiberCelia**! 🚀
