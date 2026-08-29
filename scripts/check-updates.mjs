// Detecta cambios en las fuentes registradas SIN tocar el dataset.
//
// Compara una huella del contenido de cada URL con la guardada en
// data/huellas.json y produce una cola de revisión en
// research/informe-actualizacion.md. La decisión de modificar un dato sigue
// siendo humana: este script solo dice dónde mirar.
//
// Uso: node scripts/check-updates.mjs [--limite N] [--dias N] [--solo-caducados]
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { cargarTodo, RAIZ } from './load.mjs'

const args = process.argv.slice(2)
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(nombre)
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : porDefecto
}

const LIMITE = opcion('--limite', Infinity)
const DIAS_CADUCIDAD = opcion('--dias', 180)
const SOLO_CADUCADOS = args.includes('--solo-caducados')
const CONCURRENCIA = 4
const ESPERA_MS = 400
const TIEMPO_LIMITE_MS = 25000

const RUTA_HUELLAS = join(RAIZ, 'data/huellas.json')
const huellas = existsSync(RUTA_HUELLAS) ? JSON.parse(readFileSync(RUTA_HUELLAS, 'utf8')) : {}

const hoy = new Date().toISOString().slice(0, 10)
const diasDesde = (iso) => Math.floor((Date.parse(hoy) - Date.parse(iso)) / 86400000)

const { sitios, red, renovables } = cargarTodo()

// --- inventario de URLs a vigilar -------------------------------------------

