import test from 'node:test'
import assert from 'node:assert/strict'
import { cargarSitios } from './load.mjs'
import { etiquetaFechaServicio, presentacionProyecto, vinculosEnergiaProyecto } from '../src/lib/proyecto-presentacion.js'

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
  assert.equal(cronologia[0].titulo, 'Puesta en servicio · Primera fase')
  assert.doesNotMatch(cronologia[0].titulo, /prevista|previsión/)
})

test('los calendarios retirados de Forestalia y Vantage permanecen fuera de la cronología activa', () => {
  for (const id of ['forestalia-alfamen-dcm-blue', 'forestalia-botorrita-dcm-dedalo', 'vantage-villanueva-de-gallego-el-olivar']) {
    const sitio = ficha(id)
    const fases = structuredClone(sitio.fases)
    assert.ok(sitio.fases.length > 0)
    assert.ok(sitio.fases.every((fase) => ['cancelado', 'paralizado'].includes(fase.estado)))
    assert.deepEqual(presentacionProyecto(sitio).cronologia, [])
    assert.deepEqual(sitio.fases, fases, 'el historial de fases se conserva íntegro')
  }
})

test('se omiten previsiones de fase paralizadas sin ocultar aperturas reales ni previsiones activas', () => {
  const sitio = {
    id: 'ejemplo', nombre: 'Ejemplo', fuentes: [{ id: 'fuente' }],
    fases: [
      { nombre: 'Abierta', estado: 'operativo', fecha_puesta_en_servicio: '2025', fuentes: ['fuente'] },
      { nombre: 'Activa', estado: 'en_construccion', fecha_puesta_en_servicio: '2027', fuentes: ['fuente'] },
      { nombre: 'Retirada', estado: 'cancelado', fecha_puesta_en_servicio: '2028', fuentes: ['fuente'] },
      { nombre: 'Suspendida', estado: 'paralizado', fecha_puesta_en_servicio: '2029', fuentes: ['fuente'] },
    ],
  }
  const { cronologia } = presentacionProyecto(sitio)
  assert.deepEqual(cronologia.map((e) => e.fecha), ['2027', '2025'])
  assert.equal(cronologia[0].prevista, true)
  assert.equal(cronologia[1].prevista, false)
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

test('Correfoc usa la fecha de servicio y TalaIA conserva el periodo sin inventar un día', () => {
  const upf = presentacionProyecto(ficha('upf-barcelona-correfoc')).cronologia
  assert.equal(upf.length, 1)
  assert.equal(upf[0].fecha, '2026-07-01')
  assert.match(upf[0].detalle, /publicado el 9 de julio/)
  const uib = presentacionProyecto(ficha('uib-palma-talaia')).cronologia
  assert.equal(uib.length, 1)
  assert.equal(uib[0].fecha, '2026')
  assert.match(uib[0].titulo, /primer semestre/)
  assert.match(uib[0].detalle, /No da un día exacto/)
})

test('los nuevos hitos separan adquisiciones, actos y previsiones vencidas de operación', () => {
  const nxn = presentacionProyecto(ficha('nxn-madrid-juan-carlos-i')).cronologia
  assert.equal(nxn.find((e) => e.fecha === '2026-04-23').prevista, undefined)
  const apertura = nxn.find((e) => e.fecha === '2026-09')
  assert.equal(apertura.prevista, true)
  assert.match(apertura.detalle, /sin confirmación de apertura/)
  const adc = presentacionProyecto(ficha('nabiax-alcala-de-henares-adc')).cronologia.find((e) => e.fecha === '2026-09-18')
  assert.match(adc.titulo, /Acto de primera piedra/)
  assert.match(adc.detalle, /no certifica avance físico/)
  const b200 = presentacionProyecto(ficha('scbi-uma-malaga-picasso')).cronologia.find((e) => e.fecha === '2026-07-10')
  assert.match(b200.titulo, /Publicación de la adquisición/)
  assert.match(b200.detalle, /No publica fecha de puesta en producción/)
  const cesga = presentacionProyecto(ficha('cesga-santiago-a-sionlla')).cronologia
  assert.match(cesga.find((e) => e.fecha === '2026-03-03').titulo, /Adjudicación/)
  assert.equal(cesga.find((e) => e.fecha === '2026-06-12').prevista, true)
})

test('CESGA muestra primero los equipos de la nueva sede sin atribuirle el inventario anterior', () => {
  const { hardware } = presentacionProyecto(ficha('cesga-santiago-a-sionlla'))
  assert.equal(hardware[0].modelo, 'FinisTerrae IV')
  assert.match(hardware[0].dato, /servicio sin confirmar/)
  assert.match(hardware[1].dato, /54 y 5 cúbits previstos/)
  assert.equal(hardware.length, 2)
  const anterior = presentacionProyecto(ficha('cesga-santiago-campus-sur'))
  assert.match(anterior.resumen, /No se ha confirmado su permanencia/)
  assert.match(anterior.hardware[0].dato, /128 o 141 A100/)
  assert.ok(hardware.every((h) => h.fuentes.length > 0))
})

test('las fechas futuras o no confirmadas se llaman previsiones y las aperturas reales se conservan', () => {
  const corte = '2026-10-16'
  assert.equal(etiquetaFechaServicio(ficha('cartagena-data-green-escombreras'), corte), 'Puesta en servicio prevista')
  assert.equal(etiquetaFechaServicio(ficha('nxn-valencia-vara-de-quart-nx01'), corte), 'Puesta en servicio prevista')
  assert.equal(etiquetaFechaServicio(ficha('merlin-edged-ribera-baja-arasur'), corte), 'Puesta en servicio')
  assert.equal(etiquetaFechaServicio({ estado: 'anunciado', fecha_puesta_en_servicio: '2025' }, corte), 'Puesta en servicio prevista')
  assert.equal(etiquetaFechaServicio({ estado: 'cancelado', fecha_puesta_en_servicio: '2028' }, corte), 'Previsión retirada')
  const meta = ficha('meta-talavera-de-la-reina-torrehierro')
  const dia = meta.fases.find((f) => f.nombre === 'Declaración de Impacto Ambiental')
  assert.equal(etiquetaFechaServicio(dia, corte, meta.id), 'Hito administrativo')
})
