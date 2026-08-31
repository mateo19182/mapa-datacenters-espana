// Descarga una INSTANTÁNEA de generación real por unidad de producción desde la
// plataforma de transparencia de ENTSO-E (documento 16.1.A) y la cachea en
// data/generacion/produccion.json.
//
// Se ejecuta a mano (npm run generacion:entsoe), nunca en el build ni en el
// sitio publicado: hace falta un token personal, y una página estática no puede
// guardar secretos. Lo que se publica es una foto fechada, no un dato en vivo,
// y así se rotula en la ficha.
//
//   ENTSOE_TOKEN=… node scripts/fetch-entsoe-generacion.mjs [--dia AAAA-MM-DD]
//                                                          [--desde fichero.xml]
//                                                          [--sugerir]
//
// El token es gratuito. El correo a transparency@entsoe.eu con el asunto
// «RESTful API access» solo desbloquea el permiso (hasta tres días laborables);
// el token se genera después en «My Account Settings», y la plataforma lo enseña
// una sola vez.
//
// LÍMITE IMPORTANTE: 16.1.A solo cubre unidades de 100 MW o más. Cubre por tanto
// nucleares, ciclos combinados, grandes hidráulicas y carbón, y NO cubre parques
// eólicos ni plantas solares individuales. Las centrales sin dato no se rellenan
// con estimaciones: se quedan sin cifra de generación y así se muestran.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { RAIZ } from './load.mjs'

const API = 'https://web-api.tp.entsoe.eu/api'
// Área de control de España peninsular (Red Eléctrica).
const ZONA = '10YES-REE------0'

const RUTA_UNIDADES = join(RAIZ, 'data/generacion/unidades.yaml')
const RUTA_CENTRALES = join(RAIZ, 'data/generacion/centrales.geojson')
const RUTA_SALIDA = join(RAIZ, 'data/generacion/produccion.json')
const RUTA_INFORME = join(RAIZ, 'research/informe-generacion.md')

// Códigos de tecnología de ENTSO-E, en su propia terminología.
const TECNOLOGIA = {
  B01: 'Biomasa',
  B02: 'Lignito',
  B03: 'Gas de coquería',
  B04: 'Gas natural',
  B05: 'Hulla',
  B06: 'Fuelóleo',
  B07: 'Esquisto bituminoso',
  B08: 'Turba',
  B09: 'Geotérmica',
  B10: 'Hidráulica de bombeo',
  B11: 'Hidráulica fluyente',
  B12: 'Hidráulica de embalse',
  B13: 'Mareomotriz',
  B14: 'Nuclear',
  B15: 'Residuos',
  B16: 'Solar',
  B17: 'Residuos renovables',
  B18: 'Eólica marina',
  B19: 'Eólica terrestre',
  B20: 'Otras',
}

// Devuelve el valor de una opción, o `true` si es una bandera suelta. Un valor
// que empieza por «--» es la siguiente opción, no el valor de esta.
const arg = (nombre) => {
  const i = process.argv.indexOf(nombre)
  if (i === -1) return null
  const siguiente = process.argv[i + 1]
  return siguiente && !siguiente.startsWith('--') ? siguiente : true
}

// --- lectura del XML ---------------------------------------------------------

// ENTSO-E devuelve un XML regular y poco anidado. Un analizador completo sería
// una dependencia más para leer cinco etiquetas, así que se extraen a mano;
// a cambio, todo lo que no encaje se descarta en voz alta en vez de en silencio.
const bloques = (xml, etiqueta) => [
  ...xml.matchAll(new RegExp(`<${etiqueta}\\b[^>]*>([\\s\\S]*?)</${etiqueta}>`, 'g')),
].map((m) => m[1])

const valor = (xml, etiqueta) => {
  const m = new RegExp(`<${etiqueta}\\b[^>]*>([\\s\\S]*?)</${etiqueta}>`).exec(xml)
  return m ? m[1].trim() : null
}

