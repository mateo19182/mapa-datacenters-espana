import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, rmSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { extraerContenido, compararContenido, guardarComparacion, primerCambio } from './source-content.mjs'
import { registrarLectura, aceptarPendiente } from './source-state.mjs'
import { huellaContenido } from './source-check.mjs'

const pagina = (mw, pie = '2025', nav = 'Inicio') => `<html><head><title>Centro Madrid</title><script>ignorar()</script></head><body><nav>${nav}</nav><main><header><h1>Madrid</h1><time>2026-10-17</time></header><p>Capacidad IT: ${mw} MW &amp; dos salas.</p><script>otro()</script></main><footer>${pie}</footer></body></html>`
const extraer = (html) => extraerContenido(Buffer.from(html), 'text/html')
const lectura = (html) => ({ estado: 'ok', ...huellaContenido(Buffer.from(html), 'text/html'), contenido: extraer(html) })

test('HTML extraction preserves factual headers, decodes entities and separates site navigation', () => {
  const contenido = extraer(pagina(20))
  assert.match(contenido.principal, /2026-10-17/)
  assert.match(contenido.principal, /20 MW & dos salas/)
  assert.doesNotMatch(contenido.principal, /Inicio|2025|ignorar|otro/)
  assert.match(contenido.texto, /Inicio/)
  const c = compararContenido(contenido, extraer(pagina(20, '2026', 'Contacto')), { referencia: 'aceptada', fecha: '2026-10-10' })
  assert.equal(c.clase, 'plantilla')
  assert.equal(c.referencia, 'aceptada')
})

test('a changed capacity stays substantive even when the footer changes too', () => {
  const c = compararContenido(extraer(pagina(20)), extraer(pagina(48, '2026')))
  assert.equal(c.clase, 'contenido')
  assert.match(c.antes, /20/)
  assert.match(c.despues, /48/)
  assert.doesNotMatch(c.despues, /2026$/)
})

test('pages without a main or article are never labelled template-only from matching subsets', () => {
  const a = extraer('<body><p>20 MW</p><footer>2025</footer></body>')
  assert.equal(a.principal, null)
  assert.equal(compararContenido(a, extraer('<body><p>48 MW</p><footer>2026</footer></body>')).clase, 'contenido')
  const larga = extraer(pagina(20) + 'a'.repeat(210000))
  assert.equal(larga.truncada, true)
  assert.notEqual(compararContenido(larga, extraer(pagina(20, '2026') + 'a'.repeat(210000))).clase, 'plantilla')
  const prefijo = '<main>' + 'texto '.repeat(40000)
  assert.equal(compararContenido(extraer(prefijo + '20 MW</main>'), extraer(prefijo + '48 MW</main>')).clase, 'sin_comparacion')
})

test('PDF comparison identifies changed pages and missing extraction remains explicit', () => {
  const extraerPdf = (texto) => extraerContenido(Buffer.from('%PDF-1.4'), 'application/pdf', { ejecutarPdf: () => ({ status: 0, stdout: texto }) })
  const c = compararContenido(extraerPdf('Primera página\f20 MW\f'), extraerPdf('Primera página\f48 MW\f'))
  assert.deepEqual(c.paginas, [2])
  assert.equal(c.clase, 'contenido')
  const sinTexto = extraerContenido(Buffer.from('%PDF-1.4'), 'application/pdf', { ejecutarPdf: () => ({ status: 1 }) })
  assert.equal(compararContenido(sinTexto, sinTexto).clase, 'sin_comparacion')
})

test('public excerpts retain at most 24 source words across both versions', () => {
  const c = primerCambio(Array.from({ length: 200 }, (_, i) => `a${i}`).join(' '), Array.from({ length: 200 }, (_, i) => `b${i}`).join(' '))
  assert.equal(c.palabras_antes, 200)
  assert.equal(c.palabras_despues, 200)
  assert.equal((c.antes + ' ' + c.despues).split(/\s+/).length, 24)
  const denso = primerCambio('a'.repeat(10000), 'b'.repeat(10000))
  assert.equal(denso.antes.length, 240)
  assert.equal(denso.despues.length, 240)
})

test('minified JSON exposes the changed field while property-order changes remain formatting hints', () => {
  const extraerJson = (dato) => extraerContenido(Buffer.from(JSON.stringify(dato)), 'application/json')
  const a = extraerJson({ id: 2983, phase: 'SCRUTINY', celex: null })
  const ordenado = extraerJson({ celex: null, phase: 'SCRUTINY', id: 2983 })
  assert.equal(compararContenido(a, ordenado).clase, 'formato')
  const c = compararContenido(a, extraerJson({ id: 2983, phase: 'PUBLISHED', celex: null }))
  assert.match(c.antes, /SCRUTINY/)
  assert.match(c.despues, /PUBLISHED/)
})

