# Guía del acceso a la red

El permiso de acceso y la capacidad del centro describen cosas distintas. Esta guía
explica cómo leerlos; los nudos, sus valores y la fecha del CSV están en
[Red eléctrica](/red-electrica).

## Acceso, conexión y suministro

El permiso de acceso reconoce capacidad en la red. El de conexión fija las
condiciones técnicas para conectarse, incluidas las obras necesarias. Obtenerlos
no acredita que el centro esté construido o reciba suministro.

Red Eléctrica gestiona el acceso en transporte; las distribuidoras, en sus redes.
Una solicitud en distribución puede necesitar un informe de aceptabilidad de REE
por su efecto aguas arriba. Por eso, una conexión a menor tensión también puede
estar limitada por la red de transporte.

El [RD 1183/2020](https://www.boe.es/buscar/act.php?id=BOE-A-2020-17278) regula el
procedimiento general y la [Circular CNMC 1/2024](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-20760),
la metodología de demanda. Los cambios, requisitos y plazos se mantienen en sus
[fichas normativas](/normativa).

## Qué representa cada cifra

| Dato | Qué describe |
| --- | --- |
| Solicitada o en curso | Capacidad pedida, pendiente de resolver. |
| Otorgada | Capacidad reconocida en un permiso. |
| Contratada | Potencia del contrato de acceso a la red. |
| Disponible | Margen publicado para nuevas solicitudes bajo un criterio técnico. |
| MW IT | Capacidad de los equipos informáticos del centro. |

Estas cifras pueden corresponder a fases y fechas diferentes. Un permiso puede
cubrir el campus completo cuando solo funciona un edificio. Los MW IT excluyen
refrigeración y otros servicios auxiliares; no se obtiene una magnitud de la otra
aplicando un PUE supuesto.

## Cómo leer la tabla de REE

La [publicación oficial](https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso)
se actualiza por ediciones. En el explorador se conserva la fecha, el código de
subestación y la fila del CSV original.

- **CEP CH** corresponde a demanda con electrónica de potencia que cumple los
  requisitos de comportamiento ante huecos de tensión.
- **CEP SH** corresponde a esa demanda sin cumplimiento de dichos requisitos.
- **No CEP** corresponde a demanda sin electrónica de potencia en la interfaz.

El orden inicial usa el mayor de los tres valores para explorar la tabla. No es
una capacidad garantizada para un CPD: hay que consultar el criterio aplicable a
su diseño. La sección de detalle identifica la limitación publicada por REE.

Los márgenes de distintos nudos pueden compartir restricciones y no se suman.
Un cero expresa ausencia de margen por el criterio publicado; una celda sin dato
significa que REE no publica ese valor. Puede haber capacidad reservada a concurso
u otras vías de tramitación.

## Concursos y acceso flexible

La prelación temporal es el criterio general de tramitación, con excepciones
reguladas. Los concursos adjudican capacidad mediante criterios específicos;
no convierten automáticamente el margen del nudo en un permiso para cualquier
solicitante.

El acceso flexible admite restricciones de suministro. Sus modalidades,
condiciones y fechas de implantación están en la
[ficha de la resolución de 2026](/normativa/resolucion-acceso-flexible-demanda-2026).
Disponer de baterías o respaldo no demuestra por sí solo que un CPD sea elegible.

## Tabla y mapa tienen coberturas distintas

Una fila de capacidad puede carecer de coordenadas o de correspondencia con una
subestación cartográfica. Conserva sus datos en la tabla. La proximidad de un
centro a una línea o un nudo tampoco demuestra que esté conectado a ellos.

Los valores de REE son agregados por nudo. La atribución de un permiso a un
proyecto concreto requiere otra fuente que identifique al titular, la instalación
y su capacidad. La capa de transporte no sustituye los portales de distribución.
