# Qué no puedo consultar, y qué puede hacer una persona

Probado el 2026-08-31 contra los portales reales, no supuesto. Cada línea de este
documento sale de una petición HTTP hecha desde el entorno del agente, y dice el
código de respuesta que devolvió.

Sirve para repartir el trabajo: lo que un agente puede resolver solo, lo que
necesita que alguien programe un recolector, y lo que solo se consigue con una
persona identificada, una solicitud formal o una tarjeta de crédito.

---

## 0. Lo que pido, por orden de rendimiento

Cinco gestiones. Las tres primeras desbloquean datos que hoy no tiene nadie, no
solo nosotros.

1. **Solicitudes de información ambiental (Ley 27/2006) a las confederaciones
   hidrográficas** del Ebro, Duero, Júcar y Tajo, pidiendo concesiones y
   autorizaciones de vertido otorgadas a centros de datos desde 2020. Convierte el
   agua de *anunciada* a *autorizada*. En el Ebro hay dos expedientes ya
   identificados por número: **2024-DT-658** (14,38 l/s para el centro BDE de
   Amazon, el único de los cinco de la ampliación con agua realmente autorizada) y
   **12911/2024** (Walqa, sin contestación al cierre de la DIA).
2. **Copia de los expedientes de AAI de Extremadura**, expedientes **AAI25/024**
   (Badajoz) y **AAI25/032** (Navalmoral). Solo son examinables presencialmente en
   Mérida. Contienen el consumo de agua, el PUE proyectado y la potencia por
   edificio de los dos mayores proyectos extremeños.
3. **Resolución íntegra de INAGA sobre el Proyecto Rhodes**, CSV
   `CSVY45GPX71V7B5ONREG` en `aplicaciones.aragon.es/inachkdoc/`. Hay que teclear
   el CSV en un formulario. Resuelve una contradicción de agua de **factor 54**
   dentro del mismo expediente.
4. **La lista de la Generalitat de Cataluña** de proyectos candidatos a
   estratégicos: 26 proyectos y unos 2.000 MW, nunca publicada. Hoy siete fichas
   catalanas dependen de una filtración periodística. Vía: Departament de la
   Presidència, por solicitud de acceso a la información pública.
5. **Abrir tres PDF y mirarlos**, que es literalmente todo lo que hace falta:
   - La Orden **VFL/654/2026** del BOA de 07/05/2026, cuadro de parámetros de la
     fase 1: la tabla se extrae entrelazada (`62 | 123 | 93`) y no se puede saber
     qué cifra va con qué emplazamiento. Es el único motivo por el que VDG1, VDG2 y
     Walqa se quedan sin dato de empleo.
   - Los estudios de impacto ambiental de los tres campus de **Microsoft** en
     `aragon.es/-/microsoft-eia` (158, 184 y 242 MB, con las URL de descarga sin
     exponer). Microsoft es el único hiperescalar de Aragón sin ninguna cifra
     propia de agua ni de potencia térmica.
   - El **Informe de Sostenibilidad 2025 de MasOrange**, donde probablemente estén
     listados los doce centros que la compañía ha puesto en venta y que hoy son la
     mayor laguna del conjunto.

Lo que **no** hace falta que consigas: los boletines oficiales. Todos responden y
el problema con ellos es de programación, no de acceso. Está en la sección 5.

---

## 1. El hallazgo principal: casi nada está bloqueado

Antes de empezar, la hipótesis era que el sesgo del conjunto hacia Aragón (45 de
las 81 fuentes oficiales salen del Boletín Oficial de Aragón) se debía a que los
demás boletines rechazaban al agente. **Es falso.** Todos responden:

| Boletín | Respuesta |
|---|---|
| BOA (Aragón) | 200 |
| DOGC (Cataluña) | 200 |
| DOGV (Comunitat Valenciana) | 200 |
| BOJA (Andalucía) | 200 |
| BOCM (Madrid) | 200 |
| BOCyL (Castilla y León) | 200 |
| DOCM (Castilla-La Mancha) | 200 |
| DOE (Extremadura) | 200 |
| DOG (Galicia) | 200 |
| BOE | 200 |
| Portal de Transparencia | 200 |

El sesgo no es de acceso. Es de **cómo publica cada boletín**, y esto sí tiene
arreglo técnico.

### Por qué gana Aragón

El BOA publica cada resolución como documento propio, en una URL estable y con el
título administrativo completo dentro de la propia página:

```
https://www.boa.aragon.es/cgi-bin/EBOA/BRSCGI?CMD=VEROBJ&MLKOB=1419873100606
→ «RESOLUCIÓN de 3 de octubre de 2025, del Instituto Aragonés de Gestión
   Ambiental, por la que se formula la declaración de impacto ambiental del
   Proyecto de las infraestructuras hidráulicas exteriores que darán servicio al
   futuro centro de datos BDE...»
```

