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

---

## 2. Hyperscalers

### 2.1 AWS (Amazon Web Services / Amazon Data Services Spain)

Región `eu-south-2` "Europa (España)", inaugurada **noviembre 2022**, con tres zonas de disponibilidad repartidas entre las provincias de **Zaragoza y Huesca**. — aboutamazon.es, 2026-04-23 — https://www.aboutamazon.es/noticias/aws/compromiso-largo-plazo-aws-aragon-espana

| Emplazamiento | Provincia | Estado | Potencia | Tipo de MW | Fuente |
|---|---|---|---|---|---|
| El Burgo de Ebro | Zaragoza | Operativo | 45 MW | SIN ESPECIFICAR en el directorio | observatorioedc.com/directorio/ |
| Villanueva de Gállego | Zaragoza | Operativo | 48,1 MW | SIN ESPECIFICAR | observatorioedc.com/directorio/ |
| Huesca (Walqa) | Huesca | Operativo | 46,5 MW | SIN ESPECIFICAR | observatorioedc.com/directorio/ |
| San Mateo de Gállego | Zaragoza | Planificación | **885,9 MW** | SIN ESPECIFICAR (magnitud sugiere MW de conexión agregada del PIGA, no MW IT) | observatorioedc.com/directorio/ |
| La Puebla de Híjar | Teruel | Planificación | 100,0 MW | SIN ESPECIFICAR | observatorioedc.com/directorio/ |
| Azaila | Teruel | Planificación (citado en el PIGA de ampliación) | no publicada | — | `[NO VERIFICADO en fuente abierta]` |
| Villanueva de Gállego / El Burgo de Ebro / Zaragoza / La Sotonera / Huesca (ampliación PIGA) | Zaragoza y Huesca | Aprobación definitiva por fases | no publicada | — | Gobierno de Aragón — https://www.aragon.es/-/expansion-aws-aragon |

**Ojo con el PIGA — dos listas de municipios distintas circulando.** La ficha oficial del Gobierno de Aragón del *Plan de Interés General de Aragón «Expansión de la Región AWS en Aragón»* nombra **Villanueva de Gállego, Huesca, El Burgo de Ebro, Zaragoza y La Sotonera** (suelos para centros de datos en los cuatro primeros; centros de medida en Villanueva de Gállego, La Sotonera y Zaragoza). Hitos: aprobación inicial 2024-12-04; aprobación definitiva 1ª 2025-08-22; 2ª (infraestructuras de conexión) 2025-11-12; 3ª (edificios, urbanización fase 1 y subestaciones) 2026-05-04. **No publica MW.** — https://www.aragon.es/-/expansion-aws-aragon y https://www.aragon.es/-/piga-aws-ampliacion
Frente a eso, resúmenes de prensa citan "Huesca, San Mateo de Gállego, Azaila y La Puebla de Híjar" con 30 edificios de data center, 10 subestaciones y 12 edificios auxiliares. **Los agentes territoriales deben verificar municipio a municipio en el BOA: hay al menos dos expedientes PIGA distintos de AWS y se están mezclando.**

**Cifras corporativas agregadas (riesgo de doble conteo alto):**
- **33.700 M€** anunciados en el MWC de Barcelona el **2026-03-02**, adicionales a los **15.700 M€** anunciados en 2024. Cobertura oficial: gobierno de España — http://espanadigital.gob.es/en/actualidad/aws-anuncia-durante-el-mwc-2026-una-inversion-de-33700-millones-de-euros-en-espana-para
- La nota de Amazon de **2026-04-23** cifra la inversión en **33.700 M€ (39.800 M$)**, aportación al PIB España 31.700 M€ y a Aragón 18.500 M€ hasta 2035, 29.900 empleos/año equivalentes, y anuncia la **entrada en la provincia de Teruel** ("primera tecnológica en anunciar centros de datos allí"). — https://www.aboutamazon.es/noticias/aws/compromiso-largo-plazo-aws-aragon-espana
- **Doble conteo:** las cifras de 15.700 M€ y 33.700 M€ **no son aditivas de forma limpia**; la fuente gubernamental las suma a ~49.400 M€ mientras Amazon presenta 33.700 M€ como cifra vigente total del compromiso a 10 años. No usar la suma.
- DCD atribuye a Amazon "300 MW adicionales" en Aragón, cifra que **no coincide** con los 885,9 MW del directorio para San Mateo de Gállego ni con ninguna cifra oficial. `SIN ESPECIFICAR el tipo de MW en ambas fuentes.`

**Alias / nombres alternativos:** `Amazon Data Services Spain S.L.` (promotor en los expedientes del Gobierno de Aragón) = AWS. En el listado del Observatorio aparece como `Amazon AWS`.

### 2.2 Microsoft

**Región cloud "Spain Central"** (Madrid), abierta 2024, desplegada sobre **tres emplazamientos**: San Sebastián de los Reyes, Algete y Meco.

| Emplazamiento | Municipio | Estado | Potencia | Tipo de MW | Fuente |
|---|---|---|---|---|---|
| Spain Central AZ | San Sebastián de los Reyes (Madrid) | Operativo | 15 MW | SIN ESPECIFICAR | observatorioedc.com/directorio/ |
| Spain Central AZ | Algete (Madrid) | Operativo | no publicada | — | observatorioedc.com/directorio/ |
| Spain Central AZ | Meco (Madrid) | Operativo | **120 MVA** eléctricos (el directorio anota explícitamente "IT MW no publicado") | MVA de conexión | observatorioedc.com/directorio/ |
| Campus Aragón — Villamayor de Gállego | Villamayor de Gállego (Zaragoza) | Planificación / DIGA | 50 MW fase 1, hasta ~300 MW potencial | MW de conexión | hoyaragon 2025-11-14 + observatorioedc |
| Campus Aragón — La Muela | La Muela (Zaragoza) | Planificación / DIGA | 50 MW fase 1, hasta ~300 MW potencial | MW de conexión | ídem |
| Campus Aragón — Puerto Venecia / Distrito Tecnológico Alierta | Zaragoza capital | Planificación → licencia de movimiento de tierras 2026 | 50 MW fase 1, hasta ~300 MW potencial | MW de conexión | ídem + DCD 2026-02-20 |
| Alcalá de Henares | Alcalá de Henares (Madrid) | Planificación | no publicada | — | observatorioedc.com/directorio/ |

**PIGA «Región MSFT» (Gobierno de Aragón), promotor `Microsoft 7724 Spain, S.L.U.`:** implantación e interconexión de **tres campus** en **La Muela, Villamayor de Gállego y Zaragoza**, con "un número variable de edificios de centros de datos" en cada uno. Hitos: DIGA La Muela 2023-12-20; DIGA Villamayor 2024-07-03; DIGA Zaragoza 2025-02-28; aprobación inicial del PIGA 2025-11-14. **No publica MW.** — https://www.aragon.es/-/piga-microsoft

**Desglose por campus (prensa regional, 2025-11-14):** Villamayor de Gállego 81 ha / 1.733 M€ / 3 edificios dobles + administrativo; Puerto Venecia (Zaragoza) 57 ha / 1.443 M€ / 1 edificio simple + 2 dobles + administrativo; La Muela 146 ha / 2.179 M€ / 2 simples + 2 dobles + administrativo. **Total 284 ha y 5.356 M€.** Potencia: **50 MW asegurados actualmente**, necesidad de **~300 MW por campus** a pleno despliegue; subestaciones 132 kV ampliables a 220 kV en fase 2; **seis PPA con Repsol por 230 MW renovables**. Fases: 2026-2030 (construcción y operación inicial) y 2030-2036 (ampliaciones). — https://www.hoyaragon.es/aragon/piga-microsoft-aragon-centro-datos/20251114215413116030.html

