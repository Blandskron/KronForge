# Ejemplo de Uso del Prompt de Auditoría Documental

Este ejemplo ilustra cómo aplicar el prompt de auditoría documental (`prompts/agents-first-documentation-review.prompt.md`) en un repositorio real.

---

## Escenario de Ejemplo: Proyecto "Legacy API"

Imagina que tienes un proyecto Node.js/Express heredado con la siguiente estructura de archivos desordenada y confusa:

```txt
legacy-api/
├── package.json
├── index.js
├── legacy-instructions.md  <-- (Obsoleto, contiene instrucciones viejas)
├── docs/
│   ├── old-install.txt    <-- (Instrucciones desactualizadas de 2021)
│   ├── api-endpoints.md   <-- (Documentación de API útil pero incompleta)
│   └── database-v1.png
├── README.md              <-- (README genérico creado por default)
└── .env.example
```

---

## Paso 1: Carga del Prompt

1. Abre tu agente de IA de codificación (como Claude, Gemini, ChatGPT, o tu herramienta local de CLI).
2. Copia todo el contenido del archivo `prompts/agents-first-documentation-review.prompt.md`.
3. Pégalo en el chat de inicio o como instrucción de sistema para tu agente.

---

## Paso 2: Análisis y Auditoría de la IA

Al ejecutar el prompt, la IA iniciará su proceso de análisis. El agente no realizará cambios inmediatos, sino que presentará un reporte de auditoría como el siguiente:

### Transcripción Simulada de la Auditoría

> **IA:** He analizado el repositorio `legacy-api`. A continuación presento mi reporte de auditoría:
> 
> * **Stack Tecnológico Detectado:** Node.js (v18+), Express, npm, variables de entorno en `.env.example`.
> * **Clasificación de Documentación:**
>   * **Vigente y útil:** `docs/api-endpoints.md` (contiene contratos de rutas reales).
>   * **Duplicada/Obsoleta:** `docs/old-install.txt` (los comandos de instalación actuales están en `package.json`).
>   * **Deprecada:** `legacy-instructions.md` (será eliminada, pero rescataremos las reglas de formateo de logs).
> * **Plan de Acción:**
>   1. Crear `AGENTS.md` para guiar a futuros agentes de codificación.
>   2. Migrar la información válida de `docs/api-endpoints.md` a `docs/agent/DATA_SCHEMA.md`.
>   3. Migrar las reglas de logs de `legacy-instructions.md` a `docs/agent/CONFIG.md`.
>   4. Eliminar `legacy-instructions.md` y `docs/old-install.txt`.
>   5. Actualizar `README.md` con instrucciones claras y humanas.

---

## Paso 3: Ejecución de la IA

Una vez aprobado el plan, la IA generará y reestructurará los archivos correspondientes.

### Estructura Final del Repositorio

Después de la ejecución del prompt, tu repositorio quedará limpio y ordenado de la siguiente manera:

```txt
legacy-api/
├── package.json
├── index.js
├── README.md              <-- (Actualizado y human-friendly)
├── AGENTS.md              <-- (Nuevo: Guía de navegación para IAs)
├── docs/
│   ├── agent/
│   │   ├── PERMISSIONS.md <-- (Qué puede modificar la IA y qué no)
│   │   ├── RUNBOOK.md     <-- (Cómo levantar Express localmente)
│   │   ├── TESTS.md       <-- (Comandos npm test)
│   │   ├── CONFIG.md      <-- (Configuración de .env y variables)
│   │   └── DATA_SCHEMA.md <-- (Esquema de API y base de datos)
│   └── database-v1.png
└── .env.example
```

---

## Ejemplo del Archivo `AGENTS.md` Creado

Este es un fragmento de cómo se ve el archivo de entrada para la IA que genera el prompt:

```markdown
# Instrucciones de Agente (AGENTS.md)

Este repositorio contiene un servicio API REST en Node.js.

## Stack Tecnológico
- **Runtime:** Node.js
- **Framework:** Express.js
- **Gestor de Paquetes:** npm

## Comandos Críticos
- Levantar servidor local: `npm run dev`
- Ejecutar tests unitarios: `npm test`

## Rutas Clave de Lectura
- Configuración de Variables de Entorno: `docs/agent/CONFIG.md`
- Esquemas de Datos y API: `docs/agent/DATA_SCHEMA.md`
- Permisos del Agente: `docs/agent/PERMISSIONS.md`

## Reglas de Validación
Antes de terminar cualquier tarea de codificación, debes:
1. Ejecutar `npm run lint` y arreglar advertencias.
2. Ejecutar `npm test` y verificar que el 100% de los tests pasen.
```

