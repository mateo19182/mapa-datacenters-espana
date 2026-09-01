# Esquema de datos

Cada emplazamiento vive en su propio fichero YAML en `data/sites/<id>.yaml`.
Un fichero = un emplazamiento físico (campus o edificio independiente). Las fases
van **dentro** del fichero del emplazamiento, nunca como ficheros sueltos.

La fuente de verdad son estos YAML. El build los valida, los carga en SQLite
(`build/datacenters.db`) y exporta JSON/GeoJSON para el sitio estático.

## Ámbito territorial

El registro cubre **todo el territorio español**: península, Baleares, Canarias,
Ceuta y Melilla. La nacionalidad del territorio es el único criterio geográfico;
la insularidad no excluye.

Hasta septiembre de 2026 el alcance era solo peninsular, y la regla se cambió al
comprobar lo que dejaba fuera: el nodo LaPalma del Instituto de Astrofísica de
Canarias —uno de los catorce de la Red Española de Supercomputación—, el centro
neutro D-ALiX de Tenerife y las estaciones de cable submarino canarias y
baleares. Excluir infraestructura española por estar en una isla era un criterio
que no se sostenía en cuanto se enunciaba en voz alta.

**La capa eléctrica es la excepción, y es deliberada.** `data/red/` cubre el
sistema peninsular porque es el ámbito para el que Red Eléctrica publica
capacidad de acceso por nudo; los sistemas canario y balear son eléctricamente
independientes y no tienen equivalente publicado. La geometría de líneas de OSM y
la instantánea de generación de ENTSO-E siguen la misma frontera. Consecuencia
práctica: un emplazamiento insular tiene ficha, y no tiene red debajo. Eso no es
un hueco por rellenar con datos peninsulares, es una asimetría real de las
fuentes.

## Principios

1. **Nada sin fuente.** Todo dato relevante (potencia, estado, coordenadas,
   fechas, operador) lleva referencia a una fuente listada en el mismo fichero.
2. **No se rellenan huecos.** Si un dato no consta, se omite el campo o se pone
   `null`. Nunca se estima, se interpola ni se deduce «por analogía».
3. **No se mezclan tipos de potencia.** MW IT, MW de conexión a red y potencia
   instalada total son campos distintos y no se suman entre sí.
4. **Las contradicciones se conservan.** Si dos fuentes fiables discrepan, se
   registran ambas en `potencia[]` y se documenta el choque en `incertidumbres[]`.
5. **Un emplazamiento, un registro.** Los nombres alternativos van en `alias`,
   no en registros duplicados.

## Fichero de emplazamiento

