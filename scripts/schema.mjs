// Esquema canónico del dataset + normalización de las variantes que produce la
// investigación manual. Ver docs/ESQUEMA.md para la documentación de cada campo.
import { z } from 'zod'

export const ESTADOS = [
  'anunciado',
  'en_tramitacion',
  'permisos_concedidos',
  'en_construccion',
  'parcialmente_operativo',
  'operativo',
  'ampliacion_en_construccion',
  'paralizado',
  'cancelado',
  'desconocido',
]

// Estados que cuentan como capacidad ya en servicio, para no sumar peras con manzanas.
export const ESTADOS_EN_SERVICIO = new Set([
  'operativo',
  'parcialmente_operativo',
  'ampliacion_en_construccion',
])

export const TIPOS_POTENCIA = ['it', 'conexion_red', 'instalada_total', 'no_especificado']
export const AMBITOS = ['campus', 'edificio', 'fase']
export const PRECISIONES = ['exacta', 'aproximada', 'municipio', 'desconocida']
export const CONFIANZAS = ['alta', 'media', 'baja']
export const TIPOS_FUENTE = [
  'oficial',
  'empresa',
  'asociacion',
  'prensa_especializada',
  'consultora',
  'prensa_general',
  'otro',
]
export const MODELOS = ['hyperscale', 'colocation', 'mayorista', 'corporativo', 'edge', 'desconocido']

// --- normalización -----------------------------------------------------------

const SINONIMOS_ESTADO = {
  operacional: 'operativo',
  activo: 'operativo',
  'en operacion': 'operativo',
  'en servicio': 'operativo',
  construccion: 'en_construccion',
  'en obras': 'en_construccion',
  construyendose: 'en_construccion',
  proyectado: 'anunciado',
  planificado: 'anunciado',
  planeado: 'anunciado',
  propuesto: 'anunciado',
  tramitacion: 'en_tramitacion',
  'en_tramite': 'en_tramitacion',
  'en tramite': 'en_tramitacion',
  autorizado: 'permisos_concedidos',
  'permisos concedidos': 'permisos_concedidos',
  aprobado: 'permisos_concedidos',
  suspendido: 'paralizado',
  parado: 'paralizado',
  'en pausa': 'paralizado',
  abandonado: 'cancelado',
  ampliacion: 'ampliacion_en_construccion',
  parcial: 'parcialmente_operativo',
}

const SINONIMOS_POTENCIA = {
  'it_load': 'it',
  'carga_it': 'it',
  'ti': 'it',
  'it_mw': 'it',
  conexion: 'conexion_red',
  red: 'conexion_red',
  'grid': 'conexion_red',
  'acceso_red': 'conexion_red',
  'potencia_solicitada': 'conexion_red',
  instalada: 'instalada_total',
  total: 'instalada_total',
  'sin_especificar': 'no_especificado',
  desconocido: 'no_especificado',
  'no especificado': 'no_especificado',
}

const SINONIMOS_FUENTE = {
  gobierno: 'oficial',
  boletin: 'oficial',
  'boletin_oficial': 'oficial',
  administracion: 'oficial',
  corporativa: 'empresa',
  compania: 'empresa',
  'nota_de_prensa': 'empresa',
  prensa: 'prensa_general',
  medios: 'prensa_general',
  'prensa_regional': 'prensa_general',
  'prensa_economica': 'prensa_general',
  sectorial: 'prensa_especializada',
  analista: 'consultora',
  informe: 'consultora',
}

const slug = (v) =>
  String(v ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[\s-]+/g, '_')

const mapear = (valor, tabla, permitidos, porDefecto) => {
  if (valor == null) return porDefecto
  const s = slug(valor)
  if (permitidos.includes(s)) return s
  const conEspacios = String(valor).toLowerCase().trim()
  return tabla[s] ?? tabla[conEspacios] ?? porDefecto ?? s
}

