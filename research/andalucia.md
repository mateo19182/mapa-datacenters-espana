# Andalucía — informe de investigación documental

Área: las ocho provincias de Andalucía.
Fecha de la investigación: **2026-08-29**. Todas las fichas llevan
`ultima_verificacion: "2026-08-29"`.

Nota de método: la búsqueda web se agotó a mitad del trabajo (límite de sesión de
200 consultas). A partir de ese punto solo se pudo usar apertura directa de URL, y
los buscadores alternativos (DuckDuckGo, Mojeek) devolvieron CAPTCHA o 403. Eso
condiciona los huecos que se listan más abajo: varios de ellos son huecos de
*descubrimiento*, no de verificación. Además, `datacenterdynamics.com`,
`eleconomista.es` y `datacentermap.com` devolvieron 403/429 de forma sistemática,
por lo que no se ha citado ninguna página de esos medios que no se haya abierto
realmente.

## 1. Emplazamientos creados

15 ficheros en `data/sites/`.

| id | emplazamiento | municipio (prov.) | operador | estado | potencia registrada | confianza |
|---|---|---|---|---|---|---|
| `saltburn-malaga-pta-extension` | Centro de datos en la Extensión del PTA | Málaga (MA) | Saltburn Holding / Benbros Energy | en_tramitacion | 100 MW IT + 150 MW conexión | alta |
| `box2bit-malaga-el-viso` | Box2bit Málaga | Málaga (MA) | Box2bit | en_construccion | — | baja |
| `templus-malaga-guadalhorce` | Templus MAL01 | Málaga (MA) | Templus | operativo | 2,8 / 2,6 MW no especificado | media |
| `grupo-aire-malaga-pta-oasix` | OASIX Málaga | Málaga (MA) | Grupo Aire | operativo | — | media |
| `telxius-estepona-estacion-cables-submarinos` | Estación de amarre de Estepona | Estepona (MA) | Telxius | operativo | — | baja |
| `junta-andalucia-sevilla-cpd-el-palenque` | CPD «El Palenque», Isla de la Cartuja | Sevilla (SE) | ADA / Sandetel | en_construccion | — | media |
| `templus-sevilla-pica` | Templus SEV01, Parque PICA | Sevilla (SE) | Templus | operativo | 1 / 0,8 / 0,5 MW no especificado | media |
| `comvive-la-rinconada-sevilla-datacenter` | Sevilla Datacenter | La Rinconada (SE) | Comvive | operativo | 1 MW no especificado | media |
| `alto-infrastructure-escuzar-sp01` | Campus SP01, CITAI | Escúzar (GR) | Alto Infrastructure (ex Sierra DC) | en_construccion | 70 MW IT + 100 MW conexión | media |
| `go-energy-trigueros-tron` | Campus TRON | Trigueros (H) | Go Energy | en_tramitacion | 200 MW / 133 MW no especificado | media |
| `edgemode-cordoba-green-dc` | Green DC Córdoba | Córdoba (CO) | EdgeMode | en_tramitacion | 300 MW no especificado | baja |
| `edgemode-torrecampo-green-dc` | Green DC Torrecampo | Torrecampo (CO) | EdgeMode | anunciado | 300 MW no especificado | baja |
| `telxius-conil-estacion-cables-submarinos` | Estación de cables submarinos de Conil | Conil de la Frontera (CA) | Telxius / Telefónica | operativo | — | media |
| `afr-ix-barbate-medusa-zahara` | Aterraje Medusa de Zahara de los Atunes | Barbate (CA) | AFR-IX telecom | desconocido | — | baja |
| `alme-almeria-aterraje-cables` | Aterraje ALME | Almería (AL) | sin identificar | operativo | — | baja |

Advertencia sobre las cuatro estaciones de aterraje (Conil, Zahara, Estepona,
Almería): **no son centros de datos de colocation**. Son estaciones de amarre de
cable submarino, con sala técnica y, en el caso de Conil, un centro de operaciones
de red de Telxius. Se incluyen porque el encargo pedía explícitamente cartografiar
la puerta de entrada hacia África y América, y cada ficha lo dice en
`estado_detalle` y en `incertidumbres[].campo: tipo`. Si el criterio del proyecto
acaba siendo estricto («solo CPD»), estas cuatro son las primeras candidatas a
salir.

### El único dato agregado de red que se ha podido documentar

