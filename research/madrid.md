# Comunidad de Madrid — nota de investigación

Fecha de trabajo: **2026-08-29**. Todas las fichas creadas llevan
`ultima_verificacion: "2026-08-29"`.

Ámbito: Comunidad de Madrid (cluster FLAP-D). Se han creado **34 fichas** en
`data/sites/`. El criterio ha sido trazabilidad: cada dato de potencia, ubicación o estado
está respaldado por una URL que se abrió realmente durante la investigación, con cita literal.

## Nota metodológica y limitación importante

A mitad del trabajo se agotó la cuota de búsqueda web de la sesión (200/200 consultas
`WebSearch`, consumidas en su mayor parte fuera de esta tarea). A partir de ese punto la
investigación continuó **sin buscador**: se trabajó con obtención directa de URLs
(`curl`/`WebFetch`), con el buscador interno de *Data Center Market* y de *Brainsre News*
como sustitutos de un motor de búsqueda, y con la **API pública de PeeringDB** para
enumerar instalaciones registradas en España y obtener direcciones y coordenadas.
Google, Bing, DuckDuckGo y Mojeek respondieron con captcha o vacío desde este entorno.

Consecuencia directa: la cobertura de **fuentes oficiales (BOCM, expedientes urbanísticos,
declaraciones de impacto ambiental)** es mucho menor de lo deseable. Solo se ha podido
incorporar un documento municipal (el anuncio del Ayuntamiento de Alcalá de Henares sobre el
Plan Especial de Microsoft). El buscador de `comunidad.madrid` no devolvió resultados útiles
y los buscadores de los ayuntamientos de Meco, Algete y San Sebastián de los Reyes no
respondieron o no indexan el término.

`datacenterdynamics.com` devuelve 403 a cualquier petición desde este entorno, tanto por
`curl` como por `WebFetch`, por lo que **no se ha citado ninguna vez** pese a aparecer en
resultados de búsqueda. Lo mismo ocurre con `datacentermap.com` (Vercel Security Checkpoint)
y con `madridinvestmentattraction.com` (403).

## 1. Emplazamientos creados

| Fichero | Municipio | Estado | Potencia registrada (tipo) |
|---|---|---|---|
| `equinix-alcobendas-campus` | Alcobendas | operativo | 4,8 MW no_especificado (solo MD6, fuente secundaria) |
| `equinix-madrid-md1` | Madrid (Las Tablas) | operativo | — (sin dato público) |
| `digital-realty-madrid-julian-camarillo` | Madrid (Julián Camarillo) | operativo | MAD4 32 / 30 MW; MAD1 3; MAD2 2,4; MAD3 5; MAD5 24 y 40 MW (todas no_especificado) |
| `data4-alcobendas-mad01` | Alcobendas | operativo | 50 MW no_especificado; 20+10+10 MW conexion_red |
| `data4-san-agustin-del-guadalix-mad02` | San Agustín del Guadalix | en_construcción | 80 MW instalada_total / 48 MW it / 50 MW no_especificado |
| `cyrusone-alcobendas-mad1` | Alcobendas | operativo | 18 MW **it** (2 salas de 9 MW); 34 MVA de acometida |
| `global-switch-madrid-yecora` | Madrid (San Blas) | operativo | 14 + 56 MW no_especificado; 18 MW según directorio |
| `iron-mountain-san-fernando-de-henares-mad` | San Fernando de Henares | parcialmente_operativo | 79 MW **it** aprobados; 3 MW it operativos; 2 MW (prensa); 130 MW (2022) |
| `nabiax-alcala-de-henares-adc` | Alcalá de Henares | ampliacion_en_construccion | 22,3 MW **it** operativos; 100 MW it objetivo; 135 MW instalada_total |
| `nabiax-madrid-julian-camarillo` | Madrid | ampliacion_en_construccion | 10 MW **it**; 15 MW it máximo |
| `merlin-edged-getafe-mad01` | Getafe | operativo | 20 MW no_especificado; 27 MW ampliable |
| `merlin-edged-getafe-2` | Getafe | operativo | 48 MW y 20 MW no_especificado (contradicción interna) |
| `ntt-las-rozas-mad1` | Las Rozas de Madrid | operativo | 6,9 MW **it** |
| `templus-alcala-de-henares-mad01` | Alcalá de Henares | ampliacion_en_construccion | 20 MW y 10 MW no_especificado |
| `templus-madrid-mad02-manoteras` | Madrid (Hortaleza) | operativo | 3,2 MW / 3 MW no_especificado |
| `templus-madrid-mad03-albasanz` | Madrid (San Blas) | operativo | 1,5 MW no_especificado |
| `adam-alcala-de-henares` | Alcalá de Henares | operativo | 2 MW (1ª fase) / 4 MW (directorio) |
| `vaultica-alcala-de-henares-mad01` | Alcalá de Henares | anunciado | 12 MW **it** |
| `acs-alcala-de-henares-campus` | Alcalá de Henares | en_construcción | >100 MW **it** objetivo; 50 MW **conexion_red** garantizados |
| `microsoft-alcala-de-henares-campus` | Alcalá de Henares | en_tramitacion | — |
| `microsoft-algete` | Algete | en_construcción | — |
| `microsoft-meco` | Meco | en_construcción | — |
| `microsoft-san-sebastian-de-los-reyes` | San Sebastián de los Reyes | en_construcción | — |
| `pure-dc-meco` | Meco | anunciado | 25 MW **conexion_red** contratados |
| `nlighten-madrid-lezama` | Madrid (Fuencarral) | operativo | 1,5 MW / 2 MW no_especificado |
| `espanix-madrid-mesena` | Madrid (Hortaleza) | operativo | — |
| `espanix-madrid-gran-via-hortaleza` | Madrid (Hortaleza) | desconocido | — |
| `bbva-tres-cantos` | Tres Cantos | operativo | — |
| `acens-alcobendas` | Alcobendas | operativo | — |
| `espacio-rack-pozuelo-de-alarcon` | Pozuelo de Alarcón | operativo | — |
| `ipcore-madrid-calle-marzo` | Madrid (San Blas) | desconocido | — |
| `iaas-datacenter-madrid-maraton` | Madrid (San Blas) | desconocido | — |
| `diversity-cloud-arganda-del-rey` | Arganda del Rey | desconocido | — |
| `ibercom-madrid-maria-tubau` | Madrid (Fuencarral) | desconocido | — |

