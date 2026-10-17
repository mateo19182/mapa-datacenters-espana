import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import YAML from 'yaml'
import { integrarPropuestas } from './apply-proposals.mjs'

function fixture(t) {
  const raiz = mkdtempSync(join(tmpdir(), 'mapa-propuestas-'))
  t.after(() => rmSync(raiz, { recursive: true, force: true }))
  for (const dir of ['data/sites', 'data/propuestas', 'research']) mkdirSync(join(raiz, dir), { recursive: true })
  return {
    raiz,
    escribir(dir, id, datos) { writeFileSync(join(raiz, 'data', dir, `${id}.yaml`), YAML.stringify(datos)) },
    leer(id) { return YAML.parse(readFileSync(join(raiz, 'data/sites', `${id}.yaml`), 'utf8')) },
    integrar(opciones = {}) { return integrarPropuestas({ raiz, hoy: '2026-10-17', aplicar: true, ...opciones }) },
  }
}

test('automatic source, alias and factual additions preserve the existing factual review date', (t) => {
  const f = fixture(t)
  f.escribir('sites', 'existente', {
    id: 'existente', nombre: 'Centro existente', ultima_verificacion: '2026-08-31',
    fuentes: [{ id: 'src-antigua', url: 'https://example.com/original', fecha_consulta: '2026-08-31' }],
  })
  f.escribir('propuestas', 'existente', {
    ultima_verificacion: '2026-10-16', alias: ['Otro nombre'], operador: 'Operador',
    fuentes: [{ id: 'src-nueva', url: 'https://example.com/nueva' }],
    potencia: [{ tipo: 'it', ambito: 'campus', valor_mw: 2 }],
  })
  const resultado = f.integrar()
  const actual = f.leer('existente')
  assert.equal(actual.ultima_verificacion, '2026-08-31')
  assert.deepEqual(actual.alias, ['Otro nombre'])
  assert.equal(actual.operador, 'Operador')
  assert.equal(actual.potencia[0].valor_mw, 2)
  assert.equal(actual.fuentes.length, 2)
  assert.equal(actual.fuentes[1].fecha_consulta, '2026-10-17')
  assert.equal(resultado.conflictos.length, 0)
  assert.ok(existsSync(join(f.raiz, 'data/propuestas/integradas/2026-10-17-existente.yaml')))
})

test('an addition to an undated existing record does not invent a factual review date', (t) => {
  const f = fixture(t)
  f.escribir('sites', 'existente', { id: 'existente', nombre: 'Centro existente' })
  f.escribir('propuestas', 'existente', { alias: ['Alias'] })
  f.integrar()
  assert.deepEqual(f.leer('existente'), { id: 'existente', nombre: 'Centro existente', alias: ['Alias'] })
})

test('a new site keeps its explicitly supplied review date, independently of the integration date', (t) => {
  const f = fixture(t)
  const alta = { id: 'nuevo', nombre: 'Centro nuevo', ultima_verificacion: '2024-02-29' }
  f.escribir('propuestas', 'nuevo', alta)
  const resultado = f.integrar()
  assert.deepEqual(f.leer('nuevo'), alta)
  assert.equal(resultado.adiciones[0].campo, '(emplazamiento entero)')
  assert.ok(existsSync(join(f.raiz, 'data/propuestas/integradas/2026-10-17-nuevo.yaml')))
})

test('a new site without a review date blocks integration before any site is changed', (t) => {
  const f = fixture(t)
  const anterior = { id: 'existente', nombre: 'Centro', ultima_verificacion: '2026-08-31' }
  f.escribir('sites', 'existente', anterior)
  f.escribir('propuestas', 'existente', { alias: ['Alias'] })
  f.escribir('propuestas', 'nuevo', { id: 'nuevo', nombre: 'Sin revisión factual' })
  for (const aplicar of [false, true]) {
    assert.throws(() => f.integrar({ aplicar }), /nuevo\.yaml:.*ultima_verificacion explícita y válida/)
    assert.deepEqual(f.leer('existente'), anterior)
    assert.ok(!existsSync(join(f.raiz, 'data/sites/nuevo.yaml')))
    assert.ok(existsSync(join(f.raiz, 'data/propuestas/nuevo.yaml')))
    assert.ok(!existsSync(join(f.raiz, 'research/informe-propuestas.md')))
  }
})

test('a malformed, impossible or future review date does not create a new site', (t) => {
  const f = fixture(t)
  for (const ultima_verificacion of [null, '', '17/10/2026', '2026-13-01', '2026-02-30', '2026-10-18']) {
    f.escribir('propuestas', 'nuevo', { id: 'nuevo', nombre: 'Centro', ultima_verificacion })
    assert.throws(() => f.integrar(), /ultima_verificacion explícita y válida/)
    assert.ok(!existsSync(join(f.raiz, 'data/sites/nuevo.yaml')))
    assert.ok(existsSync(join(f.raiz, 'data/propuestas/nuevo.yaml')))
  }
})

test('simulation does not apply additions or replace a dated new-site proposal', (t) => {
  const f = fixture(t)
  const anterior = { id: 'existente', nombre: 'Centro', ultima_verificacion: '2026-08-31' }
  const alta = { id: 'nuevo', nombre: 'Nuevo', ultima_verificacion: '2026-10-01' }
  f.escribir('sites', 'existente', anterior)
  f.escribir('propuestas', 'existente', { alias: ['Alias'] })
  f.escribir('propuestas', 'nuevo', alta)
  assert.equal(f.integrar({ aplicar: false }).adiciones.length, 2)
  assert.deepEqual(f.leer('existente'), anterior)
  assert.ok(!existsSync(join(f.raiz, 'data/sites/nuevo.yaml')))
  assert.ok(existsSync(join(f.raiz, 'data/propuestas/nuevo.yaml')))
})

test('conflicting values remain unresolved while safe additions keep their factual date', (t) => {
  const f = fixture(t)
  f.escribir('sites', 'existente', {
    id: 'existente', nombre: 'Centro', operador: 'Original', ultima_verificacion: '2026-08-31',
  })
  f.escribir('propuestas', 'existente', { operador: 'Distinto', alias: ['Alias'] })
  const resultado = f.integrar()
  assert.equal(resultado.conflictos.length, 1)
  assert.equal(f.leer('existente').operador, 'Original')
  assert.equal(f.leer('existente').ultima_verificacion, '2026-08-31')
  assert.deepEqual(f.leer('existente').alias, ['Alias'])
  assert.ok(existsSync(join(f.raiz, 'data/propuestas/existente.yaml')))
})
