---
id: engineering-protocols.delegation-contract
title: Contrato de delegación de tarea
summary: Entregar una tarea con contexto, alcance, criterios y evidencia suficientes para ejecutarla sin conversación previa.
type: template
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [delegacion, tareas, contrato, alcance, criterios]
related:
  - engineering-protocols.work-delegation
  - engineering-protocols.completion-and-stop
---

# Tarea [ID]

- **Propiedad:** [quién responde por la tarea]
- **Nivel de autoridad:** [qué puede hacer sin preguntar]
- **Estado:** redactado | aceptado | en ejecución | cerrado

## Objetivo

[Qué resultado se busca, en una frase. No cómo lograrlo.]

## Contexto

[Por qué esta tarea existe ahora. Qué la motivó.]

## Fuentes de verdad

- [Documento o decisión que gobierna esta tarea]
- [Otra fuente aplicable]

[No hagas que el ejecutor las infiera. Si una restricción vive en un documento, nómbralo.]

## Alcance permitido

Modificar únicamente:

- `[ruta o superficie]`
- `[ruta o superficie]`

## Cambios prohibidos

- [Qué no debe tocarse aunque parezca razonable, y por qué]

## Dependencias

- [Qué debe existir antes de empezar, o «ninguna»]

## Criterios de aceptación

- [Condición observable];
- [Condición observable];
- [Condición observable].

[Cada criterio debe poder convertirse en una comprobación. «Debe funcionar correctamente» no es un criterio.]

## Compuertas de calidad

- [Compuerta exigida, por su pregunta y no solo por su comando]
- [Compuerta exigida]

## Evidencia esperada

- archivos modificados;
- comandos ejecutados y su resultado exacto;
- veredicto de cada compuerta;
- riesgos que permanecen.

## Condición de detención

[Cuándo abandonar en lugar de insistir. Omitir si no aplica.]

## Condición de escalamiento

[A quién acudir, con qué información, ante qué situación.]

## Resultado

- **Estado final:** COMPLETO | BLOQUEADO | REQUIERE_REVISIÓN | REQUIERE_DECISIÓN | CANDIDATO_INVÁLIDO | DIFERIDO | SUSTITUIDO
- **Evidencia:** [enlace o referencia al registro]

> Elimina las instrucciones entre corchetes al completar el contrato. Un campo que no aplica se omite; no se rellena con texto vacío.
