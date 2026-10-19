# Capacidad de acceso para demanda: edición de octubre de 2026

Revisada el 14 de octubre de 2026. La [página de REE](https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso) enlaza la edición de **1 de octubre de 2026**.

- **937 registros oficiales**, con todas las tensiones y territorios de la publicación. La cifra anterior de 936 omitía SOLLER 66, código VS-7061.
- 759 peninsulares, 78 de Baleares, 99 de Canarias y uno de Ceuta. No hay fila de Melilla en este CSV.
- Los 548 registros anteriores conservan sus correspondencias exactas y se añaden 389. La geometría sigue requiriendo fuentes propias; una fila nueva no recibe coordenadas ni conexiones por proximidad.
- Los ocho códigos UFD de Madrid y VS-7061 se conservan. Un identificador con formato no reconocido bloquea la importación, no desaparece del recuento.
- Se mantienen separados valores nulos, NA/N/A y ceros. No se convierte capacidad de acceso a carga IT ni se suman márgenes compartidos.
- El CSV original se conserva íntegro en `data/red/capacidad-ree-2026-10-01.csv`, con SHA256 `485ad3a29888125f946f3fe9b832f7f7116709d45e226d928982e7521e19bd1a`.

El importador reconoce las columnas por su cabecera jerárquica, exige correspondencia de los nudos existentes y valida también las altas. `node scripts/import-ree-capacity.mjs fichero.csv AAAA-MM-DD` informa; `--aplicar` guarda los datos y el original. Las ocho pruebas incluyen la publicación completa. Reaplicar esta edición sobre los 937 registros no produce cambios.

La comparación inicial de octubre con agosto detectó cambios de cantidades o motivos en 140 de los 548 nudos del ámbito anterior. Ese recuento histórico no describe el número de altas de la ampliación nacional.

[Revisión y fuentes de red y normativa](revisiones/2026-10-14-red-normativa.md).
