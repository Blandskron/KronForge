# Auditoría de transición KronForge

Base examinada `664c3ed`, versión `3.4.0`, noviembre de 2026.

| Área | Evidencia de partida | Decisión |
|---|---|---|
| Arquitectura | Shell estático, módulos ES, carga de fragmentos y Markdown con escape | Conservar la navegación y el visor, y componer las vistas sobre el catálogo. |
| Adopción | AGENTS.md, prompt maestro, 3 skills generadas, llms.txt, catálogo v3 | Mantener paths e IDs, actualizar la URL de publicación y regenerar proyecciones. |
| Biblioteca | 62 activos, filtros, relaciones y rutas de aprendizaje. Tres dominios sin activos y 62 contratos v3 parciales en la línea base. | Mantener avisos y datos existentes. Exponer accesos directos por tipo con los filtros actuales. |
| Gobernanza | ADR, protocolos, madurez y evidencia declaradas, scripts locales sin dependencias | Enlazar arquitectura, gobernanza y compuertas desde portada. Mantener contratos de protocolos y su evidencia. |
| Publicación | La URL `/KronForge/` respondió 200 y `/agents-first-repo-docs/` respondió 404 | Actualizar enlaces activos y comprobar el subdirectorio nuevo en el smoke test. Preservar citas históricas e IDs de schema. |
| Identidad | BLANDSKRON usa fondo casi negro, Inter, JetBrains Mono y acento violeta | Adoptar la base editorial y distinguir KronForge con ámbar, formas hexagonales y Sora. |

La documentación como código permite revisar conjuntamente los activos y sus pruebas. La divulgación progresiva justifica mostrar metadatos primero y abrir solo el Markdown relevante. [Agent Skills](https://agentskills.io/specification) · [Context Engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) · [Patrón del repositorio](../../library/domains/documentation-knowledge/patterns/documentation-as-code.pattern.md)

## Revisión de UI UX Pro Max

Tras revisar el recorrido de búsqueda se ejecutó su consulta local de solo lectura, con el nombre público del proyecto y sin persistencia. El resultado favoreció una portada documental, búsqueda visible, navegación por categorías, jerarquía tipográfica y movimiento breve. La familia tipográfica de la marca se mantuvo según el encargo y se comprobó en navegador.

## Evidencia de validación

- `npm run quality`: 12 grupos de validación, 34 pruebas, 144 rutas de la distribución y 98/100 en la rúbrica del repositorio. Se observaron los dos avisos de la línea base.
- Playwright y axe-core: portada de 360, 768 y 1440 px, temas, navegación de teclado, preferencia de movimiento reducido, biblioteca y lectura. Se comparó la copia y la descarga con el Markdown original. Se comprobaron el foco de salto al contenido, el cierre del menú con Escape y el ajuste de anchura. La cobertura automatizada se limita a los escenarios ejercitados.
- Lighthouse 13.6.0 en la portada móvil local: rendimiento 86/100, accesibilidad 100/100, buenas prácticas 100/100 y SEO 100/100.
- [Referencia visual](../../tests/kronforge-visual-baseline.json): portada clara, portada móvil y lector. La portada oscura de escritorio se captura y se compara dos veces dentro de una ejecución para evitar variaciones de foco entre sesiones.

GO para revisión técnica local. El despliegue en Pages y su verificación externa quedan sujetos a la autorización de publicación.

**REVIEW para instalación completa.** La revisión se limitó a la skill principal y sus puntos de entrada en la revisión `8db36338810d0942567b97ce439affd1619fcf31`. Los ejemplos de `SKILL.md` para persistencia y preview ofrecen escritura y sobrescritura con `--force`. `scripts/design_system.py` crea directorios y sustituye archivos bajo la ruta indicada. Si se habilita preview con fuentes externas, `scripts/preview.py` puede producir HTML que solicita recursos externos al abrirse. El instalador, las demás skills y los complementos completos quedan fuera del alcance inspeccionado. Se incorporaron como referencia los criterios de contraste, foco, escala y movimiento. [Paquete revisado](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/8db36338810d0942567b97ce439affd1619fcf31/.claude/skills/ui-ux-pro-max)
