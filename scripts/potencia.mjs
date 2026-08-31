// Reglas de agregación de potencia. Están aquí, en un solo sitio, porque son la
// decisión metodológica más delicada del proyecto: sumar mal produce cifras
// falsas con aspecto de rigor.
//
// Reglas:
//  1. Cada tipo de potencia (it / conexion_red / instalada_total / no_especificado)
//     se agrega por separado y NUNCA se suma con otro tipo.
//  2. Una cifra de ámbito `campus` manda sobre cualquier suma: se entiende que
//     el dato global ya incluye edificios y fases.
//  2b. Los registros de ámbito `edificio` solo se suman cuando nombran unidades
//     distintas mediante el campo `edificio`. Si no lo hacen, se tratan como
//     lecturas rivales del mismo edificio y se toma la más reciente. Por defecto
//     nunca se infla: sumar exige que la fuente diga que son cosas distintas.
//  3. Cuando hay varios registros del mismo ámbito y tipo (fuentes que discrepan),
//     se toma el más reciente por `fecha_dato` y se marca `discrepancia: true`
//     conservando el rango observado.
//  4. `no_especificado` no se compara ni se mezcla con nada: solo se muestra.
//  4b. `discrepancia` solo puede ver los choques DENTRO de un mismo tipo y
//     ámbito, porque es lo único que la regla 1 permite comparar. Pero en este
//     conjunto las contradicciones más fuertes son casi siempre entre tipos: un
//     expediente que publica 288 MW de demanda frente a una nota de prensa que
//     anuncia 1.000 MW de carga TI no produce ninguna discrepancia detectable, y
//     el agregado sale limpio. Para que eso no se pierda, quien llama pasa
//     `disputada` cuando la ficha declara una incertidumbre sobre `potencia`, y
//     la marca viaja con cada magnitud del resumen. No cambia ninguna cifra:
//     cambia lo que el sitio puede decir sobre ella.
//  5. `termica_respaldo` y `generacion_asociada` no son capacidad del centro de
//     datos. Se registran y se muestran, pero no entran en ninguna suma.

import { TIPOS_POTENCIA } from './schema.mjs'

const masReciente = (a, b) => {
  const fa = a.fecha_dato ?? ''
  const fb = b.fecha_dato ?? ''
  return fb.localeCompare(fa) // descendente: primero el más nuevo
}

/** De un grupo de lecturas rivales se queda la más reciente. */
function elegirLectura(grupo) {
  const ordenado = [...grupo].sort(masReciente)
  const valores = grupo.map((p) => p.valor_mw ?? p.valor_mw_max).filter((v) => v != null)
  return {
    valor: ordenado[0].valor_mw ?? ordenado[0].valor_mw_max,
    fecha: ordenado[0].fecha_dato ?? null,
    discrepancia: new Set(valores).size > 1,
    valores,
  }
}

/** Agrega los registros de un mismo tipo de potencia. */
function agregarTipo(registros) {
  if (registros.length === 0) return null

  const globales = registros.filter((p) => p.ambito === 'campus')
  const edificios = registros.filter((p) => p.ambito === 'edificio')
  const fases = registros.filter((p) => p.ambito === 'fase')
  const acumuladas = fases.filter((p) => p.acumulado)

  // 1. Una cifra publicada para el conjunto manda sobre cualquier suma.
  if (globales.length) {
    const { valor, fecha, discrepancia, valores } = elegirLectura(globales)
    if (valor == null) return null
    return construir(valor, 'global', discrepancia, valores, globales.length, fecha)
  }

  // 2. Edificios: solo suman los que nombran unidades distintas. Los que no
  //    identifican edificio son lecturas del mismo, y se elige una.
  if (edificios.length) {
    const porUnidad = new Map()
    for (const p of edificios) {
      const clave = p.edificio ?? '(sin identificar)'
      if (!porUnidad.has(clave)) porUnidad.set(clave, [])
      porUnidad.get(clave).push(p)
    }
    const lecturas = [...porUnidad.values()].map(elegirLectura).filter((l) => l.valor != null)
    if (!lecturas.length) return null
    const valor = lecturas.reduce((a, l) => a + l.valor, 0)
    const todos = lecturas.flatMap((l) => l.valores)
    return construir(
      valor,
      porUnidad.size > 1 ? 'suma_de_edificios' : 'edificio',
      lecturas.some((l) => l.discrepancia),
      todos,
      edificios.length,
      [...edificios].sort(masReciente)[0].fecha_dato ?? null,
    )
  }

  // 3. Fases: los hitos acumulados no se suman entre sí; el resto sí.
  const usadas = acumuladas.length ? acumuladas : fases
  const valores = usadas.map((p) => p.valor_mw ?? p.valor_mw_max).filter((v) => v != null)
  if (!valores.length) return null
  const valor = acumuladas.length ? Math.max(...valores) : valores.reduce((a, b) => a + b, 0)
  return construir(
    valor,
    acumuladas.length ? 'maximo_acumulado' : 'suma_de_fases',
    false,
    valores,
    usadas.length,
    [...usadas].sort(masReciente)[0].fecha_dato ?? null,
  )
}

const construir = (valor, base, discrepancia, valores, registros, fecha, disputada = false) => ({
  valor_mw: Math.round(valor * 100) / 100,
  base,
  discrepancia,
  // Contradicción declarada en la ficha, aunque las lecturas de este tipo
  // concreto coincidan entre sí. Ver la regla 4b.
  disputada,
  minimo_observado: Math.min(...valores),
  maximo_observado: Math.max(...valores),
  registros,
  fecha_dato: fecha,
})

/**
 * Un resumen por cada tipo de potencia presente; null donde no hay dato.
 *
 * `disputada` indica que la ficha documenta una contradicción sobre la potencia
 * que la agregación por tipos no puede ver por sí sola (regla 4b).
 */
export function resumirPotencia(potencias, { disputada = false } = {}) {
  const porTipo = Object.fromEntries(TIPOS_POTENCIA.map((t) => [t, []]))
  for (const p of potencias) (porTipo[p.tipo] ?? porTipo.no_especificado).push(p)
  return Object.fromEntries(
    TIPOS_POTENCIA.map((t) => {
      const r = agregarTipo(porTipo[t])
      return [t, r && { ...r, disputada }]
    }),
  )
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