**Puerto Venecia (Zaragoza capital), detalle:** 59 ha junto al centro comercial Puerto Venecia, paralelo a la Z-40. Fase 1 **582 M€**; inversión total estimada del emplazamiento **2.882 M€**; DIGA nov-2025; licencia de acondicionamiento a inicios de 2026; obras previstas para arrancar en 2026. El artículo enmarca esto dentro de "10.000 millones de Microsoft en tres campus de Aragón". — DCD, 2026-02-20 — https://www.datacenterdynamics.com/es/noticias/microsoft-arranca-su-campus-data-center-en-puerto-venecia-zaragoza/

**Cifras corporativas que NO cuadran entre sí (ver sección 8c):** 5.356 M€ (suma de los tres campus, prensa nov-2025) vs. 6.690 M€ "tres campus" + 3.000 M€ "Puerto Venecia" (mapa hoyaragon nov-2025) vs. 2.882 M€ para Puerto Venecia solo (DCD feb-2026) vs. "10.000 M€ en tres campus" (DCD feb-2026). Ninguna combinación es consistente.

**Contestación social:** 349 alegaciones presentadas contra el centro de datos de Puerto Venecia en agosto de 2026 `[NO VERIFICADO — titulares de Heraldo y Cadena SER no abiertos]`. Relevante para el estado del proyecto.

**Alias:** `Microsoft 7724 Spain S.L.U.` = Microsoft. `Distrito Tecnológico Alierta` = mismo activo que `Puerto Venecia` (Zaragoza capital) — **riesgo alto de contarlo dos veces**.

### 2.3 Google Cloud

Región `europe-southwest1` (Madrid), operativa desde 2022, con **tres zonas**. Una de ellas se aloja en infraestructura de Telefónica en **Alcalá de Henares** (hoy activo de **Nabiax**); las otras dos no se han hecho públicas. `[NO VERIFICADO en fuente abierta — procede de resumen de buscador sobre blog.google y DCD]`

**Implicación crítica para el mapa:** si Google no tiene edificio propio en España, **no debe generar fichas de emplazamiento propias**; sus zonas son capacidad arrendada dentro de activos de Nabiax y de terceros. Contarlas como sitios Google sería doble conteo directo sobre Nabiax.

**Hueco:** no se ha localizado ningún anuncio abierto de campus propio de Google en España peninsular a 2026. El reportaje de DCD menciona "Google (Barcelona)" sin municipio, cifra ni fuente; **no usar**.

### 2.4 Oracle

Tres regiones cloud en Madrid: `eu-madrid-1` (Spain Central), `eu-madrid-2` (EU Sovereign South) y `eu-madrid-3` (disponible desde 2025-10-22). Se apoyan en instalaciones de terceros (campus de Alcalá, hoy Nabiax). Anuncio de junio de 2024 de inversión >1.000 M$ para una tercera región en Madrid. `[NO VERIFICADO — oracle.com devolvió 403; procede de resumen de buscador sobre oracle.com y DCD]`

**Implicación:** igual que Google — **capacidad arrendada, no emplazamiento propio**. No generar sitios Oracle.

### 2.5 IBM

Región Cloud Multizona de IBM en España desplegada sobre **tres instalaciones de terceros**: **DATA4 Alcobendas** (1,5 MW contratados, ~700 m² de sala), más instalaciones citadas como "Interxion" y "NTT". — Data Center Market, 2023-02-02 — https://www.datacentermarket.es/mercado/la-region-cloud-de-ibm-se-ubicara-en-instalaciones-de-data4/

**Aviso de reconciliación:** esa fuente atribuye Las Rozas a Interxion y Madrid capital a NTT. **Es al revés en la realidad conocida**: NTT opera en Európolis, **Las Rozas**, y Digital Realty/Interxion opera en **Madrid capital** (Albasanz/Emilio Muñoz). Tratar la adscripción de esa nota con cautela; la única parte firme es la de DATA4 Alcobendas y el hecho de que IBM **no tiene edificio propio**.

**Implicación:** no generar emplazamientos IBM. Es tenant.

### 2.6 Meta

| Emplazamiento | Municipio | Estado | Potencia | Tipo de MW | Fuente |
|---|---|---|---|---|---|
| Talavera Data Center Campus | Talavera de la Reina (Toledo), Polígono Torrehierro Fase 2 | Planificación; reparcelación aprobada 2026-08-14; tramitación urbanística en fase final 2026-07-31 | **248 MW** | El directorio lo etiqueta como **IT Power** | https://observatorioedc.com/datacenter/meta-zarza-networks-talavera-data-center-campus/ |

**Alias crítico:** el promotor formal es **`Zarza Networks`**, sociedad vehículo de Meta. Un agente territorial que busque "Meta" en el planeamiento de Castilla-La Mancha **no encontrará nada**; los expedientes van a nombre de Zarza Networks. Igualmente, el instrumento urbanístico es un **Proyecto de Singular Interés (PSI) "Meta Data Center Campus"** de la Junta de Castilla-La Mancha.

**Otras cifras en circulación (sin abrir fuente primaria):** 125 ha de parcela, ~300.000 m² construidos, 1.030 M€ de inversión 2024-2030, primeros edificios operativos hacia 2026-2027 y campus completo en 2029-2030. `[NO VERIFICADO]`

**Además — Meta como operador de cable, no de CPD:** el cable submarino **ANJANA** (24 pares de fibra, Carolina del Sur ↔ **Santander**) está promovido por Meta y entró en operación a principios de 2025. Es la razón por la que Cantabria aparece en el mapa (Proyecto Altamira). No es un centro de datos de Meta. — presentación institucional Proyecto Altamira, 2025-02-25 — https://www.cantabriadirecta.es/wp-content/uploads/2025/02/ALTAMIRA-Presentacion-25-Feb_vFinal.pdf

### 2.7 Alibaba Cloud, ByteDance/TikTok, Apple, OpenAI/Stargate

- **Alibaba Cloud:** **no hay proyecto en España**. Lo único documentado es que la Diputación de Ciudad Real se ofreció como emplazamiento a Alibaba en una reunión en Pekín (marzo 2026), proponiendo 400-500 M€ y 500-600 empleos directos; el viceministro chino Ma Hui expresó interés pero **sin compromiso alguno**. — DCD, 2026-03-05 — https://www.datacenterdynamics.com/es/noticias/ciudad-real-se-ofrece-a-alibaba-para-su-data-center-europeo/ → **No crear ficha. Es una candidatura política, no un proyecto.**
- **ByteDance / TikTok:** **hueco**. No se ha localizado ningún emplazamiento ni anuncio en España peninsular. TikTok históricamente usa capacidad de terceros en Europa (Irlanda/Noruega).
- **Apple:** **hueco**. Sin proyecto ni emplazamiento localizado en España.
- **OpenAI / Stargate:** **hueco**. No se ha localizado ningún acuerdo Stargate en España. Stargate es a día de hoy un vehículo OpenAI-SoftBank-Oracle-MGX centrado en EE. UU.

### 2.8 IA soberana: la gigafactoría española

No es un hyperscaler, pero es el mayor anuncio "soberano" y **puede escaparse a los agentes territoriales por no tener promotor privado identificable**.

| Elemento | Dato | Tipo | Fuente |
|---|---|---|---|
| Emplazamiento principal | **Móra la Nova (Tarragona)** | — | La Moncloa 2026-07-01 / El País 2026-07-01 |
| Emplazamiento secundario | **San Fernando de Henares (Madrid)** | — | ídem |
| Potencia | fase inicial **máximo 50 MW**, ampliable a **125 MW** | SIN ESPECIFICAR si IT o conexión | El País, 2026-07-01 |
| Inversión | 719-720 M€ públicos vía SETT (fondos NextGen) + 300 M€ a EuroHPC; movilización total estimada 3.000-5.000 M€ | — | La Moncloa / El País |
| Accionariado del consorcio | SETT (Estado) 47,99%; Telefónica 15,67%; ACS 15,67%; Banco Santander 15,67%; Multiverse Computing 4%; Generalitat de Catalunya 1% | — | La Moncloa, 2026-07-01 |
| Objetivo operativo | 2028 | — | El País, 2026-07-01 |
| Estado | Consorcio constituido; JV autorizada por Bruselas en agosto de 2026 `[NO VERIFICADO]`; pendiente de la convocatoria de gigafactorías de IA de la Comisión | — | — |

