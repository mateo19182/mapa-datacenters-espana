# Cómputo documentado en España

Revisión del 15 de octubre de 2026. El registro contiene 212 emplazamientos; 32
tienen información en `computo[]`, con 88 afirmaciones de hardware, particiones
o servicios. No son 88 máquinas independientes ni un inventario físico completo
del país. El [explorador de cómputo](https://datacenters.m19182.dev/computo/) y el
[JSON generado](../src/data/computo.json) permiten consultar cada afirmación con
sus fuentes y alcance.

El barrido de agosto y septiembre de 2026 consignaba 22 de 203 emplazamientos.
Es un resultado histórico: la revisión posterior incorporó el CSA de Cidade das
TIC, Correfoc y TalaIA, además de nuevas evidencias y correcciones. No se mantiene
la afirmación anterior de haber cerrado todo el universo de la RES.

## Qué significa cada registro

| Evidencia de despliegue o acceso | Entradas | Interpretación |
| --- | ---: | --- |
| Instalado | 59 | Una fuente documenta recursos físicos en el emplazamiento. No implica medición de uso ni inspección propia. |
| Adquirido | 4 | Compra documentada; instalación o servicio sin confirmar. |
| Previsto | 10 | Anuncio, adjudicación o despliegue futuro. No cuenta como instalación acreditada. |
| Acceso | 5 | Servicio ofrecido o capacidad contratada, sin acreditar por ello hardware físico local. |
| Ubicación o despliegue sin confirmar | 10 | Inventario conservado, pero sin atribución física confirmada a la sede de la ficha. |

La clasificación está en `modalidad`. El estado del recurso se conserva aparte:
una máquina puede prestar servicio en una sede anterior mientras migra a un
edificio en construcción. La fecha de consulta tampoco se convierte en fecha de
instalación. Las [reglas del esquema](../docs/ESQUEMA.md) detallan estos campos.

## Evidencia actual que cambia la lectura

| Emplazamiento | Lo documentado | Límite y referencia |
| --- | --- | --- |
| CoreWeave en MERLIN Edged Barcelona | Anuncio de 10.224 H200. MERLIN declara 15 MW IT para el edificio. | El anuncio dice que albergará esas GPU; el recuento completo queda previsto. La documentación vigente de CoreWeave confirma servicio H200 en Barcelona, sin cantidad ni inmueble de cada zona. [MERLIN](https://www.merlinproperties.com/prensa/el-alcalde-de-barcelona-inaugura-el-data-center-que-aloja-el-hiperescalar-lider-en-ia-de-coreweave/), [CoreWeave EU-SOUTH](https://docs.coreweave.com/platform/regions/eu-south), [ficha](../data/sites/merlin-barcelona-zona-franca.yaml). |
| BSC, MareNostrum 5 | La ficha técnica describe 4.480 H100 en ACC y 1.920 Blackwell/Blackwell Ultra en la partición de IA, además de las particiones CPU y sistemas cuánticos. | Son afirmaciones separadas. No se publica aquí una suma ni una clasificación nacional por tamaño. El rendimiento FP4 de IA no se compara con FP64. [BSC, información técnica](https://www.bsc.es/marenostrum/marenostrum/technical-information), [ficha](../data/sites/bsc-barcelona-marenostrum.yaml). |
| SCBI-UMA, Picasso | El inventario técnico vigente publica 32 A100 y 16 B200 entre los recursos disponibles. | La noticia del 10/07 acredita la compra de las B200; la prueba adicional de disponibilidad es el inventario actual, sin fecha de corte o día de puesta en producción. No se deduce el total multiplicando nodos. [Inventario SCBI](https://www.scbi.uma.es/web/es/recursos/hardware/), [adquisición UMA](https://www.uma.es/sala-de-prensa/noticias/la-uma-logra-una-financiacion-feder-de-32-millones-para-ampliar-la-capacidad-del-supercomputador-picasso/), [ficha](../data/sites/scbi-uma-malaga-picasso.yaml). |
| UPF, Correfoc | En servicio desde el 01/07/2026. La UPF publica 67 nodos, 7.968 núcleos y 57 L40S. | Los 24 nodos CPU descritos por la RES son una partición y no se suman al inventario global. La dirección de contacto no acredita la sala física. [Operación UPF](https://www.upf.edu/web/sct-sit/-/correfoc-the-new-upf-supercomputing-cluster-entered-into-operation-on-1-julycorrefoc-new-cluster-operation-1-july), [hardware](https://www.upf.edu/web/sct-sit/equipment), [ficha](../data/sites/upf-barcelona-correfoc.yaml). |
| UIB, TalaIA | Instalación completada en el primer semestre de 2026; 52 nodos CPU y 9.984 núcleos publicados por la RES. El operador documenta acceso mediante Slurm y recursos GPGPU. | No se publican modelo ni cantidad de GPU en las fuentes consultadas, ni día exacto de apertura. Se sitúa en el ParcBit sin inventar coordenadas de sala. [UIB](https://www.uib.cat/w/supercomputador?redirect=%2F&title_redirect=UIB), [RES](https://www.res.es/es/sobre-la-res/nodos/talaia-uib), [guía BSAI](https://bsai.uib.eu/acces-al-cluster-i-us), [ficha](../data/sites/uib-palma-talaia.yaml). |
| CSA de Cidade das TIC, A Coruña | El dosier de 2026 publica 15 L4; el catálogo técnico documenta L4 y A40 en la instalación. La oferta anuncia acceso a H200 de 141 GB. | El lanzamiento dice más de 15 L4. El catálogo discrepa entre 2 y 3 servidores A40; no se calcula un total. La H200 queda como acceso sin cantidad ni instalación física confirmada. [Ficha y fuentes primarias](../data/sites/cluster-tic-galicia-a-coruna-csa.yaml). |
| CESGA, nueva sede de A Sionlla | FinisTerrae IV y almacenamiento adjudicados el 03/03/2026. Se anunciaron IQM Radiance de 54 cúbits y Spark de 5. | Son equipos previstos, distintos del futuro superordenador de 1HealthAI. La convocatoria de presentación del 12/06 no acredita recepción ni servicio. FinisTerrae III y Qmio se conservan con ubicación sin confirmar en el edificio nuevo. [Adjudicación Xunta](https://www.xunta.gal/es/notas-de-prensa/-/nova/022035/xunta-adjudica-fsas-technologies-adquisicion-del-nuevo-supercomputador-del-cesga), [convocatoria CESGA](https://www.cesga.es/en/presentation-event-cesga-new-infrastructure/), [ficha](../data/sites/cesga-santiago-a-sionlla.yaml). |
| SCAYLE, nueva sede de Gaspar Morocho | Se conserva el inventario de Caléndula, incluido el total publicado de 181 GPU y la partición de 140 H100. | Son datos del servicio institucional. La migración desde Vegazana no permite afirmar qué particiones están ya en la nueva sede. Las seis entradas quedan con ubicación sin confirmar. [Ficha y fuentes](../data/sites/scayle-leon-gaspar-morocho.yaml). |
| Nebius en MERLIN Edged Getafe | MERLIN confirma un contrato de 18 MW para Nebius. | Es capacidad contratada. La documentación actual de Nebius ofrece RTX PRO 6000 en Madrid, pero no vincula esa región con este edificio. El contrato no acredita instalación física ni cantidad. [MERLIN](https://www.merlinproperties.com/dia-a-dia/firmamos-un-contrato-de-18-mw-con-nebius-para-nuestro-date-center-madrid-getafe/), [ficha](../data/sites/merlin-edged-getafe-mad01.yaml). |
| CITIC, Campus de Elviña | La memoria documenta adquisición de H100 y kits Jetson AGX Orin/Thor sin recuento. | Se clasifica como adquirido, con servicio sin confirmar. Es un emplazamiento distinto del CSA. [Ficha y memoria](../data/sites/citic-a-coruna-elvina.yaml). |

El resto de inventarios públicos del barrido anterior se conserva en sus fichas,
con sus fechas y discrepancias. Incluye BIFI, CCC-UAM, CeSViMa, COMPUTAEX, CSUC,
IAC, NASERTIC, PIC, IFCA y la Universitat de València. La anotación de
`modalidad` sobre fuentes ya citadas no supone renovar todas esas cifras a
octubre de 2026.

## Incorporaciones de GPU privadas e I+D del 15 de octubre

| Emplazamiento | Evidencia incorporada | Límite |
| --- | --- | --- |
| [Cogent San Sebastián de los Reyes](../data/sites/cogent-san-sebastian-de-los-reyes.yaml) | Dos servidores de Hostealo con cuatro RTX PRO 6000 Blackwell y cuatro RTX 6000 Ada. | Cantidades explícitas del cliente; no inventario de todo Cogent. Fecha de instalación y MW desconocidos. |
| [DATA4 Alcobendas](../data/sites/data4-alcobendas-mad01.yaml) | Acceso EasyDataHost a Blackwell, H200 y DGX Spark. | Ofertas comerciales vinculadas al campus, sin recuento instalado ni edificio interior. |
| [TECNALIA Derio](../data/sites/tecnalia-derio-deep-learning.yaml) | Seis servidores GPU en el edificio 700. | El total publicado de 13 GPU contradice el desglose. No se reconcilia ni se fecha el inventario. |
| [AIMEN AM Pilot Factory](../data/sites/aimen-porrino-am-pilot-factory.yaml) | Un servidor con dos RTX 8000 y tres configuraciones RTX20XX de dos tarjetas cada una. | Se conservan configuraciones y familia incompleta, sin calcular una flota total. |
| [CTAG HAARO](../data/sites/ctag-porrino-haaro.yaml) | GPU documentadas en el laboratorio de A Granxa, O Porriño. | Modelo, cantidad y fecha de entrega desconocidos. |
| [CTIC Cabueñes](../data/sites/ctic-gijon-cabuenes.yaml) | Servicio GPU en uso y dos compras adjudicadas separadas: A100 de 2021 y Blackwell de 2026. | El servicio no cierra modelos instalados. Las compras siguen adquiridas, sin recepción; Blackwell admite equivalentes. |
| [Digital Realty BCN1](../data/sites/digital-realty-sant-adria-bcn1.yaml) | Blackfuel anuncia AMD MI355X con entrega y servicio previstos para 2026. | Modalidad prevista, sin recuento ni puesta en producción confirmada. |

Los centros tecnológicos se describen como I+D, separados de proveedores comerciales.
La [investigación completa](revisiones/2026-10-15-gpu-privadas.md) conserva las
fuentes y los casos que aún no identifican un centro. Las pistas de GPU Solutions,
ARQUIMEA, Idoven, Arsys, Gradiant/CESGA y los servicios regionales permanecen en
la [cola de revisión](../data/revision.yaml), sin nuevos puntos físicos inferidos.

## Reglas para comparar sin fabricar totales

- Se conserva el ámbito de sistema o partición. Un total y su desglose pueden
  describir el mismo equipo y no se suman.
- Si una fuente solo da nodos y tarjetas por nodo, no se rellena un recuento
  calculado. Picasso es diferente: el operador sí publica 32 A100 y 16 B200.
- Se mantienen las contradicciones. CESGA publica 128 y 141 A100 para
  FinisTerrae III; también hay diferencias de rendimiento o configuración en
  fuentes de BSC, CeSViMa y COMPUTAEX. No se elige una cifra por parecer mayor o
  más reciente sin comprobar su alcance.
- Los cúbits, GPU, CPU, núcleos y nodos son unidades distintas. Las tecnologías
  cuánticas y las precisiones de FLOPS tampoco forman una escala común.
- Ninguna cantidad de GPU o FLOPS se convierte en MW. La carga IT, la conexión,
  el respaldo eléctrico y el consumo medido describen magnitudes diferentes.

La cuántica conserva ese tratamiento. IBM Euskadi, MareNostrum Ona y EuroQCS
figuran con las fuentes de sus respectivas fichas. Los sistemas anunciados de
CESGA y el desarrollo óptico del VQCC no se presentan como capacidad cuántica
operativa añadida. Qmio no se atribuye físicamente a A Sionlla sin confirmar su
traslado.

## Lo que sigue sin atribución suficiente

Las declaraciones sobre GPU o silicio propio en una región de AWS o Microsoft
no identifican por sí solas el edificio que los aloja. Lo mismo ocurre con
catálogos de GPU como servicio y ofertas de nodos edge. Hace falta una relación
pública entre el hardware y el emplazamiento; una región, modelo comercial o
contrato de MW no la sustituye.

La documentación de CoreWeave enumera B200 y RTX PRO 6000 Blackwell en su zona
EU-SOUTH-04A de Álava. No publica recuento ni correspondencia inequívoca con un
edificio del registro, por lo que no se asigna ese inventario a Arasur por
coincidencia provincial.

El anuncio anterior Solaria/Datasection de Puertollano permanece separado de la
nueva propuesta municipal de septiembre de 2026. Ni los racks previstos de aquel
acuerdo ni los umbrales de programas europeos de gigafactorías acreditan hardware
instalado en una ficha. Las adjudicaciones, anuncios y solicitudes de acceso
seguirán en su categoría hasta obtener evidencia de entrega, ubicación o
servicio.

Estas son limitaciones de la evidencia reunida, no afirmaciones de que el
hardware o los centros no existan. Siguen abiertos los inventarios corporativos,
el HPC industrial, CPD universitarios fuera de la muestra y las ubicaciones de
servicios edge.

## Alcance territorial y revisión complementaria

Desde septiembre el inventario incluye territorios españoles insulares. La
capa de acceso eléctrico también incorpora el CSV íntegro de REE del
01/10/2026: 937 nudos, incluidos 78 de Baleares, 99 de Canarias y uno de Ceuta,
además de los peninsulares. Ese fichero no publica un nudo de Melilla. Los
sistemas eléctricos se distinguen y sus capacidades no se agregan como si
formaran una única red. Véase [capacidad de demanda](../data/red/capacidad.yaml).

La [revisión de campus del 14 de octubre](revisiones/2026-10-14-campus-computo.md)
detalla las fuentes nuevas, 15 campus comerciales, recuperaciones fallidas y
huecos de MW IT, permiso de acceso y agua medida. No se contactó con terceros.
Las fuentes de cada cifra permanecen junto al dato en `data/sites/*.yaml`.
