// A weekly cache can expire before the next Monday. Select a public-text backup
// from this workflow's trusted runs, never from pull requests or forks.
import { appendFileSync, existsSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const SNAPSHOT_ARTIFACT = 'fuentes-texto-v1'
export function ejecucionesConfiables(runs, { repo, branch, currentRun, now = Date.now() }) {
  const recent = now - 30 * 86400000
  return runs.filter((r) => r.id !== Number(currentRun) && r.status === 'completed' &&
    ['schedule', 'workflow_dispatch'].includes(r.event) && r.head_repository?.full_name === repo &&
    [branch, 'main'].includes(r.head_branch) && Date.parse(r.created_at) >= recent)
    .sort((a, b) => Number(b.head_branch === branch) - Number(a.head_branch === branch) || Date.parse(b.created_at) - Date.parse(a.created_at))
}

export function buscarRespaldo({ repo, branch, currentRun, now, api }) {
  const response = api(`repos/${repo}/actions/workflows/revision-fuentes.yml/runs?per_page=30&status=completed`)
  if (!Array.isArray(response.workflow_runs)) throw new Error('Respuesta de ejecuciones inválida')
  for (const run of ejecucionesConfiables(response.workflow_runs, { repo, branch, currentRun, now })) {
    const response = api(`repos/${repo}/actions/runs/${run.id}/artifacts?per_page=100`)
    if (!Array.isArray(response.artifacts)) throw new Error('Respuesta de artefactos inválida')
    const artifact = response.artifacts.find((a) => a.name === SNAPSHOT_ARTIFACT && !a.expired && (!a.expires_at || Date.parse(a.expires_at) > (now ?? Date.now())))
    if (artifact) return { estado: 'seleccionado', run_id: run.id, artifact_id: artifact.id, rama: run.head_branch, creado: run.created_at }
  }
  return { estado: 'sin_respaldo' }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const directory = 'build/fuentes-cache'
  let result
  try {
    const present = existsSync(directory) && readdirSync(directory).some((name) => /^[a-f0-9]+\.json$/.test(name) && lstatSync(`${directory}/${name}`).isFile())
    result = present ? { estado: 'cache' } : buscarRespaldo({ repo: process.env.GITHUB_REPOSITORY, branch: process.env.GITHUB_REF_NAME, currentRun: process.env.GITHUB_RUN_ID,
      api: (path) => JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024 })) })
    if (result.estado === 'seleccionado' && process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `run-id=${result.run_id}\n`)
  } catch (error) {
    result = { estado: 'error', motivo: 'No se pudo consultar o seleccionar el respaldo de instantáneas' }
    console.error(`${result.motivo}: ${error.message}`)
    process.exitCode = 1
  }
  mkdirSync('build/monitorizacion', { recursive: true })
  writeFileSync('build/monitorizacion/restauracion-texto.json', JSON.stringify({ version: 1, ...result }, null, 2) + '\n')
  console.log(`Instantáneas: ${result.estado}.`)
}