Un buscador indexa eso y lo encuentra por «centro de datos» y «declaración de
impacto ambiental». Por eso Aragón se documenta sola.

### Por qué pierden los demás, caso por caso

**Cataluña, el peor.** Las disposiciones viven detrás de un servlet:
`portaldogc.gencat.cat/utilsEADOP/AppJava/PdfProviderServlet?documentId=708191&type=01&language=ca_ES`.
Al buscar «centro de datos declaración de impacto ambiental» restringido a
`dogc.gencat.cat`, los diez resultados son páginas institucionales del propio
diario: su normativa editorial, su informe de auditoría de cuentas, su carta de
servicios. Ni una sola disposición. El contenido del boletín es, a efectos de un
buscador, invisible. **Los documentos sí son direccionables por `documentId`**, lo
que abre la puerta a recorrerlos por fuerza bruta o desde el índice diario.

**Madrid, recuperable.** El BOCM sí publica cada anuncio como PDF en URL estable y
predecible (`/boletin/CM_Orden_BOCM/2026/02/25/BOCM-20260225-39.PDF`), **con capa
de texto**: lo he descargado y extraído sin problema. El fallo es que el título
indexado es genérico («D) Anuncios», «II. DISPOSICIONES Y ANUNCIOS DEL ESTADO»),
así que la búsqueda por palabra clave no lo encuentra aunque el cuerpo hable de lo
que buscamos. La prueba de que ahí hay material: el primer PDF que abrí al azar
era una autorización a Red Eléctrica para repotenciar la línea de 220 kV
Valdemoro-Arganda, con número de expediente. Eso es exactamente lo que le falta a
nuestra capa de red.

**Conclusión operativa:** esto no necesita una persona, necesita un recolector por
boletín. Es trabajo de programación, no de gestión. Lo desarrollo en la sección 5.

---

## 2. Bloqueado de verdad para un agente

| Recurso | Qué pasa | Qué dato tiene |
|---|---|---|
| **Sede Electrónica del Catastro** (`sede.catastro.gob.es`) | No resuelve, sin respuesta (000) | Referencia catastral, superficie de parcela y uso |
| `catastro.minhap.es/webinspire` | No resuelve (000) | Servicios INSPIRE de parcelario |
| **DC Byte** (`dcbyte.com/analytics`) | **403** | Pipeline y capacidad por fase de 8.400 centros |

Con el Catastro hay salida parcial: **la Oficina Virtual sí responde**
(`ovc.catastro.meh.es`, 200, y `www1.sedecatastro.gob.es`, 200). Sus servicios de
consulta permiten resolver referencia catastral y superficie sin pasar por la sede
caída. Es una vía a `superficie_parcela_m2` que hoy no estamos explotando.

---

## 3. Necesita una persona identificada

**Registros de Aguas de las confederaciones hidrográficas.** Aquí está el consumo
de agua *autorizado*, que es el único verificable frente al *anunciado* que
publican las empresas. Los portales responden, pero el acceso al expediente está
condicionado:

- Confederación Hidrográfica del Ebro, https://iber.chebro.es/consultas/ (200).
  Su propia página dice: «Las personas que ostentan la condición de interesado
  pueden consultar en tiempo real el estado de tramitación de sus expedientes
  administrativos a través de un canal seguro.» Hace falta **certificado digital**,
  y ser interesado.
- Confederación Hidrográfica del Duero,
  https://infoexpedientes.chduero.es/infopublicachd/acCriterios.aspx (200). Solo
  publica concesiones otorgadas **en los últimos seis meses**; para lo anterior
  dice expresamente que hay que dirigir la petición al Archivo de la CHD.
- Confederación Hidrográfica del Júcar, https://www.chj.es , documenta el Registro
  de Aguas y el Catálogo de Aguas Privadas.

**Cómo puedes ayudar:** los tres admiten solicitud de información ambiental al
amparo de la Ley 27/2006, que da derecho de acceso a cualquiera sin necesidad de
ser interesado y con plazo de respuesta tasado. Una solicitud por confederación
(Ebro, Duero, Júcar, Tajo) pidiendo las concesiones y autorizaciones de vertido
otorgadas a centros de datos desde 2020 daría, de una vez, el dato que ahora
sacamos a trozos de la prensa. Es la gestión de mayor rendimiento de toda esta
lista.

---

## 4. De pago, y que no debemos copiar

- **DC Byte**, plataforma de analítica. Devuelve 403.
- **Structure Research**, *Madrid + Barcelona DCAI Report 2026* (junio de 2026),
  bajo «Contact Our Team for Access».
- **Cushman & Wakefield**, *Global Data Center Market Comparison 2026*.

