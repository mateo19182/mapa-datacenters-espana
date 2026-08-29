// Exporta desde SQLite los ficheros estáticos que consume el sitio Astro.
// Nada de esto se consulta en tiempo de ejecución: el sitio es estático.
import { mkdirSync, writeFileSync, existsSync, readFileSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'
import { RAIZ } from './load.mjs'
import { resumirPotencia, sumarCartera } from './potencia.mjs'
import { ESTADOS } from './schema.mjs'

// src/data alimenta las páginas en tiempo de build; public/datos se sirve tal
// cual al navegador (mapa) y es además la descarga de datos abiertos.
const SALIDA = join(RAIZ, 'src/data')
const PUBLICO = join(RAIZ, 'public/datos')
mkdirSync(SALIDA, { recursive: true })
mkdirSync(PUBLICO, { recursive: true })

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
  potencia: {
    it: sumarCartera(lista, 'it'),
    conexion_red: sumarCartera(lista, 'conexion_red'),
    instalada_total: sumarCartera(lista, 'instalada_total'),
    no_especificado: sumarCartera(lista, 'no_especificado'),
  },
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

const red = q('SELECT datos FROM red_nodos').map((r) => JSON.parse(r.datos))
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
  activos_renovables: renovables.length,
  fuentes_distintas: todasLasFuentes.size,
  emplazamientos_con_incertidumbres: sitios.filter((s) => s.incertidumbres.length > 0).length,
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
escribir('renovables.json', renovables)
escribir('fuentes.json', [...todasLasFuentes.values()].sort((a, b) => b.usos.length - a.usos.length))
escribir('resumen.json', resumen)
escribir('sitios.geojson', sitiosGeo)
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
