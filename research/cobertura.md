# Detalle de la cobertura

Cifras contadas sobre `src/data/*.json` el 31 de agosto de 2026, con 201 fichas.

El registro cubre bien quién promueve centros de datos en España y dónde, siempre que el
proyecto sea grande y tenga prensa. Cubre mal cuánta potencia hay, y muy mal cómo se
conecta esa potencia a la red.

- 78 de 201 fichas (39 %) publican alguna cifra de MW con el tipo declarado. En el resto no
  hay potencia (63 fichas) o la hay sin saber a qué magnitud corresponde (45 fichas).
- 87 de 201 (43 %) citan al menos una fuente oficial. De las 253 citas oficiales del
  conjunto, 105 son del Boletín Oficial de Aragón.
- 51 de 201 (25 %) tienen bloque `conexion_electrica`. Solo 15 tienen MW concedidos.
- 21 de 201 (10 %) publican qué cómputo alojan. Diecisiete de esas veintiuna son
  infraestructura pública de supercomputación o de cuántica: el sector comercial casi nunca
  publica su hardware. Detalle en `computo.md`.

---

## Emplazamientos por comunidad y estado

| Comunidad | Total | Operativo | Parcial. oper. | Ampl. en constr. | En constr. | Permisos conc. | En tramitación | Anunciado | Paralizado | Cancelado | Desconocido |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Comunidad de Madrid | 44 | 21 | 2 | 4 | 8 | 2 | 1 | 5 | 0 | 0 | 1 |
| Cataluña | 36 | 20 | 1 | 0 | 5 | 0 | 2 | 8 | 0 | 0 | 0 |
| Aragón | 28 | 4 | 0 | 0 | 0 | 4 | 8 | 8 | 2 | 2 | 0 |
| Andalucía | 19 | 9 | 0 | 2 | 2 | 0 | 4 | 1 | 0 | 0 | 1 |
| Comunidad Valenciana | 19 | 10 | 0 | 1 | 1 | 0 | 3 | 1 | 0 | 3 | 0 |
| País Vasco | 9 | 5 | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| Galicia | 8 | 6 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| Castilla-La Mancha | 8 | 2 | 0 | 0 | 0 | 1 | 1 | 3 | 1 | 0 | 0 |
| Extremadura | 7 | 1 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 0 | 0 |
| Castilla y León | 6 | 1 | 0 | 0 | 2 | 0 | 2 | 1 | 0 | 0 | 0 |
| Cantabria | 4 | 1 | 0 | 0 | 0 | 0 | 1 | 2 | 0 | 0 | 0 |
| Región de Murcia | 4 | 2 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| Asturias | 3 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| Navarra | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 |
| La Rioja | 2 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| Sin comunidad asignada | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| **Total** | **201** | **85** | **4** | **7** | **21** | **9** | **27** | **37** | **4** | **5** | **2** |

**La regla de alcance peninsular se retiró el 1 de septiembre de 2026.** El criterio
geográfico es ahora la nacionalidad del territorio: península, Baleares, Canarias, Ceuta y
Melilla. Se cambió al ver lo que excluía —el nodo LaPalma de la RES, el centro neutro D-ALiX
de Tenerife y las estaciones de cable canarias y baleares—, y las dos primeras fichas
canarias entraron ese mismo día. Quedan pendientes de fichar las estaciones de cable de
Canalink en Tenerife y Gran Canaria, la de IslaLink en Palma de Mallorca e Ibiza y el centro
de Vodafone en Marratxí. Ver `computo.md`.

La **capa eléctrica sigue siendo peninsular**, y no es un hueco por rellenar: Red Eléctrica
publica capacidad de acceso para el sistema peninsular, y los sistemas canario y balear son
eléctricamente independientes. Un emplazamiento insular tiene ficha y no tiene red debajo.
La ventana inicial del mapa también está centrada en la península, así que las fichas
canarias existen pero no se ven al cargar sin desplazar la vista.

