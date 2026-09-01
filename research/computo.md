# Cómputo instalado en los centros de datos de España

Barrido documental de agosto de 2026 sobre qué hardware de cálculo hay dentro de
los emplazamientos del registro: aceleradores de IA, silicio propio de
hyperscaler, particiones de CPU y procesadores cuánticos.

**Cómputo no es potencia.** Un centro de 15 MW puede alojar diez mil
aceleradores o ninguno, y nada de lo que sigue se convierte en megavatios. Los
datos verificados están en el bloque `computo[]` de las fichas; las reglas del
campo, en `docs/ESQUEMA.md`.

El barrido se hizo en tres pasadas. La primera recorrió los emplazamientos ya
fichados. La segunda amplió el universo con la infraestructura de cómputo público
que faltaba. La tercera, el 1 de septiembre de 2026, llegó al retirar la regla de
alcance peninsular. El conjunto pasó de 191 a 203 fichas.

## Resultado en una línea

De 203 emplazamientos, **22 tienen cómputo documentado con fuente**. Dieciocho
de esos veintidós son infraestructura pública de supercomputación o de cuántica.
Solo **dos son centros comerciales con recuento publicado**, y ambos lo son
porque lo anunció el inquilino, no el operador del centro.

El sector comercial español no publica qué hardware aloja. Esto no es una laguna
de la búsqueda: es la práctica del sector, y es la razón de que la potencia
eléctrica siga siendo el único denominador común entre estos emplazamientos.

## Los recuentos publicados, de mayor a menor

Solo entran aquí las cifras que una fuente publica como total. Cuando la fuente
da nodos y tarjetas por nodo pero no el producto, va en la tabla siguiente.

| Emplazamiento | Aceleradores | Modelo |
|---|---:|---|
| MERLIN Edged Barcelona — Zona Franca | **10.224** | NVIDIA H200 Tensor Core (CoreWeave) |
| BSC — MareNostrum 5 ACC | **4.480** | NVIDIA H100 de 64 GB |
| BSC — MareNostrum 5 AI Upgrade | **1.920** | NVIDIA Blackwell y Blackwell Ultra |
| SCAYLE — Caléndula | **181** (140 son H100) | NVIDIA H100 SXM5, A100 y V100 |
| CESGA — FinisTerrae III | **144** | 128 NVIDIA A100 + 16 NVIDIA T4 |
| NASERTIC — Urederra | **20** | 16 H100 SXM5, 2 A100, 2 V100 |
| PIC — Campus UAB | **18** | modelo no publicado |
| IFCA — Altamira | **12** | 4 H200 NVL + 8 A30 |

### Lo que la fuente no agrega y aquí tampoco

| Emplazamiento | Lo publicado | Producto (no registrado) |
|---|---|---:|
| CSUC — Pirineus III | 29 nodos × 2 NVIDIA H100 de 80 GB | 58 |
| SCBI-UMA — Picasso | 4 nodos DGX × 8 NVIDIA A100 | 32 |
| CeSViMa — Magerit-3 | 4×4 A100, 5×4 L40S, 2×2 V100 | 40 |
| SCAYLE — Caléndula | 26 servidores × 1 A100 de 40 GB | 26 |
| IFCA — Altamira | 5 nodos × 2 V100 | 10 |

### Cuántica

No comparable con lo anterior ni entre sí.

| Emplazamiento | Cúbits | Tecnología |
|---|---:|---|
| IBM-Euskadi (Donostia) | **156** | IBM Quantum Heron, superconductor |
| BSC — MareNostrum Ona | **35** | Transmon, Qilimanjaro + GMV |
| CESGA — Qmio | **32** | Coaxmon, Oxford Quantum Circuits |
| BSC — EuroQCS-Spain | sin publicar | Fluxonium analógico, Qilimanjaro |
| VQCC — Universidade de Vigo | por desarrollar | Fotónica óptica, con CESGA |

## Los tres hallazgos que importan

### 1. El mayor clúster de GPU de España está en un almacén de Zona Franca

