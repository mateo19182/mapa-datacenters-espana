# Calidad de fuentes y cartografía, 17 de octubre de 2026

Esta revisión acompaña los contrastes de [capacidad](2026-10-17-capacidad-aperturas.md),
[GPU](2026-10-17-gpu-seguimientos.md) y [normativa](2026-10-17-normativa.md).

## Ubicaciones contrastadas

| Registro | Evidencia y decisión |
|---|---|
| IBM-Euskadi, Donostia | La [nota de IBM](https://newsroom.ibm.com/2025-10-14-the-basque-government-and-ibm-inaugurate-europes-first-ibm-quantum-system-two-in-donostia-san-sebastian) identifica el centro de Ikerbasque. El [mapa oficial B5M](https://b5m.gipuzkoa.eus/map/es/D_A191486), enlazado desde su [directorio geográfico](https://b5m.gipuzkoa.eus/web5000/es/directorio-geografico/edificio/san-sebastian/tolosa-avenida-de/74/d_a191486), identifica el edificio de avenida de Tolosa 74. Se incorpora 43.305556, -2.008048 como punto aproximado de edificio, sin atribución de sala. |
| TalaIA, Palma | La [UIB](https://diari.uib.cat/w/supercomputador) sitúa BSAI en el Complex Balear de Recerca. El [Govern](https://www.caib.es/webgoib/-/complex-balear-de-recerca) describe diez bloques en dos módulos y el [contacto de INAGEA](https://inagea.uib.eu/contact/) corresponde a otro ocupante del complejo. No se ha cerrado un pin del espacio de TalaIA. Se conservan las coordenadas desconocidas y la prohibición de usar un centroide municipal. |
| Correfoc, Barcelona | El [inventario de la UPF](https://www.upf.edu/web/sct-sit/equipment) mantiene 57 L40S, pero no identifica su edificio. Una dirección del servicio o del departamento no prueba el alojamiento físico. No se añade un punto del PRBB o de Tànger por deducción. |
| Nasertic, Pamplona | El [contacto del operador](https://nasertic.es/es/contacto) confirma la sede de Orkoien. La consulta directa encontró un fallo de certificado, aunque la herramienta web recuperó el texto. El domicilio institucional no aporta por sí solo un pin contrastado del CPD. Se conserva la ubicación existente. |

B5M devolvió el polígono nominal `D_A191486` en su
[API cartográfica](https://b5m.gipuzkoa.eus/api/2.0/topoquery2?b5mcode=D_A191486&lang=es&srs=EPSG:3857).
El visor se centró en ese edificio, con dirección y nombre coincidentes. El punto
publicado representa ese edificio, no un centro de cámara de una búsqueda genérica.

En IBM-Euskadi también se corrigen la [URL y fecha de la presentación del edificio](https://www.euskadi.eus/gobierno-vasco/-/noticia/2022/el-departamento-educacion-impulsa-nuevo-edificio-investigacion/):
19 de mayo de 2022, en vez del día genérico 1 de enero. Se elimina la atribución de
Hyperion a este edificio en 2027. El [DIPC](https://dipc.ehu.eus/en/supercomputing-center)
sitúa Hyperion y Atlas en sus propias instalaciones. La [guía de BasQ](https://www.basquequantum.eus/en/about/basq-ibm-quantum-computing-services)
mantiene disponible el sistema cuántico `ibm_basquecountry`.

## Comprobador y cola técnica

- El informe antiguo podía fallar al encontrar normas fuera de plazo por una variable
  inexistente. Ahora se genera desde el mismo objeto que la cola pública durante la exportación.
- Un informe parcial conserva todos los cambios anteriores, con su fecha de observación.
  Regenerarlo sin red no afirma una nueva consulta.
- Solo 404 y 410 se clasifican como recurso no encontrado. Bloqueos y fallos de red,
  tiempo o servidor se muestran por separado, también para observaciones anteriores.
- Los PDF se comparan por el contenido descargado. La primera huella frente al antiguo
  tamaño se identifica como cambio de método, sin afirmar modificación del documento.
- Aceptar contenido no simula una nueva lectura ni borra un fallo posterior.
- El flujo semanal distingue el código 10, trabajo pendiente, de un fallo de ejecución.
  Los fallos del comprobador o de REE quedan visibles en el resultado del flujo.
- Cada nueva ejecución recupera las observaciones del PR semanal anterior si sigue
  pendiente, conservando las huellas aceptadas de `main` y las fechas de detección.
- Las notas de conexión eléctrica se conservan al pasar por SQLite y JSON. Antes se
  perdían en la exportación, aunque la ficha tenía un espacio para mostrarlas. Esto
  permite describir los respaldos de DATA4 sin contarlos como capacidad independiente.
- Las adiciones automáticas de propuestas conservan la fecha factual de la ficha.
  Las altas nuevas necesitan una fecha de revisión explícita. Los errores de ejecución
  se distinguen de los conflictos que siguen pendientes de decisión.

Se comprobaron las 974 URL registradas al comenzar y las referencias incorporadas
durante la revisión. El inventario final tiene 1.006 referencias, todas con observación
del 17 de octubre: 5 respuestas 404/410, 98 bloqueadas, 19 fallos sin resultado y 473
contenidos pendientes. De estos últimos, 69 son primeras huellas de archivos antes
vigilados por tamaño. Ninguna huella aceptada anterior se sustituyó. Estas cifras no
equivalen a 473 cambios factuales ni a revisión de los hechos de 1.006 documentos.

Se recuperaron siete enlaces: las dos fichas de DConcept para DATA4, el PDF de NTT
Madrid 1, la ficha del edificio Barcelona CLS y tres documentos autonómicos de El
Lobo. Se leyeron los destinos nuevos antes de sustituir las URL. Acciona/Mancha de
Tinta, Adequa, Ibercom, Legrand/Nasertic y la antigua página de sostenibilidad de Kumo
conservan referencias históricas sin reemplazo equivalente verificado.

Una [explicación técnica de Kumo](https://kumonetworks.es/agua-insumo-data-center-valencia)
aclara que Paterna usa agua en circuito cerrado para enfriar el CO2, con llenado inicial
y sin reposición periódica por evaporación según el operador. Se corrige `sin_agua`
a `cerrado`, sin inventar consumo medido o WUE ni renovar la revisión de toda la ficha.

El temporizador local de investigación está activo: última ejecución satisfactoria el
12 de octubre y próxima prevista el lunes 19 a las 09:00 de Madrid. El PR automático
anterior solo cambiaba la fecha factual de una ficha, además de observaciones e informes.
No se incorpora esa renovación sin contraste de hechos. Las nuevas observaciones y las revisiones factuales de esta
entrega sustituyen el informe antiguo, conservando por separado ambos tipos de fecha.
