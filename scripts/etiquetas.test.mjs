import test from 'node:test'
import assert from 'node:assert/strict'
import { esFuentePrimaria, motivosConfianza } from '../src/lib/etiquetas.js'
import { nombreProyecto } from '../src/lib/nombres.js'

test('la autoría del operador cuenta aunque sea una asociación o fundación', () => {
  const sitio = {
    operador: 'Centro Tecnológico de Automoción de Galicia (CTAG)',
    propietario: null,
    fuentes: [
      { id: 'operador', tipo: 'asociacion', editor: 'Centro Tecnologico de Automocion de Galicia (CTAG)' },
      { id: 'mapa', tipo: 'otro', editor: 'Google Maps' },
    ],
    potencia: [{ tipo: 'it', fuentes: ['operador'] }],
    ubicacion: { precision: 'aproximada' },
  }
  assert.equal(esFuentePrimaria(sitio.fuentes[0], sitio), true)
  assert.equal(esFuentePrimaria(sitio.fuentes[1], sitio), false)
  assert.deepEqual(motivosConfianza(sitio), [])
  assert.equal(esFuentePrimaria({ tipo: 'asociacion', editor: 'Spain DC' }, sitio), false)
  assert.equal(esFuentePrimaria({ tipo: 'otro', editor: null }, { operador: null }), false)
  assert.equal(esFuentePrimaria({ tipo: 'otro', editor: 'Fundación propietaria' }, { propietario: 'Fundación propietaria' }), true)
})

test('una asociación ajena no elimina los motivos de falta de fuente primaria', () => {
  const motivos = motivosConfianza({
    operador: 'Operador',
    fuentes: [{ id: 'sector', tipo: 'asociacion', editor: 'Asociación sectorial' }, { id: 'prensa', tipo: 'prensa_general', editor: 'Diario' }],
    potencia: [{ tipo: 'it', fuentes: ['sector'] }],
  })
  assert.ok(motivos.includes('sin fuente oficial ni del operador o propietario'))
  assert.ok(motivos.includes('potencia sin respaldo oficial ni del operador o propietario'))
})

test('mapa, ficha e inventario de cómputo comparten el nombre breve sin cambiar el original', () => {
  const sitio = { id: 'ctag-porrino-haaro', nombre: 'Nombre completo de CTAG' }
  const original = structuredClone(sitio)
  assert.equal(nombreProyecto(sitio), 'CTAG · HAARO, O Porriño')
  assert.equal(nombreProyecto({ id: 'fila-computo-1', proyecto: sitio.id, nombre_proyecto: sitio.nombre }), nombreProyecto(sitio))
  assert.equal(nombreProyecto({ id: 'otro', nombre: 'Otro centro' }), 'Otro centro')
  assert.deepEqual(sitio, original)
})
