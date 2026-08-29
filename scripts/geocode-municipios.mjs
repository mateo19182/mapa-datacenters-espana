// Resuelve el centroide de los municipios que aparecen en el conjunto y lo
// cachea en data/geo/municipios.json.
//
// Un centroide municipal NO es la ubicación de una instalación: es «en algún
// punto de este municipio». Por eso solo se usa para registros que declaran
// `precision: municipio` y el sitio los dibuja de forma distinta, para que no
// se lean como una parcela localizada.
//
// Se ejecuta a mano (npm run geo). El sitio publicado nunca llama a Nominatim.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { cargarTodo, RAIZ } from './load.mjs'

const CACHE = join(RAIZ, 'data/geo/municipios.json')
mkdirSync(join(RAIZ, 'data/geo'), { recursive: true })
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {}

// Nominatim exige un máximo de una petición por segundo y User-Agent propio.
const ESPERA_MS = 1100

const clave = (municipio, provincia) => `${municipio}|${provincia ?? ''}`.toLowerCase()

const { sitios, renovables, red } = cargarTodo()

const pendientes = new Map()
const anotar = (municipio, provincia, lat) => {
  if (!municipio || lat != null) return
  const k = clave(municipio, provincia)
  if (cache[k] || pendientes.has(k)) return
  pendientes.set(k, { municipio, provincia })
}

for (const s of sitios) anotar(s.ubicacion.municipio, s.ubicacion.provincia, s.ubicacion.lat)
for (const r of renovables) {
  anotar(r.municipio, r.provincia, r.lat)
  for (const m of r.municipios ?? []) anotar(m, r.provincia, null)
}
for (const n of red) anotar(n.municipio, n.provincia, n.lat)

console.log(`${pendientes.size} municipios por resolver (${Object.keys(cache).length} ya en caché)`)

let resueltos = 0
for (const [k, { municipio, provincia }] of pendientes) {
  const q = new URLSearchParams({
    q: [municipio, provincia, 'España'].filter(Boolean).join(', '),
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'es',
  })
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?${q}`, {
      headers: {
        'User-Agent': 'mapa-datacenters-espana/0.1 (centroides municipales, uso puntual)',
        'Accept-Language': 'es',
      },
    })
    if (r.ok) {
      const [primero] = await r.json()
      if (primero) {
        cache[k] = {
          municipio,
          provincia: provincia ?? null,
          lat: Number(Number(primero.lat).toFixed(5)),
          lon: Number(Number(primero.lon).toFixed(5)),
          tipo_osm: primero.type,
          nombre_osm: primero.display_name,
          consultado: new Date().toISOString().slice(0, 10),
        }
        resueltos++
      } else {
        cache[k] = { municipio, provincia: provincia ?? null, lat: null, lon: null, sin_resultado: true }
      }
    }
  } catch (e) {
    console.warn(`  ${municipio}: ${e.message}`)
  }
  await new Promise((r) => setTimeout(r, ESPERA_MS))
}

writeFileSync(CACHE, JSON.stringify(cache, null, 1), 'utf8')
console.log(`${resueltos} resueltos · caché con ${Object.keys(cache).length} municipios → data/geo/municipios.json`)
