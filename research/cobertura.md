# Cobertura, huecos y contradicciones del mapa

Auditoría independiente cerrada el 2026-08-29, sobre el estado del repositorio a esa
fecha: 163 fichas en `data/sites/`, 133 subestaciones y 548 nudos con capacidad en
`data/red/`, 41 actuaciones de red, 22 activos renovables y diez dossieres de
investigación en `research/`.

Auditoría independiente del resultado, no del trabajo de investigación: qué cubre este mapa
y qué no cubre. Todas las cifras salen de contar sobre `src/data/*.json`; donde hay una
estimación, se dice.

---

## 1. Resumen

El mapa cubre bien quién promueve centros de datos en España y dónde, siempre que el
proyecto sea grande y tenga prensa. Cubre mal cuánta potencia hay, y cubre muy mal
cómo se conecta esa potencia a la red.

Tres cifras resumen el estado:

- El 23% de las fichas (37 de 163) tiene alguna cifra de MW con el tipo declarado. En el
  resto, o no hay potencia (63 fichas), o la hay sin saber si son MW de carga TI, de
  conexión o de generadores (58 fichas).
- El 29% de las fichas (48 de 163) cita al menos una fuente oficial. De las 81 fuentes
  oficiales del conjunto, 45 son del Boletín Oficial de Aragón.
- El 23% de las fichas (37 de 163) tiene bloque `conexion_electrica`, y solo 9 tienen
  MW concedidos.

El sesgo dominante no es geográfico ni sectorial. Es de accesibilidad documental: el mapa
retrata con precisión las comunidades cuyo boletín oficial se pudo leer por URL y describe
por rumor de prensa las demás. La sección 5 desarrolla esto, porque es lo que más deforma la
lectura del resultado.

---

## 2. Cobertura en cifras

### 2.1 Emplazamientos por comunidad autónoma y estado

| Comunidad | Total | Operativo | Parcial. oper. | Ampl. en constr. | En constr. | Permisos conc. | En tramitación | Anunciado | Paralizado | Cancelado | Desconocido |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Comunidad de Madrid | 34 | 17 | 1 | 3 | 5 | 0 | 1 | 2 | 0 | 0 | 5 |
| Cataluña | 32 | 19 | 0 | 0 | 7 | 0 | 2 | 4 | 0 | 0 | 0 |
| Aragón | 25 | 3 | 0 | 0 | 0 | 4 | 9 | 8 | 1 | 0 | 0 |
| Comunitat Valenciana | 18 | 9 | 0 | 1 | 1 | 0 | 2 | 2 | 0 | 3 | 0 |
| Andalucía | 15 | 7 | 0 | 0 | 3 | 0 | 3 | 1 | 0 | 0 | 1 |
| País Vasco | 7 | 4 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| Castilla-La Mancha | 6 | 1 | 0 | 0 | 0 | 1 | 0 | 4 | 0 | 0 | 0 |
| Extremadura | 5 | 0 | 0 | 0 | 0 | 0 | 2 | 3 | 0 | 0 | 0 |
| Castilla y León | 4 | 1 | 0 | 0 | 0 | 0 | 2 | 1 | 0 | 0 | 0 |
| Región de Murcia | 4 | 2 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| Galicia | 3 | 1 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| Asturias | 3 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| Cantabria | 3 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 |
| La Rioja | 2 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| Navarra | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| Sin comunidad asignada | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| **Total** | **163** | **67** | **2** | **4** | **19** | **7** | **23** | **31** | **1** | **3** | **6** |

Baleares, Canarias, Ceuta y Melilla no tienen ninguna ficha. Es una ausencia por diseño,
porque el encargo era peninsular, pero deja fuera los aterrajes de cable canarios y el nodo
de Baleares.

La ficha sin comunidad es `echelon-iberdrola-madrid-sur`, que además no tiene municipio ni
coordenadas. Es un caso real de proyecto anunciado cuya ubicación nadie ha publicado, no un
error de carga.

### 2.2 Qué se publica sobre la potencia

| | Fichas | % de 163 |
|---|---:|---:|
| Sin ninguna cifra de potencia | 63 | 39% |
| Con alguna cifra | 100 | 61% |
| Con al menos un valor de **MW IT** | 26 | 16% |
| Con al menos un valor de **MW de conexión** | 23 | 14% |
| Con al menos un valor tipado (IT o conexión) | **37** | **23%** |
| Solo con MW sin tipificar | 58 | 36% |

A nivel de registro individual de potencia, y no de ficha, el desequilibrio es aún más
claro: 111 registros `no_especificado` frente a 41 `it`, 27 `conexion_red` y 10
`instalada_total`.

Las sumas por tipo, que no deben publicarse como totales, ilustran el problema:

