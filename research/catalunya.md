# Cataluña — notas de investigación

**Fecha de trabajo:** 2026-08-29
**Ámbito:** provincias de Barcelona, Girona, Lleida y Tarragona.
**Resultado:** 32 emplazamientos en `data/sites/`.

Todos los ficheros llevan `ultima_verificacion: "2026-08-29"`. Ninguna cifra de
potencia se ha convertido entre tipos: cuando la fuente dice «MW» sin decir de
qué, el registro usa `tipo: no_especificado`.

## 1. Emplazamientos creados

| id | operador / promotor | municipio | provincia | estado | potencia registrada | confianza |
|---|---|---|---|---|---|---|
| `adam-barcelona-travessera` | Adam | Barcelona | Barcelona | `operativo` | 1,5 MW (no_especificado, edificio) | media |
| `adam-cerdanyola-parc-alba` | Adam | Cerdanyola del Vallès | Barcelona | `en_construccion` | 8 MW (edificio); 4 MW (fase) | media |
| `adam-cerdanyola-ptv` | Adam | Cerdanyola del Vallès | Barcelona | `operativo` | 4 MW (edificio) | media |
| `aq-compute-cerdanyola-parc-alba` | AQ Compute | Cerdanyola del Vallès | Barcelona | `en_construccion` | 60 MW (campus); 15 MW (fase) | baja |
| `ark-barcelona-la-maquinista` | Ark Data Centres | Barcelona | Barcelona | `anunciado` | — | baja |
| `atlasedge-sant-adria-barcelona2` | AtlasEdge | Sant Adrià de Besòs | Barcelona | `en_construccion` | 10 MW (edificio) | baja |
| `barcelona-cls-sant-adria` | AFR-IX telecom | Sant Adrià de Besòs | Barcelona | `operativo` | — | media |
| `bsc-barcelona-marenostrum` | Barcelona Supercomputing Center | Barcelona | Barcelona | `operativo` | — | media |
| `csuc-barcelona-campus-nord` | CSUC | Barcelona | Barcelona | `operativo` | — | media |
| `digital-realty-sant-adria-bcn1` | Digital Realty | Sant Adrià de Besòs | Barcelona | `operativo` | 14 MW; 20 MW (2ª fase) | alta |
| `edgeconnex-sant-boi-bcn01` | EdgeConneX | Sant Boi de Llobregat | Barcelona | `operativo` | 8,4 MW (edificio) | media |
| `equinix-barcelona-ba1` | Equinix | Barcelona | Barcelona | `operativo` | — | media |
| `equinix-hospitalet-ba2` | Equinix | L'Hospitalet de Llobregat | Barcelona | `operativo` | 3,41 MW (edificio) | media |
| `exa-cerdanyola-edge` | EXA Infrastructure | Cerdanyola del Vallès | Barcelona | `operativo` | — | baja |
| `gigafactoria-ia-mora-la-nova-tivissa` | candidatura InvestAI (Telefónica/SETT y otros) | Móra la Nova | Tarragona | `en_tramitacion` | 55 MW; 125 MW; 150 MW | media |
| `gtr-cerdanyola-parc-alba` | Global Technical Realty | Cerdanyola del Vallès | Barcelona | `anunciado` | — | baja |
| `hscale-cerdanyola-parc-alba` | hscale (Bain Capital / Aquila) | Cerdanyola del Vallès | Barcelona | `en_construccion` | — | baja |
| `itnow-cerdanyola-cd2` | ITnow ('la Caixa' / Kyndryl) | Cerdanyola del Vallès | Barcelona | `operativo` | — | baja |
| `itnow-cerdanyola-parc-alba` | ITnow ('la Caixa' / Kyndryl) | Cerdanyola del Vallès | Barcelona | `operativo` | — | baja |
| `lumen-hospitalet-bcn1` | Lumen Technologies | L'Hospitalet de Llobregat | Barcelona | `operativo` | — | baja |
| `mediterra-montmelo` | Mediterra DataCenters (DWS) | Montmeló | Barcelona | `en_construccion` | — | baja |
| `merlin-barcelona-zona-franca` | MERLIN Edged (cliente ancla CoreWeave) | Barcelona | Barcelona | `operativo` | 15 MW; 22 MW (instalada_total) | alta |
| `nabiax-terrassa` | Nabiax (Aermont) | Terrassa | Barcelona | `operativo` | 1,3 MW IT; 1,8 MW IT | media |
| `oxigen-sant-cugat` | Oxigen Data Center | Sant Cugat del Vallès | Barcelona | `operativo` | — | baja |
| `panattoni-cerdanyola-parc-alba` | Panattoni | Cerdanyola del Vallès | Barcelona | `en_construccion` | 88 MW instalada_total; 42 + 46 MW por fases | media |
| `quetta-molins-de-rei` | Quetta Data Centers (Azora) | Molins de Rei | Barcelona | `en_construccion` | 30 MW (agregado Madrid+BCN) | baja |
| `renta-corporacion-hospitalet` | Renta Corporación | L'Hospitalet de Llobregat | Barcelona | `anunciado` | — | baja |
| `rubix-submer-flix` | Rubix Data Centers (Submer) | Flix | Tarragona | `anunciado` | 20 MW (fase); ~70 MW (complejo Ercros) | media |
| `serosense-alcarras` | Eléctrica Serosense (Visalia) | Alcarràs | Lleida | `en_tramitacion` | 10 MW; 30 MW ampliable | media |
| `t-systems-cerdanyola` | T-Systems Iberia | Cerdanyola del Vallès | Barcelona | `operativo` | — | baja |
| `templus-barcelona-bcn02` | Templus (ex Colt / AtlasEdge) | Barcelona | Barcelona | `operativo` | 4 MW (edificio) | media |
| `templus-hospitalet-bcn01` | Templus (ex Cellnex) | L'Hospitalet de Llobregat | Barcelona | `operativo` | 1,7 → 6 MW | media |

