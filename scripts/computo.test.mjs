import test from 'node:test'
import assert from 'node:assert/strict'
import { inventarioComputo } from '../src/lib/computo.js'

test('el inventario conserva alcance y modalidad sin inferir instalación del estado', () => {
  const filas = inventarioComputo([{
    id: 'cpd', nombre: 'Centro', operador: 'Alojador', ubicacion: { municipio: 'Madrid', ccaa: 'Comunidad de Madrid' }, fuentes: [{ id: 'src', titulo: 'Inventario', url: 'https://example.org' }],
    computo: [
      { tipo: 'gpu', estado: 'operativo', unidades: 8, ambito: 'sistema', fuentes: ['src'] },
      { tipo: 'gpu', estado: 'anunciado', modalidad: 'acceso', unidades: null, fuentes: ['src'] },
      { tipo: 'cpu_hpc', unidades: 8, tipo_unidad: 'nucleo', fuentes: ['src'] },
    ],
  }])
  assert.equal(filas.length, 3)
  assert.equal(filas[0].modalidad, 'sin_confirmar')
  assert.equal(filas[1].modalidad, 'acceso')
  assert.equal(filas[1].unidades, null)
  assert.equal(filas[2].tipo_unidad, 'nucleo')
  assert.equal(filas[0].fuentes[0].titulo, 'Inventario')
})
