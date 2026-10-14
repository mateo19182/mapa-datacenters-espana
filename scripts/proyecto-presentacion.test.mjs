import test from 'node:test'
import assert from 'node:assert/strict'
import { cargarSitios } from './load.mjs'
import { presentacionProyecto, vinculosEnergiaProyecto } from '../src/lib/proyecto-presentacion.js'

const { sitios } = cargarSitios()
const ficha = (id) => sitios.find((sitio) => sitio.id === id)

test('las presentaciones conservan referencias válidas y resúmenes breves', () => {
  let conCronologia = 0
  for (const sitio of sitios) {
    const presentacion = presentacionProyecto(sitio)
    if (presentacion.resumen) assert.ok(presentacion.resumen.split(/\s+/).length <= 40, sitio.id)
    if (presentacion.cronologia.length) conCronologia++
    const fuentes = new Set(sitio.fuentes.map((f) => f.id))
    for (const evento of presentacion.cronologia) {
      assert.ok(evento.fuentes.length, `${sitio.id}: hito sin fuente`)
      assert.ok(evento.fuentes.every((id) => fuentes.has(id)), `${sitio.id}: referencia rota`)
    }
  }
  assert.ok(conCronologia >= 5)
})

test('la cronología diferencia las fechas de acuerdo de las de publicación', () => {
  const qts = presentacionProyecto(ficha('qts-calatorao-rhodes'))
  const parcial = qts.cronologia.find((e) => e.titulo === 'Aprobación definitiva parcial')
  assert.equal(parcial.fecha, '2026-09-28')
  assert.match(parcial.detalle, /carácter básico y sujetos a condiciones/)
  const aws = presentacionProyecto(ficha('aws-zaragoza-la-cartuja-car'))
  assert.equal(aws.cronologia.find((e) => e.titulo.startsWith('Nueva aprobación inicial')).fecha, '2026-10-05')
  assert.equal(aws.cronologia.find((e) => e.titulo === 'Publicación de la información pública').fecha, '2026-10-08')
})

test('el resumen de CSA mantiene recuentos disputados y el límite de H200', () => {
  const csa = presentacionProyecto(ficha('cluster-tic-galicia-a-coruna-csa'))
  const l4 = csa.hardware.find((h) => h.modelo.includes('L4'))
  const a40 = csa.hardware.find((h) => h.modelo.includes('A40'))
  const h200 = csa.hardware.find((h) => h.modelo.includes('H200'))
  assert.match(l4.dato, /15 GPU/)
  assert.match(l4.matiz, /más de 15/)
  assert.match(a40.matiz, /2 o 3 servidores/)
  assert.equal(h200.dato, 'Acceso anunciado')
  assert.match(h200.matiz, /sin confirmar/)
  assert.equal(csa.cronologia.length, 1)
})

test('las fases futuras se etiquetan como previsiones y no se inventan hitos desde fuentes', () => {
  const sitio = {
    id: 'ejemplo', nombre: 'Ejemplo', estado: 'anunciado',
    ultima_verificacion: '2026-10-14', fecha_puesta_en_servicio: '2027',
    fuentes: [{ id: 'fuente', fecha_publicacion: '2026-10-10' }],
    fases: [
      { nombre: 'Primera fase', estado: 'en_construccion', fecha_puesta_en_servicio: '2027', fuentes: ['fuente'] },
      { nombre: 'Sin fuente', estado: 'operativo', fecha_puesta_en_servicio: '2025', fuentes: [] },
    ],
  }
  const { cronologia } = presentacionProyecto(sitio)
  assert.equal(cronologia.length, 1)
  assert.equal(cronologia[0].fecha, '2027')
  assert.equal(cronologia[0].prevista, true)
  assert.match(cronologia[0].titulo, /prevista/)
})


test('los actos de Meta y el diseño de Nostrum no se presentan como aperturas', () => {
  const meta = presentacionProyecto(ficha('meta-talavera-de-la-reina-torrehierro'))
  assert.equal(meta.cronologia.length, 6)
  assert.ok(meta.cronologia.every((e) => !e.prevista && !e.titulo.includes('Puesta en servicio')))
  const dir = meta.cronologia.find((e) => e.titulo === 'Declaración de Interés Regional (DIR)')
  assert.equal(dir.fecha, '2022-06-20')
  const nostrum = presentacionProyecto(ficha('nostrum-guadalajara-el-ruisenor'))
  const diseno = nostrum.cronologia.find((e) => e.titulo === 'Fase de diseño')
  assert.equal(diseno.prevista, true)
})


test('los hitos administrativos distinguen publicación y resolución', () => {
  const { cronologia } = presentacionProyecto(ficha('meta-talavera-de-la-reina-torrehierro'))
  const dia = cronologia.find((e) => e.fecha === '2024-03-22')
  const psi = cronologia.find((e) => e.fecha === '2024-10-22')
  const expropiacion = cronologia.find((e) => e.fecha === '2025-12-23')
  assert.match(dia.titulo, /^Publicación/)
  assert.match(dia.detalle, /20\/03\/2024/)
  assert.match(psi.titulo, /^Publicación/)
  assert.match(psi.detalle, /14 de octubre/)
  assert.match(expropiacion.titulo, /^Publicación/)
  assert.match(expropiacion.detalle, /05\/12\/2025/)
})

test('los PPA de operador se separan del vínculo físico y null no vincula activos', () => {
  const activos = [
    { id: 'otra-planta', contraparte_ppa: null, cpds_relacionados: ['otro-cpd'] },
    { id: 'planta-propia', contraparte_ppa: null, cpds_relacionados: ['cpd'] },
    { id: 'ppa-corporativo', contraparte_ppa: 'Empresa', cpds_relacionados: [] },
    { id: 'ppa-asignado', contraparte_ppa: 'Empresa', cpds_relacionados: ['cpd'] },
  ]
  const sinOperador = vinculosEnergiaProyecto({ id: 'sin-operador', operador: null }, activos)
  assert.deepEqual(sinOperador, { emplazamiento: [], operador: [] })
  const conOperador = vinculosEnergiaProyecto({ id: 'cpd', operador: 'Empresa' }, activos)
  assert.deepEqual(conOperador.emplazamiento.map((a) => a.id), ['planta-propia', 'ppa-asignado'])
  assert.deepEqual(conOperador.operador.map((a) => a.id), ['ppa-corporativo'])
})
