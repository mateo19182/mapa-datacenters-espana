import { mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export function clasificarAuditoria(result) {
  let report
  try { report = JSON.parse(result.stdout) } catch { /* Interrupted or non-JSON registry response. */ }
  if (result.error || ![0, 1].includes(result.status) || report?.error || !report?.metadata?.vulnerabilities) {
    return { estado: 'error_registro', codigo: result.error?.code ?? report?.error?.code ?? result.status ?? 'sin_respuesta', altas: null, criticas: null }
  }
  const { high = 0, critical = 0 } = report.metadata.vulnerabilities
  return { estado: high || critical ? 'vulnerable' : 'completa', altas: high, criticas: critical }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = spawnSync('npm', ['audit', '--json', '--audit-level=high'], { encoding: 'utf8', timeout: 90000, maxBuffer: 8 * 1024 * 1024 })
  const audit = { version: 1, fecha: new Date().toISOString(), ...clasificarAuditoria(result) }
  mkdirSync('build/seguridad', { recursive: true })
  writeFileSync('build/seguridad/npm-audit.json', JSON.stringify(audit, null, 2) + '\n')
  if (audit.estado === 'error_registro') {
    console.error(`Auditoría de dependencias incompleta: no se pudo consultar el registro (${audit.codigo}). No es un resultado de vulnerabilidades.`)
    process.exitCode = 1
  } else {
    console.log(`Auditoría completa: ${audit.altas} vulnerabilidades altas, ${audit.criticas} críticas.`)
    if (audit.estado === 'vulnerable') process.exitCode = 1
  }
}
