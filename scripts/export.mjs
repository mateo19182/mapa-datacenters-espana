// Exporta desde SQLite los ficheros estáticos que consume el sitio Astro.
// Nada de esto se consulta en tiempo de ejecución: el sitio es estático.
import { mkdirSync, writeFileSync, existsSync, readFileSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import YAML from 'yaml'
import Database from 'better-sqlite3'
import { RAIZ } from './load.mjs'
import { resumirPotencia, sumarCartera } from './potencia.mjs'
import { ESTADOS, TIPOS_CAPACIDAD } from './schema.mjs'

// src/data alimenta las páginas en tiempo de build; public/datos se sirve tal
// cual al navegador (mapa) y es además la descarga de datos abiertos.
const SALIDA = join(RAIZ, 'src/data')
const PUBLICO = join(RAIZ, 'public/datos')
mkdirSync(SALIDA, { recursive: true })
mkdirSync(PUBLICO, { recursive: true })

// Centroides municipales cacheados: sirven para situar en el mapa lo que solo
// se conoce a nivel de municipio, siempre marcado como derivado.
const centroides = existsSync(join(RAIZ, 'data/geo/municipios.json'))
  ? JSON.parse(readFileSync(join(RAIZ, 'data/geo/municipios.json'), 'utf8'))
  : {}
const centroideDe = (municipio, provincia) => {
  if (!municipio) return null
  const c =
    centroides[`${municipio}|${provincia ?? ''}`.toLowerCase()] ??
    Object.values(centroides).find((v) => v.municipio === municipio && v.lat != null)
  return c?.lat != null ? c : null
}

// Estado de cada enlace según la última comprobación (npm run refresh).
const huellas = existsSync(join(RAIZ, 'data/huellas.json'))
  ? JSON.parse(readFileSync(join(RAIZ, 'data/huellas.json'), 'utf8'))
  : {}
const estadoEnlace = (url) => {
  const h = huellas[url]
  if (!h) return null
  if (h.clase === 'rota') return { clase: 'rota', motivo: h.motivo, fecha: h.ultimo_fallo }
  if (h.clase === 'bloqueada') return { clase: 'bloqueada', motivo: h.motivo, fecha: h.ultimo_fallo }
  return { clase: 'viva', fecha: h.visto ?? null }
}

const db = new Database(join(RAIZ, 'build/datacenters.db'), { readonly: true })
const q = (sql, ...a) => db.prepare(sql).all(...a)

const agrupar = (filas, clave) => {
  const m = new Map()
  for (const f of filas) {
    if (!m.has(f[clave])) m.set(f[clave], [])
    m.get(f[clave]).push(f)
  }
  return m
}

const alias = agrupar(q('SELECT * FROM alias'), 'sitio_id')
const potencias = agrupar(q('SELECT * FROM potencias ORDER BY idx'), 'sitio_id')
const fases = agrupar(q('SELECT * FROM fases ORDER BY idx'), 'sitio_id')
const incert = agrupar(q('SELECT * FROM incertidumbres ORDER BY idx'), 'sitio_id')
const fuentes = agrupar(q('SELECT * FROM fuentes'), 'sitio_id')
const respaldos = agrupar(q('SELECT * FROM respaldos'), 'sitio_id')

const sitios = q('SELECT * FROM sitios ORDER BY nombre').map((s) => {
  const pot = (potencias.get(s.id) ?? []).map((p) => ({
    tipo: p.tipo,
    valor_mw: p.valor_mw,
    valor_mw_max: p.valor_mw_max,
    valor_mva: p.valor_mva,
    acumulado: Boolean(p.acumulado),
    ambito: p.ambito,
    referencia: p.referencia,
    estado_asociado: p.estado_asociado,
    fecha_dato: p.fecha_dato,
    nota: p.nota,
    fuentes: (respaldos.get(s.id) ?? []).filter((r) => r.campo === `potencia[${p.idx}]`).map((r) => r.fuente_id),
  }))

  const respaldoDe = (campo) =>
    (respaldos.get(s.id) ?? []).filter((r) => r.campo === campo).map((r) => r.fuente_id)

  return {
    id: s.id,
    nombre: s.nombre,
    alias: (alias.get(s.id) ?? []).map((a) => a.alias),
    tipo: s.tipo,
    operador: s.operador,
    propietario: s.propietario,
    cliente_ancla: s.cliente_ancla,
    modelo: s.modelo,
    ubicacion: {
      municipio: s.municipio,
      provincia: s.provincia,
      ccaa: s.ccaa,
      direccion: s.direccion,
      lat: s.lat,
      lon: s.lon,
      precision: s.precision_coord,
      fuentes: respaldoDe('ubicacion'),
    },
    estado: s.estado,
    estado_detalle: s.estado_detalle,
    estado_fuentes: respaldoDe('estado'),
    fecha_puesta_en_servicio: s.fecha_puesta_en_servicio,
    potencia: pot,
    resumen_potencia: resumirPotencia(pot),
    fases: (fases.get(s.id) ?? []).map((f) => ({
      nombre: f.nombre,
      estado: f.estado,
      fecha_puesta_en_servicio: f.fecha_puesta_en_servicio,
      superficie_m2: f.superficie_m2,
      nota: f.nota,
      fuentes: respaldoDe(`fases[${f.idx}]`),
    })),
    conexion_electrica: s.subestacion || s.tension_kv || s.mw_solicitados || s.mw_concedidos
      ? {
          subestacion: s.subestacion,
          tension_kv: s.tension_kv,
          titular_red: s.titular_red,
          mw_solicitados: s.mw_solicitados,
          mw_concedidos: s.mw_concedidos,
          fuentes: respaldoDe('conexion_electrica'),
        }
      : null,
    superficie_parcela_m2: s.superficie_parcela_m2,
    superficie_construida_m2: s.superficie_construida_m2,
    inversion_anunciada_eur: s.inversion_anunciada_eur,
    refrigeracion: s.refrigeracion,
    enlaces_proyecto: JSON.parse(s.enlaces_proyecto ?? '[]'),
    incertidumbres: (incert.get(s.id) ?? []).map((u) => ({
      campo: u.campo,
      descripcion: u.descripcion,
      fuentes: respaldoDe(`incertidumbres[${u.idx}]`),
    })),
    confianza: s.confianza,
    ultima_verificacion: s.ultima_verificacion,
    fuentes: (fuentes.get(s.id) ?? []).map((f) => ({
      id: f.id,
      url: f.url,
      titulo: f.titulo,
      editor: f.editor,
      tipo: f.tipo,
      fecha_publicacion: f.fecha_publicacion,
      fecha_consulta: f.fecha_consulta,
      cita: f.cita,
      enlace: estadoEnlace(f.url),
    })),
  }
})

// --- vistas derivadas --------------------------------------------------------

const normaliza = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const porClave = (clave) => {
  const m = new Map()
  for (const s of sitios) {
    const v = clave(s)
    if (!v) continue
    if (!m.has(v)) m.set(v, [])
    m.get(v).push(s)
  }
  return m
}

const carteraDe = (lista) => ({
  emplazamientos: lista.length,
  por_estado: Object.fromEntries(
    ESTADOS.map((e) => [e, lista.filter((s) => s.estado === e).length]).filter(([, n]) => n > 0),
  ),
  // Solo se agregan las magnitudes que describen la capacidad del centro: los
  // grupos de respaldo y la generación asociada quedan fuera de todo total.
  potencia: Object.fromEntries(TIPOS_CAPACIDAD.map((t) => [t, sumarCartera(lista, t)])),
})

const companias = [...porClave((s) => s.operador).entries()]
  .map(([nombre, lista]) => ({
    slug: normaliza(nombre),
    nombre,
    ...carteraDe(lista),
    ccaas: [...new Set(lista.map((s) => s.ubicacion.ccaa).filter(Boolean))].sort(),
    sitios: lista.map((s) => s.id),
  }))
  .sort((a, b) => b.emplazamientos - a.emplazamientos || a.nombre.localeCompare(b.nombre, 'es'))

const regiones = [...porClave((s) => s.ubicacion.ccaa).entries()]
  .map(([nombre, lista]) => ({
    slug: normaliza(nombre),
    nombre,
    ...carteraDe(lista),
    operadores: [...new Set(lista.map((s) => s.operador).filter(Boolean))].sort(),
    provincias: [...new Set(lista.map((s) => s.ubicacion.provincia).filter(Boolean))].sort(),
    sitios: lista.map((s) => s.id),
  }))
  .sort((a, b) => b.emplazamientos - a.emplazamientos || a.nombre.localeCompare(b.nombre, 'es'))

// Cobertura pendiente: pistas conocidas que aún no son fichas. No es dataset.
const pendientes = existsSync(join(RAIZ, 'data/pendientes.yaml'))
  ? YAML.parse(readFileSync(join(RAIZ, 'data/pendientes.yaml'), 'utf8'))
  : { proyectos: [], sin_municipio: [] }

const red = q('SELECT datos FROM red_nodos').map((r) => JSON.parse(r.datos))
const actuaciones = q('SELECT datos FROM red_actuaciones').map((r) => JSON.parse(r.datos))
const capacidad = q('SELECT datos FROM red_capacidad').map((r) => JSON.parse(r.datos))
const renovables = q('SELECT datos FROM renovables').map((r) => JSON.parse(r.datos))

const geojson = (items, propiedades) => ({
  type: 'FeatureCollection',
  features: items
    .filter((i) => i.lat != null && i.lon != null)
    .map((i) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [i.lon, i.lat] },
      properties: propiedades(i),
    })),
})

