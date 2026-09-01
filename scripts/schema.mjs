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

// Cómputo instalado. Es hardware, no potencia eléctrica: nada de este bloque
// entra en `potencia[]` ni dimensiona el punto en el mapa.
export const TIPOS_COMPUTO = [
  'gpu', // acelerador gráfico de propósito general (NVIDIA, AMD, Intel)
  'asic_ia', // silicio propio de un hyperscaler: Trainium, TPU, Maia
  'cpu_hpc', // partición de cálculo basada en CPU
  'qpu', // procesador cuántico
  'no_especificado',
]
export const UNIDADES_COMPUTO = ['acelerador', 'procesador', 'nucleo', 'qubit', 'nodo', 'no_especificado']
// Igual que en `potencia`, una cifra de ámbito `sistema` manda sobre cualquier
// suma de particiones: se entiende que el dato global ya las incluye.
export const AMBITOS_COMPUTO = ['sistema', 'particion']
// Los FLOPS no se comparan entre precisiones ni entre pico y medida: un EFlop/s
// en FP4 no es mil PFlop/s en FP64. Por eso las tres cosas viajan por separado.
export const UNIDADES_RENDIMIENTO = ['tflops', 'pflops', 'eflops']
export const TIPOS_RENDIMIENTO = ['pico', 'linpack_rmax', 'no_especificado']
export const PRECISIONES_RENDIMIENTO = ['fp64', 'fp32', 'fp16', 'fp8', 'fp4', 'no_especificado']

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

const SINONIMOS_COMPUTO = {
  gpus: 'gpu',
  acelerador: 'gpu',
  aceleradores: 'gpu',
  nvidia: 'gpu',
  asic: 'asic_ia',
  trainium: 'asic_ia',
  tpu: 'asic_ia',
  cpu: 'cpu_hpc',
  hpc: 'cpu_hpc',
  cuantico: 'qpu',
  cuantica: 'qpu',
  qubits: 'qpu',
  'no especificado': 'no_especificado',
  desconocido: 'no_especificado',
}

const SINONIMOS_UNIDAD_COMPUTO = {
  aceleradores: 'acelerador',
  gpu: 'acelerador',
  gpus: 'acelerador',
  chips: 'acelerador',
  chip: 'acelerador',
  procesadores: 'procesador',
  cpu: 'procesador',
  cpus: 'procesador',
  qubits: 'qubit',
  cubit: 'qubit',
  core: 'nucleo',
  cores: 'nucleo',
  nucleos: 'nucleo',
  cubits: 'qubit',
  nodos: 'nodo',
  servidores: 'nodo',
  servidor: 'nodo',
}

const SINONIMOS_RENDIMIENTO = {
  petaflops: 'pflops',
  'pflop/s': 'pflops',
  pflop: 'pflops',
  teraflops: 'tflops',
  'tflop/s': 'tflops',
  tflop: 'tflops',
  exaflops: 'eflops',
  'eflop/s': 'eflops',
  eflop: 'eflops',
}

