import assert from 'node:assert/strict'
import test from 'node:test'
import { comprobarFuente } from './source-check.mjs'
import { claseFallo } from './source-state.mjs'
import { estadoFuente } from './revision.mjs'

test('only 404 and 410 imply a missing resource; blocking and transport failures stay separate', () => {
  for (const codigo of [404, 410]) assert.equal(claseFallo({ codigo }), 'rota')
  for (const codigo of [401, 403, 405, 406, 429, 451]) assert.equal(claseFallo({ codigo }), 'bloqueada')
  for (const codigo of [400, 500, 502, 503, 504]) assert.equal(claseFallo({ codigo }), 'error')
  assert.equal(claseFallo({ mensaje: 'fetch failed' }), 'error')
  assert.equal(claseFallo({ mensaje: 'tiempo agotado' }), 'error')
  const previa = { clase: 'rota', ultimo_fallo: '2026-10-12', motivo: 'HTTP 406' }
  assert.equal(estadoFuente(previa).clase, 'bloqueada', 'old observations receive the same classification')
  assert.equal(previa.clase, 'rota', 'the historical observation is not rewritten')
})

test('PDF changes are detected without Content-Length, including equal-size replacements', async () => {
  const respuesta = (contenido) => async () => new Response(contenido, { headers: { 'content-type': 'application/pdf' } })
  const anterior = await comprobarFuente('https://example.org/inventario.pdf', { fetchImpl: respuesta('%PDF old') })
  const nuevo = await comprobarFuente('https://example.org/inventario.pdf', { fetchImpl: respuesta('%PDF new') })
  assert.equal(anterior.estado, 'ok')
  assert.equal(anterior.longitud, nuevo.longitud)
  assert.notEqual(anterior.hash, nuevo.hash)
  assert.match(nuevo.hash, /^bin-sha256:/)
})

test('HTTP 200 bot challenges cannot replace a factual page fingerprint', async () => {
  const lectura = await comprobarFuente('https://example.org', { fetchImpl: async () => new Response('<html><title>Just a moment...</title></html>', { headers: { 'content-type': 'text/html' } }) })
  assert.equal(lectura.estado, 'bloqueada')
  assert.equal(lectura.hash, undefined)
  assert.equal(claseFallo(lectura), 'bloqueada')
})
