import test from 'node:test'
import assert from 'node:assert/strict'
import { calendarioNormas } from '../src/lib/normativa-presentacion.js'

const norma = (id, url = 'https://example.org/acto', hito = 'Primera emisión de etiquetas, sujeta a entrada en vigor') => ({
  id,
  fuentes: [{ id: 'acto', url }],
  hitos: [{ fecha: '2027-08-15', hito, previsto: true, fuentes: ['acto'] }],
})

test('el mismo plazo de etiquetado reúne ambas normas y conserva la condición de entrada en vigor', () => {
  const normas = [norma('reglamento-delegado-2024-1364'), norma('reglamento-etiquetado-centros-datos-2026')]
  const originales = structuredClone(normas)
  const calendario = calendarioNormas(normas, '2026-10-16')
  assert.equal(calendario.length, 1)
  assert.deepEqual(calendario[0].normas.map((n) => n.id), normas.map((n) => n.id))
  assert.match(calendario[0].etiqueta, /sujeta a entrada en vigor/)
  assert.deepEqual(normas, originales)
})

test('fechas iguales no fusionan plazos distintos ni documentos sin la misma evidencia', () => {
  for (const segunda of [
    norma('reglamento-etiquetado-centros-datos-2026', 'https://example.org/otro-acto'),
    norma('reglamento-etiquetado-centros-datos-2026', undefined, 'Fin de una consulta pública'),
    norma('otra-norma'),
  ]) {
    const calendario = calendarioNormas([norma('reglamento-delegado-2024-1364'), segunda], '2026-10-16')
    assert.equal(calendario.length, 2)
  }
})
