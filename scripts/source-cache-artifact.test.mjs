import assert from 'node:assert/strict'
import test from 'node:test'
import { buscarRespaldo, ejecucionesConfiables, SNAPSHOT_ARTIFACT } from './source-cache-artifact.mjs'

const now = Date.parse('2026-10-17T09:00:00Z')
const options = { repo: 'owner/repo', branch: 'feature', currentRun: 9, now }
const run = (id, extra = {}) => ({ id, status: 'completed', event: 'workflow_dispatch', head_repository: { full_name: 'owner/repo' }, head_branch: 'main', created_at: '2026-10-12T09:00:00Z', ...extra })

test('snapshot restore excludes PRs, forks, other branches, old runs and the current run', () => {
  const runs = [run(1), run(2, { event: 'pull_request' }), run(3, { head_repository: { full_name: 'fork/repo' } }), run(4, { head_branch: 'other' }), run(5, { created_at: '2026-09-01T09:00:00Z' }), run(9), run(6, { head_branch: 'feature' })]
  assert.deepEqual(ejecucionesConfiables(runs, options).map((r) => r.id), [6, 1])
})

test('selection falls back from same branch to main and ignores expired artifacts', () => {
  const calls = []
  const api = (path) => {
    calls.push(path)
    if (path.includes('/workflows/')) return { workflow_runs: [run(1), run(6, { head_branch: 'feature' })] }
    return { artifacts: [{ id: 11, name: SNAPSHOT_ARTIFACT, expired: path.includes('/6/') }] }
  }
  const result = buscarRespaldo({ ...options, api })
  assert.equal(result.estado, 'seleccionado'); assert.equal(result.run_id, 1)
  assert.equal(calls.length, 3)
})

test('no backup is explicit bootstrap, while API failure remains a restore error', () => {
  assert.equal(buscarRespaldo({ ...options, api: () => ({ workflow_runs: [] }) }).estado, 'sin_respaldo')
  assert.throws(() => buscarRespaldo({ ...options, api: () => { throw new Error('network failed') } }), /network failed/)
  assert.throws(() => buscarRespaldo({ ...options, api: () => ({}) }), /inválida/)
})
