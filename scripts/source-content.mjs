import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'parse5'

const LIMITE_TEXTO = 200000
const hash = (texto) => createHash('sha256').update(texto).digest('hex').slice(0, 16)
const limpiar = (texto) => texto.replace(/\s+/g, ' ').trim()
const omitidos = new Set(['script', 'style', 'noscript', 'template', 'head'])
const bloques = new Set(['p', 'div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside', 'li', 'tr', 'h1', 'h2', 'h3', 'h4', 'br'])
const atributo = (nodo, nombre) => nodo.attrs?.find((a) => a.name === nombre)?.value
function buscar(nodo, etiqueta, salida = []) {
  if (nodo.tagName === etiqueta) salida.push(nodo)
  else for (const hijo of nodo.childNodes ?? []) buscar(hijo, etiqueta, salida)
  return salida
}
function extraer(nodo, principal = false) {
  if (omitidos.has(nodo.tagName)) return ''
  if (principal && (['nav', 'footer', 'aside'].includes(nodo.tagName) ||
      ['navigation', 'complementary'].includes(atributo(nodo, 'role')))) return ''
  if (atributo(nodo, 'aria-hidden') === 'true' || nodo.attrs?.some((a) => a.name === 'hidden')) return ''
  if (nodo.nodeName === '#text') return nodo.value
  const texto = (nodo.childNodes ?? []).map((hijo) => extraer(hijo, principal)).join('')
  return bloques.has(nodo.tagName) ? `\n${texto}\n` : texto
}
const lineas = (texto) => texto.split('\n').map(limpiar).filter(Boolean).join('\n')

// The full-page fingerprint remains unchanged. These snapshots explain observed
// differences; an unchanged <main> is only a template-change hint, never acceptance.
export function extraerContenido(contenido, tipo, { ejecutarPdf = spawnSync } = {}) {
  if (/html/i.test(tipo)) {
    const doc = parse(contenido.toString('utf8'))
    const titulo = buscar(doc, 'title').map((n) => lineas(extraer(n))).join('\n')
    const cuerpo = buscar(doc, 'body')[0] ?? doc
    const principales = buscar(cuerpo, 'main')
    const elegidos = principales.length ? principales : buscar(cuerpo, 'article')
    const completo = lineas(`${titulo}\n${extraer(cuerpo)}`)
    const cuerpoPrincipal = elegidos.length ? lineas(elegidos.map((n) => extraer(n, true)).join('\n')) : null
    const principal = cuerpoPrincipal ? lineas(`${titulo}\n${cuerpoPrincipal}`) : null
    return { formato: 'html', texto: completo.slice(0, LIMITE_TEXTO), principal: principal?.slice(0, LIMITE_TEXTO) ?? null,
      truncada: completo.length > LIMITE_TEXTO || (principal?.length ?? 0) > LIMITE_TEXTO }
  }
  if (/pdf/i.test(tipo) || contenido.subarray(0, 5).toString() === '%PDF-') {
    const salida = ejecutarPdf('pdftotext', ['-layout', '-', '-'], {
      input: contenido, encoding: 'utf8', timeout: 10000, maxBuffer: 8 * 1024 * 1024,
    })
    if (salida.status !== 0 || !salida.stdout?.trim()) return { formato: 'pdf', texto: null, principal: null, truncada: false }
    const paginas = salida.stdout.split('\f').map(lineas)
    if (!paginas.at(-1)) paginas.pop()
    const texto = paginas.join('\f')
    return { formato: 'pdf', texto: texto.slice(0, LIMITE_TEXTO), principal: null, truncada: texto.length > LIMITE_TEXTO }
  }
  if (/text|xml|json/i.test(tipo)) {
    const texto = lineas(contenido.toString('utf8'))
    return { formato: 'texto', texto: texto.slice(0, LIMITE_TEXTO), principal: null, truncada: texto.length > LIMITE_TEXTO }
  }
  return null
}

// At most 24 source words are retained publicly. Full text stays in the ignored
// cache, with at most three versions per URL, and is never exported to the site.
export function primerCambio(antes, despues) {
  const a = antes.split(/\s+/).filter(Boolean), b = despues.split(/\s+/).filter(Boolean)
  let inicio = 0, finA = a.length, finB = b.length
  while (inicio < finA && inicio < finB && a[inicio] === b[inicio]) inicio++
  while (finA > inicio && finB > inicio && a[finA - 1] === b[finB - 1]) { finA--; finB-- }
  const acotar = (partes, fin) => partes.slice(inicio, Math.min(fin, inicio + 12)).join(' ')
  return { antes: acotar(a, finA), despues: acotar(b, finB), palabras_antes: finA - inicio, palabras_despues: finB - inicio }
}

