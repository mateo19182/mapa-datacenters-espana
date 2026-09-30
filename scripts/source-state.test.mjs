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
    hash: 'new', longitud: 20, visto: '2026-09-14',
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
