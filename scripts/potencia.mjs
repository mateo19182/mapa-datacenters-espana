// Reglas de agregación de potencia. Están aquí, en un solo sitio, porque son la
// decisión metodológica más delicada del proyecto: sumar mal produce cifras
// falsas con aspecto de rigor.
//
// Reglas:
//  1. Cada tipo de potencia (it / conexion_red / instalada_total / no_especificado)
//     se agrega por separado y NUNCA se suma con otro tipo.
//  2. Dentro de un tipo, si hay un registro de ámbito campus o edificio, ese manda
//     y NO se le suman las fases: se entiende que el dato global ya las incluye.
//     Si solo hay registros de fase, se suman entre sí.
//  3. Cuando hay varios registros del mismo ámbito y tipo (fuentes que discrepan),
//     se toma el más reciente por `fecha_dato` y se marca `discrepancia: true`
//     conservando el rango observado.
//  4. `no_especificado` no se compara ni se mezcla con nada: solo se muestra.

const ORDEN_AMBITO = { campus: 0, edificio: 0, fase: 1 }

const masReciente = (a, b) => {
  const fa = a.fecha_dato ?? ''
  const fb = b.fecha_dato ?? ''
  return fb.localeCompare(fa) // descendente: primero el más nuevo
}

/** Agrega los registros de un mismo tipo de potencia. */
function agregarTipo(registros) {
  if (registros.length === 0) return null

  const globales = registros.filter((p) => ORDEN_AMBITO[p.ambito] === 0)
  const usados = globales.length > 0 ? globales : registros
  const base = globales.length > 0 ? 'global' : 'suma_de_fases'

  const valores = usados.map((p) => p.valor_mw ?? p.valor_mw_max).filter((v) => v != null)
  if (valores.length === 0) return null

  let valor
  let discrepancia = false
  if (base === 'global') {
    const ordenados = [...usados].sort(masReciente)
    valor = ordenados[0].valor_mw ?? ordenados[0].valor_mw_max
    discrepancia = new Set(valores).size > 1
  } else {
    valor = valores.reduce((a, b) => a + b, 0)
  }

  return {
    valor_mw: Math.round(valor * 100) / 100,
    base,
    discrepancia,
    minimo_observado: Math.min(...valores),
    maximo_observado: Math.max(...valores),
    registros: usados.length,
    fecha_dato: [...usados].sort(masReciente)[0].fecha_dato ?? null,
  }
}

/** Devuelve {it, conexion_red, instalada_total, no_especificado} — cada uno o null. */
export function resumirPotencia(potencias) {
  const porTipo = { it: [], conexion_red: [], instalada_total: [], no_especificado: [] }
  for (const p of potencias) (porTipo[p.tipo] ?? porTipo.no_especificado).push(p)
  return {
    it: agregarTipo(porTipo.it),
    conexion_red: agregarTipo(porTipo.conexion_red),
    instalada_total: agregarTipo(porTipo.instalada_total),
    no_especificado: agregarTipo(porTipo.no_especificado),
  }
}

/**
 * Suma de una cartera respetando las reglas: solo se suman sitios que tengan el
 * tipo pedido, y se informa de cuántos quedan fuera por no tener ese dato.
 */
export function sumarCartera(sitios, tipo) {
  let total = 0
  let conDato = 0
  const sinDato = []
  for (const s of sitios) {
    const r = s.resumen_potencia?.[tipo]
    if (r?.valor_mw != null) {
      total += r.valor_mw
      conDato++
    } else {
      sinDato.push(s.id)
    }
  }
  return {
    total_mw: Math.round(total * 10) / 10,
    sitios_con_dato: conDato,
    sitios_sin_dato: sinDato.length,
    cobertura: sitios.length ? Math.round((conDato / sitios.length) * 100) : 0,
  }
}
