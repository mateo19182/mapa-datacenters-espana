// Vocabulario visible: cómo se nombra cada valor del dataset en la interfaz.

export const ESTADO_ETIQUETA = {
  anunciado: 'Anunciado',
  en_tramitacion: 'En tramitación',
  permisos_concedidos: 'Permisos concedidos',
  en_construccion: 'En construcción',
  parcialmente_operativo: 'Parcialmente operativo',
  operativo: 'Operativo',
  ampliacion_en_construccion: 'Operativo, ampliando',
  paralizado: 'Paralizado',
  cancelado: 'Cancelado',
  desconocido: 'Estado desconocido',
}

export const ORDEN_ESTADOS = [
  'operativo',
  'ampliacion_en_construccion',
  'parcialmente_operativo',
  'en_construccion',
  'permisos_concedidos',
  'en_tramitacion',
  'anunciado',
  'paralizado',
  'cancelado',
  'desconocido',
]

export const POTENCIA_ETIQUETA = {
  it: 'MW IT',
  conexion_red: 'MW de conexión',
  instalada_total: 'MW instalados',
  termica_respaldo: 'MW de grupos de respaldo',
  generacion_asociada: 'MW de generación asociada',
  no_especificado: 'MW sin tipificar',
}

// Las magnitudes que describen la capacidad del centro, en el orden en que se
// muestran. Las otras dos existen, pero no se agregan ni se comparan.
export const TIPOS_CAPACIDAD = ['it', 'conexion_red', 'instalada_total', 'no_especificado']

export const POTENCIA_DESCRIPCION = {
  it: 'La potencia que consumen los servidores. Es la única magnitud que permite comparar centros entre sí.',
  conexion_red:
    'Potencia solicitada o concedida en el punto de conexión con la red. Siempre mayor que la carga TI, porque incluye refrigeración y pérdidas.',
  instalada_total: 'Potencia eléctrica instalada del edificio, incluidos climatización y servicios auxiliares.',
  termica_respaldo:
    'Potencia de los grupos electrógenos de emergencia, según las autorizaciones ambientales, a menudo expresada como potencia térmica. Mide los motores diésel, no el centro de datos. No se agrega con nada.',
  generacion_asociada:
    'Potencia de una central de generación vinculada al emplazamiento. Es capacidad de producir electricidad, no de consumirla, y no describe el tamaño del centro.',
  no_especificado:
    'La fuente da una cifra en MW sin aclarar a qué corresponde. No se compara ni se suma con las anteriores.',
}

export const PRECISION_ETIQUETA = {
  exacta: 'Coordenadas exactas',
  aproximada: 'Coordenadas aproximadas',
  municipio: 'Situado en el centro del municipio',
  desconocida: 'Sin coordenadas',
}

export const CONFIANZA_ETIQUETA = {
  alta: 'Confianza alta',
  media: 'Confianza media',
  baja: 'Confianza baja',
}

export const CONFIANZA_DESCRIPCION = {
  alta: 'Ubicación, estado y potencia respaldados por fuente oficial o de la propia compañía, sin contradicciones abiertas.',
  media: 'Respaldado por prensa especializada o consultora, o con fuente primaria pero incompleta.',
  baja: 'Una sola fuente secundaria, datos antiguos o contradicciones sin resolver.',
}

export const FUENTE_ETIQUETA = {
  oficial: 'Oficial',
  empresa: 'Compañía',
  asociacion: 'Asociación sectorial',
  prensa_especializada: 'Prensa especializada',
  consultora: 'Consultora',
  prensa_general: 'Prensa general',
  otro: 'Otra',
}

export const MODELO_ETIQUETA = {
  hyperscale: 'Hiperescalar',
  colocation: 'Colocation',
  mayorista: 'Mayorista',
  corporativo: 'Corporativo',
  edge: 'Edge',
  desconocido: 'Sin clasificar',
}

export const VINCULO_ETIQUETA = {
  ppa: 'PPA firmado',
  autoconsumo: 'Autoconsumo',
  mismo_nudo: 'Mismo nudo eléctrico',
  mismo_promotor: 'Mismo promotor',
  declarado_para_cpd: 'Declarado para centros de datos',
}

/** Nombres legibles para el campo al que apunta una incertidumbre. */
export const CAMPO_ETIQUETA = {
  potencia: 'Potencia',
  ubicacion: 'Ubicación',
  ubicación: 'Ubicación',
  estado: 'Estado',
  fases: 'Fases',
  operador: 'Operador',
  propietario: 'Propietario',
  refrigeracion: 'Refrigeración',
  refrigeración: 'Refrigeración',
  agua: 'Consumo de agua',
  inversion_anunciada_eur: 'Inversión anunciada',
  inversion: 'Inversión anunciada',
  superficie_parcela_m2: 'Superficie de parcela',
  superficie_construida_m2: 'Superficie construida',
  superficie: 'Superficie',
  conexion_electrica: 'Conexión eléctrica',
  fecha_puesta_en_servicio: 'Puesta en servicio',
  tipo: 'Tipo de instalación',
  identidad: 'Identidad del proyecto',
  general: 'General',
}

export const campoLegible = (campo) =>
  CAMPO_ETIQUETA[campo] ??
  String(campo ?? '')
    .replace(/_(eur|m2|mw|kv)$/i, '')
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** Fechas ISO parciales a texto legible: 2024 · marzo de 2024 · 12 de marzo de 2024 */
export function fechaLegible(iso) {
  if (!iso) return null
  const p = String(iso).split('-')
  if (p.length === 1) return p[0]
  const mes = MESES[Number(p[1]) - 1] ?? ''
  if (p.length === 2) return `${mes} de ${p[0]}`
  return `${Number(p[2])} de ${mes} de ${p[0]}`
}

export const numero = (n, decimales = 0) =>
  n == null ? null : n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: decimales })

export function euros(n) {
  if (n == null) return null
  if (n >= 1e9) return `${(n / 1e9).toLocaleString('es-ES', { maximumFractionDigits: 2 })} mil millones €`
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 1 })} millones €`
  return `${numero(n)} €`
}

export function superficie(n) {
  if (n == null) return null
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 2 })} km²`
  return `${numero(n)} m²`
}

export const slug = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