El Conciso, citando a **Endesa** como gestora de las solicitudes de acceso desde
2022, publica el estado de la cola andaluza: **305 solicitudes, 5.133 MW, en 75
municipios**; el 48% (2.313 MW) sin viabilidad, el 32% (~2.200 MW) validadas en
tramitación y el 20% (620 MW) en estudio o inadmitidas. Reparto por provincia:
Sevilla 20 proyectos, Málaga 13, Cádiz 9, Granada 9, Córdoba 7, Jaén 5, Almería 4.
Endesa cifra en 6 subestaciones, 88 posiciones nuevas, 8 líneas de doble circuito
y 544 M€ (2025-2030) la inversión de red necesaria.

Este dato **no se ha volcado a ninguna ficha** porque es agregado y anónimo: da
municipios pero no promotores. Sirve para dimensionar cuánto de Andalucía falta
por documentar, no para crear emplazamientos. La lista de municipios con solicitud
que Endesa reconoce y para los que **no** existe ficha es la mejor guía de trabajo
futuro:

- **Sevilla**: Alcalá de Guadaíra, Dos Hermanas, Huévar, Mairena del Aljarafe,
  Sanlúcar la Mayor, Valencina de la Concepción.
- **Málaga**: Ronda, Vélez-Málaga, Antequera, Mijas, Humilladero, Mollina,
  Alhaurín de la Torre, Archidona, Casabermeja.
- **Granada**: Guadix, Órgiva, Pinos Puente, Baza.
- **Cádiz**: Jerez de la Frontera, Algeciras, El Puerto de Santa María,
  Puerto Real, Los Barrios, Bornos.
- **Córdoba**: Almodóvar del Río, Montilla, El Carpio.
- **Jaén**: Andújar, La Carolina, Torredonjimeno.
- **Almería**: Carboneras.

Fuente: <https://www.elconciso.es/empresas/falta-redes-electricas-bloquea-creacion_0_2004370898.html>

## 2. Huecos

**Cobertura provincial desigual.** Jaén se queda con **cero emplazamientos**: hay
cinco solicitudes de acceso a red según Endesa (Andújar, La Carolina,
Torredonjimeno) pero ninguna con promotor identificado en fuente abierta. Almería
solo aparece a través de un aterraje de cable de 1990; no se ha localizado ningún
proyecto de CPD ligado a la fotovoltaica almeriense pese a ser una de las hipótesis
del encargo. Cádiz aparece solo por aterrajes: ninguno de los nueve proyectos que
Endesa reconoce en la provincia (Jerez, Algeciras, El Puerto, Puerto Real, Los
Barrios, Bornos) tiene promotor público conocido.

**Potencia ausente en 7 de 15 fichas.** Box2bit, OASIX Málaga, CPD El Palenque y
las cuatro estaciones de aterraje no tienen ningún dato de potencia publicado. En
el caso del CPD de la Junta llama la atención: hay superficies, presupuesto,
refrigeración y fotovoltaica en las notas oficiales, pero ni un MW.

**Tipo de MW indeterminado en casi todo lo demás.** Solo dos fichas —Málaga PTA y
Escúzar— distinguen MW IT de MW de conexión, y en ambos casos porque la fuente lo
hace explícitamente (BOJA: «150 MW de consumo eléctrico y 100 MW de potencia IT»;
Alto/Cuerva: 70 MW IT frente a «hasta 100 MW» de potencia redundante). El resto se
ha registrado como `no_especificado`, tal como exige el esquema. No se ha aplicado
ningún PUE ni proporción.

**Conexión eléctrica.** Solo dos fichas tienen `conexion_electrica` poblada:
Málaga PTA (nudo SET Cártama de Red Eléctrica, dato de prensa, sin expediente
localizado) y Escúzar (SE Escúzar 132/66/20 kV más nueva subestación 220/132 kV,
dato de la alianza Cuerva–Alto). Para el resto no hay punto de conexión publicado.

**BOJA y boletines provinciales apenas explotados.** Se ha localizado y abierto una
única disposición del BOJA (la declaración de interés estratégico del proyecto de
Málaga, BOJA nº 104 de 2026, orden de 27 de mayo). No se han podido barrer las
declaraciones de impacto ambiental ni las autorizaciones administrativas de
instalaciones eléctricas asociadas a centros de datos: el buscador del BOJA
requiere consulta por términos y la búsqueda web se agotó antes de poder hacerla.
**Este es el hueco más grave y el primer trabajo pendiente.**

**Leads no confirmados que merecen una segunda pasada:**

- *CPD de Unicaja en Málaga TechPark*. The Olive Press (28-08-2026) lo cita como
  proyecto junto al de Saltburn y la ampliación de Templus. No se ha podido
  corroborar en ninguna otra fuente, ni en las notas del propio PTA. **No se ha
  creado ficha.**
- *DataRush IT Services*. Baxtel afirma que opera «three proprietary data
  centers—two in Málaga and one in Granada». No publica direcciones, potencias ni
  años, y las páginas individuales de Granada dieron 404. **No se ha creado ficha.**
