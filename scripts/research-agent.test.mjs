import assert from 'node:assert/strict'
import test from 'node:test'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import YAML from 'yaml'
import { archivarEntrega, cambiosInvestigacion, contextoInvestigacion, instantaneaInvestigacion, prioridades, recuperarInvestigacion, revisionMensualPendiente, terminarEjecucion, validarEntrega } from './research-agent.mjs'

const git = (p, ...args) => execFileSync('git', ['-C', p, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const decision = (id, extra = {}) => ({ id, titulo: 'Comprobar una instalación', tipo: 'calidad', estado: 'awaiting_primary', prioridad: 'media', detectado: '2026-10-01', motivo: 'Falta una fuente primaria que identifique el edificio', siguiente_paso: 'Consultar el inventario', fuentes: [{ url: 'https://example.org/evidence', titulo: 'Inventario público', primaria: true }], ...extra })
function fixture(t) {
  const p = mkdtempSync(join(tmpdir(), 'mapa-research-test-'))
  t.after(() => rmSync(p, { recursive: true, force: true }))
  for (const path of ['data/sites', 'research', 'state']) mkdirSync(join(p, path), { recursive: true })
  const site = { id: 'uno', nombre: 'Centro Uno', operador: 'Operador', modelo: 'corporativo', tipo: 'edificio', ubicacion: { municipio: 'Madrid', provincia: 'Madrid', ccaa: 'Comunidad de Madrid', lat: null, lon: null, precision: 'desconocida' }, estado: 'operativo', confianza: 'baja', ultima_verificacion: '2026-10-01', fuentes: [{ id: 'f1', url: 'https://example.org/site', titulo: 'Centro Uno', editor: 'Operador', tipo: 'empresa', fecha_consulta: '2026-10-01' }], potencia: [] }
  writeFileSync(join(p, 'data/sites/uno.yaml'), YAML.stringify(site))
  writeFileSync(join(p, 'data/revision.yaml'), YAML.stringify({ hallazgos: [decision('existente')] }))
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior')] }))
  git(p, 'init', '-b', 'main'); git(p, 'config', 'user.email', 'test@example.org'); git(p, 'config', 'user.name', 'Test')
  git(p, 'add', '.'); git(p, 'commit', '-m', 'Fixture')
  return p
}

test('scope rejects staged data, deletion, rename, symlinks and quoted filenames', (t) => {
  for (const kind of ['data', 'deletion', 'rename', 'symlink', 'newline']) {
    const p = fixture(t)
    if (kind === 'data') { writeFileSync(join(p, 'data/sites/uno.yaml'), 'changed'); git(p, 'add', '.') }
    if (kind === 'deletion') rmSync(join(p, 'research/hallazgos.yaml'))
    if (kind === 'rename') git(p, 'mv', 'research/hallazgos.yaml', 'research/revision-semanal.md')
    if (kind === 'symlink') symlinkSync('/etc/passwd', join(p, 'research/revision-semanal.md'))
    if (kind === 'newline') writeFileSync(join(p, 'research/not-allowed\n.yaml'), 'bad')
    assert.throws(() => cambiosInvestigacion(p), /permitido|alcance/)
  }
})

test('existing decisions cannot be changed and duplicate reviewed IDs cannot be added', (t) => {
  const p = fixture(t), before = instantaneaInvestigacion(p)
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior', { motivo: 'Changed previous entry against the rules' })] }))
  assert.throws(() => validarEntrega(p, before), /cambiar ni borrar/)
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior'), decision('existente')] }))
  assert.throws(() => validarEntrega(p, before), /ya registrado/)
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior'), decision('futuro', { detectado: '2099-01-01' })] }))
  assert.throws(() => validarEntrega(p, before), /futura/)
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior'), decision('plazo', { revisar_antes: '2099-01-01' })] }))
  assert.equal(validarEntrega(p, before).findings, 1)
})

test('proposals validate in isolation, preserve conflicts and reject unknown fields', (t) => {
  const p = fixture(t), before = instantaneaInvestigacion(p)
  mkdirSync(join(p, 'research/propuestas-revision'))
  const original = readFileSync(join(p, 'data/sites/uno.yaml'), 'utf8')
  writeFileSync(join(p, 'research/propuestas-revision/uno.yaml'), YAML.stringify({ id: 'uno', estado: 'en_construccion' }))
  const result = validarEntrega(p, before)
  assert.equal(result.proposals, 1); assert.equal(result.conflicts, 1)
  assert.equal(readFileSync(join(p, 'data/sites/uno.yaml'), 'utf8'), original)
  writeFileSync(join(p, 'research/propuestas-revision/uno.yaml'), YAML.stringify({ id: 'uno', invented_capacity: 100 }))
  assert.throws(() => validarEntrega(p, before), /invented_capacity|Unrecognized/)
})

test('pending PR recovery copies only research material, retaining it as the next baseline', (t) => {
  const p = fixture(t)
  git(p, 'checkout', '-b', 'research/semanal')
  writeFileSync(join(p, 'research/revision-semanal.md'), 'Prior report: query failed, do not repeat without a new source.')
  writeFileSync(join(p, 'data/sites/uno.yaml'), 'This factual change must never be recovered')
  git(p, 'add', '.'); git(p, 'commit', '-m', 'Pending draft')
  git(p, 'checkout', 'main')
  assert.equal(recuperarInvestigacion(p, 'research/semanal'), 1)
  assert.match(readFileSync(join(p, 'data/sites/uno.yaml'), 'utf8'), /Centro Uno/)
  const baseline = instantaneaInvestigacion(p)
  assert.equal(validarEntrega(p, baseline).changed, false)
  const context = contextoInvestigacion(p, join(p, 'state'), '2026-10-17')
  assert.match(context, /query failed/); assert.match(context, /no deben duplicarse/)
})

test('PR recovery preserves candidates added on main and stops on conflicting concurrent additions', (t) => {
  const p = fixture(t)
  git(p, 'checkout', '-b', 'research/semanal')
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior'), decision('pendiente')] }))
  git(p, 'add', '.'); git(p, 'commit', '-m', 'Pending candidate')
  git(p, 'checkout', 'main')
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior'), decision('nuevo-main')] }))
  git(p, 'add', '.'); git(p, 'commit', '-m', 'New main candidate')
  recuperarInvestigacion(p, 'research/semanal')
  assert.deepEqual(YAML.parse(readFileSync(join(p, 'research/hallazgos.yaml'), 'utf8')).hallazgos.map((e) => e.id), ['anterior', 'nuevo-main', 'pendiente'])
  git(p, 'reset', '--hard', 'HEAD')
  writeFileSync(join(p, 'research/hallazgos.yaml'), YAML.stringify({ hallazgos: [decision('anterior'), decision('pendiente', { motivo: 'Distinct candidate evidence already reviewed on main' })] }))
  git(p, 'add', '.'); git(p, 'commit', '-m', 'Conflicting main addition')
  assert.throws(() => recuperarInvestigacion(p, 'research/semanal'), /Conflicto entre main/)
  assert.match(readFileSync(join(p, 'research/hallazgos.yaml'), 'utf8'), /Distinct candidate/)
})

test('context ranks overdue work before fresh low impact and excludes resolved work', () => {
  const all = [decision('reciente', { detectado: '2026-10-16', prioridad: 'baja' }), decision('vencido', { revisar_antes: '2026-10-12' }), decision('alto', { prioridad: 'alta' }), decision('descartado', { estado: 'discarded' })]
  assert.deepEqual(prioridades(all, '2026-10-17').map((x) => x.id), ['vencido', 'alto', 'reciente'])
})

test('failed searches and resume conditions survive a long report prefix', (t) => {
  const p = fixture(t)
  writeFileSync(join(p, 'research/revision-semanal.md'), '# Informe\n' + 'Contenido principal extenso. '.repeat(1000) + '\n## Búsquedas sin resultado\nConsulta: modelo H200 edificio CSA. Resultado: sin inventario público.\n## Condiciones para retomar\nReintentar solo con acta de recepción publicada.\n')
  const context = contextoInvestigacion(p, join(p, 'state'), '2026-10-17')
  assert.match(context, /modelo H200 edificio CSA/)
  assert.match(context, /Reintentar solo con acta de recepción publicada/)
})

test('failed runs keep evidence and bound history without deleting unrelated state', (t) => {
  const p = fixture(t), state = join(p, 'state')
  writeFileSync(join(state, 'unrelated.txt'), 'keep')
  for (let i = 0; i < 4; i++) {
    const dir = join(state, `run.${i}`); mkdirSync(dir)
    writeFileSync(join(dir, 'codex.log'), 'Failure evidence')
    terminarEjecucion(state, dir, { status: 'failed', started_at: '2026-10-17T00:00:00Z', failure: { stage: 'investigacion' } }, 2)
  }
  assert.equal(JSON.parse(readFileSync(join(state, 'history.json'))).length, 2)
  assert.equal(readdirSync(state).filter((n) => n.startsWith('run.')).length, 2)
  assert.match(readFileSync(join(state, 'run.3/codex.log'), 'utf8'), /evidence/)
  assert.ok(existsSync(join(state, 'unrelated.txt')))
  const retainedCheckout = join(state, 'run.checkout'), retainedFailure = join(state, 'run.failed')
  mkdirSync(join(retainedCheckout, 'checkout'), { recursive: true }); mkdirSync(retainedFailure)
  writeFileSync(join(retainedFailure, 'ejecucion.json'), JSON.stringify({ archive_status: 'failed' }))
  const current = join(state, 'run.latest'); mkdirSync(current)
  terminarEjecucion(state, current, { status: 'proposed', started_at: '2026-10-17T00:00:00Z' }, 1)
  assert.ok(existsSync(join(retainedCheckout, 'checkout')))
  assert.ok(existsSync(join(retainedFailure, 'ejecucion.json')))
})

test('monthly work survives a missed first Monday and retries after failure', (t) => {
  const p = fixture(t), state = join(p, 'state')
  assert.equal(revisionMensualPendiente(state, '2026-10-17T09:00:00Z'), true)
  writeFileSync(join(state, 'history.json'), JSON.stringify([{ started_at: '2026-10-12T09:00:00Z', status: 'failed', monthly: true }]))
  assert.equal(revisionMensualPendiente(state, '2026-10-19T09:00:00Z'), true)
  writeFileSync(join(state, 'history.json'), JSON.stringify([{ started_at: '2026-10-19T09:00:00Z', status: 'proposed', monthly: true }]))
  assert.equal(revisionMensualPendiente(state, '2026-10-26T09:00:00Z'), false)
  assert.equal(revisionMensualPendiente(state, '2026-11-02T09:00:00Z'), true)
})

test('failure archive preserves untracked drafts and committed material before an unsuccessful push', (t) => {
  const p = fixture(t), base = git(p, 'rev-parse', 'HEAD').trim(), output = join(p, 'state')
  mkdirSync(join(p, 'research/propuestas-revision'))
  writeFileSync(join(p, 'research/propuestas-revision/confirmada.yaml'), 'id: confirmada\n')
  git(p, 'add', 'research'); git(p, 'commit', '-m', 'Commit that could fail to push')
  writeFileSync(join(p, 'research/propuestas-revision/nueva.yaml'), 'id: nueva\n')
  symlinkSync('/etc/passwd', join(p, 'research/propuestas-revision/no-copiar.yaml'))
  const archive = archivarEntrega(p, output, base)
  assert.ok(archive.archived.includes('research/propuestas-revision/confirmada.yaml'))
  assert.ok(archive.archived.includes('research/propuestas-revision/nueva.yaml'))
  assert.ok(archive.skipped.includes('research/propuestas-revision/no-copiar.yaml'))
  assert.equal(readFileSync(join(output, 'entrega/research/propuestas-revision/nueva.yaml'), 'utf8'), 'id: nueva\n')
  assert.ok(!existsSync(join(output, 'entrega/research/propuestas-revision/no-copiar.yaml')))
})

test('shell runner preserves failed output, removes worktree and never pushes after agent failure', (t) => {
  const p = fixture(t), origin = join(p, 'origin.git'), tools = join(p, 'bin'), state = join(p, 'runs')
  mkdirSync(tools); mkdirSync(join(p, 'scripts'))
  // Only the Git checkout is isolated; execute the actual reviewed helper and schema.
  writeFileSync(join(p, 'scripts/research-agent.mjs'), `import{execFileSync}from'node:child_process';execFileSync(process.execPath,[${JSON.stringify(resolve('scripts/research-agent.mjs'))},...process.argv.slice(2)],{stdio:'inherit'});\n`)
  git(p, 'add', 'scripts'); git(p, 'commit', '-m', 'Runner helper')
  execFileSync('git', ['init', '--bare', origin], { stdio: 'ignore' }); git(p, 'remote', 'add', 'origin', origin); git(p, 'push', 'origin', 'main')
  writeFileSync(join(tools, 'gh'), '#!/bin/sh\nprintf "[]\\n"\n', { mode: 0o755 })
  writeFileSync(join(tools, 'codex'), `#!/usr/bin/env node
const fs=require('node:fs'),a=process.argv.slice(2),p=a[a.indexOf('-C')+1];
fs.mkdirSync(p+'/research/propuestas-revision',{recursive:true});fs.writeFileSync(p+'/research/propuestas-revision/nueva.yaml','id: nueva\\n');console.log('Simulated agent failure');process.exit(17);
`, { mode: 0o755 })
  const result = spawnSync('bash', [resolve('scripts/run-research-agent.sh')], { encoding: 'utf8', timeout: 15000, env: { ...process.env, MAPA_RESEARCH_REPO: p, MAPA_RESEARCH_STATE_DIR: state, MAPA_RESEARCH_CODEX_BIN: join(tools, 'codex'), MAPA_RESEARCH_GH_BIN: join(tools, 'gh') } })
  assert.equal(result.status, 17, result.stderr)
  const runs = readdirSync(state).filter((n) => n.startsWith('run.'))
  assert.equal(runs.length, 1)
  const meta = JSON.parse(readFileSync(join(state, runs[0], 'ejecucion.json')))
  assert.equal(meta.status, 'failed'); assert.equal(meta.failure.stage, 'investigacion')
  assert.match(readFileSync(join(state, runs[0], 'codex.log'), 'utf8'), /agent failure/)
  assert.equal(readFileSync(join(state, runs[0], 'entrega/research/propuestas-revision/nueva.yaml'), 'utf8'), 'id: nueva\n')
  assert.equal(git(p, 'ls-remote', '--heads', 'origin', 'research/semanal'), '')
  assert.equal(existsSync(join(state, runs[0], 'checkout')), false)
  // If archiving fails, the worker must keep the original worktree instead of deleting evidence.
  writeFileSync(join(p, 'scripts/research-agent.mjs'), `import{execFileSync}from'node:child_process';if(process.argv[2]==='archive')process.exit(7);execFileSync(process.execPath,[${JSON.stringify(resolve('scripts/research-agent.mjs'))},...process.argv.slice(2)],{stdio:'inherit'});\n`)
  let again = spawnSync('bash', [resolve('scripts/run-research-agent.sh')], { encoding: 'utf8', timeout: 15000, env: { ...process.env, MAPA_RESEARCH_REPO: p, MAPA_RESEARCH_STATE_DIR: state, MAPA_RESEARCH_CODEX_BIN: join(tools, 'codex'), MAPA_RESEARCH_GH_BIN: join(tools, 'gh') } })
  assert.equal(again.status, 17)
  let last = JSON.parse(readFileSync(join(state, 'history.json'))).at(-1)
  assert.equal(last.archive_status, 'failed')
  assert.ok(existsSync(join(state, last.run_id, 'checkout/research/propuestas-revision/nueva.yaml')))
  // A successful no-change agent also becomes a failed run if its evidence cannot be preserved.
  writeFileSync(join(tools, 'codex'), '#!/bin/sh\nexit 0\n', { mode: 0o755 })
  again = spawnSync('bash', [resolve('scripts/run-research-agent.sh')], { encoding: 'utf8', timeout: 15000, env: { ...process.env, MAPA_RESEARCH_REPO: p, MAPA_RESEARCH_STATE_DIR: state, MAPA_RESEARCH_CODEX_BIN: join(tools, 'codex'), MAPA_RESEARCH_GH_BIN: join(tools, 'gh') } })
  assert.equal(again.status, 1)
  last = JSON.parse(readFileSync(join(state, 'history.json'))).at(-1)
  assert.equal(last.status, 'failed'); assert.equal(last.failure.stage, 'conservacion')
  assert.ok(existsSync(join(state, last.run_id, 'checkout')))
})

test('shell runner creates one PR, recovers its drafts and updates it without duplicate PRs', (t) => {
  const p = fixture(t), origin = join(p, 'origin.git'), tools = join(p, 'bin'), state = join(p, 'runs')
  mkdirSync(tools); mkdirSync(join(p, 'scripts'))
  writeFileSync(join(p, 'scripts/research-agent.mjs'), `import{execFileSync}from'node:child_process';execFileSync(process.execPath,[${JSON.stringify(resolve('scripts/research-agent.mjs'))},...process.argv.slice(2)],{stdio:'inherit'});\n`)
  git(p, 'add', 'scripts'); git(p, 'commit', '-m', 'Runner helper')
  execFileSync('git', ['init', '--bare', origin], { stdio: 'ignore' }); git(p, 'remote', 'add', 'origin', origin); git(p, 'push', 'origin', 'main')
  writeFileSync(join(tools, 'gh'), `#!/usr/bin/env node
const fs=require('node:fs'),a=process.argv.slice(2),s=process.env.MAPA_RESEARCH_STATE_DIR;
fs.appendFileSync(s+'/gh-calls.txt',a.slice(0,2).join(' ')+'\\n');
if(a[1]==='list')console.log(fs.existsSync(s+'/open-pr.json')?fs.readFileSync(s+'/open-pr.json','utf8'):'[]');
if(a[1]==='create'){fs.writeFileSync(s+'/open-pr.json',JSON.stringify([{headRefName:'research/semanal',url:'https://github.com/example/repo/pull/1'}]));console.log('https://github.com/example/repo/pull/1');}
`, { mode: 0o755 })
  writeFileSync(join(tools, 'codex'), `#!/usr/bin/env node
const fs=require('node:fs'),a=process.argv.slice(2),p=a[a.indexOf('-C')+1];
fs.writeFileSync(p+'/research/revision-semanal.md',process.env.MAPA_STUB_REPORT);
`, { mode: 0o755 })
  const env = { ...process.env, MAPA_RESEARCH_REPO: p, MAPA_RESEARCH_STATE_DIR: state, MAPA_RESEARCH_CODEX_BIN: join(tools, 'codex'), MAPA_RESEARCH_GH_BIN: join(tools, 'gh'), MAPA_STUB_REPORT: '# Weekly report\nNo new primary evidence. Prior unsuccessful search remains open.\n' }
  const run = () => spawnSync('bash', [resolve('scripts/run-research-agent.sh')], { encoding: 'utf8', timeout: 15000, env })
  let result = run(); assert.equal(result.status, 0, result.stderr)
  const first = git(p, 'ls-remote', '--heads', 'origin', 'research/semanal')
  result = run(); assert.equal(result.status, 0, result.stderr)
  assert.equal(git(p, 'ls-remote', '--heads', 'origin', 'research/semanal'), first)
  env.MAPA_STUB_REPORT += 'A new publication was checked and documented.\n'
  result = run(); assert.equal(result.status, 0, result.stderr)
  const calls = readFileSync(join(state, 'gh-calls.txt'), 'utf8')
  assert.equal(calls.match(/pr create/g)?.length, 1)
  assert.equal(calls.match(/pr edit/g)?.length, 1)
  assert.equal(JSON.parse(readFileSync(join(state, 'history.json'))).length, 3)
})