```yaml
id: aws-aragon-villanueva-gallego     # kebab-case, estable, nunca se renombra
nombre: "AWS Región Aragón — Villanueva de Gállego"
alias:
  - "Amazon Villanueva de Gállego"
  - "AWS ZAZ2"
tipo: campus                          # campus | edificio
operador: "Amazon Web Services"       # quien opera el CPD
propietario: "Amazon Web Services"    # dueño del inmueble/sociedad, si difiere
cliente_ancla: null                   # inquilino principal si es build-to-suit
modelo: hyperscale                    # hyperscale | colocation | mayorista | corporativo | edge | desconocido

ubicacion:
  municipio: "Villanueva de Gállego"
  provincia: "Zaragoza"
  ccaa: "Aragón"
  direccion: "Plataforma Logística ..."
  lat: 41.7654
  lon: -0.8321
  precision: exacta                   # exacta | aproximada | municipio | desconocida
  fuentes: [src-1]

estado: operativo
# anunciado | en_tramitacion | permisos_concedidos | en_construccion
# | parcialmente_operativo | operativo | ampliacion_en_construccion
# | paralizado | cancelado | desconocido
estado_detalle: "Fase 1 operativa desde 2022-11; fases 2 y 3 en construcción."
estado_fuentes: [src-1, src-2]
fecha_puesta_en_servicio: "2022-11"   # ISO parcial admitido: YYYY | YYYY-MM | YYYY-MM-DD

potencia:
  - tipo: it                          # it | conexion_red | instalada_total | no_especificado
    valor_mw: 40
    valor_mva: null                   # si la fuente da MVA: se registra, NO se convierte
    acumulado: false                  # true si la cifra es el acumulado a ese hito
    ambito: fase                      # campus | edificio | fase
    edificio: null                    # nombre de la unidad física, si la cifra es de un edificio
    referencia: "Fase 1"              # a qué se refiere exactamente
    estado_asociado: operativo        # estado de eso que se mide
    fecha_dato: "2024-05-01"          # cuándo era cierto según la fuente
    fuentes: [src-1]
    nota: "La fuente dice 'capacidad TI'."

fases:
  - nombre: "Fase 1"
    estado: operativo
    fecha_puesta_en_servicio: "2022-11"
    superficie_m2: 12000
    fuentes: [src-1]

conexion_electrica:
  subestacion: "SE Villanueva 400 kV"
  tension_kv: 400
  titular_red: "Red Eléctrica"        # o la distribuidora que corresponda
  mw_solicitados: null
  mw_concedidos: null
  fuentes: [src-3]

superficie_parcela_m2: null
superficie_construida_m2: null
inversion_anunciada_eur: null         # dato documental, no valoración
refrigeracion: null                   # texto breve si consta (aire, agua, consumo)

agua:                                 # bloque estructurado; ver «Agua» más abajo
  circuito: cerrado                   # cerrado | abierto | hibrido | sin_agua | desconocido
  sistema: "Torres de refrigeración adiabáticas."
  origen: "Red municipal"             # de dónde sale el agua, si consta
  consumo_m3_ano: 120000              # se omite si no consta
  consumo_m3_dia: null                # NO se convierte al anual ni al revés
  wue_l_kwh: 0.2                      # litros por kWh, si la fuente lo publica
  nota: null
  fuentes: [src-3]

energia:                              # consumo eléctrico anual, no potencia
  - consumo_gwh_ano: 3279.7
    referencia: "Campus a plena capacidad"
    fecha_dato: "2025-07"
    fuentes: [src-4]
    nota: null

computo:                              # hardware instalado; ver «Cómputo instalado»
  - tipo: gpu                         # gpu | asic_ia | cpu_hpc | qpu | no_especificado
    ambito: particion                 # sistema | particion
    sistema: "MareNostrum 5 ACC"      # nombre del sistema o de la partición
    operador_computo: null            # quién opera el hardware, si no es el operador del CPD
    modelo: "NVIDIA H100 de 64 GB"    # tal como lo publica la fuente
    unidades: 4480
    tipo_unidad: acelerador           # acelerador | procesador | nucleo | qubit | nodo
    nodos: 1120                       # si la fuente lo da
    rendimiento: 260
    rendimiento_unidad: pflops        # tflops | pflops | eflops
    rendimiento_tipo: pico            # pico | linpack_rmax | no_especificado
    rendimiento_precision: fp64       # fp64 | fp32 | fp16 | fp8 | fp4 | no_especificado
    estado: operativo
    fecha_dato: "2026-08-31"
    fuentes: [src-1]
    nota: null

empleo:                               # cifras anunciadas, no verificadas
  - tipo: directo                     # directo | indirecto | construccion | total | no_especificado
    valor: 250
    referencia: "Fase de explotación"
    fecha_dato: "2026-06"
    fuentes: [src-2]
    nota: null
enlaces_proyecto: []                  # web oficial del proyecto/expediente

incertidumbres:
  - campo: potencia
    descripcion: "La prensa cita 200 MW; el expediente ambiental habla de 100 MW IT."
    fuentes: [src-2, src-3]

confianza: alta                       # alta | media | baja — ver criterios abajo
ultima_verificacion: "2026-08-29"

fuentes:
  - id: src-1
    url: "https://..."
    titulo: "Título literal de la página o documento"
    editor: "Amazon Web Services"
    tipo: empresa
    # oficial | empresa | asociacion | prensa_especializada
    # | consultora | prensa_general | otro
    fecha_publicacion: "2024-05-01"
    fecha_consulta: "2026-08-29"
    cita: "Fragmento literal breve que respalda el dato."
```