El salto de 191 a 201 fichas es el barrido de infraestructura de cómputo público de agosto de
2026: se incorporaron los siete nodos peninsulares de la RES que faltaban (Picasso, Tirant,
Agustina, Magerit, Cibeles, LUSITANIA III y el PIC), el CPD del CITIC en A Coruña y las dos
instalaciones cuánticas y de comunicación óptica de la Universidade de Vigo. Galicia pasó de
5 a 8 fichas y Extremadura y Madrid ganaron una cada una.

La ficha sin comunidad es `echelon-iberdrola-madrid-sur`, que tampoco tiene municipio ni
coordenadas. Nadie ha publicado dónde está.

---

## Potencia

| | Fichas | % de 201 |
|---|---:|---:|
| Sin ninguna cifra de potencia | 63 | 31 % |
| Con alguna cifra | 138 | 69 % |
| Con al menos un valor de **MW IT** | 50 | 25 % |
| Con al menos un valor de **MW de conexión** | 38 | 19 % |
| Con al menos un valor tipado (IT o conexión) | **78** | **39 %** |
| Solo con MW sin tipificar | 45 | 22 % |

328 registros individuales de potencia, repartidos así. Las sumas no deben publicarse como
totales: las magnitudes no son comparables entre sí y varias fichas dan varias lecturas de
lo mismo.

| Tipo | Registros | MW acumulados |
|---|---:|---:|
| `no_especificado` | 145 | 10.422 |
| `it` | 82 | 8.156 |
| `conexion_red` | 47 | 5.090 |
| `termica_respaldo` | 20 | 4.176 |
| `generacion_asociada` | 11 | 3.998 |
| `instalada_total` | 23 | 1.336 |

Los 4.176 MW de `termica_respaldo` son megavatios térmicos de grupos electrógenos diésel,
casi todos de las autorizaciones ambientales de AWS en Aragón. No son carga informática ni
demanda de red, y quedan fuera de todos los totales del sitio. Los 3.998 MW de
`generacion_asociada` son plantas de generación en el mismo emplazamiento, no capacidad del
centro: dos tercios salen de los dos proyectos de Escatrón, que se apoyan cada uno en un
ciclo combinado existente. Sumar cualquiera de las dos columnas con las demás produce una
cifra sin sentido físico.

De las 79 fichas operativas o parcialmente operativas, 11 publican MW IT y 31 no publican
ninguna potencia. El registro sigue sin estar en condiciones de decir cuánta capacidad hay
en servicio en España.

---

## Precisión de la ubicación

| Precisión | Fichas | % |
|---|---:|---:|
| Exacta | 45 | 24 % |
| Aproximada (polígono, parque) | 58 | 30 % |
| Municipio | 75 | 39 % |
| Desconocida | 13 | 7 % |

Trece fichas no tienen coordenadas propias. De ellas, `echelon-iberdrola-madrid-sur` y
`acciona-ignis-segovia` no tienen ni municipio con el que derivar un centroide, así que no
aparecen en el mapa. Las once restantes se dibujan en el centro de su municipio, marcadas
como derivadas: `aws-huesca-plhus-sur`, `adequa-santa-barbara`, `adequa-odena-d-hub-can-morera`,
`apto-fuenlabrada-madrid-one`, `ibm-euskadi-donostia-computacion-cuantica`,
`ferrovial-alcobendas-valdelacasa`, `scranton-alcover-iberdata`, `nasertic-pamplona-orkoien`,
`nostrum-pinto`, `oxigen-sant-fruitos-de-bages` y `prime-alcobendas-mad01`.

Que dos de cada cinco fichas estén situadas solo en el centro de su municipio es el límite
duro del conjunto: sirve para contar proyectos por comarca, no para cruzarlos con una
parcela, un acuífero o una línea.

---

## Fuentes

986 citas sobre 756 referencias distintas, 5,2 citas por ficha de media. Ninguna ficha se
sostiene ya sobre una sola fuente; el máximo son 15. Confianza declarada: alta 18, media
124, baja 49.

