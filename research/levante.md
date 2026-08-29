# Levante — Comunitat Valenciana y Región de Murcia

Investigación documental cerrada el **2026-08-29**. Todos los ficheros creados llevan
`ultima_verificacion: "2026-08-29"`.

## 1. Emplazamientos creados

22 ficheros en `data/sites/`.

| id | Emplazamiento | Municipio (prov.) | Estado | Potencia registrada | Confianza |
|---|---|---|---|---|---|
| `nxn-valencia-vara-de-quart-nx01` | NxN Nx01 — Vara de Quart | València (V) | en_construccion | 5 MW `no_especificado` | media |
| `digital-valley-picassent` | Digital Valley Comunitat Valenciana | Picassent (V) | en_tramitacion | 200 MW `no_especificado`; 150 MW `conexion_red` solicitados (fase 1) | media |
| `vdpc-sagunto-barracuda` | Estación de aterraje Barracuda + data center | Sagunt (V) | anunciado | 10 MW pico `no_especificado` | media |
| `valencia-docks-marina-data-center` | Data center de los Docks, Marina de València | València (V) | cancelado | 16 MW `conexion_red` | media |
| `macro-cpd-catadau-conexion-denegada` | Macro CPD del nudo de Catadau | Catadau (V) | cancelado | 25 MW `conexion_red` solicitados y denegados | baja |
| `kumo-paterna-tactica` | Kumo Networks (El Corte Inglés) — P.E. Táctica | Paterna (V) | operativo | 2,4 MW `instalada_total`; 1 MW `it` | media |
| `templus-paterna-parque-tecnologico` | Templus VAL01 (ex Grupo Aire) | Paterna (V) | ampliacion_en_construccion | 1 MW actual → 4 MW objetivo, `no_especificado` | media |
| `nunsys-paterna-parque-tecnologico` | Nunsys Cloud — Parc Tecnològic | Paterna (V) | operativo | sin dato | media |
| `nixval-paterna-fuente-del-jarro` | Nixval — Fuente del Jarro | Paterna (V) | operativo | sin dato | baja |
| `plexval-paterna-ciudad-de-sevilla` | Plexval (Axarnet) | Paterna (V) | operativo | sin dato | baja |
| `exa-riba-roja-de-turia` | EXA Edge DC Valencia | Riba-roja de Túria (V) | operativo | sin dato | baja |
| `islalink-valencia-fsl` | IslaLink FSL (BalaLink) | València (V) | operativo | sin dato | baja |
| `ungsc-quart-de-poblet-unictf` | UNGSC — Base de Valencia (UNICTF) | Quart de Poblet (V) | operativo | sin dato | baja |
| `walhalla-castellon-espaitec` | Walhalla Cloud — Espaitec, UJI | Castelló de la Plana (CS) | operativo | 2 MW `no_especificado` | media |
| `grupo-aire-elche-oasix` | Grupo Aire / OASIX «Alicante» | Elx (A) | operativo | sin dato | media |
| `preval-monforte-del-cid-el-lobo` | Data Center El Lobo (Valfortec / Preval Renewable 2) | Monforte del Cid (A) | en_tramitacion | 30 MW total y 10 MW fase 1 `no_especificado`; además 60 MW discrepantes | media |
| `novagrid-elche-parque-empresarial-e49` | Novagrid Hub — sector E-49, Torrellano | Elx (A) | anunciado | sin dato | baja |
| `vdpc-alicante-puerto-cls` | CLS del puerto de Alicante (abandonado) | Alacant (A) | cancelado | 1,5 MW `no_especificado` | baja |
| `fotones-murcia-espinardo-casiopeia` | Casiopeia — Grupo Fotones | Murcia (MU) | anunciado | 140 MW total, 78 + 62 MW por fases, `no_especificado` | media |
| `kumo-murcia-espinardo` | Kumo Networks (ex KIO) — Espinardo | Murcia (MU) | operativo | 0,193 MW `no_especificado` | media |
| `cartagena-data-green-escombreras` | Cartagena Data Green — Valle de Escombreras | Cartagena (MU) | anunciado | sin dato | baja |
| `sys4net-alcantarilla-magalia` | SYS4NET Datacenter — P.E. Magalia | Alcantarilla (MU) | operativo | sin dato | baja |

Reparto por provincia: Valencia 13, Alicante 4, Castellón 1, Murcia 4.
Reparto por estado: operativo 11, anunciado 4, en_tramitación 2, en_construcción 1,
ampliación_en_construcción 1, cancelado 3.

Coordenadas: 7 con `precision: exacta` (todas procedentes de dirección publicada por el
operador y/o de la ficha de PeeringDB), 8 `aproximada`, 6 `municipio`, 1 `desconocida`.

## 2. Huecos