## Niveles de confianza

El nivel califica el respaldo de los datos centrales —dónde está, qué es, cuánta
potencia tiene—, **no cuántas fuentes hay**. Una ficha con seis referencias sigue
en `baja` si ninguna publica la potencia.

- **alta** — potencia, ubicación y estado respaldados por fuente oficial o de la
  propia compañía, sin contradicciones abiertas.
- **media** — emplazamiento identificado y situado, pero con datos centrales
  incompletos o sostenidos solo por prensa especializada o consultora.
- **baja** — faltan datos centrales, la ubicación es imprecisa o quedan
  contradicciones sin resolver. Se marca visiblemente en la ficha.

La ficha publicada no muestra esta definición: muestra qué falla en ese registro
concreto, leído de sus propios campos —«sin ninguna cifra de potencia», «una sola
fuente», «situado en el centro del municipio»— para que la explicación no pueda
contradecir lo que se ve al lado. Cuando no falla nada mecánicamente, el motivo
del nivel está escrito en `incertidumbres`.

## Tipos de potencia

| tipo | significado |
|---|---|
| `it` | Carga TI / capacidad de servidor. Lo que se usa para comparar CPDs. |
| `conexion_red` | Potencia de acceso solicitada o concedida en el punto de conexión. Siempre mayor que la TI. |
| `instalada_total` | Potencia eléctrica instalada del edificio (incluye clima, pérdidas). |
| `no_especificado` | La fuente da «MW» sin decir de qué tipo. Se registra tal cual y **no** se compara con los anteriores. |
| `termica_respaldo` | Potencia de los grupos electrógenos de emergencia, tal como la declaran las autorizaciones ambientales (a menudo en MW térmicos). **No es capacidad del centro de datos.** |
| `generacion_asociada` | Potencia de una central de generación vinculada al emplazamiento. Es capacidad de producir, no de consumir. |

Los dos últimos existen porque en muchos expedientes son la **única** cifra
publicada, y omitirlos perdería información real. Pero no entran en ningún
agregado: no se suman a nada, no se comparan con nada y no dimensionan el punto
en el mapa. Confundir la potencia de los grupos diésel de respaldo con la
capacidad del centro es un error de un orden de magnitud.

Nunca se convierte entre tipos aplicando un PUE supuesto. Tampoco se convierte de
MVA a MW: haría falta el factor de potencia, que no se publica. Si la fuente da
MVA, se usa `valor_mva` y `valor_mw` queda a `null`.

## Cómo se agregan las cifras de un mismo emplazamiento

Es la decisión metodológica más delicada del conjunto, porque sumar mal produce
cifras falsas con aspecto de rigor.

1. Una cifra de ámbito `campus` **manda** sobre cualquier suma: se entiende que
   el dato global ya incluye edificios y fases.
2. Las cifras de ámbito `edificio` **solo se suman entre sí cuando nombran
   unidades distintas** mediante el campo `edificio`. Si no lo hacen, se tratan
   como lecturas rivales del mismo edificio y se toma la más reciente.
3. Las de ámbito `fase` se suman, salvo las marcadas `acumulado`.

El punto 2 es deliberadamente conservador. Una ficha puede tener tres cifras de
ámbito `edificio` porque describe tres edificios (y hay que sumarlas) o porque
tres fuentes dan tres lecturas del mismo (y sumarlas triplicaría la capacidad).
El texto de `referencia` no permite distinguir un caso del otro, así que la
diferencia se declara: **sin `edificio`, no se suma**.

## Fases acumuladas frente a incrementales

Muchas fuentes dan la capacidad **acumulada** a cada hito («10 MW en 2026, 25 MW a
cierre de 2027, 45 MW en 2028»). Esas cifras no se suman entre sí: se marca cada
registro con `acumulado: true` y la agregación toma la mayor. Sumarlas produciría
un total inflado con aspecto de rigor, que es justo lo que este proyecto evita.

## Agua

