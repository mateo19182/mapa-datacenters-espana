import { slug } from './etiquetas.js'

const PISTAS = [
  ['L14 REIS', 'l14-villena', 'Identificar operador y proyecto del campus de Villena'],
  ['Ponentia', 'ponentia-suelos', 'Identificar operadores para los suelos de Ponentia'],
  ['Ribera de Navarra', 'ribera-navarra', 'Identificar los promotores de la Ribera de Navarra'],
  ['Aprisco', 'aprisco-asturias', 'Localizar el proyecto de Aprisco en Asturias'],
  ['Segundo CPD del Gobierno de Navarra', 'navarra-segundo-cpd', 'Localizar el segundo CPD del Gobierno de Navarra'],
  ['CPD de la Comunidad de Madrid', 'madrid-cpd-arrendado', 'Identificar el centro arrendado por la Comunidad de Madrid'],
  ['Madrid Digital', 'madrid-cpd-arrendado', 'Identificar el centro arrendado por la Comunidad de Madrid'],
  ['MasOrange', 'masorange', 'Localizar el inventario de MasOrange', 'masorange-inventario-centros'],
  ['Quetta', 'quetta-ubicaciones', 'Identificar los emplazamientos pendientes de Quetta'],
  ['Las dos zonas', 'google-zonas-madrid', 'Localizar las zonas de Google Cloud Madrid'],
  ['Google europe-southwest1', 'google-zonas-madrid', 'Localizar las zonas de Google Cloud Madrid'],
]

export function pistasRevision(pendientes = {}) {
  const comunes = { estado: 'detected', tipo: 'proyecto', prioridad: 'media', origen: 'cobertura', fuentes: [], enlaces: [] }
  return [
    ...(pendientes.proyectos ?? []).map((p) => ({
      ...comunes,
      id: `pista-${slug(`${p.compania ?? 'sin-promotor'}-${p.municipio}`)}`,
      titulo: `${p.compania ?? 'Promotor sin identificar'} · ${p.municipio}`,
      municipio: p.municipio,
      provincia: p.provincia,
      ccaa: p.ccaa,
      compania: p.compania,
      potencia_citada: p.potencia_citada,
      prioridad: p.prioridad,
      motivo: p.nota,
      siguiente_paso: 'Confirmar emplazamiento y fuente primaria antes de abrir una ficha.',
      seguimiento: p.municipio === 'Méntrida' ? 'mentrida-venero-con09' : null,
    })),
    ...(pendientes.pistas ?? []).map((nota) => {
      const [, id, titulo, seguimiento] = PISTAS.find(([inicio]) => nota.startsWith(inicio)) ?? [null, slug(nota).slice(0, 70), 'Pista pendiente de identificar']
      return { ...comunes, id: `pista-${id}`, titulo, motivo: nota, siguiente_paso: 'Identificar la instalación y contrastar la pista con una fuente primaria.', seguimiento: seguimiento ?? null }
    }),
  ]
}

export function colaRevision({ hallazgos, pistas = [] }) {
  const entradas = hallazgos.map((h) => ({ ...h, origen: 'investigacion', antecedentes: [] }))
  const porId = new Map(entradas.map((h) => [h.id, h]))
  for (const pista of pistas) {
    const seguimiento = porId.get(pista.seguimiento)
    if (seguimiento) seguimiento.antecedentes.push(pista)
    else entradas.push({ ...pista, antecedentes: [] })
  }
  return entradas.map((h) => ({ ...h, vista: ['published', 'discarded'].includes(h.estado) ? 'historial' : 'pendientes' }))
}