const arr = (v) => (v == null ? [] : Array.isArray(v) ? v.filter((x) => x != null) : [v])

/** Fechas parciales ISO: 2026, 2026-08, 2026-08-29. Devuelve null si no encaja. */
const fecha = (v) => {
  if (v == null) return null
  const s = String(v).trim()
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(s)) return s
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (m) return `${m[3]}-${m[2]}-${m[1]}`
  const q = s.match(/^(?:Q([1-4])\s+)?(\d{4})$/i)
  if (q) return q[2]
  return null
}

const numero = (v) => {
  if (v == null || v === '') return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const s = String(v).replace(/\s/g, '').replace(',', '.').replace(/[^\d.eE+-]/g, '')
  const n = Number.parseFloat(s)
  return Number.isFinite(n) ? n : null
}

// --- esquemas ----------------------------------------------------------------

const zFuente = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  titulo: z.string().min(1),
  editor: z.string().nullable().optional(),
  tipo: z.enum(TIPOS_FUENTE),
  fecha_publicacion: z.string().nullable().optional(),
  fecha_consulta: z.string().nullable().optional(),
  cita: z.string().nullable().optional(),
})

const zPotencia = z.object({
  tipo: z.enum(TIPOS_POTENCIA),
  valor_mw: z.number().positive().nullable(),
  valor_mw_max: z.number().positive().nullable().optional(),
  ambito: z.enum(AMBITOS),
  referencia: z.string().nullable().optional(),
  estado_asociado: z.enum(ESTADOS).nullable().optional(),
  fecha_dato: z.string().nullable().optional(),
  fuentes: z.array(z.string()).min(1),
  nota: z.string().nullable().optional(),
})

const zFase = z.object({
  nombre: z.string().min(1),
  estado: z.enum(ESTADOS).nullable().optional(),
  fecha_puesta_en_servicio: z.string().nullable().optional(),
  superficie_m2: z.number().nullable().optional(),
  nota: z.string().nullable().optional(),
  fuentes: z.array(z.string()).default([]),
})

const zUbicacion = z.object({
  municipio: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  ccaa: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  lat: z.number().min(35.9).max(43.9).nullable(),
  lon: z.number().min(-9.4).max(3.4).nullable(),
  precision: z.enum(PRECISIONES),
  fuentes: z.array(z.string()).default([]),
})

const zIncertidumbre = z.object({
  campo: z.string().min(1),
  descripcion: z.string().min(1),
  fuentes: z.array(z.string()).default([]),
})

const zConexion = z.object({
  subestacion: z.string().nullable().optional(),
  tension_kv: z.number().nullable().optional(),
  titular_red: z.string().nullable().optional(),
  mw_solicitados: z.number().nullable().optional(),
  mw_concedidos: z.number().nullable().optional(),
  nota: z.string().nullable().optional(),
  fuentes: z.array(z.string()).default([]),
})

export const zSitio = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'el id debe ser kebab-case'),
  nombre: z.string().min(1),
  alias: z.array(z.string()).default([]),
  tipo: z.enum(['campus', 'edificio']).default('edificio'),
  operador: z.string().nullable(),
  propietario: z.string().nullable().optional(),
  cliente_ancla: z.string().nullable().optional(),
  modelo: z.enum(MODELOS).default('desconocido'),
  ubicacion: zUbicacion,
  estado: z.enum(ESTADOS),
  estado_detalle: z.string().nullable().optional(),
  estado_fuentes: z.array(z.string()).default([]),
  fecha_puesta_en_servicio: z.string().nullable().optional(),
  potencia: z.array(zPotencia).default([]),
  fases: z.array(zFase).default([]),
  conexion_electrica: zConexion.nullable().optional(),
  superficie_parcela_m2: z.number().nullable().optional(),
  superficie_construida_m2: z.number().nullable().optional(),
  inversion_anunciada_eur: z.number().nullable().optional(),
  refrigeracion: z.string().nullable().optional(),
  enlaces_proyecto: z.array(z.string()).default([]),
  incertidumbres: z.array(zIncertidumbre).default([]),
  confianza: z.enum(CONFIANZAS),
  ultima_verificacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fuentes: z.array(zFuente).min(1, 'todo emplazamiento necesita al menos una fuente'),
})

