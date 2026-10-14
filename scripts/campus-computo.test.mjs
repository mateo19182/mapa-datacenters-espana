import test from 'node:test'
import assert from 'node:assert/strict'
import { cargarSitios } from './load.mjs'
import { resumirPorEtapa } from './potencia.mjs'

const { sitios } = cargarSitios()
const ficha = (id) => sitios.find((s) => s.id === id)

test('los edificios de Digital Realty se suman sin sumar las lecturas rivales de MAD5', () => {
  const sitio = ficha('digital-realty-madrid-julian-camarillo')
  assert.ok(sitio.potencia.every((p) => p.ambito === 'edificio' && /^MAD[1-5]$/.test(p.edificio)))
  const etapas = resumirPorEtapa(sitio.potencia)
  assert.equal(etapas.operativa.no_especificado.valor_mw, 40.4)
  assert.equal(etapas.operativa.no_especificado.discrepancia, true)
  assert.ok([24, 40].includes(etapas.prevista.no_especificado.valor_mw))
  assert.equal(etapas.prevista.no_especificado.discrepancia, true)
  assert.notEqual(etapas.prevista.no_especificado.valor_mw, 64)
})

test('los objetivos de DATA4 y MD5 definitivo no se convierten en capacidad operativa', () => {
  const mad01 = resumirPorEtapa(ficha('data4-alcobendas-mad01').potencia)
  assert.equal(mad01.operativa.it, null)
  assert.equal(mad01.sin_desglose.it.valor_mw, 50)
  const mad02 = resumirPorEtapa(ficha('data4-san-agustin-del-guadalix-mad02').potencia)
  assert.equal(mad02.operativa.it, null)
  assert.equal(mad02.prevista.it.valor_mw, 48)
  const md5 = ficha('equinix-alcobendas-campus').potencia.filter((p) => p.edificio === 'MD5')
  assert.equal(md5.find((p) => p.valor_mw === 9.6).estado_asociado, 'anunciado')
  assert.equal(md5.find((p) => p.valor_mw === 4).estado_asociado, 'operativo')
})

test('los inventarios físicos de GPU se distinguen de acceso, previsión y traslado sin confirmar', () => {
  const picasso = ficha('scbi-uma-malaga-picasso').computo
  assert.equal(picasso.find((c) => c.modelo.startsWith('NVIDIA A100')).unidades, 32)
  const b200 = picasso.find((c) => c.modelo === 'NVIDIA B200')
  assert.equal(b200.unidades, 16)
  assert.equal(b200.modalidad, 'instalado')
  assert.equal(b200.fecha_dato, null)
  assert.ok(b200.fuentes.includes('src-hardware-20261014'))
  const h200 = ficha('cluster-tic-galicia-a-coruna-csa').computo.find((c) => c.modelo.includes('H200'))
  assert.equal(h200.modalidad, 'acceso')
  assert.equal(h200.unidades, null)
  const anunciado = ficha('merlin-barcelona-zona-franca').computo.find((c) => c.unidades === 10224)
  assert.equal(anunciado.modalidad, 'previsto')
  assert.ok(ficha('scayle-leon-gaspar-morocho').computo.every((c) => c.modalidad === 'sin_confirmar'))
})

test('los tres nuevos emplazamientos no reciben coordenadas de oficinas o recintos por inferencia', () => {
  for (const id of ['upf-barcelona-correfoc', 'uib-palma-talaia', 'nxn-madrid-juan-carlos-i']) {
    const { ubicacion } = ficha(id)
    assert.equal(ubicacion.lat, null)
    assert.equal(ubicacion.lon, null)
    assert.equal(ubicacion.no_derivar, true)
  }
})
