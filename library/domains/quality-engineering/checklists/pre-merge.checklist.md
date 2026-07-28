---
id: quality-engineering.pre-merge
title: Checklist antes del merge
summary: Verificar evidencia mínima antes de integrar un cambio.
type: checklist
domain: quality-engineering
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [merge, quality-gate]
related: [quality-engineering.definition-of-done-review]
---

# Checklist Antes del Merge

Registra cada ítem como `Cumple`, `No cumple` o `No aplica`, siempre con evidencia o justificación.

## Alcance

- [ ] El cambio corresponde al objetivo acordado.
- [ ] El diff no incluye archivos ajenos ni datos sensibles.
- [ ] Las decisiones no obvias están documentadas.

## Comportamiento

- [ ] Los criterios de aceptación fueron verificados.
- [ ] Los casos límite relevantes fueron considerados.
- [ ] No hay regresiones conocidas sin documentar.

## Calidad y pruebas

- [ ] Se ejecutaron los comandos reales definidos por el repositorio.
- [ ] Las pruebas pasan sin desactivarlas ni relajarlas.
- [ ] Los fallos o validaciones no ejecutadas están explicados.

## Seguridad y operación

- [ ] No se introdujeron secretos, permisos excesivos ni dependencias sin revisar.
- [ ] Migración, despliegue y rollback están documentados cuando aplican.
- [ ] Logs, métricas y alertas cubren cambios operativamente relevantes.

## Documentación

- [ ] README, contratos, runbooks y changelog están actualizados cuando aplica.
- [ ] Enlaces y ejemplos resuelven.
- [ ] Un revisor puede reproducir la evidencia.

## Veredicto

- **Resultado:** Listo | No listo
- **Bloqueantes:**
- **Evidencia:**
- **Responsable de la decisión:**