| Tipo | MW acumulados |
|---|---:|
| `no_especificado` | 11.055 |
| `it` | 4.965 |
| `conexion_red` | 3.407 |
| `instalada_total` | 757 |

De esos 11.055 MW sin tipificar, 3.967 MW son potencia térmica (los MWt de los grupos
electrógenos diésel que declaran las autorizaciones ambientales de AWS en Aragón y la
central asociada a Monfarracinos) y otros 221 MW son potencia eléctrica de generadores de
respaldo. Es decir, **el 38% del bloque de MW sin tipificar no es carga informática ni
demanda de red, es calor de motores diésel**. No convertirlo es lo correcto, pero cualquier
visualización que sume la columna `no_especificado` producirá una cifra sin sentido
físico. Esta es, con diferencia, la trampa más peligrosa del dataset.

De las 73 fichas operativas o parcialmente operativas, solo 8 publican MW IT y 33 no
publican ninguna potencia. El mapa no está en condiciones de decir cuánta capacidad hay en
servicio en España.

### 2.3 Precisión de la ubicación

| Precisión | Fichas | % |
|---|---:|---:|
| Exacta | 44 | 27% |
| Aproximada (polígono, parque) | 51 | 31% |
| Municipio | 65 | 40% |
| Desconocida | 3 | 2% |

Tres fichas no tienen coordenadas y por tanto no aparecen en el mapa:
`acciona-ignis-segovia` (municipio sin identificar), `echelon-iberdrola-madrid-sur`
(ubicación sin publicar) y `diversity-cloud-arganda-del-rey`.

El reparto territorial de la precisión es muy desigual:

| Comunidad | Fichas | Coord. exacta | Con `conexion_electrica` | Con MW tipado |
|---|---:|---:|---:|---:|
| Comunidad de Madrid | 34 | 18 | 5 | 10 |
| Cataluña | 32 | 12 | 1 | 1 |
| Aragón | 25 | 7 | 19 | 12 |
| Comunitat Valenciana | 18 | 5 | 3 | 4 |
| Andalucía | 15 | 0 | 2 | 2 |
| País Vasco | 7 | 0 | 0 | 2 |
| Castilla-La Mancha | 6 | 0 | 1 | 1 |
| Extremadura | 5 | 0 | 2 | 3 |
| Castilla y León | 4 | 0 | 1 | 1 |
| Región de Murcia | 4 | 2 | 1 | 0 |
| Galicia | 3 | 0 | 1 | 0 |
| Asturias | 3 | 0 | 0 | 0 |
| Cantabria | 3 | 0 | 1 | 0 |
| La Rioja | 2 | 0 | 0 | 0 |
| Navarra | 1 | 0 | 0 | 0 |

Andalucía tiene quince fichas y ninguna coordenada exacta. Cataluña tiene treinta y dos
fichas y una sola con dato de conexión eléctrica. Aragón, con la mitad de fichas que
Madrid y Cataluña, tiene más datos de red que las dos juntas por un factor de tres.

### 2.4 Fuentes

454 fuentes en total, 2,8 por ficha de media. Veintidós fichas se sostienen sobre una sola
fuente. El máximo son 10.

| Tipo de fuente | Citas | % |
|---|---:|---:|
| Prensa general | 97 | 21,4% |
| Oficial | 81 | 17,8% |
| Empresa | 80 | 17,6% |
| Prensa especializada | 74 | 16,3% |
| Otro (directorios, PeeringDB, Wikidata) | 72 | 15,9% |
| Asociación | 45 | 9,9% |
| Consultora | 5 | 1,1% |

450 de los 454 enlaces estaban vivos el día de la verificación. La higiene de enlaces es
buena y no es un problema.

El reparto por nivel de confianza declarado: alta 23, media 87, baja 53. Que un
tercio del conjunto esté marcado como confianza baja es honesto, y hay que respetarlo al
publicar: esas 53 fichas no deberían presentarse con el mismo peso visual que las 23 de
confianza alta.

### 2.5 La vía oficial: dónde existe y dónde no

Esta es la tabla que más dice sobre el sesgo del conjunto.

| Comunidad | Fichas | Con fuente oficial | % |
|---|---:|---:|---:|
| Aragón | 25 | 25 | **100%** |
| Galicia | 3 | 2 | 67% |
| Asturias | 3 | 2 | 67% |
| Cantabria | 3 | 2 | 67% |
| Andalucía | 15 | 5 | 33% |
| Castilla-La Mancha | 6 | 2 | 33% |
| País Vasco | 7 | 2 | 29% |
| Cataluña | 32 | 6 | 19% |
| Comunitat Valenciana | 18 | 1 | **6%** |
| Comunidad de Madrid | 34 | 1 | **3%** |
| Extremadura | 5 | 0 | **0%** |
| Castilla y León | 4 | 0 | **0%** |
| Región de Murcia | 4 | 0 | **0%** |
| La Rioja | 2 | 0 | **0%** |
| Navarra | 1 | 0 | **0%** |