/**
 * Lleva el YAML crudo a la forma canónica antes de validar. Solo arregla forma
 * (sinónimos, tipos, listas); nunca inventa ni deduce hechos que falten.
 */
export function normalizarSitio(crudo) {
  const d = { ...crudo }

  d.alias = arr(d.alias).map(String)
  d.enlaces_proyecto = arr(d.enlaces_proyecto).map(String)
  d.estado_fuentes = arr(d.estado_fuentes).map(String)
  d.estado = mapear(d.estado, SINONIMOS_ESTADO, ESTADOS, 'desconocido')
  d.modelo = mapear(d.modelo, {}, MODELOS, 'desconocido')
  d.tipo = ['campus', 'edificio'].includes(slug(d.tipo)) ? slug(d.tipo) : 'edificio'
  d.confianza = CONFIANZAS.includes(slug(d.confianza)) ? slug(d.confianza) : 'baja'
  d.fecha_puesta_en_servicio = fecha(d.fecha_puesta_en_servicio)

  const u = d.ubicacion ?? {}
  d.ubicacion = {
    municipio: u.municipio ?? null,
    provincia: u.provincia ?? null,
    ccaa: u.ccaa ?? null,
    direccion: u.direccion ?? null,
    lat: numero(u.lat),
    lon: numero(u.lon),
    precision: PRECISIONES.includes(slug(u.precision))
      ? slug(u.precision)
      : u.lat != null
        ? 'aproximada'
        : 'desconocida',
    fuentes: arr(u.fuentes).map(String),
  }
  // Sin coordenadas no hay precisión que declarar.
  if (d.ubicacion.lat == null || d.ubicacion.lon == null) d.ubicacion.precision = 'desconocida'

  d.potencia = arr(d.potencia).map((p) => ({
    tipo: mapear(p.tipo, SINONIMOS_POTENCIA, TIPOS_POTENCIA, 'no_especificado'),
    valor_mw: numero(p.valor_mw),
    valor_mw_max: numero(p.valor_mw_max),
    ambito: AMBITOS.includes(slug(p.ambito)) ? slug(p.ambito) : 'campus',
    referencia: p.referencia ?? null,
    estado_asociado: p.estado_asociado
      ? mapear(p.estado_asociado, SINONIMOS_ESTADO, ESTADOS, 'desconocido')
      : null,
    fecha_dato: fecha(p.fecha_dato),
    fuentes: arr(p.fuentes).map(String),
    nota: p.nota ?? null,
  }))

  d.fases = arr(d.fases).map((f) => ({
    nombre: String(f.nombre ?? 'sin nombre'),
    estado: f.estado ? mapear(f.estado, SINONIMOS_ESTADO, ESTADOS, 'desconocido') : null,
    fecha_puesta_en_servicio: fecha(f.fecha_puesta_en_servicio),
    superficie_m2: numero(f.superficie_m2),
    nota: f.nota ?? null,
    fuentes: arr(f.fuentes).map(String),
  }))

  if (d.conexion_electrica) {
    const c = d.conexion_electrica
    d.conexion_electrica = {
      subestacion: c.subestacion ?? null,
      tension_kv: numero(c.tension_kv),
      titular_red: c.titular_red ?? null,
      mw_solicitados: numero(c.mw_solicitados),
      mw_concedidos: numero(c.mw_concedidos),
      nota: c.nota ?? null,
      fuentes: arr(c.fuentes).map(String),
    }
  }

  d.superficie_parcela_m2 = numero(d.superficie_parcela_m2)
  d.superficie_construida_m2 = numero(d.superficie_construida_m2)
  d.inversion_anunciada_eur = numero(d.inversion_anunciada_eur)

  d.incertidumbres = arr(d.incertidumbres).map((i) => ({
    campo: String(i.campo ?? 'general'),
    descripcion: String(i.descripcion ?? ''),
    fuentes: arr(i.fuentes).map(String),
  }))

  d.fuentes = arr(d.fuentes).map((f) => ({
    id: String(f.id),
    url: String(f.url ?? '').trim(),
    titulo: String(f.titulo ?? f.url ?? 'sin título'),
    editor: f.editor ?? null,
    tipo: mapear(f.tipo, SINONIMOS_FUENTE, TIPOS_FUENTE, 'otro'),
    fecha_publicacion: fecha(f.fecha_publicacion),
    fecha_consulta: fecha(f.fecha_consulta),
    cita: f.cita ?? null,
  }))

  return d
}

