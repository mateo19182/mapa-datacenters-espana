// Rótulos de navegación. El título oficial y el contenido siguen en la ficha.
const TITULOS = {
  'prd-centros-datos-sostenibles': 'Proyecto de decreto de centros de datos',
  'propuesta-cada-2026': 'CADA: propuesta europea de nube e IA',
  'rdl-7-2026': 'Reserva de capacidad y acceso: RDL 7/2026',
  'rdl-18-2026': 'Ajustes del acceso: RDL 18/2026',
  'rd-1183-2020': 'Acceso y conexión: RD 1183/2020',
  'rd-640-2026': 'Inversión en redes: RD 640/2026',
  'circular-1-2024-cnmc': 'Acceso de demanda: Circular CNMC 1/2024',
  'directiva-2023-1791': 'Eficiencia energética: Directiva 2023/1791',
  'reglamento-delegado-2024-1364': 'Indicadores: Reglamento delegado 2024/1364',
  'aragon-decreto-ley-1-2008': 'DIGA y PIGA: Decreto-ley 1/2008 de Aragón',
  'aragon-ley-5-2024': 'Renovables y proyectos prioritarios: Ley 5/2024 de Aragón',
  'cataluna-acuerdo-gov-64-2025': 'Marco de CPD en Cataluña: Acuerdo GOV/64/2025',
}

export const tituloNorma = (norma) => {
  const propuesta = ['audiencia_publica', 'en_tramitacion', 'propuesta'].includes(norma.estado)
  if (['prd-centros-datos-sostenibles', 'propuesta-cada-2026'].includes(norma.id) && !propuesta) return norma.titulo
  return TITULOS[norma.id] ?? norma.titulo
}

// Resúmenes de navegación; los requisitos y sus fuentes siguen en cada ficha.
const EFECTOS = {
  'prd-centros-datos-sostenibles': 'Requisitos de renovables, eficiencia y soberanía ligados al acceso a la red.',
  'propuesta-cada-2026': 'Zonas de aceleración, permisos facilitados y garantías de soberanía cloud.',
  'rdl-7-2026': 'Crea el pago mensual por reservar capacidad y nuevos hitos de caducidad.',
  'rdl-18-2026': 'Ajusta el cómputo del impago y los plazos de caducidad de permisos.',
  'rd-1183-2020': 'Regula permisos de acceso y conexión, prelación temporal y concursos.',
  'rd-640-2026': 'Regula la aprobación y ejecución de inversiones en transporte y distribución.',
  'circular-1-2024-cnmc': 'Regula el cálculo de capacidad y su publicación mensual por nudo.',
  'directiva-2023-1791': 'Exige información anual de energía, agua y flexibilidad de los CPD.',
  'reglamento-delegado-2024-1364': 'Fija indicadores, medición de PUE y WUE y comunicación de datos desde 500 kW IT.',
  'aragon-decreto-ley-1-2008': 'Permite tramitación preferente mediante DIGA y PIGA.',
  'aragon-ley-5-2024': 'Da prioridad a proyectos con generación renovable asociada en Aragón.',
  'cataluna-acuerdo-gov-64-2025': 'Habilita la tramitación urbanística especial de proyectos de interés general superior.',
  'consulta-estandares-minimos-centros-datos-2026': 'Iniciativa sobre estándares mínimos de rendimiento de los CPD.',
  'prd-calor-residual-2026': 'Evaluación y aprovechamiento del calor residual; viabilidad técnica y económica.',
  'reglamento-etiquetado-centros-datos-2026': 'Etiquetas por centro para eficiencia energética y uso del agua.',
  'resolucion-acceso-flexible-demanda-2026': 'Permite acceso condicionado a reducciones o desconexiones, por modalidades.',
}

const abreviar = (texto = '', maximo = 90) => texto.length <= maximo
  ? texto
  : `${texto.slice(0, maximo - 1).replace(/\s+\S*$/, '')}…`

