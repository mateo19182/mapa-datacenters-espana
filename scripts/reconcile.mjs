// Reconciliación del conjunto: detecta lo que seis investigadores independientes
// producen inevitablemente — el mismo operador escrito de tres formas, el mismo
// emplazamiento dado de alta dos veces desde regiones distintas, cifras de fase
// que no cuadran con la cifra de campus.
//
// No corrige nada por su cuenta: escribe un informe con propuestas concretas.
// Con --aplicar-alias unifica solo los nombres de operador que se le indiquen en
// data/alias-operadores.yaml, que es una decisión humana escrita a mano.
//
// Uso: node scripts/reconcile.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import YAML from 'yaml'
import { cargarTodo, RAIZ, DIR_SITIOS, distanciaKm } from './load.mjs'

const { sitios } = cargarTodo()

const normalizar = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(s\.?a\.?u?\.?|s\.?l\.?u?\.?|inc|ltd|llc|group|grupo|holding|properties|energy|iberia|espana|spain)\b/g, '')
    .replace(/[^a-z0-9]/g, '')

/** Distancia de edición acotada: basta para detectar variantes de un nombre. */
function distancia(a, b) {
  if (Math.abs(a.length - b.length) > 4) return 99
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
  }
  return m[a.length][b.length]
}

// --- 1. variantes del nombre de operador ------------------------------------

const operadores = new Map()
for (const s of sitios) {
  if (!s.operador) continue
  if (!operadores.has(s.operador)) operadores.set(s.operador, [])
  operadores.get(s.operador).push(s.id)
}

const nombres = [...operadores.keys()]
const variantes = []
for (let i = 0; i < nombres.length; i++) {
  for (let j = i + 1; j < nombres.length; j++) {
    const a = normalizar(nombres[i])
    const b = normalizar(nombres[j])
    if (!a || !b) continue
    const d = distancia(a, b)
    const contenido = a.length > 3 && b.length > 3 && (a.includes(b) || b.includes(a))
    if (d <= 2 || contenido) {
      variantes.push({
        a: nombres[i],
        b: nombres[j],
        na: operadores.get(nombres[i]).length,
        nb: operadores.get(nombres[j]).length,
        motivo: contenido ? 'uno contiene al otro' : `distancia ${d}`,
      })
    }
  }
}

// --- 2. emplazamientos posiblemente duplicados ------------------------------

const trocear = (texto) =>
  String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3)

// Palabras que no distinguen nada: aparecen en muchos nombres (data, center,
// campus, madrid…) o son el propio topónimo. Sin filtrarlas, todos los CPD de un
// mismo polígono parecen el mismo.
const frecuencia = new Map()
for (const s of sitios) {
  for (const w of new Set(trocear(`${s.nombre} ${s.alias.join(' ')}`))) {
    frecuencia.set(w, (frecuencia.get(w) ?? 0) + 1)
  }
}

const distintivas = (s) => {
  const toponimos = new Set(trocear(`${s.ubicacion.municipio} ${s.ubicacion.provincia} ${s.ubicacion.ccaa}`))
  return new Set(
    trocear(`${s.nombre} ${s.alias.join(' ')}`).filter(
      (w) => (frecuencia.get(w) ?? 0) <= 3 && !toponimos.has(w),
    ),
  )
}

const nombreNormalizado = (s) => normalizar(s.nombre)
const aliasNormalizados = (s) => new Set(s.alias.map(normalizar).filter(Boolean))

