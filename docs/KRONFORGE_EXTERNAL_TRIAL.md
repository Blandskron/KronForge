# KronForge · Prueba con dos equipos

## Asignación

| ID | Cliente para la prueba nativa | Orden de las rutas de adopción |
|---|---|---|
| A | Codex CLI | Manual → declarativa |
| B | Claude Code | Declarativa → manual |

Cada equipo trabaja con un repositorio desechable de un stack distinto, con archivos e instrucciones sintéticos o autorizados para la prueba. Usar dos copias equivalentes de ese repositorio para las rutas de adopción y un tercer repositorio vacío para la sesión nativa. La sesión nativa solo recibe `KF-SYNTHETIC` y los archivos sintéticos del plugin. Git y Node 24 cubren ambas rutas locales. Para la sesión nativa, usar una cuenta normal del cliente y un perfil de prueba que permita marketplaces locales. El kit se consume fuera del checkout productor.

## Integridad y preparación

1. Comparar el SHA-256 del ZIP con el digest recibido por separado del coordinador. En PowerShell usa `Get-FileHash -Algorithm SHA256 <archivo.zip>`. En Linux usa `sha256sum <archivo.zip>`. En macOS usa `shasum -a 256 <archivo.zip>`. Si difiere, registrar el bloqueo.
2. Extraer el ZIP en una carpeta nueva. Confirmar que están `request.json`, `retire.json`, `sample/`, `npm/`, `plugin/`, `claude-adapter/` y ambos índices de marketplace bajo sus directorios ocultos.
3. Registrar fecha, SO, versiones de Node, Git y cliente, stack y estado inicial de las dos copias. Usar directorios sin efectos externos, ramas locales y reglas del consumidor como referencia para comprobar preservación. Congelar esas condiciones antes de medir.

En los comandos siguientes, sustituir `<kit>` y `<repo>` por rutas absolutas. Para medir, iniciar el cronómetro al leer el primer paso de una ruta. Detenerlo al comprobar por primera vez la instalación correcta en esa ruta. Registrar después las pruebas de repetición, conflicto y recuperación por separado.

## Ruta manual

1. Leer `sample/pack.json`. Verificar que el SHA-256 de `sample/payload/synthetic-handoff/SKILL.md` coincide con el archivo del manifiesto. Revisar el único destino, `skills/synthetic-handoff/SKILL.md`, y registrar el cambio previsto. Si el destino contiene trabajo del consumidor, preservar ese trabajo y registrar el conflicto.
2. Aplicar la copia aprobada, comprobar el SHA-256 del destino y confirmar que las reglas del repositorio quedaron intactas. Repetir el recorrido y registrar cero escrituras si los bytes coinciden.
3. Retirar solo la copia creada cuando conserva sus bytes. Verificar que las reglas y el trabajo del consumidor continúan presentes. Probar el conflicto en una copia desechable con un archivo ajeno en el destino.

## Ruta declarativa

1. Planificar con el ejecutor genérico incluido. Revisar `plan.changes`, la raíz y el digest antes de aplicar.

```text
node "<kit>/npm/scripts/pack-preview.mjs" plan "<repo>" "<kit>/request.json"
node "<kit>/npm/scripts/pack-preview.mjs" apply "<repo>" "<kit>/request.json" "<planSha256 revisado>"
```

2. Leer `.kronforge-preview/current.json`. Obtener la skill en `.kronforge-preview/generations/<generation>/files/skills/synthetic-handoff/SKILL.md` y comprobar su SHA-256 contra el manifiesto. Repetir `plan` y guardar que `current` coincide con `generation` y que `changes` está vacío.
3. En esa copia desechable, añadir una línea sintética al archivo instalado y repetir `plan`. Debe fallar por deriva. Confirmar que `current.json` y las reglas del consumidor siguen iguales. Restaurar la skill desde el payload exacto, verificar el digest y volver a planificar.
4. Planificar el retiro con `retire.json`. Usar su nuevo `planSha256` para aplicar el retiro. Verificar que el lock de la generación activa ya no lista la skill, y que las reglas del consumidor conservan sus bytes. Las generaciones anteriores quedan archivadas.

## Equipo A · Sesión en Codex CLI

Desde la carpeta extraída, revisar los índices y el manifest portable. Usar una configuración de prueba y un repositorio de sesión que no contenga la skill, el kit ni el contenido de las rutas anteriores.

```text
codex --version
codex plugin marketplace add "<kit>" --json
codex plugin add kronforge-synthetic-handoff@kronforge-local-preview --json
```

Verificar el SHA-256 de la skill dentro de `installedPath`. En el repositorio de sesión, inicia `codex --sandbox read-only`. En una sesión nueva, usa el selector nativo de skills para elegir `synthetic-handoff`, escribiendo `$` y seleccionando la entrada del plugin si aparece. Envía solo la tarea `KF-SYNTHETIC` con la skill seleccionada y registra qué mostró el selector o la sesión sobre su carga. Si la versión no ofrece la skill, registra ese bloqueo. [Empaquetado y marketplaces locales](https://developers.openai.com/plugins/build/plugins) · [Pruebas de Agent Skills en Codex](https://developers.openai.com/blog/eval-skills).

## Equipo B · Sesión en Claude Code

Desde la carpeta extraída, revisar el manifiesto de `claude-adapter/` y su índice. Usar una configuración de prueba y un repositorio de sesión que no contenga la skill, el kit ni el contenido de las rutas anteriores.

```text
claude --version
claude plugin validate "<kit>/claude-adapter"
claude plugin marketplace add "<kit>"
claude plugin install kronforge-synthetic-handoff@kronforge-local-preview
claude plugin details kronforge-synthetic-handoff
```

Verificar el SHA-256 de la skill en la ruta de instalación que reporta el cliente. Desde el repositorio de sesión, inicia `claude` y, en una sesión nueva, envía `/kronforge-synthetic-handoff:synthetic-handoff KF-SYNTHETIC`. Conserva la evidencia de que la skill aparece en el inventario y de qué ocurrió al invocarla. Si la versión carece del inventario o el comando no se resuelve, registra qué parte pudiste observar. [Marketplace local y prueba de skills](https://code.claude.com/docs/en/plugins/create-marketplace).

## Resultado y devolución

El cliente debe responder con las dos líneas `outcome: ready` y `next: review`. Mantener la respuesta esperada fuera del prompt. Una respuesta correcta sin evidencia de descubrimiento y activación se reporta como resultado observado con carga `NOT_RUN` o `NEEDS_REVIEW`, según corresponda. Una instrucción manual que entregue al agente el archivo puede servir como diagnóstico, con su resultado separado.

Completar [la plantilla de evidencia](KRONFORGE_EXTERNAL_TRIAL_EVIDENCE.md) y devolverla al coordinador por el canal privado acordado. Usar extractos sanitizados de la salida. Conservar transcripciones completas en el equipo cuando la política lo permita. El criterio técnico exige los resultados obligatorios, hashes coincidentes y cero efectos fuera del alcance. Cualquier paso que requiera iniciar sesión queda a cargo de cada revisor mediante su cuenta normal.
