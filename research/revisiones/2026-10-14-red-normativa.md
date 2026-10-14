# Revisión de red y normativa, 14 de octubre de 2026

## Red: publicación completa de octubre

Se descargó de nuevo el [CSV oficial de REE de 1 de octubre](https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/2026_10_01_GRT_demanda.csv). La [página oficial](https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso) identifica esa edición como vigente en la consulta del 14 de octubre.

El fichero tiene cuatro filas lógicas de cabecera y **937 registros**, todos de 102 columnas. Los 548 nudos anteriores tienen correspondencia exacta por nombre con tensión y código. Se añaden 389, sin inventar coordenadas ni vínculos físicos.

| Ámbito territorial | Registros | Qué significa |
|---|---:|---|
| Península | 759 | Los 548 anteriores y 211 altas |
| Baleares | 78 | Incluye SOLLER 66, código VS-7061 |
| Canarias | 99 | No se presupone un único sistema interconectado |
| Ceuta | 1 | VIRGEN DE AFRICA 132 |

El CSV no contiene un registro identificado como Melilla. Esto describe esta publicación, no la existencia de infraestructura en Melilla.

La cifra anterior de 936 omitía SOLLER 66 porque su código no era numérico ni empezaba por UFD. El nuevo importador acepta identificadores con prefijo y bloquea formatos no reconocidos o filas incompletas, en vez de omitirlos. Los ocho códigos UFD de Madrid también se conservan. No se unen barras distintas porque compartan código.

El CSV íntegro se guarda en `data/red/capacidad-ree-2026-10-01.csv`. SHA256:

`485ad3a29888125f946f3fe9b832f7f7116709d45e226d928982e7521e19bd1a`

Cada registro conserva la fila lógica del CSV, el nombre territorial literal y su nombre canónico. El archivo original permite recuperar valores sin publicar, vacíos, marcadores NA/N/A y columnas no normalizadas. Los ceros publicados siguen siendo ceros. Los MW de acceso no se convierten a MW IT y no se suman márgenes compartidos.

La tabla de capacidad y la geometría son capas distintas. No se crean marcadores para las altas sin coordenadas; `subestacion_id` y `sistema_electrico` quedan vacíos salvo referencia documentada. `ambito_electrico` separa territorios y no atribuye el nudo a una isla concreta.

## Normativa: cuatro registros nuevos

| Registro | Hecho comprobado | Estado a 14 de octubre |
|---|---|---|
| Etiquetado europeo | Comisión adopta C(2026) 3472 el 21 de septiembre; Parlamento amplía el examen el 6 de octubre y anuncia remisión el 7 | Adoptada bajo control institucional; no se presenta como vigente |
| Estándares mínimos europeos | Consulta del 21 de septiembre al 14 de diciembre de 2026 | Consulta previa, sin propuesta articulada ni mínimos aplicables |
| Calor residual español | Segunda audiencia del 27 de mayo al 17 de junio de 2026 | Cerrada; proyecto en tramitación, sin texto definitivo localizado |
| Acceso flexible | Resolución de 31 de julio, publicada el 11 de agosto, con efectos generales el 1 de septiembre | En vigor, con implantación por modalidades y gestor |

Fuentes primarias:

