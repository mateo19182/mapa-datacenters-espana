import test from 'node:test'
import assert from 'node:assert/strict'
import { resumirPorEtapa, sumarCartera } from './potencia.mjs'
import { cargarSitios } from './load.mjs'

const lectura = (valor, estado, extra = {}) => ({ tipo: 'it', valor_mw: valor, estado_asociado: estado, ambito: 'campus', fecha_dato: '2026-10-14', ...extra })

test('un techo de campus en construcción no sustituye la capacidad que funciona', () => {
  const grupos = resumirPorEtapa([
    lectura(79, 'en_construccion'),
    lectura(3, 'operativo', { ambito: 'fase' }),
  ])
  assert.equal(grupos.operativa.it.valor_mw, 3)
  assert.equal(grupos.construccion.it.valor_mw, 79)
  assert.equal(grupos.prevista.it, null)
})

test('los estados mixtos o desconocidos no se convierten en MW operativos', () => {
  for (const estado of ['parcialmente_operativo', 'ampliacion_en_construccion', 'desconocido', undefined]) {
    const grupos = resumirPorEtapa([lectura(100, estado)])
    assert.equal(grupos.operativa.it, null)
    assert.equal(grupos.sin_desglose.it.valor_mw, 100)
  }
})

test('cada etapa conserva los techos acumulados y las unidades de edificio', () => {
  const grupos = resumirPorEtapa([
    lectura(10, 'operativo', { ambito: 'fase', acumulado: true }),
    lectura(20, 'operativo', { ambito: 'fase', acumulado: true }),
    lectura(5, 'en_construccion', { ambito: 'edificio', edificio: 'A' }),
    lectura(8, 'en_construccion', { ambito: 'edificio', edificio: 'B' }),
    lectura(50, 'anunciado'),
  ])
  assert.equal(grupos.operativa.it.valor_mw, 20)
  assert.equal(grupos.construccion.it.valor_mw, 13)
  assert.equal(grupos.prevista.it.valor_mw, 50)
})

test('las carteras informan de los huecos y no mezclan etapas ni magnitudes', () => {
  const sitios = [
    { id: 'a', potencia_por_etapa: resumirPorEtapa([lectura(3, 'operativo'), lectura(79, 'en_construccion')]) },
    { id: 'b', potencia_por_etapa: resumirPorEtapa([lectura(20, 'anunciado')]) },
    { id: 'c', potencia_por_etapa: resumirPorEtapa([]) },
  ]
  assert.deepEqual(sumarCartera(sitios, 'it'), { total_mw: 3, sitios_con_dato: 1, sitios_sin_dato: 2, cobertura: 33 })
  assert.equal(sumarCartera(sitios, 'it', 'prevista').total_mw, 20)
  assert.equal(sumarCartera(sitios, 'conexion_red').total_mw, 0)
})

test('el caso mantenido de Iron Mountain distingue MAD-1 del campus completo', () => {
  const sitio = cargarSitios().sitios.find((s) => s.id === 'iron-mountain-san-fernando-de-henares-mad')
  const grupos = resumirPorEtapa(sitio.potencia)
  assert.equal(grupos.operativa.it.valor_mw, 3)
  assert.equal(grupos.construccion.it.valor_mw, 79)
})

test('una potencia inferior a 1 MW conserva sus kW en la ficha y en la cartera', () => {
  const sitio = cargarSitios().sitios.find((s) => s.id === 'kumo-murcia-espinardo')
  const grupos = resumirPorEtapa(sitio.potencia)
  assert.equal(grupos.operativa.no_especificado.valor_mw, 0.193)
  const cartera = sumarCartera([
    { id: sitio.id, potencia_por_etapa: grupos },
    { id: 'otro', potencia_por_etapa: resumirPorEtapa([lectura(0.4, 'operativo', { tipo: 'no_especificado' })]) },
  ], 'no_especificado')
  assert.equal(cartera.total_mw, 0.593)
  assert.equal(cartera.sitios_con_dato, 2)
})

