# Detalle de la cobertura

Cifras contadas sobre `src/data/*.json` el 31 de agosto de 2026.

El registro cubre bien quién promueve centros de datos en España y dónde, siempre que el
proyecto sea grande y tenga prensa. Cubre mal cuánta potencia hay, y muy mal cómo se
conecta esa potencia a la red.

- 39 de 164 fichas (24 %) publican alguna cifra de MW con el tipo declarado. En el resto no
  hay potencia (63 fichas) o la hay sin saber a qué magnitud corresponde (62 fichas).
- 51 de 164 (31 %) citan al menos una fuente oficial. De las 86 fuentes oficiales del
  conjunto, 45 son del Boletín Oficial de Aragón.
- 39 de 164 (24 %) tienen bloque `conexion_electrica`. Solo 9 tienen MW concedidos.

---

## Emplazamientos por comunidad y estado

| Comunidad | Total | Operativo | Parcial. oper. | Ampl. en constr. | En constr. | Permisos conc. | En tramitación | Anunciado | Paralizado | Cancelado | Desconocido |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Comunidad de Madrid | 34 | 17 | 1 | 3 | 5 | 0 | 1 | 2 | 0 | 0 | 5 |
| Cataluña | 31 | 19 | 0 | 0 | 6 | 0 | 2 | 4 | 0 | 0 | 0 |
| Aragón | 25 | 3 | 0 | 0 | 0 | 4 | 9 | 8 | 1 | 0 | 0 |
| Comunidad Valenciana | 18 | 9 | 0 | 1 | 1 | 0 | 2 | 2 | 0 | 3 | 0 |
| Andalucía | 15 | 7 | 0 | 0 | 3 | 0 | 3 | 1 | 0 | 0 | 1 |
| País Vasco | 7 | 4 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| Castilla-La Mancha | 6 | 1 | 0 | 0 | 0 | 1 | 0 | 4 | 0 | 0 | 0 |
| Galicia | 5 | 3 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| Extremadura | 5 | 0 | 0 | 0 | 0 | 0 | 2 | 3 | 0 | 0 | 0 |
| Castilla y León | 4 | 1 | 0 | 0 | 0 | 0 | 2 | 1 | 0 | 0 | 0 |
| Región de Murcia | 4 | 2 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| Asturias | 3 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| Cantabria | 3 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 |
| La Rioja | 2 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| Navarra | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| Sin comunidad asignada | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| **Total** | **164** | **69** | **2** | **4** | **18** | **7** | **23** | **31** | **1** | **3** | **6** |

Baleares, Canarias, Ceuta y Melilla no tienen ficha: el encargo era peninsular. Quedan
fuera los aterrajes de cable canarios y el nodo de Baleares.

La ficha sin comunidad es `echelon-iberdrola-madrid-sur`, que tampoco tiene municipio ni
coordenadas. Nadie ha publicado dónde está.

---

## Potencia

| | Fichas | % de 164 |
|---|---:|---:|
| Sin ninguna cifra de potencia | 63 | 38 % |
| Con alguna cifra | 101 | 62 % |
| Con al menos un valor de **MW IT** | 28 | 17 % |
| Con al menos un valor de **MW de conexión** | 22 | 13 % |
| Con al menos un valor tipado (IT o conexión) | **39** | **24 %** |
| Solo con MW sin tipificar | 62 | 38 % |

196 registros individuales de potencia, repartidos así. Las sumas no deben publicarse como
totales: las magnitudes no son comparables entre sí y varias fichas dan varias lecturas de
lo mismo.

| Tipo | Registros | MW acumulados |
|---|---:|---:|
| `no_especificado` | 101 | 6.837 |
| `it` | 45 | 5.167 |
| `termica_respaldo` | 11 | 3.314 |
| `conexion_red` | 26 | 3.256 |
| `generacion_asociada` | 2 | 1.160 |
| `instalada_total` | 11 | 794 |

