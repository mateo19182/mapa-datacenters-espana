# Aragón — nota de investigación

Área: provincias de Zaragoza, Huesca y Teruel.
Fecha de trabajo: 2026-08-29. Todos los ficheros llevan `ultima_verificacion: "2026-08-29"`.

## Método

La columna vertebral del trabajo es el **Boletín Oficial de Aragón**, consultado a través
de su buscador de texto completo (endpoint `BRSCGI` con `BASE=BZHT` y `OUTPUTMODE=JSON`,
el mismo que usa la búsqueda avanzada de boa.aragon.es). Se recuperaron y revisaron
íntegramente los expedientes que contienen las frases `"centro de datos"`,
`"centros de datos"`, `"almacenamiento de datos"`, `"data center"`,
`"procesamiento de datos"` y los nombres de las promotoras. De ahí salen prácticamente
todos los datos duros: coordenadas UTM ETRS89 de las autorizaciones ambientales integradas
de INAGA, potencias, superficies, subestaciones, expedientes y fechas.

Se completó con las memorias de los Planes de Interés General publicadas en aragon.es
(PIGA Green It Aragón, Tillion Aragón, ACS DC La Puebla), con notas de AWS y con prensa
aragonesa cuando la fuente oficial no publica el dato (potencia de Microsoft).

Las coordenadas de nivel municipio proceden del Wikidata Query Service (propiedad P625) y
están marcadas como `precision: municipio`; nunca se ha inventado una posición.

## 1. Emplazamientos creados (25)

| Fichero | Operador / promotor | Municipio (prov.) | Estado | Potencia registrada |
|---|---|---|---|---|
| `aws-villanueva-de-gallego-vdg0` | AWS | Villanueva de Gállego (Z) | operativo | 110,4 MW grupos electrógenos (no especificado) |
| `aws-el-burgo-de-ebro-bde0` | AWS | El Burgo de Ebro (Z) | operativo | 110,4 / 107,5 MW grupos electrógenos |
| `aws-huesca-plhus` | AWS | Huesca (H) | operativo | 110,4 MW grupos electrógenos |
| `aws-villanueva-de-gallego-vdg1` | AWS | Villanueva de Gállego (Z) | permisos_concedidos | 327 MWt (térmica de generadores) |
| `aws-villanueva-de-gallego-vdg2` | AWS | Villanueva de Gállego (Z) | permisos_concedidos | 1.169,46 MWt |
| `aws-huesca-walqa-wqa` | AWS | Huesca (H) | permisos_concedidos | 342,08 MWt |
| `aws-el-burgo-de-ebro-bde` | AWS | El Burgo de Ebro (Z) | permisos_concedidos | 750,66 MWt |
| `aws-zaragoza-la-cartuja-car` | AWS | Zaragoza (Z) | en_tramitacion | sin dato |
| `aws-san-mateo-de-gallego-el-boyal` | AWS | San Mateo de Gállego (Z) | anunciado | sin dato |
| `aws-la-puebla-de-hijar-la-llanada` | AWS | La Puebla de Híjar + Azaila (T) | anunciado | 100 MW (prensa, tipo sin especificar) |
| `aws-huesca-plhus-sur` | AWS | Huesca (H) | anunciado | sin dato |
| `microsoft-la-muela-centrovia` | Microsoft | La Muela (Z) | en_tramitacion | 50 MW conexión (fase 1) / 300 MW objetivo |
| `microsoft-villamayor-de-gallego` | Microsoft | Villamayor de Gállego (Z) | en_tramitacion | 50 MW conexión / 300 MW objetivo |
| `microsoft-zaragoza-puerto-venecia` | Microsoft | Zaragoza (Z) | en_tramitacion | 50 MW conexión / 300 MW objetivo |
| `qts-calatorao-rhodes` | QTS / Blackstone (Calanza Inmuebles) | Calatorao (Z) | en_tramitacion | 650 MW de conexión (SE Rhodes) |
| `box2bit-epila-epilon` | Box2Bit (B2B Axis East 3) | Épila (Z) | anunciado | 150 MW conexión fase 1 / 520 MW total |
| `box2bit-carinena-ebro` | Box2Bit (B2B Axis East 3) | Cariñena (Z) | paralizado | sin dato |
| `acs-la-puebla-de-alfinden-centro-datos` | Grupo ACS | La Puebla de Alfindén (Z) | en_tramitacion | 150 MW conexión concedidos / 100 MW IT |
| `samca-luceni-ribera-alta-ebro` | SAMCA / Data Center Ribera Alta del Ebro | Luceni (Z) | en_tramitacion | 3 × 72 MW IT; 300 MW conexión; 125,5 MWe instalados por edificio |
| `tillion-villamayor-de-gallego` | Tillion Aragón (Grupo Azora) | Villamayor de Gállego (Z) | en_tramitacion | 300 MW (tipo sin especificar); 150 MW conexión asegurados |
| `vantage-villanueva-de-gallego-el-olivar` | Vantage Data Centers / Desarrollos Ecoindustriales La Cartuja | Villanueva de Gállego (Z) | en_tramitacion | 90 MW fase 1 (tipo sin especificar) |
| `merlin-botorrita-zaragoza-wind` | MERLIN Properties | Botorrita (Z) | anunciado | 144 MW IT |
| `forestalia-magallon-dcm-data` | Forestalia (Energía Inagotable de Kaysa) | Magallón (Z) | anunciado | 70 MW conexión; hasta 275 MW IT |
| `forestalia-botorrita-dcm-dedalo` | Forestalia (Dédalo Holdco Renovables) | Botorrita (Z) | anunciado | 81 MW conexión; hasta 275 MW IT |
| `forestalia-alfamen-dcm-blue` | Forestalia (Blue Holdco Renovables) | Alfamén (Z) | anunciado | 146,5 MW conexión; hasta 450 MW IT |

