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
  no_especificado: 'MW sin tipificar',
}

export const POTENCIA_DESCRIPCION = {
  it: 'Carga TI: la potencia que consumen los servidores. Es la magnitud que permite comparar centros de datos entre sí.',
  conexion_red:
    'Potencia solicitada o concedida en el punto de conexión con la red eléctrica. Siempre mayor que la carga TI e incluye refrigeración y pérdidas.',
  instalada_total: 'Potencia eléctrica instalada del edificio, incluidos climatización y servicios auxiliares.',
  no_especificado:
    'La fuente da una cifra en MW sin aclarar a qué corresponde. No es comparable con las anteriores y no se suma con ellas.',
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