/**
 * Comprobaciones que van más allá de la forma: integridad referencial de las
 * fuentes y coherencia interna. Devuelve una lista de incidencias.
 */
export function revisarCoherencia(sitio) {
  const problemas = []
  const ids = new Set(sitio.fuentes.map((f) => f.id))

  const refs = [
    ['ubicacion.fuentes', sitio.ubicacion.fuentes],
    ['estado_fuentes', sitio.estado_fuentes],
    ...sitio.potencia.map((p, i) => [`potencia[${i}].fuentes`, p.fuentes]),
    ...sitio.fases.map((f, i) => [`fases[${i}].fuentes`, f.fuentes]),
    ...sitio.incertidumbres.map((u, i) => [`incertidumbres[${i}].fuentes`, u.fuentes]),
    ['conexion_electrica.fuentes', sitio.conexion_electrica?.fuentes ?? []],
  ]
  for (const [donde, lista] of refs) {
    for (const ref of lista) {
      if (!ids.has(ref)) problemas.push({ nivel: 'error', msg: `${donde} apunta a la fuente inexistente «${ref}»` })
    }
  }

  const duplicadas = sitio.fuentes.map((f) => f.id).filter((id, i, a) => a.indexOf(id) !== i)
  for (const id of new Set(duplicadas)) problemas.push({ nivel: 'error', msg: `id de fuente duplicado: «${id}»` })

  for (const f of sitio.fuentes) {
    if (!/^https?:\/\//.test(f.url)) problemas.push({ nivel: 'error', msg: `fuente «${f.id}» sin URL http(s)` })
  }

  if (sitio.potencia.length === 0) {
    problemas.push({ nivel: 'aviso', msg: 'sin ningún dato de potencia' })
  }
  for (const [i, p] of sitio.potencia.entries()) {
    if (p.valor_mw == null && p.valor_mw_max == null) {
      problemas.push({ nivel: 'error', msg: `potencia[${i}] no tiene ningún valor en MW` })
    }
    if (p.tipo === 'no_especificado') {
      problemas.push({ nivel: 'aviso', msg: `potencia[${i}] («${p.referencia ?? 'sin referencia'}») no distingue el tipo de MW` })
    }
  }

  if (sitio.ubicacion.lat == null) problemas.push({ nivel: 'aviso', msg: 'sin coordenadas: no aparecerá en el mapa' })
  if (!sitio.ubicacion.ccaa) problemas.push({ nivel: 'error', msg: 'sin comunidad autónoma' })
  if (sitio.estado_fuentes.length === 0) problemas.push({ nivel: 'aviso', msg: 'el estado no cita fuente' })

  const huerfanas = sitio.fuentes.filter((f) => {
    const usada = refs.some(([, lista]) => lista.includes(f.id))
    return !usada
  })
  for (const f of huerfanas) {
    problemas.push({ nivel: 'aviso', msg: `la fuente «${f.id}» no respalda ningún campo concreto` })
  }

  return problemas
}