Confianza asignada: **alta** en 5 fichas, **media** en 17, **baja** en 12.

### Criterio de agrupación aplicado

- `equinix-alcobendas-campus` agrupa MD2 (Calle Valgrande 6) y MD3x/MD5/MD6 (Calle de la
  Pedriza 12) porque Equinix los presenta como un único "campus de Alcobendas". Queda anotado
  en `incertidumbres` que MD2 está en otra calle.
- `digital-realty-madrid-julian-camarillo` agrupa MAD1-MAD4 (más MAD5 proyectado) por la misma
  razón: Digital Realty los comercializa como "our Madrid data center campus". Las direcciones
  individuales están en `fases[]`.
- Getafe 1 y Getafe 2 de MERLIN Edged **sí** se separan: Edged publica fichas independientes,
  con direcciones distintas (Fundidores 40 y Fundidores 2) y capacidades distintas.

## 2. Huecos de información

1. **Fuentes oficiales.** No se ha podido consultar el BOCM ni ninguna sede electrónica
   municipal con buscador funcional (salvo Alcalá de Henares). Faltan expedientes de
   licencias, declaraciones de impacto ambiental y autorizaciones administrativas de
   prácticamente todos los proyectos.
2. **Conexión eléctrica.** El bloque `conexion_electrica` solo se ha podido rellenar en cuatro
   fichas (DATA4 MAD01, NTT Las Rozas, Pure DC Meco, Vaultica Alcalá, más las dos subestaciones
   propias previstas de Iron Mountain). No se ha localizado ningún registro público que ligue
   emplazamientos a nudos concretos de Red Eléctrica o a las distribuidoras.
3. **Microsoft.** No hay ningún dato de potencia, superficie ni dirección para Algete, Meco y
   San Sebastián de los Reyes. La única fuente es la nota de apertura de la región Spain
   Central. Tampoco se ha podido confirmar si esos tres centros ya están en servicio en 2026.
4. **Equinix y Digital Realty** no publican MW en ninguna de sus fichas técnicas de Madrid.
   Las cifras registradas proceden de declaraciones a prensa o de directorios comerciales.
5. **Templus MAD01 (Alcalá).** No se ha localizado dirección postal. Un resultado de búsqueda
   apuntaba a "C. Tales de Mileto 21, 28806", pero no se pudo abrir la página que lo sostenía,
   así que **no** se ha incorporado.
6. **CPD de la Comunidad de Madrid.** Adjudicado a Telefónica en junio de 2025 por 24,5 M€ y
   diez años, para centralizar los datos de todas las consejerías. No se ha publicado su
   ubicación, por lo que no se ha creado ficha.
