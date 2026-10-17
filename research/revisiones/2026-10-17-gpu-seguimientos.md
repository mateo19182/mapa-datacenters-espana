# Seguimiento de inventarios GPU y sedes, 17 de octubre de 2026

Esta es la primera revisión del día. La [revisión posterior de las 25 lagunas](2026-10-17-lagunas-gpu-cobertura.md) identifica Templus Alcalá como anfitrión de GPU Solutions y documenta la instalación de Trevenque. Sus decisiones sustituyen esos seguimientos abiertos; el resto conserva los límites descritos aquí.

Consulta de fuentes públicas primarias. Se separan hardware instalado, compras y acceso a servicios. Una sede social, una ciudad o la denominación de un servicio cloud no bastan para situar GPU en un edificio. No se han contactado operadores ni accedido a cuentas privadas.

## Decisiones y cambios

| Objetivo | Resultado | Cambio en datos |
| --- | --- | --- |
| CSA, Cidade das TIC | El catálogo sigue discrepando sobre servidores A40. La oferta H200 no identifica instalación física. | Ninguno. Se mantienen las cantidades desconocidas de A40 y H200 como acceso. |
| TECNALIA Derio | La traducción inglesa cambia dos partidas respecto a la española; ambas declaran 13 GPU. | Fuente inglesa y diferencias explícitas en las dos partidas y en la incertidumbre. Ningún total nuevo. |
| CTIC Cabueñes | El inventario contable acredita adquisición de DataHub, sin modelo GPU. No se obtiene recepción de las configuraciones A100 o Blackwell. | Fuente contable de 2024 y aclaración de que A100 es la referencia del pliego. Modalidad adquirida conservada. |
| CESGA | Fuentes del operador vinculan FTIII y Qmio a avenida de Vigo. No se acredita traslado a A Sionlla. FTIV tiene contrato formalizado. | Nueva ficha Campus Sur; traslado registral de cuatro lecturas existentes, sin duplicarlas. FTIV adquirido, sin afirmar instalación. |
| GPU Solutions | B200 en Madrid; anfitrión sin identificar. Los certificados sitúan una oficina de Granada. | Sin alta de centro o hardware. |
| Idoven | TSA documenta dos servidores DGX H100 alojados por Telefónica, sin nombrar el centro. | Sin alta ni asignación a un centro de Telefónica. |
| Arsys | La oferta GPU identifica España; no vincula los modelos a Logroño. | Sin GPU añadidas a Logroño. |

Los registros existentes conservan sus fechas generales de última verificación. Las nuevas fuentes indican consulta de 17 de octubre. La fecha de la nueva ficha Campus Sur corresponde a esta revisión y no fecha la instalación o el inventario del hardware.

## CSA de Cidade das TIC

Fuentes consultadas:

