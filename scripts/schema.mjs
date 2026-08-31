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

export const TIPOS_POTENCIA = [
  'it',
  'conexion_red',
  'instalada_total',
  // Magnitudes que aparecen en los expedientes ambientales y que NO son
  // capacidad del centro de datos. Se registran porque son el único dato
  // numérico publicado de muchos proyectos, pero jamás entran en un agregado.
  'termica_respaldo',
  'generacion_asociada',
  'no_especificado',
]

// Tipos que sí describen la capacidad del centro de datos.
export const TIPOS_CAPACIDAD = ['it', 'conexion_red', 'instalada_total', 'no_especificado']
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

// Cómo se disipa el calor. `sin_agua` es una afirmación fuerte y solo se pone
// cuando la fuente lo dice: no es el valor por defecto de lo que se desconoce.
export const CIRCUITOS_AGUA = ['cerrado', 'abierto', 'hibrido', 'sin_agua', 'desconocido']

export const TIPOS_EMPLEO = ['directo', 'indirecto', 'construccion', 'total', 'no_especificado']

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
  termica: 'termica_respaldo',
  mwt: 'termica_respaldo',
  grupos_electrogenos: 'termica_respaldo',
  respaldo: 'termica_respaldo',
  generacion: 'generacion_asociada',
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

const SINONIMOS_CIRCUITO = {
  circuito_cerrado: 'cerrado',
  closed_loop: 'cerrado',
  circuito_abierto: 'abierto',
  evaporativo: 'abierto',
  torres_de_refrigeracion: 'abierto',
  mixto: 'hibrido',
  hibrida: 'hibrido',
  aire: 'sin_agua',
  seco: 'sin_agua',
  free_cooling: 'sin_agua',
  sin_consumo_de_agua: 'sin_agua',
}

