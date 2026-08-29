# Dossier de contraste POR COMPAÑÍA — centros de datos en España peninsular

**Autor:** agente de contraste por compañía (no territorial).
**Fecha de cierre de la investigación:** 2026-08-29.
**Función:** red de seguridad. Este documento NO es la fuente canónica de fichas de emplazamiento (eso son los agentes territoriales). Sirve para (a) detectar activos y proyectos que se les escapen, (b) reconciliar nombres alternativos del mismo activo, (c) evitar dobles conteos de MW.

---

## 0. Metodología, límites y advertencias de uso

**Reglas aplicadas**
- Solo se citan URLs efectivamente abiertas. Cuando una página bloqueó el acceso directo se abrió mediante el proxy de lectura `r.jina.ai` sobre la URL canónica; se cita la URL canónica.
- Cada cifra de potencia se etiqueta: `MW IT`, `MW conexión` (acceso a red / potencia contratada con REE o distribuidora), `MVA`, `MW instalados` o `SIN ESPECIFICAR EN LA FUENTE`.
- Cuando una afirmación procede de un resultado de buscador y **no** se abrió la página, se marca `[NO VERIFICADO]` y NO debe usarse para poblar `data/sites/`.
- Todo lo que no se encontró se declara explícitamente como hueco en la sección 9.

**Advertencias de calidad de fuentes**
- `observatorioedc.com/directorio/` (Observatorio Español de Data Centers) es la fuente estructurada más completa localizada: **231 instalaciones (159 operativas, 22 en construcción, 50 en planificación)**. Se recuperó su listado íntegro en dos pasadas independientes con resultado coherente. Es excelente para *descubrir* activos, pero **no distingue de forma fiable MW IT de MW de conexión**, y en varios casos su cifra choca con la del operador (ver sección 8c). Úsese como índice, no como cifra final. — https://observatorioedc.com/directorio/ (consultado 2026-08-29)
- El reportaje de DCD "Data Centers en España: Hacia 2026, un boom de 90.000 millones en proyectos" contiene **errores de adscripción territorial verificables** (sitúa Aceca en "Madrid"; Aceca está en Villaseca de la Sagra, Toledo). Trátese como pista, nunca como fuente de municipio. — https://www.datacenterdynamics.com/es/features/data-centers-en-espa%C3%B1a-hacia-2026-un-boom-de-90000-millones-en-proyectos/
- El PDF de la presentación institucional del Proyecto Altamira y la nota de prensa de Merlin sobre Botorrita son ejemplos de **fuente primaria con cifras internamente inconsistentes** (ver sección 8c).

---

## 1. Marco agregado del sector (para calibrar los totales, NO para sumar a los emplazamientos)

| Cifra | Valor | Tipo de MW | Fuente y fecha |
|---|---|---|---|
| Potencia TI instalada en data centers comerciales en España, cierre 2025 | 439 MW (+24% vs 2024) | MW IT | Spain DC, Informe Anual, vía nota recogida por buscador `[NO VERIFICADO — página spaindc.com devolvió 403]` |
| Capacidad operativa Iberia (España+Portugal), oct-2025/mar-2026 | 385 MW IT | MW IT | Colliers, *Data Center Snapshot Iberian Region*, publicado 2026-04-08 — https://www.colliers.com/es-es/research/data-center-snapshot-iberian-region-oct-2025-mar-2026 |
| Capacidad operativa "de red" España+Portugal | 567 MW (España 499 MW) | MW conexión | CBRE, vía Cinco Días 2026-07-16 — https://cincodias.elpais.com/companias/2026-07-16/espana-y-portugal-viven-una-explosion-de-anuncios-de-nuevos-centros-de-datos-que-multiplican-por-18-la-capacidad-actual.html |
| Proyectos anunciados Iberia | 10,5 GW (85% España); 4,5 GW en construcción/planificación | MW conexión | CBRE, vía Cinco Días 2026-07-16 (misma URL) |
| Pipeline Colliers a 2030 | Madrid >1.400 MW IT; Barcelona 525 MW IT; Aragón >3.460 MW IT; Lisboa 1.390 MW IT; resto de España >5.700 MW IT | MW IT | Colliers 2026-04-08 (misma URL) |
| Solicitudes de conexión en Aragón | 28 macrocentros, **11.237,3 MW** agregados; solo 3 operativos (140 MW) | MW conexión | elDiario.es, 2026-06-25 — https://www.eldiario.es/aragon/sociedad/28-macrocentros-datos-proyectan-aragon-multiplicaran-nueve-demanda-electrica_1_13331581.html |
| Permisos concedidos vs. planificación | "permisos que superan los 12 GW" frente a una planificación de 4 GW a 2030 | MW conexión | El Mundo, 2026-08-25 — https://www.elmundo.es/economia/empresas/2026/08/25/6a8dc83521efa0ba2d8b458b.html |

**Riesgo estructural:** la diferencia entre los ~385-499 MW operativos y los 10,5 GW anunciados es de **factor ~20**. Cualquier mapa que sume MW anunciados sin distinguir estado producirá una cifra sin sentido físico. La restricción real es el acceso a red, no el capital (ver casos Vantage y Box2Bit, sección 7).

**Contexto regulatorio que va a mover el pipeline (2026):** Real Decreto en tramitación que exige declaración responsable ante el Ministerio para la Transformación Digital, soberanía del dato (operador con sede UE), ≥80% de electricidad renovable con **correlación horaria**, y 1 MW renovable instalado por MW consumido; los proyectos en tramitación tienen 6 meses para adaptarse y los pendientes de acceso a red, 3 meses; el Gobierno puede revocar derechos de acceso. — El Mundo, 2026-08-25 (misma URL).
