---
id: context-engineering.progressive-context
title: Contexto progresivo
summary: Entregar contexto por capas a medida que la tarea demuestra necesitarlo.
type: pattern
domain: context-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [context, progressive-disclosure, token-optimization]
related: [context-engineering.context-layers]
---

# Pattern: Contexto Progresivo

## Contexto

Una tarea compleja dispone de más conocimiento del que conviene cargar inicialmente.

## Problema

Incluir todo desde el principio aumenta ruido, costo y riesgo de que instrucciones lejanas compitan con las relevantes.

## Solución

Entregar contexto en tres niveles:

1. **Mapa:** propósito, límites, rutas y reglas críticas.
2. **Paquete de tarea:** documentos y evidencia directamente relacionados.
3. **Profundidad bajo demanda:** implementaciones, historial o referencias solicitadas durante la ejecución.

Cada nivel incluye punteros al siguiente y condiciones para expandirse.

## Cuándo usarlo

- repositorios grandes o monorepos;
- documentación extensa;
- tareas que cambian de fase;
- agentes con herramientas de lectura.

## Cuándo evitarlo

- decisiones atómicas donde todo el contrato cabe de forma segura;
- tareas que necesitan comparación simultánea de todas las fuentes;
- entornos sin forma confiable de recuperar contexto adicional.

## Ventajas

- menor ruido inicial;
- consumo de contexto controlado;
- permisos y alcance más fáciles de aplicar;
- decisiones de expansión observables.

## Desventajas

- requiere índices confiables;
- una mala ruta puede ocultar evidencia necesaria;
- agrega latencia si el agente solicita demasiadas capas.

## Ejemplo

Un agente recibe primero `AGENTS.md` y un mapa del módulo. Solo después de detectar que cambiará configuración carga `CONFIG.md`, el archivo real y sus pruebas relacionadas.

## Validación

Registra qué capa activó cada lectura y verifica que ninguna restricción crítica dependa exclusivamente de una capa opcional.
