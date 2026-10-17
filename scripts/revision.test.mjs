import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import YAML from 'yaml'
import { fusionarHuellas, estadoFuente, validarBorradoresAnadidos, prepararRevision, finPeriodo, plazoRevision } from './revision.mjs'
import { generarRss } from '../src/lib/rss.js'
import { pistasRevision, colaRevision } from '../src/lib/revision-presentacion.js'
import { registrarLectura } from './source-state.mjs'
const candidato = (extra = {}) => ({ id:'caso-prueba', titulo:'Hallazgo de prueba', tipo:'proyecto', estado:'detected', prioridad:'alta', detectado:'2026-10-12', revisar_antes:'2026-10-13', motivo:'Se necesita una fuente para identificar el edificio.', siguiente_paso:'Localizar la fuente original.', enlaces:[], fuentes:[{url:'https://example.org/nota',titulo:'Una pista',primaria:false}], ...extra })
test('merging observations preserves accepted fingerprints and unresolved evidence', () => {
  const base = { 'https://a':{hash:'aceptada',longitud:10,visto:'2026-08-31',pendiente:{hash:'cambio',longitud:12,detectado:'2026-09-01',visto:'2026-09-10'}} }
  const observaciones = { 'https://a':{hash:'otra-base',longitud:14,visto:'2026-10-12'}, 'https://b':{ultimo_fallo:'2026-10-12',clase:'rota',motivo:'HTTP 404'} }
  const resultado=fusionarHuellas(base,observaciones)
  assert.equal(resultado['https://a'].hash,'aceptada')
  assert.equal(resultado['https://a'].pendiente.hash,'otra-base')
  assert.equal(estadoFuente(resultado['https://a']).fecha,'2026-10-12')
  assert.equal(estadoFuente(resultado['https://a']).cambio_pendiente,true)
  assert.equal(estadoFuente(resultado['https://b']).clase,'rota')
  assert.equal(base['https://a'].pendiente.hash,'cambio')
  assert.deepEqual(fusionarHuellas(resultado,{'https://a':base['https://a']}),resultado)
})

test('weekly runs seeded from an unmerged PR keep their baseline and first detection date', () => {
  const url = 'https://example.org/fuente'
  const main = { [url]: { hash: 'revisada', longitud: 10, visto: '2026-09-01' } }
  const primerPr = { [url]: registrarLectura(main[url], { estado: 'ok', hash: 'cambio', longitud: 20 }, '2026-10-05').estado }
  const semilla = fusionarHuellas(main, primerPr)
  const segundaSemana = registrarLectura(semilla[url], { estado: 'ok', hash: 'cambio', longitud: 20 }, '2026-10-12').estado
  assert.equal(segundaSemana.hash, 'revisada')
  assert.equal(segundaSemana.pendiente.detectado, '2026-10-05')
  assert.equal(segundaSemana.pendiente.visto, '2026-10-12')
  const urlNueva = { 'https://example.org/nueva': { hash: 'primera', longitud: 1, visto: '2026-10-05' } }
  const seedNueva = fusionarHuellas(main, urlNueva)
  assert.equal(registrarLectura(seedNueva['https://example.org/nueva'], { estado: 'ok', hash: 'segunda', longitud: 2 }, '2026-10-12').resultado, 'cambiada')
  assert.equal(main[url].pendiente, undefined)
})

test('an older branch baseline can still report a newer observation of the content accepted in main', () => {
  const main = { 'https://a': { hash: 'B', longitud: 20, visto: '2026-10-11', aceptado: '2026-10-12', pendiente: { hash: 'C', longitud: 30, detectado: '2026-10-15', visto: '2026-10-15' } } }
  const rama = { 'https://a': { hash: 'A', longitud: 10, visto: '2026-10-01', pendiente: { hash: 'B', longitud: 20, detectado: '2026-10-11', visto: '2026-10-17' } } }
  const fusion = fusionarHuellas(main, rama)['https://a']
  assert.equal(fusion.hash, 'B')
  assert.equal(fusion.visto, '2026-10-17')
  assert.equal(fusion.aceptado, '2026-10-12')
  assert.equal(fusion.pendiente, undefined, 'the latest observation restores accepted content')
  assert.equal(main['https://a'].pendiente.hash, 'C')
})