const urls = new Map()
const anotar = (url, quien) => {
  if (!/^https?:\/\//.test(url ?? '')) return
  if (!urls.has(url)) urls.set(url, new Set())
  urls.get(url).add(quien)
}

for (const s of sitios) for (const f of s.fuentes) anotar(f.url, s.id)
for (const n of [...red, ...renovables]) {
  for (const f of n.fuentes ?? []) anotar(typeof f === 'string' ? f : f.url, n.id)
}

// --- caducidad ---------------------------------------------------------------

const caducados = sitios
  .map((s) => ({ id: s.id, nombre: s.nombre, dias: diasDesde(s.ultima_verificacion), confianza: s.confianza }))
  .filter((s) => s.dias >= DIAS_CADUCIDAD)
  .sort((a, b) => b.dias - a.dias)

// --- comprobación de fuentes -------------------------------------------------

/** Reduce el HTML a texto para que la huella no cambie por cabeceras dinámicas. */
function huellaDe(html) {
  const texto = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
  return { hash: createHash('sha256').update(texto).digest('hex').slice(0, 16), longitud: texto.length }
}

async function comprobar(url) {
  const control = new AbortController()
  const temporizador = setTimeout(() => control.abort(), TIEMPO_LIMITE_MS)
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      signal: control.signal,
      headers: {
        'User-Agent':
          'mapa-datacenters-espana/0.1 (revisión periódica de fuentes; contacto en el repositorio)',
        Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.8,*/*;q=0.5',
      },
    })
    if (!r.ok) return { estado: 'http', codigo: r.status }

    const tipo = r.headers.get('content-type') ?? ''
    if (!/text|html|xml|json/.test(tipo)) {
      // PDF y demás binarios: nos quedamos con el tamaño declarado.
      return { estado: 'ok', hash: `bin:${r.headers.get('content-length') ?? '?'}`, longitud: 0, tipo }
    }
    const html = await r.text()
    return { estado: 'ok', ...huellaDe(html), tipo }
  } catch (e) {
    return { estado: 'error', mensaje: e.name === 'AbortError' ? 'tiempo agotado' : e.message }
  } finally {
    clearTimeout(temporizador)
  }
}

const cambiadas = []
const rotas = []
const nuevas = []
let comprobadas = 0

if (!SOLO_CADUCADOS) {
  const lista = [...urls.keys()].slice(0, LIMITE)
  const cola = [...lista]

  const trabajador = async () => {
    while (cola.length) {
      const url = cola.shift()
      const res = await comprobar(url)
      comprobadas++
      const previa = huellas[url]
      const quien = [...urls.get(url)]

      if (res.estado !== 'ok') {
        rotas.push({ url, quien, motivo: res.codigo ? `HTTP ${res.codigo}` : res.mensaje })
        huellas[url] = { ...(previa ?? {}), ultimo_fallo: hoy, motivo: res.codigo ?? res.mensaje }
      } else if (!previa?.hash) {
        nuevas.push({ url, quien })
        huellas[url] = { hash: res.hash, longitud: res.longitud, visto: hoy }
      } else if (previa.hash !== res.hash) {
        const delta = res.longitud - (previa.longitud ?? 0)
        cambiadas.push({ url, quien, delta, desde: previa.visto ?? '—' })
        huellas[url] = { hash: res.hash, longitud: res.longitud, visto: hoy, anterior: previa.hash }
      } else {
        huellas[url] = { ...previa, visto: hoy }
      }

      if (cola.length) await new Promise((r) => setTimeout(r, ESPERA_MS))
    }
  }

  process.stdout.write(`Comprobando ${lista.length} fuentes…\n`)
  await Promise.all(Array.from({ length: CONCURRENCIA }, trabajador))
  writeFileSync(RUTA_HUELLAS, JSON.stringify(huellas, null, 1), 'utf8')
}

// --- informe -----------------------------------------------------------------

const nombreDe = new Map(sitios.map((s) => [s.id, s.nombre]))
const referidos = (ids) => ids.map((i) => nombreDe.get(i) ?? i).join(', ')

// Un cambio pequeño suele ser publicidad o un contador; uno grande, contenido.
const relevante = (c) => Math.abs(c.delta) > 120

const l = []
l.push('# Cola de revisión de fuentes', '')
l.push(`Generado el ${hoy} por \`npm run refresh\`. Este informe **no modifica ningún dato**:`)
l.push('señala dónde han cambiado las fuentes para que una persona decida qué hacer.', '')
l.push(`- Fuentes comprobadas: **${comprobadas}** de ${urls.size} registradas`)
l.push(`- Con contenido cambiado: **${cambiadas.length}** (${cambiadas.filter(relevante).length} con cambio apreciable)`)
l.push(`- Inaccesibles: **${rotas.length}**`)
l.push(`- Vistas por primera vez: **${nuevas.length}**`)
l.push(`- Fichas sin verificar desde hace ${DIAS_CADUCIDAD} días o más: **${caducados.length}**`, '')

if (cambiadas.length) {
  l.push('## Fuentes cuyo contenido ha cambiado', '')
  l.push('Revisar si el cambio afecta a algún dato registrado. Un cambio de pocos caracteres')
  l.push('suele ser un elemento dinámico de la página, no información nueva.', '')
  l.push('| Fuente | Emplazamientos | Variación | Última huella |')
  l.push('|---|---|---:|---|')
  for (const c of cambiadas.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))) {
    const marca = relevante(c) ? '**' : ''
    l.push(`| ${marca}${c.url}${marca} | ${referidos(c.quien)} | ${c.delta > 0 ? '+' : ''}${c.delta} car. | ${c.desde} |`)
  }
  l.push('')
}

if (rotas.length) {
  l.push('## Fuentes inaccesibles', '')
  l.push('Un enlace roto no invalida el dato, pero sí su verificabilidad. Buscar copia en archivo')
  l.push('web o sustituir por una fuente equivalente antes de dar el dato por bueno.', '')
  l.push('| Fuente | Emplazamientos | Motivo |')
  l.push('|---|---|---|')
  for (const r of rotas) l.push(`| ${r.url} | ${referidos(r.quien)} | ${r.motivo} |`)
  l.push('')
}

if (caducados.length) {
  l.push('## Fichas que tocan revisar', '')
  l.push('| Emplazamiento | Días desde la última verificación | Confianza |')
  l.push('|---|---:|---|')
  for (const c of caducados) l.push(`| ${c.nombre} (\`${c.id}\`) | ${c.dias} | ${c.confianza} |`)
  l.push('')
}

if (nuevas.length) {
  l.push('## Fuentes vigiladas por primera vez', '')
  for (const n of nuevas) l.push(`- ${n.url} — ${referidos(n.quien)}`)
  l.push('')
}

l.push('---', '')
l.push('Para incorporar cambios: editar el YAML del emplazamiento, actualizar su')
l.push('`ultima_verificacion` y ejecutar `npm run validate`. Si el dato nuevo contradice al')
l.push('registrado, **no se sustituye**: se añade como entrada adicional en `potencia[]` y se')
l.push('documenta el choque en `incertidumbres[]`.')

writeFileSync(join(RAIZ, 'research/informe-actualizacion.md'), l.join('\n'), 'utf8')

console.log(
  `\n${comprobadas} fuentes comprobadas · ${cambiadas.length} cambiadas · ${rotas.length} rotas · ` +
    `${caducados.length} fichas caducadas\n→ research/informe-actualizacion.md`,
)

// Señal para el flujo de CI: 10 = hay algo que revisar.
if (cambiadas.filter(relevante).length || rotas.length || caducados.length) process.exit(10)