export const efectoNorma = (norma) => EFECTOS[norma.id] ?? abreviar(norma.por_que_importa || norma.resumen)

const HITOS_BREVES = {
  'aragon-decreto-ley-1-2008:2026-08-29': 'Diez promotores esperan declaración de interés autonómico',
  'aragon-ley-5-2024:2025-05-08': 'Primera aplicación al proyecto Royal de ICT Ibérica',
  'cataluna-acuerdo-gov-64-2025:2026-04-14': 'El Govern identifica 26 posibles proyectos',
  'circular-1-2024-cnmc:2026-09-01': 'Inicio del acceso flexible, con implantación por modalidades',
  'consulta-estandares-minimos-centros-datos-2026:2026-09-21': 'Apertura de consulta y solicitud de datos',
  'directiva-2023-1791:2026-09-21': 'Adopción del acto de etiquetado, pendiente de control',
  'prd-calor-residual-2026:2026-06-17': 'Cierre del segundo plazo de audiencia',
  'prd-centros-datos-sostenibles:2026-09-22': 'Informe de la CNMC sobre el borrador',
  'propuesta-cada-2026:2026-09-17': 'Remisión a comisión para primera lectura',
  'rd-1183-2020:2026-03-22': 'Sustitución de avales por la prestación de reserva',
  'rd-640-2026:2026-07-31': 'Publicación en el BOE',
  'rdl-18-2026:2026-07-23': 'Convalidación del Congreso',
  'rdl-7-2026:2026-08-27': 'Audiencia del proyecto de decreto de CPD',
  'reglamento-delegado-2024-1364:2026-09-21': 'Adopción del acto de modificación, todavía sin entrar en vigor',
  'reglamento-etiquetado-centros-datos-2026:2026-10-07': 'Remisión a comisión en el Parlamento',
  'resolucion-acceso-flexible-demanda-2026:2026-09-01': 'Inicio de efectos generales, con aplicación por modalidades',
  'consulta-estandares-minimos-centros-datos-2026:2026-12-14': 'Cierre de aportaciones sobre estándares mínimos',
  'resolucion-acceso-flexible-demanda-2026:2028-01-01': 'Límite para habilitar el acceso flexible de tipo 2',
  'resolucion-acceso-flexible-demanda-2026:2029-01-01': 'Fin de la restricción transitoria del tipo 3',
}

export const etiquetaHitoNorma = (norma, hito) => HITOS_BREVES[`${norma.id}:${hito.fecha}`] ?? abreviar(hito.hito)

export function calendarioNormas(normas, hoy) {
  const eventos = normas.flatMap((norma) => (norma.hitos ?? [])
    .filter((hito) => hito.fecha > hoy)
    .map((hito) => ({ ...hito, etiqueta: etiquetaHitoNorma(norma, hito), normas: [norma] })))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
  const resultado = []
  const parEtiquetado = new Set(['reglamento-delegado-2024-1364', 'reglamento-etiquetado-centros-datos-2026'])
  const urls = (evento) => evento.normas[0].fuentes
    .filter((fuente) => evento.fuentes.includes(fuente.id)).map((fuente) => fuente.url)
  const primeraEtiqueta = (evento) => parEtiquetado.has(evento.normas[0].id)
    && /primera emisión de etiquetas/i.test(evento.hito)
  for (const evento of eventos) {
    const duplicado = primeraEtiqueta(evento) && resultado.find((previo) => primeraEtiqueta(previo)
      && previo.fecha === evento.fecha
      && previo.normas[0].id !== evento.normas[0].id
      && urls(previo).some((url) => urls(evento).includes(url)))
    if (duplicado) {
      duplicado.normas.push(...evento.normas)
      duplicado.etiqueta = 'Primera emisión de etiquetas, sujeta a entrada en vigor'
    } else resultado.push(evento)
  }
  return resultado
}