| Tipo de fuente | Citas | % |
|---|---:|---:|
| Prensa general | 246 | 24,9 % |
| Oficial | 213 | 21,6 % |
| Empresa | 189 | 19,2 % |
| Prensa especializada | 159 | 16,1 % |
| Otro (directorios, PeeringDB, Wikidata) | 104 | 10,5 % |
| Asociación | 53 | 5,4 % |
| Consultora | 22 | 2,2 % |

Origen de las 213 citas oficiales, repartidas entre 65 emisores:

| Origen | Citas |
|---|---:|
| Administración aragonesa (102 del BOA, el resto del Gobierno de Aragón y un ayuntamiento) | 117 |
| Comunidad de Madrid y ayuntamientos madrileños | 10 |
| Administración vasca (Gobierno Vasco y parques tecnológicos) | 9 |
| Junta de Comunidades de Castilla-La Mancha | 7 |
| Junta de Extremadura y su boletín | 4 |
| Dirección General del Catastro | 4 |
| Resto (52 emisores) | 62 |

**La confianza no cuenta fuentes.** El nivel califica el respaldo de los datos centrales
—dónde está, qué es, cuánta potencia tiene—, no cuántas referencias hay: ninguna ficha se
sostiene ya sobre una sola fuente y aun así 49 están en confianza baja, casi siempre porque
nadie publica su potencia. Cada ficha muestra en su panel de trazabilidad qué le falta en
concreto, leído de sus propios campos, en lugar de una definición genérica que podía
contradecir el recuento de fuentes que tenía justo encima. En el barrido del 31 de agosto de
2026 ocho fichas que se declaraban en confianza alta mostraban una laguna en sus propios
datos —sin potencia, sin tipificar, o situadas solo en su municipio— y bajaron a media. La
validación lo comprueba ahora en cada construcción.

**El sesgo aragonés se ha agravado, no corregido.** El BOA pasa de 45 a 102 citas y sigue
siendo casi la mitad de todo lo oficial del conjunto. El barrido de agosto de 2026 comprobó
uno a uno los once boletines autonómicos y **todos responden**: el problema no es el acceso,
es el formato de publicación. El BOA da a cada resolución una URL estable con el título
completo, indexable y buscable. El DOGC esconde las suyas tras un servlet de consulta, y el
BOCM publica PDF con capa de texto titulados «D) Anuncios». Eso no se arregla pidiendo
permiso a nadie: se arregla escribiendo un raspador por boletín. Está detallado en
`research/acceso-a-fuentes.md`.

---

## Conexión eléctrica

| | Fichas |
|---|---:|
| Con bloque `conexion_electrica` | 51 (25 %) |
| Con subestación nombrada | 45 |
| Con tensión declarada | 33 |
| Con titular de red identificado | 23 |
| Con **MW concedidos** | **15** |
| Con **MW solicitados** | **8** |

Quince fichas sobre 201 tienen MW de acceso concedidos. Todo lo demás que se diga sobre
potencia de conexión sale de declaraciones de promotor, no de resoluciones. El contraste con
el dato sectorial es el titular del conjunto: SpainDC calcula que solo uno de cada cuatro MW
de acceso solicitados en España ha sido concedido, así que el pipeline en MW que publica la
prensa mide intenciones, no derechos.

---

## Los otros bloques

**Agua y refrigeración.** 68 fichas tienen bloque `agua`, pero solo 16 publican consumo
anual y 5 un WUE. El reparto de circuito es 20 cerrado, 19 sin agua, 3 híbrido y 26
desconocido: en más de un tercio de las fichas con bloque, lo único documentado es que nadie
ha publicado cómo se refrigera. Otras 88 fichas describen la refrigeración en prosa sin
ninguna magnitud. El agua es el eje de la contestación social en Talavera, Picassent y las
Terres de l'Ebre, y es el dato peor publicado de todo el sector.

**Empleo e inversión.** 53 fichas registran empleo anunciado, con 98 cifras, y 76 declaran
inversión. Casi siempre son cifras de nota de prensa sin desglose entre construcción y
operación, y así se guardan, con su tipo declarado y sin sumarse.

**Consumo eléctrico.** Solo 13 fichas publican consumo anual en GWh. Es el campo que
permitiría contrastar los MW anunciados con el uso real, y prácticamente nadie lo da.