Reparto por provincia: **Zaragoza 21**, **Huesca 3**, **Teruel 1**.

### Cuidado con el doble conteo

- AWS tiene en Aragón **tres proyectos superpuestos en el tiempo** que las fuentes tratan
  por separado: la Región inicial (3 centros, 42,8 ha, aprobada en 2020), la "Expansión de
  la Región AWS en Aragón" (5 emplazamientos: VDG1, VDG2, WQA, BDE, CAR; 295,6 ha,
  declarada en 2024) y el "Plan para la consolidación de la Región AWS en Aragón" (3
  campus: Huesca, La Puebla de Híjar/Azaila y San Mateo de Gállego; 459 ha, declarado en
  2026). Suman 797,57 ha según el propio Gobierno de Aragón. Los tres centros existentes
  (VDG, BDE0, Huesca-PLHUS) son instalaciones distintas de los nuevos VDG1/VDG2, BDE y
  WQA, con expedientes INAGA y coordenadas propias. El BOA los distingue explícitamente
  ("el centro de datos existente BDE0", "el centro de datos existente VDG").
- En **Villanueva de Gállego** conviven cuatro emplazamientos distintos: el centro AWS
  existente, AWS VDG1, AWS VDG2 y el campus de Vantage en el sector S15 "El Olivar".
- En **Villamayor de Gállego** conviven el campus de Microsoft, el campus de Tillion
  Aragón, las dos estaciones de medida de AWS (San Mateo de Gállego) y la subestación
  remota 400/220 kV de ACS. Solo los dos primeros son emplazamientos de centro de datos.
- En **Botorrita** hay dos declaraciones distintas: "DCM Dédalo" (Forestalia, nov-2025) y
  "Zaragoza-WIND" (MERLIN, jul-2026). Se han registrado como emplazamientos separados; ver
  contradicciones.

## 2. Huecos

- **Ninguna fuente oficial publica MW IT para los centros de AWS en Aragón.** Las
  autorizaciones ambientales integradas de INAGA solo dan **potencia térmica nominal de
  los grupos electrógenos diésel** (327, 342,08, 750,66 y 1.169,46 MWt). Se han registrado
  como `no_especificado` con nota explícita. No se ha aplicado ningún PUE ni proporción.
- **Microsoft no publica potencia en el PIGA.** Los 50 MW por campus asegurados y los
  300 MW por planta de la segunda fase proceden solo de prensa (elDiario.es Aragón y El
  Español). El PIGA sí da superficies, longitudes de línea e inversión desglosada.
- **AWS Consolidación (Huesca, San Mateo de Gállego, La Puebla de Híjar/Azaila)**: el
  acuerdo de declaración no publica potencia por emplazamiento, solo un informe favorable
  de la Dirección General de Energía y Minas para la fase 1 de cada uno, condicionando las
  fases 2 de San Mateo y La Puebla a que exista capacidad eléctrica.
- **AWS Zaragoza-La Cartuja (CAR)**: no consta autorización ambiental integrada resuelta ni
  potencia. Su línea de 132 kV desde la SE Montetorrero quedó fuera de la aprobación
  definitiva por falta de definición técnica del trazado.