let derivadas = 0
for (const s of sitios) {
  if (s.ubicacion.lat != null) continue
  const c = centroideDe(s.ubicacion.municipio, s.ubicacion.provincia)
  if (!c) continue
  s.ubicacion.lat = c.lat
  s.ubicacion.lon = c.lon
  s.ubicacion.precision = 'municipio'
  s.ubicacion.coordenada_derivada = true
  derivadas++
}

const sitiosGeo = geojson(
  sitios.map((s) => ({ ...s, lat: s.ubicacion.lat, lon: s.ubicacion.lon })),
  (s) => ({
    id: s.id,
    nombre: s.nombre,
    operador: s.operador,
    estado: s.estado,
    ccaa: s.ubicacion.ccaa,
    municipio: s.ubicacion.municipio,
    modelo: s.modelo,
    confianza: s.confianza,
    precision: s.ubicacion.precision,
    coordenada_derivada: s.ubicacion.coordenada_derivada ?? false,
    mw_it: s.resumen_potencia.it?.valor_mw ?? null,
    mw_conexion: s.resumen_potencia.conexion_red?.valor_mw ?? null,
    mw_sin_tipo: s.resumen_potencia.no_especificado?.valor_mw ?? null,
  }),
)

const redGeo = geojson(
  red.map((n) => ({ ...n, lat: n.lat ?? null, lon: n.lon ?? null })),
  (n) => ({
    id: n.id,
    nombre: n.nombre ?? n.id,
    tensiones_kv: Array.isArray(n.tensiones_kv) ? n.tensiones_kv.join('/') : (n.tension_kv ?? null),
    titular: n.titular ?? null,
    estado: n.estado ?? null,
    capacidad_acceso_demanda_mw: n.capacidad_acceso_demanda_mw ?? null,
    ccaa: n.ccaa ?? null,
    tipo_registro: n.tipo_registro ?? 'subestacion',
  }),
)

