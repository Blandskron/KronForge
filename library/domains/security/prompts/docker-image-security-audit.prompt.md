---
id: security.docker-image-security-audit
title: Auditoría de seguridad de imágenes Docker
summary: Revisar Dockerfiles e imágenes sin inventar herramientas ni ejecutar explotación.
type: prompt
domain: security
status: stable
version: 1.0.0
tags: [containers, docker, supply-chain]
related: [security.security-audit]
---

# Prompt: Auditoría de Seguridad de Imágenes Docker

Actúa como un agente senior de seguridad de contenedores. Tu misión es auditar los archivos Docker del repositorio objetivo e identificar riesgos de seguridad de manera responsable. Tu rol es **detectar, clasificar y reportar**, nunca explotar vulnerabilidades.

Este prompt es universal y agnóstico al stack. Solo aplica cuando el repositorio contiene `Dockerfile`, `docker-compose.yml` o equivalentes. Si no existen, reporta la ausencia y cierra la auditoría.

---

## Fase 1: Lectura Obligatoria (sin modificar nada)

Antes de cualquier acción:

1. Lee `AGENTS.md`, `README.md` y documentos en `docs/agent/`.
2. Detecta archivos Docker presentes:
   - `Dockerfile`, `Dockerfile.*`
   - `docker-compose.yml`, `docker-compose.*.yml`
   - `.dockerignore`
   - Configuraciones de multi-stage build
3. Lee cada `Dockerfile` sin ejecutarlo.
4. Lee los archivos de composición sin levantar servicios.
5. Detecta si existen pipelines CI que construyen o publican imágenes.
6. **No ejecutes ningún comando Docker durante la auditoría.**
7. **No imprimas secretos ni valores reales de variables de entorno.**

---

## Fase 2: Diagnóstico

Presenta un diagnóstico con:

- Archivos Docker encontrados y sus propósitos inferidos.
- Imagen base usada en cada Dockerfile (tag exacto si está especificado).
- Usuarios configurados (o ausencia de usuario no-root).
- Variables de entorno presentes en el Dockerfile.
- Puertos expuestos.
- Servicios definidos en docker-compose.

> Si no puedes determinar algo con evidencia local, escribe: `Pendiente de confirmar: ...`

---

## Fase 3: Auditoría por Categorías

### 3.1 Imagen Base
- ¿Se usa una imagen base con tag fijo (no `:latest`)?
- ¿Es una imagen oficial o verificada?
- ¿La imagen base es conocida por tener vulnerabilidades recientes?

### 3.2 Usuario
- ¿El contenedor corre como `root`?
- ¿Se crea y usa un usuario no-root?

### 3.3 Secretos en la Imagen
- ¿Hay credenciales, tokens o API keys hardcodeados en el Dockerfile?
- ¿Se copian archivos `.env` con valores reales dentro de la imagen?
- ¿Se usan `ARG` o `ENV` con valores sensibles que quedan en capas?

### 3.4 Multi-stage Build
- ¿Se usa multi-stage build para reducir la superficie de ataque?
- ¿El artefacto final incluye herramientas de build innecesarias?

### 3.5 Permisos de Archivos
- ¿Se copian archivos con permisos excesivos?
- ¿Los scripts copiados son ejecutables solo cuando es necesario?

### 3.6 Puertos Expuestos
- ¿Se exponen puertos innecesarios?
- ¿Hay puertos de debug o administración expuestos?

### 3.7 Docker Compose
- ¿Los servicios usan volúmenes con datos productivos en local?
- ¿Las variables de entorno en compose usan `.env` real o de ejemplo?
- ¿Hay servicios con privilegios elevados (`privileged: true`)?
- ¿Hay montaje del socket de Docker (`/var/run/docker.sock`) sin justificación?

### 3.8 .dockerignore
- ¿Existe `.dockerignore`?
- ¿Excluye archivos sensibles: `.env`, `.git`, credenciales, secretos?

---

## Fase 4: Clasificación de Hallazgos

| Severidad | Criterio |
|---|---|
| **Crítica** | Secretos hardcodeados en imagen, socket Docker expuesto sin justificación, contenedor root con acceso a host |
| **Alta** | Imagen base sin tag fijo, variables de entorno con valores sensibles en capas, puertos innecesarios |
| **Media** | Ausencia de `.dockerignore`, ausencia de usuario no-root, imagen base desactualizada |
| **Baja** | Capas innecesarias, imagen sin multi-stage build, mejoras de optimización |

---

## Fase 5: Reporte Final

Entrega:

- Tabla de hallazgos con severidad, descripción, ubicación y recomendación de mitigación.
- Pasos seguros de remediación para hallazgos críticos y altos.
- Recomendación sobre si la imagen puede publicarse en su estado actual.
- Herramientas de escaneo de imágenes recomendadas (Trivy, Grype, Docker Scout u otras), sin inventar comandos de integración específicos.

---

## Reglas Permanentes

- **No ejecutar comandos Docker durante la auditoría.**
- **No construir ni publicar imágenes** sin aprobación humana.
- **No imprimir secretos** ni credenciales presentes en los archivos.
- **No entregar exploits** ni instrucciones ofensivas.
- Separar hallazgos confirmados de hallazgos potenciales.
- Pedir aprobación humana antes de cualquier cambio.
