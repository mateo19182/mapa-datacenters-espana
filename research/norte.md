# Cornisa cantábrica y Galicia — informe de investigación documental

Área: **País Vasco (Álava, Bizkaia, Gipuzkoa), Cantabria, Asturias y Galicia**.
Fecha de trabajo: **2026-08-29**. Todas las fichas llevan `ultima_verificacion: "2026-08-29"`.

## Método y limitaciones

- La herramienta `WebSearch` agotó el presupuesto de sesión (200/200 consultas, compartido
  con el resto de agentes) tras ~12 consultas propias. A partir de ahí la búsqueda se hizo con
  **feeds RSS de Google News** (`news.google.com/rss/search?q=…`, que sí acepta operadores
  como `site:`) y con **Brave Search** vía apertura de URL, este último muy limitado por
  respuestas 429. DuckDuckGo devolvió CAPTCHA, Bing resultados corruptos, Startpage y Ecosia
  403. Varios huecos de abajo son, por tanto, **huecos de descubrimiento**, no de verificación.
- **Solo se citan URLs efectivamente abiertas con WebFetch.** Cuando un dato solo aparecía en
  un resumen de buscador o en un titular de agregador y no se pudo abrir la pieza, el dato se
  ha **omitido** y se ha anotado en `incertidumbres[]`. Es el caso de los 15 MW IT de Curtis,
  los 3,2 MW IT del nuevo CESGA y los 350 MW IT que la prensa atribuye a Arasur.
- Dominios que bloquearon la lectura de forma sistemática: `elcorreo.com`,
  `eldiariomontanes.es`, `lavozdegalicia.es` y `cincodias.elpais.com` (bloqueo del cliente);
  403 en `datacenterdynamics.com/es`, `eleconomista.es`, `ibm.com`, `iberdrola.com` e
  `iberdrolaespana.com`; 429 persistente en `datacentermap.com`.
- **Boletines oficiales**: el DOG sí es legible por URL directa y de ahí salen los dos datos
  duros del expediente de Curtis (parcelas y línea de 66 kV). BOPV, BOPA y BOC solo ofrecen
  buscadores **POST**, que WebFetch no puede ejecutar; no se ha podido llegar al texto de la
  autorización ambiental integrada de Moana Data (Zamudio) ni al expediente ambiental de los
  edificios 4 y 5 de Arasur, ambos conocidos únicamente por prensa.

---

## 1. Emplazamientos creados

16 ficheros nuevos en `data/sites/`. Todos validan contra `scripts/schema.mjs`.

