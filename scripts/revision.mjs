// Persistent research decisions, factual review dates, and technical observations
// are separate. Observing a changed page never accepts it as a new baseline.
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import YAML from 'yaml'
import { z } from 'zod'
import { presentacionProyecto } from '../src/lib/proyecto-presentacion.js'
import { pistasRevision } from '../src/lib/revision-presentacion.js'
import { claseFallo } from './source-state.mjs'
import { clasificarCambios } from './source-review.mjs'

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s, 'Fecha inválida')
const hallazgo = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  titulo: z.string().min(5),
  tipo: z.enum(['proyecto', 'normativa', 'red', 'calidad']),
  estado: z.enum(['detected', 'awaiting_primary', 'proposed', 'published', 'discarded']),
  prioridad: z.enum(['alta', 'media', 'baja']),
  detectado: fecha,
  revisado: fecha.nullable().optional(),
  revisar_antes: fecha.nullable().optional(),
  motivo: z.string().min(10),
  siguiente_paso: z.string().min(5).nullable().optional(),
  enlaces: z.array(z.object({ href: z.string().regex(/^\/(?!\/)|^https?:\/\//), texto: z.string().min(2) })).default([]),
  fuentes: z.array(z.object({ url: z.url().refine((s) => /^https?:/.test(s)), titulo: z.string().min(3), primaria: z.boolean().default(false) })).min(1),
}).strict()
export function validarHallazgos(documento) {
  const entradas = z.array(hallazgo).parse(documento?.hallazgos ?? documento ?? [])
  const ids = entradas.map((e) => e.id)
  if (new Set(ids).size !== ids.length) throw new Error('Identificadores de hallazgo duplicados')
  for (const e of entradas) {
    if (e.revisado && e.revisado < e.detectado) throw new Error(`${e.id}: revisión anterior a detección`)
    if (e.estado === 'published' && (!e.revisado || !e.enlaces.some((x) => /^\/(proyecto|normativa)\/|^\/red-electrica/.test(x.href)))) throw new Error(`${e.id}: falta revisión o destino de publicación`)
    if (e.estado === 'proposed' && !e.fuentes.some((f) => f.primaria)) throw new Error(`${e.id}: una propuesta requiere fuente primaria`)
  }
  return entradas
}
const ultimaObservacion = (h = {}) => [h.visto, h.pendiente?.visto, h.ultimo_fallo].filter(Boolean).sort().at(-1) ?? null
export function estadoFuente(h) {
  if (!h) return null
  const exito = [h.visto, h.pendiente?.visto].filter(Boolean).sort().at(-1)
  const falloActual = h.clase && h.ultimo_fallo && (!exito || h.ultimo_fallo >= exito)
  const clase = falloActual ? (h.motivo ? claseFallo({ mensaje: h.motivo }) : h.clase) : 'viva'
  return { clase, fecha: ultimaObservacion(h), ...(falloActual ? { motivo: h.motivo } : {}), ...(h.pendiente ? { cambio_pendiente: true } : {}) }
}
export function fusionarHuellas(base, entrantes) {
  const resultado = structuredClone(base)
  for (const [url, nueva] of Object.entries(entrantes)) {
    const previa = resultado[url] ?? {}
    const siguiente = { ...previa }

    // The main branch owns the baseline. A branch can supply its first observed
    // fingerprint when none exists, but cannot accept a different one for it.
    if (!previa.hash && nueva.hash) {
      siguiente.hash = nueva.hash; siguiente.longitud = nueva.longitud; siguiente.visto = nueva.visto
    }

    const lecturas = [previa, nueva].flatMap((h) => [
      h.hash ? { hash: h.hash, longitud: h.longitud, visto: h.visto } : null,
      h.pendiente?.hash ? { ...h.pendiente, visto: h.pendiente.visto ?? h.pendiente.detectado } : null,
    ]).filter(Boolean)
    const aceptadas = lecturas.filter((l) => l.hash === siguiente.hash)
      .sort((a, b) => (b.visto ?? '').localeCompare(a.visto ?? ''))
    if (aceptadas.length) {
      siguiente.visto = aceptadas[0].visto
      if (aceptadas[0].longitud != null) siguiente.longitud = aceptadas[0].longitud
    }

    // A newer failure does not invalidate a successful content observation.
    // Date-only ties cannot establish a reversion, so keep unresolved evidence.
    const candidatas = lecturas.filter((l) => l.hash !== siguiente.hash)
      .sort((a, b) => (b.visto ?? '').localeCompare(a.visto ?? ''))
    const candidata = candidatas[0]
    if (candidata && (candidata.visto ?? '') >= (siguiente.visto ?? '')) {
      const detecciones = candidatas.filter((l) => l.hash === candidata.hash)
        .map((l) => l.detectado ?? l.visto).filter(Boolean).sort()
      const comparacion = candidatas.filter((l) => l.hash === candidata.hash && l.comparacion)
        .sort((a, b) => Number(b.comparacion.hash_referencia === siguiente.hash) - Number(a.comparacion.hash_referencia === siguiente.hash))[0]?.comparacion
      siguiente.pendiente = {
        hash: candidata.hash, longitud: candidata.longitud,
        detectado: detecciones[0], visto: candidata.visto,
        ...(comparacion ? { comparacion } : {}),
      }
      if (siguiente.pendiente.comparacion?.referencia === 'aceptada' && siguiente.pendiente.comparacion.hash_referencia !== siguiente.hash) {
        siguiente.pendiente.comparacion = { ...siguiente.pendiente.comparacion, referencia: 'observacion' }
      }
    } else delete siguiente.pendiente

    const fallo = [previa, nueva].filter((h) => h.clase && h.ultimo_fallo)
      .sort((a, b) => b.ultimo_fallo.localeCompare(a.ultimo_fallo))[0]
    const ultimoExito = [siguiente.visto, siguiente.pendiente?.visto].filter(Boolean).sort().at(-1)
    for (const k of ['clase', 'motivo', 'ultimo_fallo']) delete siguiente[k]
    if (fallo && (!ultimoExito || fallo.ultimo_fallo >= ultimoExito)) {
      for (const k of ['clase', 'motivo', 'ultimo_fallo']) if (fallo[k] != null) siguiente[k] = fallo[k]
    }
    resultado[url] = siguiente
  }
  return resultado
}
export function validarBorradoresAnadidos(antes, despues, decisiones = []) {
  const previos = validarHallazgos(antes), nuevos = validarHallazgos(despues), decididos = new Set(validarHallazgos(decisiones).map((x) => x.id))
  for (const viejo of previos) {
    const actual = nuevos.find((x) => x.id === viejo.id)
    if (!actual || JSON.stringify(actual) !== JSON.stringify(viejo)) throw new Error(`El trabajo programado no puede cambiar ni borrar ${viejo.id}`)
  }
  for (const entrada of nuevos.filter((x) => !previos.some((p) => p.id === x.id))) {
    if (decididos.has(entrada.id)) throw new Error(`Hallazgo ya registrado: ${entrada.id}`)
    if (['published', 'discarded'].includes(entrada.estado) || entrada.revisado) throw new Error(`El trabajo programado no puede resolver ${entrada.id}`)
  }
  return nuevos
}
export function plazoRevision(estado, tipo = 'proyecto') {
  if (tipo === 'normativa' && ['propuesta', 'audiencia_publica', 'en_tramitacion', 'en_vigor_en_tramitacion', 'consulta_previa', 'adoptada_en_control'].includes(estado)) return 14
  if (['en_construccion', 'ampliacion_en_construccion', 'parcialmente_operativo', 'en_tramitacion', 'permisos_concedidos'].includes(estado)) return 14
  if (estado === 'anunciado') return 30
  if (['paralizado', 'cancelado'].includes(estado)) return 180
  return 90
}
const sumarDias = (iso, dias) => new Date(Date.parse(iso) + dias * 86400000).toISOString().slice(0, 10)
export function finPeriodo(iso) {
  if (!iso || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(iso)) return null
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, d ? m - 1 : m || 12, d || 0)).toISOString().slice(0, 10)
}
export function prepararRevision(documento, { borradores = [], pendientes = {}, sitios = [], normativa = [], red = [], renovables = [], huellas = {}, hoy = new Date().toISOString().slice(0, 10) } = {}) {
  fecha.parse(hoy)
  const revisados = validarHallazgos(documento), candidatos = validarHallazgos(borradores)
  const ids = new Set(revisados.map((x) => x.id))
  const hallazgos = [...revisados, ...candidatos.filter((x) => !ids.has(x.id))].map((e) => ({ ...e, vencido: !['published', 'discarded'].includes(e.estado) && Boolean(e.revisar_antes && e.revisar_antes < hoy), candidato: !ids.has(e.id) }))
  const destinos = new Set([...sitios.map((s) => `/proyecto/${s.id}`), ...normativa.map((n) => `/normativa/${n.id}`), '/red-electrica'])
  for (const e of hallazgos) {
    if (e.detectado > hoy || e.revisado > hoy) throw new Error(`${e.id}: revisión o detección futura`)
    if (e.estado === 'published' && !e.enlaces.some((x) => destinos.has(x.href.replace(/\/$/, '')))) throw new Error(`${e.id}: destino publicado inexistente`)
  }
  const prioridad = { alta: 0, media: 1, baja: 2 }
  hallazgos.sort((a, b) => Number(['published', 'discarded'].includes(a.estado)) - Number(['published', 'discarded'].includes(b.estado)) || Number(b.vencido) - Number(a.vencido) || prioridad[a.prioridad] - prioridad[b.prioridad] || b.detectado.localeCompare(a.detectado))
  const registros = [...sitios.map((s) => ({ ...s, tipo_revision: 'proyecto', nombre_revision: s.nombre, href: `/proyecto/${s.id}` })), ...normativa.map((n) => ({ ...n, tipo_revision: 'normativa', nombre_revision: n.titulo, href: `/normativa/${n.id}` }))]
    .map((r) => { const dias = plazoRevision(r.estado, r.tipo_revision), limite = r.ultima_verificacion ? sumarDias(r.ultima_verificacion, dias) : null; return { id: r.id, nombre: r.nombre_revision, href: r.href, tipo: r.tipo_revision, estado: r.estado, ultima_revision_registrada: r.ultima_verificacion ?? null, plazo_dias: dias, revisar_antes: limite, vencida: !limite || limite < hoy } })
    .sort((a, b) => Number(b.vencida) - Number(a.vencida) || (a.revisar_antes ?? '').localeCompare(b.revisar_antes ?? ''))
  const referencias = new Map()
  for (const r of [...sitios, ...normativa, ...red, ...renovables]) for (const f of r.fuentes ?? []) {
    const url = typeof f === 'string' ? f : f.url
    if (!/^https?:/.test(url ?? '')) continue
    if (!referencias.has(url)) referencias.set(url, { url, titulo: typeof f === 'string' ? f : f.titulo, usos: [] })
    referencias.get(url).usos.push(r.id)
  }
  const fuentes = [...referencias.values()].map((f) => ({ ...f, ...estadoFuente(huellas[f.url]), comprobada: Boolean(huellas[f.url]), cambio_pendiente: Boolean(huellas[f.url]?.pendiente) }))
  const hitos = normativa.flatMap((n) => (n.hitos ?? []).filter((h) => h.previsto && finPeriodo(h.fecha) && finPeriodo(h.fecha) < hoy).map((h) => ({ id: n.id, nombre: n.titulo, href: `/normativa/${n.id}`, fecha: h.fecha, hito: h.hito, tipo: 'normativa' })))
  for (const s of sitios) {
    const previsiones = presentacionProyecto(s).cronologia.filter((h) => h.prevista && finPeriodo(h.fecha) && finPeriodo(h.fecha) < hoy)
    for (const h of previsiones) hitos.push({ id: s.id, nombre: s.nombre, href: `/proyecto/${s.id}#cronologia`, fecha: h.fecha, hito: h.titulo, tipo: 'proyecto' })
    if (!['operativo', 'ampliacion_en_construccion', 'parcialmente_operativo', 'cancelado', 'paralizado'].includes(s.estado) && s.fecha_puesta_en_servicio && finPeriodo(s.fecha_puesta_en_servicio) < hoy && !previsiones.some((h) => h.fecha === s.fecha_puesta_en_servicio)) hitos.push({ id: s.id, nombre: s.nombre, href: `/proyecto/${s.id}#cronologia`, fecha: s.fecha_puesta_en_servicio, hito: 'Puesta en servicio prevista en la ficha', tipo: 'proyecto' })
  }
  return { generado: hoy, hallazgos, pistas: pistasRevision(pendientes), revision_factual: { registros, pendientes: registros.filter((r) => r.vencida).length }, comprobacion_automatica: { fuentes, registradas: fuentes.length, con_observacion: fuentes.filter((f) => f.comprobada).length, ultima_observacion: fuentes.map((f) => f.fecha).filter(Boolean).sort().at(-1) ?? null, rotas: fuentes.filter((f) => f.clase === 'rota').length, bloqueadas: fuentes.filter((f) => f.clase === 'bloqueada').length, errores: fuentes.filter((f) => f.clase === 'error').length, cambios_pendientes: fuentes.filter((f) => f.cambio_pendiente).length, revision_cambios: clasificarCambios(fuentes, huellas) }, hitos_vencidos: hitos.sort((a, b) => a.fecha.localeCompare(b.fecha)) }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] !== '--validar-borradores') throw new Error('Uso: revision.mjs --validar-borradores research/hallazgos.yaml')
  const ruta = process.argv[3]
  const despues = YAML.parse(readFileSync(ruta, 'utf8'))
  let antes = []
  try { antes = YAML.parse(execFileSync('git', ['show', `HEAD:${ruta}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })) } catch { /* first run */ }
  const decisiones = existsSync('data/revision.yaml') ? YAML.parse(readFileSync('data/revision.yaml', 'utf8')) : []
  validarBorradoresAnadidos(antes, despues, decisiones)
  console.log('Borradores válidos: solo se han añadido candidatas sin resolver.')
}