- *Aterraje Medusa de Manilva (Málaga)*. Figura en la lista oficial de landing
  points de medusascs.com. No se ha creado ficha porque no hay ninguna otra fuente
  que describa una instalación en Manilva, solo la mención al punto de aterraje.
- *Aterrajes de Rota, Chipiona, Tarifa y La Línea de la Concepción (Cádiz)*.
  Xataka Móvil los enumera; no se ha localizado ninguna fuente que describa las
  estaciones. **Sin ficha.**
- *Aterraje de Roquetas de Mar (Almería)*. Misma situación.
- *Aeroópolis, Carmona, Alcalá de Guadaíra (Sevilla)*: el encargo los señalaba como
  zonas a cubrir. Alcalá de Guadaíra sí aparece en la lista de solicitudes de red
  de Endesa, pero no se ha encontrado ningún proyecto con promotor. La búsqueda de
  «Alcalá de Guadaíra data center» devuelve sistemáticamente el *Alcalá Data Center
  Campus* de ACS/Dragados, que está en **Alcalá de Henares (Madrid)** — ver
  descartados.

## 3. Contradicciones sin resolver

| Emplazamiento | Contradicción | Estado |
|---|---|---|
| Campus TRON (Huelva) | 200 MW (TSK, pv magazine, El Periódico de la Energía, Huelva24) frente a **133 MW** (El Conciso). Ninguna fuente dice de qué tipo son los MW. | Ambos valores en `potencia[]`. Sin resolver. |
| Campus TRON (Huelva) | Municipio: unas fuentes dicen Trigueros (finca Millares); otras reparten el proyecto entre San Juan del Puerto, Trigueros y Gibraleón. | Se registra Trigueros. Documentado en `incertidumbres`. |
| Campus TRON (Huelva) | Huelva24 sitúa en 2028 el **inicio de la construcción** de la fase 1; las demás fuentes sitúan en 2028 el **inicio de operaciones**. | Sin resolver. |
| Templus MAL01 (Málaga) | El propio operador publica **2,8 MW** en la ficha de MAL01 y **2,6 MW** en la tabla de su red europea. | Ambos en `potencia[]`. |
| Templus SEV01 (Sevilla) | Ficha del operador y prensa: **1 MW**. Tabla de red del mismo operador: **0,8 MW**. | Ambos en `potencia[]`. |
| CPD El Palenque (Sevilla) | Presupuesto **34,1 M€** (Junta, Data Center Market) frente a **35 M€** (Sevilla TechPark). | Se registra 34,1 M€ (cifra oficial). |
| CPD El Palenque (Sevilla) | Superficie: 5.150 m² con 6.240 m² de edificabilidad (Sevilla TechPark) frente a 1.900 m² de sala + 2.084 m² de infraestructura por módulos (Junta). Cifras no conciliables. | Se registran las dos primeras como parcela/construida; el desglose por módulos queda en `fases[]` e `incertidumbres`. |
| Campus SP01 (Escúzar) | Conexión eléctrica: «ampliación de la SE Escúzar 132/66/20 kV más nueva subestación 220/132 kV» (Smart Grids Info) frente a «130 kV con subestación propia» (Revista Cloud). | Sin resolver; no se ha localizado el expediente de acceso. |
| Campus SP01 (Escúzar) | Inversión: «hasta 3.000 M€ de inversión inducida total» frente a «aproximadamente 700 M€» de la infraestructura de centro de datos. No son magnitudes equivalentes. | Se registra 3.000 M€ como cifra anunciada, con nota. |
| EdgeMode | *Ready-to-build*: Q1 2026 para el porfolio (pv-tech) frente a Q2 2026 para Córdoba (Baxtel). | Sin resolver. |
| Málaga capital | Baxtel lista como instalaciones distintas *Templus Málaga* («C. Eduardo Queipo de Llano Caballero») y *Málaga Data Center* («Calle Eduardo Queipo de Llan»), en la misma calle del polígono Guadalhorce. No se ha podido determinar si son dos edificios o el mismo registrado dos veces. | **No se ha creado ficha para «Málaga Data Center»** para no arriesgar un emplazamiento duplicado. Pendiente. |

## 4. Proyectos descartados y por qué

**Alcalá Data Center Campus (ACS Digital & Energy / Dragados)** — Aparece
repetidamente al buscar «Alcalá de Guadaíra data center». Está en **Alcalá de
Henares, Madrid** (Corredor del Henares, ~6,7 ha, >100 MW IT proyectados). Fuera de
Andalucía. Descartado.