// A los activos renovables casi nunca se les publica coordenada; se sitúan en el
// centro de su municipio y se declara como tal.
for (const r of renovables) {
  if (r.lat != null) continue
  const c = centroideDe(r.municipio ?? r.municipios?.[0], r.provincia)
  if (!c) continue
  r.lat = c.lat
  r.lon = c.lon
  r.precision = 'municipio'
  r.coordenada_derivada = true
}

const renovablesGeo = geojson(renovables, (r) => ({
  id: r.id,
  nombre: r.nombre ?? r.id,
  tipo: r.tipo ?? null,
  potencia_mw: r.potencia_mw ?? null,
  capacidad_mwh: r.capacidad_mwh ?? null,
  promotor: r.promotor ?? null,
  contraparte_ppa: r.contraparte_ppa ?? null,
  tipo_vinculo: r.tipo_vinculo ?? null,
  estado: r.estado ?? null,
  coordenada_derivada: r.coordenada_derivada ?? false,
}))

const todasLasFuentes = new Map()
for (const s of sitios) {
  for (const f of s.fuentes) {
    const clave = f.url
    if (!todasLasFuentes.has(clave)) todasLasFuentes.set(clave, { ...f, usos: [] })
    todasLasFuentes.get(clave).usos.push(s.id)
  }
}

const resumen = {
  generado: new Date().toISOString().slice(0, 10),
  total_emplazamientos: sitios.length,
  con_coordenadas: sitios.filter((s) => s.ubicacion.lat != null).length,
  coordenadas_exactas: sitios.filter((s) => s.ubicacion.precision === 'exacta').length,
  coordenadas_derivadas: sitios.filter((s) => s.ubicacion.coordenada_derivada).length,
  por_confianza: Object.fromEntries(
    ['alta', 'media', 'baja'].map((c) => [c, sitios.filter((s) => s.confianza === c).length]),
  ),
  por_estado: Object.fromEntries(
    ESTADOS.map((e) => [e, sitios.filter((s) => s.estado === e).length]).filter(([, n]) => n > 0),
  ),
  cartera: carteraDe(sitios),
  en_servicio: carteraDe(
    sitios.filter((s) => ['operativo', 'parcialmente_operativo', 'ampliacion_en_construccion'].includes(s.estado)),
  ),
  en_desarrollo: carteraDe(
    sitios.filter((s) =>
      ['anunciado', 'en_tramitacion', 'permisos_concedidos', 'en_construccion'].includes(s.estado),
    ),
  ),
  companias: companias.length,
  regiones: regiones.length,
  nodos_red: red.length,
  actuaciones_red: actuaciones.length,
  nudos_con_capacidad: capacidad.length,
  activos_renovables: renovables.length,
  fuentes_distintas: todasLasFuentes.size,
  emplazamientos_con_incertidumbres: sitios.filter((s) => s.incertidumbres.length > 0).length,
  sin_region: sitios.filter((s) => !s.ubicacion.ccaa).length,
  pendientes: (pendientes.proyectos ?? []).length,
  pistas_sin_municipio: (pendientes.sin_municipio ?? []).length,
}

