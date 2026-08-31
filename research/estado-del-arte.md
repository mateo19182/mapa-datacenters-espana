# Estado del arte: quién más ha mapeado los centros de datos de España

Revisión cerrada el 2026-08-31. Busca responder a una pregunta incómoda antes de
seguir invirtiendo esfuerzo: **¿existe ya alguien que haya hecho este trabajo, y
mejor?**

La respuesta corta es que no, pero con matices que conviene conocer, porque hay
cuatro o cinco fuentes que cubren trozos de esto mejor que nosotros y una norma
en tramitación que puede dejar obsoleta la mitad del proyecto.

---

## 1. Nadie publica el recuento, y los que hay no coinciden

El indicio más claro de que no existe un censo fiable es que **ninguna de las
fuentes disponibles cuenta lo mismo**:

| Fuente | Emplazamientos en España | Qué cuenta |
|---|---:|---|
| Data Center Map | 156 (el título de su propia página dice 219) | Instalaciones comerciales operativas |
| Colo Map | 215 | Colocation, orientado a comparar proveedores |
| Datacenters.com | 148 (su título dice 167) | Colocation y nube, con fines comerciales |
| Baxtel | 191 | Comerciales, con seguimiento de obra |
| DataCentersExposed | 68 | Solo centros «de IA», 4 operativos |
| Este registro | 180 | Comerciales, corporativos, públicos y proyectos anunciados |

Dos de esas páginas se contradicen consigo mismas entre el título y el cuerpo, lo
que ya dice bastante del cuidado con que se mantienen. Y la horquilla real va de
68 a 215 según qué se decida que es un centro de datos. Nadie explica su criterio
de inclusión, así que las cifras no son comparables entre sí ni con la nuestra.

Esa dispersión es, en sí misma, el argumento más fuerte a favor de seguir: el
sector no tiene un padrón, solo tiene listas.

---

## 2. Directorios comerciales

- **Data Center Map** — https://www.datacentermap.com/spain/
- **Colo Map** — https://colomap.com/datacenters/country/es/
- **Datacenters.com** — https://www.datacenters.com/locations/spain
- **Baxtel** — https://baxtel.com/data-center/spain (vende un dataset global de más
  de 10.900 emplazamientos y expone API: https://baxtel.com/services/datasets)
- **Cloudscene** — https://cloudscene.com/market/data-centers-in-spain/all
- **PeeringDB** — base mantenida por la comunidad, útil para instalaciones de
  interconexión y puntos neutros, no para hiperescala ni para proyectos.

Todos son, en el fondo, **generación de leads para vender colocation**. Eso
determina lo que traen y lo que les falta. Traen bien la instalación comercial que
ya está en servicio, con sus carriers y sus certificaciones. No traen el proyecto
anunciado, el CPD corporativo de un banco, el centro público de supercomputación
ni el expediente ambiental. No distinguen MW IT de MW de conexión. Y sobre todo,
**no citan de dónde sale cada cifra**, que es justamente lo que aquí se considera
el dato.

Baxtel es el más interesante de los seis: sigue el ciclo completo desde el anuncio
hasta la operación y presume de cubrir mercados secundarios. Si algún día se
contrasta este registro contra un tercero, es el candidato.

---

## 3. La patronal: SpainDC

https://spaindc.com/informes/

La Asociación Española de Data Centers publica el material agregado más serio que
hay en abierto:

- *Informe anual 2025 del sector de Centros de Datos en España* (septiembre de
  2025), encargado a Pb7 Research.
- *Estudio de demanda e impacto de los Centros de Datos en España* (febrero de 2025).
- *Informe del Sector Data Center en España 2024*, con dirección técnica de la
  Universidad Pontificia Comillas.
- *Guía del sector 2024*, con un mapa del ecosistema y el listado de socios.

Es bueno para cifras de mercado y pésimo para lo que hacemos: son agregados
nacionales, no datos por emplazamiento. En marzo de 2026 proyectaron 66.900
millones de inversión hasta 2030 y más de 16.000 empleos. Cifras de esa clase no
se pueden atribuir a ningún punto del mapa.

Hay además un conflicto de interés que conviene decir en voz alta: SpainDC
representa los intereses del sector y ha criticado públicamente la
«discrecionalidad» del nuevo decreto energético. Sus informes son fuente legítima
sobre lo que la industria afirma, no árbitro neutral sobre lo que la industria
consume. El propio elDiario.es documentó en mayo de 2024 que la patronal decía
carecer de datos concretos del consumo de agua del sector.

### 3.1. Su informe sí se puede leer, y sirve de contraste

El *Informe anual 2025* está en abierto y es texto extraíble, no imagen. Da la
única cifra nacional con la que podemos calibrar el conjunto:

