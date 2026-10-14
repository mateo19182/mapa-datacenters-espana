import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseCsv, reconcileCapacity } from './import-ree-capacity.mjs'

// Cabecera y tres nudos de la edición oficial de octubre de 2026.
const csv = readFileSync(new URL('./fixtures/ree-octubre-2026.csv', import.meta.url), 'utf8')
const input = () => ({ fecha_publicacion_dato: '2026-08-03', nudos: [
  { nudo: 'BEGUES 220', codigo_subestacion_ree: '50079', tension_kv: 220 },
  { nudo: 'BEGUES (BEGUES B) 220', codigo_subestacion_ree: '50079', tension_kv: 220 },
  { nudo: 'AZCA 220', codigo_subestacion_ree: 'UFD-50078', tension_kv: 220 },
] })
const serialize = (rows) => rows.map((row) => row.map((s) => `"${s.replaceAll('"', '""')}"`).join(';')).join('\n')

test('separa las barras que comparten código y conserva los códigos UFD', () => {
  const result = reconcileCapacity(input(), csv, '2026-10-01')
  assert.equal(result.nudos.length, 3)
  assert.equal(result.nudos[0].valor_referencia_demanda_rdd_mw, 60)
  assert.equal(result.nudos[1].valor_referencia_demanda_rdd_mw, 0)
  assert.equal(result.nudos[2].codigo_subestacion_ree, 'UFD-50078')
  assert.equal(result.columnas['available.cep_ch'], 85)
  assert.equal(result.columnas['margin.cep_ch'], 39)
})

test('no convierte los vacíos o NA en cero y no lee almacenamiento como demanda', () => {
  const rows = parseCsv(csv)
  const row = rows.find((r) => r[0] === 'AZCA 220')
  row[26] = '1.234,5'
  row[85] = 'NA'
  row[86] = ''
  row[87] = '0'
  row[88] = '999'
  const { nudos } = reconcileCapacity(input(), serialize(rows), '2026-10-01')
  assert.equal(nudos[2].otorgada_demanda_rdt_mw, 1234.5)
  assert.deepEqual(nudos[2].disponible_criterio_general_demanda_mw, { cep_ch: null, cep_sh: null, no_cep: 0 })
  assert.equal(nudos[2].valores_no_publicados_ree['available.cep_ch'], 'NA')
})

test('reconoce columnas por su significado aunque se inserte otra columna', () => {
  const rows = parseCsv(csv)
  for (const row of rows) row.splice(85, 0, '')
  rows[0][85] = 'OTRA MAGNITUD'
  assert.equal(reconcileCapacity(input(), serialize(rows), '2026-10-01').columnas['available.cep_ch'], 86)
})

test('rechaza cambios de cabecera, filas repetidas y nudos ausentes sin modificar la entrada', () => {
  const rows = parseCsv(csv)
  rows[0][85] = 'OTRA MAGNITUD'
  assert.throws(() => reconcileCapacity(input(), serialize(rows), '2026-10-01'), /Columna REE/)
  const repeated = parseCsv(csv)
  repeated.push(repeated[4])
  assert.throws(() => reconcileCapacity(input(), serialize(repeated), '2026-10-01'), /repetido/)
  const current = input()
  current.nudos.push({ nudo: 'NO EXISTE 220', codigo_subestacion_ree: '00000', tension_kv: 220 })
  const before = structuredClone(current)
  assert.throws(() => reconcileCapacity(current, csv, '2026-10-01'), /Sin correspondencia/)
  assert.deepEqual(current, before)
})

test('importa la publicación completa, incluidos VS, islas, Ceuta y comunidades antes ausentes', () => {
  const completo = readFileSync(new URL('../data/red/capacidad-ree-2026-10-01.csv', import.meta.url), 'utf8')
  const { nudos, altas, filas_csv } = reconcileCapacity(input(), completo, '2026-10-01')
  assert.equal(filas_csv, 937)
  assert.equal(nudos.length, 937)
  assert.equal(altas.length, 934)
  const porAmbito = Object.groupBy(nudos, (n) => n.ambito_electrico)
  assert.deepEqual(Object.fromEntries(Object.entries(porAmbito).map(([ambito, lista]) => [ambito, lista.length])), {
    peninsular: 759, canarias: 99, baleares: 78, ceuta: 1,
  })
  const soller = nudos.find((n) => n.codigo_subestacion_ree === 'VS-7061')
  assert.equal(soller.nudo, 'SOLLER 66')
  assert.equal(soller.tension_kv, 66)
  assert.equal(soller.ccaa, 'Baleares')
  assert.equal(soller.ccaa_ree, 'Islas Baleares')
  assert.equal(soller.disponible_criterio_general_demanda_mw.cep_ch, 0)
  assert.equal(nudos.find((n) => n.ccaa_ree === 'Principado de Asturias').ccaa, 'Asturias')
  assert.equal(nudos.find((n) => n.ccaa_ree === 'Comunidad Foral de Navarra').ccaa, 'Navarra')
  assert.equal(nudos.filter((n) => n.codigo_subestacion_ree.startsWith('UFD-')).length, 8)
  assert.equal(new Set(nudos.map((n) => `${n.nudo}|${n.codigo_subestacion_ree}`)).size, 937)
})

test('un código de fuente inesperado o una fila incompleta bloquea la importación, nunca se omite', () => {
  for (const codigo of ['', 'VS 7061', 'UFD-', '../50079', '50079;otro']) {
    const rows = parseCsv(csv)
    rows[4][1] = codigo
    assert.throws(() => reconcileCapacity(input(), serialize(rows), '2026-10-01'), /Código REE/)
  }
  const rows = parseCsv(csv)
  rows[4].pop()
  assert.throws(() => reconcileCapacity(input(), serialize(rows), '2026-10-01'), /Fila incompleta/)
})

test('las altas carecen de geometría y vínculos inferidos; las referencias explícitas existentes se conservan', () => {
  const current = input()
  current.nudos = [{ ...current.nudos[0], subestacion_id: 'se-documentada' }]
  const { nudos, altas } = reconcileCapacity(current, csv, '2026-10-01')
  assert.equal(altas.length, 2)
  assert.equal(nudos[0].subestacion_id, 'se-documentada')
  assert.equal(nudos[1].subestacion_id, null)
  assert.equal(nudos[1].sistema_electrico, null)
  assert.equal('lat' in nudos[1], false)
  assert.equal('lon' in nudos[1], false)
  assert.equal(nudos.find((n) => n.nudo === 'AZCA 220').fila_csv_ree, 5)
  assert.deepEqual(nudos[1].fuentes, ['src-ree-csv'])
})

test('rechaza fechas de calendario inexistentes e inventarios duplicados antes de producir altas', () => {
  assert.throws(() => reconcileCapacity(input(), csv, '2026-02-30'), /Fecha inválida/)
  const current = input()
  current.nudos.push({ ...current.nudos[0] })
  assert.throws(() => reconcileCapacity(current, csv, '2026-10-01'), /repetido en inventario/)
})
