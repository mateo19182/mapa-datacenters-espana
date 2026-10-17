// Integra propuestas de cambio con revisión de conflictos.
//
// Una propuesta es un YAML parcial en data/propuestas/<id>.yaml con la misma
// forma que el emplazamiento y solo los campos que cambian. La política es:
//
//   · campo que no existía        → adición, se aplica sin más
//   · campo idéntico al registrado → no hay nada que hacer
//   · campo con valor distinto     → CONFLICTO: no se sobrescribe nunca
//
// Los conflictos se listan para que una persona decida. Cuando el dato nuevo
// contradice al viejo lo correcto casi siempre es conservar ambos y documentar
// la discrepancia, no elegir uno.
//
// Uso: node scripts/apply-proposals.mjs [--aplicar]
import { readdirSync, readFileSync, writeFileSync, existsSync, renameSync, mkdirSync } from 'node:fs'
import { join, basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import YAML from 'yaml'
import { RAIZ } from './load.mjs'

const iguales = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// Campos escalares donde un valor distinto es siempre un conflicto.
const ESCALARES = [
  'nombre',
  'tipo',
  'operador',
  'propietario',
  'cliente_ancla',
  'modelo',
  'estado',
  'estado_detalle',
  'fecha_puesta_en_servicio',
  'superficie_parcela_m2',
  'superficie_construida_m2',
  'inversion_anunciada_eur',
  'refrigeracion',
  'confianza',
]

// Los identificadores de una propuesta pertenecen a esa propuesta. Si se cambia
// uno al integrarlo, sus referencias deben cambiar juntas, sin tocar la ficha previa.
function prepararFuentes(propuesta, actual, fichero) {
  const existentes = actual?.fuentes ?? []
  const ids = new Set(existentes.map((f) => f.id))
  const porUrl = new Map(existentes.map((f) => [f.url, f.id]))
  const definiciones = new Map()
  const equivalencias = new Map()
  const nuevas = []

  for (const f of propuesta.fuentes ?? []) {
    if (typeof f?.id !== 'string' || !f.id || typeof f.url !== 'string' || !f.url) {
      throw new Error(`${fichero}: cada fuente propuesta necesita id y url.`)
    }
    if (definiciones.has(f.id) && definiciones.get(f.id) !== f.url) {
      throw new Error(`${fichero}: la fuente ${f.id} está definida con dos URLs distintas.`)
    }
    definiciones.set(f.id, f.url)

    // Si la ficha conserva dos lecturas de una URL, respetar el ID explícito
    // cuando ya corresponde a esa URL; para un alias basta reutilizar una.
    const misma = existentes.find((g) => g.id === f.id && g.url === f.url)
    let final = misma?.id ?? porUrl.get(f.url)
    if (!final) {
      final = f.id
      while (ids.has(final)) final = `${final}b`
      nuevas.push({ ...f, id: final })
      ids.add(final)
      porUrl.set(f.url, final)
    }
    equivalencias.set(f.id, final)
  }

  function referencias(valor, ruta = []) {
    if (Array.isArray(valor)) return valor.map((v, i) => referencias(v, [...ruta, i]))
    if (!valor || typeof valor !== 'object') return valor
    return Object.fromEntries(Object.entries(valor).map(([campo, contenido]) => {
      if (campo === 'fuentes' && ruta.length === 0) return [campo, nuevas]
      if ((campo === 'fuentes' || campo.endsWith('_fuentes')) && contenido != null) {
        if (!Array.isArray(contenido) || contenido.some((id) => typeof id !== 'string')) {
          throw new Error(`${fichero}: ${[...ruta, campo].join('.')} debe contener identificadores de fuentes.`)
        }
        const finales = contenido.map((id) => {
          const final = equivalencias.get(id) ?? id
          if (!ids.has(final)) {
            throw new Error(`${fichero}: referencia a fuente desconocida ${id} en ${[...ruta, campo].join('.')}.`)
          }
          return final
        })
        return [campo, [...new Set(finales)]]
      }
      return [campo, referencias(contenido, [...ruta, campo])]
    }))
  }
  return referencias(propuesta)
}

export function integrarPropuestas({ raiz = RAIZ, aplicar = false, hoy = new Date().toISOString().slice(0, 10) } = {}) {
  const APLICAR = aplicar
  const DIR_SITIOS = join(raiz, 'data/sites')
  const DIR_PROPUESTAS = join(raiz, 'data/propuestas')
  const DIR_INTEGRADAS = join(DIR_PROPUESTAS, 'integradas')

  if (!existsSync(DIR_PROPUESTAS)) {
    console.log('No hay data/propuestas/: nada que integrar.')
    return { adiciones: [], conflictos: [], sinCambios: [] }
  }

  const adiciones = []
  const conflictos = []
  const sinCambios = []

  const ficheros = readdirSync(DIR_PROPUESTAS).filter((f) => /\.ya?ml$/i.test(f))

  // Validar fechas y referencias antes de escribir cualquier ficha de la tanda.
  const propuestas = new Map(ficheros.map((fichero) => {
    const id = basename(fichero).replace(/\.ya?ml$/i, '')
    const propuesta = YAML.parse(readFileSync(join(DIR_PROPUESTAS, fichero), 'utf8'))
    const rutaSitio = join(DIR_SITIOS, `${id}.yaml`)
    const actual = existsSync(rutaSitio) ? YAML.parse(readFileSync(rutaSitio, 'utf8')) : null
    if (!actual) {
      const fecha = propuesta?.ultima_verificacion
      if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
          !Number.isFinite(Date.parse(fecha)) || new Date(fecha).toISOString().slice(0, 10) !== fecha || fecha > hoy) {
        throw new Error(`${fichero}: un alta nueva necesita ultima_verificacion explícita y válida (AAAA-MM-DD), sin fecha futura.`)
      }
    }
    return [fichero, prepararFuentes(propuesta, actual, fichero)]
  }))

  for (const fichero of ficheros) {
    const id = basename(fichero).replace(/\.ya?ml$/i, '')
    const rutaSitio = join(DIR_SITIOS, `${id}.yaml`)
    const propuesta = propuestas.get(fichero)

    if (!existsSync(rutaSitio)) {
      adiciones.push({ id, campo: '(emplazamiento entero)', valor: 'alta nueva', fichero })
      if (APLICAR) {
        writeFileSync(rutaSitio, YAML.stringify(propuesta), 'utf8')
      }
      continue
    }

    const actual = YAML.parse(readFileSync(rutaSitio, 'utf8'))
    const resultado = structuredClone(actual)
    let tocado = false

    // Fuentes nuevas: siempre son adición, jamás sustituyen a las existentes.
    for (const f of propuesta.fuentes ?? []) {
      resultado.fuentes = [...(resultado.fuentes ?? []), { ...f, fecha_consulta: f.fecha_consulta ?? hoy }]
      adiciones.push({ id, campo: 'fuentes', valor: f.url, fichero })
      tocado = true
    }

    for (const campo of ESCALARES) {
      if (!(campo in propuesta) || propuesta[campo] == null) continue
      const antes = actual[campo]
      if (antes == null || antes === '') {
        resultado[campo] = propuesta[campo]
        adiciones.push({ id, campo, valor: propuesta[campo], fichero })
        tocado = true
      } else if (!iguales(antes, propuesta[campo])) {
        conflictos.push({ id, campo, antes, ahora: propuesta[campo], fichero })
      } else {
        sinCambios.push({ id, campo })
      }
    }

    // Ubicación: mover un punto ya situado es un conflicto; añadirlo, una adición.
    for (const campo of ['lat', 'lon', 'municipio', 'provincia', 'ccaa', 'direccion', 'precision']) {
      const nuevo = propuesta.ubicacion?.[campo]
      if (nuevo == null) continue
      const antes = actual.ubicacion?.[campo]
      if (antes == null) {
        resultado.ubicacion = { ...resultado.ubicacion, [campo]: nuevo }
        adiciones.push({ id, campo: `ubicacion.${campo}`, valor: nuevo, fichero })
        tocado = true
      } else if (!iguales(antes, nuevo)) {
        conflictos.push({ id, campo: `ubicacion.${campo}`, antes, ahora: nuevo, fichero })
      }
    }

    // Potencias: una lectura nueva del mismo tipo y ámbito con otro valor es el
    // conflicto más delicado del conjunto. Se registra, nunca se pisa.
    for (const p of propuesta.potencia ?? []) {
      const gemela = (actual.potencia ?? []).find(
        (q) => q.tipo === p.tipo && q.ambito === p.ambito && (q.referencia ?? null) === (p.referencia ?? null),
      )
      if (!gemela) {
        resultado.potencia = [...(resultado.potencia ?? []), p]
        adiciones.push({ id, campo: 'potencia', valor: `${p.valor_mw} MW ${p.tipo} (${p.referencia ?? 'sin referencia'})`, fichero })
        tocado = true
      } else if (gemela.valor_mw !== p.valor_mw) {
        conflictos.push({
          id,
          campo: `potencia ${p.tipo} · ${p.referencia ?? 'sin referencia'}`,
          antes: `${gemela.valor_mw} MW`,
          ahora: `${p.valor_mw} MW`,
          fichero,
          consejo: 'conservar ambas lecturas y documentar la discrepancia en incertidumbres[]',
        })
      }
    }

    // Fases nuevas por nombre.
    for (const f of propuesta.fases ?? []) {
      if ((actual.fases ?? []).some((g) => g.nombre === f.nombre)) continue
      resultado.fases = [...(resultado.fases ?? []), f]
      adiciones.push({ id, campo: 'fases', valor: f.nombre, fichero })
      tocado = true
    }

    // Agua: campo a campo, porque una propuesta suele traer solo el consumo o
    // solo el sistema, y sustituir el bloque entero borraría lo que ya constaba.
    if (propuesta.agua) {
      for (const campo of ['circuito', 'sistema', 'origen', 'consumo_m3_ano', 'consumo_m3_dia', 'wue_l_kwh']) {
        const nuevo = propuesta.agua[campo]
        if (nuevo == null) continue
        const antes = actual.agua?.[campo]
        if (antes == null) {
          resultado.agua = { ...(resultado.agua ?? {}), [campo]: nuevo }
          adiciones.push({ id, campo: `agua.${campo}`, valor: nuevo, fichero })
          tocado = true
        } else if (!iguales(antes, nuevo)) {
          conflictos.push({
            id,
            campo: `agua.${campo}`,
            antes,
            ahora: nuevo,
            fichero,
            consejo: 'el consumo diario y el anual no se convierten entre sí; documentar la discrepancia en incertidumbres[]',
          })
        }
      }
      const nuevas = (propuesta.agua.fuentes ?? []).filter((f) => !(actual.agua?.fuentes ?? []).includes(f))
      if (nuevas.length && resultado.agua) {
        resultado.agua.fuentes = [...(actual.agua?.fuentes ?? []), ...nuevas]
        tocado = true
      }
    }

    // Consumo eléctrico: misma referencia y otro valor es conflicto.
    for (const e of propuesta.energia ?? []) {
      const gemela = (actual.energia ?? []).find((g) => (g.referencia ?? null) === (e.referencia ?? null))
      if (!gemela) {
        resultado.energia = [...(resultado.energia ?? []), e]
        adiciones.push({ id, campo: 'energia', valor: `${e.consumo_gwh_ano} GWh/año`, fichero })
        tocado = true
      } else if (gemela.consumo_gwh_ano !== e.consumo_gwh_ano) {
        conflictos.push({
          id,
          campo: `energia · ${e.referencia ?? 'sin referencia'}`,
          antes: gemela.consumo_gwh_ano,
          ahora: e.consumo_gwh_ano,
          fichero,
          consejo: 'conservar ambas lecturas con su fecha_dato y documentar la discrepancia',
        })
      }
    }

    // Empleo: una cifra del mismo tipo y la misma referencia con otro valor es un
    // conflicto; lo demás, un registro más.
    for (const e of propuesta.empleo ?? []) {
      const gemela = (actual.empleo ?? []).find(
        (g) => g.tipo === e.tipo && (g.referencia ?? null) === (e.referencia ?? null),
      )
      if (!gemela) {
        resultado.empleo = [...(resultado.empleo ?? []), e]
        adiciones.push({ id, campo: 'empleo', valor: `${e.valor} (${e.tipo})`, fichero })
        tocado = true
      } else if (gemela.valor !== e.valor) {
        conflictos.push({
          id,
          campo: `empleo ${e.tipo} · ${e.referencia ?? 'sin referencia'}`,
          antes: gemela.valor,
          ahora: e.valor,
          fichero,
          consejo: 'conservar ambas cifras con su fecha_dato y documentar la discrepancia',
        })
      }
    }

    for (const u of propuesta.incertidumbres ?? []) {
      if ((actual.incertidumbres ?? []).some((v) => v.descripcion === u.descripcion)) continue
      resultado.incertidumbres = [...(resultado.incertidumbres ?? []), u]
      adiciones.push({ id, campo: 'incertidumbres', valor: u.campo, fichero })
      tocado = true
    }

    for (const a of propuesta.alias ?? []) {
      if ((actual.alias ?? []).includes(a)) continue
      resultado.alias = [...(resultado.alias ?? []), a]
      adiciones.push({ id, campo: 'alias', valor: a, fichero })
      tocado = true
    }

    if (APLICAR && tocado) {
      // Añadir datos automáticamente no cambia la fecha de revisión factual.
      writeFileSync(rutaSitio, YAML.stringify(resultado), 'utf8')
    }
  }

  // --- informe -----------------------------------------------------------------

  const l = []
  l.push('# Integración de propuestas', '')
  l.push(`Generado el ${hoy}. Modo: **${APLICAR ? 'aplicado' : 'simulación'}**.`, '')
  l.push(`- Propuestas leídas: **${ficheros.length}**`)
  l.push(`- Adiciones ${APLICAR ? 'aplicadas' : 'aplicables'}: **${adiciones.length}**`)
  l.push(`- Conflictos que requieren decisión humana: **${conflictos.length}**`)
  l.push(`- Campos ya coincidentes: **${sinCambios.length}**`, '')

  if (conflictos.length) {
    l.push('## Conflictos', '')
    l.push('Ningún valor registrado se ha sobrescrito. Cada línea necesita una decisión.', '')
    l.push('| Emplazamiento | Campo | Registrado | Propuesto | Recomendación |')
    l.push('|---|---|---|---|---|')
    for (const c of conflictos) {
      l.push(
        `| \`${c.id}\` | ${c.campo} | ${JSON.stringify(c.antes)} | ${JSON.stringify(c.ahora)} | ` +
          `${c.consejo ?? 'verificar cuál fuente es más reciente y fiable; si ambas lo son, documentar la discrepancia'} |`,
      )
    }
    l.push('')
  }

  if (adiciones.length) {
    l.push('## Adiciones', '')
    l.push('| Emplazamiento | Campo | Valor |')
    l.push('|---|---|---|')
    for (const a of adiciones) l.push(`| \`${a.id}\` | ${a.campo} | ${String(a.valor).slice(0, 120)} |`)
    l.push('')
  }

  if (!conflictos.length && !adiciones.length) l.push('Nada que integrar: las propuestas ya están reflejadas.', '')

  writeFileSync(join(raiz, 'research/informe-propuestas.md'), l.join('\n'), 'utf8')

  // Las propuestas ya integradas se archivan para no reprocesarlas.
  if (APLICAR && !conflictos.length && ficheros.length) {
    mkdirSync(DIR_INTEGRADAS, { recursive: true })
    for (const f of ficheros) renameSync(join(DIR_PROPUESTAS, f), join(DIR_INTEGRADAS, `${hoy}-${f}`))
  }

  console.log(
    `${ficheros.length} propuestas · ${adiciones.length} adiciones ${APLICAR ? 'aplicadas' : 'aplicables'} · ` +
      `${conflictos.length} conflictos\n→ research/informe-propuestas.md`,
  )

  return { adiciones, conflictos, sinCambios }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const resultado = integrarPropuestas({ aplicar: process.argv.includes('--aplicar') })
  if (resultado.conflictos.length) process.exitCode = 11
}