Fuentes: https://www.lamoncloa.gob.es/presidente/actividades/Paginas/2026/010726-sanchez-gigafactoria-inteligencia-artificia.aspx y https://elpais.com/espana/catalunya/2026-07-01/la-alianza-publico-privada-por-la-gigafactoria-de-ia-defiende-la-solidez-de-mora-la-nova-para-operar-en-2028.html

**Antecedente:** DCD había informado en junio de 2026 de que Santander, ACS y Telefónica "exploraban" la alianza, con consumo "de varios cientos de MW" y apoyo público de 600-800 M€. La cifra de "varios cientos de MW" **contradice** los 50-125 MW del proyecto ya constituido. — https://www.datacenterdynamics.com/es/noticias/santander-acs-y-telef%C3%B3nica-exploran-una-alianza-para-impulsar-una-gigafactor%C3%ADa-de-ia-en-espa%C3%B1a/

**Alias:** `Consorcio Gigafactoría IA España` = `SETT` = `Telefónica/ACS/Santander/Multiverse` — el Observatorio lo registra como una sola entrada en **Móra la Nova**.

---

## 3. Mayoristas y colocation internacionales

### 3.1 Equinix

Equinix entró en España **comprando Itconic al grupo Carlyle en 2017** por ~215 M€ `[NO VERIFICADO — cifra procedente de resumen de buscador sobre DCD]`. La sociedad **`Itconic S.A.` sigue viva como titular registral de al menos un activo**: el Observatorio lista `Itconic S.A. / Equinix — Alcobendas — Operativo`, con alias documentado **"MD4"/"Madrid-4"**. — https://observatorioedc.com/datacenter/itconic-s-a-equinix/

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| MD1 | Madrid capital | Operativo | no publicada | — | observatorioedc |
| MD2 | Alcobendas | Operativo | 5,12 MW | SIN ESPECIFICAR | observatorioedc |
| MD3x (xScale) | Alcobendas | Operativo | no publicada | — | observatorioedc |
| MD4x | Madrid | Operativo | 10 MW | SIN ESPECIFICAR | datacentermap `[NO VERIFICADO — solo título de resultado]` |
| MD5 | Alcobendas | Operativo desde 2026-05-22 | 9,6 MW (4 MW en fase 1) | SIN ESPECIFICAR | observatorioedc; apertura en newsroom Equinix |
| MD6 | Alcobendas | Operativo | 4,8 MW | SIN ESPECIFICAR | observatorioedc |
| Itconic / MD4 | Alcobendas | Operativo | no publicada | — | observatorioedc |
| BA1 | Barcelona | Operativo | 2,08 MW | SIN ESPECIFICAR | observatorioedc |
| BA2 | L'Hospitalet de Llobregat | Operativo | 3,0 MW | SIN ESPECIFICAR | observatorioedc |
| SA1 | Sevilla | Operativo | 3,6 MW | SIN ESPECIFICAR | observatorioedc |

**MD5 (apertura oficial):** Alcobendas, >4.400 m² de colocation, N+1, 100% renovable, LEED e ISO previstas para 2027. Equinix cifra en **460 M€** la inversión en el campus de Alcobendas y declara **ocho centros de datos operativos en España** (Madrid y Barcelona) y >300 clientes. — Equinix newsroom, 2026-05-22 — https://newsroom.equinix.com/2026-05-22-Equinix-refuerza-su-oferta-en-colocation-con-la-inauguracion-de-MD5-en-Alcobendas
**Nota:** la nota de Equinix **no publica MW** de MD5. Los 9,6 MW son del Observatorio.

**Contradicción de recuento:** Equinix dice "ocho data centers en España"; el Observatorio lista **nueve entradas** Equinix + 1 Itconic (= 10). La diferencia probable es que `Itconic/MD4` y `MD4x` sean el mismo activo, y/o que MD3x se cuente como parte del campus. **Marcar para reconciliación manual.**

**Alias:** `Itconic` → `Equinix` (2017). `Itconic Madrid-4` = `Equinix MD4`. `Equinix SA1 Sevilla` = ex-Itconic Sevilla.

### 3.2 Digital Realty (ex-Interxion)

Fusión Digital Realty–Interxion cerrada en **marzo de 2020**. Todos los `Interxion MADx` son hoy `Digital Realty MADx`.

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| MAD1 (C/ Albasanz 71) | Madrid capital | Operativo | 3 MW | SIN ESPECIFICAR | observatorioedc |
| MAD2 (C/ Albasanz 73) | Madrid capital | Operativo | 2,4 MW | SIN ESPECIFICAR | observatorioedc |
| MAD3 (C/ Emilio Muñoz 49) | Madrid capital | Operativo | 5 MW | SIN ESPECIFICAR | observatorioedc |
| MAD4 (C/ Alfonso Gómez 4) | Madrid capital | Operativo | 30 MW | SIN ESPECIFICAR | observatorioedc |
| **MAD5** | Madrid capital, distrito MaDBit / polígono **Julián Camarillo** | Anunciado 2025-09-25 | **20-24 MW** | SIN ESPECIFICAR en la fuente | DCD 2025-09-25 |
| **BCN1** | **Sant Adrià de Besòs** (Barcelona) | En marcha, apertura prevista **principios de 2026** | **14 MW** iniciales | SIN ESPECIFICAR | DCD 2025-09-25 + observatorioedc |

Inversión anunciada: **~500 M€** en total (300 M€ MAD5 + 230 M€ Barcelona; la suma da 530, la fuente titula "casi 500"). Energía 100% renovable vía acuerdo con **Acciona**. Digital Realty declara que sus cuatro instalaciones madrileñas canalizan ~65% del tráfico de internet de la Península. — DCD, 2025-09-25 — https://www.datacenterdynamics.com/es/noticias/digital-realty-destina-casi-500-millones-para-centros-de-datos-en-madrid-y-barcelona/

**Aviso:** el reportaje de DCD sobre el "boom de 90.000 millones" habla de "Digital Realty con Merlin Properties para 100 MW en Barcelona". **No hay confirmación de esa alianza en ninguna fuente primaria abierta.** Merlin opera su propio activo de Barcelona (Zona Franca) y Digital Realty el suyo (Sant Adrià). **Tratar como error probable del reportaje; no crear ficha conjunta.**

**Alias:** `Interxion MAD1/2/3/4` → `Digital Realty MAD1/2/3/4`. `MaDBit` = polígono Julián Camarillo, Madrid (mismo ámbito donde Nabiax tiene su campus Julián Camarillo → **dos operadores distintos en el mismo polígono, no confundir**).

### 3.3 Data4

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| MAD01 (campus Alcobendas, Avda. de la Industria 15) | Alcobendas | Operativo | 50,0 MW (Observatorio) / 70 MW (datacentermap `[NO VERIFICADO]`) | SIN ESPECIFICAR | observatorioedc / data4group.com |
| MAD02 (campus San Agustín del Guadalix) | San Agustín del Guadalix | Primer edificio operativo; campus hasta 2029 | **80 MW totales, "aproximadamente 48 MW IT"** (nota de 2023) / "70-80 MW en cuatro edificios" (DCD) | Mixto: total de sitio + IT | Data Center Market 2023-04-26; DCD |

- MAD02: cuatro edificios, 16.000 m² de sala IT, **530 M€**, primera piedra 2023-05-16, finalización 2029, orientado a hyperscalers. — https://www.datacentermarket.es/mercado/data4-invierte-530-millones-en-un-campus-data-center-de-80-mw-de-potencia/
- Data4 declara un plan de hasta **850 M€ en España hasta 2030**. — DCD — https://www.datacenterdynamics.com/es/noticias/data4-activa-su-data-center-en-el-campus-de-san-agust%C3%ADn-del-guadalix/
- La web corporativa confirma **dos campus en España** (Alcobendas y San Agustín del Guadalix) y **no publica MW**. — https://www.data4group.com/es/

