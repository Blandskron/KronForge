# C0 de KronForge — Piloto de BLK-ENG-001

**Estado** C0 cerrado. C1 cerrado para el piloto interno A + R de `c1-internal.1`, con excepción a la revisión independiente autorizada por el titular. Los tres ADR conservan el estado `proposed`.

**Decisión del titular, 2026-11-27.** El usuario, en calidad de titular, autorizó por escrito en el chat el uso y la adaptación interna de **BLK-ENG-001 v1.0 + Anexo A.1** y aprobó C1 para el perfil A con extensión R. La autorización rige para la revisión fijada por el SHA-256 de esta ficha y para la preparación y las pruebas locales del candidato. La distribución pública de derivados queda fuera del permiso.

## Revisión de los ADR

| ADR | Evaluación de C0 | Evidencia para avanzar |
|---|---|---|
| [ADR-0009](adr/ADR-0009-pack-composition-and-distribution.md) | Recomendar la ruta manual como primer experimento. Registrar procedencia y contenido mediante un inventario revisable. Posponer la decisión sobre campos y nombre de un manifiesto estable hasta observar qué necesita el consumidor. | C1 debe detectar recursos faltantes al consumir el snapshot aislado. C2 decide el contrato. C3 compara la proyección de cliente con la ruta manual. |
| [ADR-0010](adr/ADR-0010-pinned-installation-and-trust.md) | Recomendar pinning, digest, revisión previa y recuperación desde el primer piloto. Registrar en el diff y la evidencia la propiedad de destinos y el estado anterior. | C1 prueba copia, repetición, colisión y recuperación con Git. Lock interoperable, resolución transitiva y recuperación automatizada se evalúan en C2. |
| [ADR-0011](adr/ADR-0011-external-adoption-before-cli.md) | Recomendar AFP-006 y revisión por un consumidor distinto del autor en C1. Definir la rúbrica ahora y reservar AFP-007 para equivalencia entre interfaces y AFP-008 para la comparación de C4. | C1 deja evidencia de consumo y fricción. La CLI requiere la misma fricción reproducida en al menos dos consumidores independientes durante varios ciclos. |

## Alcance y entorno del piloto

**Resultado** Una persona y un agente con acceso a Markdown y Git pueden tomar un repositorio de prueba, diagnosticar su política de ramas, preparar una release versionada y un hotfix local, producir evidencia de sus gates y revertir la adopción sin perder cambios.

- **Perfil obligatorio** Releases versionadas con rama principal y una línea de mantenimiento. El escenario define deliberadamente la topología y el resultado esperado del hotfix. Los nombres se leen del proyecto. El perfil de ramas cortas se reserva como contraste de portabilidad.
- **Entorno** Repositorio Git desechable separado del checkout productor, con archivos sintéticos, commits identificados, reglas locales propias y un gate determinista documentado en el fixture. Se entrega el snapshot y su guía al revisor. Se registra sistema operativo, versión de Git y cliente de agente si se usa. La aceptación de C1 cubre el entorno probado.
- **Entregable de C1** Una guía de aplicación y reversión, un inventario de archivos y licencias, un snapshot identificado por digest y un ejemplo de evidencia completada. Si la fuente confirma una skill pertinente, se incluye su carpeta autocontenida y se prueba con acceso explícito a su Markdown.
- **Límite operativo** Cambios locales en el fixture bajo alcance aprobado. Etiquetado, push, publicación, configuración global, hooks activos, CI, integraciones MCP, marketplaces, CLI e instalación automatizada quedan fuera del piloto base.

## Matriz de reuso

