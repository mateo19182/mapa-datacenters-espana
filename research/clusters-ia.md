# Guía de la carrera de clústeres de IA

El vídeo ordena los mayores clústeres de cómputo del mundo desde 2007 hasta 2028
por su rendimiento pico. Sirve de contexto para el [inventario de cómputo](/computo):
lo que en España es un sistema grande puede quedar lejos de la escala de los
clústeres de entrenamiento de IA. Cubre el mundo entero, no solo España, y sigue
sus propios criterios, explicados aquí.

## Qué contamos como clúster

Un clúster es **un sistema o un emplazamiento con aceleradores programables que
funciona como una sola instalación**. Cada barra suma los aceleradores de ese
sistema o campus en una fecha.

Entran:

- Las GPU programables con CUDA, OpenCL o Brook+, desde 2007.
- Los aceleradores específicos de IA: TPU, Trainium, Ascend y Maia.
- Las máquinas científicas del TOP500 con GPU, aunque no se usen para IA. Pueden
  entrenar modelos y durante años fueron las mayores.
- Desde agosto de 2025, los emplazamientos completos de los centros de datos
  frontera, porque las fuentes ya no publican sistemas sueltos.

No entran:

- Las máquinas solo de CPU o con procesadores *many-core* de tipo CPU: Sunway
  TaihuLight y OceanLight, Tianhe-2 con Xeon Phi, Roadrunner con Cell.
- Los aceleradores no programables en general, como ClearSpeed o GRAPE, ni los
  clústeres anteriores a CUDA que usaban APIs gráficas.
- Los chips solo de inferencia, como la primera TPU (int8).
- **Los agregados de varios emplazamientos**: el entrenamiento repartido entre
  campus de Google, los cuatro subclústeres de Mole-8.7 o la cifra global de
  Prometheus. Se anotan, pero no forman una barra.
- Las flotas de una empresa y las regiones de nube.
- Los subconjuntos de una barra ya contada. Azure Eagle se conserva como sistema
  documentado; el edificio de Goodyear que probablemente lo contiene no se añade
  aparte para 2023.

Gyoukou, con chips PEZY-SC2, es el caso límite: es un *many-core* MIMD, no una
GPU. Se mantiene porque figuró en el TOP500 como sistema acelerado; se
desmanteló en abril de 2018.

## Qué mide cada barra

La barra es el **pico teórico denso de 16 bits** (BF16 o FP16, sin dispersión):
unidades × pico por chip. No es Linpack ni lo que la máquina rinde entrenando.
Junto a cada barra figura el equivalente en H100, con 989,5 TFLOP/s BF16 por
H100.

Esto rompe a propósito una regla del [inventario de cómputo](/computo): allí los
FLOPS no se comparan entre precisiones. Aquí hay una excepción documentada.
**Antes de Pascal (2016) las GPU no tenían FP16 rápido y se entrenaba en FP32**,
así que para esos chips se usa el pico FP32. Sin esa sustitución, Titan o
Tianhe-1A no aparecerían. En 2007–2009, el pico de NVIDIA incluye una
multiplicación adicional que el código rara vez aprovecha. Con dos tercios el
orden de las barras no cambia.

La métrica favorece a los emplazamientos. Una barra de 2026 puede reunir varios
clústeres en un mismo campus, mientras que una de 2018 es una sola máquina.

## Grupos y nombres

El color identifica a **quien controla el cómputo o entrena en él**, no al dueño
del edificio. Un campus de QTS alquilado a Meta cuenta como Meta. Si cambia el
inquilino, cambia el color: Colossus 1 pasa a Anthropic el 6 de mayo de 2026,
cuando empieza su arrendamiento. Colossus 2 sigue como xAI aunque desde mediados
de 2026 lo comparten Google, Anthropic y otros clientes.

## Fechas y proyecciones

Cada barra empieza en su primera fecha operativa. En el vídeo, los cambios de
capacidad se reparten durante unos cinco meses para que las barras no salten.
La tabla de datos conserva los escalones.