Y el desglose de esas 81 fuentes oficiales por origen:

| Origen | Citas |
|---|---:|
| Boletín Oficial de Aragón | 45 |
| Portal aragon.es (memorias de PIGA) | 5 |
| ACCIÓ (Generalitat de Catalunya) | 3 |
| Parque Tecnológico de Andalucía | 3 |
| Xunta de Galicia y Diario Oficial de Galicia | 3 |
| Junta de Andalucía (incluido 1 del BOJA) | 3 |
| Principado de Asturias | 2 |
| Ayuntamiento de Conil de la Frontera | 2 |
| Resto (14 emisores, 1 cita cada uno) | 15 |

**Solo tres boletines oficiales autonómicos aparecen citados en todo el dataset: el BOA (45
veces), el DOG (2) y el BOJA (1).** No hay ni una sola cita del BOCM, DOGC, DOGV, BORM,
BOPV, DOCM, BOCYL, DOE, BON, BOR ni BOPA.

Las razones son técnicas: DOGV y BORM publican buscadores JavaScript sin endpoint
navegable; `govern.cat` devuelve 403 a cualquier petición; BOPV, BOPA y BOC solo aceptan
búsquedas POST; el BOCM y el DOCM no se pudieron consultar por buscador. El BOA, en cambio,
expone un endpoint `BRSCGI` que devuelve JSON. Aragón no está mejor cubierto por mérito de
la investigación, sino porque su boletín tiene API.

### 2.6 Conexión eléctrica

| | Fichas |
|---|---:|
| Con bloque `conexion_electrica` | 37 (23%) |
| Con subestación nombrada | 36 |
| Con tensión declarada | 25 |
| Con titular de red identificado | 17 |
| Con **MW concedidos** | **9** |
| Con **MW solicitados** | **4** |

Nueve fichas sobre 163 tienen MW de acceso concedidos. Ese es el estado real de la
trazabilidad eléctrica del mapa. Todo lo demás que se diga sobre potencia de conexión sale
de declaraciones de promotor, no de resoluciones.

### 2.7 Las otras dos capas

**Capa eléctrica.** 133 subestaciones y 548 nudos con capacidad publicada, más 41
actuaciones de planificación. Es material sólido y bien documentado, pero **cubre ocho
comunidades, no diecisiete**: Cataluña, Andalucía, Madrid, Comunitat Valenciana, Aragón,
Castilla-La Mancha, País Vasco y Extremadura. Faltan por completo Castilla y León, Galicia,
Asturias, Cantabria, Navarra, La Rioja y Murcia, que entre las siete acumulan **20 fichas de
emplazamiento sin ninguna capa de red debajo**.

Además, 35 de las 133 subestaciones no tienen coordenadas y no se dibujan.

El cruce entre capas está roto en la práctica. `conexion_electrica.subestacion` es texto
libre, sin identificador que apunte a `data/red/`. Al intentar casarlas por nombre, **solo
16 de las 36 subestaciones citadas en las fichas aparecen en la capa eléctrica**. Y varias de
las que no casan son subestaciones reales de Red Eléctrica que la capa no incluye: Penagos
(Cantabria), La Mudarra (Valladolid), Sidegasa (A Coruña), Escúzar (Granada). Otras cuatro
(Arañuelo, Valdecaballeros, Calera y Chozas, Els Aubals) sí están en el fichero de capacidad
pero no en el de subestaciones.

Hay también una incoherencia de nomenclatura que rompe cualquier agrupación automática entre
capas: las fichas usan `Comunitat Valenciana` y la capa de red usa `Comunidad Valenciana`;
las fichas usan `Navarra` y la capa de renovables usa `Comunidad Foral de Navarra`.

**Capa renovable.** 22 activos. Ninguno tiene coordenadas, por decisión explícita de
registro: `null` antes que centroides inventados. Nueve de los 22 no tienen ni
comunidad autónoma, porque la fuente anuncia un PPA sin decir dónde están las plantas. Solo
4 de 22 tienen `cpds_relacionados` poblado. La capa, hoy, no se puede dibujar ni cruzar.

### 2.8 Informes automáticos

`npm run validate` da 0 errores y 209 avisos, casi todos de dos tipos: potencia sin tipificar
y fichas sin ningún dato de potencia. Coincide con lo medido arriba.

`npm run reconcile` señala 3 variantes de nombre de operador, 1 posible duplicado
(`espanix-madrid-mesena` y `espanix-madrid-gran-via-hortaleza`, mismo operador a 199 metros)
y 64 fuentes cuyo editor declarado no coincide con el dominio del enlace. Ese último
número parece alarmante y en su mayor parte no lo es: son notas de prensa corporativas
alojadas en subdominios (`comunicacion.abanca.com`, `pressroom.grupoacs.com`,
`newsroom.equinix.com`). Conviene revisarlas, pero no bloquean nada.