> «la potencia TI instalada de los centros de datos comerciales (colocation e
> hyperscale) alcanzó 439 MW, un 24% [más]»

Nuestro total de **MW IT en servicio es de 276,5 MW**, repartido en apenas 9
emplazamientos con dato de 75 en servicio. Comparado con los 439 MW de SpainDC,
cubrimos en torno a **dos tercios de la capacidad operativa del país con una
octava parte de las fichas**.

Las dos cifras no son estrictamente comparables: SpainDC cuenta solo instalaciones
comerciales y nosotros incluimos además CPD corporativos, públicos y
universitarios. Pero la comparación mide justo lo que interesa, que es cuánta
capacidad real se nos escapa, y dice que el hueco es grande pero no abismal. Es el
mejor termómetro externo que tenemos y debería entrar en `cobertura.md`.

El informe trae además un dato que encaja de lleno con nuestra capa de red y que
no habíamos registrado: **solo se ha adjudicado 1 de cada 4 MW de potencia
solicitada**.

---

## 4. Lo que está detrás de un muro de pago

- **DC Byte** — https://www.dcbyte.com/analytics/ · más de 8.400 centros, la
  referencia de la industria para pipeline y capacidad.
- **Structure Research** — informe específico *Madrid + Barcelona DCAI 2026*,
  junio de 2026: https://www.structureresearch.net/product/madrid-barcelona-dci-report-2026-data-centre-colocation-hyperscale-cloud-ai-interconnection/
- **Cushman & Wakefield**, *Global Data Center Market Comparison 2026*, 107
  mercados y 24 variables.

Estos tres sí tienen, casi con seguridad, el desglose por emplazamiento y por fase
que a nosotros nos cuesta reconstruir a mano. No son accesibles y **no deben
copiarse aunque lo fueran**: son obra ajena bajo licencia. Sirven como control de
calidad si alguna vez hay acceso legítimo, no como fuente.

---

## 5. Rastreadores activistas y periodismo de investigación

Esta es la parte que más me ha sorprendido, y donde estamos claramente por detrás.