| id | emplazamiento | municipio (prov.) | operador | estado | potencia registrada | confianza |
|---|---|---|---|---|---|---|
| `merlin-edged-ribera-baja-arasur` | Bilbao-Arasur Data Center Campus | Ribera Baja / Rivabellosa (VI) | MERLIN Edged (MERLIN + Edged Energy) | parcialmente_operativo | 300 MW IT (campus final) · 118 MW IT (fases 1-2) · 48/48/22 MW IT por edificio · 100 MW no esp. (proyecto 2022) | alta |
| `adi-abanto-zierbena-data-center-euskadi` | ADI Data Center Euskadi — Abanto | Abanto y Ciérvana (BI) | Atlantic Data Infrastructure | operativo | 2 MW no especificado | media |
| `adi-arrasate-garaia` | ADI — CPD del Parque Tecnológico Garaia | Arrasate/Mondragón (SS) | Atlantic Data Infrastructure | en_construccion | 3 MW IT | media |
| `sarenet-derio-parque-tecnologico` | Data Center de Sarenet en Derio | Derio (BI) | Sarenet | operativo | 3 MW instalada · hasta 8 MW no esp. | media |
| `nostrum-zamudio-moana-data` | CPD de Moana Data (Grupo Nostrum) | Zamudio (BI) | Moana Data, S.L. | permisos_concedidos | 30 MW no especificado (3×10 MW) | media |
| `telxius-derio-hub-comunicaciones` | Derio Communications Hub | Derio (BI) | Telxius (Telefónica) | operativo | 4 MW no especificado | media |
| `telxius-sopelana-estacion-cables-submarinos` | Estación de amarre de Sopelana (Marea, Grace Hopper) | Sopelana (BI) | Telxius (Telefónica) | operativo | — | media |
| `stoneshield-pielagos-altamira` | Campus Tecnológico de Datos Altamira | Piélagos y Villaescusa (S) | XDC Properties (Stoneshield) | en_tramitacion | 100 MW (2028) · 500 MW (2030), no esp. | media |
| `google-santander-pctcan-sol` | Estación de entronque del cable Sol en el PCTCAN | Santander (S) | Google | anunciado | — | media |
| `unican-ifca-santander-altamira` | Nodo Altamira de la RES (IFCA) | Santander (S) | IFCA (CSIC-UC) | operativo | — | media |
| `s4u-salas-digital-valley-asturias` | Digital Valley Asturias | Salas (O) | Sales For You Consulting (S4U) | anunciado | 120 MW no esp. (24 + 96) | media |
| `sekuens-aller-pozo-san-jorge` | Centro de datos del pozo San Jorge | Aller (O) | Sekuens / Principado de Asturias | en_construccion | 0,4 MW no especificado | media |
| `asac-llanera-data-center-1` | ASAC Data Center 1 | Llanera (O) | ASAC Comunicaciones | operativo | 1 MVA (registrado como instalada) | media |
| `ingenostrum-curtis-galicia-green-data-center` | Galicia Green Data Center | Curtis (C) | Galicia Green Data Center, S.L. | permisos_concedidos | — (no publicada) | alta |
| `cesga-santiago-a-sionlla` | Nuevo CESGA de A Sionlla (FinisTerrae IV) | Santiago de Compostela (C) | CESGA | en_construccion | — (no publicada) | alta |
| `abanca-a-coruna-pocomaco` | CPD principal de ABANCA en Pocomaco | A Coruña (C) | ABANCA | operativo | — | baja |

Reparto: **7 en País Vasco**, **3 en Cantabria**, **3 en Asturias**, **3 en Galicia**.

### Advertencias de lectura

- **Estaciones de aterraje.** `telxius-sopelana-…` y `google-santander-pctcan-sol` **no son
  CPD de colocación**: son infraestructura de amarre y transmisión de cable submarino. Se
  incluyen porque toda la argumentación comercial de Arasur, Zamudio y Derio se apoya en la
  baja latencia con Norteamérica que aportan esos amarres (Marea y Grace Hopper en Sopelana;
  Anjana y el futuro Sol en Santander). Se sigue el criterio ya aplicado en el dataset a
  Conil y Estepona.
- **Homonimia peligrosa en Cantabria.** «Altamira» designa dos cosas distintas y sin relación:
  el **Campus Tecnológico de Datos Altamira** de Stoneshield en Piélagos/Villaescusa y el
  **supercomputador Altamira** del IFCA en Santander, nodo de la RES desde 2012. Ambas fichas
  se remiten mutuamente en `incertidumbres[]`.
- **Ninguna potencia se ha convertido entre tipos.** Once de las diecinueve cifras registradas
  van como `no_especificado` porque las fuentes dicen «MW» o «capacidad» sin decir de qué. El
  único bloque con MW IT explícitos y atribuidos por la propia compañía es Arasur; el segundo,
  los 3 MW IT de ADI Arrasate.
- El `1 MVA` de ASAC Llanera es potencia **aparente** del centro de transformación. Se ha
  registrado como `instalada_total` por ser lo más próximo del enum, con la salvedad anotada
  en la ficha: MVA y MW no son equivalentes.

---

## 2. Huecos

**Descubrimiento bloqueado por medios ilegibles**