---

## 3. Proyectos con promotor y municipio conocidos que no tienen ficha

Este es el resultado más accionable de la auditoría. La sección 9a de
`research/companias.md` lista 80 proyectos como probablemente omitidos. Contrastados uno a
uno contra `src/data/sitios.json` por municipio, operador, propietario y alias:

**49 de los 80 sí tienen ficha.** Los 31 restantes no la tienen y son los siguientes.

### 3.1 Hiperescala fuera de los hubs conocidos

| Municipio | Provincia | Compañía | Potencia citada | Nota |
|---|---|---|---|---|
| **Vianos** | Albacete | Pure DC (Oaktree), ex-EdgeMode | 300 MW | El municipio se menciona dentro de las fichas de EdgeMode Córdoba y Torrecampo, pero no tiene ficha propia. Albacete se queda con cero emplazamientos. |
| **Palma del Río** | Córdoba | Pure DC (Oaktree), ex-EdgeMode | 300 MW | Ver la contradicción de la sección 4.5: podría ser el mismo activo que la ficha de Torrecampo. |
| **Cáceres** | Cáceres | Pure DC (Oaktree), ex-EdgeMode | 300 MW | Distinto del CCGreen de Nostrum, que sí está fichado en el mismo municipio. |
| **Soria** | Soria | GISS (Seguridad Social) | 6 MW | El dossier de centro-norte buscó un «centro de datos de Soria» sin promotor. El promotor es este. |
| **Torija** | Guadalajara | Fortinet | 7 MW | En el corredor del Henares, la zona que centro-norte declara infrarrepresentada. |

### 3.2 Dentro de los hubs, promotores poco mediáticos

| Municipio | Provincia | Compañía | Potencia citada |
|---|---|---|---|
| **Fuenlabrada** | Madrid | Apto | 240 MW |
| **Fuenlabrada** | Madrid | Form8tion Data Centers | 160 MW |
| **Alcobendas** | Madrid | Ferrovial (campus Valdelacasa) | >100 MW (fase 1: 60 MW disponibles / 40 MW IT) |
| **Alcobendas** | Madrid | Prime Data Centers | 40 MW |
| **Algete** | Madrid | AVAIO Digital Partners, proyecto «Scorpio» | 64 MW |
| **Tres Cantos** | Madrid | Quetta (Azora), QTT-MAD1 | 20 MW |
| **Tres Cantos** | Madrid | Merlin Edged, fase II | sin dato |
| **Madrid capital (Vicálvaro)** | Madrid | Edgnex / DAMAC | 40 MW |
| **Madrid capital (Iveco-Pegaso)** | Madrid | Goodman MAD01 | 11,7 MW IT |
| **Pinto** | Madrid | Nostrum | sin dato |
| **Sant Joan Despí** | Barcelona | AtlasEdge BCN002 | 10 MW |
| **Sant Fruitós de Bages** | Barcelona | Oxigen ODC2 | 8 MW |
| **Òdena** | Barcelona | Adequa Real Estate | 200 MW |
| **Santa Bàrbara** | Tarragona | Adequa Real Estate | 200 MW |
| **Alcover** | Tarragona | Scranton, proyecto «Iberdata» | 20 MW |
| **L'Hospitalet de l'Infant** | Tarragona | Ponentia Logistics | sin dato |
| **L'Espluga de Francolí** | Tarragona | Ponentia Logistics | sin dato |
| **Lleida** | Lleida | Ponentia Logistics | sin dato |
| **Tamarite de Litera** | Huesca | Ponentia Logistics | sin dato |
| **Escatrón** | Zaragoza | Ignis / DayOne | 300 MW |
| **Escatrón** | Zaragoza | Repsol | 400 MW |
| **Boecillo** | Valladolid | Vodafone | sin dato |
| **Granada** | Granada | Vodafone / Cloud Center Andalucía | sin dato |

### 3.3 Tres huecos que el dossier de compañías cierra y los territoriales no sabían

Esto merece destacarse porque es el valor concreto del cruce y se puede actuar sobre ello
hoy mismo, sin buscar nada nuevo:

1. **EDGNEX (DAMAC) está en Vicálvaro.** El dossier de Madrid documentó la operación al
   detalle (23.000 m² comprados a ASG Iberia, derechos de 40 MW, más de 400 M€) y la
   descartó expresamente porque ninguna fuente daba el municipio. El dossier de compañías lo
   da. La ficha se puede crear ya.
2. **Òdena y Santa Bàrbara tienen promotor: Adequa Real Estate.** El dossier de Cataluña
   señala Anoia como «el hueco más grande y más accionable» y Santa Bàrbara como una cita
   sindical sin promotor. Faltaba el nombre. Ya está.