Todo lo posterior al 24 de octubre de 2026 es una **proyección** basada en planes
anunciados. Aparece rayado y con el rótulo «PROJECTED». Algunas ya muestran
retrasos: Stargate New Mexico tiene una notificación de fuerza mayor de Oracle, y
Stargate UAE no confirmaba sus primeros 200 MW en octubre de 2026. Según
SemiAnalysis, el escalón de GB300 de Colossus 2 llega entre tres y seis meses
antes de lo que lo sitúa Epoch.

## Líderes cada dos años

| Julio de | Mayor clúster | Equivalentes H100 | Umbral del n.º 12 |
| --- | --- | ---: | ---: |
| 2008 | Mole-9.7 (IPE, CAS) | 0,1 | — |
| 2010 | Tianhe-1 | 5 | — |
| 2012 | Tianhe-1A | 7 | 0,1 |
| 2014 | Titan (ORNL) | 75 | 1 |
| 2016 | Titan (ORNL) | 75 | 5 |
| 2018 | Summit (ORNL) | 3.493 | 75 |
| 2020 | Summit (ORNL) | 3.493 | 428 |
| 2022 | Frontier (ORNL) | 14.566 | 1.708 |
| 2024 | Clúster de Llama 3 de Meta | 24.576 | 10.106 |
| 2026 | xAI Colossus 2 | 1.111.673 | 242.547 |
| 2028 (proyectado) | Fairwater Wisconsin (Microsoft/OpenAI) | 4.527.539 | 1.164.022 |

## España en la carrera

El sistema español más grande del vídeo es **MareNostrum 5**, con 4.480 H100 en
su partición acelerada. En noviembre de 2023 alcanzó el **puesto 11 del mundo**
con esta métrica y salió de la lista en 2024. En octubre de 2026, el n.º 12
mundial ronda los 290.000 equivalentes H100, unas 65 veces MareNostrum 5. Las
1.920 GPU Blackwell de su ampliación de IA no cambian ese orden de magnitud.

El mayor proyecto anunciado en España, el clúster de CoreWeave en la Zona Franca
de Barcelona, prevé 10.224 H200, unos 10.000 equivalentes H100. Las fichas de
[MareNostrum](/proyecto/bsc-barcelona-marenostrum) y de
[Merlin Zona Franca](/proyecto/merlin-barcelona-zona-franca) conservan sus
fuentes.

## Fuentes

- **Epoch AI**: [AI Supercomputers](https://epoch.ai/data/ai-supercomputers) hasta julio de
  2025 y [Frontier Data Centers](https://epoch.ai/data/frontier-data-centers) desde agosto
  de 2025, con licencia CC BY.
- **TOP500**: sistemas GPU anteriores a 2013 que faltan en Epoch, como TSUBAME
  1.2, Tianhe-1, Titan, Summit o Piz Daint.
- **Comunicados, artículos técnicos y prensa especializada**: para identificar
  sistemas que Epoch anonimiza (Tianhe-1A, Fire-Flyer 2, Pengcheng Cloud
  Brain II) y nombrar a los inquilinos.
- **SemiAnalysis**, en sus partes públicas, para contrastar fechas, inquilinos y
  agregados de varios emplazamientos.

Cada corrección es una fila en `analisis/clusters-ia/data/research_*.csv`, con
su fuente, su confianza (alta o media) y una nota. Las filas `note` y `excluded`
documentan lo que se descartó. La tabla resultante se descarga en
[`/datos/clusters-ia.csv`](/datos/clusters-ia.csv).

## Cómo reproducirlo

```bash
cd analisis/clusters-ia
uv run build_data.py          # data/clusters.csv
uv run render.py --publicar   # out/race.mp4 y public/video/
```

Hace falta `ffmpeg` y la fuente Nimbus Sans. El vídeo tarda un par de minutos
en un equipo de 24 núcleos.