Reparto por provincia: Barcelona 29, Tarragona 2, Lleida 1, Girona 0.

### Clústeres identificados

- **Zona Franca / L'Hospitalet (Carrer de l'Acer y Parc Logístic).** Equinix BA1,
  Templus BCN02 (el antiguo «Barcelona Steel» de Colt, luego AtlasEdge), Templus
  BCN01, MERLIN Edged/CoreWeave, Lumen, Equinix BA2. Es el núcleo histórico de
  colocation de Barcelona.
- **Sant Adrià de Besòs / Tres Xemeneies.** Barcelona Cable Landing Station
  (AFR-IX), Digital Realty BCN1 en la antigua fábrica de Henkel y el proyecto
  AtlasEdge Barcelona 2 en la misma calle Ramon Viñas. Es el nudo donde la
  llegada de cables submarinos (2Africa, Medusa) y el CPD se tocan físicamente.
- **Parc de l'Alba / Centre Direccional de Cerdanyola.** Es, con diferencia, el
  polo con más proyecto acumulado: Panattoni (88 MW instalados previstos), AQ
  Compute (60 MW), hscale, GTR, Adam, ITnow/Kyndryl, T-Systems, EXA.
- **Terres de l'Ebre.** Gigafactoria de IA de Móra la Nova/Tivissa y el centro de
  Rubix/Submer en los terrenos de Ercros en Flix, ambos ligados a la
  reindustrialización tras el cierre nuclear y químico.

### Marco de la Generalitat (contexto, no emplazamiento)

En abril de 2026 el Govern anunció haber identificado **26 iniciativas privadas**
que sumarían **cerca de 2.000 MW**, y fijó **siete polos** de implantación: Parc
de l'Alba, Sant Adrià del Besòs–Barcelonès, Metropolità Sud, Tarragona, Lleida,
Anoia y Terres de l'Ebre. El reparto por comarcas más citado es Vallès Occidental
(7 proyectos), Barcelonès (5) y Anoia (4). DCD cifra la capacidad operativa
actual en 33 MW y la proyectada a 2030 en 148 MW; Ara habla de «más de quince
centros de datos de entre 1 y 16 MW». Fuentes abiertas y verificadas:
`https://en.ara.cat/economy/the-government-establishes-seven-poles-for-installing-data-centers-in-catalonia_1_5707348.html`
y
`https://www.cadenadesuministro.es/inmologistica/cataluna-identifica-26-proyectos-centros-datos-podrian-implantarse-en-region_1515458_102.html`.
Estas cifras agregadas **no** se han cargado en ningún fichero de emplazamiento.

## 2. Huecos

1. **Girona: cero emplazamientos.** No se ha localizado ningún centro de datos ni
   proyecto en la provincia (ni en Figueres, ni en la frontera, ni asociado a
   cables terrestres hacia Francia). Puede ser un hueco real del mercado o un
   hueco de la investigación; no se ha podido cerrar.
2. **Tarragona provincia, salvo Terres de l'Ebre.** El Govern lista «Tarragona»
   como polo, pero no se ha localizado ningún proyecto concreto en Reus,
   Constantí ni en los polígonos petroquímicos. Los dos registros de Tarragona
   (Flix y Móra la Nova) están en Ribera d'Ebre.
