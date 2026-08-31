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

// El nivel califica el respaldo de los datos centrales —dónde está, qué es, cuánta
// potencia tiene—, no cuántas fuentes hay. Una ficha con seis referencias sigue en
// baja si ninguna publica la potencia. El recuento de fuentes se muestra aparte, y
// `motivosConfianza` dice qué falla en cada ficha concreta.
export const CONFIANZA_DESCRIPCION = {
  alta: 'Ubicación, estado y potencia respaldados por fuente oficial o de la propia compañía, sin contradicciones abiertas.',
  media: 'Emplazamiento identificado y situado, pero con datos centrales incompletos o sostenidos solo por prensa especializada o consultora.',
  baja: 'Faltan datos centrales, la ubicación es imprecisa o quedan contradicciones sin resolver entre las fuentes.',
}

const PRIMARIAS = new Set(['oficial', 'empresa'])

/**
 * Qué debilita, en concreto, el respaldo de esta ficha. Se lee de la propia
 * ficha, así que nunca puede contradecir lo que muestra el resto del panel: si
 * dice «una sola fuente» es que hay una. Cuando no devuelve nada, la razón del
 * nivel no es mecánica y está escrita en las incertidumbres.
 */
export function motivosConfianza(s) {
  const motivos = []
  const fuentes = s.fuentes ?? []
  const potencia = s.potencia ?? []

  if (fuentes.length === 1) motivos.push('una sola fuente')
  else if (!fuentes.some((f) => PRIMARIAS.has(f.tipo)))
    motivos.push('ninguna fuente oficial ni de la propia compañía')

  if (potencia.length === 0) {
    motivos.push('sin ninguna cifra de potencia')
  } else {
    const respaldos = new Set(potencia.flatMap((p) => p.fuentes ?? []))
    const primaria = fuentes.some((f) => PRIMARIAS.has(f.tipo) && respaldos.has(f.id))
    if (!primaria) motivos.push('la potencia no la publica ni la compañía ni un organismo oficial')
    else if (potencia.every((p) => p.tipo === 'no_especificado'))
      motivos.push('la potencia publicada no dice de qué magnitud es')
  }

  const precision = s.ubicacion?.precision
  if (precision === 'desconocida') motivos.push('sin coordenadas')
  else if (precision === 'municipio') motivos.push('situado en el centro del municipio, sin dirección')

  return motivos
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

export const CIRCUITO_ETIQUETA = {
  cerrado: 'Circuito cerrado',
  abierto: 'Circuito abierto',
  hibrido: 'Circuito híbrido',
  sin_agua: 'Sin consumo de agua',
  desconocido: 'Circuito no publicado',
}

export const CIRCUITO_DESCRIPCION = {
  cerrado: 'El agua recircula y solo se repone lo que se pierde. Consume menos que un circuito abierto, pero no es cero.',
  abierto: 'Refrigeración evaporativa: el agua se evapora y hay que reponerla entera. Es el sistema que más consume.',
  hibrido: 'Combina disipación seca y evaporativa según la temperatura exterior, así que el consumo se concentra en verano.',
  sin_agua: 'La fuente afirma que el sistema no consume agua para refrigerar. Es una afirmación del proyecto, no una medición.',
  desconocido: 'No consta cómo se disipa el calor.',
}

export const EMPLEO_ETIQUETA = {
  directo: 'Empleo directo',
  indirecto: 'Empleo indirecto',
  construccion: 'Empleo en construcción',
  total: 'Empleo total',
  no_especificado: 'Empleo sin tipificar',
}

/** Energía anual. Se guarda en GWh; por debajo de 1 GWh se enseña en MWh. */
export function energia(n) {
  if (n == null) return null
  if (n < 1) return `${numero(n * 1000)} MWh/año`
  return `${numero(n, 1)} GWh/año`
}

/** Volumen de agua. El diario y el anual nunca se convierten uno en otro. */
export function volumen(n) {
  if (n == null) return null
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 2 })} hm³`
  return `${numero(n)} m³`
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
  empleo: 'Empleo',
  energia: 'Consumo eléctrico',
  refrigeracion_agua: 'Agua y refrigeración',
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