1. **RIC Energy — centro de datos en suelo de Sniace (Torrelavega, Cantabria).** Anunciado el
   4-abr-2026 junto a su plan de hidrógeno verde Besaya H2 (700 M€, declarado estratégico por
   Cantabria en feb-2026). El único medio que lo cubre es *El Diario Montañés*, bloqueado. Sin
   ficha.
2. **Inditex — CPD de Arteixo (A Coruña).** Certificado Tier IV en 2013 y descrito como uno de
   los centros tecnológicos «únicos» del mundo. Es con casi total seguridad el mayor CPD
   corporativo de Galicia, pero ninguna de las fuentes localizadas (DCD, elEconomista, Hoy,
   Cinco Días, Reason Why) se pudo abrir. Sin ficha.
3. **Dos centros de datos en Galicia de un grupo saudí y el presidente de la patronal
   fotovoltaica** (*Faro de Vigo*, 28-sep-2025). No se localizó URL abierta ni municipios.
4. **«Arakaldo: primeros pasos para un nuevo centro de datos»** (*diarioeuskadi.eus*,
   5-may-2026). El buscador del medio no devuelve la pieza. Arakaldo es un municipio de
   Bizkaia; no se ha podido confirmar promotor ni potencia.

**Datos que faltan en emplazamientos ya fichados**

5. **Potencia de Curtis.** El anuncio del DOG describe tres salas IT pero no publica MW. Las
   fuentes secundarias hablan de 15 MW IT en tres fases de 5 MW, sin verificar.
6. **Potencia del nuevo CESGA.** La Xunta publica superficie, inversión y equipamiento pero no
   MW. La cifra que circula (3,2 MW IT) no se ha verificado.
7. **Potencia y estado real de ADI Abanto.** Ni el Gobierno Vasco ni la sociedad publican
   carga TI ni potencia de conexión, y no existe nota oficial de inauguración.
8. **Expedientes ambientales del País Vasco.** La AAI y la DIA de Moana Data (22-may-2026) y
   la tramitación ambiental de los edificios 4 y 5 de Arasur (ago-2026) constan solo por
   prensa. Un feed de `site:euskadi.eus` devolvió la existencia de un anuncio del director de
   Administración Ambiental referido a *DATA CENTER EUSKADI S.L.* (23-abr-2025), pero no se
   pudo recuperar su URL. **Es la vía prioritaria para la próxima iteración**, junto con BOPA
   y BOC.
9. **Conexión eléctrica.** Solo hay dato de red en tres fichas: Curtis (línea subterránea de
   66 kV desde la SET Sidegasa y suministro secundario de 15 kV), Altamira/Cantabria (SE
   Penagos 220 kV, según prensa especializada) y Salas (subestación propia sin caracterizar).
   Para Arasur, Zamudio, Derio y Abanto no consta ni subestación ni MW solicitados/concedidos.
10. **CPD públicos autonómicos.** No se ha localizado documentación abierta de los centros de
    proceso de datos de EJIE (Gobierno Vasco), AMTEGA (Xunta) ni del Principado, más allá de
    licitaciones sueltas.

---

## 3. Contradicciones sin resolver

1. **Arasur — potencia del campus.** Cuatro cifras conviven y están todas registradas en
   `potencia[]`:
   - **100 MW** «de capacidad» en el proyecto presentado en la primera piedra (jul-2022,
     Norte Exprés), con 3 MW iniciales y 22 MW al terminar el primer edificio;
   - **300 MW IT** como capacidad potencial del campus completo (nota de MERLIN, dic-2024, y
     KREAN);
   - **118 MW** de *critical capacity* en la ficha comercial de Edged, que Crónica Vasca
     atribuye a la suma de fases 1 y 2;
   - **«300 MW repartidos en media docena de edificios»** (Crónica Vasca, ago-2026).
   Además la prensa económica de oct-2025 habla de **350 MW IT** en el marco de la alianza con
   Iberdrola: **no se ha registrado** porque no se pudo abrir ninguna fuente que lo sostenga.
