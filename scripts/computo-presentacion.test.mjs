import test from 'node:test'
import assert from 'node:assert/strict'
import { cargarSitios } from './load.mjs'
import { alcanceComputo, avisoComputo, estadoComplementarioComputo, modeloComputo } from '../src/lib/computo-presentacion.js'

const { sitios } = cargarSitios()
const registros = (id) => sitios.find((sitio) => sitio.id === id).computo.map((c) => ({ ...c, proyecto: id }))

test('las configuraciones repetidas de AIMEN se distinguen sin sumarse', () => {
  const filas = registros('aimen-porrino-am-pilot-factory')
  const antes = structuredClone(filas)
  const rtx20 = filas.filter((r) => r.modelo.includes('RTX20XX'))
  assert.equal(rtx20.length, 3)
  assert.equal(new Set(rtx20.map(alcanceComputo)).size, 3)
  assert.ok(rtx20.every((r) => /configuración/.test(avisoComputo(r))))
  assert.match(avisoComputo(rtx20[0]), /dos menciones idénticas/)
  assert.deepEqual(filas, antes)
})

test('TECNALIA conserva el total declarado y advierte de su contradicción', () => {
  const filas = registros('tecnalia-derio-deep-learning')
  assert.equal(filas.find((r) => r.ambito === 'sistema').unidades, 13)
  assert.ok(filas.every((r) => /Total y desglose en disputa/.test(avisoComputo(r))))
  assert.equal(modeloComputo(filas.find((r) => r.ambito === 'sistema')), 'Total declarado del clúster')
  assert.ok(filas.every((r) => alcanceComputo(r) === null))
})

test('la discrepancia de rendimiento GPP no se atribuye a las cantidades H100 de BSC', () => {
  const filas = registros('bsc-barcelona-marenostrum')
  assert.match(avisoComputo(filas.find((r) => r.sistema === 'MareNostrum 5 GPP (partición de propósito general)')), /54 o 45,9/)
  assert.equal(avisoComputo(filas.find((r) => r.modelo.includes('H100'))), null)
  assert.equal(alcanceComputo(filas.find((r) => r.sistema.includes('GPP ('))), 'MareNostrum 5 GPP')
  assert.equal(alcanceComputo(filas.find((r) => r.modelo.includes('H100'))), 'MareNostrum 5 ACC')
})

test('los modelos abreviados de CTIC conservan compra, equivalencia y recepción pendiente', () => {
  const filas = registros('ctic-gijon-cabuenes')
  const blackwell = filas.find((r) => r.sistema.includes('CT004/2026'))
  assert.equal(modeloComputo(blackwell), 'RTX PRO 6000 Blackwell Server Edition · 96 GB')
  assert.match(alcanceComputo(blackwell), /Compra adjudicada CT004\/2026/)
  assert.match(avisoComputo(blackwell), /referencia; admite equivalentes/)
  assert.match(avisoComputo(blackwell), /Recepción sin confirmar/)
  assert.equal(blackwell.modalidad, 'adquirido')
  assert.equal(avisoComputo(filas.find((r) => r.modalidad === 'instalado')), null)
})

test('CESGA separa la sede documentada de la renovación y conserva visibles los recuentos en disputa', () => {
  const nueva = registros('cesga-santiago-a-sionlla')
  const anterior = registros('cesga-santiago-campus-sur')
  assert.equal(anterior.filter((r) => r.modelo === 'NVIDIA A100').length, 1)
  assert.match(avisoComputo(anterior.find((r) => r.modelo === 'NVIDIA A100')), /128 o 141 A100/)
  assert.ok(anterior.every((r) => avisoComputo(r)))
  assert.ok(nueva.every((r) => r.modalidad !== 'instalado'))
  assert.ok(nueva.every((r) => !/FinisTerrae III|Qmio/.test(r.sistema)))
})

test('los sistemas que repiten el modelo o el centro quedan en la evidencia', () => {
  for (const id of ['data4-alcobendas-mad01', 'cogent-san-sebastian-de-los-reyes']) {
    assert.ok(registros(id).every((r) => alcanceComputo(r) === null))
  }
  const cesga = registros('cesga-santiago-a-sionlla')
  assert.equal(alcanceComputo(cesga.find((r) => r.modelo?.includes('Radiance'))), null)
  assert.equal(alcanceComputo(registros('cesga-santiago-campus-sur').find((r) => r.modelo === 'NVIDIA A100')), 'FinisTerrae III')
})

test('solo se omiten los estados que repiten la situación de despliegue', () => {
  assert.equal(estadoComplementarioComputo({modalidad: 'instalado', estado: 'operativo'}), null)
  assert.equal(estadoComplementarioComputo({modalidad: 'previsto', estado: 'anunciado'}), null)
  assert.equal(estadoComplementarioComputo({modalidad: 'sin_confirmar', estado: 'operativo'}), 'operativo')
  assert.equal(estadoComplementarioComputo({modalidad: 'adquirido', estado: 'operativo'}), 'operativo')
  assert.equal(estadoComplementarioComputo({modalidad: 'previsto', estado: 'paralizado'}), 'paralizado')
  assert.equal(estadoComplementarioComputo({modalidad: 'previsto', estado: 'cancelado'}), 'cancelado')
})
