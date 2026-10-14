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