**CEN Solutions (Dos Hermanas, Sevilla)** — El polígono MegaPark de Dos Hermanas
alberga una instalación de 46.000 m² que aparece en directorios del sector. Es una
**fábrica de sistemas de almacenamiento energético y equipos eléctricos**, no un
centro de datos; la propia guía de Data Center Market la clasifica como
«Facilities para CPD». Descartada.

**Centro de excelencia en ciberseguridad de Google (Málaga)** — Es una sede de I+D
e ingeniería. No hay sala técnica ni CPD documentado. El encargo advertía
expresamente de este caso. Descartado.

**Centro de I+D europeo de Vodafone (Málaga)** — Centro de investigación con ~225
M€ y >600 empleos anunciados, más un *hub* de validación de banda ancha espacial
con AST SpaceMobile y la Universidad de Málaga. Sin CPD documentado. Descartado.

**Instalaciones de TDK, Dekra, Globant, Agilent en Málaga TechPark** — Oficinas y
laboratorios. Descartados.

**IMEC Málaga y ESTEL** — Laboratorio de microelectrónica (~600 M€) y planta de
transceptores ópticos con sala limpia de 500 m² (~15 M€). Son semiconductores y
fotónica, no centros de datos. Descartados. (Se mencionan aquí porque aparecen
mezclados con el data center en las notas del PTA y es fácil confundirlos.)

**Centro de Excelencia y Oficina del Dato (CEOD) de Jerez / red EDINT** —
Iniciativa de gobernanza y espacios de datos del Ayuntamiento de Jerez financiada
por el PRTR. No es una instalación de proceso de datos. Descartado.

**Parque Tecnológico de la Salud (PTS) de Granada** — Se revisó por indicación del
encargo. Es un parque de ciencias de la salud (625.000 m², docencia, sanidad,
investigación, empresas). No se ha encontrado ningún CPD ni proyecto de centro de
datos dentro del PTS. El proyecto granadino relevante está en **Escúzar (CITAI)**,
no en el PTS. Descartado como emplazamiento.

**Plataforma Solar de Almería** — Instalación de investigación en solar de
concentración del CIEMAT. No es un centro de datos. Descartada.

**Sevilla Datacenter como «mayor CPD de Andalucía»** — El emplazamiento sí se ha
creado, pero la afirmación comercial no se ha dado por buena: con 1 MW queda muy
por debajo del CPD de la Junta y de los proyectos de Escúzar, Málaga y Huelva.
Documentado en `incertidumbres`.

## 5. Cobertura estimada

**Alta** para los proyectos de gran escala anunciados: los cuatro que mueven la
aguja en Andalucía —Málaga PTA (Saltburn/Benbros), Escúzar (Alto Infrastructure),
Trigueros (Go Energy) y el porfolio de EdgeMode en Córdoba— están todos
documentados, y el mayor de ellos con fuente oficial primaria (BOJA). Los tres
primeros llevan además coincidencia entre varias fuentes independientes.

**Media** para el colocation operativo. Están las dos instalaciones de Templus,
OASIX Málaga y Comvive. Es plausible que falten pequeños CPD de operador local y de
banca/administración: los directorios sectoriales sugieren siete instalaciones en
Málaga capital frente a las cuatro fichas creadas para el municipio (Saltburn, Box2bit, Templus MAL01 y OASIX).

**Baja** para la mitad oriental y occidental del territorio. Jaén sin ninguna
ficha; Almería solo con un aterraje; Cádiz solo con aterrajes; Huelva con un único
proyecto. Y **baja** también en el eje documental que más importa a este mapa: la
relación con la red eléctrica. Solo 2 de 15 fichas tienen punto de conexión
identificado, y ninguna tiene MW solicitados o concedidos.

Estimación gruesa: se ha cubierto **la práctica totalidad de lo que tiene promotor
público identificado** en Andalucía a esta fecha, pero eso es una fracción pequeña
de la actividad real. Endesa habla de 305 solicitudes de acceso y 5.133 MW en 75
municipios; aquí hay 15 emplazamientos. La diferencia no es un fallo de la
búsqueda: es que la mayoría de esas solicitudes son anónimas, especulativas o
ambas, y el propio artículo de El Conciso las describe como ruido que bloquea
capacidad en nudos críticos. Documentarlas exigiría trabajo de expediente
—BOJA, boletines provinciales, DIA ambientales— que no se ha podido abordar.

### Siguiente paso recomendado

Barrido sistemático del **BOJA** y de los boletines de las diputaciones por los
términos «centro de datos», «centro de proceso de datos», «data center» cruzados
con «autorización administrativa previa», «declaración de impacto ambiental» y
«infraestructura eléctrica». Es la vía que convertiría los municipios anónimos de
la cola de Endesa en emplazamientos con promotor, parcela y MW de conexión.
