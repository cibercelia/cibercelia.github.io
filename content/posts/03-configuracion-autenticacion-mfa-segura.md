---
title: "MFA seguro: de contraseñas débiles a passkeys y FIDO2"
date: "2026-09-28"
author: "CiberCelia"
author_github: "cibercelia"
category: "post"
tags: ["mfa", "fido2", "autenticacion", "passkeys", "glosario"]
summary: "Comparativa entre SMS, TOTP y llaves de seguridad físicas resistentes a ataques de phishing de adversario intermediario (AiTM)."
---

# MFA seguro: de contraseñas débiles a passkeys y FIDO2

La autenticación multifactor (**MFA**) es la primera línea de defensa para proteger identidades en la nube y accesos corporativos. Sin embargo, no todos los métodos de doble factor ofrecen el mismo nivel de protección.

> [!NOTE]
> Puedes consultar la definición completa y detallada de **MFA** en nuestro [Glosario de Ciberseguridad](https://cibercelia.github.io/glosario/terms/mfa/).

---

## Comparativa de factores de autenticación

| Método MFA | Nivel de seguridad | Resistente a phishing (AiTM) | Vulnerable a SIM swapping |
| :--- | :---: | :---: | :---: |
| **SMS / Llamada** | ⚠️ Bajo | ❌ No | ✅ Sí |
| **Email OTP** | ⚠️ Bajo | ❌ No | ❌ No |
| **App TOTP (Google/MS Auth)** | 🟡 Medio | ❌ No | ❌ No |
| **Notificación Push** | 🟡 Medio | ❌ No (Fatiga MFA) | ❌ No |
| **FIDO2 / Passkeys / WebAuthn** | 🟢 Muy Alto | ✅ **Sí** | ❌ No |

---

## ¿Por qué FIDO2 / Passkeys es resistente al phishing?

El estándar **FIDO2 (WebAuthn)** utiliza criptografía asimétrica vinculada criptográficamente al dominio del navegador (`Origin binding`):

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Usuario + Llave FIDO2
    participant Browser as 🌐 Navegador (WebAuthn API)
    participant Phish as 🎣 Servidor phishing (banc0-login.com)
    participant Legit as 🏦 Servidor legítimo (banco.com)

    Note over User,Phish: Intento de ataque Adversary-in-the-Middle (AiTM)
    User->>Phish: 1. Accede a página trampa de phishing
    Phish->>Legit: 2. Solicita desafío real a banco.com
    Legit-->>Phish: 3. Devuelve desafío criptográfico (Challenge)
    Phish-->>Browser: 4. Reenvía desafío al navegador de la víctima
    Note over Browser: El navegador vincula el origen 'banc0-login.com'
    Browser->>User: 5. Solicita toque físico a la llave FIDO2
    User-->>Browser: 6. Llave firma desafío con dominio 'banc0-login.com'
    Browser->>Phish: 7. Envía credencial firmada
    Phish->>Legit: 8. Intenta autenticar en banco.com con la firma
    Note over Legit: Servidor legítimo verifica firma para origen 'banco.com'
    Legit--xPhish: ❌ RECHAZADO: Discordancia de origen (banc0-login.com != banco.com)
```

---

## Recomendaciones para administradores

1. Forzar la deshabilitación del segundo factor vía SMS en entornos corporativos.
2. Habilitar **Number Matching** en notificaciones push para evitar ataques de fatiga MFA.
3. Desplegar autenticación basada en certificados o llaves físicas FIDO2 para usuarios con privilegios elevados (Domain Admins, Global Admins).