| Necesidad | Fuente vigente | Trabajo del piloto |
|---|---|---|
| Diagnosticar estado, reglas y alcance | [Playbook agents-first](../library/domains/ai-agent-engineering/playbooks/prepare-agents-first.playbook.md) y [AFP-001](../library/domains/engineering-protocols/protocols/repository-state.protocol.md) | Parametrizar los hechos del fixture y respetar su `AGENTS.md`. |
| Preparar cambios y release | [Checklist pre-merge](../library/domains/quality-engineering/checklists/pre-merge.checklist.md), [prompt de release](../library/domains/delivery-platform/prompts/release-readiness-review.prompt.md) y [AFP-009](../library/domains/engineering-protocols/protocols/release-readiness.protocol.md) | Agregar el recorrido específico release/hotfix y contrastar si BLK-ENG-001 ya aporta la skill requerida. |
| Capturar gates y revisión | [Registro de evidencia](../library/domains/engineering-protocols/templates/evidence-record.template.md) y [AFP-005](../library/domains/engineering-protocols/protocols/independent-review.protocol.md) | Reutilizar la plantilla y distinguir ejecución, revisión y aprobación. |
| Verificar el consumo | [AFP-006](../library/domains/engineering-protocols/protocols/external-consumption-validation.protocol.md) | Validar el snapshot exacto en un checkout consumidor aislado. |

La revisión de la fuente marcará cada componente como reutilizado, adaptado, nuevo o excluido y registrará el motivo. La deriva editorial de versión y capas identificada en la [auditoría](audits/KRONFORGE_EVOLUTION_AUDIT.md) queda programada como corrección documental separada del piloto.

## Criterios de aceptación de C1

| Prueba | Umbral observable |
|---|---|
| Procedencia y cierre | La identidad del snapshot, su digest y los avisos coinciden con el inventario. Cada recurso necesario se abre desde el artefacto en el entorno aislado. Un artefacto alterado detiene la aplicación. |
| Instalación y repetición | El diff aprobado enumera todos los destinos. La revisión previa deja el árbol intacto. La primera aplicación produce el diff esperado y la segunda produce cero cambios adicionales. |
| Colisión y permisos | Con un archivo local en un destino y un `AGENTS.md` propio, el diagnóstico muestra el conflicto antes de escribir. Hay cero sobrescrituras o efectos fuera del alcance. |
| Release y hotfix | El plan identifica confirmaciones base y ramas afectadas. El recorrido local concuerda con la topología esperada, y el gate del fixture se ejecuta tanto en una entrada válida como en un escenario que debe fallar. Cada veredicto enlaza su resultado observado. |
| Reversión | El revisor compara el estado de vuelta con el punto previo a la adopción y comprueba que las modificaciones ajenas siguen presentes. |
| Consumo independiente | Una persona distinta del autor repite el recorrido usando la guía y el snapshot. Registra digest, commit, entorno, resultados e intervenciones. Si falta evidencia, el gate correspondiente queda `NOT_RUN` o `NEEDS_REVIEW`. |

La salida de C1 requiere que pasen todos los escenarios obligatorios y que se registren cero efectos fuera del alcance autorizado. Una revisión asistida por agente puede aportar hallazgos. La aprobación del candidato corresponde al owner.

## Ensayo interno con fixture sintético

Desde la raíz del framework, ejecuta:

```text
node scripts/pilot-blk-eng-001.mjs
```

El [script del ensayo](../scripts/pilot-blk-eng-001.mjs) genera un snapshot sintético con una checklist y crea un repositorio Git consumidor en un directorio temporal. Comprueba el digest antes de planificar, simula la revisión y copia local, y prueba la reversión de un commit dedicado a la adopción. Usa configuración Git aislada, sin remotos ni hooks activos. El SHA-256 identifica el contenido sintético e ilustra una comprobación de integridad. La autenticidad del candidato real requerirá su propia evidencia de origen.

**Registro del 2026-11-27** · Ejecutor Codex · Windows, Node `v24.15.0`, Git `2.54.0.windows.1` · Salida del proceso `0`.

**SHA-256 del snapshot** `0f0ebcc3eb53bfc3ae98f36416a252fc3fdd607976d8675f6d451ed5968eb181`.

