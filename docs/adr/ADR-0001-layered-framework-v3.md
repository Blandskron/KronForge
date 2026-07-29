# ADR-0001: Arquitectura v3 por capas y evolución gradual

- **Estado:** accepted
- **Fecha:** 2026-07-28
- **Responsable:** maintainer del repositorio
- **Reemplaza:** alcance estratégico v2, sin invalidar sus documentos históricos

## Contexto

La arquitectura por dominios de v2 resolvió la organización de prompts y skills, pero v3 debe incorporar gobernanza, aprendizaje, automatización, benchmarks y una experiencia web más rica. Crear carpetas o activos para cada concepto produciría contenido de relleno y elevaría el costo de mantenimiento.

## Decisión

Adoptar seis capas: orientación, conocimiento, ejecución, gobernanza, presentación y automatización. Mantener el dominio como unidad principal y habilitar tipos adicionales solo mediante contratos; una carpeta se materializa cuando contiene conocimiento real.

La entrega v3 se limita a arquitectura, gobernanza, calidad y experiencia esencial. La expansión de contenido se mueve al roadmap.

## Alternativas consideradas

### Repositorio plano por tipo

- simplifica búsquedas iniciales;
- no escala ownership ni contexto de dominio;
- rechazada.

### Runtime o framework web

- permitiría routing y componentes avanzados;
- rompería la adopción directa de GitHub Pages y agregaría toolchain;
- rechazada.

### Implementar todas las fases del prompt en una entrega

- aumentaría cobertura aparente;
- produciría activos superficiales y decisiones no validadas;
- rechazada.

## Consecuencias

### Positivas

- crecimiento localizado;
- límites de responsabilidad explícitos;
- compatibilidad con rutas actuales;
- roadmap honesto y medible.

### Negativas y riesgos

- algunas áreas seguirán sin activos;
- la taxonomía admitirá tipos aún no materializados;
- requiere disciplina para no crear carpetas vacías.

## Validación

- arquitectura publicada en `docs/architecture/`;
- ningún activo existente cambia de ruta;
- validadores impiden carpetas o referencias incoherentes;
- roadmap separa claramente implementado y futuro.

