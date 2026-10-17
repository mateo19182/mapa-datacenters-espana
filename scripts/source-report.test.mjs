import assert from 'node:assert/strict'
import test from 'node:test'
import { prepararRevision } from './revision.mjs'
import { informeFuentes, requiereRevision } from './source-report.mjs'

test('the complete report preserves untouched pending changes, partial observation dates and overdue norms', () => {
  const huellas = {
    'https://example.org/norma': { hash: 'old', longitud: 10, visto: '2026-09-01', pendiente: { hash: 'new', longitud: 20, detectado: '2026-10-10', visto: '2026-10-12' } },
    'https://example.org/centro': { hash: 'igual', longitud: 5, visto: '2026-10-17' },
    'https://example.org/error': { clase: 'rota', motivo: 'fetch failed', ultimo_fallo: '2026-10-12' },
  }
  const normativa = [{ id: 'norma', titulo: 'Norma abierta', estado: 'en_tramitacion', ultima_verificacion: '2026-08-31', hitos: [{ previsto: true, fecha: '2026-10', hito: 'Fin del periodo' }], fuentes: [{ url: 'https://example.org/norma', titulo: 'Fuente' }] }]
  const sitios = [{ id: 'centro', nombre: 'Centro', estado: 'operativo', ultima_verificacion: '2026-10-17', fuentes: [{ url: 'https://example.org/centro' }, { url: 'https://example.org/error' }] }]
  const revision = prepararRevision([], { sitios, normativa, huellas, hoy: '2026-10-17' })
  const informe = informeFuentes(revision, { huellas })
  assert.equal(revision.comprobacion_automatica.cambios_pendientes, 1)
  assert.equal(revision.comprobacion_automatica.errores, 1)
  assert.equal(revision.comprobacion_automatica.rotas, 0)
  assert.equal(revision.revision_factual.pendientes, 1)
  assert.equal(revision.hitos_vencidos.length, 0, 'a month forecast expires at the end of that month')
  assert.match(informe, /Referencias observadas el 2026-10-17: \*\*1\*\*/)
  assert.match(informe, /norma \| Norma abierta \| 2026-10-12 \| 2026-10-10/)
  assert.match(informe, /Fichas pendientes de revisión: \*\*1\*\* de 2/)
  assert.match(informe, /Norma abierta \(norma\) \| en_tramitacion \| 2026-08-31 \| 2026-09-14/)
  assert.ok(requiereRevision(revision))
  assert.equal(sitios[0].ultima_verificacion, '2026-10-17')
  assert.equal(normativa[0].ultima_verificacion, '2026-08-31')
})

test('a first content digest for a legacy size-only PDF is not described as a confirmed document change', () => {
  const huellas = { 'https://example.org/a.pdf': { hash: 'bin:?', longitud: 0, visto: '2026-09-01', pendiente: { hash: 'bin-sha256:1234', longitud: 50, detectado: '2026-10-17', visto: '2026-10-17' } } }
  const revision = prepararRevision([], { red: [{ id: 'red', fuentes: ['https://example.org/a.pdf'] }], huellas, hoy: '2026-10-17' })
  assert.match(informeFuentes(revision, { huellas }), /Primera huella del archivo; cambio sin confirmar/)
})

test('a failed attempt never appears as a fresh observation of pending content', () => {
  const huellas = { 'https://example.org/a': { hash: 'A', longitud: 10, visto: '2026-10-10', pendiente: { hash: 'B', longitud: 20, detectado: '2026-10-15', visto: '2026-10-16' }, clase: 'error', motivo: 'fetch failed', ultimo_fallo: '2026-10-17' } }
  const revision = prepararRevision([], { red: [{ id: 'red', fuentes: ['https://example.org/a'] }], huellas, hoy: '2026-10-17' })
  const informe = informeFuentes(revision, { huellas })
  assert.match(informe, /https:\/\/example.org\/a \| red \| 2026-10-16 \| 2026-10-15 \| \+10 caracteres/)
  assert.match(informe, /https:\/\/example.org\/a \| red \| 2026-10-17 \| fetch failed/)
})