Los tres tienen casi con seguridad el desglose por emplazamiento y fase que
reconstruimos a mano. Aun con acceso, **no se pueden volcar**: son obra ajena bajo
licencia. Su uso legítimo es de control de calidad, para saber cuánto nos falta,
no de fuente. Si consigues alguno, lo correcto es contrastar y anotar la
discrepancia, no copiar la cifra.

Aviso en la otra dirección: el **Informe anual 2025 de SpainDC** sí está en abierto
y es texto extraíble. Ya lo he usado como contraste en
`research/estado-del-arte.md`. No hace falta comprar nada para tener una cifra
nacional con la que calibrarnos.

---

## 5. Lo que arreglaría yo, y no necesita a nadie

Por orden de rentabilidad. Nada de esto está bloqueado; solo no está escrito.

1. **Recolector del BOCM.** Las URLs son predecibles por fecha y número, los PDF
   tienen capa de texto. Descargar el índice diario, filtrar por palabras clave en
   el cuerpo y no en el título. Madrid es la comunidad con más fichas (34) y casi
   ninguna fuente oficial. Es el mayor desequilibrio del conjunto.
2. **Recolector del DOGC** por `documentId` desde el sumario diario, que es la
   única vía porque el buscador no ve el contenido. Cataluña son otras 32 fichas
   en la misma situación.
3. **Oficina Virtual del Catastro** para resolver referencia catastral y superficie
   de parcela a partir de las coordenadas que ya tenemos. Rellena
   `superficie_parcela_m2`, hoy casi vacío.
4. **Índice de resoluciones del INAGA** ya publicadas. Aragón está bien cubierta en
   *qué* proyectos hay, pero las resoluciones de infraestructuras hidráulicas de
   octubre de 2025 (centros CAR, BDE, VDG1, VDG2 y Walqa de Amazon) contienen
   cifras de agua que aún no hemos volcado al bloque `agua` recién creado.

---

## 6. Documentos concretos que pidieron los investigadores

Documentos que sabemos que existen y que no se han podido leer, con la referencia
y el dato que se espera de cada uno. Se va completando conforme cierran los
barridos territoriales.

### 6.1. El documento más valioso de todos

**La lista de la Generalitat de Cataluña de proyectos de centro de datos
candidatos a estratégicos o de interés general superior.** Nunca se ha publicado.
Todo lo que existe es la filtración de SER Catalunya del 25 de marzo de 2026 y el
resumen del Departament de la Presidència del 14 de abril: 26 proyectos, unos
2.000 MW, siete polos.

Hoy dependen de esa filtración las fichas de Santa Bàrbara, Òdena, Jorba, los tres
emplazamientos de Ponentia y Alcover. La lista fijaría promotor, municipio y MW de
todos ellos de una vez.

Vía probable: Departament de la Presidència, o la Taula Institucional d'Impuls de
Centres de Dades, por solicitud de acceso a la información pública.

### 6.2. Muros de pago que tapan un dato concreto

| Documento | Qué taparía |
|---|---|
| `veuanoia.cat/generalitat-vol-facilitar-installacio-quatre-grans-centres-dades-odena-jorba/` (1 €) | Identificación de los tres proyectos de Òdena y el de Jorba, con promotor y MW. Hoy no sabemos si el D-hub es uno de esos tres o un cuarto |
| `expansion.com/economia-digital/companias/2026/03/13/69b437ffe5fdeade548b4585.html` | La relación entre Apto y PIMCO, y probablemente cómo Apto sucede a Thor/Form8tion en la parcela de Fuenlabrada. Es el mayor hueco documental de esa ficha |
| `lavanguardia.com/dinero/20260213/…` y `expansion.com/catalunya/2026/02/13/…` | Los 20 MW de Oxigen. Rodeado ya por DCD y Revista Cloud |
| **datacenterHawk** y **Baxtel** | Ocultan la potencia tras registro. Afecta a Apto Madrid One, Goodman MAD01, DAMAC MAD1 y AtlasEdge Barcelona 2 |

### 6.3. Expedientes administrativos no localizados

**Madrid**

- **Planeamiento aprobado por el pleno de Fuenlabrada el 2 de marzo de 2023**
  (parcela de Casbega-Coca-Cola, barrio de El Naranjo). Tenemos la nota municipal,
  no el documento ni su publicación en el BOCM. Resolvería el choque entre 195.000
  y 225.000 m², y daría referencia catastral y edificabilidad. Vía: sede
  electrónica del Ayuntamiento de Fuenlabrada, o BOCM de marzo-abril de 2023.
- **Licencia de obra de la primera fase de Apto**, que la compañía dice tener.
- **Declaración de Proyecto de Especial Interés** de la Aceleradora de Inversiones
  de la Comunidad de Madrid para la fase 1 de Ferrovial en Valdelacasa. La nota la
  menciona sin publicar la resolución. Contendría potencia, plazos, compromisos de
  empleo y probablemente consumo de agua.