- [Servicios del CSA](https://www.cidadedastic.gal/centro-de-servicios-avanzados/servicios-centro-de-servicios-avanzados-csa/). Describe servidores situados en el CPD de la instalación y enlaza el catálogo vigente.
- [Catálogo técnico enlazado por el operador](https://drive.google.com/file/d/1O_XVq95xOKOteeo6J__L-Ze9yuRtcXMg/view). Descarga pública HTTP 200, 487.675 bytes. SHA-256 `1c9ce02c37701b1d7b0ce4ef78334f2283c3a0aaaa59d21ab106b3b665d5a24b`.
- [Anuncio del Clúster](https://clusterticgalicia.com/news/o-cluster-tic-galicia-lanza-os-servizos-do-centro-de-procesamento-de-datos-do-csa-con-descontos-para-socios-e-inquilinos/). Mantiene la posibilidad de acceso a A40 y H200, sin inventario físico H200 por sede.
- [Plataforma de solicitud](https://csa.mspfactory.com/). La página pública redirige a acceso con cuenta. No se ha intentado autenticación.

En el catálogo, la tabla comercial de página 2 enumera tres servidores A40; la ficha técnica de página 3 enumera dos. La capacidad máxima de una máquina virtual es de tres GPU y no equivale al número de tarjetas de cada servidor o del centro. Tampoco permite deducir una flota a partir de los seis servidores L4 de IA y los cinco de media. El catálogo no contiene H200.

Se conserva el recuento L4 procedente del dosier anterior y su discrepancia con el texto comercial. No se modifica el inventario A40 ni se convierte la oferta H200 en instalación. Las búsquedas de licitaciones, adjudicaciones e inventario A40/H200 del CSA devolvieron el mismo anuncio o documentos comerciales, sin recepción o aclaración pública del recuento.

Pendiente `csa-recuento-a40`. Hace falta un inventario físico fechado o una aclaración pública del operador, y un vínculo H200 con un centro nombrado.

## TECNALIA Derio

Se contrastaron las fichas [española](https://www.tecnalia.com/infraestructuras/infraestructura-de-servidores-de-alta-capacidad-de-procesamiento-para-deep-learning) e [inglesa](https://www.tecnalia.com/en/infrastructure/high-throughput-server-infrastructure-for-deep-learning), además de las versiones vasca y francesa disponibles. Todas carecen de fecha de corte del inventario.

| Partida | Español | Inglés |
| --- | ---: | ---: |
| GTX 1080 Ti | 1 | 3 |
| GTX Titan X CC5.2 | 2 | 3 |
| Total declarado de todo el clúster | 13 | 13 |

La ficha inglesa contiene el fragmento "3 x GeForce GTX 1080 Ti". Las otras partidas son las ya registradas: RTX 2080 Ti, V100, Titan X CC6.1 y K20. Se conservan las lecturas españolas y el total declarado, junto con la discrepancia. No se calcula otro total ni se presentan las traducciones como ampliaciones sucesivas.

La ficha sigue enlazando expresamente [Derio, Astondo Bidea, edificio 700](https://www.tecnalia.com/sedes/derio-astondo-bidea-edificio-700). La descripción de otro [laboratorio de IA](https://www.tecnalia.com/infraestructuras/laboratorio-de-inteligencia-artificial-para-energia-industria-audiovisual-logistica-y-transporte) menciona cálculo GPU, pero no ofrece una flota independiente o inventario que permita añadirla sin duplicar.

Modificado `tecnalia-derio-deep-learning`, fuente nueva `src-infraestructura-en`. Pendiente `tecnalia-gpu-recuento`, aún `awaiting_primary`. Falta una corrección del catálogo o un inventario fechado, no una nueva interpretación aritmética.

## CTIC, Cabueñes

Las páginas [DataHub](https://www.fundacionctic.org/es/infraestructuras-singulares/datahub), [CT008/2021](https://www.fundacionctic.org/es/licitacion/infraestructura-para-la-investigacion-en-espacios-de-datos-compartidos-ctic-datahub) y [CT004/2026 ARQADE](https://www.fundacionctic.org/es/licitacion/infraestructura-de-computacion-de-alto-rendimiento-arqade-alianza-de-centros) siguen separando servicio existente y adjudicaciones. La publicación de ARQADE muestra adjudicatario y documentos de licitación, sin acta de recepción. Su referencia de ocho RTX PRO 6000 Blackwell Server Edition admite equivalentes; no se sustituye por B200 ni se da por instalada.

Documento nuevo revisado: [cuentas anuales e informe de auditoría de 2024](https://www.fundacionctic.org/sites/default/files/2026-02/cuentasanualeseinformedeauditoria2024.pdf), HTTP 200. La tabla de página 205 se comprobó visualmente. Registra DataHub por 300.000 euros, adquirido contablemente el 29/12/2021, sin modelo GPU. Otra partida GPU tampoco identifica modelo. No permite convertir las ocho A100 del pliego en hardware recibido.

Las [cuentas de 2021](https://www.fundacionctic.org/sites/default/files/2026-02/640-2022.pdf) son un PDF escaneado de 15.905.387 bytes. La extracción local no dio inventario legible. No se usa esa ausencia de texto como ausencia de compra.

Se localizó una transcripción secundaria de la sentencia de 4 de febrero de 2025, ECLI `ES:TSJAS:2025:560`, CENDOJ `33044330012025100085`, relativa a la subvención DataHub. Las cuentas de 2024 mencionan el litigio en su página 172, pero no detallan modelos GPU. No se recuperó el texto primario de CENDOJ; la [transcripción](https://www.iberley.es/jurisprudencia/sentencia-contencioso-administrativo-tribunal-superior-justicia-sala-lo-contencioso-administrativo-4-2-25-48665828) queda como pista de investigación, sin trasladar sus afirmaciones técnicas al registro.

El [perfil de contratante](https://www.fundacionctic.org/es/perfil-contratante) es accesible. La variante `/es/perfil-del-contratante` devolvió 404. El portal público PETRAS respondió con una aplicación JavaScript; no se obtuvo desde esa respuesta un acta o inventario adicional. No se hicieron accesos privados.

Modificado `ctic-gijon-cabuenes`, fuente nueva `src-cuentas-2024`. Pendiente `ctic-recepcion-gpu`, aún `awaiting_primary`. Se necesita recepción y configuración entregada de CT008/2021 y CT004/2026. El asiento contable no cierra esa cuestión.

## CESGA, Campus Sur y A Sionlla

### Ubicación documentada

El [anuncio del RSG Spain](https://www.cesga.es/el-nodo-gallego-de-rsg-spain-se-reune-en-el-cesga/), publicado el 4 de diciembre de 2025, programa una visita presencial el 16 de diciembre e incluye "Visita al Finisterrae III". El enlace de ubicación del operador es `https://maps.app.goo.gl/1X1FCfJE2BXUddKGA`.

Se resolvió mediante HTTP al lugar de Google Maps del Centro de Supercomputación de Galicia, identificador `0xd2efe6b18df4601:0x9f7546a6084d6057`, con campos `!3d42.8757203!4d-8.5531815`. Se utiliza ese pin de edificio con precisión aproximada. La cámara `@42.8757242,-8.5557564` no es el pin y no se usa. [URL canónica del lugar](https://www.google.com/maps/place/Centro+de+Supercomputaci%C3%B3n+de+Galicia/data=!4m6!3m5!1s0xd2efe6b18df4601:0x9f7546a6084d6057!8m2!3d42.8757203!4d-8.5531815!16s%2Fg%2F12qg2kh0m).

Para Qmio, la [jornada técnica de octubre de 2023](https://www.cesga.es/jornada-tecnica-de-computacion-cuantica/) lo describe recién instalado y da el lugar avenida de Vigo. La [página actual de visitas](https://www.cesga.es/cesga/visitas-al-centro/) mantiene la referencia al computador instalado en esa sede. La [dirección del CESGA](https://www.cesga.es/cesga/contacto/) coincide.

Estas fuentes cierran una ubicación física documentada; no son una comprobación presencial de octubre de 2026. La visita de diciembre es un anuncio, no acta de inventario. No se localizó un documento de traslado a A Sionlla ni confirmación actualizada de permanencia de cada sistema en Campus Sur.

### Inventario y compras

Se revisaron la [ficha de computación](https://www.cesga.es/infraestructuras/computacion/), la [guía técnica](https://cesga-docs.gitlab.io/ft3-user-guide/overview.html) y el [inventario cuántico](https://www.cesga.es/infraestructuras/cuantica/). Persisten 128 frente a 141 A100 y 354 frente a 357 nodos. Ambas fuentes coinciden en 16 T4. Se conserva la primera lectura y la diferencia. No se suman versiones ni se multiplica hardware por nodo para crear otro recuento.

Se revisaron también las fichas oficiales enlazadas desde [ejecución MRR del CESGA](https://www.cesga.es/gl/execucion-fondos-nextgenerationeu-mrr-prtr/):

| Expediente | Ficha | Formalización visible | Documentación posterior visible |
| --- | --- | --- | --- |
| FTIV y almacenamiento, CTS-2025-0021 | [826006](https://www.contratosdegalicia.gal/licitacion?N=826006&lang=es) | 17/03/2026, Fsas, 25.133.684,40 euros | Modificaciones de 23/06/2026 |
| Computación cuántica, CTS-2025-0027 | [826009](https://www.contratosdegalicia.gal/licitacion?N=826009&lang=es) | 18/12/2025, Telefónica, 9.074.557,01 euros | Modificaciones de 17/06/2026 |
| Nuevo edificio, CTS-2025-0013 | [824951](https://www.contratosdegalicia.gal/licitacion?N=824951&lang=es) | 15/05/2025, UTE Copasa/Dominion | Modificaciones de 06/07/2026 |

Las tres fichas devolvieron HTTP 200 por acceso directo. Algunas aperturas mediante el extractor web agotaron el tiempo. Los listados de ejecución no muestran actas de recepción. La descarga de adjuntos usa un formulario con reCAPTCHA v3; se inspeccionó el mecanismo público, sin eludirlo, y no se descargaron los PDF de modificación o formalización. No se afirma que esos PDF carezcan de información de entrega.

FTIV pasa a `adquirido`, con fecha del contrato y estado anunciado, sin instalación confirmada. El contrato cuántico se registra aquí como seguimiento; no se asignan sus modificaciones a modelos concretos sin leer sus documentos. La presentación de junio de Radiance y Spark sigue sin acreditar servicio físico. Ninguno se identifica con el futuro superordenador separado de 1HealthAI.

Cambios: nuevo `cesga-santiago-campus-sur`, con las cuatro lecturas existentes de FTIII CPU, A100, T4 y Qmio movidas exactamente una vez desde `cesga-santiago-a-sionlla`. Se mantienen cantidades y fuentes de origen, y se conservan los identificadores históricos de fuentes en la ruta antigua. Las antiguas fechas de inventario de agosto de 2026 eran fechas de consulta; quedan desconocidas, sin sustituirlas por la visita de 2025. La ubicación física actual continúa expresamente pendiente.

## Candidatos sin edificio identificado

### GPU Solutions / BIAI Technology

La [infraestructura oficial](https://gpusolutions.ai/en/infrastructure) continúa describiendo HGX B200 propio en Madrid y un centro Tier III, sin identificar anfitrión o edificio. El nodo comercial de ocho B200 no es un recuento de toda la flota. La web muestra distintas memorias por GPU en sus páginas, sin que eso permita reconciliar un inventario instalado.

Se leyeron los PDF enlazados por la propia empresa: [ISO 27001](https://gpusolutions.ai/certifications/iso-27001.pdf) y [ENS categoría media](https://gpusolutions.ai/certifications/ens-categoria-media.pdf). Identifican una dirección de oficina en avenida del Conocimiento 41, Granada. No identifican el centro de Madrid. La dirección del certificador tampoco es una ubicación GPU.

El [artículo sobre iQuantum](https://gpusolutions.ai/es/blog/ia-empresas-granada) combina el demostrador granadino y servicios del clúster madrileño. La [web municipal de noticias](https://iquantum.granada.es/noticias) anuncia en diciembre de 2025 tres nuevos servidores Lenovo NVIDIA en futuro y la primera piedra del centro en enero de 2026. No se usa como recepción de B200 en Granada ni como prueba de que el clúster de Madrid esté allí.

Se buscaron vínculos públicos con DATA4, Nabiax y otros posibles anfitriones, sin identificarlos. `gpu-solutions-madrid-ubicacion` sigue `awaiting_primary`; no hay alta de sitio.

### Idoven

La [integración descrita por TSA](https://www.telefonicaserviciosaudiovisuales.com/noticias/tsa-impulsa-innovadora-solucion-ia-medica-para-idoven-tecnologia-nvidia-ultima-generacion/) publica "dos servidores NVIDIA DGX H100" y los sitúa en el Data Center de Telefónica, sin nombre físico. El [premio de 2025](https://www.telefonicaserviciosaudiovisuales.com/noticias/tsa-galardonada-en-premios-av-integracion-audiovisual-2025-por-proyecto-tecnologico-sector-salud/) respalda suministro e integración del proyecto, pero repite la ubicación genérica.

La fecha visible de enero de 2024 de la primera página sigue chocando con el [anuncio de adquisición de Idoven de julio de 2024](https://es.idoven.ai/blog/idoven-acquires-nvidia-dgx-systems-to-advance-its-mission-of-revolutionizing-cardiovascular-disease-diagnosis-with-ai), que hablaba de instalación futura. No se toma ninguna como fecha cierta de entrega. No se multiplican los dos nodos para publicar dieciséis GPU. Búsquedas por Alcalá, Nabiax y otros centros de Telefónica no cerraron el edificio.

`idoven-telefonica-ubicacion` sigue `awaiting_primary`, sin asignación a Nabiax u otra ficha por inferencia.

### Arsys

La [página GPU](https://www.arsys.es/servidores/gpu) ofrece A10 y RTX PRO 6000 Blackwell y dice que el servidor se aloja en su centro de datos en España. La [nota de lanzamiento](https://www.arsys.es/quienes-somos/prensa/ServidoresGPU) también identifica sólo España. El domicilio de Logroño dentro de datos corporativos de la página no sitúa el hardware.

Las búsquedas restringidas al operador, combinando GPU, A10 o Blackwell con Logroño, La Rioja y La Portalada, no encontraron una vinculación explícita. Una [visita institucional a La Portalada de 2024](https://mptmd.gob.es/portal/delegaciones_gobierno/delegaciones/larioja/actualidad/2024/011/2024-11-12_01) identifica el centro, sin inventario GPU.

Como pista separada se encontró una [visita de DCD publicada el 15 de octubre de 2026](https://www.datacenterdynamics.com/es/features/viaje-al-data-center-de-arsys-en-logro%C3%B1o-evoluci%C3%B3n-t%C3%A9cnica-y-soberan%C3%ADa-desde-la-rioja/). Describe tres salas operativas y una cuarta pendiente de desarrollo, y otros datos de capacidad que merecen revisión propia. No identifica GPU o modelos y no se usa para cerrar el vínculo GPU. El alcance de este seguimiento no modifica esas otras cifras sin contraste adicional del operador.

`arsys-gpu-ubicacion` sigue `awaiting_primary`. No se añaden GPU a `arsys-logrono`.

## Integración recomendada

- Publicar una novedad de corrección geográfica de CESGA: Campus Sur como última sede física documentada de FTIII/Qmio, distinta de A Sionlla; no anunciar una instalación nueva o un traslado confirmado. Enlazar ambas fichas y las fuentes de visita, jornada y contrato FTIV.
- Actualizar la revisión de `csa-recuento-a40`, `tecnalia-gpu-recuento`, `ctic-recepcion-gpu`, `gpu-solutions-madrid-ubicacion`, `idoven-telefonica-ubicacion` y `arsys-gpu-ubicacion` al 17/10/2026, conservando `awaiting_primary`. Son revisiones con búsquedas concretas, no cierres de pendientes.
- Añadir o separar un pendiente de ubicación física actual de FTIII/Qmio y recepción de equipos nuevos del CESGA. La incorporación de Campus Sur cierra la carencia de sede documentada, pero no prueba permanencia en octubre de 2026 ni traslado a A Sionlla.
- Para CTIC, añadir la fuente contable y mantener la solicitud de recepción por modelo. Para TECNALIA, añadir la fuente inglesa al pendiente existente. Una novedad conjunta puede describir estas precisiones sin dar por resueltas las cifras.

No se han editado `revision.yaml`, `actualizaciones.yaml`, `huellas.json` ni módulos compartidos. Documentos y respuestas de trabajo quedan en `/tmp/mapa-gpu-seguimientos-20261017/`; el registro de descargas inicial incluye URL, resultado y huella cuando se obtuvo el cuerpo. Los fallos del extractor, las páginas de acceso y los documentos sin texto se han descrito como límites de esta revisión, no como ausencia de hardware.