Los 3.314 MW de `termica_respaldo` son megavatios térmicos de grupos electrógenos diésel,
casi todos de las autorizaciones ambientales de AWS en Aragón. No son carga informática ni
demanda de red, y quedan fuera de todos los totales del sitio. Los 1.160 MW de
`generacion_asociada` son plantas de generación en el mismo emplazamiento, no capacidad del
centro. Sumar cualquiera de las dos columnas con las demás produce una cifra sin sentido
físico.

De las 71 fichas operativas o parcialmente operativas, 6 publican MW IT y 35 no publican
ninguna potencia. El registro no está en condiciones de decir cuánta capacidad hay en
servicio en España.

---

## Precisión de la ubicación

| Precisión | Fichas | % |
|---|---:|---:|
| Exacta | 44 | 27 % |
| Aproximada (polígono, parque) | 50 | 30 % |
| Municipio | 67 | 41 % |
| Desconocida | 3 | 2 % |

Tres fichas no tienen coordenadas y no aparecen en el mapa: `aws-huesca-plhus-sur`,
`acciona-ignis-segovia` (municipio sin identificar) y `echelon-iberdrola-madrid-sur`
(ubicación sin publicar).

Andalucía tiene quince fichas y ninguna coordenada exacta. Aragón, con menos fichas que
Madrid o Cataluña, tiene más datos de conexión eléctrica que las dos juntas.

---

## Fuentes

465 citas sobre 353 referencias distintas, 2,8 citas por ficha de media. Diecinueve fichas
se sostienen sobre una sola fuente; el máximo son 10. Confianza declarada: alta 23, media
90, baja 51.

| Tipo de fuente | Citas | % |
|---|---:|---:|
| Prensa general | 100 | 21,5 % |
| Oficial | 86 | 18,5 % |
| Empresa | 80 | 17,2 % |
| Prensa especializada | 75 | 16,1 % |
| Otro (directorios, PeeringDB, Wikidata) | 71 | 15,3 % |
| Asociación | 47 | 10,1 % |
| Consultora | 6 | 1,3 % |

Origen de las 86 citas oficiales, repartidas entre 31 emisores:

| Origen | Citas |
|---|---:|
| Boletín Oficial de Aragón | 45 |
| Gobierno de Aragón (memorias de PIGA) | 5 |
| ACCIÓ (Generalitat de Catalunya) | 3 |
| Parque Tecnológico de Andalucía | 3 |
| Diario Oficial de Galicia | 2 |
| Principado de Asturias | 2 |
| Ayuntamiento de Conil de la Frontera | 2 |
| Resto (24 emisores, 1 cita cada uno) | 24 |

**Solo tres boletines autonómicos aparecen citados: el BOA (45 veces), el DOG (2) y el BOJA
(1).** Ninguna cita del BOCM, DOGC, DOGV, BORM, BOPV, DOCM, BOCyL, DOE, BON, BOR ni BOPA.
El boletín aragonés es el único que expone un buscador consultable por URL; los demás
obligan a rellenar formularios a mano. Aragón no está mejor cubierto por mérito propio,
sino porque su boletín se puede leer.

---

## Conexión eléctrica

| | Fichas |
|---|---:|
| Con bloque `conexion_electrica` | 39 (24 %) |
| Con subestación nombrada | 37 |
| Con tensión declarada | 27 |
| Con titular de red identificado | 18 |
| Con **MW concedidos** | **9** |
| Con **MW solicitados** | **4** |

Nueve fichas sobre 164 tienen MW de acceso concedidos. Todo lo demás que se diga sobre
potencia de conexión sale de declaraciones de promotor, no de resoluciones.

---

## Las otras dos capas

**Capa eléctrica.** 133 subestaciones y 548 nudos con capacidad publicada, más 41
actuaciones de planificación. La capacidad cubre ocho comunidades, no diecisiete: Andalucía,
Aragón, Castilla-La Mancha, Cataluña, Comunidad Valenciana, Comunidad de Madrid,
Extremadura y País Vasco. Faltan Asturias, Cantabria, Castilla y León, Galicia, La Rioja,
Navarra y Murcia, que suman 22 fichas de emplazamiento sin ninguna capa de red debajo.
Además, 35 de las 133 subestaciones no tienen coordenadas y no se dibujan.