- **Licencia municipal de Edgnex/DAMAC en Vicálvaro.** El registro de licencias del
  Ayuntamiento de Madrid no es consultable por buscador. La última noticia es de
  octubre de 2024: no sabemos el estado real de las obras.
- **Expediente municipal del Algete Data Hub** (AVAIO). La compañía dice tener el
  proyecto «fully entitled»; no hay documento público que lo respalde.
- **Plan Especial de Data Centers de Tres Cantos**, anunciado en mayo de 2026 y aún
  no publicado. Identificaría qué proyectos hay en el municipio.
- **Informe de resultados completo de MERLIN** (1S2026 y FY25, PDF de
  `ir.merlinproperties.com`). Contiene el desglose por emplazamiento de los 254 MW
  IT de la Fase II, que es justo lo que falta para dar potencia a Tres Cantos.

**Cataluña**

- **Dossier «CAN MORERA PROJECT — TIC ANOIA»**,
  `adequa-re.es/wp-content/uploads/2020/05/CAN-MORERA-PROJECT_TIC-ANOIA.pdf`. No se
  pudo descargar. Resolvería la contradicción de 150 frente a 200 MW y la de 100
  frente a 200 hectáreas del D-hub Òdena.
- **PDUAECO**, Pla Director Urbanístic de l'Activitat Econòmica de la Conca
  d'Òdena, aprobado inicialmente en abril de 2022. No localizado en el portal de
  urbanismo de la Generalitat. Diría si Can Morera quedó excluido del planeamiento,
  que determina si el proyecto es viable.
- **Expediente urbanístico del recinto de Iberboard Mill** (Alcover, Alt Camp), en
  el Ajuntament d'Alcover o la Comissió Territorial d'Urbanisme del Camp de
  Tarragona. Daría superficie de parcela y cambio de uso. Relacionado: los autos
  del concurso de acreedores de Iberboard Mill precisarían la titularidad.
- **Solicitud de acceso a la red de Iberdata (Scranton)**: el CEO dice negociar más
  de 20 MW con la distribuidora. Sin resolución ni solicitud pública localizada.
- **`d-hubodena.cat/lanoia-es-la-gran-beneficiada-del-d-hub-odena/`**: el dominio
  tiene problemas de certificado TLS y el rastreador falla. Contendría empleo e
  inversión del campus.
- **Artículos de AnoiaDiari** (`anoiadiari.cat/noticia/149532`, `/147376`,
  `/146605`, `/146208`), recuperables solo en parte. Posición del Ajuntament
  d'Òdena y estado del ámbito de Can Morera tras el PDUAECO.

**Fichas de producto**

- **Goodman MAD01**, `es.goodman.com/-/media/project/goodman/spain/files/property/properties-for-lease/mad01/es_mad-01_data-centre_digibrochure_en.pdf`.
  Fechas RFS por fase, refrigeración sin agua y subestación.

### 6.3 bis. Castilla-La Mancha, Castilla y León y la Comunitat Valenciana

**Portales que exigen sesión o cita previa**

- **Aplicación Nevia**, `neva.jccm.es/nevia`, apartado «proyectos», expediente
  **PRO-SC-22-1030**. Guarda los 8.731 folios del PSI de Meta en Talavera, con el
  estudio de impacto ambiental completo. Exige navegación con sesión y no es
  accesible por URL directa. **Contiene la carga TI del campus y el detalle de la
  subestación**, lo único que sigue faltando en la ficha mejor documentada del
  conjunto.
- **Concesión de VDPC en el puerto de Sagunto.** El BOE advierte que la instancia,
  el proyecto básico y la memoria económica **solo pueden examinarse con cita
  previa** en la Oficina de Dominio Público de la Autoridad Portuaria de Valencia
  (Avda. Muelle del Turia s/n, 46024 València, 8:30-14:30). Darían parcela,
  superficie construida, potencia solicitada y desglose de los 100 M€.
- **Buscador de expedientes de la CNMC**, que exige formulario. Una consulta
  filtrando «CFT/DE» por Comunitat Valenciana en 2026 cerraría la pregunta de
  Catadau; otra por CPD4Green en nudos del sur de Madrid o el norte de Toledo
  identificaría oficialmente el emplazamiento de Echelon Madrid Sur.
- **Registro de solicitudes de acceso denegadas de Red Eléctrica**, no público en
  web. Valencia Plaza dice haberlo consultado. Pedir el listado de peticiones de
  demanda denegadas por nudo en la Comunitat Valenciana entre marzo y mayo de 2026,
  o la resolución de denegación del nudo Catadau 400. Es lo único que pondría
  nombre al promotor del macro-CPD de Catadau.

