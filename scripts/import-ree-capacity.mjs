// Reconciliación de una edición descargada de REE. Sin --aplicar solo informa.
// Uso: node scripts/import-ree-capacity.mjs fichero.csv AAAA-MM-DD [--aplicar]
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import YAML from 'yaml'
import { createHash } from 'node:crypto'

const comunidades = YAML.parse(readFileSync(new URL('../data/comunidades.yaml', import.meta.url), 'utf8'))
const regiones = new Map(Object.entries(comunidades).flatMap(([nombre, alias]) =>
  [nombre, ...(alias ?? [])].map((valor) => [valor.toLocaleLowerCase('es'), nombre]),
))
const region = (valor) => {
  const literal = clean(valor)
  const canonica = regiones.get(literal.toLocaleLowerCase('es'))
  if (!canonica) throw new Error(`Comunidad REE desconocida: ${literal}`)
  return canonica
}
const ambitoElectrico = (ccaa) => ({ Canarias: 'canarias', Baleares: 'baleares', Ceuta: 'ceuta', Melilla: 'melilla' }[ccaa] ?? 'peninsular')

// REE usa códigos numéricos y prefijos de titular, por ejemplo UFD-50078 y
// VS-7061. Un identificador nuevo con otra forma exige revisión, nunca omisión.
const codigoValido = (valor) => /^(?:\d{1,12}|[A-Z]{2,8}-\d{1,12})$/.test(valor)

export function parseCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  text = text.replace(/^\uFEFF/, '')
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++ }
      else quoted = !quoted
    } else if (!quoted && (c === ';' || c === '\n')) {
      row.push(field.replace(/\r$/, '')); field = ''
      if (c === '\n') { rows.push(row); row = [] }
    } else field += c
  }
  if (quoted) throw new Error('CSV con comillas sin cerrar')
  if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row) }
  return rows
}

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()
const number = (value) => {
  const s = clean(value)
  if (!s || /^(?:N\/?A)$/i.test(s)) return null
  if (!/^-?\d+(?:\.\d{3})*(?:,\d+)?$/.test(s)) throw new Error(`Número REE no reconocido: ${s}`)
  return Number(s.replace(/\./g, '').replace(',', '.'))
}
const missing = (s) => clean(s) || null
const key = (name, code) => `${clean(code)}|${clean(name)}`

