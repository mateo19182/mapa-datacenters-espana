import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import { ejecutarPaso, resultadoPaso, resumenSemanal } from './weekly-step.mjs'
import { clasificarAuditoria } from './check-npm-audit.mjs'

test('exit codes distinguish expected work from incomplete checks', () => {
  assert.equal(resultadoPaso('fuentes', 10).estado, 'pendiente')
  assert.equal(resultadoPaso('ree', 10).estado, 'pendiente')
  assert.equal(resultadoPaso('propuestas', 11).estado, 'pendiente')
  assert.equal(resultadoPaso('validacion', 10).estado, 'error')
  assert.equal(resultadoPaso('fuentes', 1).estado, 'error')
  assert.equal(resultadoPaso('fuentes', null, 'ETIMEDOUT').estado, 'error')
})

test('failure preserves logs and cannot become a successful final summary', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'mapa-weekly-step-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const result = ejecutarPaso('fuentes', ['stub'], { directory, spawn: () => ({ status: 1, stdout: 'partial evidence\n', stderr: 'failure\n' }) })
  assert.equal(result.estado, 'error')
  assert.match(readFileSync(join(directory, 'pasos/fuentes.log'), 'utf8'), /partial evidence/)
  const summary = resumenSemanal({ OUTCOME_RECUPERAR: 'success', OUTCOME_FUENTES: 'failure', OUTCOME_REE: 'success', OUTCOME_PROPUESTAS: 'success', OUTCOME_VALIDACION: 'success', OUTCOME_PR: 'skipped' }, directory)
  assert.deepEqual(summary.failures, ['fuentes'])
  assert.match(summary.texto, /No se generó el resumen/)
})

test('audit distinguishes registry failures, vulnerabilities and a complete low-severity result', () => {
  const response = (v, status = 0) => ({ status, stdout: JSON.stringify({ metadata: { vulnerabilities: v } }) })
  assert.equal(clasificarAuditoria(response({ high: 0, critical: 0, moderate: 2 })).estado, 'completa')
  assert.equal(clasificarAuditoria(response({ high: 1, critical: 0 }, 1)).estado, 'vulnerable')
  assert.equal(clasificarAuditoria(response({ high: 0, critical: 1 }, 1)).estado, 'vulnerable')
  assert.equal(clasificarAuditoria({ status: 1, stdout: JSON.stringify({ error: { code: 'ENOTFOUND' } }) }).estado, 'error_registro')
  assert.equal(clasificarAuditoria({ status: null, stdout: '', error: { code: 'ETIMEDOUT' } }).estado, 'error_registro')
  assert.equal(clasificarAuditoria({ status: 1, stdout: 'Service unavailable' }).estado, 'error_registro')
})

test('weekly CLI runs all phases, preserves partial evidence and fails the final job honestly', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'mapa-weekly-cli-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const cli = resolve('scripts/weekly-step.mjs')
  const run = (name, code, source = '') => spawnSync(process.execPath, [cli, name, '--', process.execPath, '-e', `${source};console.log('fixture evidence');process.exit(${code})`], { cwd: directory, encoding: 'utf8' })
  const manifest = `require('node:fs').mkdirSync('build/monitorizacion',{recursive:true});require('node:fs').writeFileSync('build/monitorizacion/ejecucion.json',JSON.stringify({version:1,estado:'completa',comprobadas:3}))`
  assert.equal(run('fuentes', 10, manifest).status, 0)
  assert.equal(run('ree', 10).status, 0)
  assert.equal(run('propuestas', 11).status, 0)
  assert.equal(run('validacion', 0).status, 0)
  const env = { ...process.env, OUTCOME_RECUPERAR: 'success', OUTCOME_FUENTES: 'success', OUTCOME_REE: 'success', OUTCOME_PROPUESTAS: 'success', OUTCOME_VALIDACION: 'success', OUTCOME_PR: 'skipped' }
  let summary = spawnSync(process.execPath, [cli, 'resumen'], { cwd: directory, env, encoding: 'utf8' })
  assert.equal(summary.status, 0, summary.stderr)
  assert.match(summary.stdout, /Fuentes comprobadas: 3/)
  assert.equal(run('ree', 2).status, 1)
  env.OUTCOME_REE = 'failure'
  summary = spawnSync(process.execPath, [cli, 'resumen'], { cwd: directory, env, encoding: 'utf8' })
  assert.equal(summary.status, 1)
  assert.match(summary.stdout, /Comprobaciones incompletas: ree/)
  assert.match(readFileSync(join(directory, 'build/monitorizacion/pasos/ree.log'), 'utf8'), /fixture evidence/)
  assert.ok(existsSync(join(directory, 'build/monitorizacion/ejecucion.json')))
})