**Enlaces que no resuelven a un fichero recuperable**

- **Alegaciones de Ecologistas Zamora contra el centro de Monfarracinos**, desde
  `ecologistaszamora.org/ez/alegaciones/alegaciones-contra-el-data-center-de-monfarracinos/`.
  Lectura de primera mano del expediente: confirmaría los 200 MW IT y daría el
  desglose de agua con su periodo, que hoy no cuadra por dos órdenes de magnitud.
- **Expediente de Autorización Ambiental Integrada de Monfarracinos**, código
  **A07028987**, Junta de Castilla y León. No localizada su ficha de información
  pública en `medioambiente.jcyl.es`. Fuente primaria de los 200 MW IT, del agua y
  del número real de motores diésel (5 según Ecologistas, 25 según El Español).
- **Documentación del expediente 013-26-AAVA** (CPD San Lorenzo, Torrelobatón):
  la página oficial la enlaza sin exponer URL recuperable. Resolvería las tres
  superficies contradictorias y el número de grupos electrógenos.
- **BOCYL nº 140 de 22 de julio de 2026**, anuncio de información pública de
  Torrelobatón: solo se localizó la ficha resumen, no el texto íntegro.
- **«Proyecto de actividad — Data Center El Lobo» (PDF)**, en
  `mediambient.gva.es`, carpeta del PIA de Monforte del Cid. Tres intentos, siempre
  tiempo de espera agotado por tamaño. Según el índice de la resolución contiene
  abastecimiento de agua (págs. 26, 57, 58-60), grupos electrógenos y combustible
  (págs. 25-26, 41-42, 49-52) y superficies (págs. 21-23, 28-36).

**Muros de pago con un dato dentro**

| Documento | Qué taparía |
|---|---|
| Proximo Infrastructure, «Iberdrola and Echelon's Madrid Sur nears FID», `proximoinfra.com/news/76265/` | La pista más prometedora para ubicar Madrid Sur: emplazamiento, bancos y calendario |
| dcpulse.com, ficha «Echelon Iberdrola Madrid Sur Campus» | Municipio y desglose de potencia por edificio |
| Las Provincias, «El boom de los centros de datos en la Comunitat» (16/05/2025) | Inventario comparado de una decena de proyectos valencianos con su consumo. La mejor fuente de contraste del territorio |
| Las Provincias, «El megacentro de datos de Picassent, sin acceso a la potencia exigida» (03/02/2026) | Estado del expediente ante el MITECO y alegaciones del promotor |
| El Norte de Castilla, «Torrelobatón se prepara…» (06/08/2026) | Foto de la finca de San Lorenzo; delimitación de la parcela |
| Valencia Plaza, artículo de Catadau (05/05/2026) | La primera mitad, donde están los 25 MW, los 50-80.000 m² y cualquier pista del promotor |

**Hecho relevante que debería existir.** Solaria y Datasection no han comunicado
nada sobre la ruptura de Puertollano; la única fuente del parón es la Cadena SER
con fuentes anónimas. Datasection cotiza en la Bolsa de Tokio: si canceló el
acuerdo, tuvo que declararlo como hecho relevante. Ese documento existe en japonés
y nadie lo ha buscado.

### 6.3 ter. Cataluña, donde no hay ni un solo expediente ambiental

El barrido catalán no encontró **ninguna** declaración de impacto ambiental,
autorización ambiental ni expediente de la Agència Catalana de l'Aigua referido a
un centro de datos concreto. Todos los datos de agua de las 31 fichas catalanas
salen de declaraciones de la propia compañía. Es el mayor hueco documental que
deja el barrido.

La causa está localizada, y es un problema de formato:

> Las sesiones de la **Ponència Ambiental** de la Generalitat están en
> `mediambient.repositori.gencat.cat` como **actas escaneadas sin capa de texto
> útil**, indexadas solo por fecha de sesión.

No hay buscador por proyecto ni por promotor. Encontrar los expedientes de
Panattoni, hscale, Mediterra o Flix exige abrir sesión por sesión y leer a ojo, o
pasar OCR a todo el repositorio. Es la vía más probable para obtener por fin
**consumos de agua reales en Cataluña**, y hoy no la cubre nadie.

**Documentos catalanes concretos que faltan**

1. **DOGC, Acuerdo GOV/141/2026**, que declara la gigafactoría de IA de Móra la
   Nova / Tivissa proyecto estratégico de inversión. Solo se conoce por la cita
   del Diari de Tarragona. El buscador del portal DOGC exige formulario con fecha
   y número. **Es el documento más valioso de la lista catalana**: contendría
   potencia, superficie, plazos e inversión con validez oficial.