3. **El «Madrid MAD1» de Algete que Madrid descartó por atribución no verificable** encaja
   con el proyecto «Scorpio» de AVAIO Digital Partners, 64 MW.

### 3.4 Pistas sin municipio, que no se pueden fichar todavía

No son omisiones imputables a nadie: falta el dato mínimo que exige el esquema. Se agrupan
aquí porque son el mejor guion para una segunda pasada.

- **Inditex, CPD de Arteixo (A Coruña).** Certificado Tier IV en 2013. Con casi total
  seguridad el mayor CPD corporativo de Galicia. Ninguna fuente accesible.
- **Seis CPD en la Ribera de Navarra** (Tudela, Ribaforada, Valtierra, Arguedas), 382 MW
  combinados, con avales presentados y solicitudes de acceso a red. Ninguna fuente nombra a
  los promotores. Navarra tiene hoy una ficha.
- **Velilla del Río Carrión (Palencia)**, segundo emplazamiento atribuido a Echelon-Iberdrola.
- **RIC Energy en el suelo de Sniace (Torrelavega)**, anunciado en abril de 2026.
- **Arakaldo (Bizkaia)**, titular de mayo de 2026 sin pieza recuperable.
- **Aprisco Group en Asturias** (1.000 M€) y Submer en Cataluña (100 MW): ambos siguen
  buscando terreno o no lo han publicado.
- **Unicaja en Málaga TechPark**; DataRush IT con dos centros en Málaga y uno en Granada.
- **IBM Quantum System Two de Donostia**, inaugurado en octubre de 2025, sin fuente abierta.
- **SCAYLE (León)** y Nasertic (Navarra): instalaciones públicas reales sin ubicación
  publicada.
- **CPD de la Comunidad de Madrid**, adjudicado a Telefónica en junio de 2025 por 24,5 M€,
  ubicación no publicada.
- **Nueve activos de MasOrange** y hasta cuatro emplazamientos de Quetta sin localizar.
- **Las dos zonas no publicadas** de la región Google `europe-southwest1`.

---

## 4. Contradicciones abiertas

El conjunto registra 382 incertidumbres en 161 de las 163 fichas, 2,3 de media. Solo dos
fichas no declaran ninguna. Ese nivel de autocrítica es una virtud del dataset, no un
defecto, pero hay que saber leerlo: no es un mapa con 382 errores, es un mapa que documenta
382 sitios donde las fuentes no se ponen de acuerdo.

| Campo en disputa | Incertidumbres |
|---|---:|
| Potencia | 136 |
| Ubicación | 77 |
| Estado del proyecto | 48 |
| Inversión anunciada | 30 |
| Superficie de parcela | 19 |
| Operador o propietario | 21 |
| Conexión eléctrica | 11 |
| Superficie construida | 10 |
| Fecha de puesta en servicio | 10 |
| Tipo de instalación | 8 |
| Refrigeración | 4 |
| Otros | 8 |

**El agua casi no aparece.** Solo 6 incertidumbres de las 382 mencionan consumo hídrico, y
sin embargo el agua es el eje de la contestación social en Talavera, Picassent y las Terres
de l'Ebre, y el objeto del real decreto que el Gobierno preparaba en agosto de 2026. No es
que las fuentes coincidan sobre el agua. Es que casi nadie publica el dato, así que ni
siquiera hay dos cifras que puedan contradecirse. Cuando las hay, el desacuerdo es brutal
(ver 4.4).

Estas son las que más cambiarían el mapa si se resolvieran.

### 4.1 Escatrón: ¿un proyecto de 300 MW, uno de 400, o dos que suman 700?

Repsol anunció que prepara la subestación de Escatrón «para la llegada de un gran centro de
datos» sin identificar operador, y por otra parte Ignis y DayOne anunciaron un campus de 300
MW en el mismo municipio. **Ninguno de los dos tiene ficha.** Si son el mismo proyecto y se
crean dos fichas, el mapa contará entre 300 y 400 MW de más en un solo municipio de 1.000
habitantes. Si son distintos y no se crea ninguna, faltan 700 MW. Es la verificación con
mayor relación entre esfuerzo y consecuencia de toda la lista.

### 4.2 AWS en Aragón: 3.000 MW de calor que no son capacidad

Las autorizaciones ambientales integradas de INAGA son la mejor fuente documental del
dataset entero, con coordenadas UTM y expediente. Y ninguna publica MW IT. Lo que
publican es la potencia térmica nominal de los grupos electrógenos diésel de respaldo: 327,
342, 750 y 1.169 MWt. Se registraron como `no_especificado` con nota explícita, que es lo
correcto. El resultado es que Aragón, la comunidad mejor documentada
del mapa, es también la que aporta el mayor bloque de MW que no significan nada para el
lector. Ninguna cifra pública permite hoy decir cuánta carga informática tiene AWS en
España.