- **Fuentes oficiales inaccesibles.** No se ha podido consultar ni el **DOGV** ni el
  **BORM**: ambos publican sus buscadores como aplicaciones JavaScript sin endpoint
  navegable, y los buscadores web generalistas (Google, Bing, DuckDuckGo, Startpage,
  Brave, instancias SearXNG) devolvieron captcha o 403 durante toda la sesión. En
  consecuencia **ningún fichero cita una DIA, una autorización de instalación eléctrica ni
  un anuncio de información pública**. Es el hueco más grave del lote y el primer trabajo a
  repetir cuando se disponga de acceso a los boletines.
- **Potencias sin tipo.** Salvo en `kumo-paterna-tactica` (2,4 MW instalados / 1 MW de
  servidores) y en los tres casos de potencia de acceso (`digital-valley-picassent`,
  `macro-cpd-catadau-conexion-denegada`, `valencia-docks-marina-data-center`), **ninguna
  fuente distingue MW IT de MW de conexión**. Todo lo demás queda como
  `no_especificado`. No se ha aplicado ningún PUE ni proporción.
- **Sin potencia alguna:** Nunsys Paterna, Nixval, Plexval, EXA Riba-roja, IslaLink,
  UNGSC Quart de Poblet, Grupo Aire Elche, Novagrid Elche, Cartagena Data Green y
  SYS4NET Alcantarilla.
- **Conexión eléctrica.** Solo hay `conexion_electrica` documentada en cuatro fichas
  (Picassent, Catadau, Casiopeia, Novagrid). No se ha localizado el punto de conexión, ni
  solicitado ni concedido, de Nx01, El Lobo, Barracuda-Sagunto ni de ninguna instalación
  operativa.
- **Emplazamiento sin cerrar.** Casiopeia (dos parcelas alternativas en Espinardo) y
  Barracuda-Sagunto (sin parcela publicada) quedan a nivel de municipio.
- **Castellón está prácticamente vacío.** Un solo emplazamiento en toda la provincia.
- **Refrigeración y agua.** Solo hay descripción cualitativa; ningún dato de consumo
  hídrico en ningún proyecto, ni siquiera en Picassent, donde es el eje de la contestación
  vecinal.

## 3. Contradicciones sin resolver

Todas registradas en el `incertidumbres[]` del fichero correspondiente.

1. **El Lobo (Monforte del Cid) — capacidad.** Tres cifras en cinco días:
   30 MW totales en tres fases con 10 MW en la primera (elEconomista 03/07/2026 e
   Información 04/07/2026, ambos sobre la memoria); «capacidad inicial de 10 MW ampliable»
   (Castellón Plaza 06/07/2026); y «capacidad aproximada de 60 MW» (DCD 07/07/2026). Los
   tres valores están en `potencia[]`; el de 60 MW lleva nota de discrepancia.
2. **El Lobo — inversión.** 302 M€ (elEconomista, Información) frente a «entre 350 y 500
   millones» (Castellón Plaza citando la memoria). Se registra 302 M€, que es la cifra con
   desglose por fases (182 M€ + 120 M€).
3. **Digital Valley (Picassent) — inversión.** 2.200 M€ en el anuncio oficial y en DCD
   frente a 2.300 M€ en Las Provincias (feb-2026). Se registra 2.200 M€.
4. **Casiopeia — coste de la subestación.** 15 M€ según DCD, 20 M€ según Murcia Plaza,
   ambos el mismo día (03/06/2026). Coinciden en los >5 M€ de avales.
5. **Docks de la Marina — inversión.** 241 M€ (anuncio de Ximo Puig, 2021), 97 M€ (oferta
   inicial de Nethits, jul-2022) y 45/43/37 M€ (las tres ofertas del concurso de 2023). No
   se registra ninguna cifra en `inversion_anunciada_eur`.
6. **Murcia — potencia IT instalada.** Spain DC atribuye 1 MW IT a la Región al cierre de
   2025, mientras que la única instalación comercial documentada (Kumo Espinardo) se
   describe con 193 kW. No se ha localizado la conciliación.
7. **Nx01 — fecha de apertura.** «marzo de 2027» (Levante-EMV) frente a «primer semestre
   de 2027» (Economía 3).

## 4. Proyectos descartados y por qué

- **Parc Sagunt I y II.** Revisado expresamente: el suelo se ha adjudicado a la
  gigafactoría de PowerCo, a la plataforma logística de Inditex/Tempe y a proyectos
  industriales y logísticos. **No se ha encontrado ningún centro de datos en Parc Sagunt.**
  El proyecto de data center de Sagunto (Barracuda) es de Valencia Digital Port Connect y
  no consta que se ubique dentro del parque, por lo que su ficha se deja a nivel municipal.
- **Mediterra DataCenters.** Anunció (11/04/2026) cinco ciudades españolas para 2028, pero
  solo ha desvelado Madrid y Barcelona. Sin evidencia de emplazamiento en el ámbito de este
  informe: descartado.