test('snapshots cannot manufacture historical text and never accept a pending fingerprint', (t) => {
  const directorio = mkdtempSync(join(tmpdir(), 'mapa-fuentes-'))
  t.after(() => rmSync(directorio, { recursive: true, force: true }))
  const url = 'https://example.org/centro', hoy = '2026-10-17'
  const a = lectura(pagina(20)), b = lectura(pagina(48)), c = lectura(pagina(50))
  let estado = { hash: 'old-no-text', longitud: 20, visto: '2026-08-31' }
  const primera = guardarComparacion(url, a, estado, { directorio, hoy })
  assert.equal(primera.clase, 'sin_comparacion')
  estado = registrarLectura(estado, { ...a, comparacion: primera }, hoy).estado
  const repetida = guardarComparacion(url, a, estado, { directorio, hoy: '2026-10-18' })
  assert.equal(repetida.clase, 'sin_comparacion')
  const segunda = guardarComparacion(url, b, estado, { directorio, hoy: '2026-10-19' })
  assert.equal(segunda.clase, 'contenido')
  assert.equal(segunda.referencia, 'observacion')
  assert.equal(segunda.fecha, '2026-10-18')
  estado = registrarLectura(estado, { ...b, comparacion: segunda }, '2026-10-19').estado
  assert.equal(estado.hash, 'old-no-text')
  assert.equal(estado.pendiente.comparacion.referencia, 'observacion')
  estado = aceptarPendiente(estado, '2026-10-20')
  const tercera = guardarComparacion(url, c, estado, { directorio, hoy: '2026-10-21' })
  assert.equal(tercera.referencia, 'aceptada')
  assert.equal(estado.hash, b.hash)
  const cache = JSON.parse(readFileSync(join(directorio, readdirSync(directorio)[0]), 'utf8'))
  assert(cache.versiones.length <= 3)
  assert(!JSON.stringify(estado).includes('Capacidad IT'))
})

test('a cached accepted page allows a full comparison and template hints stay pending', (t) => {
  const directorio = mkdtempSync(join(tmpdir(), 'mapa-fuentes-'))
  t.after(() => rmSync(directorio, { recursive: true, force: true }))
  const url = 'https://example.org/centro', a = lectura(pagina(20)), b = lectura(pagina(20, '2026'))
  const previa = registrarLectura(null, a, '2026-10-17').estado
  guardarComparacion(url, a, null, { directorio, hoy: '2026-10-17' })
  const comparacion = guardarComparacion(url, b, previa, { directorio, hoy: '2026-10-18' })
  assert.equal(comparacion.clase, 'plantilla')
  const siguiente = registrarLectura(previa, { ...b, comparacion }, '2026-10-18').estado
  assert.equal(siguiente.hash, a.hash)
  assert.equal(siguiente.pendiente.hash, b.hash)
})

test('a later PDF change is compared against its saved observation even while the baseline uses size', (t) => {
  const directorio = mkdtempSync(join(tmpdir(), 'mapa-fuentes-'))
  t.after(() => rmSync(directorio, { recursive: true, force: true }))
  const url = 'https://example.org/a.pdf'
  const a = { estado: 'ok', hash: 'bin-sha256:B', longitud: 20, contenido: { formato: 'pdf', texto: 'Capacidad 20 MW', principal: null, truncada: false } }
  const b = { ...a, hash: 'bin-sha256:C', contenido: { ...a.contenido, texto: 'Capacidad 48 MW' } }
  const original = { hash: 'bin:100', longitud: 0, visto: '2026-10-10' }
  const primera = guardarComparacion(url, a, original, { directorio, hoy: '2026-10-17' })
  assert.equal(primera.clase, 'metodo')
  const previa = registrarLectura(original, { ...a, comparacion: primera }, '2026-10-17').estado
  const comparacion = guardarComparacion(url, b, previa, { directorio, hoy: '2026-10-18' })
  assert.equal(comparacion.clase, 'contenido')
  assert.equal(comparacion.referencia, 'observacion')
  assert.match(comparacion.despues, /48/)
  assert.equal(previa.hash, 'bin:100')
})

test('malformed cache entries cannot manufacture a comparison or stop a fresh source observation', (t) => {
  const directorio = mkdtempSync(join(tmpdir(), 'mapa-fuentes-'))
  t.after(() => rmSync(directorio, { recursive: true, force: true }))
  const url = 'https://example.org/a', a = lectura(pagina(20)), b = lectura(pagina(48))
  guardarComparacion(url, a, null, { directorio, hoy: '2026-10-17' })
  const ruta = join(directorio, readdirSync(directorio)[0])
  writeFileSync(ruta, JSON.stringify({ version: 1, url, versiones: [null, { hash: a.hash, visto: '2026-10-17', texto: 42 }] }))
  assert.equal(guardarComparacion(url, b, { hash: a.hash }, { directorio, hoy: '2026-10-18' }).clase, 'sin_comparacion')
})