### 4.3 Merlin: la cartera mejor documentada y la que peor cuadra consigo misma

El campus de Arasur (Ribera Baja, Álava) tiene cuatro cifras vivas y todas registradas: 100
MW en el proyecto de 2022, 118 MW de capacidad crítica en la ficha de Edged, 300 MW IT en la
nota corporativa de diciembre de 2024, y 350 MW IT en prensa económica que no se pudo abrir
y por tanto no se registró. En Botorrita conviven 144 MW IT (nota propia), 150 MW (prensa) y
476,8 MW (que es potencia renovable conectada, no capacidad del centro). Y las fases I, II y
III de la compañía suman 724 MW IT frente a los 730 MW del titular corporativo. Merlin es el
mayor promotor español por MW anunciados. Que su propia cifra no cuadre consigo misma
condiciona cualquier total nacional.

### 4.4 Meta en Talavera: un factor 24 en el consumo de agua

Cuatro cifras sucesivas, todas conservadas en la ficha: 4.800 millones de litros al año en
una ficha divulgativa local; 2,2 a 2,9 millones de m³ al año como consumo «inicialmente
previsto»; 504.500 m³ al año en el informe ambiental; y 0,2 hm³ al año en la documentación de
2026. Entre el máximo y el mínimo hay un factor 24. Es el proyecto mejor trazado
administrativamente de todo el centro peninsular, con nueve hitos fechados desde 2022, y
aun así nadie sabe cuánta agua va a consumir. La potencia tampoco está: los 248 MW que
circulan salen de una ficha divulgativa de una asociación empresarial.

### 4.5 EdgeMode en Córdoba: ¿Torrecampo o Palma del Río?

El dataset tiene ficha para `edgemode-torrecampo-green-dc`, con 300 MW derivados de repartir
un objetivo agregado de 1,5 GW entre cinco campus, sin parcela y sin fuente específica. El
dossier de compañías enumera esos cinco campus y Torrecampo no está entre ellos: son
Cáceres, Vianos, Córdoba, Palma del Río y Mora. O bien la ficha de Torrecampo y el proyecto
de Palma del Río son el mismo activo bajo dos topónimos de la provincia de Córdoba, o bien
hay un sexto emplazamiento. La propia ficha reconoce que «no se ha localizado ficha de
proyecto ni referencia a licencias o conexión a red para Torrecampo».

### 4.6 Echelon-Iberdrola: uno, dos o tres proyectos

La ficha `echelon-iberdrola-madrid-sur` existe **sin municipio, sin provincia y sin
comunidad autónoma**. La nota que sí se pudo leer habla de «Madrid Sur» con 160.000 m², 144
MW de procesamiento y 230 MW de conexión asegurada, sin situarlo. Un recopilatorio lo sitúa
en «Aceca (Madrid)», pero la central de Aceca está en Villaseca de la Sagra, Toledo. Un
tercer medio describe un CPD de Iberdrola en el polígono de Toledo capital, que tiene ficha
propia. Y DCD atribuye a la misma sociedad un segundo emplazamiento en Velilla del Río
Carrión, Palencia. Cuatro topónimos en tres comunidades para lo que puede ser un solo
proyecto.

### 4.7 Un duplicado vivo que los informes automáticos no detectan

`aq-compute-cerdanyola-parc-alba` y `hscale-cerdanyola-parc-alba` tienen **las mismas
coordenadas**, el mismo parque (Parc de l'Alba) y el mismo linaje societario (Aquila Group
figura en el propietario de ambas). El dossier de compañías dice sin ambages que es el mismo
activo antes y después del rebranding de Bain Capital y que hay que fusionarlo. El informe
de reconciliación no lo señala porque compara nombres de operador, y «AQ Compute» y «hscale»
no se parecen. La ficha de AQ Compute aporta 60 MW de campus; la de hscale no aporta
potencia, así que la fusión no altera ningún total, pero sí el recuento de emplazamientos de
Cataluña.

### 4.8 Y en el nivel agregado, cuatro cifras para lo mismo

La capacidad operativa de España a cierre de 2025 se publica como 385 MW IT en Iberia
(Colliers), 439 MW IT en España (Spain DC), 499 MW «de red» (CBRE) y 293 MW operativos
(DCD). El pipeline se publica como 10,5 GW, 12 GW, 8,3 GW y más de 12,7 GW según quién
sume. Ninguna de estas cifras está cargada en el dataset, y hacen bien en no estarlo. Pero
si el mapa se publica junto a un titular de sector, hay que elegir una y decir cuál.

---

## 5. El sesgo del conjunto: lo que este mapa mide de verdad

