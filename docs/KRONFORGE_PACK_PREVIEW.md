# Prototipo local de packs de KronForge

**Estado** Laboratorio de C2 y C3. El [contrato objetivo](architecture/KRONFORGE_PACK_CONTRACTS.md) y sus ADR siguen propuestos. La excepción que cerró C1 se limita a su propio candidato.

## Aplicar en un consumidor de prueba

El [preparador](../scripts/prepare-pack-preview.mjs) genera una muestra sintética, una solicitud, una proyección Agent Plugins 1.0.0, adaptadores locales y un directorio npm genérico. El destino debe ser nuevo y estar fuera del checkout. Así los archivos generados quedan fuera del inventario de documentación del repositorio.

```powershell
$preview = Join-Path ([IO.Path]::GetTempPath()) ("kronforge-preview-" + [guid]::NewGuid())
node scripts/prepare-pack-preview.mjs $preview
$consumer = Join-Path $preview 'consumer'
git init $consumer
node scripts/pack-preview.mjs plan $consumer (Join-Path $preview 'request.json')
```

Revisa el alcance, el grafo y los hashes del plan. Pasa el `planSha256` revisado como cuarto argumento de `node scripts/pack-preview.mjs apply <repo> <solicitud.json> <sha256>`. Repite la planificación. La generación calculada debe coincidir con la actual y `changes` quedar vacío. El [schema local](../library/schema/pack-preview.schema.json) define la forma del manifiesto. El preparador muestra la serialización aceptada, con JSON UTF-8, sangría de dos espacios y un salto LF final.

Los manifiestos referencian dependencias por identidad y versión exacta. La solicitud fija un manifiesto por SHA-256 para cada pack, incluida cada dependencia transitiva. Esta separación permite detectar ciclos sin exigir hashes recursivos imposibles. El perfil escoge destinos de los archivos verificados. Los orígenes y sus digests deben proceder de una fuente que el consumidor haya decidido confiar. Una huella coincidente solo verifica integridad.

### Estado, cambios y recuperación

El prototipo escribe únicamente en `.kronforge-preview/` bajo la raíz del repositorio elegido. El puntero `current.json` referencia una generación con `lock.json` y `files/`. La aplicación prepara los archivos antes de cambiar el puntero y vuelve a calcular el plan mientras retiene un guard de escritura. Un cambio de perfil, origen, versión, propietarios o bytes produce una generación distinta. Un plan puede tener el mismo contenido instalado y una generación distinta si cambia su lock. El consumidor puede leer manualmente los archivos de la generación activa. Las reglas del proyecto, la configuración del host y la activación se revisan por la vía específica de ese proyecto.

Para actualizar, preparar otra solicitud con la versión y los digests elegidos. Para restaurar una versión anterior, reutilizar sus insumos exactos, habilitar `allowDowngrade` en la solicitud y revisar y aprobar el nuevo plan. Para retirar todos los packs, usar una selección de raíces vacía. El retiro deja las generaciones archivadas disponibles para recuperación. Ante deriva, conservar los archivos afectados y resolver el conflicto antes de aplicar. Un guard abandonado tras una interrupción requiere comprobar en el equipo que ya no hay escritores, verificar la generación activa mediante un plan y retirar solo el directorio vacío `write-lock`. La prueba de fallo cubre errores del proceso y una generación archivada dañada. La recuperación tras pérdida de energía y la compactación de generaciones siguen fuera de la evidencia del laboratorio.

Las pruebas cubren colisiones, enlaces en el payload y concurrencia entre procesos que usan el prototipo. Para el piloto, usar un árbol local controlado y aplicar desde un directorio desechable. Una instalación inicial de C1 permanece bajo el inventario de Git usado en C1. Se puede comparar su skill con la generación gestionada por digest y retirar una vía solo tras verificar las reglas que apuntan a ella.

## Ensayo de distribución local

El generador prepara un paquete marcado `private: true` bajo `npm/`. Se empaqueta con `npm pack --offline --ignore-scripts` dentro de ese directorio y se instala desde el tarball en otro proyecto con `npm install --offline --ignore-scripts --no-audit --no-fund <archivo.tgz>`. El paquete solo incluye el ejecutor genérico, su schema, el validador reutilizado, la licencia y los metadatos listados en el inventario de npm. La muestra, los adaptadores, los logs y la fuente interna quedan fuera del paquete. [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/).