---

## Las otras dos capas

**Capa eléctrica.** 133 subestaciones y 548 nudos con capacidad publicada, más 41
actuaciones de planificación. La capacidad cubre ocho comunidades, no diecisiete: Andalucía,
Aragón, Castilla-La Mancha, Cataluña, Comunidad Valenciana, Comunidad de Madrid,
Extremadura y País Vasco. Faltan Asturias, Cantabria, Castilla y León, Galicia, La Rioja,
Navarra y Murcia, que suman 27 fichas de emplazamiento sin ninguna capa de red debajo.
Además, 35 de las 133 subestaciones no tienen coordenadas y no se dibujan.

El cruce entre capas sigue sin funcionar. `conexion_electrica.subestacion` es texto libre,
sin identificador que apunte a `data/red/`, así que solo 21 de las 45 subestaciones citadas
en las fichas casan con la capa eléctrica. Buena parte del resto no son nombres de nudo sino
descripciones («subestación propia dentro del campus», «dos subestaciones no
identificadas»), pero otras sí son subestaciones reales que la capa no incluye.

**Capa renovable.** 22 activos, de los que 8 tienen coordenadas. Los demás van a `null`
antes que a un centroide inventado. Nueve no tienen ni comunidad autónoma, porque la fuente
anuncia un PPA sin decir dónde están las plantas, y solo 4 de 22 tienen
`cpds_relacionados` poblado.

---

## Contradicciones abiertas

655 incertidumbres, al menos una en cada una de las 201 fichas, 3,3 de media.

| Campo en disputa | Incertidumbres |
|---|---:|
| Potencia | 190 |
| Ubicación | 115 |
| Estado del proyecto | 69 |
| Inversión anunciada | 49 |
| Operador o propietario | 46 |
| Superficie de parcela | 31 |
| Agua | 25 |
| Superficie construida | 23 |
| Empleo | 21 |
| Fecha de puesta en servicio | 17 |
| Conexión eléctrica | 14 |
| Tipo de instalación | 14 |
| Refrigeración | 6 |
| Otros | 22 |

Que el agua aparezca ya en 25 incertidumbres, cuando en la auditoría anterior había 6
menciones sueltas, no significa que se publique más: significa que ahora hay un campo donde
anotar que no se publica.

Las que más cambiarían el mapa si se resolvieran:

**AWS en Aragón: 4.000 MW de calor que no son capacidad.** Las autorizaciones ambientales
integradas de INAGA son la mejor fuente documental del conjunto, con coordenadas UTM y
expediente, y ninguna publica MW IT. Lo que publican es la potencia térmica nominal de los
grupos electrógenos diésel de respaldo: 327, 342, 750 y 1.169 MWt entre otros. Ninguna cifra
pública permite decir cuánta carga informática tiene AWS en España, que es el mayor operador
del país por inversión anunciada.

**Merlin no cuadra consigo misma.** El campus de Arasur (Ribera Baja, Álava) mantiene cuatro
lecturas vivas: 100 MW en el proyecto de 2022, 118 MW de capacidad crítica en la ficha de
Edged, 300 MW IT en la nota corporativa de diciembre de 2024 y 350 MW IT en prensa
económica. En Botorrita conviven 144 MW IT de nota propia, 150 MW de prensa y 227,4 MW que
son potencia renovable conectada y no capacidad del centro. Merlin es el mayor promotor
español por MW anunciados, así que su descuadre condiciona cualquier total nacional.

**Cuatro cifras nacionales para lo mismo.** La capacidad operativa de España a cierre de
2025 se publica como 385 MW IT en Iberia (Colliers), 439 MW IT en España (SpainDC), 499 MW
«de red» (CBRE) y 293 MW operativos (DCD). El pipeline, como 10,5 GW, 12 GW, 8,3 GW y más
de 12,7 GW según quién sume. Ninguna está cargada en el conjunto, y ninguna es reproducible
desde fichas.

