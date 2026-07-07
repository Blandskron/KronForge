# Seguridad del Repositorio

Este repositorio es público por diseño y no debe contener secretos. Su principal riesgo no está en ejecución de código productivo, sino en publicar instrucciones inseguras o ejemplos que otros devs copien a sus proyectos. Dado que los prompts pueden guiar agentes sobre repositorios de terceros, las reglas de seguridad son parte del producto.

---

## Secretos

**Prohibido:**

- Agregar `.env` con valores reales.
- Incluir tokens, API keys, certificados, contraseñas o credenciales en ejemplos.
- Copiar secretos desde repositorios auditados al prompt, README o docs.

**Permitido:**

- Usar nombres de variables sin valores reales.
- Usar placeholders como `<API_KEY>` o `PENDIENTE_DE_CONFIGURAR`.
- Documentar reglas de manejo de secretos.

---

## Superficie Sensible

Requiere aprobación humana:

- Cambios en `LICENSE`.
- Cambios en reglas de seguridad del prompt maestro.
- Cambios que permitan eliminar documentación, tests o configuración sin revisión.
- Cambios en instrucciones de publicación de GitHub Pages.
- Cambios en prompts de auditoría de seguridad que relajen restricciones existentes.

---

## Seguridad del Prompt Maestro

El prompt maestro debe mantener estas reglas:

- No inventar arquitectura ni comandos.
- No imprimir secretos.
- No modificar credenciales.
- No cambiar configuración productiva sin aprobación.
- No eliminar documentación útil antes de migrarla.

---

## Seguridad en Prompts de Auditoría

Los prompts de la biblioteca `prompts/quality/`, especialmente `security-audit.prompt.md` y `dependency-vulnerability-audit.prompt.md`, deben:

- **Detectar, clasificar y reportar.** Nunca explotar vulnerabilidades ni entregar instrucciones ofensivas.
- **No imprimir secretos.** Nunca copiar ni registrar valores reales de credenciales o variables de entorno.
- **Separar auditoría de remediación.** El agente detecta y reporta; la remediación requiere aprobación humana.
- **Clasificar por severidad.** Crítica, Alta, Media, Baja. Sin minimizar hallazgos para acelerar un release.
- **Proponer pasos seguros de remediación.** Nunca pasos destructivos sin aprobación.
- **No ejecutar el código del repositorio auditado** durante la auditoría estática.
- **No acceder a sistemas en ejecución** durante la revisión.

Queda **prohibido** en cualquier prompt de esta biblioteca:

- Entregar exploits funcionales.
- Proporcionar instrucciones para comprometer sistemas.
- Automatizar actualizaciones de dependencias sin plan aprobado.
- Ejecutar herramientas de ataque, escaneo activo o fuzzing sin aprobación explícita.

---

## Datos Personales

No agregues ejemplos con datos personales reales. Usa datos ficticios claramente marcados.

---

## Revisión Antes de Publicar

Antes de cerrar una tarea:

1. Buscar patrones sensibles: `api_key`, `secret`, `token`, `password`, `private_key`.
2. Confirmar que los ejemplos no contengan valores reales.
3. Confirmar que el prompt mantenga límites explícitos para agentes.
4. Confirmar que los prompts de auditoría no contengan instrucciones ofensivas ni exploits.
5. Verificar que no se hayan añadido referencias a archivos o rutas inexistentes.
