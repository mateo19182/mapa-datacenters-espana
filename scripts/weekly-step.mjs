import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const EXPECTED = { fuentes: [0, 10], ree: [0, 10], propuestas: [0, 11], validacion: [0] }
export function resultadoPaso(nombre, codigo, error = null) {
  if (!(nombre in EXPECTED)) throw new Error(`Comprobación desconocida: ${nombre}`)
  return { estado: !error && EXPECTED[nombre].includes(codigo) ? codigo === 0 ? 'ok' : 'pendiente' : 'error', codigo, ...(error ? { error } : {}) }
}

export function ejecutarPaso(nombre, comando, { directory = 'build/monitorizacion', spawn = spawnSync } = {}) {
  if (!(nombre in EXPECTED) || !comando.length) throw new Error('Uso: weekly-step.mjs fuentes|ree|propuestas|validacion -- COMANDO ...')
  const started = Date.now()
  mkdirSync(join(directory, 'pasos'), { recursive: true })
  const result = spawn(comando[0], comando.slice(1), { encoding: 'utf8', timeout: 20 * 60 * 1000, maxBuffer: 16 * 1024 * 1024 })
  const status = { version: 1, nombre, iniciada: new Date(started).toISOString(), finalizada: new Date().toISOString(), duracion_ms: Date.now() - started, ...resultadoPaso(nombre, result.status, result.error?.code ?? result.signal) }
  writeFileSync(join(directory, 'pasos', `${nombre}.log`), (result.stdout ?? '') + (result.stderr ?? ''))
  writeFileSync(join(directory, 'pasos', `${nombre}.json`), JSON.stringify(status, null, 2) + '\n')
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  if (status.estado === 'error') process.stderr.write(`${nombre}: comprobación incompleta. Consultar build/monitorizacion/pasos/${nombre}.log\n`)
  return status
}

export function resumenSemanal(env = process.env, directory = 'build/monitorizacion') {
  const names = ['recuperar', 'fuentes', 'ree', 'propuestas', 'validacion']
  const outcomes = Object.fromEntries(names.map((name) => [name, env[`OUTCOME_${name.toUpperCase()}`] || 'no ejecutada']))
  const failures = names.filter((name) => outcomes[name] !== 'success')
  if (env.OUTCOME_PR === 'failure') failures.push('publicacion_pr')
  const lines = ['## Revisión semanal', '', '| Comprobación | Resultado |', '|---|---|']
  for (const name of names) {
    const path = join(directory, 'pasos', `${name}.json`)
    const detail = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null
    lines.push(`| ${name} | ${detail ? `${detail.estado}; código ${detail.codigo ?? 'sin resultado'}` : outcomes[name]} |`)
  }
  const restorePath = join(directory, 'restauracion-texto.json')
  if (existsSync(restorePath)) {
    const restore = JSON.parse(readFileSync(restorePath, 'utf8'))
    const label = restore.estado === 'cache' ? 'Texto anterior recuperado de caché.' : restore.estado === 'sin_respaldo' ? 'Arranque sin respaldo anterior: las fuentes sin texto histórico quedan sin comparación.' : restore.estado === 'seleccionado' && env.OUTCOME_DESCARGA === 'success' ? `Texto anterior restaurado del run ${restore.run_id}.` : 'Falló la restauración de texto anterior; no se inventa una comparación histórica.'
    lines.push('', label)
  }
  if (env.OUTCOME_COPIA_TEXTO === 'failure') lines.push('', 'No se pudo guardar el respaldo de instantáneas. Revisar este fallo antes de la próxima ejecución semanal.')
  lines.push('', env.OUTCOME_PR === 'skipped' ? 'PR omitido: simulación manual o validación/recuperación incompleta.' : `Publicación del PR: ${env.OUTCOME_PR || 'no ejecutada'}.`)
  if (/^https:\/\/github\.com\//.test(env.PR_URL ?? '')) lines.push(`[Propuesta técnica](${env.PR_URL}).`)
  const summaryPath = join(directory, 'ejecucion.json')
  if (existsSync(summaryPath)) {
    const run = JSON.parse(readFileSync(summaryPath, 'utf8'))
    lines.push('', `Fuentes comprobadas: ${run.comprobadas ?? 'sin dato'}. Estado del comprobador: ${run.estado ?? 'sin dato'}.`, '', 'Las diferencias técnicas no aceptan hechos ni renuevan fechas factuales.')
  } else {
    lines.push('', 'No se generó el resumen del comprobador. No afirmar que la revisión de fuentes terminó.')
    if (outcomes.fuentes === 'success') failures.push('fuentes_sin_resumen')
  }
  if (failures.length) lines.push('', `Comprobaciones incompletas: ${failures.join(', ')}. Consultar los registros conservados; no equivale a ausencia de novedades.`)
  const texto = lines.join('\n') + '\n'
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, texto)
  return { texto, failures }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [name, ...rest] = process.argv.slice(2)
  if (name === 'resumen') {
    const result = resumenSemanal()
    console.log(result.texto)
    if (result.failures.length) process.exitCode = 1
  } else {
    const result = ejecutarPaso(name, rest[0] === '--' ? rest.slice(1) : rest)
    if (result.estado === 'error') process.exitCode = 1
  }
}
