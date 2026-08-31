# Centros de datos en España — registro documental

**https://datacenters.m19182.dev**

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
- **Capa opcional de centrales de generación**, apagada por defecto: potencia
  instalada por central y, cuando hay instantánea cargada, generación real por
  unidad de ENTSO-E. Son dos magnitudes distintas y viajan en campos distintos.

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
| `npm run refresh:sellar` | Igual, y actualiza la fecha de verificación de las fichas comprobadas |
| `npm run propuestas` | Simula la integración de `data/propuestas/` y separa los conflictos |
| `npm run grid:osm` | Recachea el trazado de 220/400 kV desde OpenStreetMap |
| `npm run centrales:osm` | Recachea el inventario de centrales de generación desde OpenStreetMap |
| `npm run generacion:entsoe` | Descarga una instantánea de generación real por unidad de ENTSO-E |
| `npm run contorno` | Recachea el contorno de costa del mapa de reserva desde Natural Earth |
| `npm run geo` | Recachea los centroides municipales |

`contorno` y `geo` son los únicos que salen a la red al construir; junto con
`grid:osm`, `centrales:osm` y `generacion:entsoe` se ejecutan a mano y dejan su
resultado cacheado en el repositorio.

## Actualización

El conjunto no depende de ningún raspado en tiempo real y está pensado para
envejecer de forma visible: cada ficha muestra su fecha de última verificación.

`npm run refresh` recorre todas las fuentes registradas, compara una huella del
contenido con la guardada en `data/huellas.json` y escribe una cola de revisión
en `research/informe-actualizacion.md`: qué páginas han cambiado, cuáles se han
roto, cuáles rechazan al comprobador automático sin estar rotas, y qué fichas
llevan demasiado tiempo sin revisar. **No modifica ningún dato.**

Con `--sellar` hace además una única escritura, que no toca ninguna afirmación:
actualiza `ultima_verificacion` en las fichas cuyas fuentes se han releído todas
con éxito y sin cambios. Así la fecha de verificación deja de ser un sello
uniforme y pasa a decir algo: qué se ha comprobado hace poco y qué arrastra.

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

## Centrales de generación

La capa es opcional y arranca apagada. Combina dos fuentes que responden a
preguntas distintas y **nunca se suman ni se convierten una en otra**:

| Magnitud | De dónde sale | Cobertura |
|---|---|---|
| Potencia instalada (MW) | OpenStreetMap, `power=plant` | 5.173 centrales, 2.052 con potencia legible |
| Generación real (MWh/día) | ENTSO-E, documento 16.1.A | solo unidades de 100 MW o más |

```bash
npm run centrales:osm                              # inventario y potencia
ENTSOE_TOKEN=… npm run generacion:entsoe -- --sugerir   # instantánea + cotejo
```

El token de ENTSO-E es gratuito, pero no se obtiene en el momento. Son tres
pasos: registrarse en la plataforma de transparencia; escribir a
transparency@entsoe.eu con el asunto «RESTful API access» indicando en el cuerpo
la dirección con la que uno se registró; y, una vez concedido el acceso —hasta
tres días laborables—, generar el token desde *My Account Settings*. La
plataforma lo enseña **una sola vez**, así que hay que copiarlo al generarlo. El
correo solo desbloquea el permiso: el token se lo genera uno.

**Sin token la capa funciona igual**, mostrando potencia instalada y dejando la
generación vacía, que es como está ahora.

Dos avisos que condicionan lo que se puede afirmar con esto:

1. **`plant:output:electricity` sin unidad son vatios**, no megavatios. Leerlo mal
   multiplica por un millón: la solar española pasaba de ~25 GW a 1,3 TW, y ese
   disparate fue justo lo que delató el error. Lo que no se puede leer se deja
   vacío y se conserva el texto original en `potencia_bruta`.
2. **16.1.A no cubre parques eólicos ni plantas solares individuales.** Cubre
   nucleares, ciclos combinados, grandes hidráulicas y carbón. La mayoría de las
   centrales del mapa no tendrá nunca cifra de generación, y así se dice en la
   ficha en lugar de estimarla.

ENTSO-E identifica cada unidad por su código EIC y un nombre comercial que no
coincide con el de OpenStreetMap, así que la correspondencia se escribe a mano en
`data/generacion/unidades.yaml`. Con `--sugerir`, el script propone candidatos por
parecido de nombre en `research/informe-generacion.md` y no modifica nada: decide
una persona, como con las propuestas de datos.

## Despliegue

Sitio estático en `dist/`, publicado en Cloudflare Pages sobre el proyecto
`mapa-datacenters-espana` y servido en **datacenters.m19182.dev**.

Cada push a `main` dispara `.github/workflows/despliegue.yml`, que valida el
conjunto de datos con `--strict`, construye el sitio y lo sube. Si la validación
falla, no se publica nada. Los secretos `CLOUDFLARE_API_TOKEN` y
`CLOUDFLARE_ACCOUNT_ID` están configurados en el repositorio.

Para publicar a mano:

```bash
npm run build
npx wrangler pages deploy dist --project-name=mapa-datacenters-espana
```

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
| `informe-generacion.md` | Cola de cotejo entre unidades de ENTSO-E y centrales de OSM |

## Calidad conocida

El conjunto se audita a sí mismo y publica el resultado. La comprobación más
exigente verifica que cada cifra de potencia aparezca literalmente en la cita de
alguna de sus fuentes; hoy falla en una parte de los registros, y esa proporción
se muestra en la sección de datos del sitio en lugar de guardarse. Un registro
que oculta sus defectos no es más fiable, solo lo parece.

## Licencia

Los datos originales de este registro, bajo
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es). El trazado de
la red eléctrica deriva de OpenStreetMap y se rige por la
[ODbL](https://opendatacommons.org/licenses/odbl/), igual que el inventario de
centrales de generación. Las cifras de generación real proceden de la plataforma
de transparencia de ENTSO-E y se reutilizan citando la fuente. Las citas literales
pertenecen a sus editores y se reproducen como fragmento breve a efectos de
verificación.
