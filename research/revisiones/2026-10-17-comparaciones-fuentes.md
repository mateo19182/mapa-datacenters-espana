# Comparaciones y seguimiento de fuentes, 17 de octubre de 2026

Se conserva la huella completa anterior. La extracción de texto añade contexto para
revisar un cambio; no acepta hechos, no renueva fechas factuales y no cierra avisos.

## Qué muestra el informe

- Diferencias de texto con un extracto del primer cambio y su versión de referencia.
  Si falta la versión aceptada, la comparación se identifica como observación anterior.
- Páginas PDF con texto distinto cuando ambas extracciones están disponibles.
- Posibles cambios de plantilla, agrupados por dominio, diferencia y fecha/base de
  comparación. Una coincidencia en el contenido principal no elimina el aviso.
- Cambios binarios con el mismo texto extraído, migraciones de huellas por tamaño a
  huellas de contenido y documentos sin una extracción anterior comparable.

Los hashes históricos no conservan texto. No se reconstruyen diferencias pasadas a
partir de tamaños. Una segunda modificación de un PDF sí puede compararse con la
primera observación guardada, aunque su base aceptada siga usando tamaño.

Las instantáneas completas permanecen en `build/fuentes-cache/`, con hasta tres
versiones por URL y 200.000 caracteres por extracción. El sitio publica como máximo
24 palabras de extractos por comparación. Una extracción truncada no permite afirmar
que todo el texto sigue igual.

## Ejecución real

La comprobación de 11:52 a 11:56 UTC consultó las 1.021 referencias registradas:
899 respondieron con contenido, 100 bloquearon al comprobador, cinco devolvieron
404/410 y 17 no pudieron comprobarse. Las 908 huellas previas se conservan.

Quedaron 510 cambios pendientes: 69 primeras huellas PDF y 441 sin texto histórico
comparable. No equivalen a 510 cambios factuales. Esta ejecución inicia el historial
y guarda unos 20 MiB de instantáneas para comparaciones posteriores.

`data/seguimiento-fuentes.json` conserva hasta 52 ejecuciones con duración, cobertura,
resultados y contadores antes/después. Las ejecuciones parciales y fallidas mantienen
su alcance. Generar informes o exportar datos no añade ejecuciones. El resumen advierte
que una cola más corta no demuestra mayor precisión.

## Regresiones verificadas

La revisión independiente reprodujo y permitió corregir cinco casos: texto igual solo
antes del límite de extracción; pérdida de una comparación al fusionar observaciones;
historial incompleto; segunda modificación PDF durante la migración; y agrupación de
comparaciones con fechas o bases distintas. Las pruebas quedan en
`scripts/source-content.test.mjs` y `scripts/source-review.test.mjs`.

Dos ejecuciones aisladas del CLI verificaron alcance parcial y fallo de escritura de
caché. Ambas conservaron las huellas previas y los YAML; el fallo produjo código 1 y
un historial fallido, mientras el trabajo pendiente produjo código 10.

## Dependencias y mapa

La auditoría encontró siete dependencias afectadas, incluida la
[vulnerabilidad del saneador de MapLibre](https://github.com/maplibre/maplibre-gl-js/security/advisories/GHSA-jrc7-96c5-q579).
Se actualizaron dependencias compatibles y MapLibre a 6.14.0. La auditoría posterior
no encontró vulnerabilidades.

La [migración oficial a MapLibre 6](https://github.com/maplibre/maplibre-gl-js/blob/v6.0.0/docs/guides/v5-to-v6-migration-guide.md)
requiere publicar su worker como archivo separado al usar Vite. El sitio lo importa
como recurso propio y conserva la lista cuando WebGL2 no está disponible. Una prueba
de navegador comprueba la respuesta y el tipo MIME del worker, el dibujo WebGL2 y la
ausencia de fallos; se inspeccionó también la captura con los puntos renderizados.
