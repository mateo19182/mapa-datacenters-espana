# Ensayo REE: capacidad de acceso de demanda

Consulta: 2026-09-30. Alcance: última edición del CSV de demanda de la red de transporte.

## Evidencia

La [página oficial de REE](https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso) indica «Información actualizada a 1 de septiembre de 2026» en «Resultados de los estudios de capacidad». Su enlace de formato CSV apunta a [2026_09_01_GRT_demanda.csv](https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/2026_09_01_GRT_demanda.csv). Es la edición más reciente enlazada allí en esta consulta.

## Comparación y próxima revisión

`data/red/capacidad.yaml` conserva `fecha_publicacion_dato: "2026-08-03"`, el CSV `2026_08_03_GRT_demanda.csv` y `fecha_consulta` y `ultima_verificacion` de 2026-08-29. Por tanto, la procedencia y las cifras de capacidad del YAML corresponden a una edición anterior. Este ensayo no compara valores del CSV nuevo ni atribuye cambios a nudos concretos.

Próxima acción: descargar el CSV del 1 de septiembre, comprobar nombres de columnas y unidades, y conciliar sus filas con el YAML por código de subestación y tensión. Registrar cada diferencia de valor y de cobertura antes de proponer una actualización conjunta de cifras, fuente y fechas; no cambiar solo la fecha.