**Doble conteo:** IBM aloja una de sus zonas en DATA4 Alcobendas con **1,5 MW contratados**. Esa capacidad ya está dentro de los MW de Data4. No sumar.

**Aviso:** Data4 no está en Alcalá de Henares. Circula esa atribución en resúmenes; los dos campus son Alcobendas y San Agustín del Guadalix.

### 3.4 Vantage Data Centers — ⚠️ PROYECTO RELOCALIZADO

Anuncio original (septiembre 2025): campus de hiperescala en **Villanueva de Gállego** (Zaragoza), 40 ha, **3.200 M€**, cinco fases en diez años, **90 MW de suministro asegurado** en fase 1, 180 empleos directos iniciales y 520 al final. El Observatorio lo registra como `Vantage — Villanueva de Gállego — Planificación — 300 MW`.

**En julio de 2026 Vantage RENUNCIÓ a los suelos de Villanueva de Gállego.** Motivo: imposibilidad de resolver la conexión eléctrica — la fase 1 requería 90 MW de Endesa y el desarrollo completo 300 MW adicionales desde los nudos **Villanueva 220** y **Peñaflor 220**, saturados por proyectos competidores. Alternativas que baraja: **San Mateo de Gállego** (fincas de 600-900 ha) y el **Parque Tecnológico del Reciclado (PTR) López Soriano**. La primera fase se rebaja a **500 M€**. El proyecto "sigue adelante" pero la tramitación se reinicia; se considera modificable la DIGA existente. — El Periódico de Aragón, 2026-07-24 — https://www.elperiodicodearagon.com/aragon/2026/07/24/vantage-reubicara-centro-datos-renunciar-zaragoza-132732543.html

**ACCIÓN PARA LOS AGENTES TERRITORIALES:** cualquier ficha "Vantage — Villanueva de Gállego" a fecha de hoy está **obsoleta**. Debe marcarse como relocalizado/en revisión, con municipio pendiente.

### 3.5 CyrusOne

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| MAD1 (Plot 5A, Valdelacasa) | **Alcobendas** | Operativo | **18 MW IT** | **MW IT (explícito)** | Nota CyrusOne 2022-10-17 + observatorioedc |

Suelo adquirido en 2021 (5 acres), primera piedra 2022-10-17, 6.000 m² de sala técnica en dos plantas, BREEAM "Very Good", 100% renovable, ~100 kW de fotovoltaica en cubierta, finalización prevista abril 2024. — https://www.cyrusone.com/resources/press-releases/cyrusone-breaks-ground-on-first-spanish-data-center-in-madrid-as-european-expansion-continues

**Nota de coincidencia territorial:** CyrusOne MAD1 y el nuevo campus de **Ferrovial** están **ambos en el Plan Parcial Valdelacasa, Alcobendas**. No confundirlos.

**Hueco:** no se ha localizado ninguna ampliación (MAD2) de CyrusOne en España.

### 3.6 EdgeConneX

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| Barcelona | **Sant Boi de Llobregat** | Operativo | **8,4 MW** | SIN ESPECIFICAR | observatorioedc |

Cifras en circulación no verificadas: 7.600 m², 8 MW N+1 ampliables a 16 MW; y una estrategia ibérica con campus también en Madrid, Bilbao y Lisboa. `[NO VERIFICADO]` — **el Observatorio solo registra Sant Boi**; si un agente territorial encuentra EdgeConneX en Madrid o Bilbao, es hallazgo nuevo y debe documentarse.

### 3.7 NTT Global Data Centers

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| Madrid 1 (MAD1), Európolis | **Las Rozas de Madrid** | Operativo desde 2022-05-24 | **6,9 MW** (Observatorio) / "6,3 MW IT máximos a pleno build-out" `[NO VERIFICADO]` | SIN ESPECIFICAR / MW IT | observatorioedc |

3.600 m² de sala IT sobre parcela de 12.516 m², Tier 3, conectividad por fibra de Lyntia. `[NO VERIFICADO]`
**Hueco:** no se ha localizado un MAD2 de NTT ni ampliación anunciada.

### 3.8 Colt DCS

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| Colt Madrid Data Centre | Madrid (a 6 km del aeropuerto; ficha comercial de Colt) | Operativo | **6 MVA** ("Powered by 6MVA"), >2.200 m² | **MVA de alimentación, NO MW IT** | Ficha oficial Colt DCS — https://www.coltdatacentres.net/en-GB/our-locations/data-centre-locations-europe/-/media/Files/europe-data-sheets/colt-madrid-datasheet-en.pdf |

El mapa de la propia ficha marca **Madrid y Barcelona** como emplazamientos Colt en la Península.
**Alias importante:** el Observatorio registra **`Templus (ex AtlasEdge / Colt) BCN001 "Steel" — Barcelona — Operativo — 6 MW`**. Es decir, **el activo de Colt en Barcelona pasó a AtlasEdge y de ahí a Templus**. Cualquier ficha "Colt Barcelona" debe reetiquetarse como Templus BCN001.
**Hueco:** no se ha encontrado ficha de Colt Madrid en el directorio del Observatorio; conviene comprobar si sigue operativo bajo marca Colt o si también cambió de manos.

### 3.9 Global Switch

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| Madrid 1 (C/ Yécora 4) | Madrid capital | Operativo | **14 MW** | SIN ESPECIFICAR | globalswitch.com |
| Madrid 2 (C/ Yécora 4) | Madrid capital | Operativo | **56 MW** | SIN ESPECIFICAR | globalswitch.com |
| **Total campus Madrid** | — | — | **70 MW** | SIN ESPECIFICAR | https://www.globalswitch.com/data-centres/madrid/ |

La web menciona "planes de expansión avanzados" sin detalle.
**⚠️ DISCREPANCIA GRAVE:** el Observatorio registra `Global Switch — Madrid — Operativo — 18 MW`; la propia compañía declara **70 MW en dos edificios**. Diferencia de 52 MW. Muy probablemente el Observatorio recoge carga IT contratada y Global Switch potencia total del campus. **Uno de los mayores errores potenciales del mapa si se toma la cifra baja.**

### 3.10 AtlasEdge — ⚠️ SALIDA DE ESPAÑA

AtlasEdge (participada de Liberty Global) **vendió nueve data centers a Templus**, anunciado el **2025-12-16**, con cierre previsto en el **primer semestre de 2026**. Entre ellos, **Madrid y Barcelona**. AtlasEdge se reorienta a Alemania, Austria y Portugal (Viena 42 MW, Lisboa 30 MW). — https://atlasedge.com/atlasedge-announces-sale-nine-data-centres-templus/

Antes de la venta, AtlasEdge declaraba en España **15,8 MW en >4.000 m²** repartidos por Madrid, Barcelona, Málaga, Sevilla, Mallorca y Ceuta `[NO VERIFICADO]`.

**Residual documentado:** el Observatorio aún lista `AtlasEdge Data Centres BCN002 — Sant Joan Despí — Planificación — 10 MW`. Comprobar si entró o no en el perímetro vendido.

**ACCIÓN:** salvo BCN002, **ninguna ficha debe llevar la marca AtlasEdge en España a 2026**. Reetiquetar a Templus.

### 3.11 Iron Mountain

Campus único en **San Fernando de Henares** (Madrid). Plan declarado: **79 MW en 60.000 m² y ocho data centers**.

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| MAD-1 | San Fernando de Henares | Operativo | 3 MW | SIN ESPECIFICAR | observatorioedc + cloudnews |
| MAD-2 | San Fernando de Henares | En construcción, entrega **Q4 2026** | 10 MW | SIN ESPECIFICAR | cloudnews.tech |
| MAD-3 | San Fernando de Henares | Planificado, entrega **Q1 2027** | 10 MW | SIN ESPECIFICAR | cloudnews.tech |

— https://cloudnews.tech/iron-mountain-accelerates-in-madrid-mad-2-to-arrive-with-10-mw-in-2026-and-mad-3-in-2027/ (abr-2026)