3. **Santa Bàrbara (Montsià).** CGT y Ecologistes en Acció citan un «megacentro»
   en Santa Bàrbara junto al de Flix, pero no dan promotor, potencia ni parcela.
   Sin datos suficientes para abrir ficha.
4. **Anoia (Òdena y Jorba).** Hay cuatro proyectos identificados por el Govern y
   una promoción llamada «D-Hub Òdena» en el sector Ca Morera. No se ha podido
   abrir ninguna fuente utilizable: `d-hubodena.cat` tiene el certificado TLS
   caducado y las cabeceras comarcales (`veuanoia.cat`) devuelven 403. Queda como
   el hueco más grande y más accionable.
5. **DOGC, ponencies ambientals y autorizaciones de instalaciones eléctricas.**
   No se ha conseguido abrir ningún expediente. `govern.cat` devuelve 403 a
   `WebFetch` en todas sus rutas. En consecuencia **ningún** fichero tiene
   `conexion_electrica` con subestación, tensión o MW concedidos, salvo la
   subestación dels Aubals en el caso de Móra la Nova (citada por prensa, no por
   expediente). Este es el hueco cualitativamente más serio: no hay ni un solo
   dato de red eléctrica de fuente administrativa.
6. **Potencias no publicadas.** Doce de los 32 emplazamientos no tienen ninguna
   cifra de potencia porque nadie la publica (Equinix BA1, CLS, BSC, CSUC, EXA,
   ITnow ×2, T-Systems, Lumen, hscale, GTR, Ark, Renta, Oxigen). Baxtel las
   guarda tras muro de pago; no se ha estimado ninguna.
7. **MareNostrum 5.** No hay consumo eléctrico publicado del sistema actual. Las
   cifras de 1,3 MW que circulan son de MareNostrum 4 y no se han registrado.
8. **Proyectos paralizados o denegados.** No se ha localizado **ninguno** en
   Cataluña. Ver sección 4.
9. **Presupuesto de búsqueda agotado.** La sesión consumió las 200 consultas de
   `WebSearch` disponibles. El tramo final se trabajó solo con `WebFetch` sobre
   URLs ya conocidas, lo que sesga la cobertura hacia lo ya indexado y explica
   parte de los huecos 1–4.

## 3. Contradicciones sin resolver

Todas están documentadas en `incertidumbres[]` del fichero correspondiente.

