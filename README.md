# Centros de datos en España

[Mapa público](https://datacenters.m19182.dev) de instalaciones operativas y proyectos,
con capacidad, hardware, conexiones eléctricas, energía y normativa. Cubre península,
Baleares, Canarias, Ceuta y Melilla. Cada ficha conserva sus fuentes y fecha de revisión.

- [Metodología](https://datacenters.m19182.dev/metodologia): criterios editoriales y agregación.
- [Esquema](docs/ESQUEMA.md): campos, unidades, estados y referencias.
- [Datos](https://datacenters.m19182.dev/datos): descargas, licencias y validación.
- [Investigación programada](docs/INVESTIGACION-PROGRAMADA.md): tareas semanales y mensuales.

## Desarrollo

```bash
npm ci
npm run dev
```

El sitio usa Astro y MapLibre. Los YAML pasan por validación, reconciliación, SQLite y
exportación a JSON y GeoJSON antes de construir el sitio estático. El navegador no
consulta una base de datos ni necesita claves de API.

| Origen mantenido | Contenido |
|---|---|
| `data/sites/*.yaml` | Una ficha por emplazamiento, con fases, cifras y fuentes |
| `data/normativa/*.yaml` | Normas, requisitos, hitos y vínculos con las fichas |
| `data/red/` | Nudos, capacidad de acceso, CSV original de REE y trazado de OSM |
| `data/renovables/` y `data/generacion/` | Activos vinculados, centrales y unidades de generación |
| `data/actualizaciones.yaml` | Cambios publicados, con fecha del hecho e incorporación separadas |
| `data/revision.yaml` y `research/hallazgos.yaml` | Decisiones revisadas y candidatas de investigación |
| `data/pendientes.yaml` | Pistas anteriores, integradas en la misma cola pública de revisión |
| `src/lib/nombres.js` | Nombres breves compartidos por el mapa, las tablas y las fichas |
| `src/lib/proyecto-presentacion.js` | Resúmenes y cronologías editoriales con referencias |
| `src/lib/glosario.js` | Términos, alias y definiciones usados por la interfaz |

`build/`, `src/data/`, `public/datos/`, `src/contenido/` y `dist/` son resultados
generados. No se editan a mano.

## Comprobaciones

```bash
npm test
npm run validate:strict
npm run build
npx playwright install chromium
npm run test:ui
```

CI ejecuta estas comprobaciones en los PR y en `main`. Las pruebas de interfaz cubren
filtros, navegación, fuentes, móvil y lectura sin JavaScript. Guardan capturas en
`build/ui/`. Para usar un Chrome existente, indica su ruta mediante
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

| Comando | Resultado |
|---|---|
| `npm run validate` | Valida esquema y referencias; escribe `research/informe-validacion.md` |
| `npm run reconcile` | Detecta duplicados, nombres inconsistentes y discrepancias de potencia |
| `npm run db` | Construye `build/datacenters.db` |
| `npm run export` | Genera los JSON y GeoJSON |
| `npm run data` | Ejecuta los cuatro pasos anteriores |
| `npm run build` | Genera los datos y el sitio en `dist/` |

## Actualizar los datos

Modifica los YAML de origen y contrasta cada cambio con su fuente. Los criterios sobre
potencia, cómputo, campus y ubicaciones están en [el esquema](docs/ESQUEMA.md). El mapa y
las tablas abren en capacidad operativa; la prevista tiene su propio selector.

`npm run refresh` comprueba las URL registradas y compara su contenido con
`data/huellas.json`. Escribe `research/informe-actualizacion.md`, sin cambiar hechos ni
renovar `ultima_verificacion`. Una fuente cambiada sigue pendiente hasta revisarla y
aceptar su nueva referencia:

```bash
npm run refresh -- --aceptar "URL"
```

`npm run refresh:informe` regenera el informe con las observaciones guardadas, sin
acceder a la red. La exportación también lo genera desde la misma instantánea que la
cola pública. Cada URL conserva la fecha de su observación. Solo las respuestas 404 y
410 se clasifican como enlaces rotos; bloqueos y fallos de red tienen estados propios.
Los PDF se comparan por contenido, aunque el servidor no publique su tamaño.

`npm run refresh:sellar` conserva el argumento antiguo `--sellar`, pero tampoco modifica
fechas de revisión factual. El flujo `.github/workflows/revision-fuentes.yml` ejecuta las
comprobaciones cada lunes y abre un PR con los informes.

Las propuestas parciales van en `data/propuestas/<id>.yaml`. `npm run propuestas` simula
la integración; `npm run propuestas:aplicar` añade campos vacíos y conserva los valores
existentes cuando hay conflicto. Los desacuerdos quedan en
`research/informe-propuestas.md` para revisión. Una adición automática conserva la fecha
factual existente. Las altas nuevas requieren una fecha de revisión explícita en la propuesta.

Las decisiones y las pistas anteriores se consultan en
[Pendientes de revisión](https://datacenters.m19182.dev/revision). Las entradas ya
resueltas aparecen en el historial. Tras integrar una novedad factual, añade su entrada
a `data/actualizaciones.yaml`; el sitio y el RSS conservan los mismos identificadores.
Las comprobaciones de enlaces quedan en la cola técnica.

## Investigación y cartografía

Los informes territoriales y por operador viven en `research/`; las revisiones fechadas,
en `research/revisiones/`. Las guías de red y renovables explican conceptos. El estado
actual de cada norma procede de `data/normativa/`, y su análisis, de
`research/normativa/<id>.md`.

| Comando manual | Uso |
|---|---|
| `npm run refresh:ree` | Detecta una nueva edición de capacidad de demanda de REE |
| `npm run grid:osm` | Actualiza el trazado de transporte de 220 y 400 kV |
| `npm run centrales:osm` | Actualiza centrales y potencia instalada de OpenStreetMap |
| `npm run generacion:entsoe` | Descarga una instantánea de generación por unidad |
| `npm run contorno` | Actualiza el contorno de reserva de Natural Earth |
| `npm run geo` | Actualiza centroides municipales |
| `npm run exa -- buscar "consulta" --n 8` | Busca fuentes documentales con `EXA_API_KEY` |
| `npm run exa -- contenido "URL" --max 8000` | Obtiene el texto de una fuente |

Estos comandos dejan datos cacheados; la construcción usa esas copias. Cambiar de
edición REE exige reconciliar los valores de los nudos y conservar el CSV original.
La cobertura de su inventario y la del trazado geográfico se describen por separado en
el sitio.

La capa de centrales está apagada por defecto. La potencia instalada de OSM y la
generación medida de ENTSO-E ocupan campos distintos. Para esta última se necesita
`ENTSOE_TOKEN` y un cruce revisado de códigos EIC en `data/generacion/unidades.yaml`.
Con `--sugerir`, el importador propone coincidencias en `research/informe-generacion.md`;
no las acepta automáticamente. Sin token, se muestra únicamente la potencia publicada.

## Publicación

Cada push a `main` ejecuta `.github/workflows/despliegue.yml`: valida con `--strict`,
construye y publica `dist/` en Cloudflare Pages, proyecto `mapa-datacenters-espana`.
El dominio público es **datacenters.m19182.dev**. El repositorio usa los secretos
`CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.

```bash
npm run build
npx wrangler pages deploy dist --project-name=mapa-datacenters-espana
```

## Licencia

Los datos originales se publican bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
El trazado y las centrales derivados de OpenStreetMap conservan su licencia
[ODbL](https://opendatacommons.org/licenses/odbl/). Las cifras de ENTSO-E se reutilizan
citando su plataforma de transparencia. Las citas breves pertenecen a sus editores.