- **Coordenadas**: solo hay coordenadas exactas (UTM de INAGA) para los siete
  emplazamientos de AWS con AAI. Para los 17 restantes se han usado centroides municipales
  de Wikidata (`precision: municipio`), salvo `aws-huesca-plhus-sur`, para el que se ha
  dejado `precision: desconocida` porque la única referencia publicada es "adyacente por el
  sur con la PLHUS".
- **Rhodes (Calatorao)**: la autorización ambiental integrada (INAGA 500301/02/2025/08352)
  estaba en información pública en diciembre de 2025 y no se ha localizado la resolución.
  No consta carga TI del campus, solo la capacidad de la subestación.
- **Inversiones**: no consta importe para MERLIN-Botorrita, para los tres centros de
  Forestalia, para AWS Cariñena–consolidación por emplazamiento ni para AWS por
  emplazamiento individual (las cifras de AWS son agregadas de región).
- **Consumo de agua y refrigeración**: solo hay dato concreto para el centro AWS existente
  de Villanueva de Gállego (405 m³/día en verano), para VDG2/WQA (balsas de agua reciclada)
  y para ACS La Puebla (diseño sin consumo de agua). El resto queda vacío.

## 3. Contradicciones sin resolver

1. **Rhodes / Calatorao — 650 MW vs 300 MW.** El PIGA aprobado inicialmente dice que la
   subestación Rhodes proporcionará "hasta 650 MW de capacidad". Prensa especializada
   (DataCenterDynamics) tituló el proyecto como un campus de 300 MW. No se ha podido
   contrastar la fuente secundaria porque la publicación bloquea el acceso automatizado, de
   modo que **solo se ha registrado el valor oficial de 650 MW** y la discrepancia queda
   anotada en `incertidumbres`.
2. **Rhodes — inversión: 11.728 M€ vs 11.805.195.141 €.** El mismo documento del BOA da las
   dos cifras, en texto y en tabla. Se registra la de la tabla.
3. **AWS La Puebla de Híjar / Azaila — superficie.** El acuerdo da 328,59 ha totales y a la
   vez 317,7 ha + 19,9 ha = 337,6 ha. Además Hoy Aragón habla de una opción de compra sobre
   70 ha en el polígono Venta del Barro. Las tres cifras no son conciliables.
4. **Vantage / Villanueva de Gállego — tabla de inversión inconsistente.** La fila de
   totales del BOA dice 3.200 M€, pero los importes por fase (500 + 5.000 + 500 + 500 +
   1.200) suman 7.700 M€. Se registra el total publicado y se advierte del choque.
5. **Botorrita — ¿uno o dos proyectos?** "DCM Dédalo" (Forestalia, nudo María 220 kV,
   declarado 12/11/2025) y "Campus de Centros de Datos Zaragoza-WIND" (MERLIN, polígono
   industrial San Antonio, declarado 22/07/2026, con dos subestaciones 220/132 kV). Las
   fuentes disponibles no permiten saber si comparten emplazamiento o punto de conexión, ni
   si uno sustituye al otro. Registrados por separado con la incertidumbre documentada.
6. **AWS Huesca — dirección.** La AAI de 2020 sitúa el centro en "C/ Lienas" de la PLHUS;
   el anuncio de INAGA de 2025 en "Ronda de Valdabra, 23". Se conservan las dos.
7. **AWS El Burgo de Ebro (BDE0) — potencia de generadores.** 110,4 MWe / 294,4 MWt en la
   AAI de 2020 frente a 107,5 MWe / 291,1 MWt en la modificación de octubre de 2025. Ambos
   valores registrados.
8. **AWS VDG1 — parque industrial.** La AAI lo sitúa en el "Parque Industrial Aeronáutico"
   mientras que el análisis urbanístico del mismo acuerdo aplica las normas del Plan Parcial
   del Polígono de Industrias Tecnológicas de la Información (PITI).
9. **Microsoft — superficie total y fibra.** El BOA da 146,12 + 80,67 + 55,27 = 282,06 ha,
   179 km de canalizaciones y 243 km de fibra; las notas de prensa hablan de 283,79/284 ha,
   187 km de conductos y 240 km de fibra. Se han registrado las superficies del BOA por
   emplazamiento.

## 4. Proyectos descartados y por qué