| emplazamiento | contradicción |
|---|---|
| `merlin-barcelona-zona-franca` | Tres cifras conviven: 15 MW («potencia» en la nota de MERLIN), 22 MW («capacidad eléctrica total», Metrópoli Abierta) y 24 MW en la fase de anuncio del proyecto. No se sabe cuáles son MW TI. Además, la dirección oficial es «Calle 25, nº6» y PeeringDB registra «Av. Parc Logístic, 42» a ~100 m. |
| `merlin-barcelona-zona-franca` | Baxtel afirma que Meta arrendó en 2024 un centro de Merlin en la Zona Franca («Plaza Alpha»), mientras que la inauguración de 2025 presenta a CoreWeave como cliente ancla con el 68% de la capacidad. No se ha podido determinar si son el mismo edificio, dos edificios del mismo promotor o un error del directorio. **No se ha creado ficha para «Meta Plaza Alpha».** |
| `equinix-hospitalet-ba2` | Equinix y ACCIÓ describen BA2 como contiguo a BA1 «formando un campus», pero las coordenadas de PeeringDB los separan ~3,2 km y en municipios distintos (Barcelona 08038 vs. CP 08907, L'Hospitalet). PeeringDB además etiqueta BA2 como «Barcelona» pese al código postal. |
| `digital-realty-sant-adria-bcn1` | Dirección: «calle d'Ifni, 26» (Metrópoli Abierta) vs. «Av. del Maresme, 43» (Baxtel), ambas en Sant Adrià. Fecha: apertura anunciada «a finales de marzo de 2026» en septiembre de 2025 y comunicada finalmente el 18 de mayo de 2026. |
| `edgeconnex-sant-boi-bcn01` | Municipio: Sant Boi (PeeringDB) vs. Viladecans (Inflect y notas de prensa). Superficie: 3.000 m² (compañía) vs. 7.600 m² (ingeniería). Potencia: 8,4 MW (compañía) vs. 2 MW y 3,4 MW en directorios. |
| `templus-hospitalet-bcn01` / `templus-barcelona-bcn02` | Data Center Market sitúa los dos edificios del campus en L'Hospitalet; DCD y otras cabeceras en la Zona Franca de Barcelona; PeeringDB los reparte entre ambos municipios. La atribución de 6 MW y 4 MW a cada edificio se apoya en identificar el activo de AtlasEdge con el antiguo «Colt Barcelona / Barcelona Steel» de Carrer de l'Acer, no en una fuente que lo diga explícitamente. |
| `templus-barcelona-bcn02` | La ficha de Colt de 2019 anuncia «6MVA». Es potencia aparente, no MW; **no se ha convertido** y no figura en `potencia[]`. |
| `adam-cerdanyola-parc-alba` | Fase 1: 5 MW (web de Adam) vs. 4 MW (Data Center Market). Ubicación: Parc de l'Alba (compañía y prensa) vs. Carrer dels Artesans, PTV (Baxtel). |
| `gigafactoria-ia-mora-la-nova-tivissa` | Potencia: 55 MW inicial / 125 MW ampliable (Canal 21 Ebre) vs. 54 MW iniciales con 34 MW disponibles (notas del Govern) vs. 150 MW (CGT y Ecologistes en Acció). Inversión: 719 M€ (aportación estatal) vs. «más de 4.000 M€» (La Directa) vs. 5.000 M€ (CGT). Agua: «consumo casi nulo» en la documentación del proyecto vs. 1,3 hm³/año según La Directa. Accionariado: Telefónica+SETT+ACS+MasOrange+Nvidia+Submer+Multiverse (El Crític) vs. 48% Estado / 1% Generalitat / 51% privado con Banco Santander (CGT). |
| `rubix-submer-flix` | Inversión: «más de 1.000 M€» (Ajuntament de Flix, Ara) vs. 1.500 M€ (Crónica Global). Potencia: la fuente da «más de 20 MW inmediatos» y «20 MW más» sin totalizar; circulan además 50 MW para la fase 1 y 85–90 MW instalados que no se han podido confirmar y **no se han registrado**. Puesta en servicio: finales de 2027 (Ara) vs. fase 1 en dos años desde julio de 2026 (Ajuntament). |
| `quetta-molins-de-rei` | Azora solo publica el agregado de 30 MW (Madrid + Barcelona). La prensa atribuye 10 MW a Molins de Rei. **No se ha registrado la cifra individual** para no obtenerla por resta. |
| `itnow-cerdanyola-parc-alba` | Baxtel lista además «Kyndryl: Barcelona» en el Parc de l'Alba (parcela PC10601). Como Kyndryl es copropietaria de ITnow, es probable que sea el mismo emplazamiento; **no se ha creado ficha separada** para evitar doble conteo. |
| `itnow-cerdanyola-cd2` / `t-systems-cerdanyola` | Ambos se sitúan en Camí Ral, Centre Direccional de Cerdanyola. No se ha podido descartar que sean edificios contiguos del mismo complejo. Ninguno tiene potencia registrada, así que la duplicidad no afecta a ningún agregado. |

## 4. Proyectos descartados y por qué

- **«Meta — Plaza Alpha» (Zona Franca, Barcelona).** Solo lo lista Baxtel, y su
  descripción («Meta arrendó en 2024 este centro a Merlin Properties, desarrollado
  con Edged Energy») apunta al mismo edificio que ya está registrado como
  `merlin-barcelona-zona-franca`. Crear ficha propia sería doble conteo. Anotado
  como incertidumbre en el fichero de Merlin.
- **«CoreWeave: Barcelona» (15 MW) y «Edged Energy: Barcelona» (16 MW).** Son las
  entradas que Baxtel mantiene por cliente y por diseñador del mismo edificio de
  la Zona Franca. Mismo motivo: doble conteo.
- **«Kyndryl: Barcelona».** Muy probablemente el mismo CPD que ITnow CD1 en el
  Parc de l'Alba, dado que Kyndryl es socia de ITnow. Descartada como ficha
  independiente.
- **«Panattoni: Barcelona 2» (DC02).** Es la segunda fase del mismo campus del
  Parc de l'Alba; está dentro de `panattoni-cerdanyola-parc-alba` como `fases[]`.
- **«Adam: Cerdanyola 2» / «Adam BCN3».** Misma instalación que
  `adam-cerdanyola-parc-alba`; se ha unificado.
- **«Colt Barcelona» y «AtlasEdge Barcelona».** No son emplazamientos vivos
  independientes: es el mismo edificio de Carrer de l'Acer que hoy explota Templus
  como BCN02. Registrados como `alias`.
- **«Submer: Barcelona» (Baxtel, año previsto 2027).** Ficha sin dirección, sin
  potencia y sin superficie; la única inversión de Submer en centros de datos que
  sí está documentada es la de Flix, ya registrada. Descartada por riesgo de
  duplicar `rubix-submer-flix`. Submer tiene sede en Rubí, pero eso es sede
  corporativa, no centro de datos.
- **«iDataGreen» (Carrer Acer 30, planta 3).** PeeringDB lo registra como una
  planta dentro del edificio de Equinix BA1: es un inquilino, no un emplazamiento.
- **Data4, NTT, Global Switch, Stack, Vantage, CyrusOne, Nabiax (más allá de
  Terrassa), Telefónica en solitario.** No se ha encontrado ninguna instalación ni
  proyecto suyo en Cataluña. Data4 opera en España solo en San Agustín del
  Guadalix (Madrid). Colt ya no explota centro propio en Barcelona: desde julio de
  2026 solo tiene un PoP de 400G dentro del BCN1 de Digital Realty.
- **Consumo eléctrico de MareNostrum 5.** Descartado el valor de 1,3 MW por
  corresponder a MareNostrum 4.
- **Cifras agregadas del Govern (2.000 MW, 26 proyectos, 148 MW en 2030).** No se
  han imputado a ningún emplazamiento; quedan en esta nota como contexto.

### Sobre moratorias, agua y suelo

El encargo pedía registrar proyectos `paralizado` o `cancelado` en Cataluña. **No
se ha localizado ninguno.** Lo que sí está documentado es:

- Oposición organizada en Ribera d'Ebre y Terres de l'Ebre (Ecologistes en Acció,
  CGT) contra la gigafactoria de Móra la Nova y los centros de Flix y Santa
  Bàrbara, con el argumento de «infraestructures extractives». Piden un plan
  industrial alternativo, **no** explícitamente una moratoria.
- Vecinos organizados contra los proyectos de Lleida por ruido, agua y
  electricidad.
- A escala española, el Gobierno ultimaba en agosto de 2026 un real decreto que
  limitaría el agua y exigiría renovables a los centros de datos, con reacciones
  del sector. La propuesta explícita de moratoria localizada procede de Aragón
  (CHA), no de Cataluña.
- Cataluña exige ya un plan de reutilización de aguas grises a los nuevos
  proyectos, según prensa económica; no se ha podido verificar en el DOGC.

Nada de esto llega al umbral de «proyecto paralizado o denegado» con expediente,
así que no se ha creado ninguna ficha con esos estados.

## 5. Cobertura estimada

- **Barcelona metropolitana y Vallès: alta (~85–90%).** Se han cubierto todos los
  operadores de colocation con presencia verificable en PeeringDB, los tres
  grandes proyectos mayoristas del Parc de l'Alba y los dos hitos de 2025–2026
  (MERLIN/CoreWeave en la Zona Franca y Digital Realty en Sant Adrià). Lo que
  falta son sobre todo CPD corporativos no publicitados y potencias no publicadas,
  no emplazamientos enteros.
- **Cataluña central (Anoia): baja (~20%).** Se sabe que hay cuatro proyectos y un
  campus llamado D-Hub en Òdena, pero no se ha podido abrir ninguna fuente.
- **Terres de l'Ebre: media (~60%).** Los dos proyectos grandes están registrados;
  falta Santa Bàrbara y falta cualquier documento administrativo.
- **Tarragona (Camp de Tarragona): baja (~10%).** Polo declarado por el Govern sin
  un solo proyecto localizado.
- **Lleida: media (~50%).** Alcarràs registrado; el proyecto de 50 MW liderado por
  Telefónica que menciona la prensa comarcal no se ha podido ubicar en un
  municipio concreto.
- **Girona: nula.** Sin resultados.
- **Datos de red eléctrica: prácticamente nula.** Sin acceso a DOGC ni a
  autorizaciones de instalaciones eléctricas, no hay subestaciones, tensiones ni
  MW concedidos. Es la línea de trabajo más rentable para una segunda pasada.

### Próximos pasos sugeridos

1. Atacar el DOGC y las ponències ambientals por otra vía (descarga directa de
   PDF, portal de transparencia), que es donde están los MW de conexión reales.
2. Cerrar Anoia: Ajuntament d'Òdena, Ajuntament de Jorba, Consell Comarcal.
3. Buscar el proyecto de Lleida de 50 MW con Telefónica y ACS, y el de Santa
   Bàrbara.
4. Barrer Girona y Camp de Tarragona explícitamente antes de darlos por vacíos.
5. Pedir a los operadores sin potencia publicada (Equinix BA1, ITnow, T-Systems,
   Lumen) o buscar sus fichas técnicas en PDF.