2. **Proyecto IRYDA (Epsilon)** del Parc de l'Alba: 20 circuitos, 40 km de cable y
   dos subestaciones nuevas de 110/25 kV, con más de 250 MW previstos para los CPD
   del parque. Solo se conoce por un resumen de terceros. Debe estar en información
   pública en el Departament d'Empresa i Treball o en el DOGC. **Resolvería de
   golpe cinco fichas**, porque asignaría potencia por centro.
3. **Compraventa de 20 MW del INCASÒL a Cetenis SL**, acuerdo ratificado por el
   Govern el 21/07/2026, no publicado. Daría el punto de conexión y el titular de
   los derechos de acceso.
4. **Expediente urbanístico y licencia de obra de Panattoni en Cerdanyola** (enero
   de 2025). `totcerdanyola.cat` devuelve contenido binario ilegible. Resolvería la
   contradicción abierta de la ficha: 42 MW frente a 88 MW, y cuatro superficies
   distintas entre 50.169 y 68.000 m².
5. **Plan parcial y modificación del POUM de Alcarràs** (Serosense), en tramitación
   municipal y no publicados.
6. **Ficha comercial de Equinix BA1** (`BA1_IBX_Site_Spec_A4-EN.pdf`), alojada en
   Baxtel, que exige registro. Contiene la potencia de BA1, hoy un hueco.
7. **El 9 Nou**, «Mediterra construirà un centre de dades de 9.700 m² a Montmeló»
   (18/02/2026), de pago: qué aprobaciones municipales tiene y de qué parcela se
   trata.

### 6.3 quater. Extremadura y Andalucía: expedientes solo presenciales

Extremadura da el caso más claro de toda la revisión de un documento público que
**por diseño no se puede leer a distancia**:

> Los expedientes completos de AAI y estudio de impacto ambiental de Navalmoral
> (AAI25/032) y Badajoz (AAI25/024) solo son examinables **presencialmente**, en
> la Dirección General de Gestión Sostenible y Política Forestal, en Mérida, y en
> el caso de Navalmoral también en el Ayuntamiento.

Ahí están el consumo de agua real, el PUE proyectado y la potencia por edificio de
los dos mayores proyectos extremeños. No hay vía remota. Requiere que alguien vaya,
o una solicitud de copia al amparo de la Ley 27/2006.

Un escalón por debajo, y sí resoluble a distancia por una persona con un navegador:

- **Anuncios del DOE de 19 de mayo de 2026** (DOE nº 98 de 25/05/2026 para Badajoz;
  DOE de 22/05/2026 para Navalmoral). El sumario se lee, pero no expone las URL de
  los documentos y el buscador del DOE exige formulario. Contienen consumo de agua,
  desglose de potencia, referencias catastrales y número y potencia de grupos
  electrógenos. Interesa sobre todo el **«Resumen no técnico»** del EIA, que es
  donde suele venir cuantificada el agua.
- **Índice de información pública de AAI 2026 de Extremadura**,
  `extremambiente.juntaex.es/index.php?id=4234…`: devuelve solo la cabecera, con el
  contenido en marcos y JavaScript. Ahí están los enlaces a los dos anuncios.
- **BOJA**: sus sumarios titulan los expedientes ambientales como «el proyecto que
  se cita», así que por el título es imposible saber si un anuncio de Córdoba o
  Torrecampo es un centro de datos. Hay que abrir los PDF uno a uno o usar el
  buscador, que exige formulario. Es la única vía para confirmar o descartar que
  EdgeMode haya iniciado trámite ambiental allí.
- **Alegaciones de Adenex** al proyecto de Navalmoral (julio de 2026). Solo hay la
  nota de prensa que las resume; el escrito detallaría los consumos de agua para
  humectación que Adenex dice haber encontrado en el expediente.
- **Huelva24** sobre el campus TRON: bloqueado por el «Client Challenge» de
  Cloudflare. Desglose de empleo directo e indirecto y permisos de Trigueros.
- **Diario Sur** (de pago), dos piezas sobre Box2bit en El Viso: importe de la
  garantía económica, calendario y quizá la potencia, que no aparece en ninguna
  fuente abierta.
- **Pliego de obra civil del CPD El Palenque**, expediente **2021-00183** de
  Sandetel. Se localizó el de equipamiento crítico (24-00025), no este. Daría la
  potencia total contratada y el diseño de climatización.
- **SEC EDGAR, exhibit 10.20 de EdgeMode** (arrendamiento de Torrecampo): el HTML
  publicado es una transcripción OCR degradada y las referencias catastrales son
  ilegibles. Haría falta el PDF original, o una consulta al Catastro por los
  polígonos 3, 4 y 5 de Torrecampo.