El cruce entre capas no funciona. `conexion_electrica.subestacion` es texto libre, sin
identificador que apunte a `data/red/`, así que solo 17 de las 37 subestaciones citadas en
las fichas casan con la capa eléctrica. Buena parte del resto no son nombres de nudo sino
descripciones («subestación propia dentro del campus», «dos subestaciones no
identificadas»), pero cuatro sí son subestaciones reales que la capa no incluye (Penagos,
La Mudarra, Sidegasa, Escúzar) y otras cuatro están en el fichero de capacidad y no en el
de subestaciones (Arañuelo, Valdecaballeros, Calera y Chozas, Els Aubals).

**Capa renovable.** 22 activos, de los que 8 tienen coordenadas. Los demás van a `null`
antes que a un centroide inventado. Nueve no tienen ni comunidad autónoma, porque la fuente
anuncia un PPA sin decir dónde están las plantas, y solo 4 de 22 tienen
`cpds_relacionados` poblado.

---

## Contradicciones abiertas

390 incertidumbres en 162 de las 164 fichas, 2,4 de media.

| Campo en disputa | Incertidumbres |
|---|---:|
| Potencia | 140 |
| Ubicación | 76 |
| Estado del proyecto | 49 |
| Inversión anunciada | 30 |
| Operador o propietario | 21 |
| Superficie de parcela | 19 |
| Conexión eléctrica | 11 |
| Superficie construida | 10 |
| Fecha de puesta en servicio | 10 |
| Tipo de instalación | 9 |
| Refrigeración | 4 |
| Otros | 11 |

Solo 6 de las 390 mencionan consumo hídrico, y el agua es el eje de la contestación social
en Talavera, Picassent y las Terres de l'Ebre y el objeto del real decreto que el Gobierno
preparaba en agosto de 2026. No es que las fuentes coincidan. Es que casi nadie publica el
dato, así que no hay dos cifras que puedan contradecirse. Cuando las hay, el desacuerdo es
brutal.

Las que más cambiarían el mapa si se resolvieran:

**Escatrón: 300 MW, 400 MW, o 700.** Repsol anunció que prepara la subestación de Escatrón
«para la llegada de un gran centro de datos» sin identificar operador; Ignis y DayOne
anunciaron un campus de 300 MW en el mismo municipio. Ninguno de los dos tiene ficha. Si
son el mismo proyecto y se crean dos fichas, el mapa contará entre 300 y 400 MW de más en
un municipio de 1.000 habitantes. Si son distintos y no se crea ninguna, faltan 700 MW.

**AWS en Aragón: 3.000 MW de calor que no son capacidad.** Las autorizaciones ambientales
integradas de INAGA son la mejor fuente documental del conjunto, con coordenadas UTM y
expediente, y ninguna publica MW IT. Lo que publican es la potencia térmica nominal de los
grupos electrógenos diésel de respaldo: 327, 342, 750 y 1.169 MWt. Ninguna cifra pública
permite decir cuánta carga informática tiene AWS en España.

**Merlin no cuadra consigo misma.** El campus de Arasur (Ribera Baja, Álava) tiene cuatro
cifras vivas: 100 MW en el proyecto de 2022, 118 MW de capacidad crítica en la ficha de
Edged, 300 MW IT en la nota corporativa de diciembre de 2024 y 350 MW IT en prensa
económica que no se pudo abrir. En Botorrita conviven 144 MW IT (nota propia), 150 MW
(prensa) y 476,8 MW, que es potencia renovable conectada y no capacidad del centro. Y las
fases I, II y III suman 724 MW IT frente a los 730 MW del titular corporativo. Merlin es el
mayor promotor español por MW anunciados, así que su descuadre condiciona cualquier total
nacional.