const escribir = (nombre, datos, publico = true) => {
  const texto = JSON.stringify(datos, null, nombre.endsWith('.geojson') ? 0 : 1)
  writeFileSync(join(SALIDA, nombre), texto, 'utf8')
  if (publico) writeFileSync(join(PUBLICO, nombre), texto, 'utf8')
}

escribir('sitios.json', sitios)
escribir('companias.json', companias)
escribir('regiones.json', regiones)
escribir('red.json', red)
escribir('actuaciones.json', actuaciones)
escribir('capacidad.json', capacidad)
escribir('renovables.json', renovables)
escribir('fuentes.json', [...todasLasFuentes.values()].sort((a, b) => b.usos.length - a.usos.length))
escribir('resumen.json', resumen)
escribir('pendientes.json', pendientes)
escribir('sitios.geojson', sitiosGeo)
// Lista plana con TODOS los emplazamientos, también los que no tienen
// coordenadas: si no, desaparecerían del buscador por un hueco de la fuente.
escribir(
  'sitios-lista.json',
  sitios.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    operador: s.operador,
    estado: s.estado,
    ccaa: s.ubicacion.ccaa,
    municipio: s.ubicacion.municipio,
    modelo: s.modelo,
    confianza: s.confianza,
    precision: s.ubicacion.precision,
    coordenada_derivada: s.ubicacion.coordenada_derivada ?? false,
    lat: s.ubicacion.lat,
    lon: s.ubicacion.lon,
    alias: s.alias,
    mw_it: s.resumen_potencia.it?.valor_mw ?? null,
    mw_conexion: s.resumen_potencia.conexion_red?.valor_mw ?? null,
    mw_sin_tipo: s.resumen_potencia.no_especificado?.valor_mw ?? null,
  })),
)
// Índice de alias para que el buscador del mapa encuentre los nombres antiguos.
escribir('alias.json', Object.fromEntries(sitios.filter((s) => s.alias.length).map((s) => [s.id, s.alias])))
escribir('red.geojson', redGeo)
escribir('renovables.geojson', renovablesGeo)

// Geometría de líneas cacheada desde OpenStreetMap (ver scripts/fetch-osm-grid.mjs).
const lineas = join(RAIZ, 'data/red/lineas.geojson')
if (existsSync(lineas)) {
  copyFileSync(lineas, join(PUBLICO, 'lineas.geojson'))
} else {
  writeFileSync(join(PUBLICO, 'lineas.geojson'), JSON.stringify({ type: 'FeatureCollection', features: [] }), 'utf8')
}

// La propia base SQLite se publica como descarga.
copyFileSync(join(RAIZ, 'build/datacenters.db'), join(PUBLICO, 'datacenters.db'))

// Los dossieres de investigación que son material publicable se copian a src
// para que Astro los renderice como páginas. Se generan, no se editan a mano.
const CONTENIDO = join(RAIZ, 'src/contenido')
mkdirSync(CONTENIDO, { recursive: true })
for (const doc of ['red-electrica', 'renovables', 'cobertura']) {
  const origen = join(RAIZ, `research/${doc}.md`)
  writeFileSync(
    join(CONTENIDO, `${doc}.md`),
    existsSync(origen) ? readFileSync(origen, 'utf8') : `# ${doc}\n\nDocumento pendiente.\n`,
    'utf8',
  )
}

// El informe de validación viaja al sitio para poder publicarlo tal cual.
const informe = join(RAIZ, 'research/informe-validacion.md')
writeFileSync(
  join(SALIDA, 'validacion.json'),
  JSON.stringify({ existe: existsSync(informe), texto: existsSync(informe) ? readFileSync(informe, 'utf8') : '' }),
  'utf8',
)

console.log(
  `Exportado a src/data: ${sitios.length} emplazamientos, ${companias.length} compañías, ` +
    `${regiones.length} regiones, ${red.length} nodos de red, ${renovables.length} renovables, ` +
    `${todasLasFuentes.size} fuentes distintas`,
)
db.close()