La investigación se hizo casi sin buscador: Google, Bing, DuckDuckGo, Startpage, Brave,
Mojeek y las instancias de SearXNG devolvieron captcha, 403 o resultados vacíos. El trabajo
salió de abrir URL directamente, de los feeds RSS de Google News, de los buscadores internos
de Data Center Market y pv magazine, de la API de PeeringDB y de proxies de extracción de
texto para las páginas tras Cloudflare.

El sesgo que eso deja no es aleatorio.

**El mapa mide la accesibilidad automatizada de las fuentes tanto como mide la realidad
industrial.** Un proyecto entra en el dataset si, y solo si, existe al menos un documento
sobre él que se pueda abrir sin buscador desde una máquina. Eso favorece tres cosas: los
boletines con endpoint navegable, las compañías con sala de prensa abierta, y la prensa que
no bloquea el acceso automatizado.

Aragón cumple las tres. Su boletín expone un buscador de texto completo por HTTP con salida
JSON, y además la legislación aragonesa obliga a que cualquier centro de datos de escala
relevante pase por una declaración de inversión de interés autonómico, un Plan de Interés
General o una autorización ambiental integrada de INAGA. Las tres cosas se publican en el
BOA. El resultado es que **las 25 fichas de Aragón tienen fuente oficial, con coordenadas
UTM de expediente en siete de ellas, y 19 tienen dato de conexión eléctrica**.

Cataluña y Levante no cumplen ninguna. El DOGC es inaccesible por `govern.cat`; el DOGV y el
BORM publican buscadores JavaScript sin endpoint. Cataluña acaba con **6 fuentes oficiales
en 32 fichas y una sola ficha con conexión eléctrica**; la Comunitat Valenciana y Murcia,
con 1 y 0 fuentes oficiales sobre 22 fichas conjuntas, y **ninguna ficha que cite una
declaración de impacto ambiental, una autorización de instalación eléctrica o un anuncio de
información pública**.

### Lo que no debe concluirse de este mapa

Con la misma claridad, y por orden de gravedad del error:

1. **Que Aragón tenga más fichas que Cataluña no significa que tenga más centros de datos.**
   Aragón tiene 25 fichas y Cataluña 32. Lo que Aragón tiene es un boletín consultable. La
   propia Generalitat identificó en abril de 2026 **26 iniciativas privadas que suman cerca
   de 2.000 MW**, repartidas en siete polos, y de esa lista el mapa recoge una fracción. En
   Anoia se sabe que hay cuatro proyectos y ninguno tiene ficha.

2. **Que una comunidad tenga pocas fichas no significa que tenga poca actividad.** Andalucía
   tiene 15 emplazamientos. Endesa, gestora de las solicitudes de acceso desde 2022, publica
   una cola de 305 solicitudes, 5.133 MW, en 75 municipios andaluces. Jaén tiene cero
   fichas y cinco solicitudes de acceso. Que la mayoría de esas solicitudes sean anónimas o
   especulativas es exactamente el punto: no se pueden fichar, pero tampoco se pueden ignorar
   al interpretar el vacío.

3. **Que un mapa muestre 163 emplazamientos no significa que haya 163 centros de datos.**
   Hay campus con varios edificios en una sola ficha (Digital Realty Julián Camarillo agrupa
   cinco; Equinix Alcobendas agrupa cuatro; Iron Mountain San Fernando agrupa ocho) y hay al
   menos un duplicado vivo (sección 4.7). El recuento de fichas es una unidad editorial, no
   física.

4. **Que las cifras de potencia sean comparables entre sí.** No lo son. Cuatro fichas
   operativas de Madrid publican MW IT medidos; siete de Aragón publican megavatios térmicos
   de motor diésel; una docena de proyectos anunciados publican objetivos de campus a diez
   años. Ponerlos en el mismo eje es un error de categoría, y el dataset da los medios para
   evitarlo (el campo `tipo`), pero solo si la visualización los respeta.

5. **Que la ausencia de proyectos paralizados signifique que no los hay.** En Cataluña no se
   localizó ninguno pese a buscarlos expresamente, y hay oposición organizada documentada en
   Ribera d'Ebre y en Lleida. En todo el dataset hay 1 paralizado y 3 cancelados, y los tres
   cancelados son valencianos, precisamente porque en Levante apareció el rastro documental
   del rechazo de conexión de Catadau y del concurso fallido de los Docks.
   La escasez de proyectos caídos es un artefacto de qué se publica, no una propiedad del
   sector.

6. **Que la capa eléctrica cubre España.** Cubre ocho comunidades. Veinte fichas están en
   comunidades sin ninguna subestación ni nudo cargado.

