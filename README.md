# Centros de datos en España — registro documental

Mapa público de los centros de datos de España peninsular y su relación con la
infraestructura eléctrica de transporte. Cada dato lleva su fuente; los huecos y
las contradicciones se muestran en lugar de rellenarse.

No es un análisis de mercado ni de inversión: es un registro de hechos
publicados, con su procedencia y su fecha de verificación.

## Qué contiene

- Emplazamientos operativos y proyectados, con operador, propietario, estado,
  fases y potencia.
- **MW IT, MW de conexión a red y potencia instalada como magnitudes separadas**,
  que nunca se suman entre sí ni se convierten aplicando un PUE supuesto.
- Subestaciones de 220 y 400 kV, capacidad de acceso para demanda por nudo
  publicada por Red Eléctrica, y actuaciones de red planificadas.
- Generación renovable y baterías con vínculo documentado a un centro concreto.
- Trazado de la red de transporte derivado de OpenStreetMap.

## Las reglas del conjunto

1. **Nada sin fuente.** Cada cifra lleva URL, editor y, cuando ha sido posible,
   la cita literal que la sostiene.
2. **No se rellenan huecos.** Lo que no consta queda vacío y así se muestra.
3. **No se mezclan tipos de potencia.**
4. **Las contradicciones se conservan.** Cuando dos fuentes fiables discrepan, se
   registran ambas y la discrepancia se hace visible en la ficha.
5. **Un emplazamiento, un registro.** Los renombrados por adquisición se
   reconcilian con alias, no duplicando entradas.

`docs/ESQUEMA.md` desarrolla el modelo de datos campo a campo.

## Arquitectura

Deliberadamente simple, y en un solo sentido:

```
data/**.yaml  ──▶  validación  ──▶  SQLite  ──▶  JSON/GeoJSON  ──▶  sitio estático
 (verdad)          (esquema)        (build/)      (src/data,          (Astro +
                                                   public/datos)       MapLibre)
```

La fuente de verdad son ficheros YAML legibles, uno por emplazamiento, pensados
para revisarse a mano en un *pull request*. Todo lo demás se regenera y no se
edita: `build/`, `src/data/`, `public/datos/` y `src/contenido/` están fuera del
control de versiones.

El sitio publicado es estático. No consulta ninguna base de datos en ejecución,
no hace raspado en vivo y no necesita claves de API: la cartografía base es de
CARTO y OpenStreetMap.

## Puesta en marcha

```bash
npm install
npm run dev        # valida, reconcilia, construye los datos y levanta el sitio
```

| Comando | Qué hace |
|---|---|
| `npm run validate` | Valida el esquema y la integridad de las referencias a fuentes |
| `npm run reconcile` | Detecta variantes de nombre, duplicados e incoherencias de potencia |
| `npm run db` | Vuelca los YAML a `build/datacenters.db` |
| `npm run export` | Genera los JSON y GeoJSON del sitio |
| `npm run data` | Los cuatro anteriores en orden |
| `npm run build` | `data` + construcción del sitio en `dist/` |
| `npm run refresh` | Comprueba las fuentes registradas y arma la cola de revisión |
| `npm run propuestas` | Simula la integración de `data/propuestas/` y separa los conflictos |
| `npm run grid:osm` | Recachea el trazado de 220/400 kV desde OpenStreetMap |
| `npm run geo` | Recachea los centroides municipales |

Los dos últimos son los únicos que salen a la red al construir, se ejecutan a
mano y dejan su resultado cacheado en el repositorio.

## Actualización

El conjunto no depende de ningún raspado en tiempo real y está pensado para
envejecer de forma visible: cada ficha muestra su fecha de última verificación.

`npm run refresh` recorre todas las fuentes registradas, compara una huella del
contenido con la guardada en `data/huellas.json` y escribe una cola de revisión
en `research/informe-actualizacion.md`: qué páginas han cambiado, cuáles se han
roto, cuáles rechazan al comprobador automático sin estar rotas, y qué fichas
llevan demasiado tiempo sin revisar. **No modifica ningún dato.**

Las modificaciones entran como propuestas en `data/propuestas/<id>.yaml`, con la
misma forma que el emplazamiento y solo los campos que cambian.
`npm run propuestas` las contrasta con lo registrado y aplica una política
estricta:

- campo que no existía → **adición**, se aplica;
- campo idéntico → nada que hacer;
- campo con valor distinto → **conflicto: no se sobrescribe nunca**.

Los conflictos se listan en `research/informe-propuestas.md` para que una
persona decida. Cuando un dato nuevo contradice al viejo, lo correcto casi
siempre no es elegir uno, sino conservar ambos en `potencia[]` y documentar la
discrepancia en `incertidumbres[]`.

El flujo `.github/workflows/revision-fuentes.yml` ejecuta todo esto cada lunes y
abre un *pull request* con los tres informes, para revisión humana antes de
fusionar.

## Despliegue

Sitio estático en `dist/`, pensado para Cloudflare Pages.

Con el conector de Git de Cloudflare Pages: comando de construcción
`npm run build`, directorio de salida `dist`, Node 22.

Como alternativa, `.github/workflows/despliegue.yml` construye y publica desde
GitHub Actions con la misma validación que el resto del flujo; necesita los
secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.

## Informes

`research/` recoge tanto los dossieres de investigación por territorio y por
compañía como los informes que genera la tubería:

| Fichero | Contenido |
|---|---|
| `informe-validacion.md` | Errores y avisos del esquema |
| `informe-reconciliacion.md` | Variantes de nombre, duplicados, incoherencias |
| `informe-actualizacion.md` | Cola de revisión de fuentes |
| `cobertura.md` | Huecos, contradicciones y nivel de cobertura |
| `auditoria-datos.md` | Verificación independiente de los datos de mayor impacto |
| `red-electrica.md` | Cómo se reparte el acceso a la red (se publica en el sitio) |
| `renovables.md` | Contratos de energía vinculados a centros de datos (se publica) |

## Licencia

Los datos originales de este registro, bajo
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es). El trazado de
la red eléctrica deriva de OpenStreetMap y se rige por la
[ODbL](https://opendatacommons.org/licenses/odbl/). Las citas literales
pertenecen a sus editores y se reproducen como fragmento breve a efectos de
verificación.
