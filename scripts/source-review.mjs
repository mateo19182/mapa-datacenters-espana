import { createHash } from 'node:crypto'

const dominio = (url) => new URL(url).hostname.replace(/^www\./, '')
export function clasificarCambios(fuentes, huellas) {
  const cambios = fuentes.filter((f) => f.cambio_pendiente).map((f) => {
    const h = huellas[f.url], p = h.pendiente
    const comparacion = p.comparacion ?? (h.hash?.startsWith('bin:') && p.hash?.startsWith('bin-sha256:')
      ? { clase: 'metodo' } : { clase: 'sin_comparacion' })
    return { url: f.url, dominio: dominio(f.url), usos: f.usos, observado: p.visto, detectado: p.detectado, comparacion }
  })
  const categorias = { contenido: 0, plantilla: 0, formato: 0, metodo: 0, sin_comparacion: 0 }
  for (const c of cambios) categorias[c.comparacion.clase] = (categorias[c.comparacion.clase] ?? 0) + 1
  const agrupados = new Map()
  for (const c of cambios) {
    const clave = ['plantilla', 'formato', 'metodo'].includes(c.comparacion.clase)
      ? `${c.dominio}|${c.comparacion.clase}|${c.comparacion.firma ?? ''}|${c.comparacion.referencia ?? ''}|${c.comparacion.fecha ?? ''}` : c.url
    if (!agrupados.has(clave)) agrupados.set(clave, {
      id: createHash('sha256').update(clave).digest('hex').slice(0, 12), dominio: c.dominio,
      clase: c.comparacion.clase, comparacion: c.comparacion, fuentes: [],
    })
    agrupados.get(clave).fuentes.push(c)
  }
  const orden = { contenido: 0, sin_comparacion: 1, metodo: 2, plantilla: 3, formato: 4 }
  return { categorias, grupos: [...agrupados.values()].sort((a, b) => orden[a.clase] - orden[b.clase] || b.fuentes.length - a.fuentes.length || a.dominio.localeCompare(b.dominio)) }
}

export function resumenSeguimiento(revision) {
  const { fuentes, revision_cambios, ...tecnica } = revision.comprobacion_automatica
  return { ...tecnica, categorias: revision_cambios.categorias, grupos: revision_cambios.grupos.length,
    revisiones_pendientes: revision.revision_factual.pendientes,
    decisiones_publicadas: revision.hallazgos.filter((h) => h.estado === 'published').length,
    decisiones_descartadas: revision.hallazgos.filter((h) => h.estado === 'discarded').length }
}

export function fusionarHistorial(base = { version: 1, ejecuciones: [] }, entrante = { version: 1, ejecuciones: [] }) {
  const corridas = new Map()
  for (const historial of [entrante, base]) {
    if (historial.version !== 1 || !Array.isArray(historial.ejecuciones)) throw new Error('Historial de fuentes incompatible')
    for (const e of historial.ejecuciones) {
      const contador = (v) => Number.isInteger(v) && v >= 0
      const resultados = ['ok', 'bloqueada', 'rota', 'error'].map((k) => e.resultados?.[k])
      const resumenValido = (r) => r && ['registradas', 'con_observacion', 'rotas', 'bloqueadas', 'errores', 'cambios_pendientes', 'grupos', 'revisiones_pendientes', 'decisiones_publicadas', 'decisiones_descartadas'].every((k) => contador(r[k])) &&
        ['contenido', 'plantilla', 'formato', 'metodo', 'sin_comparacion'].every((k) => contador(r.categorias?.[k]))
      if (typeof e.id !== 'string' || !e.id || !Number.isFinite(Date.parse(e.iniciada)) || !Number.isFinite(Date.parse(e.finalizada)) || e.finalizada < e.iniciada ||
          !['completa', 'parcial', 'fallida'].includes(e.estado) || !contador(e.comprobadas) || !contador(e.duracion_ms) ||
          !resultados.every(contador) || resultados.reduce((a, b) => a + b, 0) !== e.comprobadas || !resumenValido(e.antes) || !resumenValido(e.despues) ||
          e.comprobadas > e.despues.registradas || (e.estado === 'completa' && e.comprobadas !== e.despues.registradas)) throw new Error('Ejecución de fuentes inválida')
      corridas.set(e.id, e)
    }
  }
  return { version: 1, ejecuciones: [...corridas.values()].sort((a, b) => a.iniciada.localeCompare(b.iniciada) || a.id.localeCompare(b.id)).slice(-52) }
}

export function informeSeguimiento(historial) {
  const l = ['# Evolución de las comprobaciones', '',
    'Solo las consultas con red añaden ejecuciones. Un informe regenerado no añade resultados.',
    'Los contadores técnicos no miden precisión factual. Una caída de avisos no demuestra mejora.', '',
    '| Inicio UTC | Alcance | Consultadas | Sin resultado | Pendientes | Sin texto anterior | Plantilla o formato | Decisiones publicadas |',
    '|---|---|---|---|---|---|---|---|']
  for (const e of historial.ejecuciones.slice(-12)) {
    const d = e.despues, categorias = d.categorias
    l.push(`| ${e.iniciada} | ${e.estado} | ${e.comprobadas}/${d.registradas} | ${e.resultados.error + e.resultados.bloqueada} | ${d.cambios_pendientes} | ${categorias.sin_comparacion} | ${categorias.plantilla + categorias.formato} | ${d.decisiones_publicadas} |`)
  }
  l.push('', 'Las ejecuciones parciales no se comparan como si hubieran consultado el inventario completo.',
    'Para evaluar mejoras, revisar los cambios que terminaron en decisiones contrastadas y conservar',
    'como pruebas los errores de extracción, clasificación o integración encontrados.', '')
  return l.join('\n')
}
