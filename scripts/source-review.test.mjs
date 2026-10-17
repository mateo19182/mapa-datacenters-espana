import assert from 'node:assert/strict'
import test from 'node:test'
import { clasificarCambios, fusionarHistorial, informeSeguimiento } from './source-review.mjs'
import { prepararRevision, fusionarHuellas } from './revision.mjs'
import { informeFuentes } from './source-report.mjs'

test('repeated template changes group by domain and signature without losing URLs or pending work', () => {
  const urls = ['https://example.org/a', 'https://example.org/b', 'https://other.org/a']
  const fuentes = urls.map((url) => ({ url, usos: ['centro'], cambio_pendiente: true }))
  const huellas = Object.fromEntries(urls.map((u) => [u, { hash: 'A', pendiente: { hash: 'B', visto: '2026-10-17', comparacion: { clase: 'plantilla', firma: 'same', referencia: 'aceptada', fecha: '2026-10-10', antes: '2025', despues: '2026' } } }]))
  const r = clasificarCambios(fuentes, huellas)
  assert.equal(r.categorias.plantilla, 3)
  assert.equal(r.grupos.length, 2)
  assert.equal(r.grupos[0].fuentes.length, 2)
  assert.equal(r.grupos.flatMap((g) => g.fuentes).length, 3)
  const revision = prepararRevision([], { red: [{ id: 'centro', fuentes: urls }], huellas, hoy: '2026-10-17' })
  const informe = informeFuentes(revision, { huellas })
  assert.match(informe, /example.org · 2 referencias/)
  for (const url of urls) assert(informe.includes(url))
  assert.equal(revision.comprobacion_automatica.cambios_pendientes, 3)
  huellas[urls[1]].pendiente.comparacion.fecha = '2026-10-16'
  assert.equal(clasificarCambios(fuentes, huellas).grupos.length, 3, 'different observation dates remain separate groups')
})

test('a size-only baseline does not hide a later observed PDF text difference', () => {
  const url = 'https://example.org/a.pdf'
  const huellas = { [url]: { hash: 'bin:100', pendiente: { hash: 'bin-sha256:C', visto: '2026-10-18', comparacion: { clase: 'contenido', referencia: 'observacion', fecha: '2026-10-17', antes: '20', despues: '48' } } } }
  const r = clasificarCambios([{ url, usos: ['centro'], cambio_pendiente: true }], huellas)
  assert.equal(r.categorias.contenido, 1)
  assert.equal(r.categorias.metodo, 0)
})

test('a comparison survives merging observations from the weekly branch', () => {
  const comparacion = { clase: 'contenido', antes: '20', despues: '48', referencia: 'aceptada', fecha: '2026-10-10', hash_referencia: 'A' }
  const r = fusionarHuellas({ u: { hash: 'A', visto: '2026-10-10' } }, { u: { hash: 'A', visto: '2026-10-10', pendiente: { hash: 'B', visto: '2026-10-17', detectado: '2026-10-17', comparacion } } })
  assert.deepEqual(r.u.pendiente.comparacion, comparacion)
  assert.equal(r.u.hash, 'A')
  const masReciente = fusionarHuellas(r, { u: { hash: 'A', visto: '2026-10-10', pendiente: { hash: 'B', visto: '2026-10-18', detectado: '2026-10-17' } } })
  assert.deepEqual(masReciente.u.pendiente.comparacion, comparacion)
  assert.equal(masReciente.u.pendiente.visto, '2026-10-18')
  const otraAceptada = fusionarHuellas({ u: { hash: 'X', visto: '2026-10-16' } }, r)
  assert.equal(otraAceptada.u.pendiente.comparacion.referencia, 'observacion')
})

test('run history deduplicates and retains at most 52 real executions, with main entries authoritative', () => {
  const resumen = { registradas: 2, con_observacion: 1, rotas: 0, bloqueadas: 0, errores: 0, cambios_pendientes: 0, grupos: 0, revisiones_pendientes: 1, decisiones_publicadas: 0, decisiones_descartadas: 0, categorias: { contenido: 0, plantilla: 0, formato: 0, metodo: 0, sin_comparacion: 0 } }
  const ejecucion = (i) => ({ id: String(i), iniciada: `2026-10-17T10:${String(i).padStart(2, '0')}:00Z`, finalizada: '2026-10-17T11:00:00Z', estado: 'parcial', comprobadas: 1, duracion_ms: 100, resultados: { ok: 1, bloqueada: 0, rota: 0, error: 0 }, antes: resumen, despues: resumen })
  const lista = Array.from({ length: 59 }, (_, i) => ejecucion(i))
  const base = { version: 1, ejecuciones: [ejecucion(58)] }
  const entrante = { version: 1, ejecuciones: lista }
  const r = fusionarHistorial(base, entrante)
  assert.equal(r.ejecuciones.length, 52)
  assert.equal(r.ejecuciones[0].id, '7')
  assert.deepEqual(r.ejecuciones.at(-1), base.ejecuciones[0])
  assert.throws(() => fusionarHistorial({ version: 2, ejecuciones: [] }), /incompatible/)
  assert.throws(() => fusionarHistorial({ version: 1, ejecuciones: [{ id: 'x' }] }), /inválida/)
  assert.throws(() => fusionarHistorial({ version: 1, ejecuciones: [{ ...ejecucion(1), comprobadas: 2 }] }), /inválida/)
  assert.throws(() => fusionarHistorial({ version: 1, ejecuciones: [{ ...ejecucion(1), estado: 'completa' }] }), /inválida/)
})

test('trend reports separate observed coverage from factual accuracy and label partial runs', () => {
  const r = informeSeguimiento({ ejecuciones: [{ iniciada: '2026-10-17T10:00:00Z', estado: 'parcial', comprobadas: 2, resultados: { error: 1, bloqueada: 0 }, despues: { registradas: 1006, cambios_pendientes: 473, categorias: { sin_comparacion: 404, plantilla: 0, formato: 0 }, decisiones_publicadas: 32 } }] })
  assert.match(r, /no miden precisión factual/)
  assert.match(r, /parcial \| 2\/1006/)
  assert.match(r, /no añade resultados/)
})
