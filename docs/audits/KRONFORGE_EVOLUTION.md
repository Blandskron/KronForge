# Auditoría de evolución de KronForge

Base de revisión: `eeaa52e` y la entrega publicada en GitHub Pages. Se revisaron los puntos de entrada del repositorio, el catálogo y su esquema, las proyecciones, el portal, el flujo de publicación, los contratos de contribución y los hitos del roadmap.

| Área | Evidencia | Resultado |
|---|---|---|
| Publicación | GitHub Pages sirvió diez recursos que coincidieron con el commit de transición | KF-01 a KF-05 cuentan con evidencia de entrega. |
| Documentación | El README presentaba 3.2.0 y describía el catálogo como generado | Corregidos la versión visible y el proceso editorial. |
| Aprendizaje | El catálogo tenía 14 secuencias. Las tarjetas mostraban una descripción y recursos, sin prerrequisito ni entregable | Se añadió la [guía](../LEARNING_GUIDANCE.md) y una proyección independiente que conserva el esquema de catálogo v3. |
| Caso práctico | El ejemplo existente se presenta como una simulación | Se añadió un [ejercicio reproducible](../learning-quality-example.md) con los comandos del repositorio y un entregable verificable. |
| Conformidad | La línea base pasó 12 grupos, 34 pruebas y 144 rutas | Los dos avisos heredados afectan a tres dominios sin activos y al detalle contractual de 62 activos. |
| Gobernanza | El roadmap exige evidencia independiente para subir la madurez de un protocolo | Sigue pendiente demostrar reproducción externa y, donde corresponda, medir efectividad. |

## Trabajo pendiente

1. Completar v3.5 con tutoriales progresivos por área y casos reales reproducidos con entradas, pasos, salidas y límites observados.
2. Priorizar contratos de los activos más reutilizados con difusión o consumo observable. Cubrir los tres dominios vacíos cuando exista conocimiento verificable y un plan de mantenimiento.
3. Evaluar una comprobación independiente de navegador en CI. Hoy el gate automatizado ejecuta validación, pruebas, smoke HTTP y puntuación; la comprobación de navegador se ejecuta aparte.
4. Versionar perfiles de consumo y probar adopción externa antes de declarar v4.0. Las tareas de medición comunitaria y sostenibilidad siguen en v4.5 y v5.0.

## Validación de este avance

El gate pasó con 13 grupos, 34 pruebas y 147 rutas HTTP. Chromium y axe-core pasaron en siete escenarios y las tres capturas de referencia coincidieron. La prueba de navegador verificó el entregable de testing y simuló la indisponibilidad de la guía para comprobar que las rutas y sus activos siguen accesibles.

## Segundo lote de evolución

Se publicaron en el catálogo local tres activos en borrador para desarrollo de software, datos y gestión técnico-productiva. Los 18 dominios tienen contenido. Ocho activos tienen contrato v3 completo y 57 de 65 conservan campos pendientes. El validador comprueba la paridad de entradas, salidas y casos de uso con el front matter.

La [guía de prácticas](../LEARNING_LABS.md) incorpora siete ejercicios. El [caso de compatibilidad](KRONFORGE_LEARNING_CASE.md) documenta una reproducción dentro del repositorio. El diff del esquema v3 respecto de la base está vacío.

El gate local registró 13 grupos sin errores, 34 pruebas aprobadas, 152 rutas HTTP y 98/100 en AI Repository Score. Chromium verificó los enlaces directos de los activos nuevos y axe-core registró cero infracciones en siete escenarios automatizados. El workflow incorpora un trabajo de navegador con dependencias aisladas y requiere una ejecución en GitHub Actions para confirmar su entorno Linux.

Siguen pendientes completar los contratos restantes, ampliar los tutoriales por dominio y obtener evidencia independiente para los casos de aprendizaje.

## Cobertura del contrato v3

Se completaron las entradas, salidas y casos de uso de los 57 activos que conservaban esos campos vacíos. El catálogo refleja los metadatos declarados en cada Markdown y los 65 activos tienen los tres campos completos. Cada cambio se versionó como corrección editorial del activo. Las referencias externas y la madurez de los protocolos conservan sus fechas y declaraciones de evidencia.

El trabajo de aprendizaje continúa con tutoriales por dominio y casos reproducidos en proyectos independientes.