| Escenario | Resultado interno | Observación |
|---|---|---|
| Integridad | `PASS` | El snapshot alterado fue rechazado antes de escribir. El árbol quedó limpio. |
| Colisión | `PASS` | Se detectó el destino ocupado y se preservaron su contenido y el `AGENTS.md` del consumidor. |
| Adopción y repetición | `PASS` | El plan inicial no modificó el árbol. La aplicación agregó solo la checklist y la segunda aplicación produjo un plan vacío. Base `09e9e74`, adopción `8324f95`. |
| Release local | `PASS` | La rama principal avanzó por fast-forward al commit `d0b7965` con versión `2.0.0`. La línea de mantenimiento conservó la base `1.0.0`. Gate `0`. |
| Hotfix local | `PASS` | El gate falló antes de corregir (`1`) y pasó tras el hotfix en mantenimiento (`0`, `a1f15bd`) y tras propagarlo a la rama principal (`0`, `45a4875`). |
| Reversión | `PASS` | La reversión retiró solo la checklist. Se preservaron el archivo local del consumidor, `AGENTS.md` y la corrección de producto. |
| Consumo independiente del candidato | `NOT_RUN` | El mismo agente creó y ejecutó el fixture. Queda por repetir el flujo con el snapshot candidato, su guía y un revisor independiente. |

Los commits de la tabla identifican esta ejecución temporal. Una nueva ejecución conserva el digest del snapshot para el mismo contenido y puede generar otros commits por sus marcas de tiempo. Este ensayo aporta evidencia del diseño de prueba en Windows. La aceptación del candidato, la carga nativa de skills y la compatibilidad en otros entornos siguen pendientes.

## Revisión de la fuente canónica

**Verificación del 2026-11-27.** El PDF compartido por el usuario declara **BLK-ENG-001 v1.0 + Anexo A.1**, fechado el 26 de noviembre de 2026. La portada, el control documental, el historial y el anexo lo identifican como propuesta para aprobación interna (pp. 1, 2, 14 y 15). Dirección de Ingeniería figura como propietario propuesto. El origen de este corte es el PDF aportado y confirmado como canónico por el usuario. Se identifica como snapshot documental de 20 páginas, 257 981 bytes, SHA-256 `e0613ea643b42fb3c3df34091890eb43a48764091858239b25cb05e731e9a5ae`. El PDF carece de un commit, tag o referencia a una edición aprobada.

**Derechos.** Se revisaron las 20 páginas, los metadatos y los adjuntos del PDF. El documento carece de declaración de licencia para su contenido y no contiene archivos adjuntos. El titular autorizó el uso y la adaptación interna para C1 en la decisión registrada arriba. La adaptación excluye los elementos de marca.

| Cláusula de la fuente | Evidencia del ensayo | Ajuste para el candidato |
|---|---|---|
| Flujo y perfiles, pp. 3–7 y 12 | El fixture descubre dos ramas locales y usa una rama de preparación, fast-forward y cherry-pick. | La norma propone tronco protegido, ramas temporales, integración por PR/MR y squash por defecto. La línea soportada es la extensión R y requiere justificación. El fixture sirve para probar topología local. La integración protegida y revisada necesita un escenario adicional. |
| Gates, seguridad e higiene, pp. 8, 11 y 20 (A03) | El gate sintético falla ante el estado incorrecto y pasa después de corregirlo. Se preserva un destino local en colisión. | Probar bloqueo real de integración con un check fallido, y limpieza tras squash condicionada a la evidencia de PR, SHA y trabajo pendiente. A03 queda parcial. |
| Release y recuperación, pp. 9–10 y 20 (A04) | Se prepara 2.0.0, se corrige la línea 1.0.0 y se propaga a la principal. Se revierte el commit de adopción. | Incorporar un SHA desplegado explícito y distinto del tronco, PR urgente y propagación revisada. La reversión de adopción y el rollback de un artefacto desplegado requieren evidencias distintas. |
| Skills y adopción, pp. 15–20 (A01, A02 y A04) | La copia de una checklist se repite sin cambios. | El anexo enumera 12 capacidades y presenta un ejemplo de estructura. Para adopción completa, materializar las skills y el inventario, comprobar enrutamiento, uso sin el PDF, al menos un escenario por skill y las aprobaciones que exija el perfil. Ninguna de esas comprobaciones queda satisfecha por la checklist. |
| Evidencia, p. 20 (A05) | Quedaron registrados digest, entorno y resultados locales. | Para el candidato, añadir perfil efectivo, controles de PR/MR verificados, brechas y repetición por un revisor independiente. A05 queda parcial. |