- Etiquetado: [texto C(2026) 3472](https://data.consilium.europa.eu/doc/document/ST-13444-2026-INIT/en/pdf), [anexos](https://data.consilium.europa.eu/doc/document/ST-13444-2026-ADD-1/en/pdf) y [procedimiento parlamentario 2026/2895(DEA)](https://oeil.europarl.europa.eu/oeil/en/procedure-file?reference=2026/2895(DEA)). Los artículos 3 y 7 distinguen la primera emisión prevista para el 15 de agosto de 2027 de la entrada en vigor tras publicación. Las clases A-G de PUE y WUE no son una obligación general de alcanzar A. Los cambios de metodología de agua dulce siguen sujetos a la entrada en vigor del acto.
- Estándares mínimos: [anuncio de la Comisión de 21 de septiembre](https://energy.ec.europa.eu/news/minimum-performance-standards-data-centres-europe-public-consultation-launched-2026-09-21_en) y [confirmación española del plazo](https://www.miteco.gob.es/es/energia/eficiencia/centros-de-datos.html). La previsión de propuesta en el segundo trimestre de 2027 no se convierte en un día inventado.
- Calor residual: [audiencia MITECO](https://www.miteco.gob.es/es/energia/participacion/2026/detalle-participacion-publica-k-831.html) y [borrador, artículo 15](https://www.miteco.gob.es/content/dam/miteco/es/energia/files-1/es-ES/Participacion/Documents/anexos/aeip-sucyr/Proyecto%20RD%20SUCYR.pdf). El umbral es superior a 1 MW de potencia energética nominal total. No se equipara a la potencia de acceso ni a la carga TI. Se conserva la excepción de inviabilidad técnica o económica.
- Acceso flexible: [BOE-A-2026-17571](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-17571), resuelves primero, sexto y undécimo. Se distinguen los plazos de las modalidades, las exclusiones y los requisitos del gestor. No se asigna un permiso flexible a ningún CPD por tener margen en el CSV.

## Registros anteriores reconciliados

Se corrige el estado de la transposición del artículo 12 de la Directiva de eficiencia: la audiencia española terminó el 10 de septiembre, no sigue abierta. El proyecto español de sostenibilidad conserva el informe CNMC de 22 de septiembre y el estado pendiente. No se ha localizado aprobación final en las fuentes oficiales consultadas hasta el 14 de octubre; una búsqueda sin resultado no es una certificación de inexistencia.

La ficha de 2024/1364 distingue su vigencia desde 2024 del acto de etiquetado de 2026. Se retira la falsa precisión del 1 de agosto de 2027, procedente de una previsión que solo decía agosto; el acto adoptado sitúa las primeras etiquetas en el día 15, condicionado a su vigencia.

El [expediente CADA 2026/0138(COD)](https://oeil.europarl.europa.eu/oeil/en/procedure-file?reference=2026/0138(COD)) ya identifica comisiones ITRE/IMCO y ponentes nombrados el 24 de junio, con remisión anunciada el 17 de septiembre. Se sustituye la descripción antigua de expediente sin asignar. Sigue sin estar en vigor.

La [Circular CNMC 1/2024](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-20760) se publicó el **11 de octubre de 2024**, según la cabecera del BOE 246. Se corrigen fecha, hito y fuente que decían día 1.

## Capacidad entregada frente a capacidad final

La revisión de las nuevas etapas detectó dos cifras que parecían operativas por el estado del edificio. La [nota de Digital Realty de 18 de mayo de 2026](https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-opens-first-data-center-barcelona-strengthening) confirma la apertura de BCN1 y llama a los 14 MW «total planned capacity». La cifra se mueve a prevista; la fuente no desglosa los MW entregados.

La [ficha actual de nLighten Lezama](https://www.nlighten.com/en/edge-location/madrid/), consultada el 14 de octubre, sigue rotulando 1.500 kW como «site capacity (end-state)». Los 2 MW de un directorio coinciden con una hoja de datos anterior del operador. Se conservan ambas lecturas sin etapa confirmada; ninguna acredita MW operativos. El estado operativo de los dos edificios se mantiene.

Los resúmenes y agregados conservan tres decimales de MW, para que los 193 kW publicados para Kumo Espinardo sigan siendo 0,193 MW. Las discrepancias entre lecturas se muestran con su intervalo incluso cuando la ficha no tiene una incertidumbre de potencia declarada.

## Comprobaciones

- Ocho pruebas del importador, incluida la edición íntegra: 937 filas, VS y UFD, territorios, cabeceras móviles, códigos inválidos, duplicados, ausencias, desconocidos frente a cero y altas sin geometría inferida.
- Reconciliación de la edición ya aplicada: 937 registros, cero cambios y cero altas.
- Siete pruebas de potencia, incluida la separación de etapas, los 193 kW de Kumo y la capacidad final sin entrega confirmada de BCN1 y Lezama.
- Carga de 16 normas: cero errores. Permanece el aviso anterior sobre la falta de fecha de publicación del Decreto-ley aragonés 1/2008.
- La validación global, la compilación y las comprobaciones del sitio las ejecuta la integración final.
