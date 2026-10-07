# 🛡️ CiberCelia

Espacio didáctico y colaborativo creado como recurso de aprendizaje para el alumnado del **Curso de Especialización de Ciberseguridad en Entornos de las Tecnologías de la Información** del **IES Celia Viñas** (Almería).

> **Nota informativa:** Este portal es un proyecto educativo independiente de apoyo a las clases y prácticas del curso.

---

## 🌐 Enlaces del proyecto

- **Web CiberCelia:** [https://cibercelia.github.io/](https://cibercelia.github.io/)
- **Glosario colaborativo:** [https://cibercelia.github.io/glosario/](https://cibercelia.github.io/glosario/)
- **Organización en GitHub:** [https://github.com/cibercelia](https://github.com/cibercelia)
- **Repositorio de la web:** [https://github.com/cibercelia/cibercelia.github.io](https://github.com/cibercelia/cibercelia.github.io)
- **Repositorio del glosario:** [https://github.com/cibercelia/glosario](https://github.com/cibercelia/glosario)

---

## 🚀 Características de la web

1. **Docs-as-Code y PRs del alumnado**: El alumnado puede publicar artículos técnicos, guías de laboratorio, *writeups* de CTF y noticias mediante solicitudes de extracción (*pull requests*) en formato Markdown.
2. **Generación estática de artículos (SSG)**: Cada artículo y noticia se compila automáticamente a su propia página HTML estática e independiente (`posts/<slug>/` y `noticias/<slug>/`) con URLs limpias al estilo de MkDocs o Hugo, formateo Markdown completo, bloques de código con resaltado y botón de copiado, y alertas de GitHub.
3. **Búsqueda en tiempo real y filtros**:
   - Búsqueda instantánea por texto (títulos, resúmenes, autores, etiquetas).
   - Filtros por categorías (`Artículos`, `Noticias`, `Recursos`, `Cursos`, `Repositorios`).
   - Filtrado por etiquetas (`#pentesting`, `#mfa`, `#redteam`, `#blueteam`, `#ctf`, `#web`, etc.).
4. **Repositorios y enlaces**:
   - Muestra de proyectos de la organización (incluyendo el glosario y repositorios de prácticas).
5. **Diseño moderno de ciberseguridad**:
   - Tema oscuro por defecto con soporte para modo claro persistente en `localStorage`.
   - Paleta tecnológica con acentos cian y violeta neón, componentes *glassmorphism* y diseño 100% responsivo.
6. **Despliegue y compilación automática en GitHub Pages**:
   - Flujo de trabajo de GitHub Actions en `.github/workflows/deploy.yml` que ejecuta `node scripts/build.js` y publica los cambios en cuanto se aprueban las PRs en la rama `main`.

---

## 📂 Estructura del proyecto

```text
cibercelia/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml              # Compilación SSG y despliegue en GitHub Pages
│   ├── PULL_REQUEST_TEMPLATE.md    # Plantilla con checklist para PRs del alumnado
│   └── ISSUE_TEMPLATE/             # Plantillas para proponer posts y recursos
├── assets/
│   ├── css/
│   │   ├── style.css               # Sistema de diseño, temas claro/oscuro y componentes
│   │   └── prism.css               # Tema de sintaxis de código
│   ├── js/
│   │   ├── app.js                  # Lógica de búsqueda, filtros y tema
│   │   ├── marked.min.js           # Parser Markdown para el SSG
│   │   ├── mermaid.min.js          # Motor de diagramas vectoriales interactivos
│   │   └── prism.js                # Resaltador de sintaxis ligero
│   └── images/
│       ├── logo.svg                # Logotipo en vector SVG
│       └── favicon.svg             # Favicon
├── content/
│   ├── posts/                      # Artículos técnicos en Markdown (.md)
│   ├── noticias/                   # Avisos y noticias de ciberseguridad (.md)
│   ├── recursos/                   # Catálogo de herramientas y laboratorios (.json)
│   ├── cursos/                     # Cursos y certificaciones recomendadas (.json)
│   └── proyectos/                  # Repositorios de la organización (.json)
├── templates/
│   ├── article.html                # Plantilla HTML para artículos y noticias
│   └── partials/                   # Componentes HTML reutilizables (head, header, footer, scripts)
├── scripts/
│   └── build.js                    # Compilador SSG con motor de plantillas desacoplado
├── index.html                      # Portal principal
├── CONTRIBUTING.md                  # Guía paso a paso para estudiantes
├── LICENSE.md                      # Licencia dual (MIT para código, CC BY-SA para contenidos)
└── README.md                       # Documentación del proyecto
```

> **Nota:** El repositorio almacena únicamente los archivos fuente, plantillas y el contenido en Markdown (`.md`). Al hacer *push* o fusionar una PR en `main`, **GitHub Actions** ejecuta automáticamente `node scripts/build.js` y genera las páginas `.html` (`/posts/<slug>/` y `/noticias/<slug>/`) que se publican en **GitHub Pages**.

---

## 💻 Ejecución y desarrollo local

No se necesitan dependencias pesadas de Node ni compiladores:

```bash
# Opción 1: Servidor HTTP con Python
python3 -m http.server 8000

# Opción 2: Abrir directamente index.html en cualquier navegador
```

---

## 🤝 ¿Cómo colaborar?

Consulta la [Guía de contribución (CONTRIBUTING.md)](CONTRIBUTING.md) para ver los pasos detallados de bifurcación (Fork), creación de ramas y envío de Pull Requests.

---

## 📄 Licencias

Este proyecto utiliza un esquema de **doble licencia**:
- **Código fuente y software** (HTML, CSS, JS, scripts): [Licencia MIT](LICENSE.md).
- **Contenidos educativos y documentación** (artículos, guías, noticias, glosario): [Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.es).