export function compararContenido(anterior, actual, { referencia, fecha, hash_referencia } = {}) {
  if (!anterior?.texto || !actual?.texto) return { clase: 'sin_comparacion' }
  const mismaPrincipal = anterior.formato === 'html' && anterior.principal && actual.principal &&
    anterior.principal === actual.principal && !anterior.truncada && !actual.truncada
  const base = { referencia, fecha, ...(hash_referencia ? { hash_referencia } : {}), parcial: Boolean(anterior.truncada || actual.truncada) }
  if (mismaPrincipal && anterior.texto !== actual.texto) return { ...base, clase: 'plantilla', firma: hash(JSON.stringify(primerCambio(anterior.texto, actual.texto))), ...primerCambio(anterior.texto, actual.texto) }
  if (anterior.texto === actual.texto) return { ...base, clase: base.parcial ? 'sin_comparacion' : 'formato' }
  const a = anterior.principal ?? anterior.texto, b = actual.principal ?? actual.texto
  const paginasAntes = anterior.texto.split('\f'), paginasDespues = actual.texto.split('\f')
  const paginas = actual.formato === 'pdf' && anterior.formato === 'pdf'
    ? Array.from({ length: Math.max(paginasAntes.length, paginasDespues.length) }, (_, i) => i)
      .filter((i) => paginasAntes[i] !== paginasDespues[i]).map((i) => i + 1)
    : undefined
  return { ...base, clase: 'contenido', ...(paginas ? { paginas: paginas.slice(0, 20) } : {}), ...primerCambio(a, b) }
}

export function guardarComparacion(url, lectura, previa, { directorio, hoy }) {
  const ruta = join(directorio, `${hash(url)}.json`)
  let versiones = []
  if (existsSync(ruta)) {
    try {
      const guardado = JSON.parse(readFileSync(ruta, 'utf8'))
      if (guardado.version === 1 && guardado.url === url && Array.isArray(guardado.versiones)) {
        versiones = guardado.versiones.filter((v) => v && typeof v.hash === 'string' && v.hash &&
          /^\d{4}-\d{2}-\d{2}$/.test(v.visto ?? '') && Number.isFinite(Date.parse(v.visto)) &&
          new Date(v.visto).toISOString().slice(0, 10) === v.visto &&
          (v.texto == null || (typeof v.truncada === 'boolean' && ['html', 'pdf', 'texto'].includes(v.formato))) &&
          [v.texto, v.principal].every((t) => t == null || (typeof t === 'string' && t.length <= LIMITE_TEXTO))).slice(0, 3)
      }
    } catch { /* A lost or damaged cache never fabricates an earlier snapshot. */ }
  }
  const actual = { hash: lectura.hash, visto: hoy, ...lectura.contenido }
  const aceptada = versiones.find((v) => v.hash === previa?.hash)
  const observada = versiones.find((v) => v.hash === previa?.pendiente?.hash)
  const anterior = aceptada ?? observada
  let comparacion = null
  if (previa?.hash && previa.hash !== lectura.hash) {
    const migracion = previa.hash.startsWith('bin:') && lectura.hash.startsWith('bin-sha256:')
    if (previa.pendiente?.hash === lectura.hash && !aceptada) comparacion = previa.pendiente.comparacion ?? { clase: migracion ? 'metodo' : 'sin_comparacion' }
    else if (migracion && !anterior) comparacion = { clase: 'metodo' }
    else comparacion = compararContenido(anterior, actual, { referencia: aceptada ? 'aceptada' : 'observacion', fecha: anterior?.visto, hash_referencia: anterior?.hash })
  }
  const conservar = new Set([previa?.hash, previa?.pendiente?.hash, lectura.hash].filter(Boolean))
  versiones = [actual, ...versiones.filter((v) => v.hash !== actual.hash && conservar.has(v.hash))].slice(0, 3)
  mkdirSync(directorio, { recursive: true })
  writeFileSync(ruta, JSON.stringify({ version: 1, url, versiones }))
  return comparacion
}
