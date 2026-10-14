import { createHash } from 'node:crypto'
import fuentes from '../data/fuentes.json' with { type: 'json' }
import sitios from '../data/sitios.json' with { type: 'json' }
import { FUENTE_ETIQUETA, POTENCIA_ETIQUETA, ESTADO_ETIQUETA, ORDEN_ESTADOS, campoLegible, slug } from './etiquetas.js'
import { ETAPAS_CAPACIDAD } from './capacidad.js'
import { ordenarReferencias } from './referencias-render.js'
const nombres = new Map(sitios.map((s) => [s.id, s.nombre]))
const dominio = (url) => { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'Dominio desconocido' } }
const fuentesItems = fuentes.map((f) => ({
  id: `fuente-${createHash('sha256').update(f.url).digest('hex').slice(0, 16)}`,
  dataset: { busca: `${f.titulo} ${f.editor ?? ''} ${dominio(f.url)} ${f.usos.map((id) => nombres.get(id) ?? id).join(' ')}`, titulo: f.titulo, tipo: f.tipo, enlace: f.enlace?.clase ?? 'sin-comprobar', publicacion: f.fecha_publicacion ?? '', consulta: f.fecha_consulta ?? '', editor: f.editor ?? dominio(f.url) },
  contenido: { url: f.url, titulo: f.titulo, editor: f.editor, dominio: dominio(f.url), consulta: f.fecha_consulta, publicacion: f.fecha_publicacion, cita: f.cita, tipo: FUENTE_ETIQUETA[f.tipo], acceso: { rota: 'Enlace roto', bloqueada: 'Bloquea al comprobador', 'sin-comprobar': 'Sin comprobar' }[f.enlace?.clase ?? 'sin-comprobar'], usos: f.usos.map((id) => ({ id, nombre: nombres.get(id) ?? id })) },
}))
const entradas = sitios.flatMap((s) => s.incertidumbres.map((u, i) => ({
  id: `${s.id}-${slug(u.campo)}-${i + 1}`,
  dataset: { busca: `${s.nombre} ${s.operador ?? ''} ${s.ubicacion.ccaa ?? ''} ${campoLegible(u.campo)} ${u.descripcion}`, nombre: s.nombre, operador: s.operador ?? '', region: s.ubicacion.ccaa ?? '', etiqueta: campoLegible(u.campo), campo: slug(campoLegible(u.campo)), estado: s.estado, verificacion: s.ultima_verificacion ?? '' },
  contenido: { sitio: s.id, nombre: s.nombre, etiqueta: campoLegible(u.campo), descripcion: u.descripcion, estado: ESTADO_ETIQUETA[s.estado], fuentes: u.fuentes.map((id) => s.fuentes.find((f) => f.id === id)).filter(Boolean).map((f) => ({ url: f.url, nombre: f.editor ?? f.titulo })) },
})))
export const gruposIncertidumbres = [...new Set(entradas.map((e) => e.dataset.etiqueta))].map((etiqueta) => ({ etiqueta, ancla: slug(etiqueta), n: entradas.filter((e) => e.dataset.etiqueta === etiqueta).length })).sort((a, b) => b.n - a.n)
const configuraciones = {
  fuentes: {
    titulo: 'Fuentes', descripcion: 'Busca las referencias del registro por título, editor, dominio, tipo y estado del enlace.', porPagina: 25, items: ordenarReferencias(fuentesItems, 'titulo'),
    filtros: [{ nombre: 'tipo', etiqueta: 'Tipo de fuente', opciones: Object.entries(FUENTE_ETIQUETA).filter(([t]) => fuentes.some((f) => f.tipo === t)).map(([valor, etiqueta]) => ({ valor, etiqueta })) }, { nombre: 'enlace', etiqueta: 'Estado del enlace', opciones: [{ valor: 'viva', etiqueta: 'Responde' }, { valor: 'rota', etiqueta: 'Enlace roto' }, { valor: 'bloqueada', etiqueta: 'Bloquea al comprobador' }, { valor: 'sin-comprobar', etiqueta: 'Sin comprobar' }] }],
    ordenes: [{ valor: 'titulo', etiqueta: 'Título' }, { valor: 'publicacion', etiqueta: 'Publicación más reciente', direccion: 'desc' }, { valor: 'consulta', etiqueta: 'Consulta más reciente', direccion: 'desc' }, { valor: 'editor', etiqueta: 'Editor' }],
  },
  incertidumbres: {
    titulo: 'Incertidumbres', descripcion: 'Contradicciones y datos que faltan en los centros de datos registrados, con explicación y fuentes.', porPagina: 20, items: ordenarReferencias(entradas, 'nombre'),
    filtros: [{ nombre: 'campo', etiqueta: 'Dato afectado', opciones: gruposIncertidumbres.map((g) => ({ valor: g.ancla, etiqueta: `${g.etiqueta} (${g.n})` })) }, { nombre: 'estado', etiqueta: 'Estado del proyecto', opciones: ORDEN_ESTADOS.filter((e) => entradas.some((u) => u.dataset.estado === e)).map((e) => ({ valor: e, etiqueta: ESTADO_ETIQUETA[e] })) }],
    ordenes: [{ valor: 'nombre', etiqueta: 'Proyecto' }, { valor: 'etiqueta', etiqueta: 'Dato afectado' }, { valor: 'verificacion', etiqueta: 'Verificación más reciente', direccion: 'desc' }],
  },
}
export const datosReferencias = (tipo) => configuraciones[tipo]
export const indiceReferencias = (tipo) => {
  const items = configuraciones[tipo].items.map((item) => {
    const { busca, ...dataset } = item.dataset
    const contenido = { ...item.contenido }
    for (const clave of tipo === 'fuentes' ? ['titulo', 'consulta', 'publicacion'] : ['nombre', 'etiqueta']) delete contenido[clave]
    return { id: item.id, dataset, contenido }
  })
  return { tipo, version: createHash('sha256').update(JSON.stringify(items)).digest('hex').slice(0, 16), items }
}
export const saludFuentes = { total: fuentes.length, comprobadas: fuentes.filter((f) => f.enlace).length, rotas: fuentes.filter((f) => f.enlace?.clase === 'rota').length, bloqueadas: fuentes.filter((f) => f.enlace?.clase === 'bloqueada').length }
export const coberturaIncertidumbres = { sitios: sitios.length, afectados: new Set(entradas.map((e) => e.contenido.sitio)).size }

export const discrepanciasPotencia = sitios.flatMap((s) => Object.entries(s.potencia_por_etapa ?? { publicada: s.resumen_potencia }).flatMap(([etapa, potencias]) => Object.entries(potencias).filter(([, r]) => r?.discrepancia).map(([tipo, r]) => ({ sitio: s.id, nombre: s.nombre, etapa: ETAPAS_CAPACIDAD[etapa] ?? 'Publicada sin desglose', tipo: POTENCIA_ETIQUETA[tipo] ?? tipo, minimo: r.minimo_observado, maximo: r.maximo_observado }))))