- **Tu Nube Seca Mi Río** — https://tunubesecamirio.com/ · publica el informe *El
  Precio de las Nubes* sobre los centros de datos de Aragón
  (https://tunubesecamirio.com/downloads/informe_centro_de_datos_aragon.pdf) y ha
  presentado alegaciones conjuntas a las ampliaciones de Amazon. Quien presenta
  alegaciones ha leído el expediente entero, que es exactamente el documento que a
  nosotros se nos resiste.
- **No Centros de Datos Aragón** — https://nocentrosdedatosaragon.org/ · campaña
  «No es sequía, es saqueo», desde septiembre de 2025.
- **DataCentersExposed** — https://datacentersexposed.com/es · rastrea 68 centros
  de IA en España, con metodología y fuentes publicadas y límites administrativos
  de geoBoundaries. Es el proyecto más parecido al nuestro en espíritu, aunque con
  un recorte temático mucho más estrecho.
- **iasostenible.com** — https://iasostenible.com/centros-de-datos-ia-espana/ ·
  mapa de «polos verificados». Su nota metodológica confirma nuestro diagnóstico
  con todas las letras: «No existe un inventario público, completo y geolocalizado
  de todos los centros españoles.»

Y el periodismo, que en agua va muy por delante de nosotros:

- EL PAÍS: el centro de Meta en Talavera y sus 600 millones de litros (mayo de
  2023), y la petición de Amazon de un 48% más de agua para Aragón ante el INAGA
  (marzo de 2025).
- elDiario.es: la negativa de Google, Microsoft y Amazon a dar cifras (mayo de
  2024) y el decreto de reporte obligatorio (agosto de 2025).
- RTVE: «Una nube sin agua» (agosto de 2024).
- 20minutos: los 68 millones de litros que AWS declaró haber consumido en Aragón
  en 2025 (junio de 2026).

**Conclusión práctica:** el bloque `agua` que acabamos de añadir al esquema tiene
material esperando. Estas piezas citan expedientes concretos del INAGA con cifras
concretas. Es la vía más rápida para llenarlo.

---

## 6. Fuentes oficiales, y la norma que puede dejarnos obsoletos

Esto es lo más importante de todo el documento.

**Directiva (UE) 2023/1791, artículo 12, y Reglamento Delegado (UE) 2024/1364.**
https://eur-lex.europa.eu/eli/reg_del/2024/1364/oj

La Unión Europea ya obliga a los centros de datos a partir de cierto tamaño a
reportar consumo energético, consumo de agua, PUE, WUE y superficie, y crea una
base de datos europea. El reglamento dice expresamente que los Estados deben
exigir a propietarios y operadores «to make publicly available the information
regarding their data centres set out in Annex VII», y prevé la disponibilidad
pública de lo reportado **en forma agregada**.

Esa última palabra es la clave, y es la razón por la que este proyecto sigue
teniendo sentido: si la publicación europea es agregada, seguirá sin haber dato
por emplazamiento. Pero hay que vigilarlo de cerca, porque si algún día se publica
desagregado, buena parte de lo que hacemos a mano se vuelve innecesario.

**Transposición española.** El MITECO coordina la transposición del artículo 12
(https://www.miteco.gob.es/es/energia/eficiencia/centros-de-datos.html). El
Proyecto de Real Decreto de requisitos de sostenibilidad energética, medioambiental
y de resiliencia y soberanía digital para centros de datos:

- Borrador de agosto de 2025 en audiencia pública del 8 de agosto al 15 de
  septiembre de 2025:
  https://www.miteco.gob.es/content/dam/miteco/es/energia/files-1/es-ES/Participacion/Documents/anexos/aeip-rd-cpds/20250807_RD-CD.pdf
- Informe de la CNMC sobre el proyecto:
  https://www.cnmc.es/sites/default/files/6422385.pdf
- **Nueva audiencia pública por vía de urgencia abierta el 1 de agosto de 2026**:
  https://digital.gob.es/comunicacion/notas-prensa/mtdfp/2026/08/el-gobierno-plantea-impulsar-los-centros-de-datos-sostenibles--e
  y https://www.miteco.gob.es/va/energia/participacion/2026/detalle-participacion-publica-k-851.html

Está vivo ahora mismo. Merece seguimiento propio.

**Otras oficiales ya utilizables:**

- **INAGA** (Instituto Aragonés de Gestión Ambiental): la mina del conjunto.
  Publica las declaraciones de impacto ambiental con número de expediente en el
  BOA y en gd.aragon.es. Ya hay resoluciones de octubre de 2025 sobre las
  infraestructuras hidráulicas de los centros CAR, BDE, VDG1, VDG2 y Walqa de
  Amazon. Explica por sí sola por qué 45 de nuestras 81 fuentes oficiales son
  aragonesas.
- **Registros de Aguas de las confederaciones hidrográficas**, donde se inscriben
  las concesiones de uso privativo. El Ebro tiene consulta de expedientes en
  https://iber.chebro.es/consultas/ , el Duero en
  https://infoexpedientes.chduero.es/infopublicachd/acCriterios.aspx y el Júcar
  documenta su Registro de Aguas en https://www.chj.es . Aquí está el consumo real
  autorizado, no el anunciado. Ver `research/acceso-a-fuentes.md`.
- **Inventario de Infraestructuras Tecnológicas** del Ministerio de Ciencia
  (https://www.ciencia.gob.es/Innovar/inventario_infraestructuras.html), útil para
  centros públicos de supercomputación.

---

## 7. Qué hace este registro que no hace ningún otro

Después de revisarlos todos, cuatro cosas, y solo cuatro:

1. **Procedencia por dato.** Ninguna de las fuentes anteriores dice de dónde sale
   cada cifra concreta. Los directorios comerciales no citan; los informes citan
   en bloque; los activistas citan bien pero solo su territorio.
2. **Separar los tipos de potencia.** Todos los demás publican «MW» a secas. La
   diferencia entre carga TI y potencia de conexión es de más del doble, y
   confundirlas es el error dominante del sector.
3. **Incluir lo que no es comercial**: CPD bancarios, supercomputación pública,
   estaciones de aterraje de cable submarino, proyectos cancelados.
4. **Mostrar los huecos.** `pendientes.yaml`, `incertidumbres[]` y la auditoría de
   cobertura no tienen equivalente en ninguna de estas fuentes. Todas las demás
   presentan sus listas como completas.

Donde estamos claramente por detrás: **agua** (los activistas y EL PAÍS nos ganan),
**pipeline con capacidad por fase** (DC Byte, de pago) y **cifras agregadas de
mercado** (SpainDC).

---

## 8. Qué haría a continuación

En orden de rentabilidad:

1. **Vaciar el informe de Tu Nube Seca Mi Río y las alegaciones a Amazon** contra
   nuestras fichas aragonesas. Es material ya digerido, con número de expediente,
   y llena el bloque `agua` recién creado.
2. **Seguir el Real Decreto** en audiencia pública desde el 1 de agosto de 2026.
   Si obliga a publicar por emplazamiento, cambia el proyecto entero.
3. **Contrastar el recuento contra Baxtel y Data Center Map** y publicar las
   diferencias en `cobertura.md`. No para copiarles, sino para saber cuántos
   emplazamientos comerciales operativos se nos escapan.
4. **Explorar los Registros de Aguas** de las confederaciones del Ebro, Duero,
   Júcar y Tajo. Es la única vía a un consumo de agua autorizado y verificable,
   en lugar de anunciado.
