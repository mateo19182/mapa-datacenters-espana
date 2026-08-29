// Descarga la geometría de la red de transporte (>=220 kV) de España peninsular
// desde OpenStreetMap vía Overpass y la CACHEA en data/red/lineas.geojson.
//
// Se ejecuta a mano (npm run grid:osm), no en cada build: el sitio publicado
// nunca consulta Overpass. Datos © colaboradores de OpenStreetMap, licencia ODbL.
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { RAIZ } from './load.mjs'

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

// Bounding box de España peninsular (sur, oeste, norte, este).
const BBOX = '35.9,-9.4,43.9,3.4'

const CONSULTA = `
[out:json][timeout:600];
(
  way["power"="line"]["voltage"~"^(2[2-9][0-9]000|[3-9][0-9]{5})"](${BBOX});
);
out geom;
`

const clasificarKv = (voltage) => {
  if (!voltage) return null
  const valores = String(voltage)
    .split(';')
    .map((v) => Number.parseInt(v, 10) / 1000)
    .filter((v) => Number.isFinite(v))
  return valores.length ? Math.max(...valores) : null
}

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
          'User-Agent': 'mapa-datacenters-espana/0.1 (cache puntual de red de transporte)',
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
  if (el.type !== 'way' || !Array.isArray(el.geometry)) continue
  const kv = clasificarKv(el.tags?.voltage)
  if (kv == null || kv < 220) continue
  features.push({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      // 4 decimales (~11 m) bastan a escala nacional y reducen el peso a un tercio.
      coordinates: el.geometry
        .map((p) => [Number(p.lon.toFixed(4)), Number(p.lat.toFixed(4))])
        .filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]),
    },
    properties: {
      osm_id: el.id,
      nombre: el.tags?.name ?? null,
      operador: el.tags?.operator ?? null,
      kv,
      nivel: kv >= 380 ? '400' : '220',
      circuitos: el.tags?.circuits ?? null,
    },
  })
}

const salida = {
  type: 'FeatureCollection',
  metadata: {
    fuente: 'OpenStreetMap (Overpass API)',
    licencia: 'ODbL 1.0 — © colaboradores de OpenStreetMap',
    consulta: CONSULTA.trim(),
    descargado: new Date().toISOString().slice(0, 10),
    nota: 'Trazado aproximado y de completitud variable. No es cartografía oficial de Red Eléctrica.',
  },
  features,
}

mkdirSync(join(RAIZ, 'data/red'), { recursive: true })
writeFileSync(join(RAIZ, 'data/red/lineas.geojson'), JSON.stringify(salida), 'utf8')

const por400 = features.filter((f) => f.properties.nivel === '400').length
console.log(`${features.length} tramos guardados (${por400} de 400 kV, ${features.length - por400} de 220 kV)`)
console.log('→ data/red/lineas.geojson')