2. **Zamudio — naturaleza de los 30 MW.** *El Correo* los describe como «potencia eléctrica»;
   un titular de Crónica Vasca de ene-2026 como «capacidad TI». Registrado como
   `no_especificado` hasta poder leer el expediente del BOPV.
3. **Altamira/Cantabria — superficie.** Data Center Market da 637.000 m² y 636.432 m² en la
   misma pieza; Invest in Cantabria, 637.000 m².
4. **Altamira/Cantabria — cable submarino.** Data Center Market afirma que el campus se
   conecta al «cable submarino MAREA que conecta Santander con Carolina del Sur». Marea amarra
   en **Sopelana (Bizkaia)**; el cable que une Santander con Myrtle Beach (Carolina del Sur) es
   **Anjana**. Se ha tratado como error de la fuente y **no se ha registrado como dato**.
5. **ADI Arrasate — calendario.** Feb-2025: «estará todo listo para finales del próximo año»
   (finales de 2026). Titulares de abr-2026 recogidos en agregadores hablan de 2027; no se
   pudo abrir la pieza.
6. **Curtis — inversión y calendario.** El DOG fija 50.800.000 €; la prensa habla de 51 M€ y
   un titular de *Xornal21* de «37 millones». El encendido, previsto originalmente para 2026,
   se retrasa a finales de 2027 según *Faro de Vigo* (pieza no abierta).
7. **Curtis — propiedad.** En may-2026 la prensa gallega y *Expansión* informaron de la compra
   de Ingenostrum / Nostrum Group por el australiano **IREN** (respaldado por Nvidia). No se
   pudo abrir ninguna fuente primaria ni encontrar comunicado en `iren.com`, así que el cambio
   de propiedad **no se ha registrado**, solo anotado como incertidumbre. Afecta también a
   Zamudio.
8. **Sarenet — tipo de potencia.** «Potencia operativa inicial de 3 MW» (El Español) frente a
   «3 MW de potencia instalada» (titular de Zonamovilidad). Sin desglose de carga TI.

---

## 4. Proyectos descartados y por qué

| Proyecto | Ámbito | Motivo del descarte |
|---|---|---|
| **As Pontes — centro de datos de Endesa** | A Coruña | No existe proyecto. José Bogas (24-feb-2026): «*es un emplazamiento buenísimo para miles de cosas, incluso para, a lo mejor, un centro de datos*». Sin promotor, sin MW, sin plazos. Además la declaración de la chimenea como BIC compromete el uso industrial. Se mantiene como **contexto de nudo de transición justa**, no como emplazamiento. |
| **Aprisco Group — data center en Asturias** | Asturias | 1.000 M€ y 700-800 empleos anunciados en mar-2026, pero en abr-2026 la compañía seguía «buscando con urgencia un terreno de 100.000 m²». Sin municipio no hay emplazamiento que fichar. |
| **Solaria — 225 MW para CPD en el País Vasco** | Euskadi | Confirmación de viabilidad de acceso y conexión de **225 MW de demanda** otorgada por Red Eléctrica (25-feb-2025, comunicado de la propia Solaria, abierto y verificado). Es capacidad de red, **no un emplazamiento**: la nota no identifica municipio ni parcela. Se anota aquí como contexto de red; encaja mejor en `data/red/` que en `data/sites/`. |
| **Ampliación del centro TIC de El Entrego (CINN)** | San Martín del Rey Aurelio (O) | Es un edificio de investigación que alojará un simulador y un ordenador cuántico de átomos de Rydberg del CINN (1,8 M€ de obra + 7 M€ del proyecto cuántico). Laboratorio, no CPD. |
| **Nuevo centro de datos del CHUF (Hospital de Ferrol)** | Ferrol (C) | CPD interno hospitalario licitado por la Xunta por ~3,2 M€. Escala y naturaleza de sala técnica de hospital. |
| **Dinahosting** | Santiago de Compostela | Se comprobó en su web: «*Nuestros Centros de Datos cuentan con unas completas instalaciones de 200 m2 ubicadas en Aire Networks y Global Switch en Madrid*». No tiene CPD propio en Galicia. |
| **Sexto CPD de Nostrum «en Galicia»** | Galicia | Anunciado en ene-2026 dentro del paquete de seis proyectos (800 MW combinados) pero sin municipio identificado en ninguna fuente abierta. |
| **Ignis/EQT — centro de datos en Galicia** | Galicia | Solo declaraciones de terceros («*habló de un centro de datos y desconocemos si hay un acuerdo para eso*», feb-2026). |
| **«Tercer centro de ADI en Álava»** | Álava | Citado de pasada por Crónica Vasca sin municipio, potencia ni calendario. |
| **IBM Quantum System Two de Donostia** | Gipuzkoa | Instalación real e inaugurada el 14-oct-2025 en el IBM-Euskadi Quantum Computational Center, pero todas las fuentes candidatas (ibm.com, euskadi.eus, gipuzkoa.eus) devolvieron 403/404. Sin fuente abierta no se ficha; **candidato claro para la próxima iteración**. |
| **Reforma del edificio del CPD de ABANCA** | A Coruña | *Sí* se ha fichado el emplazamiento, pero conviene precisar: la obra documentada (1.600 m², 140 puestos) afecta a las **áreas de trabajo** del inmueble, no a las salas técnicas. De ahí la `confianza: baja`. |

