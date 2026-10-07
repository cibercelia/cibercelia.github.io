---
title: "MFA Seguro: De contraseñas débiles a Passkeys y FIDO2"
date: "2026-09-28"
author: "CiberCelia"
author_github: "cibercelia"
category: "post"
tags: ["mfa", "fido2", "autenticacion", "passkeys", "glosario"]
summary: "Comparativa entre SMS, TOTP y llaves de seguridad físicas resistentes a ataques de phishing de adversario intermediario (AiTM)."
---

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

El estándar **FIDO2 (WebAuthn)** utiliza criptografía asimétrica vinculada criptográficamente al dominio del navegador (`Origin binding`):

```text
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
```

---

## Recomendaciones para Administradores

1. Forzar la deshabilitación del segundo factor vía SMS en entornos corporativos.
2. Habilitar **Number Matching** en notificaciones push para evitar ataques de fatiga MFA.
3. Desplegar autenticación basada en certificados o llaves físicas FIDO2 para usuarios con privilegios elevados (Domain Admins, Global Admins).