7. **Refrigeración y consumo de agua.** Solo hay dato para MERLIN Edged (WUE 0,00), Microsoft
   (refrigeración evaporativa directa, ~15% del tiempo), CyrusOne (circuito cerrado),
   Iron Mountain (PUE 1,4), Templus (PUE 1,3), nLighten (PUE 1,29) y Adam (PUE ~1,3).
8. **Municipios sin resultados.** Coslada, Torrejón de Ardoz, Daganzo, Paracuellos, Loeches,
   Mejorada del Campo y Villaverde: no se ha encontrado ninguna instalación ni proyecto con
   evidencia utilizable. Es un hueco real de la investigación, no una afirmación de ausencia.

## 3. Contradicciones sin resolver (registradas en las fichas)

| Emplazamiento | Choque |
|---|---|
| Iron Mountain San Fernando | Ficha corporativa: MAD-2..MAD-5 de 10 MW y MAD-6/7/8 "36 MW **each**" → suma 151 MW frente a los 79 MW declarados para el campus. Además 3 MW (corporativo) vs 2 MW (prensa) en MAD-1, y 130 MW potenciales según la venta de Xdata en 2022. |
| DATA4 MAD02 | 80 MW totales / 48 MW IT y 130 MW de DATA4 en Madrid (nota de 2023) vs 50 MW por campus y 100 MW en España (web corporativa 2026). |
| Digital Realty MAD4 | 32 MW (director general de Digital Realty España) vs 30 MW (directorio OCOLO); 35.000 m² (director general) vs 21.200 m² (ficha del edificio). |
| Digital Realty MAD5 | 20-24 MW (EjePrime, citando a la compañía) vs 20-40 MW (Brainsre, citando a Idealista). |
| MERLIN Edged Getafe 2 | La propia página de Edged muestra "48 MW Critical Load Capacity" y "20 MW Critical Load Capacity" para el mismo edificio. Además la nota de MERLIN de enero de 2025 no menciona un segundo edificio en Getafe. |
| Global Switch Madrid | 14 MW + 56 MW (operador) vs 18 MW para el conjunto (directorio OCOLO). |
| Nabiax Alcalá | 22,3 MW IT (web) vs una instalación "de 50 MW" según un reportaje de prensa generalista de 2026; y 10.800 m² de salas IT (web) vs 22.000 m² anunciados al completar la fase 2. |
| Adam Alcalá | 2 MW en primera fase (operador) vs 4 MW (directorio OCOLO). |
| nLighten Madrid | 1.500 kW (operador) vs 2,00 MW (directorio OCOLO). |
| NTT Las Rozas | 3.400 m² y 6,9 MW IT (web de NTT) vs 3.600 m² y 6 MW (nota en PeeringDB). |
| Mercado de Madrid | Capacidad instalada regional: 164 MW IT en 3T2024 (Colliers), 126 MW en 2025 (Structure Research), 203 MW en 2025 (CBRE). Tres consultoras, tres cifras. |

## 4. Proyectos vistos pero **descartados** (y por qué)