---

## Beneficios Obtenidos
1. **Limpieza:** Se eliminó documentación antigua que inducía a error (`old-install.txt` y `legacy-instructions.md`).
2. **Contexto Inmediato:** El próximo agente que entre al proyecto sabrá exactamente qué comandos correr (`npm run dev`) y dónde leer las configuraciones sin perder tiempo analizando todo el código.
3. **Consistencia Humano-Máquina:** Los humanos pueden seguir utilizando el `README.md` simplificado, mientras que las herramientas automatizadas consumen la carpeta `docs/agent/`.

---

# Ejemplo 2: QA Funcional con Prompt Especializado

Este ejemplo muestra cómo aplicar el prompt de QA funcional (`prompts/quality/functional-qa.prompt.md`) sobre el mismo proyecto `legacy-api` después de su documentación.

---

## Escenario

El equipo quiere validar si el endpoint `/api/users` funciona correctamente antes de aprobar un PR que modificó la lógica de autenticación.

---

## Paso 1: Carga del Prompt de QA Funcional

1. Abre `prompts/quality/functional-qa.prompt.md`.
2. Copia todo el contenido.
3. Pégalo en tu agente junto con acceso al repositorio.

---

## Paso 2: Diagnóstico del Agente (Solo Lectura)

> **Agente:** He analizado el repositorio `legacy-api`. A continuación presento el diagnóstico de QA funcional:
>
> * **Stack detectado:** Node.js + Express. Tests con Jest (`npm test`). Sin herramienta de testing E2E configurada.
> * **Flujos funcionales principales identificados:**
>   * Registro de usuario (`POST /api/users`)
>   * Login (`POST /api/auth/login`)
>   * Consulta de perfil (`GET /api/users/:id`)
>   * Actualización de perfil (`PUT /api/users/:id`)
> * **Criterios de aceptación:** Inferidos desde los comentarios del PR y el archivo `docs/api-endpoints.md`.
> * **Gaps detectados:** El flujo de recuperación de contraseña está descrito en el README pero no tiene endpoint implementado documentado.
> * **Riesgo:** El cambio de autenticación podría afectar `GET /api/users/:id` porque verifica el token antes de devolver datos.
>
> Presento el plan de QA antes de continuar.

---

## Paso 3: Checklist QA Propuesto

```
## Flujo: Consulta de Perfil (GET /api/users/:id)

### Casos Felices
- [ ] Usuario autenticado con token válido recibe sus datos correctamente (200 OK).
- [ ] La respuesta no incluye campos sensibles como contraseña o token interno.

### Casos de Error
- [ ] Request sin token devuelve 401 Unauthorized.
- [ ] Token inválido o expirado devuelve 401 Unauthorized.
- [ ] ID de usuario inexistente devuelve 404 Not Found.
- [ ] Usuario autenticado intentando ver perfil de otro usuario devuelve 403 Forbidden.

### Datos de Borde
- [ ] ID con formato no válido (letras, caracteres especiales) devuelve 400 Bad Request.
- [ ] ID numérico fuera de rango devuelve 404 Not Found.
```

---

## Paso 4: Aprobación y Ejecución

El equipo aprueba el checklist. El agente ejecuta los tests existentes:

```
npm test
```

```
PASS  tests/users.test.js
  GET /api/users/:id
    ✓ returns 200 for authenticated user (45ms)
    ✗ returns 403 when accessing another user's profile (12ms) -- FALLO
    ✓ returns 401 without token (8ms)

Tests: 1 failed, 2 passed, 3 total
```

---

## Paso 5: Evidencia Final del Agente

> **Agente:** Checklist ejecutado. Hallazgos:
>
> * **Crítico:** El endpoint `GET /api/users/:id` no valida que el usuario autenticado sea el dueño del perfil solicitado. Cualquier usuario autenticado puede ver el perfil de otro. Esto es una vulnerabilidad de autorización.
> * **Pendiente de confirmar:** El flujo de recuperación de contraseña no tiene endpoint implementado visible. ¿Está fuera del alcance de este PR?
>
> **Recomendación:** No aprobar el PR hasta resolver el hallazgo crítico de autorización.

---

## Beneficios del Ejemplo 2

1. **Evidencia trazable:** El agente entregó hallazgos con comandos ejecutados y salida real.
2. **Sin inventar requisitos:** El agente usó solo los criterios del PR y la documentación existente.
3. **Sin cambios automáticos:** El agente detectó el problema pero esperó aprobación humana para actuar.