**10.224 NVIDIA H200** que despliega CoreWeave en el centro de MERLIN Edged de
Barcelona, en 15 MW, con interconexión InfiniBand. Supera por más del doble a la
partición acelerada del MareNostrum 5. Se anuncia una segunda fase con
aceleradores Blackwell, sin cifra ni fecha firme.

El hardware no es del operador del centro: MERLIN pone el inmueble y la
potencia, CoreWeave pone y opera los aceleradores. Por eso el bloque `computo[]`
lleva un campo `operador_computo`: sin él, o se pierde el mayor clúster
documentado del país o se le atribuye a quien no es.

### 2. El BSC ya no es solo un superordenador: es 6.400 aceleradores

MareNostrum 5 tiene hoy cuatro particiones clásicas y tres ordenadores
cuánticos. La novedad de 2026 es la **partición de IA**: 1.920 aceleradores
NVIDIA Blackwell y Blackwell Ultra, adjudicada en enero de 2026 al consorcio de
Fsas Technologies (Fujitsu) y Telefónica por 129 millones, instalada entre el
centro de datos del BSC y la capilla de Torre Girona.

Su rendimiento se publica como **19 EFlop/s en FP4**. Esa cifra no se compara
con los 260 PFlop/s en FP64 de la partición acelerada: son precisiones
distintas, y la aritmética que las mezcla produce titulares falsos. Por eso el
esquema guarda la precisión pegada a la cifra.

Sumando las dos particiones aceleradas, el BSC tiene **6.400 aceleradores
NVIDIA**, el mayor parque de España, público o privado.

### 3. Nebius entra en España sin decir con qué

En agosto de 2026 Nebius contrató **18 MW** en el edificio MG1 de MERLIN Edged
en Getafe —la mayor parte de sus 20 MW— explícitamente para despliegues de GPU
de alta densidad. Es su primera instalación en España. Ni Nebius ni Edged
publican modelo ni número de aceleradores.

Es el patrón del sector: **se publica la potencia contratada, nunca el
hardware**. La ficha lo registra como lo que es —un compromiso de potencia para
cómputo de IA, con el recuento vacío— en vez de estimarlo.

## El barrido de la RES: doce fichas nuevas

La segunda pasada tomó como espina dorsal la **Red Española de Supercomputación**,
que es la única lista autoritativa y cerrada de infraestructura de cómputo
público del país: catorce nodos, ICTS distribuida, coordinada por el BSC.

Faltaban siete de los catorce, ocho contando LaPalma. Ahora están todos:

| Nodo | Emplazamiento | Cómputo registrado |
|---|---|---|
| Picasso | SCBI, Universidad de Málaga | 344 nodos, 4,34 PFlop/s pico; 4 nodos DGX con A100 |
| Tirant | SIUV, Universitat de València (Burjassot) | Tirant 4: 288 nodos, 929 TFlop/s; Lluís Vives 2: 70 nodos |
| Agustina | BIFI–CESAR, Universidad de Zaragoza | Agustina: 96 nodos, 537 TFlop/s; Mequinenza: 144 nodos |
| Magerit | CeSViMa, UPM (Pozuelo de Alarcón) | 5.024 núcleos, 575,8 TFlop/s; nodos con A100, V100 y L40S |
| Cibeles | CCC-UAM (Cantoblanco) | Cibeles 3: 28 nodos, 100 TFlop/s; Cibeles 4: 144 nodos |
| LUSITANIA III | CénitS-COMPUTAEX (Cáceres) | 144 nodos, 464,5 TFlop/s |
| PIC | Campus UAB (Cerdanyola del Vallès) | 12.000 núcleos, 18 GPU, 63 PB en cinta |
| LaPalma | CALP, IAC (Breña Baja, La Palma) | 288 nodos, 929 TFlop/s pico |

