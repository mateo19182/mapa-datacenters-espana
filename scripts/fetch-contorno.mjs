// Contorno de costa y fronteras para el mapa de reserva.
//
// Cuando el estilo base remoto no se puede cargar (bloqueadores, filtrado de
// red, caída del CDN) el mapa se queda sin ninguna referencia geográfica y los
// círculos flotan sobre el vacío. Este contorno, servido desde el propio
// dominio, da el mínimo indispensable para situarlos.
//
// Fuente: Natural Earth 1:50m Admin 0 Countries, de dominio público.
// https://www.naturalearthdata.com/about/terms-of-use/
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ORIGEN =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'
const PAISES = new Set(['ESP', 'PRT', 'FRA', 'AND', 'MAR', 'DZA'])
// Ventana que cubre la península y su entorno visible al zoom inicial.
const VENTANA = { oeste: -13, este: 8, sur: 31, norte: 48 }
const DESTINO = join(new URL('..', import.meta.url).pathname, 'data/geo/contorno.geojson')

const red = (n) => Math.round(n * 1000) / 1000

const dentro = (anillo) => {
  let oeste = 180
  let este = -180
  let sur = 90
  let norte = -90
  for (const [x, y] of anillo) {
    if (x < oeste) oeste = x
    if (x > este) este = x
    if (y < sur) sur = y
    if (y > norte) norte = y
  }
  return este >= VENTANA.oeste && oeste <= VENTANA.este && norte >= VENTANA.sur && sur <= VENTANA.norte
}

// Reduce el número de vértices sin mover la línea más de `tol` grados.
const simplificar = (anillo, tol = 0.01) => {
  const salida = [anillo[0]]
  for (const p of anillo.slice(1, -1)) {
    const u = salida.at(-1)
    if (Math.abs(p[0] - u[0]) > tol || Math.abs(p[1] - u[1]) > tol) salida.push(p)
  }
  salida.push(anillo.at(-1))
  return salida.length >= 4 ? salida : anillo
}

const respuesta = await fetch(ORIGEN, { headers: { 'User-Agent': 'mapa-datacenters-espana' } })
if (!respuesta.ok) throw new Error(`Natural Earth respondió ${respuesta.status}`)
const crudo = await respuesta.json()

const rasgos = []
for (const f of crudo.features) {
  if (!PAISES.has(f.properties.ADM0_A3)) continue
  const partes = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  const conservados = []
  for (const poligono of partes) {
    const anillos = poligono
      .map((anillo) => simplificar(anillo.map(([x, y]) => [red(x), red(y)])))
      .filter((anillo) => dentro(anillo))
    if (anillos.length) conservados.push(anillos)
  }
  if (!conservados.length) continue
  rasgos.push({
    type: 'Feature',
    properties: { pais: f.properties.ADM0_A3, nombre: f.properties.NAME_ES ?? f.properties.NAME },
    geometry: { type: 'MultiPolygon', coordinates: conservados },
  })
}

const salida = {
  type: 'FeatureCollection',
  fuente: 'Natural Earth 1:50m Admin 0 Countries (dominio público)',
  generado: new Date().toISOString().slice(0, 10),
  features: rasgos,
}
writeFileSync(DESTINO, JSON.stringify(salida))
const vertices = rasgos.reduce(
  (a, f) => a + f.geometry.coordinates.flat(2).length,
  0,
)
console.log(`contorno: ${rasgos.length} países, ${vertices} vértices → ${DESTINO}`)
