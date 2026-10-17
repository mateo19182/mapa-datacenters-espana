// Both the public queue and the Markdown report use prepararRevision's snapshot.
const celda = (valor) => String(valor ?? 'Sin fecha').replaceAll('|', '\\|').replaceAll('\n', ' ')
const fila = (valores) => `| ${valores.map(celda).join(' | ')} |`

export function informeFuentes(revision, { huellas = {} } = {}) {
  const { comprobacion_automatica: tecnica, revision_factual: factual } = revision
  const registros = new Map(factual.registros.map((r) => [r.id, r]))
  const nombre = (ids) => ids.map((id) => registros.get(id)?.nombre ?? id).join(', ')
  const prioridad = (fuente) => fuente.usos.some((id) => registros.get(id)?.vencida) ? 0 : 1
  const ordenar = (a, b) => prioridad(a) - prioridad(b) || a.url.localeCompare(b.url)
  const fuentes = [...tecnica.fuentes].sort(ordenar)
  const cambios = fuentes.filter((f) => f.cambio_pendiente)
  const pendientes = factual.registros.filter((r) => r.vencida)
  const ultima = tecnica.ultima_observacion
  const l = [
    '# Cola de revisión de fuentes', '',
    `Informe generado el ${revision.generado}. Última observación técnica: ${ultima ?? 'sin fecha'}.`,
    'Usa la misma instantánea y los mismos plazos que `/datos/revision.json`.',
    'Las observaciones técnicas no renuevan las fechas de revisión factual.', '',
    `- Referencias registradas: **${tecnica.registradas}**; con observación: **${tecnica.con_observacion}**.`,
    `- Referencias observadas el ${ultima ?? 'día sin registrar'}: **${fuentes.filter((f) => f.fecha && f.fecha === ultima).length}**. Las demás conservan su fecha propia.`,
    `- Cambios de contenido pendientes: **${tecnica.cambios_pendientes}**.`,
    `- Respuestas 404 o 410: **${tecnica.rotas}**.`,
    `- Bloqueadas para el comprobador: **${tecnica.bloqueadas}**.`,
    `- Fallos de conexión, tiempo o servidor: **${tecnica.errores}**.`,
    `- Fichas pendientes de revisión: **${factual.pendientes}** de ${factual.registros.length}, incluidos proyectos y normas.`,
    `- Hitos previstos vencidos: **${revision.hitos_vencidos.length}**.`, '',
  ]
  if (cambios.length) {
    l.push('## Contenido pendiente de revisión', '',
      'Primero se muestran las fuentes de fichas que ya necesitan revisión factual.',
      'La variación de tamaño no determina si un cambio afecta a los hechos.', '',
      '| Fuente | Registros | Observado | Detectado | Comparación |', '|---|---|---|---|---|')
    for (const f of cambios) {
      const h = huellas[f.url], p = h?.pendiente
      const primeraHuella = h?.hash?.startsWith('bin:') && p?.hash?.startsWith('bin-sha256:')
      const delta = p && Number.isFinite(h.longitud) && Number.isFinite(p.longitud) ? p.longitud - h.longitud : null
      const comparacion = primeraHuella ? 'Primera huella del archivo; cambio sin confirmar' : delta == null ? 'Contenido distinto' : `${delta >= 0 ? '+' : ''}${delta} ${p.hash?.startsWith('bin-sha256:') ? 'bytes' : 'caracteres'}`
      l.push(fila([f.url, nombre(f.usos), p?.visto, p?.detectado, comparacion]))
    }
    l.push('')
  }
  for (const [clase, titulo, explicacion] of [
    ['rota', 'Respuestas de recurso no encontrado', 'El servidor respondió 404 o 410. Buscar la URL actual o una copia con el mismo contenido antes de cambiar la referencia.'],
    ['bloqueada', 'Acceso bloqueado al comprobador', 'La respuesta no permite verificar el contenido. No confirma que el enlace funcione o falle en un navegador.'],
    ['error', 'Comprobación sin resultado', 'Un fallo de red, tiempo o servidor no demuestra que la página haya desaparecido. Reintentar o revisar en un navegador.'],
  ]) {
    const items = fuentes.filter((f) => f.clase === clase)
    if (!items.length) continue
    l.push(`## ${titulo}`, '', explicacion, '', '| Fuente | Registros | Observación | Motivo |', '|---|---|---|---|')
    for (const f of items) l.push(fila([f.url, nombre(f.usos), f.fecha, f.motivo]))
    l.push('')
  }
  if (pendientes.length) {
    l.push('## Revisión factual pendiente', '',
      'Plazos por actividad: 14 días para obras, trámites y normas abiertas; 30 para anuncios;',
      '90 para instalaciones operativas y normas vigentes; 180 para proyectos paralizados o cancelados.',
      'Son prioridades editoriales, no vencimientos administrativos.', '',
      '| Registro | Estado | Última revisión factual | Revisar antes de |', '|---|---|---|---|')
    for (const r of pendientes) l.push(fila([`${r.nombre} (${r.id})`, r.estado, r.ultima_revision_registrada, r.revisar_antes]))
    l.push('')
  }
  if (revision.hitos_vencidos.length) {
    l.push('## Previsiones vencidas', '', '| Fecha prevista | Registro | Hito |', '|---|---|---|')
    for (const h of revision.hitos_vencidos) l.push(fila([h.fecha, h.nombre, h.hito]))
    l.push('')
  }
  l.push('Tras contrastar los hechos, actualizar la ficha y su fecha factual. Aceptar una',
    'huella de contenido requiere revisión explícita con `npm run refresh -- --aceptar "URL"`.', '')
  return l.join('\n')
}

export function requiereRevision(revision) {
  const tecnica = revision.comprobacion_automatica
  return Boolean(tecnica.cambios_pendientes || tecnica.rotas || tecnica.errores || revision.revision_factual.pendientes || revision.hitos_vencidos.length)
}
