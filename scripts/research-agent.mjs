// Guards and bounded memory for the local research worker. It can propose
// evidence; only reviewed data on main can settle a factual decision.
import { closeSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, openSync, readFileSync, readSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import YAML from 'yaml'
import { prepararRevision, validarBorradoresAnadidos, validarHallazgos } from './revision.mjs'
import { integrarPropuestas } from './apply-proposals.mjs'
import { normalizarSitio, revisarCoherencia, zSitio } from './schema.mjs'

const json = (p, fallback = null) => existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback
const yaml = (p, fallback = []) => existsSync(p) ? YAML.parse(readFileSync(p, 'utf8')) : fallback
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
export const rutaPermitida = (p) => ['research/revision-semanal.md', 'research/hallazgos.yaml'].includes(p) || /^research\/propuestas-revision\/[a-z0-9]+(?:-[a-z0-9]+)*\.yaml$/.test(p)

function archivoRegular(root, path) {
  let current = root
  for (const part of path.split('/')) {
    current = join(current, part)
    if (!existsSync(current) || lstatSync(current).isSymbolicLink()) return false
  }
  return lstatSync(current).isFile()
}

export function archivarEntrega(root, output, base) {
  const paths = new Set([
    ...git(root, 'diff', '--name-only', '-z', base).split('\0'),
    ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0'),
    'research/revision-semanal.md',
  ].filter((p) => rutaPermitida(p)))
  const archived = [], skipped = []
  for (const path of paths) {
    if (!archivoRegular(root, path)) { skipped.push(path); continue }
    const destination = join(output, 'entrega', path)
    mkdirSync(join(destination, '..'), { recursive: true })
    cpSync(join(root, path), destination)
    archived.push(path)
    if (path === 'research/revision-semanal.md') cpSync(join(root, path), join(output, 'revision-semanal.md'))
  }
  const result = { archived, skipped }
  writeFileSync(join(output, 'entrega.json'), JSON.stringify(result, null, 2) + '\n')
  return result
}

export function cambiosInvestigacion(root) {
  const records = git(root, 'status', '--porcelain=v1', '-z', '--untracked-files=all').split('\0').filter(Boolean)
  const paths = []
  for (const record of records) {
    const status = record.slice(0, 2), path = record.slice(3)
    if (/[RC]/.test(status) || /D/.test(status)) throw new Error(`Renombre, copia o borrado no permitido: ${JSON.stringify(path)}`)
    if (!rutaPermitida(path)) throw new Error(`Cambio fuera del alcance: ${JSON.stringify(path)}`)
    let current = root
    for (const part of path.split('/')) {
      current = join(current, part)
      if (lstatSync(current).isSymbolicLink()) throw new Error(`Enlace simbólico no permitido: ${JSON.stringify(path)}`)
    }
    if (!lstatSync(join(root, path)).isFile()) throw new Error(`No es un archivo regular: ${path}`)
    paths.push(path)
  }
  return paths
}

export function instantaneaInvestigacion(root) {
  const directory = join(root, 'research/propuestas-revision')
  const propuestas = existsSync(directory) ? Object.fromEntries(readdirSync(directory).filter((n) => n.endsWith('.yaml')).map((n) => [n, readFileSync(join(directory, n), 'utf8')])) : {}
  return { hallazgos: yaml(join(root, 'research/hallazgos.yaml')), propuestas, informe: existsSync(join(root, 'research/revision-semanal.md')) ? readFileSync(join(root, 'research/revision-semanal.md'), 'utf8') : null }
}

export function recuperarInvestigacion(root, ref) {
  const base = git(root, 'merge-base', 'HEAD', ref).trim()
  const previous = (path, fallback = null) => {
    try { return git(root, 'show', `${base}:${path}`) } catch { return fallback }
  }
  const paths = git(root, 'ls-tree', '-rz', ref, '--', 'research').split('\0').filter(Boolean)
  let restored = 0
  for (const row of paths) {
    const [metadata, path] = row.split('\t')
    if (!rutaPermitida(path)) continue
    if (!metadata.startsWith('100644 ') && !metadata.startsWith('100755 ')) throw new Error(`Material previo no regular: ${path}`)
    let content = git(root, 'show', `${ref}:${path}`)
    if (path === 'research/hallazgos.yaml') {
      const currentDoc = yaml(join(root, path)), current = validarHallazgos(currentDoc)
      const old = validarHallazgos(YAML.parse(previous(path, '[]')))
      const incoming = validarHallazgos(YAML.parse(content))
      const known = new Map(current.map((e) => [e.id, e]))
      const reviewed = new Set(validarHallazgos(yaml(join(root, 'data/revision.yaml'))).map((e) => e.id))
      for (const entry of incoming) {
        const original = old.find((e) => e.id === entry.id)
        if (original && JSON.stringify(original) === JSON.stringify(entry)) continue
        const existing = known.get(entry.id)
        if (existing && JSON.stringify(existing) !== JSON.stringify(entry)) throw new Error(`Conflicto entre main y el PR pendiente: ${entry.id}. Ambas versiones se conservan en sus ramas.`)
        if (!existing && !reviewed.has(entry.id)) known.set(entry.id, entry)
      }
      const merged = [...known.values()]
      validarBorradoresAnadidos(currentDoc, merged, yaml(join(root, 'data/revision.yaml')))
      if (JSON.stringify(current) === JSON.stringify(merged)) continue
      content = YAML.stringify(Array.isArray(currentDoc) ? merged : { ...currentDoc, hallazgos: merged })
    } else if (path.startsWith('research/propuestas-revision/')) {
      const original = previous(path)
      if (content === original) continue
      if (existsSync(join(root, path))) {
        if (readFileSync(join(root, path), 'utf8') !== content) throw new Error(`Propuesta distinta en main y el PR pendiente: ${path}`)
        continue
      }
      if (original !== null) throw new Error(`Propuesta previa modificada en el PR pendiente: ${path}`)
    }
    mkdirSync(join(root, path, '..'), { recursive: true })
    writeFileSync(join(root, path), content)
    restored++
  }
  return restored
}

export function validarEntrega(root, antes) {
  const paths = cambiosInvestigacion(root)
  const despues = instantaneaInvestigacion(root)
  const decisiones = yaml(join(root, 'data/revision.yaml'))
  const findings = validarBorradoresAnadidos(antes.hallazgos, despues.hallazgos, decisiones)
  // Use the public queue's date checks as well as its append-only draft guard.
  prepararRevision([], { borradores: findings })
  for (const [name, content] of Object.entries(antes.propuestas)) {
    if (despues.propuestas[name] !== content) throw new Error(`Propuesta anterior modificada o borrada: ${name}`)
  }
  const nuevas = Object.keys(despues.propuestas).filter((n) => !(n in antes.propuestas))
  const simulation = mkdtempSync(join(tmpdir(), 'mapa-research-validation-'))
  let resultado
  try {
    mkdirSync(join(simulation, 'data/propuestas'), { recursive: true })
    mkdirSync(join(simulation, 'research'), { recursive: true })
    cpSync(join(root, 'data/sites'), join(simulation, 'data/sites'), { recursive: true })
    for (const name of nuevas) {
      const proposal = YAML.parse(despues.propuestas[name])
      if (!proposal || typeof proposal !== 'object' || Array.isArray(proposal)) throw new Error(`Propuesta inválida: ${name}`)
      if (proposal.id && proposal.id !== name.slice(0, -5)) throw new Error(`Identificador y archivo distintos: ${name}`)
      const previous = yaml(join(root, 'data/sites', name), {})
      zSitio.partial().strict().parse({ ...proposal, ...(proposal.ubicacion ? { ubicacion: { ...previous.ubicacion, ...proposal.ubicacion } } : {}) })
      writeFileSync(join(simulation, 'data/propuestas', name), despues.propuestas[name])
    }
    // The integration occurs in a disposable directory. Even additions await a reviewer.
    const log = console.log
    try { console.log = () => {}; resultado = integrarPropuestas({ raiz: simulation, aplicar: true }) } finally { console.log = log }
    for (const name of nuevas) {
      const candidate = join(simulation, 'data/sites', name)
      const sitio = zSitio.parse(normalizarSitio(yaml(candidate)))
      const errors = revisarCoherencia(sitio).filter((p) => p.nivel === 'error')
      if (errors.length) throw new Error(`${name}: ${errors.map((e) => e.msg).join('; ')}`)
    }
  } finally { rmSync(simulation, { recursive: true, force: true }) }
  const changed = despues.informe !== antes.informe || JSON.stringify(despues.hallazgos) !== JSON.stringify(antes.hallazgos) || nuevas.length > 0
  return { paths, changed, findings: findings.length - validarHallazgos(antes.hallazgos).length, proposals: nuevas.length, conflicts: resultado.conflictos.length, checks: { scope: 'ok', previous_decisions: 'ok', proposal_schema: 'ok', simulation: 'ok' } }
}

export function prioridades(entries, hoy, limit = 12) {
  const priority = { alta: 0, media: 1, baja: 2 }
  const sevenDays = new Date(Date.parse(hoy) - 7 * 86400000).toISOString().slice(0, 10)
  return entries.filter((e) => !['published', 'discarded'].includes(e.estado)).sort((a, b) =>
    Number(Boolean(b.revisar_antes && b.revisar_antes <= hoy)) - Number(Boolean(a.revisar_antes && a.revisar_antes <= hoy)) ||
    priority[a.prioridad] - priority[b.prioridad] || Number(b.detectado >= sevenDays) - Number(a.detectado >= sevenDays) ||
    (a.revisar_antes ?? '9999').localeCompare(b.revisar_antes ?? '9999') || a.id.localeCompare(b.id)).slice(0, limit)
}

export function memoriaBusqueda(text, limit = 12000) {
  const sections = text.split(/(?=^#{1,6}\s)/m)
  const relevant = sections.filter((s) => {
    const heading = s.split('\n', 1)[0].normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
    return /busqued|sin resultado|descart|condicion|reintent|leccion|aprendiz|grafo|tramit|vigencia/.test(heading)
  })
  return relevant.map((s) => s.slice(0, 4500)).join('\n').slice(0, limit)
}

export function contextoInvestigacion(root, state, hoy = new Date().toISOString().slice(0, 10)) {
  const decisions = validarHallazgos(yaml(join(root, 'data/revision.yaml')))
  const drafts = validarHallazgos(yaml(join(root, 'research/hallazgos.yaml')))
  const ids = new Set(decisions.map((e) => e.id))
  const entries = [...decisions, ...drafts.filter((e) => !ids.has(e.id))]
  const lines = ['# Contexto para la investigación', '', `Fecha de ejecución: ${hoy}. Este contexto no autoriza cambios de estado o aceptación de hechos.`, '', '## Pendientes priorizados', '']
  for (const e of prioridades(entries, hoy)) lines.push(`- ${e.id} | ${e.estado} | ${e.prioridad} | revisar ${e.revisar_antes ?? 'sin plazo'} | ${e.titulo}\n  ${e.motivo}\n  Siguiente paso: ${e.siguiente_paso ?? 'Revisar evidencia primaria'}`)
  lines.push('', '## Decisiones recientes que no deben duplicarse', '')
  for (const e of entries.filter((e) => ['published', 'discarded'].includes(e.estado)).sort((a, b) => (b.revisado ?? '').localeCompare(a.revisado ?? '')).slice(0, 12)) lines.push(`- ${e.id} | ${e.estado} | ${e.revisado ?? 'sin fecha'} | ${e.titulo}: ${e.motivo}`)
  for (const path of ['research/revision-semanal.md', 'research/informe-evolucion-fuentes.md', 'research/informe-actualizacion.md', 'research/informe-ree.md']) {
    if (existsSync(join(root, path))) {
      const text = readFileSync(join(root, path), 'utf8')
      lines.push('', `## Memoria de búsquedas y condiciones: ${path}`, '', memoriaBusqueda(text), '', `## Extracto inicial: ${path}`, '', text.slice(0, 7000))
    }
  }
  const reviews = join(root, 'research/revisiones')
  if (existsSync(reviews)) for (const file of readdirSync(reviews).filter((n) => /^\d{4}-\d{2}-\d{2}.*normativa.*\.md$/.test(n)).sort().slice(-2)) {
    lines.push('', `## Revisión normativa reciente: ${file}`, '', memoriaBusqueda(readFileSync(join(reviews, file), 'utf8'), 6000))
  }
  const history = json(join(state, 'history.json'), []).slice(-5)
  const monitoring = json(join(root, 'data/seguimiento-fuentes.json'), { ejecuciones: [] })
  lines.push('', '## Evolución técnica reciente', '', JSON.stringify((monitoring.ejecuciones ?? []).slice(-6).map((e) => ({ id: e.id, iniciada: e.iniciada, estado: e.estado, comprobadas: e.comprobadas, despues: { registradas: e.despues?.registradas, rotas: e.despues?.rotas, bloqueadas: e.despues?.bloqueadas, errores: e.despues?.errores, cambios_pendientes: e.despues?.cambios_pendientes, categorias: e.despues?.categorias } })), null, 2))
  lines.push('', '## Ejecuciones anteriores', '', JSON.stringify(history, null, 2))
  for (const entry of history.slice(-3)) {
    const previous = join(state, entry.run_id, 'revision-semanal.md')
    if (existsSync(previous)) {
      const text = readFileSync(previous, 'utf8')
      lines.push('', `## Búsquedas anteriores ${entry.run_id}`, '', memoriaBusqueda(text, 8000), '', `## Informe anterior ${entry.run_id}`, '', text.slice(0, 4000))
    }
  }
  lines.push('', 'No repitas búsquedas fallidas o descartadas sin nueva publicación, documento, fecha prometida alcanzada u otro motivo concreto. Registra ese motivo si reabres la pista. Distingue diferencias sustantivas, plantillas repetidas, migración de método PDF y falta de texto histórico. Una cola más corta no demuestra mayor exactitud factual.')
  return lines.join('\n').slice(0, 90000)
}

export function revisionMensualPendiente(state, now) {
  return !json(join(state, 'history.json'), []).some((r) => r.monthly && ['proposed', 'no_changes'].includes(r.status) && r.started_at?.slice(0, 7) === now.slice(0, 7))
}

export function terminarEjecucion(state, runDir, values, keep = 30) {
  const validation = json(join(runDir, 'validacion.json'), {})
  const record = { schema_version: 1, run_id: basename(runDir), ...values, finished_at: new Date().toISOString(), counts: { findings: validation.findings ?? 0, proposals: validation.proposals ?? 0, conflicts: validation.conflicts ?? 0 }, checks: validation.checks ?? {} }
  record.duration_seconds = Math.max(0, Math.round((Date.parse(record.finished_at) - Date.parse(record.started_at)) / 1000))
  record.truncated_files = []
  for (const name of ['codex.log', 'cambios.diff', 'resultado.txt', 'preparacion.log', 'publicacion.log', 'validacion.log']) {
    const path = join(runDir, name), limit = 4 * 1024 * 1024
    if (!existsSync(path) || lstatSync(path).size <= limit) continue
    const fd = openSync(path, 'r'), tail = Buffer.alloc(limit)
    try { readSync(fd, tail, 0, limit, lstatSync(path).size - limit) } finally { closeSync(fd) }
    writeFileSync(path, Buffer.concat([Buffer.from('[Registro recortado: se conservan los últimos 4 MiB]\n'), tail]))
    record.truncated_files.push(name)
  }
  writeFileSync(join(runDir, 'ejecucion.json'), JSON.stringify(record, null, 2) + '\n', { mode: 0o600 })
  const history = [...json(join(state, 'history.json'), []).filter((r) => r.run_id !== record.run_id), record].slice(-keep)
  writeFileSync(join(state, 'history.json'), JSON.stringify(history, null, 2) + '\n', { mode: 0o600 })
  const retained = new Set(history.map((r) => r.run_id))
  for (const dir of readdirSync(state)) {
    if (/^run\.[a-zA-Z0-9]+$/.test(dir) && !retained.has(dir) && lstatSync(join(state, dir)).isDirectory() && !lstatSync(join(state, dir)).isSymbolicLink() && !existsSync(join(state, dir, 'checkout')) && json(join(state, dir, 'ejecucion.json'), {}).archive_status !== 'failed') rmSync(join(state, dir), { recursive: true, force: true })
  }
  return record
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command, root, output, extra] = process.argv.slice(2)
  if (command === 'snapshot') writeFileSync(output, JSON.stringify(instantaneaInvestigacion(root)))
  else if (command === 'archive') console.log(JSON.stringify(archivarEntrega(root, output, extra)))
  else if (command === 'monthly') console.log(revisionMensualPendiente(root, output) ? 'true' : 'false')
  else if (command === 'recover') console.log(recuperarInvestigacion(root, output))
  else if (command === 'context') writeFileSync(output, contextoInvestigacion(root, extra))
  else if (command === 'validate') console.log(JSON.stringify(validarEntrega(root, json(output))))
  else if (command === 'finish') console.log(JSON.stringify(terminarEjecucion(root, output, json(extra))))
  else throw new Error('Uso: research-agent.mjs snapshot|context|validate|finish ROOT OUTPUT [STATE|METADATA]')
}