**Doble conteo:** los **79 MW del campus** son el objetivo a pleno desarrollo con 8 edificios. **No sumar 79 + 3 + 10 + 10.**

### 3.12 Goodman

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| MAD01 (C/ Provisional Iveco-Pegaso Cinco 2, 28022) | Madrid capital (corredor Este, A-2, ~7 km de San Blas) | **Obras iniciadas julio 2026**; RFS fase 1 Q1-2028, fase 2 Q1-2029 | **11,7 MW IT** (6 MW fase 1 + 5,7 MW fase 2) | **MW IT (explícito)** | https://es.goodman.com/en/data-centres/madrid/mad01 |

Tier 3, PUE anualizado objetivo 1,25, "power secured".
**Ejemplo de buena práctica:** Goodman publica MW IT desglosado por fase. Úsese como patrón de calidad.

### 3.13 Prologis y Segro — ⚠️ FUSIÓN EN CURSO

- **Prologis anunció la adquisición recomendada de SEGRO plc el 3-4 de agosto de 2026** (~18.800 M$; 0,0920 acciones Prologis por acción SEGRO; alternativa parcial en efectivo hasta 3.500 M£; cierre esperado en **el primer semestre de 2027**). La nota menciona expresamente ampliar oportunidades en "logistics, energy and **digital infrastructure**". **No detalla activos españoles.** — https://www.prologis.com/insights-news/press-releases/prologis-announces-recommended-acquisition-segro-plc
- **Prologis en España:** el Observatorio registra `Prologis — Madrid — Planificación — 24,0 MW` (SIN ESPECIFICAR tipo). Además, Prologis estudia **convertir 11 complejos logísticos existentes en España en centros de datos** `[NO VERIFICADO — titulares de Expansión/EjePrime no abiertos]`.
- **Segro en España:** **hueco**. No se ha localizado ningún data center de Segro en España peninsular.

**ACCIÓN DE ALIAS FUTURA:** a partir de 2027, cualquier activo Segro pasará a ser Prologis. Anotarlo ya en el mapa.

### 3.14 STACK Infrastructure y Penta Infra

- **STACK Infrastructure: hueco.** No se ha localizado ningún emplazamiento ni proyecto de STACK en España. Su huella EMEA documentada es Milán, Copenhague, Oslo y Estocolmo. **Cuidado con el falso positivo `Stackscale`** (proveedor de hosting con data centers en Madrid), que **no tiene relación con STACK Infrastructure**.
- **Penta Infra: hueco.** No se ha localizado presencia en España. Su expansión documentada es FLAP + Múnich.

---

## 4. Españolas: socimis, telecos, energéticas y constructoras

### 4.1 Merlin Properties / Merlin Edged — la cartera mejor documentada y la más propensa a doble conteo

**Estructura por fases (fuente corporativa, nota de resultados 2026-07-28):**

| Fase | Capacidad | Tipo | Estado |
|---|---|---|---|
| Fase I | **64 MW IT** | **MW IT (explícito)** | Totalmente equipada y operativa |
| Fase II | **254 MW IT** | **MW IT** | 160 MW ya alquilados o prealquilados |
| Fase III | **406 MW IT** | **MW IT** | En desarrollo |
| **Suma de fases** | **724 MW IT** | | |
| **Titular corporativo** | **"730 MW"** | | ← **no cuadra con 64+254+406=724** |

— https://www.merlinproperties.com/en/press/merlin-increases-total-revenues-and-ebitda-by-11-7-thanks-to-the-data-centers-division-which-reaches-160-mw-leased/

**Emplazamientos:**

| Activo | Municipio | Provincia | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|---|
| MAD 01 Getafe | **Getafe** | Madrid | Operativo (cash-flow desde Q4-2026) | 20 MW en operación, hasta 27 MW | **MW IT** | ir.merlinproperties.com |
| BCN 01 Zona Franca / Parc Logístic | **Barcelona** | Barcelona | Operativo | 16 MW en operación (22 MW según Observatorio), hasta 22 MW | **MW IT** | ir.merlinproperties.com / observatorioedc |
| ARA 03 / BIL03 | **Ribabellosa (Rivabellosa), Ribera Baja** | Álava | Operativo | 22 MW | MW IT | observatorioedc |
| ARA 02 / BIL02 | Ribabellosa | Álava | Operativo — **totalmente alquilado 12 meses antes de la entrega** | 48 MW | MW IT | Merlin 2026-07-28 / observatorioedc |
| ARA 01 / BIL01 | Ribabellosa | Álava | En construcción — **alquilado 18 meses antes de operar** | 48 MW | MW IT | Merlin 2026-07-28 / observatorioedc |
| ARA 04 y ARA 05 | Ribabellosa | Álava | Fase III, en desarrollo | parte de los 406 MW IT | MW IT | Merlin 2026-07-28 |
| **Tres Cantos** | **Tres Cantos** | Madrid | Fase II, en construcción / licencias | no desglosado (dentro de los 254 MW IT de Fase II) | MW IT | Merlin 2026-07-28 / observatorioedc |
| **Zaragoza WIND — Botorrita** | **Botorrita** | Zaragoza | Fase III; RFS objetivo **2S 2029** | **144 MW IT** (formato edificio único) | **MW IT (explícito, nota corporativa)** | Merlin 2026-07-27 |
| Navalmoral de la Mata | **Navalmoral de la Mata** | Cáceres | Suelo "ready-to-build", en promoción internacional | ~1.000 MW (8-10 edificios de 100 MW) | SIN ESPECIFICAR — cifra de suelo, no de proyecto | ir.merlinproperties.com |
| Valdecaballeros | **Valdecaballeros** | Badajoz | Requiere obras previas y tramitación urbanística | ~1.000 MW (10 edificios de 100 MW) | SIN ESPECIFICAR | ir.merlinproperties.com |

Fuentes: https://ir.merlinproperties.com/en/new-opportunity-in-data-centers/ · https://www.merlinproperties.com/en/press/merlin-desarrollara-en-aragon-el-mayor-proyecto-de-autoconsumo-renovable-para-data-centers-del-mundo/ · https://www.merlinproperties.com/en/data-centers/ (esta última **no publica MW**: muestra "0 MW")

**Botorrita — caso de estudio de tres cifras para el mismo activo:**
- **144 MW IT** — nota de prensa de Merlin, 2026-07-27, 1.225 M€, operativo 2S-2029, 87% de autoconsumo renovable antes de hibridación con baterías.
- **150 MW** — cifra repetida por prensa económica y por Cinco Días al describir la Fase III ("nueva instalación de 150 MW en Aragón").
- **476,8 MW** — El Mundo, 2026-07-22: "476,8 MW de potencia renovable conectada", 1.200 M€, 156.000 m² sobre 28,8 ha, acuerdo con **Forestalia**, 95% autoconsumo. — https://www.elmundo.es/aragon/2026/07/22/6a60b6a3e4d4d8d4208b4587.html
→ **Las tres son magnitudes distintas: 144 MW IT ≠ 150 MW (redondeo/planificación) ≠ 476,8 MW de generación renovable conectada.** Un mapa que tome 476,8 como potencia del CPD estaría inflando el activo por 3,3x.

**Alianza con Iberdrola (campus de Álava):** campus de Ribabellosa (Álava) con **>300 MW IT**, alimentado por un parque solar de **125,89 MW fotovoltaicos en Armiñón (Álava)**; inversión del campus >2.000 M€; primera fase operativa, segunda en construcción, fases siguientes desde 2026, plena operación 2029; ingresos por rentas previstos de 300 M€/año desde 2029. — DCD — https://www.datacenterdynamics.com/es/noticias/merl%C3%ADn-e-iberdrola-se-al%C3%ADan-para-impulsar-el-mayor-centro-de-datos-de-espa%C3%B1a/
**Aviso de doble conteo:** los 125,89 MW de Armiñón son **generación fotovoltaica**, no capacidad de data center. No sumarlos.

