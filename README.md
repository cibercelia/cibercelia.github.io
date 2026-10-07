# 🛡️ CiberCelia

Portal web estático colaborativo del **Curso de Especialización de Ciberseguridad en Entornos de las Tecnologías de la Información** del **IES Celia Viñas** (Almería).

![CiberCelia Banner](assets/images/logo.svg)

---

## 🌐 Enlaces Oficiales

- **Portal Web CiberCelia:** [https://cibercelia.github.io/cibercelia/](https://cibercelia.github.io/cibercelia/) (o [https://cibercelia.github.io/](https://cibercelia.github.io/))
- **Glosario Colaborativo de Ciberseguridad:** [https://cibercelia.github.io/glosario/](https://cibercelia.github.io/glosario/)
- **Organización en GitHub:** [https://github.com/cibercelia](https://github.com/cibercelia)
- **Repositorio del Glosario:** [https://github.com/cibercelia/glosario](https://github.com/cibercelia/glosario)

---

## 🚀 Características de la Web

1. **Docs-as-Code & PRs del Alumnado**: Cualquier estudiante puede publicar artículos técnicos, guías de laboratorio, writeups de CTF y noticias mediante Pull Requests en formato Markdown.
2. **Integración con el Glosario de Ciberseguridad**: Tarjeta destacada y enlaces contextuales al glosario oficial de la organización.
3. **Búsqueda en Tiempo Real y Filtros**:
   - Búsqueda instantánea por texto completo (títulos, resúmenes, autores, etiquetas).
   - Filtros rápidos por categorías (`Artículos`, `Noticias`, `Recursos`, `Cursos`, `Repositorios`).
   - Filtrado por etiquetas (`#pentesting`, `#mfa`, `#redteam`, `#blueteam`, `#ctf`, `#web`, etc.).
4. **Lector Integrado de Artículos Markdown**:
   - Modal interactivo rápido y vista completa en página independiente (`post.html`).
   - Resaltado de sintaxis para código (`bash`, `python`, `yaml`, `json`, `text`) con botón para copiar al portapapeles.
   - Soporte para alertas de GitHub (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`).
5. **Diseño Moderno de Ciberseguridad**:
   - Tema oscuro por defecto con soporte para modo claro persistente en `localStorage`.
   - Paleta tecnológica con acentos cian y violeta neón, componentes con efecto cristal (*glassmorphism*) y diseño 100% responsivo.
6. **Despliegue Automático en GitHub Pages**:
   - Flujo de trabajo de GitHub Actions en `.github/workflows/deploy.yml` que publica los cambios en cuanto se aprueban las PRs en la rama `main`.

---

## 📂 Estructura del Proyecto

```text
cibercelia/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml              # Despliegue automatizado en GitHub Pages
│   ├── PULL_REQUEST_TEMPLATE.md    # Plantilla con checklist para PRs del alumnado
│   └── ISSUE_TEMPLATE/             # Plantillas para proponer posts y recursos
├── assets/
│   ├── css/
│   │   ├── style.css               # Sistema de diseño, temas claro/oscuro y componentes
│   │   └── prism.css               # Tema de sintaxis de código
│   ├── js/
│   │   ├── app.js                  # Lógica de búsqueda, filtros, tema y navegación
│   │   ├── content.js              # Manifiesto de contenidos y motor Markdown
│   │   └── prism.js                # Resaltador de sintaxis ligero
│   └── images/
│       ├── logo.svg                # Logotipo en vector SVG
│       └── favicon.svg             # Favicon
├── content/
│   ├── posts/                      # Artículos técnicos en Markdown
│   ├── noticias/                   # Avisos y noticias de ciberseguridad
│   ├── recursos/                   # Catálogo de herramientas y laboratorios
│   ├── cursos/                     # Cursos y certificaciones recomendadas
│   └── proyectos/                  # Repositorios de la organización
├── index.html                      # Portal principal
├── post.html                       # Visor independiente de artículos
├── CONTRIBUTING.md                  # Guía paso a paso para estudiantes
└── README.md                       # Documentación del proyecto
```

---

## 💻 Ejecución y Desarrollo Local

No se necesitan dependencias pesadas de Node ni compiladores:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Abrir directamente index.html en cualquier navegador
```

---

## 🤝 ¿Cómo colaborar?

Consulta la [Guía de Contribución (CONTRIBUTING.md)](CONTRIBUTING.md) para ver los pasos detallados de bifurcación (Fork), creación de ramas y envío de Pull Requests.