## Ejecución interna de C1

**Candidato** `c1-internal.1` · Autor y ejecutor Codex · Windows, Node `v24.15.0`, Git `2.54.0.windows.1` · Ejecución 2026-11-27.

El candidato local incluye guía, inventario de procedencia y destinos, una skill autocontenida de preparación de release y hotfix bajo lectura explícita, y el ejercicio de demostración. La línea soportada representa una versión anterior desplegada mientras se prepara la siguiente en el tronco. El ZIP exacto se extrajo fuera del checkout productor y se probó en un consumidor temporal. El SHA-256 del ZIP es `12aaa6387265da2335ebb848104c7725123ee38c071f58c1a29e28bfcdefdef0`. El ZIP, el contenido adaptado y el registro detallado se conservan localmente en una carpeta excluida de Git.

| Comprobación | Resultado | Evidencia observada |
|---|---|---|
| Adopción y repetición | `PASS` | Se verificó la huella del archivo, se preservó el destino en colisión y la segunda planificación quedó vacía. |
| Bloqueo y squash simulados | `PASS` | El gate falló con código 1 y la referencia de `main` quedó intacta. Con código 0, los commits squash reprodujeron el árbol evaluado y pasaron el gate en destino. |
| Release y hotfix | `PASS` | El SHA desplegado era distinto de la referencia del tronco. Se integró el parche en la línea soportada y se propagó a la propuesta de release del tronco. |
| Rollback de artefacto y retiro de la adopción | `PASS` | Se restauró el digest del artefacto sintético saludable y se comprobó su contenido. Por separado, el retiro eliminó solo la skill y preservó las reglas y el trabajo local. |
| Repetición independiente | `NOT_RUN` | El titular autorizó cerrar C1 sin evidencia de repetición independiente para este candidato. La evidencia registrada procede del ensayo del autor. |
| Controles de un proveedor y descubrimiento nativo | `NOT_RUN` | La revisión de integración y el despliegue se representaron localmente. No hubo PR/MR de plataforma, activación nativa ni publicación. |

La adopción de las doce capacidades y los criterios completos A01–A05 requieren una decisión de alcance propia.

### Decisión de cierre de C1

El **2026-11-27**, el titular autorizó por escrito en el chat la excepción a la revisión independiente y el cierre del piloto interno A + R. La decisión se aplica únicamente a `c1-internal.1` y al SHA-256 del ZIP registrado en esta ficha. Cualquier otro candidato o alcance requiere su propia revisión.

El autor reprodujo el ZIP exacto en un entorno limpio con `node exercise.mjs`. La ejecución terminó con código `0`. Se observó el bloqueo esperado con `gate=1` y `main` intacta, las dos integraciones squash con `gate=0`, la repetición sin cambios, el rollback simulado y el retiro preservando el trabajo del consumidor. La revisión independiente, los controles de plataforma y el descubrimiento nativo conservan el veredicto `NOT_RUN`. El ZIP, los logs y los derivados se conservan en local.

### Evidencia de revisión independiente

Usar el ZIP `c1-internal.1` con el SHA-256 registrado arriba. Comparar el archivo con ese digest antes de extraerlo en un directorio temporal nuevo, fuera del checkout productor. Leer la guía incluida y ejecutar `node exercise.mjs` desde ese directorio. El ejercicio crea su propio repositorio Git desechable. Un digest distinto invalida la reproducción del candidato.