- **Hyperscalers.** No se ha localizado **ningún** anuncio de AWS, Microsoft, Google, Meta
  u Oracle en la Comunitat Valenciana ni en la Región de Murcia. Descartado por ausencia de
  fuente.
- **Merlin Properties, Nabiax, Global Switch, Grupo Vareser.** Buscados uno a uno. Merlin
  opera en Getafe, Zona Franca, Arasur, Lisboa y ha anunciado Extremadura y Aragón; Nabiax
  mantiene Alcalá, Julián Camarillo y Terrassa. Ninguno tiene activo ni proyecto documentado
  en el ámbito. Vareser aparece en obra civil, no en centros de datos. Descartados.
- **«Espacio Dato» (Cartagena).** Centro tecnológico municipal de 1,7 M€ en el antiguo
  Mercado Gisbert para pruebas de IA y ciberseguridad. **No es un centro de datos**:
  descartado.
- **Quantix (El Esparragal / Parque Empresarial Murcia Norte).** Centro de microchips
  ciberseguros, no un CPD. Descartado.
- **EDICOM (Paterna), Renfe València, DataRush IT, Sologigabit, Access Basic Server
  (Alicante), IUKANET (Alfafar), CPD Titan (Murcia), Consorcio de Telecomunicaciones
  Avanzada (Alcantarilla).** Instalaciones pequeñas o de tipo on-premise que aparecen en
  directorios (Observatorio EDC, PeeringDB) sin ningún dato de potencia, superficie, estado
  ni fecha, y sin cobertura periodística verificable. Se han dejado fuera para no inflar el
  mapa con registros vacíos. Son candidatas a entrar si aparece documentación.
- **Sungrow (la Vall d'Uixó, 150 M€) y Picassent BESS (107,91 MW / 215,8 MWh, Sargao
  Energy).** Almacenamiento con baterías, no centros de datos. El BESS de Picassent es
  relevante como contexto del cluster pero corresponde a `data/renovables/`, no a este lote.
- **Solicitudes de conexión de El Palmeral y Betxí (primer trimestre de 2026).** Red
  Eléctrica rechazó seis peticiones por 132,5 MW en la Comunitat Valenciana; Alicante Plaza
  precisa que «todas las solicitudes menos una son relativas a proyectos de almacenamiento
  energético». La única que no lo es coincide con los 25 MW de Catadau, ya fichada. Las
  demás no se registran como centros de datos.

## 5. Cobertura estimada

- **Instalaciones en operación.** Alta para la Comunitat Valenciana. El directorio del
  Observatorio Español de Data Centers lista 15 instalaciones en la comunidad y 3 en Murcia;
  este lote recoge todas las que tienen documentación aprovechable y descarta el resto de
  forma explícita. Con PeeringDB se ha cubierto además Alcantarilla, que el Observatorio no
  registra.
- **Proyectos anunciados.** Alta para los de gran escala: Picassent, Casiopeia, El Lobo,
  Barracuda-Sagunto, Cartagena Data Green y Novagrid están todos fichados, igual que los
  tres proyectos caídos (Docks, CLS de Alicante, Catadau). El riesgo de omisión se
  concentra en proyectos que solo existan como expediente administrativo sin cobertura de
  prensa — precisamente el hueco de DOGV/BORM.
- **Datos de potencia.** Baja. Solo 11 de 22 fichas tienen alguna cifra y solo una
  distingue carga TI.
- **Relación con la red eléctrica.** Baja-media. Hay buen material cualitativo (saturación
  de nudos, retraso medio de 8,8 años en las subestaciones planificadas en la Comunitat
  Valenciana según el estudio de PwC para aelēc, subestación Saguntum de 220 kV, eje
  Morella-La Plana de 400 kV, repotenciación del eje Catadau-Torrent), pero casi ningún
  emplazamiento tiene su punto de conexión identificado.
- **Castellón.** Cobertura pobre en términos absolutos, pero se corresponde con la
  realidad: pese a la potencia liberada por la crisis cerámica, no se ha encontrado ningún
  proyecto de centro de datos en la provincia. La promotora castellonense que sí ha entrado
  en el sector (Valfortec) ha llevado su proyecto a Alicante.

### Nota de método

Las búsquedas web directas se agotaron a mitad de la sesión (200/200). El resto de la
investigación se hizo con búsquedas en Google News RSS resolviendo las URL reales de los
editores y descargando cada página; todas las URL citadas en los YAML se han abierto y
leído. Las páginas protegidas por Cloudflare (DatacenterDynamics, elEconomista) se leyeron
a través de un proxy de extracción de texto. Los directorios comerciales datacentermap.com
y datacenters.com devolvieron 429 durante toda la sesión y no se han utilizado.