**Alianza con Solaria:** Solaria declara un data center de **225 MW con un PPA solar de 445 MW a 15 años con Merlin**. — DCD, 2025-11-21 — https://www.datacenterdynamics.com/es/noticias/solaria-se-transforma-invierte-2500-m-para-triplicar-su-capacidad-y-lanzar-una-plataforma-europea-de-data-centers-verdes/
**Aviso:** no se ha podido determinar **a qué emplazamiento de Merlin corresponden esos 225 MW**. Podría solaparse con Botorrita o con Tres Cantos. **Hueco a resolver.**

**Cifras corporativas agregadas de Merlin en circulación (todas se solapan entre sí):**
- **2.400 M€ para 274 MW** en Iberia (mayo 2025): Fase 1 608 M€/64 MW + Fase 2 2.112 M€/210 MW. — https://revistacloud.com/merlin-acelera-su-plan-de-centros-de-datos-2-400-millones-de-euros-para-desplegar-274-mw-en-la-peninsula-iberica/
- **7.840 M€ hasta 2032 para 730 MW**: Fase I 614 M€, Fase II 2.756 M€, Fase III ~4.470 M€. — Cinco Días, 2026-05-02 — https://cincodias.elpais.com/companias/2026-05-02/merlin-invertira-7840-millones-en-la-construccion-de-centros-de-datos-hasta-2032.html
- **4.470 M€ entre 2026 y 2030** (solo Fase III), con 412 MW adicionales: +162 MW Bilbao, +100 MW Lisboa, +150 MW Aragón. `[NO VERIFICADO — EjePrime no abierto]`
- **Merlin declara "34% de la capacidad total instalada en España"** con sus 730 MW. `[NO VERIFICADO]`
→ **Las cifras de fase I/II cambian entre notas (608 vs 614 M€; 64 MW constante; 210 vs 254 MW en fase II).** Usar siempre la nota más reciente (2026-07-28) y citar fecha.

**Alias:** `Merlin Edged` = joint venture Merlin + **Edged Energy** (tecnología ThermalWorks de refrigeración sin agua, PUE 1,15). `Merlin Arasur` = `Bilbao-Arasur` = **Ribabellosa/Rivabellosa, Álava** — ⚠️ **NO está en Bilbao ni en Bizkaia**. Un agente territorial de País Vasco que busque "Bilbao" no lo encontrará en el planeamiento de Bilbao; está en la **Ribera Baja alavesa**. `Zaragoza WIND` = `Botorrita`. `MAD 01` = Getafe. `BCN 01` = Zona Franca / Parc Logístic, Barcelona.

### 4.2 Nabiax (ex-Telefónica → Asterion → Aermont)

**Cadena de propiedad:** Telefónica vendió 11 data centers a un vehículo de **Asterion Industrial Partners** en 2019, creando **Nabiax**; en 2021 Telefónica aportó cuatro CPD más a cambio del 20%; en **noviembre de 2024** Asterion y Telefónica acordaron la venta de Nabiax a un fondo gestionado por **Aermont Capital** (~1.000 M€). `[Cadena verificada parcialmente: la operación Aermont aparece en múltiples titulares; la nota de asterionindustrial.com no pudo abrirse]`

| Activo | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| Alcalá DC1 (ADC1) | **Alcalá de Henares** | Operativo | 7,9 MW | SIN ESPECIFICAR | observatorioedc |
| Alcalá DC2 (ADC2) | Alcalá de Henares | Operativo | 14,4 MW | SIN ESPECIFICAR | observatorioedc |
| Alcalá (entrada adicional) | Alcalá de Henares | Operativo | no publicada | — | observatorioedc |
| Campus Julián Camarillo | Madrid capital | Operativo | no publicada | — | nabiax.com |
| Terrassa | **Terrassa** (Barcelona) | Operativo | no publicada | — | nabiax.com |
| **ADC3** (tercer edificio de Alcalá) | Alcalá de Henares | Anunciado 2026-08-04 | llevaría el campus a **>100 MW IT** | **MW IT** | Cinco Días 2026-08-04 |
| **Valencia** | Valencia (municipio sin concretar) | Mencionado en reportaje DCD: "Nabiax planea 50 MW" | 50 MW | SIN ESPECIFICAR | DCD feature `[NO VERIFICADO en fuente primaria]` |

**Plan corporativo:** ~**800 M€** para el proyecto ADC3 y la ampliación del campus; objetivo de pasar de **35 MW IT actuales a 140 MW IT**; ~1.000 empleos en construcción. Nabiax enfoca su producto a "nube híbrida e IA de inferencia" cerca de la demanda, no a entrenamiento hiperescalar. — https://cincodias.elpais.com/companias/2026-08-04/nabiax-invertira-800-millones-en-la-ampliacion-de-sus-centros-de-datos-en-espana.html

**⚠️ TRES CIFRAS INCOMPATIBLES DE LA PROPIA NABIAX:**
1. Web corporativa: "**6 data centers** en el país, 5 de los cuales forman 2 campus" y "**26 MW de potencia IT instalada**". — https://nabiax.com/en/about-nabiax/
2. Cinco Días (2026-08-04): "**35 MW IT** en tres instalaciones".
3. Nota de Asterion en la venta (2024): "**tres data centers con 35 MW de potencia instalada** en Alcalá de Henares, Julián Camarillo y Terrassa". `[NO VERIFICADO]`
4. Nota de adjudicación de 10 MW IT a dos hyperscalers (7,5 MW en Alcalá + 2,5 MW en Julián Camarillo, 47 M€): tras la operación "**36 MW IT instalados** y **supera los 50 MW de potencia total**". `[NO VERIFICADO]`
→ El rango 26–36 MW IT y la discrepancia 3 vs 6 instalaciones **deben resolverse antes de publicar**. La distinción "MW IT" vs "MW de potencia total" explica el 36 vs 50.

**Doble conteo mayor:** **Google, Oracle e IBM tienen zonas cloud alojadas total o parcialmente en el campus de Alcalá** (herencia Telefónica). Esa capacidad ya está contada dentro de Nabiax. **Bajo ningún concepto crear emplazamientos separados para Google Madrid, Oracle Madrid o IBM Madrid.**

**Alias:** `Telefónica Alcalá / CDG Alcalá` → `Nabiax Alcalá` (ADC1/ADC2/ADC3). `Interxion` NO es Nabiax. Propietario actual: **Aermont Capital**; anterior: **Asterion Industrial Partners**; origen: **Telefónica**.

### 4.3 Telefónica

Tras la venta de Nabiax, Telefónica **no opera CPD de colocation a gran escala en propiedad**. Su estrategia vigente es reconvertir **centrales telefónicas** en nodos de edge computing.
- El Observatorio registra `Telefónica Edge Computing — España — Varias — Operativo` (sin MW) y `Telefónica de España S.A.U. CNSO — Madrid — Operativo` (sin MW).
- Plan declarado: diez nodos activos y siete más a lo largo de 2026; a medio plazo, más de un centenar de centrales convertidas en nodos de computación distribuida. Ciudades citadas: Sevilla, Málaga, Madrid, Barcelona, Valencia, Zaragoza, Palma, Las Palmas, Bilbao, Valladolid, Gijón, A Coruña, Terrassa, Santa Cruz de Tenerife, Santiago de Compostela y Mérida. `[NO VERIFICADO — procede de resumen de buscador sobre blogthinkbig/Xataka]`
- Telefónica es además **socio del consorcio de la gigafactoría de IA** (15,67%) → ver 2.8.

**Recomendación:** los nodos edge de Telefónica son de escala sub-MW y **no deberían generar fichas** en un mapa de centros de datos salvo que el proyecto decida incluirlos como categoría aparte. Si se incluyen, marcarlos como "edge/central telefónica" para no contaminar los totales de MW.

### 4.4 MasOrange — ⚠️ CARTERA EN VENTA

MasOrange tiene **~una docena de activos de data center** repartidos por España y negocia su venta. Candidatos más avanzados: **Templus**, **CVC DIF** y **AtlasEdge**; contempla desinversión mayoritaria, abierta a una minoría; una opción es que Templus (ICG) pague parte en acciones. Proceso en fase muy preliminar, sin garantía de cierre. — El Economista, junio 2026 `[NO VERIFICADO — página no abierta; consistente en tres titulares distintos]`