El consumo de agua es la magnitud que más se discute públicamente y la que peor
se publica. El bloque `agua` recoge lo que diga la fuente y nada más.

| campo | qué es |
|---|---|
| `circuito` | `cerrado` (el agua recircula y solo se repone la merma), `abierto` (evaporativa: se evapora entera y hay que reponerla), `hibrido` (seca o evaporativa según la temperatura, con el consumo concentrado en verano), `sin_agua`, `desconocido`. |
| `consumo_m3_ano` / `consumo_m3_dia` | Volumen tal y como lo da la fuente. |
| `wue_l_kwh` | *Water Usage Effectiveness*, en litros por kWh. |
| `sistema`, `origen` | Texto breve: cómo se disipa el calor y de dónde sale el agua. |

Tres reglas:

1. **El consumo diario y el anual no se convierten uno en otro.** La conversión
   exige suponer los días de operación a plena carga, que es justo lo que no
   consta. Si una ficha tiene los dos, vienen de fuentes distintas y así se dice.
2. **`sin_agua` solo se pone cuando la fuente lo afirma**, y sigue siendo una
   afirmación del proyecto, no una medición. No es el valor por defecto de lo
   que se desconoce: para eso está `desconocido`.
3. **La cifra tiene que aparecer en la cita**, igual que las de potencia. El
   validador lo comprueba.

`refrigeracion` (texto libre) no desaparece: describe el sistema en prosa cuando
la fuente no da nada cuantificable. `agua` es lo estructurado; conviven.

## Consumo eléctrico

`energia[]` guarda la energía consumida al año, en GWh. Es la magnitud que más
aparece en los expedientes ambientales y **no cabe en `potencia[]`**: una es
energía y la otra potencia, y mezclarlas produce disparates. Nunca se comparan ni
se suman entre sí.

Va en GWh/año, pero la comprobación de la cita tolera que la fuente lo publique en
MWh, porque prueba también la cifra multiplicada por mil: `739.9` queda respaldado
por una cita que diga «739.900 MWh/año».

Es un array porque un mismo emplazamiento suele tener varias lecturas, por fase o
por escenario, y aquí las contradicciones se conservan como en todo lo demás.

## Cómputo instalado

`computo[]` registra el hardware de cálculo que hay dentro: aceleradores de IA,
particiones de CPU y procesadores cuánticos. Es la pregunta que la potencia no
responde —un centro de 15 MW puede tener 10.000 GPU o ninguna— y la que peor se
publica fuera del ámbito académico.

**Cómputo no es potencia.** Nada de este bloque entra en `potencia[]`, no
dimensiona el punto en el mapa y no se convierte en MW por ninguna regla de
densidad. Que un emplazamiento tenga cómputo registrado no cambia ni una cifra
eléctrica de su ficha.

| campo | qué es |
|---|---|
| `tipo` | `gpu` (acelerador de propósito general), `asic_ia` (silicio propio de un hyperscaler: Trainium, TPU, Maia), `cpu_hpc` (partición de cálculo de CPU), `qpu` (procesador cuántico), `no_especificado`. |
| `ambito` | `sistema` si la cifra describe la máquina entera, `particion` si describe una parte. |
| `sistema` | Nombre del sistema o de la partición, tal como lo nombra la fuente. |
| `operador_computo` | Quién opera el hardware, cuando no es el operador del centro. |
| `modelo` | Modelo del chip, literal de la fuente. |
| `unidades` + `tipo_unidad` | El recuento y de qué: aceleradores, procesadores, núcleos de CPU, cúbits o nodos. |
| `rendimiento` + `_unidad` + `_tipo` + `_precision` | La cifra de FLOPS con sus tres calificadores. |

### Cinco reglas

1. **El recuento solo se registra si la fuente lo publica.** Si da 29 nodos con
   dos GPU cada uno y no da el total, `unidades` queda vacío y el detalle va en
   `modelo` y `nodos`. Multiplicar sería deducir una cifra que nadie ha
   publicado, y este conjunto no deduce cifras.