Dicho esto, y para no dejar solo la parte negativa: el sesgo está declarado por escrito en
los diez dossieres, cada cifra tiene URL y cita literal, ninguna potencia se convirtió entre
tipos, ninguna coordenada se inventó y los proyectos descartados están listados con su
motivo. Un dataset con estos huecos y esta trazabilidad es más útil que uno completo y
opaco. El problema no es lo que falta. El problema sería publicarlo sin decir qué falta.

---

## 6. Trabajo pendiente, por orden de retorno

1. **Abrir los boletines autonómicos que quedaron cerrados, empezando por el DOGC y el
   DOGV.** Es la única acción que corrige simultáneamente los tres déficits: fuentes
   oficiales, MW de conexión y proyectos no descubiertos. Aragón demuestra el efecto: 100% de
   fichas con fuente oficial y 76% con dato de red. Vías a probar antes de darlo por
   imposible: descarga directa de PDF por número y fecha de boletín, portales de
   transparencia, sedes de las ponencias ambientales, y peticiones POST desde un cliente que
   las soporte. Prioridad por volumen de fichas afectadas: DOGC (32), DOGV y BORM (22), BOCM
   (34), DOCM y BOCYL y DOE (15), BOPV (7).

2. **Crear las 31 fichas de la sección 3.** Tienen municipio y compañía. Cinco de ellas están
   fuera de los hubs y en provincias hoy vacías (Albacete, Soria) o casi vacías
   (Guadalajara). Empezar por las tres del apartado 3.3, que no requieren búsqueda nueva.

3. **Resolver Escatrón antes de publicar nada.** Repsol y Ignis/DayOne, mismo municipio,
   entre 300 y 700 MW en juego, cero fichas. Es un error potencial de gran tamaño en un
   municipio pequeño, del tipo que desacredita un mapa entero.

4. **Fusionar `aq-compute-cerdanyola-parc-alba` y `hscale-cerdanyola-parc-alba`**, y añadir
   al script de reconciliación una comprobación por coordenadas idénticas además de por
   nombre de operador. El duplicado de Espanix que sí detectó el script confirma que la
   comprobación geográfica funciona; solo hay que aplicarla también cuando el operador
   difiere.

5. **Dar identificador a la conexión eléctrica.** Añadir `subestacion_id` en
   `conexion_electrica` apuntando a `data/red/subestaciones.yaml`, y completar la capa con las
   subestaciones que las fichas ya citan y la capa no tiene (Penagos, La Mudarra, Sidegasa,
   Escúzar, Arañuelo, Valdecaballeros, Calera y Chozas, Els Aubals). Hoy solo 16 de 36
   referencias casan.

6. **Extender la capa eléctrica a las siete comunidades que faltan**, o marcar explícitamente
   en la interfaz que allí no hay datos de red. Veinte fichas están sobre un mapa eléctrico en
   blanco, y ahora mismo nada distingue «no hay capacidad» de «el dato no está cargado».

7. **Unificar los nombres de comunidad entre capas** (`Comunitat Valenciana` frente a
   `Comunidad Valenciana`, `Navarra` frente a `Comunidad Foral de Navarra`). Es una hora de
   trabajo y desbloquea cualquier agregación cruzada.

8. **Geocodificar los 22 activos renovables** contra una fuente oficial de municipios, y
   poblar `cpds_relacionados` donde la fuente lo permita. La capa existe y no se puede
   dibujar.

9. **Perseguir el pipeline de Madrid.** CBRE cifraba en agosto de 2025 en 554 MW los
   proyectos en tramitación en la Comunidad, y Colliers en 628 MW a cinco años. Las 34 fichas
   madrileñas no explican ese volumen: la cobertura estimada no llega al 40% de lo
   anunciado. Dos listados públicos sin explotar: los 17 proyectos de Especial Interés
   del Acelerador de Inversiones de la Comunidad de Madrid (11 de ellos son CPD) y los 26
   proyectos estratégicos de la Generalitat.

10. **Cerrar los proyectos sin municipio de la sección 3.4**, empezando por los seis CPD de
    la Ribera de Navarra (382 MW, una sola ficha en toda la comunidad) y el CPD de Inditex en
    Arteixo.

11. **Barrer explícitamente lo que hoy figura como vacío**: Girona, Camp de Tarragona, Jaén,
    Almería y el corredor del Henares en Guadalajara. Ninguno de los cinco tiene hoy evidencia
    de ausencia, solo ausencia de evidencia, y son cinco huecos que un lector interpretará
    como una afirmación.

12. **Decidir qué se hace con las estaciones de aterraje de cable submarino.** Hay diez
    fichas (Conil, Zahara, Estepona, Almería, Sopelana, Santander, Sagunto, Alicante, Sant
    Adrià de Besòs y València) que no son centros de datos de colocation. Están bien
    documentadas y bien anotadas, pero mezclan dos categorías en el mismo mapa. O se separan
    en una capa propia, o se explica en la leyenda.
