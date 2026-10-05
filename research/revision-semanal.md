# Revisión semanal y mensual del 5 de octubre de 2026

Periodo semanal: del 28 de septiembre al 4 de octubre de 2026, ambos incluidos, hora de Madrid. Consulta realizada el 5 de octubre. Revisión mensual incluida por ser el primer lunes del mes. Diez hallazgos o seguimientos relevantes en total, por debajo del máximo de doce. Los antecedentes mensuales se identifican por separado y no se presentan como noticias de esta semana.

Se leyeron `docs/INVESTIGACION-PROGRAMADA.md`, `docs/ESQUEMA.md`, `research/informe-ree.md`, `research/ensayo-ree-2026-09-30.md`, la cabecera y las claves de `data/red/capacidad.yaml`, las fichas de Rhodes, Navalmoral, GISS Soria y CESGA A Sionlla, y las normas PRD de centros de datos y CADA. No existe `research/revision-semanal.md` anterior en este checkout. Tampoco existe `data/propuestas/`; el formato parcial está documentado en `scripts/apply-proposals.mjs`.

## Hallazgos con fuente primaria

| Nº | Fecha del hecho | URL primaria | Identificador | Campo afectado | Dato anterior | Dato propuesto | Evidencia breve | Decisión pendiente |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-09-30 | [Aragón Hoy](https://pro.aragonhoy.es/presidencia-de-gobierno/gobierno-aragon-aprueba-piga-proyecto-rhodes-qts-106554) | `qts-calatorao-rhodes` | `estado_detalle`, `inversion_anunciada_eur`, `empleo` | PIGA inicialmente aprobado; inversión 11.805.195.141 €; empleo de construcción y explotación de 2024 | Registrar anuncio de aprobación definitiva, inversión potencial hasta 13.471 millones y hasta 3.400 puestos al completar el desarrollo | "Se estima una inversión de hasta 13.471 millones de euros y podrá generar 3.400 puestos de trabajo cuando esté completamente desarrollado" | Borrador parcial preparado. Localizar acuerdo del BOA y conciliar alcance de inversión. Mantener `en_tramitacion` hasta comprobar permisos sectoriales; no sumar empleos de escenarios distintos. |
| 2 | 2026-10-01 | [Página REE](https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso), [CSV](https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/2026_10_01_GRT_demanda.csv), [PDF](https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/2026_10_01_GRT_demanda.pdf) | `data/red/capacidad.yaml` | Fecha, fuente, columnas y capacidades por nudo | Edición 2026-08-03; informe mensual previo identifica 2026-09-01 | Reconciliar con edición 2026-10-01 antes de cambiar fecha o valores | "Información actualizada a 1 de octubre de 2026" | Hay cambio de estructura y claves ambiguas. Propuesta de procedimiento abajo; sin borrador de cifras. |
| 3 | Publicación 2026-09-29 | [BOCG D-593](https://www.congreso.es/public_oficiales/L15/CONG/BOCG/D/BOCG-15-D-593.PDF) | Candidato `pnl-plan-infraestructura-energetica-cpd-2026`, iniciativa 161/003766 | Seguimiento normativo | Sin ficha de esta iniciativa | Registrar como pista parlamentaria del PP para debate en comisión | "Plan Nacional de Infraestructura energética para centros de datos" | Una proposición no de ley no crea un plan aprobado ni obligaciones. No generar ficha de emplazamiento ni propuesta normativa sin resolver su encaje en el esquema. |
| 4 | Plazo 2026-09-10; fecha de modificación de la página desconocida | [Audiencia MITECO](https://www.miteco.gob.es/es/energia/participacion/2026/detalle-participacion-publica-k-851.html) | `prd-centros-datos-sostenibles` | `hitos`, `estado_detalle` | Cierre previsto 2026-09-04 | Documentar que la página actual señala 2026-09-10; ambos plazos ya vencidos | "hasta el jueves, 10 de septiembre de 2026" | Hallazgo mensual, fuera de ventana semanal. La [nota del 27 de agosto](https://www.miteco.gob.es/es/prensa/ultimas-noticias/2026/agosto/-el-gobierno-plantea-impulsar-los-centros-de-datos-sostenibles--.html) conserva el día 4. Conservar la discrepancia; no atribuir fecha a una ampliación sin resolución. No se ha localizado aprobación en BOE en esta búsqueda. |

Rhodes coincide con la ficha existente por alias Proyecto Rhodes, municipio Calatorao, operador QTS y ámbito SUI-4. No procede crear otro emplazamiento. El borrador [qts-calatorao-rhodes.yaml](propuestas-revision/qts-calatorao-rhodes.yaml) conserva el conflicto de inversión y añade el anuncio de empleo con su escenario. No propone potencia IT ni atribuye a QTS una nueva concesión eléctrica por leer la capacidad agregada del nudo.

## Resultados sin fuente primaria suficiente

| Nº | Fecha | Fuente localizada | Identificador | Campo, dato anterior y propuesta | Evidencia y decisión pendiente |
|---|---|---|---|---|---|
| 5 | 2026-09-29 | [Diario Tres Cantos](https://www.diariotrescantos.com/index.php/ciencia-y-tecnologia/tres-cantos-green-data-city-centros-datos-inversion), [SER](https://cadenaser.com/cmadrid/2026/09/29/tres-cantos-despliega-una-estrategia-para-atraer-centros-de-datos-eficientes-y-de-energia-limpia-ser-madrid-norte/) | Municipio Tres Cantos; fichas MERLIN y Quetta | Certificación y normativa municipal; sin sello registrado; propuesta suspendida | Prensa anuncia Green Data City. No se encontró texto municipal accesible que permita comprobar requisitos, vigencia o centros acreditados. No atribuir certificación a ninguna ficha. |
| 6 | 2026-10-02 | [Ecoticias](https://www.ecoticias.com/energias-renovables/centro-de-datos-de-monfarracinos) | `frv-edison-monfarracinos-zamora` | Potencia y permisos; sin cambio propuesto | Opinión sobre demanda energética. No acredita nuevo permiso ni potencia IT. Pendiente contraste documental antes de extraer cifras. |

## Revisión mensual de REE

El informe del 30 de septiembre señalaba septiembre como edición más reciente. La consulta actual y la descarga HTTP 200 del CSV confirman octubre. Los CSV se descargaron solo a `/tmp`; no se tocó `data/red/`.

Se comprobaron las cuatro filas de cabecera. El CSV de septiembre tiene 62 columnas y el de octubre 102. Corrección de la comunicación inicial: septiembre tiene 62, no 67. Octubre añade desgloses de demanda y almacenamiento que pueden o no atenderse con valor de referencia. Los campos de demanda otorgada RdT y solicitada pendiente siguen en las posiciones 26 y 37 contando desde cero; la capacidad disponible general de demanda pasa a las posiciones 85, 86 y 87 para CEP CH, CEP SH y NO CEP. Son posiciones observadas, no una regla para futuras ediciones. El PDF oficial expresa las capacidades en MW y la tensión forma parte del nombre del nudo en kV. Las posiciones E/P son recuentos, no MW. No convertir MVA ni deducir carga IT.

La comprobación de cobertura detectó 928 filas con código numérico y 19 claves repetidas de código más tensión. Por ejemplo, BEGUES 220 y BEGUES (BEGUES B) 220 comparten código 50079. De las 548 entradas del YAML, 540 tienen correspondencia por código y tensión, sin que ello asegure correspondencia única. Las ocho restantes usan códigos con prefijo `UFD-`: AZCA, EL COTO, MANUEL BECERRA, MAZARREDO, MEDIODIA, PROSPERIDAD, PUENTE PRINCESA y SIMANCAS, todos de 220 kV. No se consideran bajas por no aparecer entre los códigos numéricos.

Procedimiento propuesto para revisión humana:

1. Leer cabeceras jerárquicas completas y mapear por significado, incluyendo DEMANDA frente a ALMACENAMIENTO, RdT frente a RdD, CEP, CH/SH y criterio general. Confirmar unidades con PDF y diccionario XLSX antes de trasladar todas las cifras.
2. Unir por `codigo_subestacion_ree` y `tension_kv`; resolver claves repetidas con denominación y sección de barras. Mantener aparte los códigos UFD, documentando su procedencia y la razón de cualquier equivalencia.
3. Normalizar separadores españoles y conservar vacíos, `NA` y motivos de no otorgamiento; nunca reemplazarlos automáticamente por cero.
4. Emitir diferencias por campo, altas, ausencias y ambigüedades para las 548 entradas del ámbito actual. Revisar por separado la cobertura insular: el CSV contiene ABONA en Canarias, aunque el esquema mantiene la capa eléctrica peninsular. Eso requiere una decisión de ámbito, no una incorporación automática.
5. Actualizar valores, fuente y fecha de publicación conjuntamente tras la revisión y validar. No actualizar solo la fecha. Esta sesión no realiza la reconciliación numérica completa ni cambia el inventario.

## Normas y fechas vencidas

Además del cierre de audiencia del PRD y la nueva iniciativa parlamentaria, se revisó CADA y los plazos explícitos de las fichas siguientes. Que una fecha haya pasado no prueba cancelación, retraso confirmado ni entrada en servicio.

| Nº | Identificador | Fecha prometida o seguimiento | Resultado mensual y decisión pendiente |
|---|---|---|---|
| 7 | `propuesta-cada-2026` | Propuesta COM(2026) 502; estado local `propuesta` | La [página del Parlamento](https://www.europarl.europa.eu/legislative-train/theme-a-new-plan-for-europe-s-sustainable-prosperity-and-competitiveness/file-cloud-and-ai-development-act) devolvió solo tres líneas sin contenido útil. No se verifica cambio de comisión, ponentes o posiciones. Mantener seguimiento abierto; no afirmar que continúa sin comisión basándose solo en la ficha antigua. |
| 8 | `merlin-edged-navalmoral-de-la-mata` | Licencia e inicio esperados en septiembre de 2026 | Septiembre ha terminado. No se localizó licencia ni acta de inicio en la búsqueda oficial. El [DOE del 10 de septiembre](https://doe.juntaex.es/otrosFormatos/html.php?anio=2026&doe=1750o&xml=2026081506) trata cuotas de conservación, no licencia. Mantener `en_tramitacion`; solicitar comprobación del expediente municipal y AAI25/032. |
| 9 | `giss-soria-los-royales` | Final de obras anunciado para verano de 2026, sin fecha de puesta en marcha | El verano ha pasado. Las búsquedas en Seguridad Social no localizaron recepción o puesta en servicio. La [nota oficial antigua](https://revista.seg-social.es/-/20221128-licencia-cpd) preveía operación durante 2026, un plazo aún no vencido. No cambiar estado. |
| 10 | `cesga-santiago-a-sionlla` | Final de obras previsto en verano de 2026 | No se verificó finalización. La [página de ejecución de fondos del CESGA](https://www.cesga.es/gl/execucion-fondos-nextgenerationeu-mrr-prtr/) identifica contratación y conectividad, sin acreditar por sí sola recepción o operación. No trasladar equipos de la sede actual al nuevo edificio por inferencia. |

El inicio de fase 1 de Rhodes previsto para el segundo trimestre de 2026 también ha vencido. Se incluye en el seguimiento del hallazgo 1: la aprobación del PIGA no demuestra que las obras empezaran. La revisión de fechas se centró en los plazos explícitos de estas fichas; no certifica una auditoría exhaustiva de todos los hitos del inventario.

## Hallazgos descartados

- [BOE-B-2026-31638, publicado el 30 de septiembre](https://www.boe.es/diario_boe/txt.php?id=BOE-B-2026-31638): suministro de material de oficina del BSC. No afecta a ubicación, capacidad o estado del centro.
- [Reglamento aduanero UE 2026/2108](https://www.boe.es/doue/2026/2108/L00001-00281.pdf): centro de datos aduaneros como sistema administrativo europeo; no documenta emplazamiento español y queda fuera del periodo.
- [NxN en Évora, 24 de septiembre](https://cincodias.elpais.com/companias/2026-09-24/nxn-data-centers-compra-un-centro-de-datos-en-portugal-y-compromete-una-inversion-de-100-millones.html): Portugal y fecha fuera de ventana. La previsión de Madrid para final de octubre todavía no ha vencido.
- Noticias de Microsoft del 16 de septiembre y órdenes de AWS de junio: fuera de ventana; no se presentan como novedades semanales por tener rastreo reciente.

## Búsquedas y huecos

Se empezó con BOE, boletines autonómicos y REE, y se consultaron fuentes oficiales de Aragón, MITECO, operadores y municipios. La prensa sirvió para localizar Rhodes, Tres Cantos y la iniciativa parlamentaria; Rhodes y la iniciativa se contrastaron después en fuentes primarias.

Consultas ejecutadas, con filtros de fechas cuando se indican:

- `site.boe.es "centro de datos" "2026" "septiembre"`; `site:boe.es "requisitos de sostenibilidad" "centros de datos" septiembre 2026`.
- `site:boa.aragon.es "datos" "2026" "28/09"`; `site:boa.aragon.es "centro de datos" "septiembre" "2026"`; `site:bocyl.jcyl.es "centro de datos" "2026" septiembre`; búsquedas equivalentes en BOCM y DOGV.
- `site:ree.es capacidad acceso demanda csv septiembre 2026`; apertura de página oficial y enlaces de descarga; descarga de CSV de septiembre y octubre.
- `"centro de datos" after:2026-09-27 before:2026-10-05`; consultas para 28, 29 y 30 de septiembre y 1 y 2 de octubre de 2026. Los filtros del buscador devolvieron también documentos antiguos y páginas sin fecha; cada resultado retenido se fechó por su contenido.
- `site:aragonhoy.es Calatorao "septiembre" "2026" QTS`; `site:aragonhoy.es "Rhodes" "3.400"`; apertura de nota oficial.
- `site:trescantos.es "sello" "datos" septiembre 2026`, `"sello de calidad" "datos"` y búsquedas generales de Green Data City; sin texto municipal primario localizado.
- `site:aws.amazon.com Spain September 2026 data center`; `site:news.microsoft.com es-es septiembre 2026 centros datos`; sin novedad de emplazamiento fechada dentro de ventana localizada.
- `site:miteco.gob.es "centros de datos" "2026" septiembre`; lectura de audiencia y nota de agosto; búsqueda de iniciativa en Congreso.
- `site:merlinproperties.com Navalmoral septiembre 2026`; `site:doe.juntaex.es Navalmoral "2026" "septiembre" "Merlin"`; `site:cesga.es "Sionlla" "2026" septiembre`; `site:seg-social.es Soria CPD septiembre 2026`.

Cobertura limitada a búsquedas web indexadas y páginas/documentos concretos. No se descargaron todos los diarios autonómicos ni todas las sedes municipales de la semana. No se cubrieron de forma individual los boletines de todas las comunidades, Baleares, Ceuta y Melilla. La falta de resultados no acredita ausencia de publicaciones. La página del Parlamento no permitió comprobar CADA; la descarga CSV de REE falló mediante el navegador de investigación, pero funcionó mediante HTTP directo. No se contactó a terceros.

## Validación y alcance de la entrega

Se ejecutó `npm run validate`. Falló antes de validar los datos con `ERR_MODULE_NOT_FOUND`: falta el paquete `yaml` importado por `scripts/load.mjs`. No se instalaron dependencias ni se modificaron manifiestos. El borrador parcial queda sin validación del proyecto completada.

Solo se escribe este informe y el borrador de Rhodes en `research/propuestas-revision/`. No se modifica `ultima_verificacion`, no se aceptan huellas, no se integran propuestas, no se hacen commits y no se publica nada. Las cifras de inversión y empleo son anuncios oficiales; el alcance jurídico de la aprobación y la conciliación eléctrica quedan para revisión humana.