La proyección portable conserva `plugin.json` y el mismo `skills/synthetic-handoff/SKILL.md`. El índice de marketplace y la fachada para clientes con manifest alternativo viven en el directorio de preparación y usan la misma skill por digest. Se evalúan por separado bytes, instalación, descubrimiento, activación y resultado del escenario. [Agent Plugins 1.0.0](https://agent-plugins.org/specification).

| Evidencia local del 2026-11-27 | Resultado |
|---|---|
| Ciclo de vida C2 con datos sintéticos | Cinco pruebas de grafo, colisiones, repetición, integridad, actualización, downgrade, deriva, fallo, retiro y rutas largas. Pasaron en Windows con Node 24.15.0 y en Linux con Node 24.22.3, imagen oficial fijada por digest `873f586f3794f52281bd039bf02c048a0be08fde619338f9941bad1eb6b34530`. Linux recibió solo el código genérico y se ejecutó sin red. |
| Equivalencia local C1 → C2, solo como autor | Se extrajo el ZIP interno fijado, se verificó la skill contra su inventario, se instaló con bytes idénticos, la segunda selección quedó vacía de cambios y el retiro preservó `AGENTS.md`. |
| Tarball npm privado | Instalación offline de `0.0.0-local.2` desde ocho archivos en un consumidor limpio, Windows con Node 24.15.0 y npm 11.14.1. SHA-256 `ba43c752e783f7d87671590d584809b55c7c5c197bafa0818cb9d8af9783e3e9`. |
| Paridad de proyecciones | El payload manual, el contenido instalado mediante el tarball y la proyección portable tienen SHA-256 `3f193d15cd36b732df2f7aee705c19630c3322597f6fc3c40e86bb10cb1b4193`. |
| Codex CLI `0.171.0-alpha.13.2` | Instaló el fixture portable desde marketplace local en una configuración aislada. La skill instalada conservó su SHA-256. |
| Claude Code `2.1.220` | El validador del cliente requirió `.claude-plugin/plugin.json`. La proyección compatible pasó su validación y se instaló desde un marketplace local aislado. La skill instalada conservó su SHA-256. |
| Ejecución del escenario por clientes y consumo externo | `NOT_RUN`. La instalación y la validación de manifiesto son evidencia de distribución local. |

## Evidencia externa que falta

La [guía para dos equipos](KRONFORGE_EXTERNAL_TRIAL.md) y su [plantilla de evidencia](KRONFORGE_EXTERNAL_TRIAL_EVIDENCE.md) fijan el escenario, el orden y los veredictos de la prueba. El [preparador del kit](../scripts/prepare-external-trial.ps1) genera un ZIP local con el fixture sintético, los dos marketplaces de prueba y el ejecutor genérico. Desde PowerShell se ejecuta con `./scripts/prepare-external-trial.ps1 -Destination <carpeta-nueva-fuera-del-checkout>`.

Para C3, probar descubrimiento y ejecución en sesiones limpias de dos clientes de familias distintas. Usar el fixture público sintético, identificar el artefacto por digest y pedir la salida esperada para `KF-SYNTHETIC`. Registrar cómo se cargó la skill, el modelo o versión del host, la salida, el tiempo, las intervenciones y los controles aplicables. La prueba local conserva la ruta manual si el cliente requiere un adaptador.

Para C4, dos equipos independientes ejecutan la ruta manual y la declarativa en repositorios de stacks distintos. Antes de medir, congelar fixture, digest, rúbrica y tareas. Alternar qué ruta van a ejecutar primero. Registrar tiempo al primer resultado correcto, pasos, intervenciones, reproducibilidad y recuperación de colisiones. Exigir cero efectos fuera del alcance y todos los escenarios obligatorios correctos. Publicar solo resultados que los participantes puedan autorizar y declarar tamaño de muestra y límites. La adopción observada por el autor queda fuera del conjunto independiente.

Para C5, un segundo mantenedor practica reproducción, actualización y retiro a partir del artefacto y la guía. Priorizar el historial de versiones, los avisos y la recuperación por digest antes de abrir nuevas superficies. C2 y C3 locales pueden repetirse sin que el registro npm forme parte del ciclo.

### Si se elige publicar en npm

El paquete local está preparado para validación. La decisión de publicar requiere un paquete público genérico con nombre, propietario y canal de release acordados. La persona con permisos debe habilitar el publisher de confianza para el workflow y, cuando el flujo del registro lo requiera, aprobar la publicación en su cuenta con MFA. Se puede preparar el workflow y ensayar el contenido localmente. Las credenciales de la cuenta permanecen con su titular. [Publicación de confianza en npm](https://docs.npmjs.com/trusted-publishers/).