---

## 5. Cobertura estimada

**Alta (≥90%) en lo que ya es público y grande.** Los cinco proyectos que definen hoy el mapa
del norte — Arasur, Zamudio, Altamira/Cantabria, Salas y Curtis — están fichados con fuente
primaria o de compañía, y en tres de ellos (Curtis, CESGA, Salas) la fuente es oficial (DOG,
Xunta, Principado).

**Media (~70%) en instalaciones operativas de tamaño medio.** Están ADI (los dos), Sarenet,
Telxius Derio y ASAC Llanera, pero es probable que falte alguna sala de colocación pequeña o
regional: no se pudo consultar `datacentermap.com` (429 persistente en todos los intentos) ni
la guía de Data Center Market, que son los dos directorios que habrían cerrado este flanco.

**Baja (~40%) en CPD corporativos y de administración.** Solo hay ficha de ABANCA. Faltan con
casi certeza el CPD de Inditex en Arteixo, los centros de EJIE, AMTEGA y el Principado, y los
CPD de las grandes industrias vascas y gallegas.

**Baja en trazabilidad eléctrica.** Solo 3 de 16 fichas tienen algún dato de conexión a red y
ninguna tiene `mw_solicitados` ni `mw_concedidos`. Es la carencia más seria del bloque y solo
se resuelve leyendo BOPV, BOPA y BOC, que exigen POST. El contexto —conocido solo por
titulares que no se pudieron abrir y que por tanto **no** se han volcado a ninguna ficha— es
que Euskadi tendría del orden de 3 GW de proyectos industriales parados por falta de capacidad
de red, y que Cantabria reclamó al Ministerio en nov-2025 y dic-2025 acceso a la red y un
aumento de potencia del 60% precisamente para no perder el proyecto Altamira. Si esa lectura
se confirma, las cifras de 100/500 MW de Piélagos son declaraciones de intenciones hasta que
haya acceso concedido.

**Nudos de transición justa: cobertura conceptual, no de proyectos.** Se comprobó que
As Pontes (nudo Maciñeira), Valle del Caudal y Aboño y La Pereda 220 kV están declarados como
nudos/zonas de transición justa y que el ITJ tramita concursos de capacidad, pero **ningún
centro de datos concreto está hoy adjudicado o tramitándose en ellos**. El único
aprovechamiento minero-industrial con proyecto real es el pozo San Jorge de Aller, de 0,4 MW.