**Meta en Talavera: un factor 24 en el consumo de agua.** Cuatro cifras sucesivas, todas
conservadas en la ficha: 4.800 millones de litros al año en una ficha divulgativa local;
2,2 a 2,9 millones de m³ al año como consumo «inicialmente previsto»; 504.500 m³ al año en
el informe ambiental; y 0,2 hm³ al año en la documentación de 2026. Es el proyecto mejor
trazado administrativamente del centro peninsular, con nueve hitos fechados desde 2022, y
nadie sabe cuánta agua va a consumir. Los 248 MW que circulan salen de una ficha
divulgativa de una asociación empresarial.

**EdgeMode en Córdoba: era Torrecampo.** *Resuelto el 31 de agosto de 2026.* La ficha
`edgemode-torrecampo-green-dc` tenía 300 MW repartidos de un agregado de 1,5 GW entre cinco
campus —Cáceres, Vianos, Córdoba, Palma del Río y Mora— entre los que Torrecampo no
figuraba. No hay sexto emplazamiento: **«Palma» es como el comprador designa a Torrecampo**.
El *term sheet* de Pure Data Centres Group habla de «Cordoba, Palma, Vianos and Caceres», y
la palabra «Palma» aparece en solo tres documentos de todo el archivo de EdgeMode en la SEC,
los tres del mismo paquete de julio de 2026. El 10-Q de agosto de 2026, posterior al
preacuerdo, sigue enumerando cinco arrendamientos «in the Spain cities of Malpica, Caceres,
Vianos, Cordoba and Torrecampo», sin ninguna Palma. Descartadas Córdoba, Vianos y Cáceres, y
estando Malpica bajo exclusividad con otro comprador, el cuarto suelo solo puede ser
Torrecampo. Los 300 MW pasan a apoyarse en el nombre de la sociedad vehículo en el 10-Q, y
la parcela queda fijada: nueve fincas y 119,4 hectáreas, con sus referencias catastrales
verificadas una a una. La identificación es por eliminación, porque ningún documento dice
literalmente «Palma = Torrecampo»; lo cerraría el contrato de compraventa vinculante.

De paso queda claro que **«Malpica» tampoco es un municipio**, sino el nombre de la finca:
las parcelas están en Mora y Villamuelas (Toledo), que es donde ya las sitúa la ficha
`edgemode-mora-malpica-ai`.

**Echelon-Iberdrola: uno, dos o tres proyectos.** La ficha `echelon-iberdrola-madrid-sur`
existe sin municipio, sin provincia y sin comunidad. La nota legible habla de «Madrid Sur»
con 160.000 m², 144 MW de procesamiento y 230 MW de conexión asegurada, sin situarlo. Un
recopilatorio lo sitúa en «Aceca (Madrid)», pero la central de Aceca está en Villaseca de
la Sagra, Toledo. Un tercer medio describe un CPD de Iberdrola en el polígono de Toledo
capital, que tiene ficha propia. Y DCD atribuye a la misma sociedad un segundo
emplazamiento en Velilla del Río Carrión, Palencia. Cuatro topónimos en tres comunidades
para lo que puede ser un solo proyecto.

**Cuatro cifras nacionales para lo mismo.** La capacidad operativa de España a cierre de
2025 se publica como 385 MW IT en Iberia (Colliers), 439 MW IT en España (Spain DC), 499 MW
«de red» (CBRE) y 293 MW operativos (DCD). El pipeline, como 10,5 GW, 12 GW, 8,3 GW y más
de 12,7 GW según quién sume. Ninguna está cargada en el conjunto.

---

## Lo que no debe concluirse

1. **Que Aragón tenga más fichas que Cataluña no significa que tenga más centros de
   datos.** Aragón tiene 25 fichas y Cataluña 31. Lo que Aragón tiene es un boletín
   consultable. La propia Generalitat identificó en abril de 2026 veintiséis iniciativas
   privadas que suman cerca de 2.000 MW en siete polos, y de esa lista el mapa recoge una
   fracción. En Anoia hay cuatro proyectos y ninguna ficha.