- **«Ampliación para Data Center de Eurocontainer» (Remolinos, Zaragoza)** — declarado
  inversión de interés autonómico el 9 de abril de 2025 (ORDEN PEJ/415/2025). Pese al
  nombre, **no es un centro de datos**: es la centralización de la fábrica de Carrocerías
  Vicente Salomón Sanz S.L. ("Eurocontainer"), que ha abierto una línea de productos de
  "unidades de soporte de emergencia para centros de datos" y módulos para inversores.
  Descartado por no ser una instalación de proceso de datos.
- **«Parque tecnológico distrito aragonés tecnológico-Alierta (DAT_Alierta)» (Zaragoza)** —
  declarado el 30 de julio de 2025 a instancia del Instituto Aragonés de Fomento. Es un
  parque tecnológico-empresarial, no un CPD. Descartado.
- **Desarrollo del Sector SUZ 90/1 del PGOU de Zaragoza (extensión de PLAZA)** — declarado
  el 25 de febrero de 2026 a instancia de la Junta Gestora del área. Es un polo logístico e
  industrial de casi 89 ha calificado como industrial-terciario; el acuerdo no menciona
  centros de datos. Descartado por falta de evidencia de uso CPD.
- **Centro Logístico Agroalimentario del Valle del Ebro «Clave» (Villanueva de Gállego)** —
  PIGA aprobado inicialmente en junio de 2025; es logística agroalimentaria. Descartado.
- **Sesé, Ubiquity y otros promotores logísticos** — no se ha encontrado ninguna
  declaración de interés autonómico, PIGA, expediente INAGA ni autorización de instalación
  eléctrica que vincule a estas empresas con un centro de datos en Aragón. Descartados por
  falta absoluta de evidencia documental.
- **Teruel: Andorra y los nudos de transición justa** — no existe en el BOA ningún
  expediente de centro de datos en Andorra ni en el entorno del Nudo Mudéjar. Lo único
  documentado en la provincia es el campus de AWS en La Puebla de Híjar y Azaila. La
  petición de Teruel Existe para que AWS ubique una fábrica de servidores en Andorra es una
  propuesta política, no un proyecto en tramitación. Descartado.
- **Ejea de los Caballeros, Fraga, Calatayud, plataformas PLHUS/PLAZA/Fraga como sedes de
  nuevos CPD** — las búsquedas en el BOA solo devuelven estos topónimos dentro de listados
  administrativos de otros expedientes. No hay proyecto de centro de datos identificable.
  Descartados. (La PLHUS sí acoge el centro AWS existente y el nuevo ámbito de la
  consolidación, ya registrados.)
- **«Box2Bit / Aragón Digital Hub» en PLAZA** — no se ha localizado ninguna fuente que
  documente un proyecto de Box2Bit en la Plataforma Logística de Zaragoza. Los dos únicos
  proyectos documentados de la promotora en Aragón son Cariñena (paralizado) y Épila.

## 5. Cobertura estimada

- **Alta (≈95 %) para proyectos con tramitación administrativa autonómica.** Cualquier
  centro de datos de escala relevante en Aragón necesita, o bien una declaración de
  inversión de interés autonómico, o bien un PIGA, o bien una autorización ambiental
  integrada de INAGA, y las tres cosas se publican en el BOA. La búsqueda de texto completo
  sobre el BOA cubre ese universo. Los 25 emplazamientos registrados agotan lo que el BOA
  documenta a 29 de agosto de 2026.
- **Baja para CPD pequeños y corporativos.** Quedan fuera los centros de proceso de datos
  urbanos y corporativos de Zaragoza (operadores de colocation menores, CPD del Gobierno de
  Aragón, universidades, banca), que no requieren PIGA ni AAI y por tanto no aparecen en las
  fuentes explotadas. Es un hueco reconocido: este trabajo cubre el cluster hiperescalar y
  mayorista, no el tejido de CPD tradicional.
- **Calidad del dato de potencia: desigual.** Es sólida y tipada para ACS La Puebla
  (150 MW conexión / 100 MW IT), SAMCA Luceni (72 MW IT por edificio / 300 MW de red),
  MERLIN Botorrita (144 MW IT), Box2Bit Épila (150/520 MW de conexión), Forestalia
  (70/81/146,5 MW de conexión) y Rhodes (650 MW de conexión). Es inexistente o solo térmica
  para todo AWS, y solo periodística para Microsoft.
- **Calidad del dato de ubicación: buena en AWS, municipal en el resto.** Siete
  emplazamientos con coordenadas de expediente ambiental; el resto a nivel de municipio.
