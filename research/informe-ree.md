# Revisión de capacidad de acceso de REE

Comprobado e integrado el 14 de octubre de 2026.

Se sustituye la edición de 3 de agosto por la de **1 de octubre de 2026**, enlazada en la [página oficial](https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso). Se revisaron el [CSV](https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/2026_10_01_GRT_demanda.csv), el [XLSX con leyenda y zonas](https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/2026_10_01_GRT_demanda.xlsx) y el PDF de la misma edición.

- 936 filas de nudos en el CSV, incluidos los códigos UFD. El informe del 5 de octubre contó solo las 928 filas con código numérico.
- Los **548 nudos** del ámbito existente tienen correspondencia exacta por código y nombre con tensión, incluidos los ocho UFD. No se amplía el inventario ni el ámbito territorial.
- 140 nudos cambian alguna magnitud principal o motivo respecto a agosto. Cambia la demanda otorgada en 6, la solicitada pendiente en 31, el margen total en 112, la capacidad disponible general en 102, el motivo de no otorgamiento en 18 y la marca de concurso en 3. Estas categorías se solapan.
- Los 19 pares de código y tensión repetidos se distinguen por el nombre de cada parte del nudo. No se fusionan barras ni se suman capacidades compartidas.
- La edición tiene 102 columnas. El importador reconstruye las cuatro filas de cabecera y localiza las columnas por su significado; no usa posiciones fijas. Se separan RdT y RdD, demanda y almacenamiento, y CEP CH, CEP SH y NO CEP.
- Se conservan los vacíos como null y los ceros como cero. Los marcadores NA/N/A se guardan además en valores_no_publicados_ree. Las posiciones E/P son recuentos; las capacidades se publican en MW. No se convierten MVA ni carga TI.

La edición se puede reconciliar con scripts/import-ree-capacity.mjs. Sin la opción --aplicar solo comprueba y resume. La integración exige que todos los nudos tengan correspondencia única; un cambio de cabecera, una fila duplicada o una ausencia bloquean la escritura. Las pruebas cubren esos casos, los códigos UFD, las barras con código compartido, los decimales españoles y la distinción entre cero y ausencia de dato.

SHA-256 del CSV descargado: 485ad3a29888125f946f3fe9b832f7f7116709d45e226d928982e7521e19bd1a.