El Observatorio registra solo tres entradas MasOrange (Madrid y dos en Donostia/San Sebastián), todas **sin MW**. → **Hueco: faltan ~9 activos MasOrange por localizar.** Es una de las lagunas más claras del mapa.

**Alias:** `MásMóvil` + `Orange España` → `MasOrange` (2024). Buscar también activos históricos bajo `Yoigo`, `Euskaltel`, `R Cable`, `Telecable`, `Jazztel`.

### 4.5 Cellnex — ⚠️ SALIDA DEL NEGOCIO

Cellnex puso en venta sus data centers en España (diciembre 2024) y **vendió su activo insignia de Barcelona, la sociedad `bitNAP`, a Templus (ICG) en febrero de 2025** — 3.000 m² y **1,7 MW**. `[NO VERIFICADO — titulares de El Economista/El Periódico/consejeros.es coincidentes, páginas no abiertas]`

**Alias:** `bitNAP` → `Cellnex` → `Templus`. Cualquier ficha "Cellnex Barcelona" es hoy Templus.

### 4.6 Iberdrola

Iberdrola actúa por tres vías distintas, y **es fácil contar la misma capacidad tres veces**:

**(a) JV con Echelon — `Echelon Iberdrola Digital Infra`**
- Propiedad: **Echelon 80% / Iberdrola 20% (a través de `CPD4Green`)**. Anunciada julio 2025, aprobada por la Comisión Europea en diciembre de 2025, constituida el 26-11-2025. Inversión inicial **>2.000 M€**.
- **Primer proyecto: "Madrid Sur"** — campus de **160.000 m²** con **230 MW de conexión a red asegurada** (*grid connection secured*), fotovoltaica en sitio + capacidad renovable de Iberdrola, ~1.500 empleos directos e indirectos.
- **Pipeline adicional: >700 MW en conexiones eléctricas** aseguradas y **hasta 6.000 M€** de inversión potencial en proyectos adicionales "en zonas estratégicas cerca de Madrid".
— https://echelon-dc.com/echelon-iberdrola-digital-infra/ (2026-01-22)
- **El Observatorio registra el mismo activo como** `Echelon Iberdrola Digital Infra — Madrid Sur / Aceca-Toledo — Planificación — **144,0 MW**`. Y DCD lo describe como "centros en **Aceca (Madrid, 144 MW iniciales)** y **Velilla (Palencia)**".
→ **⚠️ TRIPLE PROBLEMA:** (1) **230 MW de conexión** (fuente corporativa) vs **144 MW** (Observatorio y DCD) — casi con seguridad conexión vs IT; (2) **"Aceca" NO está en Madrid**: la central de Aceca está en **Villaseca de la Sagra (Toledo)**, junto a Añover de Tajo; DCD la ubica mal; (3) **Velilla (Palencia)** — la central térmica de **Velilla del Río Carrión** — es un segundo emplazamiento que **no aparece en la web de Echelon ni en el Observatorio**. **Hueco a verificar.**

**(b) Campus de Álava con Merlin** → ya contado en 4.1. **No duplicar.**

**(c) Proyecto propio en Toledo:** tras el veto del Gobierno a la macroplanta de Aceca, Iberdrola "proyecta un gran centro de datos en Toledo". `[NO VERIFICADO — titular de El Español 2026-08-19 no abierto]` **Posible solapamiento total con (a).**

**(d) i-DE (distribuidora de Iberdrola)** es el suministrador del campus de Ferrovial en Alcobendas → ver 4.9. No genera activo propio.

**Alias:** `CPD4Green` = vehículo de Iberdrola en la JV. `Echelon Iberdrola Digital Infra` = `Madrid Sur` = (¿?) `Aceca`. **Marcar como no resuelto.**

### 4.7 Endesa

Endesa **no promueve CPD propios**; se posiciona como suministrador. Plan estratégico 2026-2028 con **10.600 M€**, de los que **5.200 M€** a redes para centros de datos y renovables. — https://www.datacenterdynamics.com/es/noticias/endesa-moviliza-10600-m-hasta-2028-para-alimentar-la-ola-de-centros-de-datos-en-espa%C3%B1a/ `[URL obtenida de buscador; el intento de apertura de la versión "5.200 M€" devolvió 404 — verificar]`
Endesa es además el suministrador comprometido de los 90 MW de la fase 1 de **Vantage** (ver 3.4).
→ **No generar emplazamientos Endesa.**

### 4.8 Naturgy

Confirmó en **febrero de 2026** su entrada en el negocio de centros de datos, **sin crear filial**: coordinará equipos transversales para ofrecer soluciones "power-land" a hyperscalers (cita expresamente Amazon y Microsoft). Palancas: liderazgo en ciclos combinados de gas ante el cierre nuclear, puntos de conexión y PPA renovables. Inversión >1.300 M€ hasta 2027 en digitalización y refuerzo de red. Contextualiza el mercado español en **8,3 GW y 87.800 M€** de inversión prevista. — DCD, 2026-02-17 — https://www.datacenterdynamics.com/es/noticias/de-gas-a-gigawatts-naturgy-se-reinventa-en-la-fiebre-de-los-data-centers/
→ **No hay emplazamiento Naturgy identificado. Hueco / no generar ficha.**

### 4.9 Repsol — ⚠️ EMPLAZAMIENTO QUE SE SOLAPA CON OTRO PROMOTOR

| Emplazamiento | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| Centro de datos junto al ciclo combinado de Escatrón | **Escatrón** (Zaragoza) | En desarrollo; Repsol busca socio; no confirmado oficialmente por la compañía | **400 MW** | SIN ESPECIFICAR (la fuente lo presenta como capacidad del CPD; ~10 M€/MW) | La Ecuación Digital, 2025-01-28 — https://www.laecuaciondigital.com/actualidad/repsol-invertira-4-000-millones-en-un-centro-de-datos-de-400mw-en-zaragoza/ |
| Inversión en subestación de Escatrón | Escatrón | En ejecución 2026 | **11,8 M€** para ampliar la subestación; el ciclo combinado tiene ~**805 MW**; se conectarán 15 parques eólicos + baterías + el data center | MW de generación, NO de CPD | Industria Química, 2026-07-07 — https://www.industriaquimica.es/noticias/20260707/repsol-apuesta-escatron-con-una-inversion-118-millones-preparar-llegada-un-gran-centro-datos |

**⚠️ COLISIÓN EN ESCATRÓN:** hay **al menos dos proyectos distintos** anunciados en el mismo municipio:
1. **Repsol** — 400 MW, 4.000 M€, sobre su ciclo combinado (ex-Viesgo, 2018). Operador del CPD **sin identificar** en julio de 2026.
2. **Ignis / DayOne** — campus de IA de **300 MW**, >3.000 M€, ~900 ha. DCD titula "**Escatrón suma un nuevo megaproyecto de centros de datos con 444 MW**" (2026-06-08) — la cifra del titular (444 MW) **no coincide** con los 300 MW del cuerpo. — https://www.datacenterdynamics.com/es/noticias/escatr%C3%B3n-suma-un-nuevo-megaproyecto-de-centros-de-datos-con-444-mw/
→ **Hipótesis a verificar por el agente de Aragón: ¿es DayOne el operador del proyecto de Repsol, o son dos campus independientes?** Si son el mismo, el mapa contaría 700-844 MW donde hay 300-444. **Este es probablemente el mayor riesgo de doble conteo individual detectado.**

Repsol es además contraparte de **seis PPA con Microsoft por 230 MW renovables** en Aragón (ver 2.2). Eso es generación, no CPD.

### 4.10 Acciona — HALLAZGO POCO CUBIERTO