test('a newer connection failure cannot erase an older unresolved content observation', () => {
  const url = 'https://example.org/fuente'
  const main = { [url]: { hash: 'A', longitud: 10, visto: '2026-10-10', aceptado: '2026-10-11', clase: 'error', motivo: 'fetch failed', ultimo_fallo: '2026-10-17' } }
  const rama = { [url]: { hash: 'A', longitud: 10, visto: '2026-10-10', pendiente: { hash: 'B', longitud: 20, detectado: '2026-10-15', visto: '2026-10-16' } } }
  const originales = structuredClone({ main, rama })
  const fusion = fusionarHuellas(main, rama)[url]
  assert.equal(fusion.hash, 'A')
  assert.equal(fusion.aceptado, '2026-10-11')
  assert.equal(fusion.pendiente.hash, 'B')
  assert.equal(fusion.pendiente.detectado, '2026-10-15')
  assert.equal(fusion.pendiente.visto, '2026-10-16')
  assert.equal(fusion.ultimo_fallo, '2026-10-17')
  assert.deepEqual(estadoFuente(fusion), { clase: 'error', fecha: '2026-10-17', motivo: 'fetch failed', cambio_pendiente: true })
  assert.deepEqual({ main, rama }, originales)
})

test('content and health merge independently when either branch owns the latest failure', () => {
  const url = 'https://example.org/fuente'
  const principal = { hash: 'A', longitud: 10, visto: '2026-10-01', aceptado: '2026-10-02' }
  const temprana = { hash: 'B', longitud: 20, detectado: '2026-10-05', visto: '2026-10-16' }
  const reciente = { hash: 'B', longitud: 20, detectado: '2026-10-10', visto: '2026-10-18' }
  const fallo = { clase: 'bloqueada', motivo: 'HTTP 403', ultimo_fallo: '2026-10-19' }
  for (const falloEnMain of [true, false]) {
    const main = { [url]: { ...principal, pendiente: reciente, ...(falloEnMain ? fallo : {}) } }
    const rama = { [url]: { ...principal, pendiente: temprana, ...(!falloEnMain ? fallo : {}) } }
    const fusion = fusionarHuellas(main, rama)[url]
    assert.equal(fusion.hash, 'A')
    assert.equal(fusion.aceptado, '2026-10-02')
    assert.deepEqual(fusion.pendiente, { hash: 'B', longitud: 20, detectado: '2026-10-05', visto: '2026-10-18' })
    assert.equal(estadoFuente(fusion).clase, 'bloqueada')
    assert.equal(fusion.ultimo_fallo, '2026-10-19')
  }
})

test('a later accepted-content observation clears the older pending version while retaining a still newer failure', () => {
  const url = 'https://example.org/fuente'
  const main = { [url]: { hash: 'B', longitud: 20, visto: '2026-10-11', aceptado: '2026-10-12', pendiente: { hash: 'C', longitud: 30, detectado: '2026-10-15', visto: '2026-10-15' }, clase: 'error', motivo: 'HTTP 503', ultimo_fallo: '2026-10-18' } }
  const rama = { [url]: { hash: 'A', longitud: 10, visto: '2026-10-01', pendiente: { hash: 'B', longitud: 20, detectado: '2026-10-11', visto: '2026-10-17' } } }
  const fusion = fusionarHuellas(main, rama)[url]
  assert.equal(fusion.hash, 'B')
  assert.equal(fusion.visto, '2026-10-17')
  assert.equal(fusion.aceptado, '2026-10-12')
  assert.equal(fusion.pendiente, undefined)
  assert.deepEqual(estadoFuente(fusion), { clase: 'error', fecha: '2026-10-18', motivo: 'HTTP 503' })
  const recuperada = fusionarHuellas({ [url]: fusion }, { [url]: { hash: 'B', longitud: 20, visto: '2026-10-20' } })[url]
  assert.equal(recuperada.visto, '2026-10-20')
  assert.equal(recuperada.aceptado, '2026-10-12')
  assert.equal(recuperada.ultimo_fallo, undefined)
  assert.equal(estadoFuente(recuperada).clase, 'viva')
})