**Echelon-Iberdrola: uno, dos o tres proyectos.** La ficha `echelon-iberdrola-madrid-sur`
existe sin municipio, sin provincia y sin comunidad. La nota legible habla de «Madrid Sur»
con 160.000 m², 144 MW de procesamiento y 230 MW de conexión asegurada, sin situarlo. Un
recopilatorio lo sitúa en «Aceca (Madrid)», pero la central de Aceca está en Villaseca de
la Sagra, Toledo. Un tercer medio describe un CPD de Iberdrola en el polígono de Toledo
capital, que tiene ficha propia. Y DCD atribuye a la misma sociedad un segundo
emplazamiento en Velilla del Río Carrión, Palencia, que dos barridos no han conseguido
confirmar con fuente primaria. Cuatro topónimos en tres comunidades para lo que puede ser un
solo proyecto.

### Cerradas en el barrido del 31 de agosto de 2026

**Escatrón: eran dos proyectos, no uno.** La duda anterior daba entre 300 y 700 MW según se
contase una ficha o dos. Son dos, junto a dos centrales distintas del mismo municipio: el
campus de DayOne e IGNIS sobre el Peaker de 285 MW, y el de Repsol sobre su ciclo combinado
de 818 MW. Cada ficha remite a la otra para que sus megavatios no se sumen nunca.

**Proyecto Búfalo: doble recuento eliminado.** Forestalia vendió a MERLIN los derechos de
acceso de María (81 MW) y Los Vientos (146,4 MW) a finales de febrero de 2026, con nota de
la compradora, su consejero delegado en acta y una comunicación a la CNMV. No hay acto del
BOA ni resolución de cambio de titular de REE, así que las fichas `forestalia-botorrita-dcm-dedalo`
y DCM Blue quedan marcadas como canceladas: 725 MW IT y 227,5 MW de acceso salieron de los
totales.

**EdgeMode en Córdoba: era Torrecampo.** «Palma» es como el comprador designa a Torrecampo.
El 10-Q de agosto de 2026, posterior al preacuerdo, enumera cinco arrendamientos «in the
Spain cities of Malpica, Caceres, Vianos, Cordoba and Torrecampo», sin ninguna Palma;
descartadas Córdoba, Vianos y Cáceres, y estando Malpica bajo exclusividad con otro
comprador, el cuarto suelo solo puede ser Torrecampo. La parcela queda fijada en nueve
fincas y 119,4 hectáreas, con sus referencias catastrales verificadas una a una. De paso
queda claro que «Malpica» tampoco es un municipio, sino el nombre de la finca: las parcelas
están en Mora y Villamuelas (Toledo).

**Meta en Talavera: el factor 24 era un error de atribución.** Los 504.500 m³/año que la
prensa lleva dos años atribuyendo al centro de datos son la demanda del ámbito urbanizado
completo del PSI. Al CPD le corresponden 40.600: 40.000 m³ de agua potable y 600 de agua
industrial, según el desglose de la DIA en el expediente PRO-SC-22-1030. La ficha conserva
las cuatro lecturas y registra la buena.

**AtlasEdge BCN002 no está en Sant Adrià de Besòs**, sino en Sant Joan Despí, donde la
propia AtlasEdge publica la dirección y el Catastro da 17.896 m² de suelo sin edificar. El
error venía de leer «close to the Barcelona Cable Landing Station» como si fuera una
dirección.

---

## Lo que no debe concluirse

1. **Que Aragón tenga menos fichas que Cataluña no significa que tenga menos actividad.**
   Aragón tiene 27 fichas y Cataluña 35, pero Aragón aporta 117 de las 213 citas oficiales
   del conjunto. Lo que Aragón tiene es un boletín consultable. La propia Generalitat
   identificó en abril de 2026 veintiséis iniciativas privadas que suman cerca de 2.000 MW
   en siete polos, y de esa lista el mapa recoge una fracción.