- **Expedientes de acceso y conexión a red**, no publicados en ningún boletín: el
  de SP01 en Escúzar, que sostendría los «100 MW concedidos»; el de Saltburn en el
  nudo SET Cártama; y el de CC Green ante Red Eléctrica. Vía: solicitud a la CNMC,
  a REE o a la distribuidora (Endesa, i-DE, Cuerva).

### 6.3 quinquies. Aragón: PDF gigantes y un formulario con CSV

Aragón es la comunidad mejor documentada del conjunto y aun así deja fuera lo más
grueso, por dos obstáculos puramente técnicos. Ningún muro de pago y ningún
CAPTCHA: `heraldo.es`, `elperiodicodearagon.com`, `eldiario.es`, `elespanol.com` y
`aragondigital.es` se leyeron sin problema.

**Obstáculo 1: PDF enormes cuya URL de descarga la página no expone.**

| Documento | Tamaño | Qué daría |
|---|---|---|
| Estudios de impacto ambiental de los tres campus de **Microsoft** (`aragon.es/-/microsoft-eia`) | 158 MB La Muela · 184 MB Villamayor · 242 MB Zaragoza | Agua y demanda eléctrica **por campus**. Hoy solo hay 3.975 m³/año conjuntos, y vía prensa |
| Proyectos básicos para la AAI de Microsoft (`aragon.es/-/piga-microsoft`) | 162 / 195 / 228 MB | Refrigeración, potencia instalada y MWt de grupos. Microsoft es el único hiperescalar de Aragón sin ninguna cifra de potencia térmica |
| Proyecto básico para la AAI de **Tillion Aragón** (`aragon.es/-/piga-tillion-aragon`) | 33,6 MB | Contrastar los 6.066 m³/año que hoy solo da elDiario.es |
| Estudio de impacto ambiental del PIGA Tillion | — | Los 2.628 GWh/año y los 2.360 M€ en fuente primaria |
| Estudio de impacto ambiental y proyecto básico del **Proyecto Rhodes** (QTS/Blackstone), expte. INAGA 500301/02/2025/08352 | — | Carga TI del campus y consumo de agua del EsIA |

**Obstáculo 2: el visor INACHKDOC de INAGA exige teclear un CSV en un formulario.**
El BOA publica solo el anuncio; el texto íntegro de la resolución vive en
`aplicaciones.aragon.es/inachkdoc/`. Comprobado: no responde a petición directa.

- **Resolución de INAGA de 23/07/2026 sobre el Proyecto Rhodes**, CSV
  `CSVY45GPX71V7B5ONREG`. **Resolvería la peor contradicción del lote**: 258.201
  frente a 4.782 m³/año, un factor 54 entre dos documentos del mismo expediente.
- **Resoluciones íntegras de INAGA** de 28-29 de abril de 2026 (AAI de WQA, VDG1 y
  VDG2) y de 21 de mayo de 2026 (AAI de BDE). Darían el agua y la refrigeración
  **declaradas por INAGA**, en lugar de depender de un escrito de alegaciones que
  la resolución se limita a reproducir.

**Obstáculo 3, y es casi una anécdota que cuesta tres fichas.** El cuadro de
parámetros urbanísticos de la fase 1 de VDG1, VDG2 y WQA está en la Orden
VFL/654/2026 (BOA de 07/05/2026), pero es una tabla de tres columnas que tanto el
HTML como el PDF devuelven entrelazada: `Requeridas: | … 62 | … 123 | … 93`. No se
puede fijar con certeza qué cifra corresponde a qué emplazamiento. **Es el único
motivo por el que esas tres fichas se quedan sin campo `empleo`.** Basta con abrir
el PDF maquetado y mirarlo.

**Confederación Hidrográfica del Ebro, otra vez.** Dos expedientes concretos, que
refuerzan la petición de la sección 3:

- **Expediente CHE 12911/2024**, suministro de agua a Walqa. La DIA dice
  literalmente que «actualmente no hay contestación por parte de la CHE». Diría
  cuál de las cuatro alternativas se autoriza y con qué caudal.
- **Resolución de la CHE de marzo de 2025, expediente 2024-DT-658**, que autoriza
  14,38 l/s para BDE. Solo se conoce por la cita que hace la DIA. Importa saber
  **si existen expedientes equivalentes para VDG1, VDG2, WQA y CAR**: hoy BDE es el
  único de los cinco emplazamientos de la ampliación de AWS con agua efectivamente
  autorizada, frente a unos 726.000 m³/año declarados en conjunto.

### 6.3 sexies. Cornisa norte

- **Expediente AAI00498, Merlin Edged (edificios 4 y 5, Rivabellosa).** La página de
  información pública tiene un apartado «Documentos» sin ningún enlace descargable
  y remite a consultar **en las oficinas de la Dirección de Administración
  Ambiental**. Daría MW por edificio en términos oficiales, MWt de los grupos,
  consumo de agua real y el punto y tensión de conexión.