Acciona ha entrado en centros de datos comprando el **50% de `Ignis Data Epta`**, JV con **Ignis**, para un centro de datos en la **provincia de Segovia** con planta fotovoltaica adyacente. Capacidad **no divulgada oficialmente**; fuentes del sector la describen como "de escala media, con demanda eléctrica de varias decenas de MW". Contratos de suministro previstos antes del cierre de 2027. Se enmarca en un plan de Acciona de **2 GW de capacidad**. — Merca2, 2026-08-12 — https://www.merca2.es/2026/08/12/acciona-baterias-espana-centro-datos-2434688/

**ACCIÓN:** municipio concreto de Segovia **sin identificar**. Es un proyecto que muy probablemente **no esté en el radar del agente de Castilla y León**.

Acciona es además el proveedor de energía 100% renovable de los nuevos CPD de **Digital Realty** en Madrid y Barcelona (ver 3.2). Eso no genera activo.

### 4.11 ACS / Cobra / Iridium

**(a) Data center propio en Alcalá de Henares.** ACS anunció en **2023-11-15** que actúa como **inversor y operador** de un data center en **Alcalá de Henares** (Corredor del Henares): **6,7 ha** y **50 MW de suministro de energía garantizada** (⚠️ **MW de conexión, no IT**). Intervienen **Iridium** y **Arcano** (facilitadores de la operación), y **Turner** y **CIMIC Group** en la ejecución. Desarrollo a 5 años; inicio de operaciones previsto en 2025. — https://pressroom.grupoacs.com/noticias/el-grupo-acs-inversor-y-operador-de-un-data-center-en-madrid
El Observatorio lo registra como `Iridium / ACS Group — Alcalá de Henares — En construcción — 50 MW`.
**Alias:** `Iridium` = filial concesional de ACS. El suelo procede de **Arcano** (Colliers asesoró la venta). Buscar el expediente urbanístico también por `Arcano`.

**(b) Plataforma global con Global Infrastructure Partners (BlackRock).** Creación completada el **2026-01-09**: cartera operativa de **1,7 GW** en Europa, EE. UU. y Australia y **>11 GW** de proyectos en estudio. **La nota NO menciona activos españoles concretos.** — https://pressroom.grupoacs.com/noticias/el-grupo-acs-y-global-infrastructure-partners-completan-la-creacion-de-una-plataforma-global-de-centros-de-datos
Titulares posteriores hablan de "hasta 23.000 M€" y de un "primer contrato de capacidad ACS-BlackRock" (DCD, 2026-07-17). `[NO VERIFICADO]`
→ **⚠️ Los 1,7 GW y los 11 GW son globales. No adscribirlos a España.**

**(c) ACS es socio del consorcio de la gigafactoría de IA** (15,67%) → ver 2.8.

**(d) ACS compró a Ignis activos renovables (>500 MW) para alimentar sus data centers en España** (agosto 2025). `[NO VERIFICADO]` Generación, no CPD.

### 4.12 Ferrovial — HALLAZGO POCO CUBIERTO

| Emplazamiento | Municipio | Estado | Potencia | Tipo | Fuente |
|---|---|---|---|---|---|
| Campus MAD 01, Plan Parcial **Valdelacasa** (4 parcelas) | **Alcobendas** (Madrid) | Licencia de movimiento de tierras concedida; declarado de Especial Interés por el Acelerador de Inversiones de la CAM | Campus **>100 MW**; **Fase 1: 60 MW de potencia disponible, de los cuales 40 MW para equipo de cómputo** | **Distingue explícitamente potencia disponible (60 MW) de carga TI (40 MW)** | El Debate 2026-07-09 — https://www.eldebate.com/espana/madrid/20260709/ferrovial-abrira-gran-centro-datos-alcobendas-inversion-1000-millones-euros_437786.html · Comunidad de Madrid 2026-07-09 — https://www.comunidad.madrid/noticias/2026/07/09/diaz-ayuso-anuncia-campus-centros-datos-alcobendas-1000-millones-euros-inversion |

Inversión **>1.000 M€** (fase 1 ~153 M€), 21.914,86 m² en fase 1, ~50 empleos directos. Sociedad: **`Ferrovial Digital Infrastructure`**; distribuidora: **i-DE (Iberdrola)**.
**Dato de contexto:** el Acelerador de Inversiones de la Comunidad de Madrid acumula **17 proyectos de especial interés por ~9.000 M€, de los cuales 11 son centros de datos**. Esa lista es una **fuente de descubrimiento sistemática que el agente de Madrid debería explotar**.

**Alias:** `Ferrovial Digital Infrastructure` = Ferrovial. Emplazamiento en el **mismo Plan Parcial Valdelacasa** que CyrusOne MAD1 → no confundir.

### 4.13 Solaria

Solaria se presenta como **proveedor de acceso a red y suelo**, no como operador de CPD.
- Plan 2026-2028: **2.500 M€**, triplicar capacidad hasta **9 GW** en 2028.
- Plataforma europea de data centers verdes: **3,4 GW asegurados** y **5 GW pendientes**; ~**400 ha** de suelo negociadas.
- **Proyecto con Merlin: 225 MW de data center con PPA solar de 445 MW a 15 años.**
- Otro proyecto de 400 MW aprobado **en Italia**.
— DCD, 2025-11-21 — https://www.datacenterdynamics.com/es/noticias/solaria-se-transforma-invierte-2500-m-para-triplicar-su-capacidad-y-lanzar-una-plataforma-europea-de-data-centers-verdes/

Otras cifras en circulación: "1 GW de demanda consolidada para conectar data centers en España", "250 MW a los centros de datos españoles", "300 M€ captados". `[NO VERIFICADO]`

**⚠️ RIESGO DE DOBLE CONTEO EXTREMO:** los 3,4 GW "asegurados" de Solaria son **derechos de acceso a red / capacidad de generación**, no metros de sala IT. Si el mapa los trata como proyectos de CPD, duplicará capacidad que ya se cuenta bajo Merlin y otros. **No generar emplazamientos Solaria salvo que exista un CPD identificado con municipio.**

**Proyecto caído asociado:** un proyecto de ~500 M€ "único en Europa" que iba a crear cien empleos en **Puertollano (Ciudad Real)**, con Solaria y **Datasection**, aparece descrito como "en vía muerta" en enero de 2026. `[NO VERIFICADO — titular de Cadena SER no abierto]` → **verificar; es un candidato claro a "anuncio caído".**

### 4.14 Grupo Sesé, Ayesa, Elecnor, Sacyr

- **Grupo Sesé: hueco.** No se ha localizado ningún proyecto de centro de datos promovido por Grupo Sesé. Aparece en el ecosistema logístico aragonés, no en el directorio de CPD.
- **Elecnor:** tiene línea de negocio `Elecnor Data Centers` (https://www.elecnor.com/datacenters/home) pero **como contratista EPC**, no como promotor de activos propios en España. **No generar fichas.**
- **Sacyr: hueco.** Sin proyectos de CPD localizados.
- **Ayesa: hueco.** Sin proyectos de CPD propios localizados; su papel es de ingeniería/consultoría.

### 4.15 Adamo y Aire Networks

- **Adamo: hueco.** Sin data centers propios localizados en el directorio.
- **Grupo Aire:** operaba CPD en **Elche, Málaga, Zaragoza, Talavera de la Reina y Las Palmas** (Observatorio, todos sin MW). **Templus adquirió tres de sus data centers (Lisboa, Madrid y Valencia) en enero de 2026, sumando 6,5 MW.** — https://www.datacenterdynamics.com/en/news/templus-acquires-three-data-centers-from-grupo-aire-in-lisbon-madrid-and-valencia/ `[URL de resultado; contenido corroborado por Structure Research y Data Center Market, no abiertos]`
- **Ardian compró Aire Networks** (proveedor de fibra) `[NO VERIFICADO]`. **Ojo: `Grupo Aire`/`Aire Networks` no es lo mismo que `Aire Networks del Mediterráneo` en todos los contextos; verificar.**

**Alias:** `Grupo Aire (Madrid)` → `Templus`. `Grupo Aire (Valencia/Paterna)` → `Templus Paterna 4 MW`.