const SINONIMOS_TIPO_RENDIMIENTO = {
  rpeak: 'pico',
  peak: 'pico',
  teorico: 'pico',
  rmax: 'linpack_rmax',
  linpack: 'linpack_rmax',
  hpl: 'linpack_rmax',
  medido: 'linpack_rmax',
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

// Ámbito territorial: todo el territorio español. Se comprueba contra una caja
// por territorio y no contra una sola envolvente, porque una caja que abarcara
// desde Canarias hasta Cataluña metería dentro media Marruecos y Argelia, y una
// coordenada mal transcrita caería en zona válida sin que nadie se enterase.
// El orden importa: los territorios pequeños van antes que la península, cuya
// caja se solapa con la balear por el este. Así el nombre devuelto es el útil.
export const CAJAS_ES = [
  { nombre: 'Ceuta', sur: 35.8, norte: 35.95, oeste: -5.42, este: -5.25 },
  { nombre: 'Melilla', sur: 35.24, norte: 35.34, oeste: -3.0, este: -2.9 },
  { nombre: 'Canarias', sur: 27.5, norte: 29.5, oeste: -18.3, este: -13.3 },
  { nombre: 'Baleares', sur: 38.5, norte: 40.2, oeste: 1.1, este: 4.4 },
  { nombre: 'península', sur: 35.9, norte: 43.9, oeste: -9.4, este: 3.4 },
]

/** ¿Cae el punto en alguno de los territorios españoles? */
export function territorioDe(lat, lon) {
  if (lat == null || lon == null) return null
  const c = CAJAS_ES.find((c) => lat >= c.sur && lat <= c.norte && lon >= c.oeste && lon <= c.este)
  return c ? c.nombre : null
}

const zUbicacion = z.object({
  municipio: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  ccaa: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  lat: z.number().min(27.5).max(43.9).nullable(),
  lon: z.number().min(-18.3).max(4.4).nullable(),
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

// Cómputo instalado: aceleradores, particiones de CPU y procesadores cuánticos.
// Un registro por sistema o partición. Los recuentos de registros distintos solo
// se suman si nombran sistemas distintos; y nunca se convierte una cifra de
// rendimiento entre precisiones ni entre pico y medida.
const zComputo = z.object({
  tipo: z.enum(TIPOS_COMPUTO),
  ambito: z.enum(AMBITOS_COMPUTO).default('particion'),
  sistema: z.string().nullable().optional(),
  // Quién opera el hardware. Se rellena cuando no es el operador del CPD: el
  // caso del inquilino de un centro mayorista (CoreWeave en Zona Franca).
  operador_computo: z.string().nullable().optional(),
  modelo: z.string().nullable().optional(),
  unidades: z.number().nonnegative().nullable().optional(),
  tipo_unidad: z.enum(UNIDADES_COMPUTO).default('no_especificado'),
  nodos: z.number().nonnegative().nullable().optional(),
  rendimiento: z.number().nonnegative().nullable().optional(),
  rendimiento_unidad: z.enum(UNIDADES_RENDIMIENTO).nullable().optional(),
  rendimiento_tipo: z.enum(TIPOS_RENDIMIENTO).default('no_especificado'),
  rendimiento_precision: z.enum(PRECISIONES_RENDIMIENTO).default('no_especificado'),
  estado: z.enum(ESTADOS).default('desconocido'),
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
  computo: z.array(zComputo).default([]),
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

  d.computo = arr(d.computo).map((c) => ({
    tipo: mapear(c.tipo, SINONIMOS_COMPUTO, TIPOS_COMPUTO, 'no_especificado'),
    ambito: AMBITOS_COMPUTO.includes(slug(c.ambito)) ? slug(c.ambito) : 'particion',
    sistema: c.sistema ?? null,
    operador_computo: c.operador_computo ?? null,
    modelo: c.modelo ?? null,
    unidades: numero(c.unidades),
    tipo_unidad: mapear(c.tipo_unidad, SINONIMOS_UNIDAD_COMPUTO, UNIDADES_COMPUTO, 'no_especificado'),
    nodos: numero(c.nodos),
    rendimiento: numero(c.rendimiento),
    rendimiento_unidad:
      c.rendimiento_unidad == null
        ? null
        : mapear(c.rendimiento_unidad, SINONIMOS_RENDIMIENTO, UNIDADES_RENDIMIENTO, 'pflops'),
    rendimiento_tipo: mapear(c.rendimiento_tipo, SINONIMOS_TIPO_RENDIMIENTO, TIPOS_RENDIMIENTO, 'no_especificado'),
    rendimiento_precision: mapear(c.rendimiento_precision, {}, PRECISIONES_RENDIMIENTO, 'no_especificado'),
    estado: mapear(c.estado, SINONIMOS_ESTADO, ESTADOS, 'desconocido'),
    fecha_dato: fecha(c.fecha_dato),
    fuentes: arr(c.fuentes).map(String),
    nota: c.nota ?? null,
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
function cifraEnTexto(valor, texto, { escalar = true } = {}) {
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
  // El salto de escala vale para las magnitudes que se publican en dos unidades
  // (MW/GW, PFlops/TFlops). No vale para un recuento de piezas: 4.480 GPU no las
  // respalda una cita que hable de 4.480.000 de nada.
  if (escalar) {
    anotar(valor / 1000)
    anotar(valor * 1000)
  }
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
    ...(sitio.computo ?? []).map((c, i) => [`computo[${i}].fuentes`, c.fuentes]),
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

  for (const [i, c] of (sitio.computo ?? []).entries()) {
    const citas = c.fuentes.map((id) => porId.get(id)).filter((f) => f?.cita)
    const donde = `computo[${i}]${c.sistema ? ` («${c.sistema}»)` : ''}`

    // Un registro que no dice ni cuánto hay, ni qué es, ni cuánto rinde, no
    // aporta nada que no dijera ya la ausencia del bloque.
    if (c.unidades == null && c.rendimiento == null && !c.modelo && !c.nota) {
      problemas.push({ nivel: 'error', msg: `${donde} no registra ni recuento, ni modelo, ni rendimiento` })
    }
    if (c.tipo === 'no_especificado') {
      problemas.push({ nivel: 'aviso', msg: `${donde} no distingue el tipo de cómputo` })
    }
    if (c.unidades != null && c.tipo_unidad === 'no_especificado') {
      problemas.push({ nivel: 'error', msg: `${donde} da un recuento sin decir de qué unidad` })
    }
    if (c.rendimiento != null && !c.rendimiento_unidad) {
      problemas.push({ nivel: 'error', msg: `${donde} da un rendimiento sin unidad` })
    }
    // Un FLOPS sin precisión no se puede comparar con ningún otro, así que se
    // registra pero se avisa de que la fuente no la publica.
    if (c.rendimiento != null && c.rendimiento_precision === 'no_especificado') {
      problemas.push({ nivel: 'aviso', msg: `${donde} da FLOPS sin precisión: no comparable con otras cifras` })
    }
    if (c.tipo === 'qpu' && c.tipo_unidad !== 'qubit' && c.unidades != null) {
      problemas.push({ nivel: 'aviso', msg: `${donde} es una QPU pero su recuento no está en qubits` })
    }
    // La cifra tiene que estar en la cita, igual que en potencia, agua y energía.
    if (citas.length > 0 && c.unidades != null) {
      if (!citas.some((f) => cifraEnTexto(c.unidades, f.cita, { escalar: false }))) {
        problemas.push({
          nivel: 'aviso',
          msg: `${donde}: el recuento ${c.unidades} no aparece en la cita de ninguna de sus fuentes`,
        })
      }
    }
    if (citas.length > 0 && c.rendimiento != null) {
      if (!citas.some((f) => cifraEnTexto(c.rendimiento, f.cita))) {
        problemas.push({
          nivel: 'aviso',
          msg: `${donde}: el rendimiento ${c.rendimiento} no aparece en la cita de ninguna de sus fuentes`,
        })
      }
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
  else if (territorioDe(sitio.ubicacion.lat, sitio.ubicacion.lon) == null) {
    // La caja del esquema es holgada por fuerza: abarca de Canarias a Cataluña, y
    // media Marruecos con ella. Esta comprobación descarta lo que cae fuera de
    // todos los territorios. No distingue tierra de mar —ninguna caja puede—, así
    // que caza el error de país o de signo, no el de pocos kilómetros.
    problemas.push({
      nivel: 'error',
      msg: `las coordenadas (${sitio.ubicacion.lat}, ${sitio.ubicacion.lon}) no caen en ningún territorio español`,
    })
  }
  // Que no se sepa dónde está es un hecho registrable, no un fallo de forma:
  // omitir un proyecto grande por eso sería un hueco peor que el propio hueco.
  if (!sitio.ubicacion.ccaa) {
    problemas.push({ nivel: 'aviso', msg: 'sin comunidad autónoma: no aparecerá en las vistas por región' })
  }
  if (sitio.estado_fuentes.length === 0) problemas.push({ nivel: 'aviso', msg: 'el estado no cita fuente' })

  // `confianza: alta` afirma que ubicación, estado y potencia están respaldados.
  // La ficha publica al lado, leídas de sus propios campos, las lagunas que tiene;
  // si hay alguna, la etiqueta se contradice con lo que se ve debajo y sobra una de
  // las dos. Los otros dos niveles no se comprueban: su motivo puede ser editorial
  // —una contradicción entre fuentes— y no se lee de ningún campo.
  if (sitio.confianza === 'alta') {
    const lagunas = []
    if (sitio.potencia.length === 0) lagunas.push('no tiene ninguna cifra de potencia')
    else if (sitio.potencia.every((p) => p.tipo === 'no_especificado'))
      lagunas.push('su potencia no está tipificada')
    if (sitio.ubicacion.precision === 'municipio') lagunas.push('solo está situada en su municipio')
    if (sitio.ubicacion.precision === 'desconocida') lagunas.push('no tiene coordenadas')
    if (!sitio.fuentes.some((f) => f.tipo === 'oficial' || f.tipo === 'empresa'))
      lagunas.push('no cita ninguna fuente oficial ni de la compañía')
    for (const laguna of lagunas) {
      problemas.push({ nivel: 'aviso', msg: `declara confianza alta pero ${laguna}` })
    }
  }

  const huerfanas = sitio.fuentes.filter((f) => {
    const usada = refs.some(([, lista]) => lista.includes(f.id))
    return !usada
  })
  for (const f of huerfanas) {
    problemas.push({ nivel: 'aviso', msg: `la fuente «${f.id}» no respalda ningún campo concreto` })
  }

  return problemas
}

// ---------------------------------------------------------------------------
// NORMATIVA
//
// Una norma no es un emplazamiento y no se le parece: no tiene coordenadas, no
// tiene potencia y su hecho central no es un número sino una fecha. Lo que sí
// comparte con el resto del registro es la regla: nada sin fuente, y lo que no
// consta se queda vacío.
//
// Se registran tres cosas distintas que conviene no confundir:
//   · lo que la norma DICE          → `obligaciones[]`, con su umbral y su plazo
//   · dónde está la norma AHORA     → `estado` y `hitos[]`
//   · quién la empuja y quién no    → `actores[]`, con postura y cita
// ---------------------------------------------------------------------------

export const AMBITOS_NORMA = ['europeo', 'estatal', 'autonomico']

// El rango importa porque determina quién puede cambiarla y con qué facilidad:
// un proyecto de real decreto se reescribe en una tarde de audiencia pública;
// una ley, no.
export const RANGOS_NORMA = [
  'reglamento_ue',
  'reglamento_delegado_ue',
  'directiva_ue',
  'propuesta_reglamento_ue',
  'ley',
  'real_decreto_ley',
  'real_decreto',
  'orden_ministerial',
  'circular',
  'proyecto_real_decreto',
  'proyecto_ley',
  'anteproyecto_ley',
  'ley_autonomica',
  'decreto_ley_autonomico',
  'decreto_autonomico',
  'acuerdo_gobierno',
]

// `en_vigor` y `aplicable` no son lo mismo: un reglamento europeo puede estar en
// vigor y no ser todavía exigible. Y una norma en vigor puede estar además
// tramitándose como proyecto de ley, que es el caso del RDL 7/2026.
export const ESTADOS_NORMA = [
  'en_vigor',
  'en_vigor_en_tramitacion',
  'audiencia_publica',
  'en_tramitacion',
  'propuesta',
  'aprobada_no_aplicable',
  'derogada',
  'decaida',
]

export const MATERIAS_NORMA = [
  'acceso_a_red',
  'energia',
  'renovables',
  'eficiencia',
  'agua',
  'suelo',
  'medio_ambiente',
  'soberania_digital',
  'transparencia',
  'fiscalidad',
]

// El papel de cada actor en esta norma concreta, no en abstracto: el Gobierno de
// Aragón es autoridad competente en su territorio y a la vez parte alegante en
// el real decreto estatal.
export const ROLES_ACTOR = [
  'promotor',
  'competente',
  'supervisor',
  'consultado',
  'alegante',
  'destinatario',
]

export const POSTURAS_ACTOR = ['favorable', 'critica', 'contraria', 'neutral', 'sin_constar']

// A qué parte del registro afecta la norma. Es lo que permite ir de una ficha de
// proyecto a la norma que explica su estado, y al revés.
export const VINCULOS_NORMA = ['registro', 'proyecto', 'region', 'nudo']

const zHito = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'la fecha del hito debe ser AAAA-MM-DD'),
  // Un hito futuro es una fecha comprometida en un boletín o en un anuncio
  // oficial, nunca una previsión propia.
  previsto: z.boolean().default(false),
  hito: z.string().min(1),
  fuentes: z.array(z.string()).default([]),
})

const zObligacion = z.object({
  quien: z.string().min(1),
  que: z.string().min(1),
  // El umbral se copia tal como lo expresa la norma. 1 MW de potencia de acceso
  // y 500 kW de potencia de TI son dos umbrales distintos que no se traducen
  // uno al otro, igual que no se convierten los MW del registro.
  umbral: z.string().nullable().optional(),
  plazo: z.string().nullable().optional(),
  fuentes: z.array(z.string()).default([]),
})

const zActor = z.object({
  nombre: z.string().min(1),
  rol: z.enum(ROLES_ACTOR),
  postura: z.enum(POSTURAS_ACTOR).default('sin_constar'),
  // Quién habla dentro de la organización, cuando la fuente lo identifica.
  voz: z.string().nullable().optional(),
  resumen: z.string().nullable().optional(),
  cita: z.string().nullable().optional(),
  fuentes: z.array(z.string()).default([]),
})

const zVinculo = z.object({
  tipo: z.enum(VINCULOS_NORMA),
  // Identificador dentro del registro: id de emplazamiento, nombre de comunidad
  // o nombre de nudo. Vacío cuando el vínculo es con el registro entero.
  ref: z.string().nullable().optional(),
  como: z.string().min(1),
  fuentes: z.array(z.string()).default([]),
})

export const zNorma = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'el id debe ser kebab-case'),
  // Nombre corto para listas y navegación; `titulo_oficial` es el del boletín.
  titulo: z.string().min(1),
  titulo_oficial: z.string().nullable().optional(),
  ambito: z.enum(AMBITOS_NORMA),
  ccaa: z.array(z.string()).default([]),
  rango: z.enum(RANGOS_NORMA),
  estado: z.enum(ESTADOS_NORMA),
  estado_detalle: z.string().nullable().optional(),
  boletin: z.string().nullable().optional(),
  referencia: z.string().nullable().optional(),
  url_oficial: z.string().url().nullable().optional(),
  fecha_aprobacion: z.string().nullable().optional(),
  fecha_publicacion: z.string().nullable().optional(),
  fecha_entrada_vigor: z.string().nullable().optional(),
  materias: z.array(z.enum(MATERIAS_NORMA)).default([]),
  resumen: z.string().min(1),
  // Qué cambia esto en el mapa. Es la única frase de la ficha que interpreta, y
  // por eso va en un campo aparte y no mezclada con lo que dice la norma.
  por_que_importa: z.string().nullable().optional(),
  obligaciones: z.array(zObligacion).default([]),
  hitos: z.array(zHito).default([]),
  actores: z.array(zActor).default([]),
  afecta: z.array(zVinculo).default([]),
  // Otras normas de este mismo registro: la que habilita, la que desarrolla, la
  // que transpone.
  relacionadas: z.array(z.string()).default([]),
  incertidumbres: z.array(zIncertidumbre).default([]),
  ultima_verificacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fuentes: z.array(zFuente).min(1, 'toda norma necesita al menos una fuente'),
})

const lista = (v) => (v == null ? [] : Array.isArray(v) ? v : [v])

/** Igual que `normalizarSitio`: arregla forma, nunca completa hechos. */
export function normalizarNorma(crudo) {
  const d = { ...crudo }
  d.ccaa = lista(d.ccaa)
  d.materias = lista(d.materias)
  d.relacionadas = lista(d.relacionadas)
  for (const campo of ['obligaciones', 'hitos', 'actores', 'afecta', 'incertidumbres', 'fuentes']) {
    d[campo] = lista(d[campo])
  }
  d.hitos = d.hitos.map((h) => ({ ...h, fuentes: lista(h.fuentes) }))
  d.obligaciones = d.obligaciones.map((o) => ({ ...o, fuentes: lista(o.fuentes) }))
  d.actores = d.actores.map((a) => ({ ...a, fuentes: lista(a.fuentes) }))
  d.afecta = d.afecta.map((v) => ({ ...v, fuentes: lista(v.fuentes) }))
  d.incertidumbres = d.incertidumbres.map((u) => ({ ...u, fuentes: lista(u.fuentes) }))
  return d
}

/** Comprobaciones que el esquema no puede hacer solo. */
export function revisarCoherenciaNorma(norma) {
  const problemas = []
  const ids = new Set(norma.fuentes.map((f) => f.id))

  const refs = [
    ...norma.hitos.map((h, i) => [`hitos[${i}]`, h.fuentes]),
    ...norma.obligaciones.map((o, i) => [`obligaciones[${i}]`, o.fuentes]),
    ...norma.actores.map((a, i) => [`actores[${i}]`, a.fuentes]),
    ...norma.afecta.map((v, i) => [`afecta[${i}]`, v.fuentes]),
    ...norma.incertidumbres.map((u, i) => [`incertidumbres[${i}]`, u.fuentes]),
  ]
  for (const [campo, usadas] of refs) {
    for (const f of usadas) {
      if (!ids.has(f)) problemas.push({ nivel: 'error', msg: `${campo} cita la fuente inexistente «${f}»` })
    }
  }

  // Una postura atribuida a alguien sin cita literal es un resumen de un
  // periodista, no una declaración. Se admite, pero se señala.
  for (const a of norma.actores) {
    if (a.postura !== 'sin_constar' && !a.cita) {
      problemas.push({ nivel: 'aviso', msg: `la postura de «${a.nombre}» no tiene cita literal que la sostenga` })
    }
    if (!a.fuentes.length) {
      problemas.push({ nivel: 'aviso', msg: `el actor «${a.nombre}» no cita ninguna fuente` })
    }
  }

  // Un proyecto de norma que ya tiene fecha de entrada en vigor está mal
  // clasificado, o la fecha es una previsión que no debería estar ahí.
  const enProyecto = ['audiencia_publica', 'en_tramitacion', 'propuesta']
  if (enProyecto.includes(norma.estado) && norma.fecha_entrada_vigor) {
    problemas.push({ nivel: 'aviso', msg: 'está en tramitación pero declara fecha de entrada en vigor' })
  }
  if (norma.estado.startsWith('en_vigor') && !norma.fecha_publicacion) {
    problemas.push({ nivel: 'aviso', msg: 'consta en vigor pero no tiene fecha de publicación' })
  }
  if (norma.ambito === 'autonomico' && norma.ccaa.length === 0) {
    problemas.push({ nivel: 'error', msg: 'una norma autonómica tiene que decir de qué comunidad es' })
  }
  if (norma.ambito !== 'autonomico' && norma.ccaa.length > 0) {
    problemas.push({ nivel: 'aviso', msg: 'declara comunidad autónoma sin ser una norma autonómica' })
  }

  const huerfanas = norma.fuentes.filter((f) => !refs.some(([, l]) => l.includes(f.id)))
  for (const f of huerfanas) {
    problemas.push({ nivel: 'aviso', msg: `la fuente «${f.id}» no respalda ningún campo concreto` })
  }

  return problemas
}