- **Resolución de la AAU01338, Data Center Euskadi (Arrasate).** Se localizó el
  anuncio, no la resolución con su anexo de descripción de la actividad, que en los
  casos análogos de Abanto y Zamudio trae superficies, MWt y agua. Es el hueco más
  rentable de esa ficha.
- **Documentación técnica del PIE de Curtis** en el portal de transparencia de la
  Xunta: la ficha enlaza «Proyecto» pero el enlace no resuelve a un PDF accesible.
- **`edged.es`, «Building Specs» de Bilbao-Arasur**, tras formulario. Resolvería la
  contradicción 100 / 118 / 300 / 350 MW.
- **PSIR de la fase 1 del Proyecto Altamira** (Cantabria): el consejero declaró en
  junio de 2025 que estaba redactado y se aprobaría en diciembre. No aparece ni el
  documento ni su aprobación en el BOC.
- **Licitación de las obras del pozo San Jorge (Aller)**: anunciada para finales de
  2025, no aparece en la Plataforma de Contratación ni en el perfil del contratante.
- **Certificados del Uptime Institute** de Inditex (Arteixo y Laracha) y de Arsys
  (Portalada, sala 2). Las fichas públicas dan cliente y nombre; el certificado
  completo incluye **la potencia de diseño de la sala**, que resolvería de golpe
  tres fichas que hoy no tienen ninguna cifra.
- **Ficha técnica del CPD de ABANCA en Pocomaco**, que el banco no publica. Habría
  que pedirla a comunicación corporativa, junto con los datos del segundo CPD
  gemelo de la sede de A Coruña, que ni siquiera tiene ficha.
- **Resoluciones de acceso a la red de las subestaciones de Penagos y Orkoien**, no
  públicas por proyecto. Única vía para rellenar `mw_solicitados` y `mw_concedidos`
  en Altamira y Campus Data Navarra, y para verificar que la fase III de Merlin
  tiene la potencia concedida, como afirma.
- Muros de pago con dato dentro: **Diario de Navarra**, «Los nueve proyectos que
  Navarra pide incluir en la planificación eléctrica para 2030» (15/12/2025), que
  podría dar los MW solicitados del Campus Data Navarra; **El Diario Montañés**, dos
  piezas sobre el acceso a red de Altamira; **El Correo**, dos sobre Merlin en
  Arasur; **larioja.com**, dos sobre si la fase constructiva de Albelda sigue viva.

### 6.3 septies. Pistas nacionales

- **Informe de Sostenibilidad 2025 de MasOrange**,
  `orange.es/static/pdf/ES_2025-Informe-de-Sostenibilidad-MasOrange_vdef.pdf`. PDF
  extenso, no abierto. Es el sitio más probable donde una empresa que declara unos
  doce centros de datos en venta liste sus emplazamientos, aunque sea por consumo
  energético o certificaciones. **Cerraría la mayor laguna del conjunto.**
- **Consulta previa ambiental del centro de Vianos** (Albacete). La Junta de
  Castilla-La Mancha abrió el trámite en junio de 2026 pero no aparece el expediente
  en `docm.jccm.es`. Daría el consumo de agua, que hoy descansa en la palabra del
  promotor, y las características de las ocho turbinas de gas.
- **Plan Especial de CPD 4 Arakaldo y acta del pleno de marzo de 2026** del
  Ayuntamiento de Arakaldo, municipio de menos de 1.000 habitantes, no publicados.
- **Pliego de prescripciones técnicas del expediente 2022/7509 de la GISS** (obras
  del CPD de Soria): en `contrataciondelestado.es` solo se lee un informe previo que
  describe el CPD actual de Madrid, no el de Soria.
- **Relicitación 2024-2025 del arrendamiento de espacios técnicos de la Comunidad de
  Madrid**: diría en qué instalación física se aloja su CPD, y permitiría modelarlo
  como inquilino en lugar de dejarlo como pista.
- **Uptime Institute, ficha del CPD GISS Soria**, que confirmaría su nivel Tier.

### 6.4. Aviso sobre el Observatorio EDC

`observatorioedc.com/directorio/` es el origen de casi todas las cifras de
`data/pendientes.yaml`. El barrido ha encontrado **al menos dos entradas
incorrectas**: el código y los MW del Oxigen de Sant Fruitós de Bages (es su tercer
centro y tiene 10 MW, no 8, y ODC2 es el del 22@ de Barcelona), y el municipio de
AtlasEdge BCN002, en disputa. Conviene tratar esa fuente como pista, nunca como
dato, que es exactamente el estatus que `pendientes.yaml` le da.

Efecto colateral útil: aparece un hueco nuevo, **el ODC2 de Oxigen en el 22@ de
Barcelona**, que no tiene ficha.
