# 🛡️ Guía para Agentes de IA en CiberCelia

Este repositorio (`cibercelia.github.io`) es el portal didáctico y colaborativo para el alumnado del **Curso de Especialización de Ciberseguridad en Entornos de las Tecnologías de la Información** del **IES Celia Viñas** (Almería).

Cualquier agente de IA que genere contenido, modifique código o revise contribuciones en este proyecto **DEBE** cumplir estrictamente las siguientes directrices:

---

## 1. Identidad y Claridad Institucional
- **Recurso educativo independiente**: CiberCelia es un recurso didáctico de apoyo para las clases y prácticas del curso. **NO es la página web oficial institucional del IES Celia Viñas**.
- **Aviso informativo obligatorio**: Siempre debe mantenerse visible y claro el mensaje aclaratorio (*disclaimer*) tanto en la portada como en el pie de página.
- **El Glosario**: El repositorio `cibercelia.github.io/glosario` es un proyecto colaborativo más dentro de la organización `cibercelia`, no el eje exclusivo del portal.

---

## 2. Rigor Técnico y Datos 100% Reales
- **Prohibido el contenido ficticio**: NUNCA inventes herramientas inexistentes, falsos repositorios, empresas ficticias ni marcadores de posición (*placeholders/lorem ipsum*).
- **Fuentes reales y de calidad**: Todas las referencias, cursos, plataformas de laboratorio y herramientas deben ser reales y contrastadas (p. ej., PortSwigger Web Security Academy, Hack The Box, TryHackMe, GTFOBins, CyberChef, INCIBE, CCN-CERT, MITRE ATT&CK, OWASP, NIS2, CompTIA, etc.).

---

## 3. Normas Ortográficas de la RAE para Títulos y Textos
- **Uso de mayúsculas en títulos (*sentence case*)**: Según la RAE (*Ortografía de la lengua española*, cap. IV, § 4.2.4.8), en español los títulos de artículos, noticias, secciones, botones y recursos **solo llevan mayúscula en la primera palabra y en nombres propios o siglas**.
  - ❌ *Incorrecto:* `Guía De Inicio Para Montar Tu Laboratorio De Pentesting`
  - ✅ *Correcto:* `Guía de inicio para montar tu laboratorio de pentesting con VirtualBox y Docker`
  - ❌ *Incorrecto:* `Análisis En Profundidad De Log4Shell`
  - ✅ *Correcto:* `Análisis en profundidad de Log4Shell (CVE-2021-44228)`
- **Sin puntuación final en títulos**: Los títulos y encabezados (`h1`, `h2`, `h3`, etc.) no deben terminar con punto final ni con dos puntos aislados.
- **Acentuación estricta**: Asegurar tildes en todas las palabras en español (*análisis*, *autenticación*, *guía*, *noticias*, *estándar*, *configuración*, *prácticas*, etc.).
- **Traducción técnica natural**: Preferir expresiones claras en español como *solicitud de extracción* (*pull request*), *bifurcación* (*fork*) o *registros* (*logs*).

---

## 4. Arquitectura Docs-as-Code y Generador Estático (SSG)
- **Estructura de contenidos y plantillas**:
  - Artículos técnicos: `content/posts/<slug>.md`
  - Avisos y noticias: `content/noticias/<slug>.md`
  - Enlaces y herramientas: `content/recursos/index.json`
  - Cursos y certificaciones: `content/cursos/index.json`
  - Repositorios de la organización: `content/proyectos/index.json`
  - Plantillas desacopladas: `templates/article.html` y `templates/partials/*.html`
- **Plantillas HTML independientes**: Las plantillas NUNCA deben estar incrustadas como cadenas en el código JavaScript. Deben residir como archivos `.html` independientes y limpios dentro de `templates/` utilizando etiquetas `{{variable}}` y `{{> partial}}`.
- **Exclusión de archivos HTML compilados en Git**: Las carpetas generadas `posts/`, `noticias/`, `assets/data/` y `assets/js/content.js` están incluidas en `.gitignore`. El repositorio almacena únicamente los archivos `.md`, fuentes y plantillas.
- **Compilación automática en GitHub Pages**: En cada *push* o integración a `main`, GitHub Actions ejecuta `node scripts/build.js` y publica las páginas renderizadas directamente en GitHub Pages.
- **Validación local obligatoria**: En desarrollo local o antes de enviar una PR/commit, se **DEBE ejecutar el compilador SSG** (`node scripts/build.js`) para verificar que no existan errores de compilación antes de subir los cambios Markdown.
- **Páginas HTML estáticas e independientes**:
  - Los artículos se compilan en `posts/<slug>/index.html` (accesible en `/posts/<slug>/`).
  - Las noticias se compilan en `noticias/<slug>/index.html` (accesible en `/noticias/<slug>/`).
  - **Prohibido el uso de ventanas modales o parámetros dinámicos (`post.html?id=...`)** para leer artículos. Deben ser páginas web completas e independientes con navegación limpia.
- **Rutas relativas**: Todos los enlaces y recursos estáticos en las plantillas deben usar rutas relativas (`../../assets/...`) para funcionar perfectamente en `https://cibercelia.github.io/` y en desarrollo local.

---

## 5. Diseño, Accesibilidad y Usabilidad
- **Temas claro y oscuro**: Toda nueva vista o componente debe soportar las variables CSS de tema (`--bg-primary`, `--text-primary`, etc.) y garantizar contraste accesible en ambos modos.
- **Bloques de código**: Todo bloque de código Markdown debe especificar su lenguaje (`bash`, `python`, `yaml`, `json`, `text`) y contar con botón de copiado.
- **Callouts estilo GitHub**: Usar la sintaxis nativa de alertas (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!TIP]`, `> [!CAUTION]`).

---

## 6. Verificación antes de finalizar cambios
Antes de dar por completada cualquier tarea o enviar cambios a `main`:
1. Ejecutar `node scripts/build.js` y comprobar que no hay errores de compilación.
2. Revisar que los títulos cumplen las reglas de la RAE.
3. Verificar que los enlaces internos funcionan correctamente.
