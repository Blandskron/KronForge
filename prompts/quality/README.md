# Biblioteca de Prompts de Validación Interna

Esta carpeta contiene prompts especializados para que agentes de IA ejecuten procesos de validación interna de calidad de software de manera segura, trazable y basada en evidencia local.

## Filosofía

Cada prompt de esta biblioteca sigue la misma filosofía del prompt maestro:

- **Leer antes de modificar.** El agente debe explorar el repositorio antes de proponer cualquier acción.
- **Sin comandos inventados.** El agente detecta comandos reales desde manifests, Makefiles, CI, scripts y documentación existente.
- **Sin stack asumido.** El agente detecta el stack tecnológico real del repositorio objetivo.
- **Plan antes de ejecutar.** El agente presenta un plan con hallazgos y riesgos antes de modificar archivos.
- **Aprobación humana para cambios sensibles.** Ningún prompt autoriza acciones destructivas sin confirmación explícita.
- **Evidencia final.** El agente entrega un resumen con comandos ejecutados, hallazgos, riesgos y pendientes.

## Prompts Disponibles

| Archivo | Propósito |
|---|---|
| [unit-tests.prompt.md](unit-tests.prompt.md) | Detectar y crear tests unitarios sobre lógica verificable |
| [integration-tests.prompt.md](integration-tests.prompt.md) | Revisar y crear tests de integración entre módulos o servicios |
| [functional-qa.prompt.md](functional-qa.prompt.md) | QA funcional basado en requerimientos y flujos reales |
| [regression-qa.prompt.md](regression-qa.prompt.md) | Identificar qué puede romperse con el cambio actual |
| [security-audit.prompt.md](security-audit.prompt.md) | Auditoría de ciberseguridad responsable: detectar, clasificar, reportar |
| [dependency-vulnerability-audit.prompt.md](dependency-vulnerability-audit.prompt.md) | Revisar vulnerabilidades en dependencias y lockfiles |
| [docker-image-security-audit.prompt.md](docker-image-security-audit.prompt.md) | Auditoría de seguridad de imágenes Docker y Dockerfile |
| [code-quality-review.prompt.md](code-quality-review.prompt.md) | Revisión de calidad de código: duplicación, deuda técnica, mantenibilidad |
| [architecture-validation.prompt.md](architecture-validation.prompt.md) | Validar estructura real del repositorio versus decisiones arquitectónicas |
| [performance-basic-validation.prompt.md](performance-basic-validation.prompt.md) | Identificar riesgos básicos de performance sin herramientas externas |
| [definition-of-done-review.prompt.md](definition-of-done-review.prompt.md) | Checklist para validar si una tarea puede cerrarse |
| [release-readiness-review.prompt.md](release-readiness-review.prompt.md) | Validar si el repositorio está listo para un release |

## Uso Recomendado

```
Copiar → Pegar → Auditar → Aprobar → Aplicar
```

1. Elige el prompt adecuado para tu necesidad.
2. Copia su contenido completo.
3. Pégalo en tu agente de IA junto con acceso al repositorio objetivo.
4. Pide primero un diagnóstico de solo lectura.
5. Revisa el plan antes de aprobar cambios.

## Reglas de Validación para Prompts de Esta Biblioteca

Antes de agregar o modificar un prompt en esta carpeta, verifica:

- [ ] El prompt es universal y agnóstico al stack.
- [ ] El prompt obliga al agente a leer el repositorio antes de proponer cambios.
- [ ] El prompt prohíbe comandos inventados.
- [ ] El prompt exige plan antes de cambios.
- [ ] El prompt prohíbe relajar o eliminar pruebas para hacer pasar validaciones.
- [ ] El prompt prohíbe imprimir secretos o copiar valores reales de configuración.
- [ ] El prompt separa fases: lectura → diagnóstico → plan → ejecución → evidencia.
- [ ] El prompt exige aprobación humana para cambios sensibles.
- [ ] El prompt entrega evidencia final verificable.