function leerDocumento(xml) {
  const motivo = valor(xml, 'Reason')
  if (motivo && !xml.includes('<TimeSeries')) {
    throw new Error(`ENTSO-E no devuelve datos: ${valor(motivo, 'text') ?? motivo}`)
  }

  const unidades = new Map()
  for (const serie of bloques(xml, 'TimeSeries')) {
    // Las unidades de bombeo publican además una serie de CONSUMO, marcada con
    // outBiddingZone. Sumarla a la de generación restaría producción a una
    // central que en ese momento estaba bombeando.
    const consumo = serie.includes('outBiddingZone_Domain.mRID')

    const recurso = bloques(serie, 'PowerSystemResources')[0]
    if (!recurso) continue
    const eic = valor(recurso, 'mRID')
    const nombre = valor(recurso, 'name')
    if (!eic) continue

    const psr = valor(serie, 'psrType')
    const periodo = bloques(serie, 'Period')[0] ?? ''
    const resolucion = valor(periodo, 'resolution') ?? 'PT60M'
    const horasPorPunto = { PT60M: 1, PT30M: 0.5, PT15M: 0.25 }[resolucion]
    if (!horasPorPunto) {
      console.warn(`  resolución no contemplada (${resolucion}) en ${nombre ?? eic}: serie omitida`)
      continue
    }

    const cantidades = bloques(periodo, 'Point')
      .map((p) => Number(valor(p, 'quantity')))
      .filter((n) => Number.isFinite(n))
    if (!cantidades.length) continue

    const u =
      unidades.get(eic) ??
      { eic, nombre, psr, tecnologia: TECNOLOGIA[psr] ?? null, generacion: [], consumo: [], horasPorPunto }
    u[consumo ? 'consumo' : 'generacion'].push(...cantidades)
    unidades.set(eic, u)
  }
  return [...unidades.values()]
}

// --- descarga ----------------------------------------------------------------

const marca = (dia, hora) => `${dia.replaceAll('-', '')}${hora}`

async function descargar(dia, token) {
  const siguiente = new Date(`${dia}T00:00:00Z`)
  siguiente.setUTCDate(siguiente.getUTCDate() + 1)
  const params = new URLSearchParams({
    documentType: 'A73',
    processType: 'A16',
    in_Domain: ZONA,
    periodStart: marca(dia, '0000'),
    periodEnd: marca(siguiente.toISOString().slice(0, 10), '0000'),
    securityToken: token,
  })
  const r = await fetch(`${API}?${params}`)
  const texto = await r.text()
  // La plataforma responde 400 con el motivo dentro del cuerpo; conviene leerlo.
  if (!r.ok && !texto.includes('<Reason')) throw new Error(`HTTP ${r.status}`)
  return texto
}

// --- cotejo con el inventario de centrales ----------------------------------

const SIN_VALOR = new Set(['CENTRAL', 'DE', 'DEL', 'LA', 'EL', 'LOS', 'LAS', 'NUCLEAR', 'TERMICA', 'HIDROELECTRICA', 'CT', 'CH', 'CN', 'GRUPO', 'UNIDAD', 'CICLO', 'COMBINADO', 'I', 'II', 'III', 'IV', 'V'])

const normalizar = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !SIN_VALOR.has(t))
    .join(' ')
    .trim()

// Jaccard sobre palabras: basta para ordenar candidatos que después revisa una
// persona, y no inventa una precisión que no tiene.
function parecido(a, b) {
  const A = new Set(normalizar(a).split(' ').filter(Boolean))
  const B = new Set(normalizar(b).split(' ').filter(Boolean))
  if (!A.size || !B.size) return 0
  const comunes = [...A].filter((t) => B.has(t)).length
  return comunes / new Set([...A, ...B]).size
}

// --- ejecución ---------------------------------------------------------------

const ayer = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10)
const dia = typeof arg('--dia') === 'string' ? arg('--dia') : ayer
const fichero = arg('--desde')

let xml
if (typeof fichero === 'string') {
  xml = readFileSync(fichero, 'utf8')
  console.log(`Leyendo respuesta guardada: ${fichero}`)
} else {
  const token = process.env.ENTSOE_TOKEN
  if (!token) {
    console.error('Falta ENTSOE_TOKEN. Se pide acceso a transparency@entsoe.eu con el')
    console.error('asunto «RESTful API access» y, una vez concedido, se genera el token en')
    console.error('«My Account Settings» de la plataforma. Sin él no se actualiza la')
    console.error('generación; el mapa sigue funcionando con la potencia instalada.')
    process.exit(1)
  }
  console.log(`Pidiendo generación por unidad de ${dia} …`)
  xml = await descargar(dia, token)
}

const unidades = leerDocumento(xml)
if (!unidades.length) {
  console.error('La respuesta no trae ninguna serie de generación.')
  process.exit(1)
}