**LaPalma, del Instituto de Astrofísica de Canarias, entró el 1 de septiembre de
2026**, cuando se retiró la regla de alcance peninsular precisamente porque
dejaba fuera el decimocuarto nodo de la RES. Con él llegó **D-ALiX** (Granadilla
de Abona, Tenerife), centro de colocación neutro y primera estación de cables
submarinos neutra del mundo, que la regla anterior también excluía. Los catorce
nodos de la RES están ahora en el registro.

LaPalma tiene 288 nodos y 929 TFlop/s de pico: la misma configuración que Tirant
4, porque es el mismo hardware de MareNostrum 4 repartido. El IAC describe su
sala con un detalle inusual —suelo técnico para 2.000 kg/m², consigna de 24 °C,
redundancia eléctrica y de frío— y sin una sola cifra en vatios.

A esos ocho nodos se suman cuatro fichas más:

- **CITIC (A Coruña)**, el CPD del centro de investigación TIC de la
  Universidade da Coruña. No es un nodo de servicio: es un CPD de laboratorio,
  para pilotos y demostradores, y así lo dice su ficha. En 2025 incorporó una
  **NVIDIA H100 de 80 GB** y kits Jetson AGX Orin y Thor, sin publicar cuántos.
- **VQCC (Vigo)**, el centro de comunicaciones cuánticas de atlanTTic, que desde
  enero de 2026 aloja el **Quantum Optical Computing Lab** —2,4 M€, con el
  CESGA— para desarrollar un procesador cuántico fotónico. A 31 de agosto de
  2026 el procesador no existe: el objetivo se sitúa a tres o cinco años vista.
- **D-ALiX (Granadilla de Abona, Tenerife)**, centro de colocación neutro en los
  terrenos del ITER y primera estación de cables submarinos neutra del mundo:
  2.000 m² de alojamiento, TIER III+ y TIER IV eléctrico, 400 kW fotovoltaicos en
  cubierta. No publica ni un vatio de capacidad; la única cifra localizada, 5 MW,
  es de un directorio de terceros y así se registra. No tiene bloque de cómputo:
  es colocación, y lo que sus clientes metan dentro no lo publica nadie.
- **Estación óptica terrena Antonia Ferrín Moreiras (Vigo)**, la mayor de España
  para comunicaciones cuánticas por satélite, inaugurada en abril de 2026 con
  1,5 M€ y un telescopio de 80 cm. No es cómputo ni centro de datos: entra por
  analogía con las estaciones de aterraje de cable submarino ya fichadas.

### El PIC es el caso más interesante del barrido

Es un centro de datos de verdad, no una sala de supercomputador: **más de 40
racks en 200 m²**, sala principal de 150 m² con *freecooling* adiabático y 25 m²
de refrigeración por inmersión desde 2016. Es uno de los trece centros Tier-1 del
LHC del CERN, centro principal de MAGIC y PAUcam y centro de datos de la misión
Euclid de la ESA. Mueve unos 100 PB de entrada y salida al año.

Y no publica **ni un solo megavatio**. Es el emplazamiento con la descripción
física más detallada de todo el registro y sin una sola cifra eléctrica.

## Lo que se ha buscado y no existe

Estas ausencias son resultado, no hueco por explorar.

**AWS Aragón.** El director global de Computación y Networking de AWS declaró en
mayo de 2025 que «estamos desplegando tanto aceleradores Trainium como unidades
de proceso gráfico en España» y que Aragón «se va a convertir en una región
importante para AWS desde el punto de vista de la inteligencia artificial». Es
una afirmación de región, no de edificio: AWS tiene once emplazamientos en
Aragón y la declaración no permite atribuir hardware a ninguno. **No se ha
registrado en ninguna ficha**, porque hacerlo exigiría elegir un edificio
arbitrariamente. Lo que sí consta y sí está en las fichas: La Puebla de Híjar
(Teruel) se describe como centro especializado en IA con 100 MW comprometidos, y
AWS planea una planta de fabricación y reparación de servidores de IA y ML en
Aragón.