2. **Que una comunidad tenga pocas fichas no significa que tenga poca actividad.**
   Andalucía tiene 19 emplazamientos. Endesa, gestora de las solicitudes de acceso desde
   2022, publica una cola de 305 solicitudes, 5.133 MW, en 75 municipios andaluces. Jaén
   tiene cero fichas y cinco solicitudes de acceso. Que la mayoría de esas solicitudes sean
   anónimas o especulativas es el punto: no se pueden fichar, pero tampoco se pueden
   ignorar al interpretar el vacío.

3. **Que haya 201 emplazamientos no significa que haya 201 centros de datos.** Hay campus
   con varios edificios en una sola ficha (Digital Realty Julián Camarillo agrupa cinco,
   Equinix Alcobendas cuatro, Iron Mountain San Fernando ocho). El recuento de fichas es una
   unidad editorial, no física.

4. **Que las cifras de potencia sean comparables entre sí.** Once fichas operativas publican
   MW IT medidos; veinte registros son megavatios térmicos de motor diésel; buena parte del
   resto son objetivos de campus a diez años. Ponerlos en el mismo eje es un error de
   categoría.

5. **Que los cancelados y paralizados que hay sean todos los que hay.** El conjunto registra
   4 paralizados y 5 cancelados, y aparecen donde quedó rastro documental del fracaso: el
   rechazo de conexión de Catadau, el concurso fallido de los Docks, la venta de los derechos
   del Proyecto Búfalo. Donde no hay boletín que lo recoja, un proyecto muerto sigue
   figurando como anunciado.

6. **Que la capa eléctrica cubra España.** Cubre ocho comunidades. Veintisiete fichas están
   en comunidades sin ninguna subestación ni nudo cargado.

7. **Que una ficha con muchas fuentes esté bien documentada.** La confianza califica el
   respaldo de los datos centrales, no el número de referencias. Hay fichas con seis fuentes
   y ninguna cifra de potencia.

---

## Trabajo pendiente

1. **Raspar los boletines autonómicos que el formato deja fuera**, empezando por el DOGC y
   el DOGV. Los once responden; ninguno salvo el BOA es indexable sin escribir código. Es la
   única acción que corrige a la vez los tres déficits: fuentes oficiales, MW de conexión y
   proyectos no descubiertos.
2. **Dar identificador a la conexión eléctrica**: `subestacion_id` en `conexion_electrica`
   apuntando a `data/red/subestaciones.yaml`, y completar la capa con las subestaciones que
   las fichas ya citan. Hoy solo 21 de 45 referencias casan.
3. **Extender la capa eléctrica a las siete comunidades que faltan**, o marcar en la
   interfaz que allí no hay datos. Ahora nada distingue «no hay capacidad» de «el dato no
   está cargado».
4. **Geocodificar los 14 activos renovables que siguen sin coordenadas** contra una fuente
   oficial de municipios, y poblar `cpds_relacionados` donde la fuente lo permita.
5. **Perseguir el pipeline de Madrid.** CBRE cifraba en agosto de 2025 en 554 MW los
   proyectos en tramitación en la Comunidad, y Colliers en 628 MW a cinco años. Las 42
   fichas madrileñas no explican ese volumen. Dos listados públicos sin explotar: los
   proyectos de Especial Interés del Acelerador de Inversiones de la Comunidad de Madrid y
   los 26 proyectos estratégicos de la Generalitat.
6. **Barrer lo que hoy figura como vacío**: Girona, Camp de Tarragona, Jaén, Almería y el
   corredor del Henares en Guadalajara. Ninguno tiene evidencia de ausencia, solo ausencia
   de evidencia, y un lector los leerá como una afirmación.
7. **Decidir qué se hace con las estaciones de aterraje de cable submarino.** Las nueve
   fichas de Conil, Zahara, Estepona, Almería, Sopelana, Santander, Sagunto, Alicante y
   València no son centros de datos de colocation. O se separan en una capa propia, o se
   explica en la leyenda.
8. **Conseguir consumo de agua y de electricidad.** 16 fichas con consumo hídrico anual y 13
   con consumo eléctrico, sobre 201, es demasiado poco para decir nada agregado. Las
   declaraciones de impacto ambiental son la vía: publican caudales punta y volúmenes
   anuales que ninguna nota de prensa da.
