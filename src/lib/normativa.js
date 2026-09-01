// Etiquetas y ordenaciones de la sección de normativa. Como el resto de
// `etiquetas.js`: traduce los valores del esquema a castellano legible y no
// contiene ningún dato.

export const AMBITO_ETIQUETA = {
  europeo: 'Europeo',
  estatal: 'Estatal',
  autonomico: 'Autonómico',
}

export const RANGO_ETIQUETA = {
  reglamento_ue: 'Reglamento (UE)',
  reglamento_delegado_ue: 'Reglamento delegado (UE)',
  directiva_ue: 'Directiva (UE)',
  propuesta_reglamento_ue: 'Propuesta de reglamento (UE)',
  ley: 'Ley',
  real_decreto_ley: 'Real decreto-ley',
  real_decreto: 'Real decreto',
  orden_ministerial: 'Orden ministerial',
  circular: 'Circular',
  proyecto_real_decreto: 'Proyecto de real decreto',
  proyecto_ley: 'Proyecto de ley',
  anteproyecto_ley: 'Anteproyecto de ley',
  ley_autonomica: 'Ley autonómica',
  decreto_ley_autonomico: 'Decreto-ley autonómico',
  decreto_autonomico: 'Decreto autonómico',
  acuerdo_gobierno: 'Acuerdo de Gobierno',
}

export const ESTADO_NORMA_ETIQUETA = {
  en_vigor: 'En vigor',
  en_vigor_en_tramitacion: 'En vigor y en tramitación',
  audiencia_publica: 'En audiencia pública',
  en_tramitacion: 'En tramitación',
  propuesta: 'Propuesta',
  aprobada_no_aplicable: 'Aprobada, todavía no aplicable',
  derogada: 'Derogada',
  decaida: 'Decaída',
}

// Qué significa exactamente cada estado. La diferencia entre «en vigor» y
// «aprobada, todavía no aplicable» decide si una obligación obliga hoy.
export const ESTADO_NORMA_DESCRIPCION = {
  en_vigor: 'Publicada, vigente y exigible.',
  en_vigor_en_tramitacion:
    'Obliga hoy, pero su texto sigue abierto: se tramita como proyecto de ley y las Cortes pueden modificarlo.',
  audiencia_publica:
    'Borrador sometido a alegaciones. No obliga a nadie y su contenido puede cambiar entero.',
  en_tramitacion: 'En curso parlamentario o administrativo, sin aprobar.',
  propuesta: 'Presentada por quien tiene la iniciativa; sin posición de los órganos que la aprueban.',
  aprobada_no_aplicable: 'Aprobada y publicada, pero con la exigibilidad diferida a una fecha posterior.',
  derogada: 'Ya no está vigente.',
  decaida: 'Perdió vigencia sin llegar a aprobarse.',
}

// Lo que todavía puede cambiar se mira primero. Dentro de cada grupo, la ficha
// se ordena por la fecha del hito más reciente.
export const ORDEN_ESTADOS_NORMA = [
  'audiencia_publica',
  'en_tramitacion',
  'propuesta',
  'en_vigor_en_tramitacion',
  'aprobada_no_aplicable',
  'en_vigor',
  'derogada',
  'decaida',
]

export const MATERIA_ETIQUETA = {
  acceso_a_red: 'Acceso a red',
  energia: 'Energía',
  renovables: 'Renovables',
  eficiencia: 'Eficiencia',
  agua: 'Agua',
  suelo: 'Suelo y urbanismo',
  medio_ambiente: 'Medio ambiente',
  soberania_digital: 'Soberanía digital',
  transparencia: 'Transparencia',
  fiscalidad: 'Fiscalidad',
}

export const ROL_ETIQUETA = {
  promotor: 'Promueve',
  competente: 'Aplica',
  supervisor: 'Supervisa',
  consultado: 'Consultado',
  alegante: 'Alega',
  destinatario: 'Destinatario',
}

export const POSTURA_ETIQUETA = {
  favorable: 'A favor',
  critica: 'Crítica',
  contraria: 'En contra',
  neutral: 'Neutral',
  sin_constar: 'Sin postura registrada',
}

export const VINCULO_NORMA_ETIQUETA = {
  registro: 'Todo el registro',
  proyecto: 'Emplazamiento',
  region: 'Región',
  nudo: 'Nudo de red',
}

const rango = (n) => {
  const i = ORDEN_ESTADOS_NORMA.indexOf(n.estado)
  return i === -1 ? ORDEN_ESTADOS_NORMA.length : i
}

/** Fecha del hito más reciente; sirve para ordenar y para el epígrafe «última novedad». */
export const ultimoHito = (n) =>
  (n.hitos ?? []).filter((h) => !h.previsto).map((h) => h.fecha).sort().at(-1) ?? null

/** Hito comprometido más próximo que aún no ha llegado. */
export const proximoHito = (n, hoy) =>
  (n.hitos ?? [])
    .filter((h) => h.fecha >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0] ?? null

/** Lo que se mueve primero; a igualdad de estado, lo más reciente antes. */
export function ordenarNormas(normas) {
  return [...normas].sort(
    (a, b) => rango(a) - rango(b) || String(ultimoHito(b)).localeCompare(String(ultimoHito(a))),
  )
}

/** Índice inverso: qué normas afectan a un emplazamiento, región o nudo. */
export function normasQueAfectanA(normas, tipo, ref) {
  return normas
    .map((n) => {
      const vinculos = (n.afecta ?? []).filter((v) => v.tipo === tipo && v.ref === ref)
      return vinculos.length ? { norma: n, vinculos } : null
    })
    .filter(Boolean)
}
