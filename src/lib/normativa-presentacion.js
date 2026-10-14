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