2. **Los FLOPS no se comparan entre precisiones.** 19 EFlop/s en FP4 no son mil
   veces 260 PFlop/s en FP64: miden cosas distintas. Por eso la precisión viaja
   pegada a la cifra y el validador avisa cuando la fuente no la publica.
3. **Pico y medida tampoco.** `pico` es el máximo teórico y `linpack_rmax` lo que
   la máquina alcanzó en un *benchmark*. No se sustituyen ni se promedian.
4. **Cómo se suman los registros.** Uno de ámbito `sistema` manda sobre cualquier
   suma, igual que `campus` en `potencia`. Entre registros de ámbito `particion`,
   solo se suman los que difieren en `sistema` o en `modelo`: dos registros con
   el mismo par son lecturas rivales del mismo hardware, no dos máquinas.
5. **El cómputo del inquilino se atribuye al emplazamiento donde está**, con
   `operador_computo` diciendo de quién es. Es la regla «un emplazamiento, un
   registro» aplicada al caso de un centro mayorista cuyo hardware es de un
   tercero. Omitirlo perdería el mayor clúster de GPU documentado del país.

La regla de las instalaciones cuánticas no cambia: siguen sin generar ficha
propia si están dentro de un emplazamiento ya fichado, y siguen sin aportar
ninguna cifra a `potencia[]`. Lo único que añade `computo[]` es que ahora sus
cúbits se registran en un campo en vez de en la prosa del `estado_detalle`.

## Empleo e inversión

`empleo[]` e `inversion_anunciada_eur` son **cifras anunciadas** por el promotor
o por la administración que autoriza. No se han contrastado con ningún registro
laboral ni contable, y la ficha lo dice donde se muestran.

El empleo se separa por tipo porque mezclarlo deforma la cifra en un orden de
magnitud: el empleo de obra es temporal y suele ser diez veces el de explotación,
así que `construccion` y `directo` no se suman entre sí. `total` se reserva para
cuando la fuente da un agregado sin desglosar.

## Instalaciones de cómputo cuántico

España tiene ya varias y se estaban tratando de formas distintas, así que la
regla se fija aquí:

> Una instalación de cómputo cuántico recibe ficha **si y solo si es un
> emplazamiento físico identificable, con sala técnica propia y fuente pública**.
> Si está **dentro de un emplazamiento ya fichado**, no genera registro nuevo:
> se anota en el `estado_detalle` del anfitrión, por la regla «un emplazamiento,
> un registro». Y **nunca aporta cifra a `potencia[]`** salvo que la fuente
> publique una magnitud eléctrica de esa instalación concreta.

La razón de admitirlas no es que sean centros de datos, porque no lo son: la
carga dominante es un criostato de dilución y consumen kilovatios donde un CPD
consume megavatios. Es que el conjunto ya registra infraestructura de cómputo
público —BSC, CESGA, CSUC, IFCA, SCAYLE— y cuatro de esos cinco tampoco publican
ninguna magnitud eléctrica. Excluir la cuántica por no publicar MW sería aplicar
un criterio que el resto de la categoría no cumple.

Lo que sí exige es **decir en la ficha lo que no es**. El `estado_detalle` abre
advirtiéndolo y el orden de magnitud va en `incertidumbres[]`, nunca en
`potencia[]`, igual que se hace con los consumos de *benchmark* del BSC.

## Red eléctrica

`data/red/subestaciones.yaml` y `data/red/actuaciones.yaml` siguen el mismo
patrón de procedencia (`fuentes[]` + `ultima_verificacion`). La geometría de las
líneas de 220/400 kV se cachea en `data/red/lineas.geojson` desde OpenStreetMap
(ODbL) mediante `scripts/fetch-osm-grid.mjs`; no se consulta en tiempo real.

## Renovables y almacenamiento

`data/renovables/*.yaml` solo recoge activos con vínculo documentado a un cluster
o a un CPD concreto (PPA firmado, misma promotora, conexión al mismo nudo). No es
un inventario general de renovables en España.

## Normativa