| Proyecto | Motivo del descarte |
|---|---|
| **EDGNEX (DAMAC) Madrid** | Operación real y bien documentada: 23.000 m² comprados a ASG Iberia en octubre de 2024, derechos de 40 MW (10 MW inmediatos + 30 MW en 1T2026), inversión >400 M€. Pero **ninguna fuente indica el municipio**: solo "a 15 kilómetros del centro de Madrid". El esquema exige municipio y no se inventa. Debe recuperarse en cuanto aparezca la ubicación. |
| **Prime DC (Alcobendas)** | Solo una mención de pasada en un informe de Colliers reproducido por prensa ("la llegada de nuevos actores como Prime DC en Alcobendas"). Sin superficie, potencia, dirección ni fuente primaria. |
| **Digital Valley Spain (San Sebastián de los Reyes)** | 785 hectáreas de parque tecnológico anunciadas en 2023 con impacto estimado de 15.012 M€ en PIB hasta 2040. No es un emplazamiento de CPD sino una ordenación de suelo; no se ha localizado su tramitación posterior ni qué centros concretos alberga. |
| **Oracle — regiones cloud de Madrid (3)** | Oracle declara explícitamente que sus regiones de Madrid están **alojadas en instalaciones de Telefónica**. No son emplazamientos físicos propios y crearían doble conteo con las fichas de Nabiax/Telefónica. |
| **Google Cloud región Madrid, IBM multizone region, OVHcloud local zone** | Mismo motivo: son regiones lógicas alojadas en instalaciones de terceros (OVHcloud, por ejemplo, en Digital Realty). No se ha localizado un emplazamiento propio en la Comunidad de Madrid. |
| **AWS** | Su región española es Aragón. No se ha encontrado evidencia de emplazamiento propio en la Comunidad de Madrid (solo presencia comercial y de red). |
| **Stack Infrastructure, Vantage Data Centers, CyrusOne (más allá de MAD1), EdgeConneX, Colt DCS** | Verificado en PeeringDB (consulta por país ES) y en sus webs: ninguno tiene instalación registrada en Madrid. EdgeConneX solo aparece en Sant Boi de Llobregat (Barcelona). |
| **AtlasEdge Madrid** | No se descarta el emplazamiento: se ha absorbido. AtlasEdge vendió sus nueve centros a Templus (diciembre 2025, traspaso operativo mayo 2026), incluido "Madrid". No se ha podido determinar si corresponde a MAD02 (Manoteras) o MAD03 (Albasanz), así que figura como incertidumbre en la ficha de MAD02 y no como ficha propia. |
| **Kyndryl / IBM San Fernando de Henares** (C/ Mar Adriático 2) | Aparecía en un resumen de resultados de búsqueda, pero **no se pudo abrir ninguna página que lo sostuviera** (ni web de Kyndryl, ni PeeringDB, ni prensa accesible). Sin fuente abierta y citable, no se crea ficha. |
| **CPD de Telefónica en Ríos Rosas (Madrid)** | Mencionado en un artículo de 2014 como centro dedicado al tráfico internacional. Fuente de hace doce años, sin confirmación de continuidad ni ningún dato cuantitativo. |
| **"Madrid MAD1", C. de la Pelaya 1, Algete** | Aparece en el directorio OCOLO sin potencia y sin que el listado permita atribuirlo con seguridad a un operador concreto (probablemente IPTP Networks). Atribución no verificable. |
| **Verizon Madrid, Andrino Telecom MAD1, Vozelia, Cogent Madrid** | Registros de PeeringDB que corresponden a puntos de presencia de operadores **dentro** de instalaciones ya fichadas (Global Switch Yécora 4, Digital Realty Albasanz 71) o, en el caso de Cogent, a una subestación de REE. Incluirlos sería doble conteo. |
| **Solvia / Banco Sabadell — complejo de Alcobendas (44.000 m²)** | Venta de 2024 de un complejo de oficinas con centro de datos, con el comprador identificado solo como "podría tratarse de Equinix" según prensa. Comprador no confirmado y no se ha podido ligar a un emplazamiento operativo concreto. |

## 5. Nivel de cobertura estimado

**Alto en operadores de colocation y mayoristas; bajo en el ángulo administrativo y de red
eléctrica.**

- Los grandes operadores del cluster están cubiertos con fuente primaria de la propia
  compañía: Equinix, Digital Realty, DATA4, Nabiax, MERLIN Edged, Iron Mountain, CyrusOne,
  Global Switch, NTT, Templus, nLighten, Adam, Vaultica. Estimo que esto cubre la práctica
  totalidad de la capacidad de colocation instalada en la región.
- Los hiperescalares están cubiertos solo nominalmente: Microsoft aparece con cuatro fichas
  pero sin un solo MW trazable, y AWS/Google/Oracle/IBM se han descartado por no tener
  emplazamiento propio documentado en Madrid.
- **Falta muy probablemente el pipeline de proyectos anunciados en 2025-2026.** CBRE cifraba
  en agosto de 2025 en 554 MW los proyectos anunciados en tramitación en Madrid, y Colliers en
  628 MW el pipeline confirmado a cinco años. Las fichas creadas no llegan a explicar ese
  volumen: hay decenas de proyectos que no se han podido identificar sin acceso a buscador ni
  a boletines oficiales.
- Cobertura estimada: **~75-85% de la capacidad instalada** (MW en operación) de la Comunidad
  de Madrid, pero probablemente **menos del 40% de los proyectos anunciados o en tramitación**.

### Recomendación para la siguiente pasada

1. Recuperar cuota de `WebSearch` y rehacer la búsqueda del pipeline 2025-2026.
2. Atacar directamente BOCM (`bocm.es`) y las sedes electrónicas de Alcalá de Henares, Meco,
   Algete, San Sebastián de los Reyes, Getafe y San Fernando de Henares buscando planes
   especiales, licencias y declaraciones ambientales.
3. Cruzar con el registro de solicitudes de acceso y conexión a la red de transporte de Red
   Eléctrica para rellenar `conexion_electrica` en las fichas donde hoy está vacío.
4. Resolver la ubicación de EDGNEX (DAMAC) y crear su ficha.
