// Descarga las centrales de generación eléctrica de España desde OpenStreetMap
// vía Overpass y las CACHEA en data/generacion/centrales.geojson.
//
// Se ejecuta a mano (npm run centrales:osm), no en cada build: el sitio
// publicado nunca consulta Overpass. Datos © colaboradores de OpenStreetMap,
// licencia ODbL.
//
// A diferencia de la capa de red, la consulta se acota por área administrativa
// (ISO3166-1=ES) y no por caja envolvente: una caja de la península mete dentro
// medio Portugal y el suroeste de Francia, y aquí el recuento por fuente se
// publica en la leyenda, así que colar centrales de otro país lo falsearía.
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { RAIZ } from './load.mjs'

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

const CONSULTA = `
[out:json][timeout:600];
area["ISO3166-1"="ES"][admin_level=2]->.es;
(
  nwr["power"="plant"](area.es);
);
out tags center;
`

// --- potencia ----------------------------------------------------------------

// `plant:output:electricity` admite unidad explícita y, sin ella, la
// especificación de OSM dice vatios. Interpretar el número desnudo como MW
// multiplica por un millón: la suma de la solar española pasaba de ~25 GW a
// 1,3 TW, que es lo que delató el error. Lo que no se puede leer se deja vacío
// y se conserva el texto original.
const POTENCIA = /^([\d.]+)\s*(GW|MW|kW|W)?$/i
const FACTOR = { GW: 1000, MW: 1, KW: 0.001, W: 0.000001 }

function potenciaMw(bruto) {
  if (!bruto) return null
  const m = POTENCIA.exec(String(bruto).trim().replace(',', '.'))
  if (!m) return null
  const n = Number(m[1])
  if (!Number.isFinite(n) || n <= 0) return null
  const mw = n * FACTOR[(m[2] ?? 'W').toUpperCase()]
  // Ninguna central española pasa de 3,5 GW; por encima es una errata de tag.
  return mw > 3500 ? null : Number(mw.toFixed(3))
}

// --- fuente ------------------------------------------------------------------

// Seis grupos, no once. El criterio no es de taxonomía sino de lectura: cinco
// colores es lo máximo que se distingue con seguridad en un mapa de puntos,
// incluso con daltonismo. El `plant:source` literal se conserva en la ficha,
// que es donde se puede leer sin depender del color.
const GRUPO = {
  solar: 'solar',
  wind: 'eolica',
  hydro: 'hidraulica',
  nuclear: 'nuclear',
  gas: 'fosil',
  coal: 'fosil',
  oil: 'fosil',
  diesel: 'fosil',
  'blast furnace gas': 'fosil',
}

function agrupar(bruto) {
  if (!bruto) return 'otra'
  const grupos = new Set(
    String(bruto)
      .split(';')
      .map((t) => GRUPO[t.trim().toLowerCase()] ?? 'otra'),
  )
  // Una central que quema gas y biomasa no es «gas» ni «biomasa»: es mixta, y
  // forzarla a un grupo escondería justo lo que la hace distinta.
  return grupos.size === 1 ? [...grupos][0] : 'otra'
}

// --- descarga ----------------------------------------------------------------

async function consultar(consulta) {
  let ultimoError
  for (const url of ENDPOINTS) {
    try {
      console.log(`Consultando ${url} …`)
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Overpass rechaza (406) las peticiones sin User-Agent identificable.
          'User-Agent': 'mapa-datacenters-espana/0.1 (cache puntual de centrales)',
          Accept: 'application/json',
        },
        body: new URLSearchParams({ data: consulta }),
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return await r.json()
    } catch (e) {
      console.warn(`  falló: ${e.message}`)
      ultimoError = e
    }
  }
  throw ultimoError
}

const datos = await consultar(CONSULTA)

const features = []
for (const el of datos.elements ?? []) {
  const lat = el.lat ?? el.center?.lat
  const lon = el.lon ?? el.center?.lon
  if (lat == null || lon == null) continue

  const tags = el.tags ?? {}
  const bruto = tags['plant:output:electricity'] ?? null
  const mw = potenciaMw(bruto)

  features.push({
    type: 'Feature',
    geometry: {
      type: 'Point',
      // 4 decimales (~11 m) bastan a escala nacional y reducen el peso.
      coordinates: [Number(lon.toFixed(4)), Number(lat.toFixed(4))],
    },
    properties: {
      id: `${el.type}/${el.id}`,
      nombre: tags.name ?? null,
      fuente: agrupar(tags['plant:source']),
      fuente_osm: tags['plant:source'] ?? null,
      metodo: tags['plant:method'] ?? null,
      potencia_mw: mw,
      // Se guarda el texto tal cual para poder auditar la lectura y para
      // distinguir «no lo dice» de «lo dice y no supimos leerlo».
      potencia_bruta: mw == null ? bruto : null,
      operador: tags.operator ?? null,
      inicio: tags.start_date ?? null,
    },
  })
}

features.sort((a, b) => (b.properties.potencia_mw ?? 0) - (a.properties.potencia_mw ?? 0))

const salida = {
  type: 'FeatureCollection',
  metadata: {
    fuente: 'OpenStreetMap (Overpass API)',
    licencia: 'ODbL 1.0 — © colaboradores de OpenStreetMap',
    consulta: CONSULTA.trim(),
    descargado: new Date().toISOString().slice(0, 10),
    nota:
      'Inventario de completitud variable y potencia declarada por los editores. ' +
      'No es el registro oficial de instalaciones de producción (RAIPEE/PRETOR). ' +
      'Incluye los archipiélagos, a diferencia del registro de centros de datos, ' +
      'que es peninsular.',
  },
  features,
}

mkdirSync(join(RAIZ, 'data/generacion'), { recursive: true })
writeFileSync(join(RAIZ, 'data/generacion/centrales.geojson'), JSON.stringify(salida), 'utf8')

const conPotencia = features.filter((f) => f.properties.potencia_mw != null)
const porGrupo = {}
for (const f of features) {
  const g = f.properties.fuente
  porGrupo[g] ??= { n: 0, mw: 0 }
  porGrupo[g].n++
  porGrupo[g].mw += f.properties.potencia_mw ?? 0
}

console.log(`${features.length} centrales guardadas, ${conPotencia.length} con potencia legible`)
for (const [g, { n, mw }] of Object.entries(porGrupo).sort((a, b) => b[1].mw - a[1].mw)) {
  console.log(`  ${g.padEnd(12)} ${String(n).padStart(5)} centrales  ${Math.round(mw).toLocaleString('es-ES').padStart(8)} MW`)
}
console.log('→ data/generacion/centrales.geojson')