test('initial observations survive a newer failure without importing an unmerged acceptance', () => {
  const url = 'https://example.org/nueva'
  const main = { [url]: { clase: 'error', motivo: 'fetch failed', ultimo_fallo: '2026-10-19' } }
  const rama = { [url]: { hash: 'primera', longitud: 10, visto: '2026-10-10', aceptado: '2026-10-11', pendiente: { hash: 'segunda', longitud: 20, detectado: '2026-10-15', visto: '2026-10-16' } } }
  const fusion = fusionarHuellas(main, rama)[url]
  assert.equal(fusion.hash, 'primera')
  assert.equal(fusion.aceptado, undefined)
  assert.equal(fusion.pendiente.hash, 'segunda')
  assert.equal(fusion.ultimo_fallo, '2026-10-19')
})

test('same-day date-only observations cannot silently resolve a pending change', () => {
  const url = 'https://example.org/fuente'
  const main = { [url]: { hash: 'A', longitud: 10, visto: '2026-10-01', pendiente: { hash: 'B', longitud: 20, detectado: '2026-10-15', visto: '2026-10-17' } } }
  const rama = { [url]: { hash: 'A', longitud: 10, visto: '2026-10-17' } }
  const fusion = fusionarHuellas(main, rama)[url]
  assert.equal(fusion.hash, 'A')
  assert.equal(fusion.visto, '2026-10-17')
  assert.equal(fusion.pendiente.hash, 'B')
  assert.equal(fusion.pendiente.detectado, '2026-10-15')
})

test('technical checks cannot renew factual review dates or turn a candidate into a publication', () => {
  const sitio={id:'sitio-prueba',nombre:'Proyecto',estado:'en_construccion',ultima_verificacion:'2026-08-31',fuentes:[{id:'s1',url:'https://example.org/nota',titulo:'Nota'}],fases:[]}
  const revision=prepararRevision([candidato()],{sitios:[sitio],huellas:{'https://example.org/nota':{hash:'igual',longitud:3,visto:'2026-10-14'}},hoy:'2026-10-14'})
  assert.equal(revision.revision_factual.registros[0].ultima_revision_registrada,'2026-08-31')
  assert.equal(revision.revision_factual.registros[0].revisar_antes,'2026-09-14')
  assert.equal(revision.hallazgos[0].estado,'detected')
  assert.equal(revision.hallazgos[0].vencido,true)
  assert.equal(revision.comprobacion_automatica.ultima_observacion,'2026-10-14')
  assert.throws(()=>prepararRevision([candidato({estado:'published',revisado:'2026-10-14',enlaces:[{href:'/proyecto/inexistente',texto:'Ficha'}]})],{hoy:'2026-10-14'}),/inexistente/)
})
test('scheduled research may append proposals but cannot overwrite decisions, remove entries or publish', () => {
  const viejo=candidato(),nuevo=candidato({id:'nuevo-hallazgo',estado:'proposed',fuentes:[{url:'https://example.org/documento',titulo:'Documento original',primaria:true}]})
  assert.equal(validarBorradoresAnadidos([viejo],[viejo,nuevo]).length,2)
  assert.throws(()=>validarBorradoresAnadidos([viejo],[{...viejo,estado:'discarded'}]),/cambiar ni borrar/)
  assert.throws(()=>validarBorradoresAnadidos([viejo],[]),/cambiar ni borrar/)
  assert.throws(()=>validarBorradoresAnadidos([],[nuevo],[nuevo]),/ya registrado/)
  assert.throws(()=>validarBorradoresAnadidos([],[candidato({estado:'published',revisado:'2026-10-14',enlaces:[{href:'/proyecto/algo',texto:'Ficha'}]})]),/no puede resolver/)
})
test('review windows depend on activity and partial forecasts expire at period end', () => {
  assert.equal(plazoRevision('operativo'),90)
  assert.equal(plazoRevision('en_construccion'),14)
  assert.equal(plazoRevision('consulta_previa','normativa'),14)
  assert.equal(plazoRevision('adoptada_en_control','normativa'),14)
  assert.equal(finPeriodo('2026'),'2026-12-31')
  assert.equal(finPeriodo('2026-09'),'2026-09-30')
  assert.equal(finPeriodo('2028-02'),'2028-02-29')
  const real=YAML.parse(readFileSync(new URL('../data/sites/meta-talavera-de-la-reina-torrehierro.yaml',import.meta.url),'utf8'))
  const revision=prepararRevision([],{sitios:[real],hoy:'2026-10-14'})
  assert.equal(revision.hitos_vencidos.length,0,'administrative milestones are not overdue openings')
})
test('retired site forecasts do not become overdue openings through the fallback', () => {
  const sitios=['cancelado','paralizado','operativo','anunciado'].map((estado)=>({
    id:`sitio-${estado}`,nombre:`Proyecto ${estado}`,estado,
    fecha_puesta_en_servicio:'2026-09',ultima_verificacion:'2026-10-14',fuentes:[],fases:[],
  }))
  const revision=prepararRevision([],{sitios,hoy:'2026-10-14'})
  assert.deepEqual(revision.hitos_vencidos.map((h)=>h.id),['sitio-anunciado'])
  assert.ok(revision.revision_factual.registros.some((r)=>r.id==='sitio-paralizado'),'el proyecto sigue sujeto a revisión factual')
})
test('RSS escapes XML and contains only supplied reviewed entries with stable permalinks', () => {
  const xml=generarRss([{id:'a',fecha:'2026-10-14',fecha_hecho:'2026-09-22',titulo:'A & B <avance>',resumen:'Texto "publicado" <script>\u0001'}])
  assert.ok(xml.includes('A &amp; B &lt;avance&gt;'))
  assert.ok(xml.includes('Texto &quot;publicado&quot; &lt;script&gt;'))
  assert.ok(xml.includes('<guid isPermaLink="true">https://datacenters.m19182.dev/actualizaciones#a</guid>'))
  assert.ok(!xml.includes('\u0001'))
  assert.equal((xml.match(/<item>/g)??[]).length,1)
  assert.equal((generarRss([]).match(/<item>/g)??[]).length,0)
})