2. **Que una comunidad tenga pocas fichas no significa que tenga poca actividad.**
   Andalucía tiene 15 emplazamientos. Endesa, gestora de las solicitudes de acceso desde
   2022, publica una cola de 305 solicitudes, 5.133 MW, en 75 municipios andaluces. Jaén
   tiene cero fichas y cinco solicitudes de acceso. Que la mayoría de esas solicitudes sean
   anónimas o especulativas es el punto: no se pueden fichar, pero tampoco se pueden
   ignorar al interpretar el vacío.

3. **Que haya 164 emplazamientos no significa que haya 164 centros de datos.** Hay campus
   con varios edificios en una sola ficha (Digital Realty Julián Camarillo agrupa cinco,
   Equinix Alcobendas cuatro, Iron Mountain San Fernando ocho). El recuento de fichas es una
   unidad editorial, no física.

4. **Que las cifras de potencia sean comparables entre sí.** Seis fichas operativas
   publican MW IT medidos; diez publican megavatios térmicos de motor diésel; veinte
   proyectos en desarrollo publican objetivos de campus a diez años. Ponerlos en el mismo eje
   es un error de categoría.

5. **Que la ausencia de proyectos paralizados signifique que no los hay.** En todo el
   conjunto hay 1 paralizado y 3 cancelados, y los tres cancelados son valencianos porque
   en Levante apareció el rastro documental del rechazo de conexión de Catadau y del
   concurso fallido de los Docks. En Cataluña no se localizó ninguno pese a buscarlos, y hay
   oposición organizada documentada en Ribera d'Ebre y en Lleida.

6. **Que la capa eléctrica cubra España.** Cubre ocho comunidades. Veintidós fichas están
   en comunidades sin ninguna subestación ni nudo cargado.

---

## Trabajo pendiente

1. **Abrir los boletines autonómicos que quedaron cerrados**, empezando por el DOGC y el
   DOGV. Es la única acción que corrige a la vez los tres déficits: fuentes oficiales, MW
   de conexión y proyectos no descubiertos. Prioridad por fichas afectadas: BOCM (34), DOGC
   (31), DOGV y BORM (22), DOCM, BOCyL y DOE (15), BOPV (7).
2. **Dar identificador a la conexión eléctrica**: `subestacion_id` en `conexion_electrica`
   apuntando a `data/red/subestaciones.yaml`, y completar la capa con las subestaciones que
   las fichas ya citan. Hoy solo 17 de 37 referencias casan.
3. **Extender la capa eléctrica a las siete comunidades que faltan**, o marcar en la
   interfaz que allí no hay datos. Ahora nada distingue «no hay capacidad» de «el dato no
   está cargado».
4. **Geocodificar los 14 activos renovables que siguen sin coordenadas** contra una fuente
   oficial de municipios, y poblar `cpds_relacionados` donde la fuente lo permita.
5. **Perseguir el pipeline de Madrid.** CBRE cifraba en agosto de 2025 en 554 MW los
   proyectos en tramitación en la Comunidad, y Colliers en 628 MW a cinco años. Las 34
   fichas madrileñas no explican ese volumen. Dos listados públicos sin explotar: los 17
   proyectos de Especial Interés del Acelerador de Inversiones de la Comunidad de Madrid
   (11 son CPD) y los 26 proyectos estratégicos de la Generalitat.
6. **Barrer lo que hoy figura como vacío**: Girona, Camp de Tarragona, Jaén, Almería y el
   corredor del Henares en Guadalajara. Ninguno tiene evidencia de ausencia, solo ausencia
   de evidencia, y un lector los leerá como una afirmación.
7. **Decidir qué se hace con las estaciones de aterraje de cable submarino.** Las diez
   fichas de Conil, Zahara, Estepona, Almería, Sopelana, Santander, Sagunto, Alicante, Sant
   Adrià de Besòs y València no son centros de datos de colocation. O se separan en una capa
   propia, o se explica en la leyenda.