const resumidas = unidades
  .map((u) => {
    const g = u.generacion
    const horas = g.length * u.horasPorPunto
    return {
      eic: u.eic,
      nombre: u.nombre,
      tecnologia: u.tecnologia,
      psr: u.psr,
      mw_medio: g.length ? Number((g.reduce((a, b) => a + b, 0) / g.length).toFixed(1)) : null,
      mw_punta: g.length ? Math.max(...g) : null,
      mwh_dia: g.length ? Math.round(g.reduce((a, b) => a + b, 0) * u.horasPorPunto) : null,
      horas_con_dato: horas,
      // El bombeo se registra aparte: es consumo, no generación, y sumarlos
      // daría una cifra que no existe.
      mwh_bombeo: u.consumo.length ? Math.round(u.consumo.reduce((a, b) => a + b, 0) * u.horasPorPunto) : null,
    }
  })
  .sort((a, b) => (b.mwh_dia ?? 0) - (a.mwh_dia ?? 0))

const salida = {
  metadata: {
    fuente: 'ENTSO-E Transparency Platform — Actual Generation per Generation Unit (16.1.A)',
    url: 'https://transparency.entsoe.eu/generation/r2/actualGenerationPerGenerationUnit/show',
    licencia: 'Reutilización permitida citando la fuente (ENTSO-E Transparency Platform)',
    zona: ZONA,
    dia,
    descargado: new Date().toISOString().slice(0, 10),
    nota:
      'Instantánea de un solo día, no un dato en vivo. 16.1.A solo publica unidades ' +
      'de 100 MW o más, de modo que la mayoría de parques eólicos y plantas solares ' +
      'no aparece aquí. Los MWh de bombeo son consumo y no se suman a la generación.',
  },
  unidades: resumidas,
}

mkdirSync(join(RAIZ, 'data/generacion'), { recursive: true })
writeFileSync(RUTA_SALIDA, JSON.stringify(salida, null, 1), 'utf8')
console.log(`${resumidas.length} unidades guardadas para el ${dia}`)
console.log('→ data/generacion/produccion.json')

// --- cola de revisión del cotejo --------------------------------------------

if (arg('--sugerir')) {
  if (!existsSync(RUTA_CENTRALES)) {
    console.error('Falta data/generacion/centrales.geojson: ejecuta antes npm run centrales:osm')
    process.exit(1)
  }
  const centrales = JSON.parse(readFileSync(RUTA_CENTRALES, 'utf8')).features
  const mapa = existsSync(RUTA_UNIDADES) ? (parse(readFileSync(RUTA_UNIDADES, 'utf8')) ?? {}) : {}

  const pendientes = resumidas.filter((u) => !mapa[u.eic])
  const lineas = [
    '# Cotejo de unidades de generación',
    '',
    `Generado el ${new Date().toISOString().slice(0, 10)} a partir de la instantánea del ${dia}.`,
    '',
    'ENTSO-E identifica cada unidad por su código EIC y un nombre comercial que no',
    'coincide con el de OpenStreetMap. Este informe propone candidatos por parecido',
    'de nombre y **no modifica nada**: las correspondencias que se den por buenas se',
    'escriben a mano en `data/generacion/unidades.yaml`.',
    '',
    `- Unidades en la instantánea: **${resumidas.length}**`,
    `- Ya correspondidas en \`unidades.yaml\`: **${resumidas.length - pendientes.length}**`,
    `- Pendientes: **${pendientes.length}**`,
    '',
    '## Pendientes',
    '',
    '| EIC | Unidad (ENTSO-E) | Tecnología | MWh/día | Candidatos en OSM |',
    '|---|---|---|---|---|',
  ]

  for (const u of pendientes) {
    const candidatos = centrales
      .map((f) => ({ id: f.properties.id, nombre: f.properties.nombre, p: parecido(u.nombre, f.properties.nombre) }))
      .filter((c) => c.p >= 0.34)
      .sort((a, b) => b.p - a.p)
      .slice(0, 3)
      .map((c) => `\`${c.id}\` ${c.nombre} (${(c.p * 100).toFixed(0)} %)`)
      .join('<br>')
    lineas.push(
      `| \`${u.eic}\` | ${u.nombre ?? '—'} | ${u.tecnologia ?? '—'} | ${u.mwh_dia?.toLocaleString('es-ES') ?? '—'} | ${candidatos || '—'} |`,
    )
  }
  lineas.push('')

  mkdirSync(join(RAIZ, 'research'), { recursive: true })
  writeFileSync(RUTA_INFORME, lineas.join('\n'), 'utf8')
  console.log(`${pendientes.length} unidades sin correspondencia → research/informe-generacion.md`)
}