test('la cola incorpora las pistas anteriores una vez y conserva los antecedentes de seguimientos existentes', () => {
  const pendientes = {
    proyectos: [{ municipio: 'Méntrida', compania: null, prioridad: 'alta', nota: 'Antecedente eléctrico sin operador del centro.' }, { municipio: 'Granada', provincia: 'Granada', ccaa: 'Andalucía', compania: 'DataRush', potencia_citada: '20 MW sin verificar', prioridad: 'baja', nota: 'Edificio sin localizar.' }],
    pistas: ['MasOrange: inventario de centros sin localizar.'],
  }
  const pistas = pistasRevision(pendientes)
  const hallazgos = [candidato({ id: 'mentrida-venero-con09' }), candidato({ id: 'masorange-inventario-centros', estado: 'published' })]
  const cola = colaRevision({ hallazgos, pistas })
  assert.equal(pistas.length, 3)
  assert.equal(cola.length, 3)
  assert.equal(cola.filter((h) => h.vista === 'pendientes').length, 2)
  assert.equal(cola.find((h) => h.id === 'mentrida-venero-con09').antecedentes[0].motivo, pendientes.proyectos[0].nota)
  assert.equal(cola.find((h) => h.id === 'masorange-inventario-centros').vista, 'historial')
  const antigua = cola.find((h) => h.origen === 'cobertura')
  assert.equal(antigua.detectado, undefined, 'no se inventa una fecha de detección')
  assert.deepEqual(antigua.fuentes, [], 'una pista sin cita no se convierte en fuente primaria')
  assert.equal(antigua.ccaa, 'Andalucía')
  assert.equal(antigua.potencia_citada, '20 MW sin verificar')
  assert.equal(hallazgos[0].antecedentes, undefined, 'se conservan las decisiones de origen')
})
