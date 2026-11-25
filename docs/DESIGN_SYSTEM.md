# Sistema de diseño de KronForge

Los tokens viven en [base.css](../assets/css/base.css). [layout.css](../assets/css/layout.css) organiza la navegación, [components.css](../assets/css/components.css) define controles compartidos y [portal.css](../assets/css/portal.css) compone la biblioteca, la portada y las rutas de aprendizaje.

| Uso | Base |
|---|---|
| Marca | Forge Amber `#F59E0B`, Engineering Orange `#EA580C`, Knowledge Gold `#FCD34D` |
| Fondos oscuros | `#0B1020`, `#121A2D`, `#182338`, `#2A3652` |
| Texto oscuro sobre claro | Tinta `#182338` sobre `#F5F7FB`. El acento legible usa `#92400E`. |
| Texto claro sobre oscuro | `#F5F7FB` y `#B8C2D9`. Las acciones ámbar usan tinta oscura. |
| Semántica | Success `#22C55E`, Warning `#F59E0B`, Error `#EF4444`, Information `#38BDF8`, AI `#A78BFA`, Verified `#14B8A6`. Para texto usa sus variantes por tema. |
| Tipografía | Sora para títulos, Inter para texto, JetBrains Mono para código. Fuentes y licencias locales. |
| Geometría | Unidad de 4 px y radios de 8, 12, 16 y 24 px. |
| Movimiento | Interacciones de 200 ms, con reducción según la preferencia del sistema. |

El tema oscuro es inicial. El selector permite claro y sistema, escucha los cambios del sistema cuando corresponde y conserva preferencias anteriores. Los iconos Lucide se sirven localmente. Los controles disponen de nombre accesible y foco visible. Las referencias se abren como enlaces explícitos. Las tarjetas y los filtros se organizan con CSS, las listas de recursos se obtienen del catálogo y el visor lee el Markdown canónico.

El portal publica los mismos archivos estáticos en la raíz local y en el subdirectorio de GitHub Pages. Mantén rutas relativas en la aplicación y enlaces canónicos en metadatos y descubrimiento. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
