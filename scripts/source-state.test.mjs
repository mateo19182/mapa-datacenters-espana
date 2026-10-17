import assert from 'node:assert/strict'
import test from 'node:test'
import { registrarLectura, aceptarPendiente } from './source-state.mjs'

test('a changed source remains pending on later runs until explicitly accepted', () => {
  const original = { hash: 'old', longitud: 10, visto: '2026-09-01' }
  const lectura = { estado: 'ok', hash: 'new', longitud: 20 }
  const first = registrarLectura(original, lectura, '2026-09-07')
  assert.equal(first.resultado, 'cambiada')
  assert.equal(first.estado.hash, 'old')
  assert.equal(first.estado.pendiente.detectado, '2026-09-07')

  const second = registrarLectura(first.estado, lectura, '2026-09-14')
  assert.equal(second.resultado, 'cambiada')
  assert.equal(second.estado.hash, 'old')
  assert.equal(second.estado.pendiente.detectado, '2026-09-07')
  assert.deepEqual(aceptarPendiente(second.estado, '2026-09-14'), {
    hash: 'new', longitud: 20, visto: '2026-09-14', aceptado: '2026-09-14',
  })
})

test('a restored page and a recovered blocked URL clear old alerts', () => {
  const original = { hash: 'old', longitud: 10, visto: '2026-09-01', clase: 'bloqueada', ultimo_fallo: '2026-09-07' }
  const changed = registrarLectura(original, { estado: 'ok', hash: 'new', longitud: 20 }, '2026-09-14')
  const restored = registrarLectura(changed.estado, { estado: 'ok', hash: 'old', longitud: 10 }, '2026-09-21')
  assert.equal(restored.resultado, 'igual')
  assert.equal(restored.estado.pendiente, undefined)
  assert.equal(restored.estado.clase, undefined)
})

test('accepting evidence does not invent a new technical read or clear a later connection failure', () => {
  const previa = { hash: 'old', longitud: 10, visto: '2026-09-01', pendiente: { hash: 'new', longitud: 20, detectado: '2026-10-10', visto: '2026-10-12' }, clase: 'error', motivo: 'fetch failed', ultimo_fallo: '2026-10-16' }
  const aceptada = aceptarPendiente(previa, '2026-10-17')
  assert.equal(aceptada.hash, 'new')
  assert.equal(aceptada.visto, '2026-10-12')
  assert.equal(aceptada.aceptado, '2026-10-17')
  assert.equal(aceptada.ultimo_fallo, '2026-10-16')
  assert.equal(aceptada.clase, 'error')
  assert.equal(aceptada.pendiente, undefined)
  assert.equal(previa.pendiente.hash, 'new')
  const igual = registrarLectura(aceptada, { estado: 'ok', hash: 'new', longitud: 20 }, '2026-10-18')
  const diferente = registrarLectura(aceptada, { estado: 'ok', hash: 'newer', longitud: 21 }, '2026-10-18')
  assert.equal(igual.estado.aceptado, '2026-10-17')
  assert.equal(diferente.estado.aceptado, '2026-10-17')
})

test('a different pending version has its own first observation date', () => {
  const previa = { hash: 'accepted', longitud: 10, visto: '2026-09-01', pendiente: { hash: 'version1', longitud: 20, detectado: '2026-09-02', visto: '2026-09-10' } }
  const siguiente = registrarLectura(previa, { estado: 'ok', hash: 'version2', longitud: 30 }, '2026-10-17')
  assert.equal(siguiente.estado.pendiente.detectado, '2026-10-17')
  assert.equal(siguiente.estado.hash, 'accepted')
})