const SINONIMOS_EMPLEO = {
  empleo_directo: 'directo',
  explotacion: 'directo',
  operacion: 'directo',
  fijo: 'directo',
  empleo_indirecto: 'indirecto',
  inducido: 'indirecto',
  obra: 'construccion',
  temporal: 'construccion',
  durante_la_construccion: 'construccion',
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
  // Algunas fuentes dan MVA (potencia aparente). No se convierte a MW: haría
  // falta el factor de potencia, que no se publica. Se registra tal cual.
  valor_mva: z.number().positive().nullable().optional(),
  // Cuando una fuente da la capacidad ACUMULADA a cada hito («25 MW a cierre de
  // 2027, 45 MW en 2028»), sus cifras no se suman entre sí: se toma la mayor.
  acumulado: z.boolean().optional(),
  ambito: z.enum(AMBITOS),
  // Identifica la unidad física a la que se refiere la cifra. Solo se suman
  // entre sí los registros de ámbito `edificio` que nombran unidades DISTINTAS.
  // Sin este campo, varias cifras de un mismo edificio se tratan como lecturas
  // rivales y se toma la más reciente: nunca se suman.
  edificio: z.string().nullable().optional(),
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
  // Veta situar el punto en el centroide municipal. Se marca cuando la fuente
  // dice que el emplazamiento NO está en el casco urbano: colocarlo ahí sería
  // contradecir a la propia fuente.
  no_derivar: z.boolean().optional(),
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

// El agua es la magnitud que más se discute públicamente y la que peor se
// publica. Se registra el consumo tal y como lo da la fuente —diario o anual—
// y NUNCA se convierte de uno a otro: la conversión exige suponer días de
// operación a plena carga, que es justo lo que no consta.
const zAgua = z.object({
  circuito: z.enum(CIRCUITOS_AGUA),
  sistema: z.string().nullable().optional(),
  origen: z.string().nullable().optional(),
  consumo_m3_ano: z.number().nonnegative().nullable().optional(),
  consumo_m3_dia: z.number().nonnegative().nullable().optional(),
  // Water Usage Effectiveness, en litros por kWh, si la fuente lo publica.
  wue_l_kwh: z.number().nonnegative().nullable().optional(),
  nota: z.string().nullable().optional(),
  fuentes: z.array(z.string()).default([]),
})

// Cifras de empleo anunciadas, no verificadas contra registro laboral alguno.
// Se separan por tipo porque mezclar el empleo de obra con el de explotación
// multiplica por diez la cifra que se acaba citando.
const zEmpleo = z.object({
  tipo: z.enum(TIPOS_EMPLEO),
  valor: z.number().nonnegative(),
  referencia: z.string().nullable().optional(),
  fecha_dato: z.string().nullable().optional(),
  fuentes: z.array(z.string()).min(1),
  nota: z.string().nullable().optional(),
})

// Consumo eléctrico anual. Es la magnitud que más aparece en los expedientes
// ambientales y no cabe en `potencia[]`: son energía y potencia, y mezclarlas
// produce disparates. Va en GWh/año; la comprobación de cita ya tolera que la
// fuente lo publique en MWh, porque prueba también la cifra multiplicada por mil.
const zEnergia = z.object({
  consumo_gwh_ano: z.number().nonnegative(),
  referencia: z.string().nullable().optional(),
  fecha_dato: z.string().nullable().optional(),
  fuentes: z.array(z.string()).min(1),
  nota: z.string().nullable().optional(),
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
  agua: zAgua.nullable().optional(),
  empleo: z.array(zEmpleo).default([]),
  energia: z.array(zEnergia).default([]),
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

  // Que no conste el operador es un hecho legítimo, no un error de forma.
  d.operador = d.operador ?? null
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
    no_derivar: u.no_derivar === true,
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
    valor_mva: numero(p.valor_mva),
    acumulado: p.acumulado === true,
    ambito: AMBITOS.includes(slug(p.ambito)) ? slug(p.ambito) : 'campus',
    edificio: p.edificio ?? null,
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

  if (d.agua) {
    const a = d.agua
    d.agua = {
      circuito: mapear(a.circuito, SINONIMOS_CIRCUITO, CIRCUITOS_AGUA, 'desconocido'),
      sistema: a.sistema ?? null,
      origen: a.origen ?? null,
      consumo_m3_ano: numero(a.consumo_m3_ano),
      consumo_m3_dia: numero(a.consumo_m3_dia),
      wue_l_kwh: numero(a.wue_l_kwh),
      nota: a.nota ?? null,
      fuentes: arr(a.fuentes).map(String),
    }
  }

  d.energia = arr(d.energia).map((e) => ({
    consumo_gwh_ano: numero(e.consumo_gwh_ano),
    referencia: e.referencia ?? null,
    fecha_dato: fecha(e.fecha_dato),
    fuentes: arr(e.fuentes).map(String),
    nota: e.nota ?? null,
  }))

  d.empleo = arr(d.empleo).map((e) => ({
    tipo: mapear(e.tipo, SINONIMOS_EMPLEO, TIPOS_EMPLEO, 'no_especificado'),
    valor: numero(e.valor),
    referencia: e.referencia ?? null,
    fecha_dato: fecha(e.fecha_dato),
    fuentes: arr(e.fuentes).map(String),
    nota: e.nota ?? null,
  }))

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
/**
 * ¿Aparece el número en el texto? Tolera los formatos con que se escribe la
 * misma cifra: coma o punto decimal, separador de millares, GW en vez de MW.
 */
function cifraEnTexto(valor, texto) {
  if (valor == null || !texto) return false
  // El mismo texto admite dos lecturas y no se puede saber cuál es sin mirar:
  // «1.234» son mil doscientos treinta y cuatro en español y uno coma algo en
  // inglés. Se prueban las dos. Leer solo la española daba por no respaldada
  // cualquier cifra decimal escrita a la inglesa, que es como publican el WUE
  // casi todos los operadores.
  const lecturas = [
    texto.replace(/[.\u00a0\u202f]/g, '').replace(/,/g, '.'), // punto de millares
    texto.replace(/[,\u00a0\u202f]/g, ''), // coma de millares, punto decimal
  ]
  const candidatos = new Set()
  const anotar = (n) => {
    if (n == null || !Number.isFinite(n)) return
    // Solo se admite una variante si sigue representando el mismo número. Sin
    // esta guarda, redondear 0,0009 daba el candidato «0», que casa con el cero
    // de cualquier cifra del texto y daba por respaldado casi todo.
    const admitir = (c) => {
      if (c == null) return
      const leido = Number.parseFloat(c)
      if (!Number.isFinite(leido)) return
      if (n === 0 ? leido !== 0 : leido === 0) return
      candidatos.add(c)
    }
    admitir(String(n))
    if (Math.abs(n) >= 1) admitir(String(Math.round(n)))
    admitir(n.toFixed(1))
    admitir(n.toFixed(2))
  }
  anotar(valor)
  anotar(valor / 1000) // la fuente puede darlo en GW
  anotar(valor * 1000)
  for (const c of candidatos) {
    const escapado = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const patron = new RegExp(`(^|[^\\d.])${escapado}([^\\d]|$)`)
    if (lecturas.some((l) => patron.test(l))) return true
  }
  return false
}

export function revisarCoherencia(sitio) {
  const problemas = []
  const ids = new Set(sitio.fuentes.map((f) => f.id))
  const porId = new Map(sitio.fuentes.map((f) => [f.id, f]))

  const refs = [
    ['ubicacion.fuentes', sitio.ubicacion.fuentes],
    ['estado_fuentes', sitio.estado_fuentes],
    ...sitio.potencia.map((p, i) => [`potencia[${i}].fuentes`, p.fuentes]),
    ...sitio.fases.map((f, i) => [`fases[${i}].fuentes`, f.fuentes]),
    ...sitio.incertidumbres.map((u, i) => [`incertidumbres[${i}].fuentes`, u.fuentes]),
    ['conexion_electrica.fuentes', sitio.conexion_electrica?.fuentes ?? []],
    ['agua.fuentes', sitio.agua?.fuentes ?? []],
    ...(sitio.empleo ?? []).map((e, i) => [`empleo[${i}].fuentes`, e.fuentes]),
    ...(sitio.energia ?? []).map((e, i) => [`energia[${i}].fuentes`, e.fuentes]),
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
    if (p.valor_mw == null && p.valor_mw_max == null && p.valor_mva == null) {
      problemas.push({ nivel: 'error', msg: `potencia[${i}] no tiene ningún valor de potencia` })
    }
    if (p.tipo === 'no_especificado') {
      problemas.push({ nivel: 'aviso', msg: `potencia[${i}] («${p.referencia ?? 'sin referencia'}») no distingue el tipo de MW` })
    }
    // La cita es el único mecanismo por el que un tercero puede comprobar una
    // cifra sin rehacer la investigación. Si la cifra no está en ella, no sirve.
    const valor = p.valor_mw ?? p.valor_mva
    const respaldan = p.fuentes.map((id) => porId.get(id)).filter(Boolean)
    const conCita = respaldan.filter((f) => f.cita)
    if (valor != null && conCita.length > 0) {
      const sostenida = conCita.some((f) => cifraEnTexto(valor, f.cita))
      if (!sostenida) {
        problemas.push({
          nivel: 'aviso',
          msg: `potencia[${i}]: la cifra ${valor} no aparece en la cita de ninguna de sus fuentes`,
        })
      }
    }
  }

  // El agua se somete a la misma exigencia que la potencia: la cifra tiene que
  // poder leerse en la cita, o no sirve para que un tercero la compruebe.
  if (sitio.agua) {
    const a = sitio.agua
    const citas = a.fuentes.map((id) => porId.get(id)).filter((f) => f?.cita)
    for (const [campo, valor] of [
      ['consumo_m3_ano', a.consumo_m3_ano],
      ['consumo_m3_dia', a.consumo_m3_dia],
      ['wue_l_kwh', a.wue_l_kwh],
    ]) {
      if (valor == null) continue
      if (a.fuentes.length === 0) {
        problemas.push({ nivel: 'error', msg: `agua.${campo} tiene valor y no cita fuente` })
      } else if (citas.length > 0 && !citas.some((f) => cifraEnTexto(valor, f.cita))) {
        problemas.push({ nivel: 'aviso', msg: `agua.${campo}: la cifra ${valor} no aparece en la cita de ninguna de sus fuentes` })
      }
    }
    // Decir que no consume agua y a la vez cuantificar el consumo es una
    // contradicción de la ficha, no de las fuentes: hay que resolverla.
    if (a.circuito === 'sin_agua' && (a.consumo_m3_ano > 0 || a.consumo_m3_dia > 0)) {
      problemas.push({ nivel: 'error', msg: 'agua: el circuito se declara sin_agua pero se registra consumo' })
    }
    // Un bloque sin cifras pero con nota sí dice algo: deja constancia de que la
    // fuente habla del agua y no la cuantifica, que es un hueco documentado y no
    // un descuido. Solo sobra cuando no queda ni eso.
    const vacio =
      a.circuito === 'desconocido' &&
      !a.sistema &&
      !a.nota &&
      a.consumo_m3_ano == null &&
      a.consumo_m3_dia == null &&
      a.wue_l_kwh == null
    if (vacio) problemas.push({ nivel: 'aviso', msg: 'bloque agua sin ningún dato: equivale a no tenerlo' })
  }

  for (const [i, e] of (sitio.energia ?? []).entries()) {
    const citas = e.fuentes.map((id) => porId.get(id)).filter((f) => f?.cita)
    if (citas.length > 0 && !citas.some((f) => cifraEnTexto(e.consumo_gwh_ano, f.cita))) {
      problemas.push({
        nivel: 'aviso',
        msg: `energia[${i}]: la cifra ${e.consumo_gwh_ano} no aparece en la cita de ninguna de sus fuentes`,
      })
    }
  }

  for (const [i, e] of (sitio.empleo ?? []).entries()) {
    const citas = e.fuentes.map((id) => porId.get(id)).filter((f) => f?.cita)
    if (citas.length > 0 && !citas.some((f) => cifraEnTexto(e.valor, f.cita))) {
      problemas.push({ nivel: 'aviso', msg: `empleo[${i}]: la cifra ${e.valor} no aparece en la cita de ninguna de sus fuentes` })
    }
    if (e.tipo === 'no_especificado') {
      problemas.push({ nivel: 'aviso', msg: `empleo[${i}] no distingue entre empleo de obra y de explotación` })
    }
  }

  if (sitio.ubicacion.lat == null) problemas.push({ nivel: 'aviso', msg: 'sin coordenadas: no aparecerá en el mapa' })
  // Que no se sepa dónde está es un hecho registrable, no un fallo de forma:
  // omitir un proyecto grande por eso sería un hueco peor que el propio hueco.
  if (!sitio.ubicacion.ccaa) {
    problemas.push({ nivel: 'aviso', msg: 'sin comunidad autónoma: no aparecerá en las vistas por región' })
  }
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