test('la apertura de BCN1 y Lezama no convierte su capacidad final en MW entregados', () => {
  const sitios = cargarSitios().sitios
  const bcn1 = resumirPorEtapa(sitios.find((s) => s.id === 'digital-realty-sant-adria-bcn1').potencia)
  const lezama = resumirPorEtapa(sitios.find((s) => s.id === 'nlighten-madrid-lezama').potencia)
  assert.equal(bcn1.operativa.no_especificado, null)
  assert.equal(bcn1.prevista.no_especificado.valor_mw, 14)
  assert.equal(lezama.operativa.no_especificado, null)
  assert.equal(lezama.sin_desglose.no_especificado.discrepancia, true)
})

test('el intervalo de Digital Realty Madrid suma los límites de cada edificio independiente', () => {
  const sitio = cargarSitios().sitios.find((s) => s.id === 'digital-realty-madrid-julian-camarillo')
  const resumen = resumirPorEtapa(sitio.potencia).operativa.no_especificado
  assert.equal(resumen.base, 'suma_de_edificios')
  assert.equal(resumen.valor_mw, 40.4)
  assert.equal(resumen.minimo_observado, 40.4)
  assert.equal(resumen.maximo_observado, 42.4)
  assert.equal(resumen.discrepancia, true)
  assert.equal(resumen.registros, 5)
})

test('los intervalos distinguen lecturas rivales, fases aditivas e hitos acumulados', () => {
  const global = resumirPorEtapa([
    lectura(10, 'operativo', { fecha_dato: '2025' }),
    lectura(12, 'operativo'),
  ]).operativa.it
  assert.equal(global.valor_mw, 12)
  assert.equal(global.minimo_observado, 10)
  assert.equal(global.maximo_observado, 12)
  assert.equal(global.discrepancia, true)

  const fases = resumirPorEtapa([
    lectura(6, 'en_construccion', { ambito: 'fase' }),
    lectura(5.7, 'en_construccion', { ambito: 'fase' }),
  ]).construccion.it
  assert.equal(fases.valor_mw, 11.7)
  assert.equal(fases.minimo_observado, 11.7)
  assert.equal(fases.maximo_observado, 11.7)
  assert.equal(fases.discrepancia, false)

  const acumuladas = resumirPorEtapa([
    lectura(10, 'operativo', { ambito: 'fase', acumulado: true }),
    lectura(20, 'operativo', { ambito: 'fase', acumulado: true }),
  ]).operativa.it
  assert.equal(acumuladas.valor_mw, 20)
  assert.equal(acumuladas.minimo_observado, 10)
  assert.equal(acumuladas.maximo_observado, 20)
  assert.equal(acumuladas.discrepancia, false)
})

test('los proyectos de Forestalia vendidos a MERLIN conservan solo capacidad histórica', () => {
  const sitios = cargarSitios().sitios
    .filter((s) => ['forestalia-alfamen-dcm-blue', 'forestalia-botorrita-dcm-dedalo'].includes(s.id))
    .map((s) => ({ ...s, potencia_por_etapa: resumirPorEtapa(s.potencia) }))
  assert.equal(sitios.length, 2)
  for (const sitio of sitios) {
    assert.equal(sitio.potencia_por_etapa.prevista.it, null)
    assert.equal(sitio.potencia_por_etapa.prevista.conexion_red, null)
    assert(sitio.potencia.every((p) => p.estado_asociado === 'cancelado' && p.fecha_dato === '2025-11-12'))
    assert(sitio.fases.every((f) => f.estado === 'cancelado'))
    assert.equal(sitio.ultima_verificacion, '2026-08-31')
  }
  assert.equal(sumarCartera(sitios, 'it', 'historica').total_mw, 725)
  assert.equal(sumarCartera(sitios, 'conexion_red', 'historica').total_mw, 227.5)
})

test('la renuncia al suelo de El Olivar retira sus 90 MW de las previsiones activas', () => {
  const sitio = cargarSitios().sitios.find((s) => s.id === 'vantage-villanueva-de-gallego-el-olivar')
  const grupos = resumirPorEtapa(sitio.potencia)
  assert.equal(grupos.prevista.no_especificado, null)
  assert.equal(grupos.historica.no_especificado.valor_mw, 90)
  assert.equal(sitio.potencia[0].fecha_dato, '2025-09-10')
  assert(sitio.potencia[0].fuentes.includes('src-renuncia'))
  assert(sitio.fases.every((f) => f.estado === 'paralizado'))
  assert.equal(sitio.ultima_verificacion, '2026-08-31')
})