`data/normativa/*.yaml`, un fichero por norma, validado por `zNorma`
(`scripts/schema.mjs`). Una norma no se parece a un emplazamiento: no tiene
coordenadas ni potencia, y su hecho central no es un número sino una fecha. Lo
que sí comparte es la regla del conjunto: nada sin fuente, y lo que no consta se
queda vacío.

La ficha separa tres cosas que se confunden constantemente:

| Bloque | Pregunta que contesta |
|---|---|
| `obligaciones[]` | Qué dice la norma: quién, qué, con qué umbral y en qué plazo |
| `estado` y `hitos[]` | En qué punto está: qué se ha aprobado, qué se ha votado, qué fecha queda |
| `actores[]` | Quién la empuja y quién no, con rol, postura y cita literal |

```yaml
id: prd-centros-datos-sostenibles     # kebab-case, igual que el nombre del fichero
titulo: "…"                           # nombre corto, el que se lee en listas
titulo_oficial: "…"                   # el del boletín, entero
ambito: estatal                       # europeo | estatal | autonomico
ccaa: [Aragón]                        # obligatorio si y solo si es autonómica
rango: proyecto_real_decreto          # ver RANGOS_NORMA
estado: audiencia_publica             # ver ESTADOS_NORMA
boletin: BOE
referencia: "BOE-A-2026-6544"
url_oficial: "https://…"
fecha_aprobacion / fecha_publicacion / fecha_entrada_vigor
materias: [acceso_a_red, agua]
resumen: "…"                          # qué hace la norma, sin valorarla
por_que_importa: "…"                  # la única frase interpretada del bloque de hechos
obligaciones: [{quien, que, umbral, plazo, fuentes}]
hitos: [{fecha, previsto, hito, fuentes}]
actores: [{nombre, rol, postura, voz, resumen, cita, fuentes}]
afecta: [{tipo, ref, como, fuentes}]  # registro | proyecto | region | nudo
relacionadas: [rdl-7-2026]            # otras normas de este mismo conjunto
incertidumbres: [{campo, descripcion, fuentes}]
ultima_verificacion: "2026-09-01"
fuentes: [...]                        # misma forma que en un emplazamiento
```

**Los estados no son intercambiables.** `audiencia_publica` es un borrador que no
obliga a nadie; `aprobada_no_aplicable` es un texto cerrado con la exigibilidad
diferida; `en_vigor` obliga hoy; y `en_vigor_en_tramitacion` obliga hoy con el
articulado todavía abierto en las Cortes, que es la situación del RDL 7/2026.
Confundir el primero con el tercero es el error más común al leer prensa
regulatoria, y por eso el estado se muestra en cada tarjeta y en cada tabla.

**Los umbrales se copian, no se convierten.** 1 MW de potencia de acceso y 500 kW
de potencia de tecnología de la información son magnitudes distintas y la norma
que las usa no las traduce entre sí: aquí tampoco. Es la misma regla que impide
sumar MW IT con MW de conexión.

**`afecta[]` es lo que une la sección con el mapa.** El vínculo lo declara la
norma, no se deduce de la ubicación de un proyecto: por eso la ficha de un
emplazamiento solo muestra las normas que lo nombran a él o a su comunidad. Un
`ref` de tipo `proyecto` debe existir en `data/sites/`.

**Un hito futuro es una fecha publicada por quien tiene competencia para
fijarla**, marcada con `previsto: true`. No se registran previsiones propias.
Cuando esa fecha vence sin que la ficha se haya revisado, `npm run refresh` lo
lista en la cola de revisión.

`revisarCoherenciaNorma` avisa, además, de la postura atribuida a un actor sin
cita literal que la sostenga, de la norma autonómica que no dice de qué comunidad
es, del proyecto en tramitación que declara fecha de entrada en vigor y de la
fuente que no respalda ningún campo concreto.

### La lectura

Lo interpretado va aparte y se firma como tal. `research/normativa/<id>.md`
contiene, cuando la hay, la lectura de esa norma —qué cambia en la práctica—, y
`npm run export` la copia a `src/contenido/normativa/`. Una norma sin lectura se
publica igual, solo con hechos. En la ficha aparecen en secciones distintas y con
un aviso explícito de cuál es cuál.