El registro del revisor incluye identidad y fecha, perfil A + R, digest observado, sistema operativo, versiones de Node y Git, confirmación de que usó el ZIP sin editar su contenido y comando ejecutado con código de salida. Adjuntar la salida textual con las líneas `PASS`, `REVIEW` y `SQUASH`, y declarar cualquier desviación, ayuda o fallo. El escenario negativo esperado registra `gate=1` y la referencia de `main` intacta. El ejercicio completo debe terminar con código `0`.

Conservar el ZIP, su contenido y el log completo en el ámbito interno autorizado. Para registrar el cierre en el repositorio basta el veredicto del revisor, el digest y un resumen de las comprobaciones. Los controles de plataforma y el descubrimiento nativo mantienen el estado `NOT_RUN`.

## Insumos para verificar BLK-ENG-001

| Insumo | Qué aportar | Qué se verificará |
|---|---|---|
| Fuente canónica y autoridad | URL del repositorio o ruta a una entrega accesible, subcarpeta exacta y responsable que confirma que esa fuente corresponde a BLK-ENG-001. Si es privada, acceso de lectura o un snapshot exportado por el responsable. | Rastrear índice, contenido y recursos al origen. Confirmar cuál es la edición autoritativa y qué archivos quedan dentro del permiso de revisión. |
| Versión reproducible | Commit completo, o tag/release con URL que permita resolverlo a un commit. Para un snapshot sin Git, versión o fecha de corte declarada y SHA-256 del archivo, junto con confirmación de su origen. | Registrar por separado versión declarada, revisión y digest inspeccionado. Si falta versión publicada, identificar el corte por commit o digest y registrarlo como revisión sin versión. |
| Licencia y redistribución | Archivos de licencia y avisos del mismo corte, incluidas excepciones por ruta o componentes de terceros. Para material privado, sin licencia identificable o sujeto a límites, aportar autorización escrita del titular para el uso, adaptación y eventual redistribución previstos. | Contrastar cobertura y obligaciones por archivo candidato. Registrar restricciones y qué se puede citar, adaptar o empaquetar. Para un piloto interno, documentar ese alcance expresamente. |
| Contexto de uso | Un ejemplo de release o hotfix (fixture, diff o evidencia saneada) y cualquier restricción de divulgación aplicable. | Distinguir comportamiento respaldado por casos del escenario diseñado para el piloto. El ejemplo puede ser sintético para probar el flujo. |

El mínimo para iniciar la verificación es **origen y ruta, revisión exacta y evidencia de licencia o permiso aplicable al alcance solicitado**. El acceso de lectura permite revisar la fuente. El permiso para redistribuir se registra por separado.

## Gate de salida de C0

| Control | Estado | Responsable |
|---|---|---|
| Revisión de ADR, alcance, reuso y criterios | Documentado para decisión | Maintainer |
| Identificación de fuente y revisión | Snapshot PDF identificado por versión, fecha y SHA-256. Estado editorial de propuesta interna. | Responsable de BLK-ENG-001 y maintainer |
| Registro de derechos | Permiso escrito para el piloto interno registrado en esta ficha. | Titular |
| Línea base de calidad del framework | Registrada en la [auditoría](audits/KRONFORGE_EVOLUTION_AUDIT.md). Repetir al revisar la ficha. | Maintainer |
| Autorización de C1 | Aprobada para perfil A + R y uso interno. | Owner |
| Cierre de C1 | Cerrado con excepción a la revisión independiente para `c1-internal.1`. | Titular |

Si un archivo carece de procedencia o permiso para el uso previsto, queda fuera de la selección y se evalúa si el pack todavía cumple el objetivo. Si afecta un componente esencial, el candidato queda en espera de aclaración o decisión de alcance.
