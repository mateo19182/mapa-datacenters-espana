import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync, readdirSync } from 'node:fs'
import YAML from 'yaml'

const workflows = readdirSync('.github/workflows').filter((n) => n.endsWith('.yml')).map((name) => [name, YAML.parse(readFileSync(`.github/workflows/${name}`, 'utf8'))])

test('actions are pinned to reviewed commits and the weekly manual run defaults to simulation', () => {
  for (const [, doc] of workflows) for (const job of Object.values(doc.jobs)) assert.equal(job['runs-on'], 'ubuntu-24.04')
  for (const [name, doc] of workflows) for (const job of Object.values(doc.jobs)) for (const step of job.steps) {
    if (step.uses) assert.match(step.uses, /@[a-f0-9]{40}$/, `${name}: ${step.uses}`)
  }
  const weekly = workflows.find(([name]) => name === 'revision-fuentes.yml')[1]
  assert.equal(weekly.on.workflow_dispatch.inputs.publicar.default, false)
  const steps = weekly.jobs.revisar.steps
  const publish = steps.find((s) => s.id === 'pr')
  assert.match(publish.if, /github.ref == 'refs\/heads\/main'/)
  assert.match(publish.if, /steps.validacion.outcome == 'success'/)
  assert.match(publish.if, /steps.recuperar.outcome == 'success'/)
  assert.equal(publish.with['add-paths'], '${{ steps.rutas.outputs.lista }}')
  const rutas = steps.find((s) => s.id === 'rutas')
  assert.equal(rutas.if, publish.if)
  assert.match(rutas.run, /data\/sites /)
  assert.doesNotMatch(rutas.run, /\bdata\/(\*\*)?\s/)
  const proposals = steps.find((s) => s.id === 'propuestas')
  assert.match(proposals.env.APLICAR_PROPUESTAS, /refs\/heads\/main/)
  assert.match(proposals.run, /--aplicar/)
  assert.match(proposals.run, /else/)
  assert.match(steps.find((s) => s.id === 'revision').env.FUENTE_PRUEBA, /github.ref != 'refs\/heads\/main'/)
  assert.match(steps.find((s) => s.id === 'validacion').run, /npm run validate:strict && npm run data/)
})

test('weekly artifacts preserve monitoring and reports even when a check fails', () => {
  const steps = workflows.find(([name]) => name === 'revision-fuentes.yml')[1].jobs.revisar.steps
  const artifacts = steps.find((s) => s.uses?.startsWith('actions/upload-artifact@'))
  assert.equal(artifacts.if, 'always()')
  assert.equal(artifacts['continue-on-error'], true)
  assert.match(artifacts.with.path, /build\/monitorizacion/)
  assert.match(artifacts.with.path, /informe-evolucion-fuentes/)
  const backup = steps.find((s) => s.id === 'copia_texto')
  assert.equal(backup.if, 'always()'); assert.equal(backup.with['retention-days'], 30)
  const restore = steps.find((s) => s.id === 'descarga')
  assert.match(restore.uses, /^actions\/download-artifact@/)
  assert.match(restore.with['run-id'], /steps.respaldo.outputs.run-id/)
  assert.equal(steps.at(-1).if, 'always()')
  assert.match(steps.at(-1).run, /weekly-step.mjs resumen/)
})

test('pending history is optional only when its git show fails, and dependency maintenance has no automerge', () => {
  const steps = workflows.find(([name]) => name === 'revision-fuentes.yml')[1].jobs.revisar.steps
  assert.match(steps.find((s) => s.id === 'recuperar').run, /if git show FETCH_HEAD:data\/seguimiento-fuentes.json/)
  const dependabot = YAML.parse(readFileSync('.github/dependabot.yml', 'utf8'))
  assert.equal(dependabot.updates.length, 2)
  assert.ok(dependabot.updates.every((u) => u.schedule.interval === 'weekly' && u['open-pull-requests-limit'] <= 3))
  assert.ok(!JSON.stringify(dependabot).includes('automerge'))
})
