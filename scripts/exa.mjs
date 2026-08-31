// Buscador documental sobre la API de Exa.
//
// Herramienta de investigación, no de construcción: no la llama ningún paso del
// build ni escribe nada en `data/`. Sirve para localizar la fuente primaria de
// un dato —un boletín oficial, un expediente ambiental, una nota de la propia
// compañía— y traerse el texto literal con el que rellenar el campo `cita`.
//
// La regla del conjunto no cambia porque el hallazgo venga de un buscador: lo
// que se registra es la página encontrada, con su URL, su editor y su fecha, y
// nunca el resumen que el buscador haga de ella.
//
// Requiere EXA_API_KEY en el entorno (https://dashboard.exa.ai/api-keys).
//
//   node scripts/exa.mjs buscar "centro de datos Escatrón DayOne" --n 8 --texto
//   node scripts/exa.mjs buscar "declaración impacto ambiental centro de datos" \
//        --sitio dogc.gencat.cat --desde 2024-01-01
//   node scripts/exa.mjs contenido https://… --max 8000
//   node scripts/exa.mjs buscar "…" --json     # para encadenar con jq

const CLAVE = process.env.EXA_API_KEY
if (!CLAVE) {
  console.error('Falta EXA_API_KEY en el entorno.')
  process.exit(1)
}

const API = 'https://api.exa.ai'

// Dominios que publican fuente primaria. Se anotan en la salida para que se vea
// de un vistazo qué resultado puede sostener una cifra y cuál es solo eco.
const OFICIALES = [
  'boe.es', 'boa.aragon.es', 'gencat.cat', 'juntadeandalucia.es', 'jcyl.es',
  'castillalamancha.es', 'juntaex.es', 'madrid.org', 'comunidad.madrid',
  'gva.es', 'euskadi.eus', 'navarra.es', 'xunta.gal', 'larioja.org',
  'carm.es', 'asturias.es', 'cantabria.es', 'ree.es', 'miteco.gob.es',
  'sede.administracion.gob.es', 'contrataciondelestado.es',
]

const args = process.argv.slice(2)
const orden = args[0]

/** Lee `--clave valor` y `--bandera` de la línea de órdenes. */
function opcion(nombre, porDefecto = null) {
  const i = args.indexOf(`--${nombre}`)
  if (i === -1) return porDefecto
  const siguiente = args[i + 1]
  if (siguiente == null || siguiente.startsWith('--')) return true
  return siguiente
}

const sueltos = () => {
  const salida = []
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const siguiente = args[i + 1]
      if (siguiente != null && !siguiente.startsWith('--')) i++
      continue
    }
    salida.push(args[i])
  }
  return salida
}

async function pedir(ruta, cuerpo) {
  const r = await fetch(`${API}${ruta}`, {
    method: 'POST',
    headers: { 'x-api-key': CLAVE, 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })
  if (!r.ok) throw new Error(`Exa ${ruta} respondió ${r.status}: ${(await r.text()).slice(0, 300)}`)
  return r.json()
}

const dominio = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

const esOficial = (url) => {
  const d = dominio(url)
  return OFICIALES.some((o) => d === o || d.endsWith(`.${o}`))
}

const recortar = (texto, max) =>
  !texto ? '' : texto.replace(/\s+/g, ' ').trim().slice(0, max)

function imprimir(resultados, { max, verTexto }) {
  if (!resultados.length) {
    console.log('Sin resultados.')
    return
  }
  for (const [i, r] of resultados.entries()) {
    const marca = esOficial(r.url) ? ' [OFICIAL]' : ''
    const fecha = (r.publishedDate ?? '').slice(0, 10)
    console.log(`\n[${i + 1}] ${r.title ?? 'sin título'}${marca}`)
    console.log(`    ${r.url}`)
    console.log(`    ${dominio(r.url)}${fecha ? ` · ${fecha}` : ''}${r.author ? ` · ${r.author}` : ''}`)
    for (const h of r.highlights ?? []) console.log(`    » ${recortar(h, 400)}`)
    if (verTexto && r.text) console.log(`\n${recortar(r.text, max)}\n`)
  }
}

if (orden === 'buscar') {
  const consulta = sueltos().join(' ')
  if (!consulta) {
    console.error('Uso: node scripts/exa.mjs buscar "consulta" [--n 8] [--sitio dominio] [--desde YYYY-MM-DD] [--texto] [--json]')
    process.exit(1)
  }
  const n = Number(opcion('n', 8))
  const max = Number(opcion('max', 3000))
  const verTexto = opcion('texto') === true
  const sitio = opcion('sitio')

  const cuerpo = {
    query: consulta,
    numResults: n,
    type: opcion('tipo', 'auto'),
    contents: {
      text: { maxCharacters: verTexto ? max : 1200 },
      highlights: { query: consulta, numSentences: 3, highlightsPerUrl: 3 },
    },
  }
  if (typeof sitio === 'string') cuerpo.includeDomains = sitio.split(',').map((s) => s.trim())
  const desde = opcion('desde')
  if (typeof desde === 'string') cuerpo.startPublishedDate = `${desde}T00:00:00.000Z`
  const hasta = opcion('hasta')
  if (typeof hasta === 'string') cuerpo.endPublishedDate = `${hasta}T23:59:59.999Z`

  const datos = await pedir('/search', cuerpo)
  if (opcion('json') === true) {
    console.log(JSON.stringify(datos.results ?? [], null, 2))
  } else {
    console.log(`${(datos.results ?? []).length} resultados para «${consulta}»`)
    imprimir(datos.results ?? [], { max, verTexto })
  }
} else if (orden === 'contenido') {
  const urls = sueltos()
  if (!urls.length) {
    console.error('Uso: node scripts/exa.mjs contenido URL [URL...] [--max 8000]')
    process.exit(1)
  }
  const max = Number(opcion('max', 8000))
  const datos = await pedir('/contents', { urls, text: true, livecrawl: 'preferred' })
  for (const r of datos.results ?? []) {
    console.log(`\n=== ${r.title ?? 'sin título'}`)
    console.log(`=== ${r.url}`)
    console.log(`=== ${dominio(r.url)}${r.publishedDate ? ` · ${r.publishedDate.slice(0, 10)}` : ''}${esOficial(r.url) ? ' · OFICIAL' : ''}\n`)
    console.log(recortar(r.text, max))
  }
  for (const e of datos.statuses?.filter((s) => s.status !== 'success') ?? []) {
    console.error(`no recuperado: ${e.id} (${e.error?.tag ?? e.status})`)
  }
} else {
  console.error(`Órdenes: buscar | contenido

  node scripts/exa.mjs buscar "consulta" [--n 8] [--sitio dominio,dominio] [--desde YYYY-MM-DD]
                              [--hasta YYYY-MM-DD] [--texto] [--max 3000] [--json]
  node scripts/exa.mjs contenido URL [URL...] [--max 8000]`)
  process.exit(1)
}