**Microsoft.** Ni una cifra de hardware. La región Spain North —La Muela,
Villamayor de Gállego y Zaragoza, 50 MW por campus en primera fase— se describe
como «ambivalente», capaz de alojar tanto nube tradicional como servicios
avanzados de IA. Ningún documento público dice qué aceleradores irán dentro.

**Meta (Talavera de la Reina)** y el resto de hyperscalers: nada.

**Telefónica.** Sus 17 nodos de *edge computing* incorporan aceleradores NVIDIA
y comercializan GPU como servicio, pero son unos 3 MW agregados y los
emplazamientos son centrales telefónicas reconvertidas que no están fichadas
como centros de datos en este registro. Telefónica sí aparece, en cambio, como
socio del consorcio que amplía MareNostrum 5 y del que opta a la gigafactoría.

**Colocation y nube nacional** (Stackscale/Grupo Aire, OASIX, Nixval,
Trevenque…): ofrecen GPU como servicio con modelos publicados —NVIDIA T4, L4,
L40S— pero **no publican cuántas ni en qué centro**. Un catálogo comercial no es
un inventario de emplazamiento, y no se ha registrado.

**Vigo, centros de datos.** No hay ninguno, ni operativo ni proyectado. El único
rastro es que **ACS DC Infra, S.L.U. pidió acceso en el nudo Nuevo Vigo (Bateas)
220 kV** y quedó excluida del concurso de capacidad por defectos de documentación
y garantías. Por la regla del conjunto, una solicitud de acceso no es un centro
de datos; queda documentada en `red-electrica.md` y no genera ficha.

**Solaria / Data Section (Puertollano).** Anuncio de 2024 con racks de Super
Micro y «chips de última generación de NVIDIA», 200 MW y 40 MW en primera fase.
A enero de 2026 **no se había instalado ningún servidor**. Registrado como
anuncio, sin recuento.

**Gigafactoría de IA (Móra la Nova + San Fernando de Henares).** La candidatura
española, con 719 millones públicos y un consorcio de SETT, Telefónica, ACS,
Santander, Multiverse y la Generalitat, se presenta a una convocatoria que
cierra el 12 de noviembre de 2026 y se resuelve a comienzos de 2027. La única
magnitud de cómputo publicada es el umbral del programa —«más de 100.000 chips
avanzados de IA», frente a los 25.000 de las mayores fábricas de IA— y **no es
una cifra de este emplazamiento**. Así queda anotado.

## Dos cosas que van a cambiar el mapa

**La segunda fábrica de IA europea de España está en Galicia.** La Comisión
Europea seleccionó al CESGA en octubre de 2025 para la **1HealthAI Factory**,
especializada en ciencias de la vida, con 82 millones de dotación (41 de
EuroHPC, 24 del Estado, 17 de la Xunta) y un superordenador específico de IA por
adquirir. España, Alemania y Polonia son los únicos países con dos fábricas de
IA. Arquitectura y número de aceleradores: todavía sin publicar. Hay además
menciones a un futuro FinisTerrae IV.

**SCAYLE prevé comprar una «Fábrica de IA» en 2026**, concebida como servicio
integral de GPU como servicio, mientras migra Caléndula del Campus de Vegazana a
la nueva sede de la calle Gaspar Morocho. El cómputo registrado en esa ficha
describe la máquina, todavía no el edificio.

## Decisiones de registro que conviene conocer

1. **No se multiplica.** Cuando la fuente da nodos y tarjetas por nodo sin
   publicar el total, el recuento queda vacío: la tabla de arriba anota el
   producto donde ayuda a leer, y el dataset no lo inventa.
2. **Contradicciones conservadas.** El CESGA publica 128 y 141 A100 para la misma
   máquina en dos páginas suyas. El BSC da 54 y 45,9 PFlop/s para la misma
   partición. CeSViMa publica 5.024 núcleos y 575,8 TFlop/s donde la RES da 5.184
   y 370,5. COMPUTAEX dice 313 TFlops donde la RES da 464,5. Ninguna se resuelve.
