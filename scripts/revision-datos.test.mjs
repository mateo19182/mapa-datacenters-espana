import assert from 'node:assert/strict'
import test from 'node:test'
import { cargarSitios } from './load.mjs'
import { resumirPorEtapa } from './potencia.mjs'
import { inventarioComputo } from '../src/lib/computo.js'

const sitios = cargarSitios().sitios
const ficha = (id) => sitios.find((s) => s.id === id)
const capacidad = (id) => resumirPorEtapa(ficha(id).potencia)

test('Getafe 2 contributes future IT and supply independently, with no operational capacity', () => {
  const resumen = capacidad('merlin-edged-getafe-2')
  assert.ok(Object.values(resumen.operativa).every((valor) => valor === null))
  assert.equal(resumen.prevista.it.valor_mw, 48)
  assert.equal(resumen.prevista.conexion_red.valor_mw, 70)
  assert.equal(capacidad('merlin-edged-getafe-mad01').operativa.it.valor_mw, 20)
})

test('DATA4 backup lines do not become rival capacity readings or inflate the main supply', () => {
  const resumen = capacidad('data4-alcobendas-mad01')
  assert.equal(resumen.operativa.it, null)
  assert.equal(resumen.operativa.conexion_red.valor_mw, 20)
  assert.equal(resumen.operativa.conexion_red.minimo_observado, 20)
  assert.equal(resumen.operativa.conexion_red.maximo_observado, 20)
  assert.match(ficha('data4-alcobendas-mad01').conexion_electrica.nota, /respaldo/i)
  assert.equal(capacidad('templus-hospitalet-bcn01').operativa.it.valor_mw, 2.25)
  assert.equal(capacidad('templus-barcelona-bcn02').operativa.it.valor_mw, 5.7)
})

test('CESGA hardware is attached once to its documented facility and procurement stays separate', () => {
  const filas = inventarioComputo(sitios).filter((r) => r.proyecto?.startsWith('cesga-santiago-'))
  const anteriores = filas.filter((r) => /FinisTerrae III|^Qmio$/.test(r.sistema))
  assert.equal(anteriores.length, 4)
  assert.ok(anteriores.every((r) => r.proyecto === 'cesga-santiago-campus-sur'))
  assert.ok(anteriores.every((r) => r.fecha_dato === null))
  assert.equal(anteriores.filter((r) => r.modelo === 'NVIDIA A100').length, 1)
  const ft4 = filas.find((r) => r.sistema === 'FinisTerrae IV')
  assert.equal(ft4.proyecto, 'cesga-santiago-a-sionlla')
  assert.equal(ft4.modalidad, 'adquirido')
  assert.ok(filas.filter((r) => r.proyecto === 'cesga-santiago-a-sionlla').every((r) => r.modalidad !== 'instalado'))
})
