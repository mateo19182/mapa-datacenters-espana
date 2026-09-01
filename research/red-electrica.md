# El acceso a la red, en detalle

*Última verificación: 29 de agosto de 2026.*

## 1. Cómo funciona el acceso y la conexión a la red para demanda

### 1.1 Dos permisos, no uno

Para conectar un consumo grande a la red hacen falta dos permisos que se tramitan a la
vez pero significan cosas diferentes:

- **Permiso de acceso**: dice que *el sistema eléctrico puede suministrar* esa potencia
  en ese punto. Es una cuestión de capacidad del conjunto de la red.
- **Permiso de conexión**: dice que *físicamente se puede enganchar* ahí, que hay
  posición libre en la subestación, que el diseño es viable, y con qué obras.

El marco general es el [Real Decreto 1183/2020, de 29 de diciembre](https://www.boe.es/buscar/act.php?id=BOE-A-2020-17278),
de acceso y conexión a las redes de transporte y distribución. Para instalaciones de
demanda, la metodología concreta la fija la
[Circular 1/2024, de 27 de septiembre, de la CNMC](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-20760).

### 1.2 Quién concede qué

- **Red Eléctrica** es el gestor de la red de transporte: concede acceso y conexión en
  los nudos de 400 kV y 220 kV (y en algunos de menor tensión que forman parte de la
  red de transporte).
- **Las distribuidoras** (i-DE / Iberdrola, e-distribución / Endesa, UFD / Naturgy,
  Viesgo, y el largo censo de distribuidoras menores) conceden acceso y conexión en sus
  redes, típicamente por debajo de 220 kV.
- **Pero las dos capas están acopladas.** Si una petición en la red de distribución puede
  afectar aguas arriba, la distribuidora debe pedir a Red Eléctrica un **informe de
  aceptabilidad**; si ese informe es desfavorable, *se debe denegar el acceso*
  (Circular 1/2024, art. 5.2.b). Es decir: un proyecto de 60 kV puede morir por un
  problema en el nudo de 220 kV del que cuelga.

Ese acoplamiento se materializa en el «valor de referencia»: la porción de capacidad
del nudo de transporte que se reserva para alimentar los consumos que se conecten aguas
abajo en distribución. Es una novedad de 2025-2026 y todavía está a medio pactar: el 20
de febrero de 2026 Red Eléctrica reconocía acuerdos sobre valores de referencia en solo
el 45 % de las interfaces transporte-distribución, equivalentes a 33,1 GW
([nota de prensa de REE, 20-02-2026](https://www.ree.es/sites/default/files/2026-03/PR_demand_access_capacities.pdf)).
En los nudos sin acuerdo, el fichero de REE dice literalmente «Valor de referencia no
acordado» y no publica capacidad otorgable. No es que haya cero: es que no hay dato.

### 1.3 El criterio de reparto: prelación temporal, con excepciones

El criterio general es la prelación temporal: primero en registrar la solicitud
completa, primero en la cola (RD 1183/2020, art. 7.1). La fecha que cuenta es la de
*admisión a trámite*; si hay que subsanar, la fecha se mueve al momento en que la
documentación está correcta y completa.

Hay tres excepciones, todas recientes y todas relevantes para los CPD:

1. **Concursos de capacidad de demanda** (arts. 20 bis a 20 quater del RD 1183/2020,
   introducidos por el RDL 8/2023). Cuando en un nudo de ≥220 kV llegan varias
   solicitudes que no caben todas, el gestor abre un mes de publicidad, suspende las
   tramitaciones y avisa a la Secretaría de Estado de Energía, que puede convocar un
   concurso. Ahí ya no gana el primero, sino el que más puntúa. Ver §5.
2. **Proyectos de «alta prioridad»** (art. 13 del RDL 7/2026). Cuando entra una solicitud
   de alta prioridad, el gestor suspende todas las demás del mismo nudo o zona de
   capacidad, no admite nuevas hasta resolverla, y no se activa concurso: va por el
   procedimiento general. La lista es cerrada: promociones residenciales y servicios
   esenciales; consumos industriales declarados proyecto estratégico; y ampliaciones de
   consumos ya existentes que estén usando la red de verdad (hasta 3 veces la potencia
   media contratada en P6 de los dos últimos años, sin cambiar el grupo CNAE).
   **Los centros de datos no figuran en esa lista.**
3. **Nudos de transición justa** (art. 18 del RD 1183/2020 y su desarrollo), pensados para
   reasignar capacidad liberada por el cierre de centrales de carbón. Es una vía de
   concurso específica, históricamente orientada a generación y proyectos industriales
   en las comarcas afectadas.

### 1.4 Plazos

Plazos máximos para que el gestor conteste con la propuesta previa, contados desde la
admisión a trámite (RD 1183/2020, art. 13):

| Punto de conexión | Plazo |
|---|---|
| Distribución, < 1 kV, hasta 15 kW sin extensión de red | 5 días |
| Distribución, < 1 kV, resto | 15 días |
| Distribución, ≥ 1 kV y < 36 kV | 30 días |
| Distribución, ≥ 36 kV | 40 días |
| **Red de transporte** | **60 días** |

Si hace falta informe de aceptabilidad aguas arriba, el plazo se suma. Estos son los
plazos del *permiso*, no de la obra: entre el permiso y el suministro real median el
contrato de encargo de proyecto, la ejecución de las actuaciones de red, la autorización
administrativa y el contrato técnico de acceso. Ahí es donde se van los años.

### 1.5 Avales: el régimen cambió en 2026

Hasta marzo de 2026, las solicitudes de acceso de demanda exigían garantías económicas
según el art. 23 bis del RD 1183/2020 (introducido por el RDL 8/2023). **Ese artículo
está derogado** desde el 22 de marzo de 2026 por la disposición final 15.7 del
[Real Decreto-ley 7/2026, de 20 de marzo](https://www.boe.es/buscar/act.php?id=BOE-A-2026-6544).

En su lugar, el art. 11 del RDL 7/2026 crea la **prestación por reserva de capacidad de
acceso: quien tiene un permiso de demanda en un punto de ≥1 kV paga todos los meses**
desde que obtiene el permiso hasta que inicia la actividad (firma del contrato ATR).

- Se calcula multiplicando el término de potencia del peaje de su segmento tarifario en
  el periodo P1 por un factor k y por la capacidad otorgada.
- Valores transitorios de k: 0,4 (6.1TD), 0,6 (6.2TD), 1,0 (6.3TD) y 1,5 (6.4TD), **con
  incrementos de 0,2 / 0,3 / 0,5 / 0,75 por cada semestre transcurrido** desde la obtención
  del permiso. Es decir: cuanto más alta la tensión y más tiempo sin construir, más caro.
- Hay tres meses de exención al principio.
- Es un pago anticipado de peajes: cuando arranca el consumo se minora el 100 % de lo
  pagado el primer año y hasta el 80 % de lo pagado después. Si el permiso caduca, se
  pierde el derecho a esa devolución.
- **Impagar más del 10 % de un trimestre supone la caducidad automática del permiso.**

El RDL 7/2026 dio además una ventana de tres meses para renunciar a permisos sin
ejecución de avales, o para reducir la capacidad en más del 50 % sin que la instalación
deje de considerarse la misma (DT 3.ª). La capacidad liberada por encima de 5 MW queda
reservada y se reasigna después priorizando a los consumos de alta prioridad. También
obliga a declarar el código CNAE de la actividad en la solicitud y a mantenerlo tres
años, bajo pena de caducidad automática (art. 12): un antiespeculación directo contra el
permiso que se pide para una cosa y se usa para otra.

### 1.6 Potencia solicitada, concedida, contratada

Son tres números distintos y el salto entre ellos es enorme:

- **Solicitada**: lo que el promotor pide. No implica que exista. En el fichero de REE
  aparece como «capacidad de acceso solicitada en curso y pendiente de resolver».
- **Concedida / otorgada**: lo que figura en el permiso de acceso y conexión. Es un
  derecho administrativo con caducidad. En el fichero de REE, «capacidad de acceso
  otorgada demanda RdT».
- **Contratada**: la potencia del contrato ATR, la que de verdad se puede consumir. Marca
  el fin de la prestación por reserva de capacidad y el inicio de la «actividad».

Recuento propio sobre el fichero de Red Eléctrica de 3 de agosto de 2026, sumando la
columna correspondiente en los 937 nudos publicados: 17.737 MW otorgados para demanda
en la red de transporte y 24.048 MW solicitados en curso y pendientes de resolver.
(Suma propia, no cifra publicada por REE; las columnas de capacidad *otorgada* y
*solicitada* sí son aditivas entre nudos, a diferencia de las de capacidad disponible.) La propia REE cifraba en febrero de 2026 en 19 GW los permisos
de demanda concedidos en transporte, de los cuales 11,8 GW corresponden a nueva demanda
otorgada desde 2022 y ninguno estaba aún en servicio.

### 1.7 Caducidad

El titular tiene cinco años desde la concesión del permiso para conectarse (REE,
20-02-2026). El RDL 7/2026 añadió hitos intermedios para los permisos ya otorgados sin
contrato ATR (DT 4.ª): 12 meses para aportar el 10 % del valor de la inversión de las
actuaciones de red, 3 años para firmar el contrato de encargo de proyecto y 4 años para
firmar el contrato técnico de acceso (plazo modificado por el RDL 18/2026, de 29 de junio).

---

## 2. Por qué «MW de conexión» ≠ «MW IT»

Desde agosto de 2026 las dos magnitudes tienen definición legal. El proyecto de real decreto de centros de datos sometido a audiencia
pública el 27 de agosto de 2026 define las dos magnitudes por separado (art. 3):

> «f) Potencia de acceso: la potencia eléctrica que figure en los permisos de acceso
> y conexión otorgados al centro de datos o, cuando resulte superior, la potencia
> contratada en el contrato ATR.
> g) Potencia de tecnología de la información: la demanda de potencia eléctrica de los
> sistemas de tecnologías de la información instalados, determinada conforme al artículo 2
> del Reglamento Delegado (UE) 2024/1364.»

Y explica por qué usa una y no la otra para fijar su umbral de aplicación:

> «El umbral se expresa en potencia de acceso, y no en potencia de tecnología de la
> información, porque el bien cuya asignación se ordena es la capacidad de las redes de
> transporte y distribución.»

Relación práctica entre ambas:

- La potencia de acceso siempre es mayor que la carga TI. Cubre refrigeración,
  pérdidas de transformación y de SAI, iluminación y servicios. La relación depende del
  PUE de diseño y del margen de contratación.
- Un mismo campus suele pedir la potencia de acceso del build-out completo años antes
  de instalar la primera fila de racks. El permiso es para el campus terminado; la carga
  TI del año 1 puede ser una fracción pequeña.
- **No se debe convertir de una a otra aplicando un PUE supuesto.** El PUE de diseño no es
  el PUE real, y el margen entre potencia contratada y potencia usada tampoco es constante.
- El propio proyecto de RD ilustra la asimetría al fijar dos umbrales distintos: las
  obligaciones sustantivas se aplican a centros con potencia de acceso ≥ 1 MW,
  mientras que las obligaciones de publicidad e información del art. 14 se fijan en
  500 kW de potencia de TI, por coherencia con el Reglamento Delegado (UE) 2024/1364.

---

## 3. El estado real de la red: qué nudos están saturados para demanda

### 3.1 El dato existe desde febrero de 2026, y antes no

Hasta 2026 la capacidad de acceso de *demanda* en la red de transporte no era pública; sí
lo era la de generación. La secuencia:

1. La Circular 1/2024 (art. 16) obliga a gestores de transporte y distribución a
   publicar, por barra de tensión > 1 kV y con actualización mensual: denominación,
   georreferenciación, provincia, nivel de tensión, capacidad total de acceso firme de
   demanda, capacidad ocupada, capacidad de solicitudes admitidas pendientes y capacidad
   disponible. En subestaciones de > 66 kV, además, desagregado por posición.
2. La [Resolución de la CNMC de 1 de diciembre de 2025](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-25253)
   (expediente RDC/DE/008/25) aprueba las especificaciones de detalle para calcular esa
   capacidad en la red de transporte.
3. Red Eléctrica pidió tres meses de prórroga alegando falta de acuerdo en los nudos
   frontera y normas técnicas pendientes. La CNMC se la denegó y fijó el
   [20 de febrero de 2026 a las 12:00 como fecha de publicación](https://www.cnmc.es/prensa/mapa-capacidad-transporte-20260213).
4. Ese día REE publicó por primera vez las capacidades de acceso de demanda de la red de
   transporte, con compromiso de actualización mensual.
5. El 15 de abril de 2026 la CNMC publicó sus propios mapas interactivos agregando
   transporte y distribución.

### 3.2 Las cifras oficiales

De la nota de Red Eléctrica de 20 de febrero de 2026:

> «On the transmission grid alone, access and connection permits have been granted for
> 129 GW of wind and solar installations, 16 GW of storage facilities, and **19 GW of
> demand facilities**. Of the latter, since 2022, when the current planning was approved,
> 11.8 GW of capacity has been granted for new demand, none of which is yet in service.
> Holders have five years from the date the permit was granted to connect. The volume of
> permitted demand pending connection on the transmission grid alone would represent a
> 25 % increase over the country's current demand.»

Y:

> «The published figures show that the transmission grid still has capacity for new demand
> at 25 % of its nodes.»

Es decir, el 75 % de los nudos de transporte están copados para nueva demanda. En
distribución la situación es peor: AELEC cifraba en septiembre de 2025 que
[«el 83,4 % de los nudos de la red de distribución ya están saturados»](https://aelec.es/mapas-de-capacidad-saturacion-de-la-red/).

### 3.3 Recuento propio sobre el fichero de REE de 3 de agosto de 2026

Descargando el fichero `2026_08_03_GRT_demanda.csv` y contando nudos con capacidad
disponible para solicitudes por criterio general > 0 MW (tomando el máximo entre las
columnas CEP-CH, CEP-SH y NO CEP):

| Comunidad | Nudos en el fichero | Con capacidad > 0 | Sin dato publicable* | Nudo con más capacidad |
|---|---:|---:|---:|---:|
| **Comunidad de Madrid** | 91 | **0** | 57 | 0 MW |
| **Aragón** | 54 | **0** | 17 | 0 MW |
| **Cataluña** | 117 | **3** | 55 | 109 MW |
| Castilla-La Mancha | 48 | 13 | 13 | 707 MW |
| Comunidad Valenciana | 73 | 14 | 46 | 1.166 MW |
| País Vasco | 38 | 18 | 11 | 677 MW |
| Andalucía | 94 | 40 | 45 | 1.117 MW |
| Extremadura | 34 | 16 | 7 | 1.100 MW |

\* «Sin dato publicable» = nudos donde REE no publica capacidad otorgable, casi siempre
por «valor de referencia no acordado» con la distribuidora, o por estar reservados a
concurso o por la DT 3.ª del RDL 7/2026.

**El titular que se desprende de estos datos: a 3 de agosto de 2026 no hay ni un solo
nudo de la red de transporte en la Comunidad de Madrid ni en Aragón con capacidad de
acceso de demanda disponible por el criterio general.** Los dos mayores clusters de CPD
de España están, a esa fecha, cerrados a nuevas peticiones por la vía ordinaria. En
Cataluña quedan tres nudos, con un máximo de 109 MW.

Advertencias imprescindibles sobre esta tabla:
- **Las capacidades no son sumables.** La CNMC lo dice expresamente en sus mapas: hay
  interdependencias entre nudos (zonas de capacidad compartida), de modo que otorgar en
  uno reduce la de otros. Por eso arriba se cuentan nudos y se da el máximo, no sumas.
- **Caduca en semanas.** El fichero se actualiza mensualmente.
- Que un nudo tenga 0 MW disponibles no significa que no se pueda conectar nunca:
  significa que no se puede por el criterio general hoy. Puede haber capacidad reservada
  a concurso, o puede aflorar tras un refuerzo de red o tras un cambio de metodología.

### 3.4 Por qué está limitado cada nudo: los criterios

El fichero de REE indica el criterio limitante de cada nudo, que determina si la limitación
es estructural o disolvible:

- **`WSCR_Nudo`**. Potencia de cortocircuito insuficiente. Solo aplica a consumos con
  electrónica de potencia en la interfaz (en la nomenclatura de REE, «CEP»), que es
  precisamente el caso de un centro de datos con rectificadores y SAI. Un nudo puede
  tener mucha capacidad para un consumo convencional y muy poca para un CPD.
- **`Est_Dem_Nudo` / `Est_Dem_Zona`**. Criterio estático: la red no aguanta los flujos.
  Se resuelve con obra.
- **`Din1_Zona` / `Din2_Zona`**. Criterio dinámico, de estabilidad. Es el que REE señala
  como más susceptible de relajarse:

> «The results of the studies conducted, particularly those related to the dynamic
> criterion, confirm the need to ensure robustness requirements (voltage dip support)
> in future demand facilities that come into service, especially those connected through
> power electronics. The upcoming regulatory updates are expected to **significantly
> increase the capacity that can be granted at many nodes** where the current value is
> limited by the dynamic criterion.»

De ahí que el fichero distinga CH («con hueco») y SH («sin hueco»): instalaciones
capaces o no de soportar huecos de tensión. Un CPD que se diseñe para aguantar huecos
podrá acceder, en varios nudos, a más capacidad que uno que no.

### 3.5 Permisos de acceso flexible: la vía nueva

El 11 de agosto de 2026 se publicó la
[Resolución de la CNMC de 31 de julio de 2026](https://www.boe.es/buscar/act.php?id=BOE-A-2026-17571),
que establece los permisos de acceso flexible de la demanda. La capacidad flexible es
aquella en la que no se garantiza el suministro todas las horas del año: el gestor
determina un patrón y un porcentaje de horas de funcionamiento esperado. Para el criterio
estático en transporte, la resolución fija que la capacidad flexible garantice la demanda
en el mismo percentil que la firme en caso base y en el 90 % del tiempo ante N-X, con
sobrecargas admisibles de hasta el 140 %, y advierte de que «esta expectativa de consumo
en ningún caso ha de entenderse como un compromiso en la garantía de suministro». Los
gestores de distribución tienen hasta el 1 de enero de 2028 para disponer de las
herramientas de desconexión preventiva o correctiva necesarias.

Para un centro de datos, el acceso flexible es una vía real de conexión anticipada, pero
implica aceptar interrumpibilidad: encaja mal con un SLA de disponibilidad salvo que se
compense con generación o almacenamiento propios.

---

## 4. La avalancha de solicitudes de CPD y el debate público

### 4.1 Las cifras que ha puesto el Gobierno sobre la mesa

La memoria del análisis de impacto normativo del proyecto de real decreto de centros de
datos (MITECO, agosto de 2026) lo dice sin rodeos:

> «En los últimos años, el gestor de la red de transporte ha concedido a este tipo de
> instalaciones más de 6 GW de capacidad de acceso, mientras que en el ámbito de la
> distribución, se han otorgado en torno a otros 6 GW. A esas cifras debe sumarse el
> interés por capacidad de acceso identificado durante la tramitación de la Planificación
> de la Red de Transporte 2025-2030, cuyo volumen agregado, de atenderse, obligaría a
> dedicar buena parte de los esfuerzos económicos previstos en dicha planificación a los
> refuerzos de red necesarios para estas infraestructuras.»

Y frente a eso:

> «Los permisos ya concedidos superan las estimaciones de despliegue para los próximos
> años. La Estrategia de Inteligencia Artificial 2024 prevé **2,5 GW de potencia de
> computación en 2030, equivalentes a entre 3,5 y 4 GW de demanda eléctrica**, y las
> previsiones del propio sector y de los analistas independientes se sitúan en rangos
> similares o inferiores.»

**Doce gigavatios de permisos frente a una previsión de despliegue de 3,5-4 GW.** Ésa es
la tesis del regulador, y es el argumento que sostiene toda la reforma de 2026.

### 4.2 Cómo hay que leer esas cifras

- **Solicitado ≠ concedido ≠ construido.** Los 12 GW son permisos concedidos, no obra. Y
  REE es tajante: de los 11,8 GW de nueva demanda otorgada en transporte desde 2022,
  ninguno estaba en servicio en febrero de 2026.
- **Concedido ≠ va a construirse.** El permiso es barato de mantener (lo era: ver §1.5) y
  caro de perder, así que sobra incentivo para pedir de más, pedir en varios sitios y
  quedarse con el mejor. Es exactamente el fenómeno que el RDL 7/2026 llama
  «especulación y acaparamiento de capacidad».
- **Los 12 GW son «este tipo de instalaciones»**, no necesariamente todos los MW de todos
  los CPD ni exclusivamente CPD. El documento no publica el desglose por proyecto.
- **No hay lista pública de qué proyecto tiene qué permiso.** Ver §6.

El propio RDL 7/2026 explica la lógica de política energética:

> «Los centros de datos atraídos por las condiciones energéticas españolas han obtenido ya
> permisos de acceso que superan ampliamente las previsiones de despliegue, pero su
> materialización sin generación renovable asociada generaría un doble perjuicio [...]:
> mayor consumo de gas natural, que a su vez generaría un alza de costes eléctricos y un
> menor incentivo a la electrificación.»

Y describe el problema técnico de fondo: los consumos de CPD «son esencialmente planos y
no disponen a priori de la flexibilidad necesaria», y «a diferencia de otros vectores y
consumos, como el hidrógeno renovable o la electrificación de la industria, son en buena
parte adicionales: no sustituyen tecnológicamente a consumos actualmente responsables
de emisiones».

### 4.3 El pulso territorial

La tensión no es solo entre Gobierno y promotores. En la tramitación de la planificación
a 2030, el Gobierno de Aragón manifestó públicamente su decepción con el reparto estatal,
al considerar que no permite conectar todos los centros de datos proyectados en la
comunidad. La propuesta a 2030 asigna 3,8 GW a centros de datos de los 27,7 GW de
nueva demanda previstos en la red de transporte, y solo incorpora al escenario
«aproximadamente un 25 % de las propuestas de demanda recibidas».

---

## 5. Concursos de capacidad de demanda: el primero ya se ha resuelto

El concurso sustituye a la cola cuando en un nudo hay más peticiones que capacidad.

Convocatoria: [Resolución de 11 de julio de 2025, de la Secretaría de Estado de
Energía](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-14863) (BOE de 17-07-2025).
Ocho nudos y la capacidad convocada en cada uno:

| Nudo | Capacidad convocada para demanda |
|---|---:|
| Arrigorriaga 400 (País Vasco) | 993 MW |
| Brazatortas 400 (Castilla-La Mancha) | 1.217 MW |
| Cristóbal Colón 220 (Huelva) | 503 MW |
| Francolí 220 (Tarragona) | 216 MW |
| Mercedes Benz 220 (Álava) | 387 MW |
| Nuevo Vigo (Bateas) 220 (Pontevedra) | 182 MW |
| Palos 220 (Huelva) | 277 MW |
| Terrer 400 (Zaragoza) | 410 MW |

Con dos zonas de capacidad compartida: Cristóbal Colón / Palos / Torrearenillas 220
(276 MW conjuntos) y Brazatortas 400 / 220 (1.217 MW).

Garantías para participar (anexo VII): 25 €/kW solicitado por el compromiso de fecha
de inicio del consumo y otros 25 €/kW por el compromiso de emisiones evitadas,
adicionales e independientes de las del procedimiento ordinario de acceso.

Criterios de puntuación: emisiones de CO₂ evitadas, fecha de inicio del consumo y
volumen de inversión (con inversión unitaria en €/MW).

Resolución: [Resolución de 24 de febrero de 2026](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-4357)
(BOE de 25-02-2026). Adjudicatarios:

| Nudo | Instalación | Adjudicatario | MW |
|---|---|---|---:|
| Brazatortas 400 | Hydnum Steel | Hydnum, S.L. | 500,0 |
| Palos 220 | Instalación de Palos | Moeve, S.A. | 257,3 |
| Nuevo Vigo (Bateas) 220 | Stellantis Vigo | Stellantis España, S.L. | 100,0 |
| Francolí 220 | Planta ASU de El Morell Messer IV | Messer Ibérica de Gases, S.A.U. | 52,0 |
| Cristóbal Colón 220 | Complejo Metalúrgico de Huelva | Atlantic Copper, S.L. | 18,7 |

**Ninguna de las solicitudes cuyo nombre societario las identifica como promotoras de
centros de datos llegó a ser valorada.** El anexo II relaciona
como excluidas, por las causas a, b y c del anexo V.D de la convocatoria, referidas a
defectos de documentación y de garantías, las solicitudes de CPD4GREEN, S.A.U. en
Brazatortas 400, Benbros DC, S.L. en Francolí 220, ACS DC Infra, S.L.U. en Nuevo Vigo
220 e Iberdrola Clientes, S.A. en Palos 220 (esta última, de actividad no identificable
por el nombre). Los cinco adjudicatarios son proyectos de acero verde, energía, automoción,
gases industriales y cobre. La resolución no clasifica los proyectos por sector: la
atribución anterior se basa en el nombre de la instalación declarado en el anexo III, y en
el caso de la «Instalación de Palos» de Moeve el anexo no precisa de qué se trata.

A 3 de agosto de 2026, el fichero de REE marca 54 nudos como «nudo de concurso», entre
ellos varios en pleno corazón de los clusters de CPD: Algete 220, Anchuelo 220, La Cereal 400, Fortuna 220 y Prado Santo Domingo 220 (Madrid),
AVE Zaragoza 220, Cartujos 220, Fuendetodos 220, Montetorrero 220, Peñaflor 220, Plaza II
(Moncasi) 220 y Villanueva de Gállego 220 (Aragón), Zona Franca 220 y Puigpelat 220
(Cataluña), El Serrallo 220 y Morvedre 400 (Comunidad Valenciana), Arrigorriaga 400 (País
Vasco). El detalle nudo a nudo está en `data/red/capacidad.yaml`.

---

## 6. Cambios normativos recientes (2024-2026)

Esta cronología es un resumen. Cada una de estas normas tiene ficha propia en
[la sección de normativa](/normativa), con lo que obliga, en qué fase está y a
qué parte del registro afecta.


Cronología de lo que ha cambiado el terreno de juego, de más antiguo a más reciente:

| Fecha | Norma | Qué cambia |
|---|---|---|
| 27-12-2023 | RDL 8/2023 | Crea los concursos de capacidad de demanda (arts. 20 bis-quater del RD 1183/2020) y el régimen de garantías del art. 23 bis. |
| 27-09-2024 | [Circular 1/2024 CNMC](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-20760) | Metodología y condiciones de acceso y conexión para **demanda**. Introduce la capacidad de acceso **flexible** y obliga a publicar mensualmente la capacidad por nudo y por posición. |
| 11-07-2025 | [Resolución SEE](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-14863) | Convoca los primeros concursos de capacidad de acceso de demanda (8 nudos). |
| 07-10-2025 | [Circular informativa 6/2025 CNMC](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-20259) | Petición de información a los gestores sobre solicitudes de acceso y conexión: es la base de datos de los mapas de la CNMC. |
| 09-10-2025 | [BOE-B-2025-36444](https://www.boe.es/diario_boe/txt.php?id=BOE-B-2025-36444) | Audiencia pública de la propuesta de planificación de la red de transporte a 2030 (hasta 16-12-2025). |
| 01-12-2025 | [Resolución CNMC RDC/DE/008/25](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-25253) | Especificaciones de detalle para calcular la capacidad de acceso de **demanda** en transporte. |
| 20-02-2026 | Publicación de REE | Primera publicación de las capacidades de acceso de demanda de la red de transporte. Mensual desde entonces. |
| 24-02-2026 | [Resolución SEE](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-4357) | Resuelve el primer concurso de capacidad de demanda. |
| 20-03-2026 | [RDL 7/2026](https://www.boe.es/buscar/act.php?id=BOE-A-2026-6544) | **La reforma de fondo.** Deroga el régimen de avales de demanda; crea la prestación por reserva de capacidad; obliga al CNAE en el permiso; crea los proyectos de «alta prioridad»; establece nuevos hitos de caducidad; y ordena aprobar por real decreto los requisitos de sostenibilidad de los centros de datos (DA 1.ª). |
| 15-04-2026 | [Mapas CNMC](https://www.cnmc.es/prensa/mapas-capacidad-redes-electricas-20260415) | Mapas interactivos únicos de capacidad de demanda y de generación, transporte + distribución, mensuales. |
| 29-06-2026 | RDL 18/2026 | Ajusta plazos de caducidad de la DT 4.ª del RDL 7/2026. |
| 28/29-07-2026 | [RD 640/2026](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-16661) y tercera MAP | Planes de inversión de redes (habilita 17.900 M€ adicionales hasta 2030) y tercera modificación de aspectos puntuales de la planificación H2026 (+615 M€). |
| 31-07-2026 | [Resolución CNMC](https://www.boe.es/buscar/act.php?id=BOE-A-2026-17571) | Establece los **permisos de acceso flexible de la demanda**. |
| 27-08-2026 | [Proyecto de RD de centros de datos](https://www.miteco.gob.es/es/energia/participacion/2026/detalle-participacion-publica-k-851.html) | En audiencia pública hasta el 4 de septiembre de 2026. Ver abajo. |

### 6.1 El proyecto de real decreto de centros de datos (agosto de 2026)

Estado a 29-08-2026: **borrador en audiencia e información pública, abierta del 27 de
agosto al 4 de septiembre de 2026**. No está aprobado. Contenido:

- **Ámbito**: centros de datos con potencia de acceso ≥ 1 MW. Obligaciones de
  publicidad a partir de 500 kW de potencia de TI.
- **Condición para obtener el permiso de acceso** (art. 4): declaración responsable de
  resiliencia y soberanía digital; declaración de eficiencia energética e hídrica; y
  cumplimiento de los requisitos de energía renovable.
- **Adicionalidad** (art. 8): cubrir el 80 % del consumo total con autoconsumo o con
  PPA con instalaciones renovables ubicadas en España, cuyas actas de puesta en servicio
  no sean anteriores en más de 18 meses a la entrada en funcionamiento del CPD.
- **Correlación horaria** (art. 9): que cada hora el consumo esté respaldado al menos
  en un 80 % por generación renovable de esa misma hora.
- **Eficiencia**: hasta que se aplique el etiquetado europeo (previsto para agosto de
  2027), PUE ≤ 1,15 y WUE ≤ 0,1, calculados según el anexo III del Reglamento
  Delegado (UE) 2024/1364.
- **Soberanía digital**: establecimiento en la UE, permanencia de los datos operativos en
  la UE, control y trazabilidad del soporte prestado desde terceros países, supervisión de
  subcontratistas y medidas frente a requerimientos de datos de autoridades extranjeras.
- **Consecuencias**: recargos sobre peajes y cargos, y en última instancia **pérdida de
  los permisos de acceso y conexión**.
- **Transitorias**: los proyectos con permiso otorgado y no conectados tienen seis meses
  para acreditar cumplimiento, so pena de caducidad con ejecución de garantías; y se abre
  una ventana de seis meses para renunciar sin ejecución de avales.
- **Efecto sobre los concursos** (DA 1.ª): las solicitudes que no acrediten estos
  requisitos no se tendrán en cuenta para activar un concurso de demanda ni para abrir
  el mes de publicidad del art. 20 quater.

Si se aprueba en estos términos, cambia por completo la economía de un proyecto de CPD en
España: la conexión deja de ser un trámite de red y pasa a exigir un portafolio renovable
nuevo, casado hora a hora, en territorio español.

---

## 7. Planificación de red: qué está vigente y qué no

Detalle en `data/red/actuaciones.yaml`.

- **Vigente y vinculante**: Planificación de la Red de Transporte Horizonte 2026
  (periodo 2021-2026), aprobada por Consejo de Ministros el 22 de marzo de 2022, con tres
  modificaciones de aspectos puntuales (abril de 2024, +489 M€; julio de 2025, +750 M€;
  julio de 2026, +615 M€). Inversión total tras la tercera MAP: 8.818 M€.
- **En tramitación, NO aprobada**: Planificación 2025-2030 (horizonte 2030). Propuesta
  presentada el 12 de septiembre de 2025, audiencia pública del 10 de octubre al 16 de
  diciembre de 2025. A 29 de agosto de 2026 el proceso está en la **fase 4 de 6
  (Estudios)**: Red Eléctrica analiza alegaciones y elabora la Propuesta de Desarrollo.
  Cifras indicativas: 13.590 M€, 27,7 GW de nueva demanda en transporte y 5,3 GW
  en distribución, 422 ampliaciones de conexión, con **3,8 GW asignados a centros de
  datos** frente a 13,1 GW a hidrógeno verde y 9 GW a industria.

El capítulo MAP_CONSUM de la modificación de abril de 2024 es el bloque de red más
directamente ligado a la nueva demanda: 342,9 M€ para conectar nuevos consumidores
directamente a la red de transporte, con actuaciones en Sagunto (nueva SE Saguntum
400/220 kV, 62,1 M€), el eje de 220 kV de Zaragoza (Peñaflor, Villanueva de Gállego,
Montetorrero, Plaza II, AVE Zaragoza, Esquedas), Arrigorriaga 400 kV, Huelva, Algeciras,
Verneda, Farners-Riudarenes y Algete 220 kV. Su motivación literal:

> «Las necesidades asociadas a la transición energética y **la electrificación y la
> digitalización de la economía** están dando pie a la aparición de nuevos proyectos
> industriales de gran envergadura, de carácter estratégico [...] Muchos de ellos se
> caracterizan por conllevar unos consumos de electricidad significativos, razón por la
> cual se requiere su abastecimiento directamente desde la red de transporte eléctrica.»

El documento no nombra empresas ni tipos de instalación. «Digitalización de la economía» no
equivale a «centro de datos», y ninguna actuación se atribuye aquí a un CPD concreto sin una
fuente que lo diga.

---

## 8. Fuentes y limitaciones: qué NO es público

### 8.1 Fuentes primarias utilizadas

| Qué | Dónde |
|---|---|
| Capacidad de acceso de demanda, red de transporte, por nudo (CSV/XLSX/PDF, mensual) | <https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso> |
| Mapa interactivo CNMC, **demanda** (transporte + distribución, mensual) | <https://experience.arcgis.com/experience/c7dc433cb2e44d53a908a8a467523f5a> |
| Mapa interactivo CNMC, generación (**no confundir**) | <https://experience.arcgis.com/experience/0dac803d644f41519fdd11da11ef10ae> |
| Página de la CNMC que aloja ambos mapas | <https://www.cnmc.es/sectores-que-regulamos/energia/supervision-del-mercado-electrico/informe-acceso-y-conexion-redes> |
| Planificación de la red de transporte (vigente y proceso 2025-30) | <https://www.planificacionelectrica.es/> |
| Normativa | BOE: RD 1183/2020, Circular 1/2024, RDL 7/2026, resoluciones de concursos |

Nota práctica sobre el fichero de REE: la URL incorpora la fecha de publicación
(`.../12_CLIENTES/Documentos/2026_08_03_GRT_demanda.csv`). Para refrescar los datos hay que
tomar el enlace vigente de la página de REE, no adivinar la fecha.

### 8.2 Limitaciones documentadas

1. **El mapa de la CNMC es un visor, no una descarga.** Se publica como aplicación ArcGIS
   Experience, sin fichero descargable equivalente. Para datos tabulados de transporte hay
   que ir al CSV/XLSX de Red Eléctrica; para distribución, a los portales de cada
   distribuidora.
2. **La capacidad en distribución no está consolidada en un único fichero público**, ni se
   recoge aquí. Cada gestor publica lo suyo conforme al art. 16 de la Circular 1/2024, y
   homogeneizarlo exige recorrer i-DE, e-distribución, UFD, Viesgo y decenas de
   distribuidoras menores.
3. **No hay registro público que diga qué empresa tiene qué permiso de acceso, en qué nudo
   y por cuántos MW.** El fichero de REE publica agregados por nudo, no titulares. La
   única vía por la que aparecen nombres propios es la resolución de un concurso, o los
   expedientes de autorización administrativa y ambiental de las líneas y subestaciones de
   evacuación/alimentación. Por eso, atribuir MW de conexión a un CPD concreto casi siempre
   exige una fuente indirecta (expediente ambiental, prensa, la propia compañía) y hay que
   marcar la confianza en consecuencia.
4. **El desglose de los «12 GW de CPD» no es público.** El MITECO da la cifra agregada
   (>6 GW en transporte, ~6 GW en distribución) sin lista de proyectos ni de nudos.
5. **De la propuesta de planificación a 2030 solo es público el sumario ejecutivo**, no el
   listado individualizado de actuaciones. Las cifras funcionales (3,8 GW para centros de
   datos) proceden de la comunicación oficial del MITECO y La Moncloa.
6. **Las coordenadas de subestaciones de `data/red/subestaciones.yaml` proceden de
   OpenStreetMap** (ODbL), validadas cruzando la comunidad autónoma obtenida por
   geocodificación inversa con la que Red Eléctrica asigna al nudo. Red Eléctrica está
   obligada por la Circular 1/2024 a publicar la georreferenciación de cada barra, pero no
   se ha localizado un fichero geográfico oficial descargable que la contenga. Donde la
   correspondencia no se ha podido validar, lat/lon van a `null`.
7. **Todo esto caduca.** La capacidad de acceso se recalcula cada mes, los requisitos de
   robustez frente a huecos de tensión están pendientes de norma y REE ya avisa de que
   liberarán capacidad, y el real decreto de centros de datos está en audiencia pública.