3. **Errores de unidad detectados y no arrastrados.** La ficha de Tirant en la
   RES da «27 648 TB» de memoria principal; la de Picasso, «2048 TB of RAM» por
   nodo; la de Lusitania, «420 PB Lustre». No se registra memoria ni
   almacenamiento en ninguna de las tres.
4. **Hardware repartido de MareNostrum 4.** Cinco emplazamientos tienen la misma
   configuración de 144 nodos con Intel Xeon Platinum 8160: Mequinenza (BIFI),
   Cibeles 4 (UAM), Lusitania (COMPUTAEX) y, con 288, Tirant 4 (UV). No es un
   error de copia de la RES: es la máquina anterior del BSC repartida entre
   nodos. Asturias recibió dos armarios del mismo origen, aún sin instalar en el
   pozo San Jorge.
5. **La cuántica no cambia de regla.** Sigue sin generar ficha propia dentro de
   un emplazamiento ya fichado y sigue sin aportar cifra a `potencia[]`. Lo
   único nuevo es que sus cúbits están ahora en un campo y no en la prosa.
6. **Ninguna de las 22 fichas con cómputo publica potencia eléctrica**, salvo las
   dos comerciales, que publican potencia y no hardware. Los dos mapas —el de MW
   y el de FLOPS— casi no se solapan.
7. **El alcance ya no es peninsular.** La regla se retiró el 1 de septiembre de
   2026 y el criterio geográfico es la nacionalidad del territorio. La capa
   eléctrica sí sigue siendo peninsular, porque los sistemas canario y balear son
   independientes y no tienen capacidad de acceso publicada equivalente.

## Qué falta

El barrido cerró la RES completa, pero no el universo. Con la regla territorial
nueva quedan pendientes de fichar las estaciones de cable submarino de **Canalink
en Güímar y Granadilla (Tenerife) y en Tarahales y El Goro (Gran Canaria)**, la
nueva de **Pájara (Fuerteventura)** licitada en abril de 2026, las de **IslaLink
en Palma de Mallorca e Ibiza** y el centro de **Vodafone en Marratxí**. El resto
queda abierto en el
[issue #3](https://github.com/mateo19182/mapa-datacenters-espana/issues/3):
CPD universitarios fuera de la RES, HPC industrial y corporativo, nodos edge de
operador con aceleradores, y la decisión de si `computo[]` dentro de la ficha
aguanta el crecimiento o hace falta una capa aparte.

## Fuentes principales

- RES, fichas de nodo de MareNostrum 5, Picasso, Tirant, Agustina, Magerit, Cibeles, LUSITANIA III, PIC, FinisTerrae III, Pirineus III, Caléndula, Altamira y Urederra.
- BSC-CNS, *MareNostrum — Technical information*; EuroHPC JU, *Contract Signed to Boost MareNostrum 5's AI Capabilities* (26-01-2026); TOP500, ficha de MareNostrum 5 ACC.
- CESGA, páginas de Computación y de Cuántica y documentación técnica del FinisTerrae III.
- SCAYLE, manual de HPC y *Sobre SCAYLE*; CeSViMa, ficha de Magerit-3; Nasertic, *Supercomputación (HPC)*; IFCA, *HPC Userguide*; SCBI-UMA; COMPUTAEX.
- PIC, ponencia en las Jornadas Técnicas de RedIRIS 2023; IFAE, informe anual 2021.
- CITIC-UDC, memoria de actividades 2025 y páginas de instalaciones.
- VQCC/UVigo y BOE-A-2026-7268 (cátedra de computación de óptica cuántica); Vigo Tecnolóxico, sobre la estación óptica terrena.
- IBM, inauguración del IBM Quantum System Two de Donostia (14-10-2025).
- DatacenterDynamics, sobre CoreWeave en Barcelona (21-05-2026) y Nebius en Getafe (11-08-2026).
- Solaria, acuerdo con Datasection (03-09-2024); Plan de Recuperación, candidatura española a gigafactoría (22-07-2026); Expansión, entrevista a Dave Brown de AWS (02-05-2025).