const duplicados = []
for (let i = 0; i < sitios.length; i++) {
  for (let j = i + 1; j < sitios.length; j++) {
    const a = sitios[i]
    const b = sitios[j]

    // Coincidencia de identidad: el nombre de uno es alias del otro.
    const mismoNombre = nombreNormalizado(a) === nombreNormalizado(b)
    const aliasCruzado =
      aliasNormalizados(a).has(nombreNormalizado(b)) || aliasNormalizados(b).has(nombreNormalizado(a))

    // La proximidad solo prueba algo si ambas coordenadas son de verdad: dos
    // fichas situadas en el centroide del mismo municipio distan 0 m sin que eso
    // signifique nada.
    const ambasExactas = a.ubicacion.precision === 'exacta' && b.ubicacion.precision === 'exacta'
    const pegados =
      ambasExactas &&
      a.ubicacion.lat != null &&
      b.ubicacion.lat != null &&
      distanciaKm(a.ubicacion, b.ubicacion) < 0.25

    const mismoOperador = Boolean(a.operador) && normalizar(a.operador) === normalizar(b.operador)
    // Compartir el nombre de un programa («Proyecto Búfalo», «PIGA MSFT») entre
    // municipios distintos indica un plan común, no una ficha repetida.
    const mismoMunicipio =
      Boolean(a.ubicacion.municipio) &&
      normalizar(a.ubicacion.municipio) === normalizar(b.ubicacion.municipio)
    const da = distintivas(a)
    const db = distintivas(b)
    const comunes = [...da].filter((w) => db.has(w))

    // Coordenadas exactamente iguales: es el mismo edificio, aunque el operador
    // figure con otro nombre. Solo vale si ambas son exactas: varios proyectos
    // de un mismo polígono comparten el punto de referencia del parque sin ser
    // el mismo activo.
    const mismasCoordenadas =
      ambasExactas && a.ubicacion.lat === b.ubicacion.lat && a.ubicacion.lon === b.ubicacion.lon

    const sospechoso =
      mismoNombre ||
      aliasCruzado ||
      mismasCoordenadas ||
      (mismoOperador && pegados) ||
      (mismoOperador && mismoMunicipio && comunes.length >= 2)

    if (!sospechoso) continue

    duplicados.push({
      a: a.id,
      b: b.id,
      motivo: [
        mismoNombre ? 'nombre idéntico' : null,
        mismasCoordenadas ? `coordenadas idénticas (${a.ubicacion.lat}, ${a.ubicacion.lon})` : null,
        aliasCruzado ? 'el nombre de uno figura como alias del otro' : null,
        mismoOperador ? `mismo operador (${a.operador})` : null,
        pegados ? `a ${Math.round(distanciaKm(a.ubicacion, b.ubicacion) * 1000)} m con coordenadas exactas` : null,
        mismoMunicipio ? `mismo municipio (${a.ubicacion.municipio})` : null,
        comunes.length >= 2 ? `comparten «${comunes.slice(0, 4).join('», «')}»` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }
}

// --- 3. coherencia interna de las potencias ---------------------------------

const incoherencias = []
for (const s of sitios) {
  for (const tipo of ['it', 'conexion_red', 'instalada_total']) {
    const global = s.potencia.filter((p) => p.tipo === tipo && p.ambito !== 'fase')
    const fases = s.potencia.filter((p) => p.tipo === tipo && p.ambito === 'fase' && !p.acumulado)
    if (!global.length || !fases.length) continue
    const mayorGlobal = Math.max(...global.map((p) => p.valor_mw ?? 0))
    const sumaFases = fases.reduce((a, p) => a + (p.valor_mw ?? 0), 0)
    // Un 5 % de holgura absorbe redondeos de las fuentes.
    if (sumaFases > mayorGlobal * 1.05) {
      incoherencias.push({
        id: s.id,
        tipo,
        global: mayorGlobal,
        fases: sumaFases,
        detalle: fases.map((p) => `${p.referencia ?? 'sin referencia'}: ${p.valor_mw} MW`).join('; '),
      })
    }
  }
}

// --- 4. fechas imposibles y verificaciones sospechosas ----------------------

const hoy = new Date().toISOString().slice(0, 10)
const futuras = []
for (const s of sitios) {
  for (const [campo, valor] of [
    ['ultima_verificacion', s.ultima_verificacion],
    ...s.fuentes.map((f) => [`fuente ${f.id}`, f.fecha_publicacion]),
  ]) {
    if (valor && valor.length === 10 && valor > hoy) futuras.push({ id: s.id, campo, valor })
  }
}

// --- 5. estados incompatibles con las fases ---------------------------------

const estadoDudoso = []
for (const s of sitios) {
  const fasesOperativas = s.fases.filter((f) => f.estado === 'operativo').length
  if (fasesOperativas > 0 && ['anunciado', 'en_tramitacion', 'en_construccion'].includes(s.estado)) {
    estadoDudoso.push({
      id: s.id,
      estado: s.estado,
      detalle: `${fasesOperativas} ${fasesOperativas === 1 ? 'fase declarada operativa' : 'fases declaradas operativas'}`,
    })
  }
}

// --- 6. fuentes cuyo editor no cuadra con el dominio ------------------------

const editorRaro = []
for (const s of sitios) {
  for (const f of s.fuentes) {
    if (!f.editor) continue
    let host = ''
    try {
      host = new URL(f.url).hostname.replace(/^www\./, '')
    } catch {
      continue
    }
    const e = normalizar(f.editor)
    const h = normalizar(host.split('.')[0])
    if (f.tipo === 'oficial' || !e || !h) continue
    if (!host.includes(h) || (!e.includes(h) && !h.includes(e) && distancia(e, h) > 4)) {
      editorRaro.push({ id: s.id, fuente: f.id, editor: f.editor, host })
    }
  }
}

// --- informe -----------------------------------------------------------------

const l = []
l.push('# Informe de reconciliación', '')
l.push(`Generado el ${hoy} por \`npm run reconcile\` sobre ${sitios.length} emplazamientos.`, '')
l.push('Nada de lo que sigue se corrige automáticamente: son propuestas para decidir a mano.', '')
l.push(`- Variantes de nombre de operador: **${variantes.length}**`)
l.push(`- Posibles emplazamientos duplicados: **${duplicados.length}**`)
l.push(`- Potencias de fase que superan la cifra global: **${incoherencias.length}**`)
l.push(`- Estados en conflicto con sus fases: **${estadoDudoso.length}**`)
l.push(`- Fechas posteriores a hoy: **${futuras.length}**`)
l.push(`- Editores que no cuadran con el dominio: **${editorRaro.length}**`, '')

const seccion = (titulo, filas, cabecera, formato, nota) => {
  if (!filas.length) return
  l.push(`## ${titulo}`, '')
  if (nota) l.push(nota, '')
  l.push(`| ${cabecera.join(' | ')} |`)
  l.push(`|${cabecera.map(() => '---').join('|')}|`)
  for (const f of filas) l.push(`| ${formato(f).join(' | ')} |`)
  l.push('')
}

seccion(
  'Variantes del nombre de operador',
  variantes,
  ['Nombre A', 'Nombre B', 'Motivo'],
  (v) => [`${v.a} (${v.na})`, `${v.b} (${v.nb})`, v.motivo],
  'Si son la misma empresa, unificar el campo `operador` y dejar la otra forma como `alias`. Si no lo son, no tocar: hay grupos con nombres muy parecidos.',
)

seccion(
  'Posibles duplicados',
  duplicados,
  ['Emplazamiento A', 'Emplazamiento B', 'Motivo'],
  (d) => [`\`${d.a}\``, `\`${d.b}\``, d.motivo],
  'Un campus con varios edificios debe ser **una** ficha con sus fases dentro. Dos edificios de verdad independientes pueden coexistir en el mismo municipio: verificar antes de fusionar.',
)

seccion(
  'Fases que suman más que el conjunto',
  incoherencias,
  ['Emplazamiento', 'Tipo', 'Cifra global', 'Suma de fases', 'Detalle'],
  (i) => [`\`${i.id}\``, i.tipo, `${i.global} MW`, `${i.fases} MW`, i.detalle],
  'O la cifra global está desfasada, o alguna fase se refiere en realidad al conjunto. Conviene revisar la fuente de cada una.',
)

seccion(
  'Estados en conflicto con sus fases',
  estadoDudoso,
  ['Emplazamiento', 'Estado declarado', 'Conflicto'],
  (e) => [`\`${e.id}\``, e.estado, e.detalle],
  'Probablemente corresponda `parcialmente_operativo` o `ampliacion_en_construccion`.',
)

seccion('Fechas posteriores a hoy', futuras, ['Emplazamiento', 'Campo', 'Valor'], (f) => [
  `\`${f.id}\``,
  f.campo,
  f.valor,
])

seccion(
  'Editores que no cuadran con el dominio',
  editorRaro,
  ['Emplazamiento', 'Fuente', 'Editor declarado', 'Dominio'],
  (e) => [`\`${e.id}\``, e.fuente, e.editor, e.host],
  'Suele ser una cita de segunda mano: el contenido es de un medio pero el enlace apunta a otro. Conviene enlazar el original o declarar el editor real.',
)

if (![variantes, duplicados, incoherencias, estadoDudoso, futuras, editorRaro].some((x) => x.length)) {
  l.push('Sin incidencias de reconciliación.', '')
}

writeFileSync(join(RAIZ, 'research/informe-reconciliacion.md'), l.join('\n'), 'utf8')

console.log(
  `${variantes.length} variantes de operador · ${duplicados.length} posibles duplicados · ` +
    `${incoherencias.length} incoherencias de potencia · ${estadoDudoso.length} estados dudosos\n` +
    '→ research/informe-reconciliacion.md',
)