export function reconcileCapacity(current, text, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date < current.fecha_publicacion_dato) {
    throw new Error('Fecha inválida o anterior a la edición registrada')
  }
  const rows = parseCsv(text)
  const headers = rows.slice(0, 4)
  if (headers.length !== 4 || !headers.every((r) => r.length === headers[0].length)) {
    throw new Error('Cabecera REE incompleta')
  }
  const paths = [], last = ['', '', '', '']
  for (let col = 0; col < headers[0].length; col++) {
    for (let level = 0; level < 4; level++) {
      const value = clean(headers[level][col])
      if (value) last[level] = value
      else if (headers.slice(0, level).some((r) => clean(r[col]))) last[level] = ''
    }
    paths.push([...last])
  }
  const find = (...parts) => {
    const matches = paths.map((p, i) => p.every((v, j) => v === parts[j]) ? i : -1).filter((i) => i >= 0)
    if (matches.length !== 1) throw new Error(`Columna REE ausente o ambigua: ${parts.join(' > ')}`)
    return matches[0]
  }
  const indexes = {
    name: find('Nombre y tensión del nudo', '', '', ''),
    code: find('Código de subestación', '', '', ''),
    region: find('Comunidad Autónoma', '', '', ''),
    existing: find('POSICIONES', 'Consumo a la red de transporte', '', 'E'),
    planned: find('POSICIONES', 'Consumo a la red de transporte', '', 'P'),
    granted: find('SITUACIÓN NUDO CAPACIDAD DE ACCESO OTORGADA', 'Capacidad de acceso otorgada demanda RdT', '', ''),
    pending: find('SITUACIÓN NUDO CAPACIDAD DE ACCESO EN CURSO Y PENDIENTE DE RESOLVER', 'Capacidad de acceso solicitada en curso y pendiente resolver demanda RdT', '', ''),
    reference: find('SITUACIÓN NUDO CAPACIDAD DE ACCESO OTORGADA', 'Capacidad de acceso para consumo en la RdD (valor de referencia)', '', ''),
    agreed: find('SITUACIÓN NUDO CAPACIDAD DE ACCESO OTORGADA', 'Estado acuerdo sobre capacidad de acceso para consumo en la RdD (valor de referencia)', '', ''),
    reason: find('CAPACIDAD DE ACCESO NO OTORGABLE EN RDD', 'Motivo capacidad no otorgable en RdT', '', ''),
    contest: find('Nudo de concurso', '', '', ''),
    rule: find('Normativa específica reguladora de la concesión de la capacidad de acceso', '', '', ''),
  }
  const groups = {
    margin: 'MARGEN CAPACIDAD DE ACCESO TOTAL PARA CONEXIÓN A LA RDT',
    available: 'CAPACIDAD DE ACCESO DISPONIBLE PARA SOLICITUDES CRITERIO GENERAL RDT',
    limiting: 'CRITERIO LIMITANTE RDT',
  }
  for (const [group, title] of Object.entries(groups)) {
    for (const [type, tech, ride] of [['cep_ch', 'CEP', 'CH'], ['cep_sh', 'CEP', 'SH'], ['no_cep', 'NO CEP', '']]) {
      indexes[`${group}.${type}`] = find(title, 'DEMANDA', tech, ride)
    }
  }
  const sourceRows = new Map()
  for (const [ordinal, row] of rows.slice(4).entries()) {
    if (row.every((value) => !clean(value))) continue
    if (row.length !== paths.length) throw new Error(`Fila incompleta: ${row[0]}`)
    const code = clean(row[indexes.code])
    const name = clean(row[indexes.name])
    if (!codigoValido(code)) throw new Error(`Código REE no reconocido en fila ${ordinal + 5}: ${code}`)
    if (!/ \d+$/.test(name)) throw new Error(`Nombre o tensión REE no reconocidos: ${name}`)
    const id = key(row[indexes.name], row[indexes.code])
    if (sourceRows.has(id)) throw new Error(`Nudo repetido en CSV: ${id}`)
    sourceRows.set(id, { row, fila: ordinal + 5 })
  }
  if (!sourceRows.size) throw new Error('El CSV no contiene nudos')
  const currentByKey = new Map()
  for (const node of current.nudos) {
    const id = key(node.nudo, node.codigo_subestacion_ree)
    if (currentByKey.has(id)) throw new Error(`Nudo repetido en inventario: ${id}`)
    if (!sourceRows.has(id)) throw new Error(`Sin correspondencia exacta por nombre, tensión y código: ${node.nudo}`)
    if (!node.nudo.endsWith(` ${node.tension_kv}`)) throw new Error(`Tensión incoherente: ${node.nudo}`)
    currentByKey.set(id, node)
  }
  const changes = []
  const added = []
  const orderedKeys = [...currentByKey.keys(), ...[...sourceRows.keys()].filter((id) => !currentByKey.has(id))]
  const nodes = orderedKeys.map((id) => {
    const { row, fila } = sourceRows.get(id)
    const node = currentByKey.get(id) ?? {}
    const at = (field) => row[indexes[field]]
    const name = clean(at('name'))
    const ccaa = region(at('region'))
    const triple = (group, convert) => Object.fromEntries(['cep_ch', 'cep_sh', 'no_cep'].map((type) => [type, convert(at(`${group}.${type}`))]))
    const contest = clean(at('contest')).toUpperCase()
    if (!['', 'SI', 'NO'].includes(contest)) throw new Error(`Valor de concurso desconocido: ${contest}`)
    const next = {
      ...node,
      nudo: name,
      tension_kv: Number(name.match(/ (\d+)$/)[1]),
      codigo_subestacion_ree: clean(at('code')),
      ccaa,
      ccaa_ree: clean(at('region')),
      // Ámbito territorial, no afirmación de que todas sus islas compartan red.
      ambito_electrico: ambitoElectrico(ccaa),
      sistema_electrico: node.sistema_electrico ?? null,
      subestacion_id: node.subestacion_id ?? null,
      fila_csv_ree: fila,
      posiciones_consumo_rdt: { existentes: number(at('existing')), previstas: number(at('planned')) },
      otorgada_demanda_rdt_mw: number(at('granted')),
      solicitada_en_curso_demanda_rdt_mw: number(at('pending')),
      valor_referencia_demanda_rdd_mw: number(at('reference')),
      valor_referencia_acordado: missing(at('agreed')),
      margen_total_demanda_mw: triple('margin', number),
      disponible_criterio_general_demanda_mw: triple('available', number),
      criterio_limitante_demanda: missing(at('limiting.cep_ch')),
      criterio_limitante_demanda_por_tipo: triple('limiting', missing),
      motivo_no_otorgable: missing(at('reason')),
      nudo_de_concurso: contest === 'SI',
      normativa_especifica: missing(at('rule')),
      fuentes: [...new Set([...(node.fuentes ?? []), 'src-ree-csv'])],
      // null no significa cero. Se conserva además el marcador NA/N/A original.
      valores_no_publicados_ree: Object.fromEntries(Object.entries(indexes)
        .filter(([, i]) => /^N\/?A$/i.test(clean(row[i])))
        .map(([field, i]) => [field, clean(row[i])])),
    }
    if (Object.keys(next.valores_no_publicados_ree).length === 0) delete next.valores_no_publicados_ree
    const fields = Object.keys(next).filter((field) => JSON.stringify(next[field]) !== JSON.stringify(node[field]))
    if (fields.length) changes.push({ nudo: name, campos: fields })
    if (!currentByKey.has(id)) added.push({ nudo: name, codigo: next.codigo_subestacion_ree, ccaa })
    return next
  })
  return { nudos: nodes, cambios: changes, altas: added, columnas: indexes, filas_csv: sourceRows.size }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [csv, date] = process.argv.slice(2)
  if (!csv || !date) throw new Error('Uso: import-ree-capacity.mjs fichero.csv AAAA-MM-DD [--aplicar]')
  const path = new URL('../data/red/capacidad.yaml', import.meta.url)
  const doc = YAML.parseDocument(readFileSync(path, 'utf8'))
  const previousDate = doc.get('fecha_publicacion_dato')
  const result = reconcileCapacity(doc.toJS(), readFileSync(csv, 'utf8'), date)
  console.log(JSON.stringify({ fecha: date, nudos: result.nudos.length, filas_csv: result.filas_csv, nudos_modificados: result.cambios.length, altas: result.altas.length, columnas: result.columnas }, null, 2))
  if (process.argv.includes('--aplicar')) {
    for (let i = 0; i < result.nudos.length; i++) {
      if (doc.hasIn(['nudos', i]) && !('valores_no_publicados_ree' in result.nudos[i])) doc.deleteIn(['nudos', i, 'valores_no_publicados_ree'])
      for (const [field, value] of Object.entries(result.nudos[i])) {
        const location = ['nudos', i, field]
        if (JSON.stringify(doc.getIn(location)?.toJSON?.() ?? doc.getIn(location)) === JSON.stringify(value)) continue
        const previous = doc.getIn(location, true)
        const replacement = doc.createNode(value)
        if (YAML.isCollection(replacement) && (previous?.flow || field === 'criterio_limitante_demanda_por_tipo' || field === 'valores_no_publicados_ree')) replacement.flow = true
        doc.setIn(location, replacement)
      }
    }
    const today = new Date().toISOString().slice(0, 10)
    for (const field of ['fecha_publicacion_dato', 'fecha_consulta', 'ultima_verificacion']) doc.set(field, field === 'fecha_publicacion_dato' ? date : today)
    const source = doc.get('fuentes').items.find((s) => s.get('id') === 'src-ree-csv')
    source.set('url', `https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/${date.replaceAll('-', '_')}_GRT_demanda.csv`)
    source.set('titulo', `Capacidad de acceso de demanda en la red de transporte (${date})`)
    source.set('fecha_publicacion', date)
    source.set('fecha_consulta', today)
    source.set('cita', 'Capacidad de acceso otorgada demanda RdT; Capacidad de acceso solicitada en curso y pendiente resolver demanda RdT')
    const snapshot = `capacidad-ree-${date}.csv`
    writeFileSync(new URL(`../data/red/${snapshot}`, import.meta.url), readFileSync(csv))
    doc.set('archivo_original_ree', snapshot)
    doc.set('sha256_csv_ree', createHash('sha256').update(readFileSync(csv)).digest('hex'))
    // Las referencias documentales de la cabecera deben acompañar a los valores.
    writeFileSync(path, doc.toString({ lineWidth: 0, flowCollectionPadding: false }).replaceAll(previousDate.replaceAll('-', '_'), date.replaceAll('-', '_')).replace(`#   fecha_publicacion_dato: ${previousDate}`, `#   fecha_publicacion_dato: ${date}`))
  }
}
