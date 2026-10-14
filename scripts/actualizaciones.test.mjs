import test from 'node:test'
import assert from 'node:assert/strict'
import { prepararActualizaciones } from './actualizaciones.mjs'
const contexto = { sitios: [{ id: 'centro', fuentes: [{ id: 'oficial', titulo: 'Resolución', url: 'https://example.org/resolucion' }] }], normativa: [], hoy: '2026-10-14' }
const entrada = { id: 'hito', fecha: '2026-10-14', fecha_hecho: '2026-10-08', tipo: 'permisos', titulo: 'Hito aprobado', resumen: 'Se publica un hito de tramitación.', enlaces: [{ href: '/proyecto/centro', texto: 'Ver ficha' }], fuentes: [{ proyecto: 'centro', fuente: 'oficial' }] }
test('las novedades resuelven las referencias mantenidas y conservan las dos fechas', () => {
  const [salida] = prepararActualizaciones([entrada], contexto)
  assert.deepEqual(salida.fuentes, [{ titulo: 'Resolución', url: 'https://example.org/resolucion' }])
  assert.equal(salida.fecha_hecho, '2026-10-08')
  assert.equal(entrada.fuentes[0].fuente, 'oficial')
})
test('se rechazan novedades sin respaldo, fechas falsas o destinos inexistentes', () => {
  for (const cambio of [
    { fuentes: [{ proyecto: 'centro', fuente: 'no-existe' }] },
    { enlaces: [{ href: '/proyecto/otro', texto: 'Ver' }] },
    { fecha: '2026-02-30' }, { fecha: '2026-10-15' }, { fecha_hecho: '2026-10-15' },
  ]) assert.throws(() => prepararActualizaciones([{ ...entrada, ...cambio }], contexto))
  assert.throws(() => prepararActualizaciones([entrada, entrada], contexto), /duplicada/)
})

test('un inventario sin fecha de hecho conserva solo la fecha de incorporación', () => {
  const { fecha_hecho, ...sinFecha } = entrada
  const [salida] = prepararActualizaciones([sinFecha], contexto)
  assert.equal(salida.fecha, '2026-10-14')
  assert.equal(salida.fecha_hecho, undefined)
})
