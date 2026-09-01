// Carga los YAML del repositorio, los normaliza y los valida.
// Es el único punto por el que los datos entran en la tubería.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'
import {
  zSitio,
  normalizarSitio,
  revisarCoherencia,
  zNorma,
  normalizarNorma,
  revisarCoherenciaNorma,
} from './schema.mjs'

export const RAIZ = fileURLToPath(new URL('..', import.meta.url))
export const DIR_SITIOS = join(RAIZ, 'data/sites')
export const DIR_RED = join(RAIZ, 'data/red')
export const DIR_RENOVABLES = join(RAIZ, 'data/renovables')
export const DIR_NORMATIVA = join(RAIZ, 'data/normativa')

const listarYaml = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /\.ya?ml$/i.test(f))
        .sort()
        .map((f) => join(dir, f))
    : []

const leerYaml = (ruta) => YAML.parse(readFileSync(ruta, 'utf8'))

// Tabla de nombres canónicos de operador (data/operadores.yaml). La decisión de
// qué dos nombres son la misma empresa es humana y vive en ese fichero.
const RUTA_OPERADORES = join(RAIZ, 'data/operadores.yaml')
const canonico = new Map()
if (existsSync(RUTA_OPERADORES)) {
  const tabla = leerYaml(RUTA_OPERADORES) ?? {}
  for (const [nombre, variantes] of Object.entries(tabla)) {
    canonico.set(nombre.toLowerCase(), nombre)
    for (const v of variantes ?? []) canonico.set(String(v).toLowerCase(), nombre)
  }
}

// Igual que con los operadores, la forma canónica de cada comunidad autónoma
// vive en un fichero editable a mano.
const RUTA_COMUNIDADES = join(RAIZ, 'data/comunidades.yaml')
const canonicoCcaa = new Map()
if (existsSync(RUTA_COMUNIDADES)) {
  const tabla = leerYaml(RUTA_COMUNIDADES) ?? {}
  for (const [nombre, variantes] of Object.entries(tabla)) {
    canonicoCcaa.set(nombre.toLowerCase(), nombre)
    for (const v of variantes ?? []) canonicoCcaa.set(String(v).toLowerCase(), nombre)
  }
}

export const normalizarCcaa = (valor) =>
  valor == null ? null : (canonicoCcaa.get(String(valor).toLowerCase().trim()) ?? valor)

/** Unifica el nombre del operador conservando el original como alias. */
function canonizarOperador(sitio) {
  if (!sitio.operador) return sitio
  const destino = canonico.get(sitio.operador.toLowerCase())
  if (!destino || destino === sitio.operador) return sitio
  const original = sitio.operador
  return {
    ...sitio,
    operador: destino,
    alias: sitio.alias.includes(original) ? sitio.alias : [...sitio.alias, original],
  }
}

/** Carga data/sites/*.yaml. Devuelve sitios válidos y el parte de incidencias. */
export function cargarSitios() {
  const sitios = []
  const incidencias = []

  for (const ruta of listarYaml(DIR_SITIOS)) {
    const fichero = basename(ruta)
    let crudo
    try {
      crudo = leerYaml(ruta)
    } catch (e) {
      incidencias.push({ fichero, nivel: 'error', msg: `YAML ilegible: ${e.message}` })
      continue
    }
    if (!crudo || typeof crudo !== 'object') {
      incidencias.push({ fichero, nivel: 'error', msg: 'el fichero está vacío o no es un mapa YAML' })
      continue
    }
    if (Array.isArray(crudo)) {
      incidencias.push({ fichero, nivel: 'error', msg: 'un fichero = un emplazamiento; aquí hay una lista' })
      continue
    }

    const normalizado = normalizarSitio(crudo)
    const res = zSitio.safeParse(normalizado)
    if (!res.success) {
      for (const e of res.error.issues) {
        incidencias.push({ fichero, nivel: 'error', msg: `${e.path.join('.') || '(raíz)'}: ${e.message}` })
      }
      continue
    }
    const sitio = canonizarOperador(res.data)
    sitio.ubicacion.ccaa = normalizarCcaa(sitio.ubicacion.ccaa)
    if (sitio.id !== fichero.replace(/\.ya?ml$/i, '')) {
      incidencias.push({ fichero, nivel: 'aviso', msg: `el id «${sitio.id}» no coincide con el nombre del fichero` })
    }
    for (const p of revisarCoherencia(sitio)) incidencias.push({ fichero, ...p })
    sitios.push(sitio)
  }

  // Duplicados e identidades solapadas entre ficheros.
  const porId = new Map()
  for (const s of sitios) {
    if (porId.has(s.id)) incidencias.push({ fichero: `${s.id}.yaml`, nivel: 'error', msg: 'id repetido en dos ficheros' })
    porId.set(s.id, s)
  }
  for (const dup of detectarPosiblesDuplicados(sitios)) {
    incidencias.push({ fichero: dup.a, nivel: 'aviso', msg: `posible duplicado de ${dup.b}: ${dup.motivo}` })
  }

  return { sitios, incidencias }
}

const clave = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

/** Heurística de doble conteo: mismo nombre/alias, o mismo operador a <500 m. */
export function detectarPosiblesDuplicados(sitios) {
  const hallazgos = []
  const nombres = new Map()
  for (const s of sitios) {
    for (const n of [s.nombre, ...s.alias]) {
      const k = clave(n)
      if (!k) continue
      if (nombres.has(k) && nombres.get(k) !== s.id) {
        hallazgos.push({ a: `${s.id}.yaml`, b: nombres.get(k), motivo: `comparten el nombre «${n}»` })
      }
      nombres.set(k, s.id)
    }
  }
  for (let i = 0; i < sitios.length; i++) {
    for (let j = i + 1; j < sitios.length; j++) {
      const a = sitios[i]
      const b = sitios[j]
      if (!a.ubicacion.lat || !b.ubicacion.lat) continue
      if (clave(a.operador ?? '') !== clave(b.operador ?? '')) continue
      const d = distanciaKm(a.ubicacion, b.ubicacion)
      if (d < 0.5) {
        hallazgos.push({ a: `${a.id}.yaml`, b: b.id, motivo: `mismo operador a ${Math.round(d * 1000)} m` })
      }
    }
  }
  return hallazgos
}

export function distanciaKm(a, b) {
  const R = 6371
  const rad = (x) => (x * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Carga data/normativa/*.yaml. Un fichero, una norma, igual que con los
 * emplazamientos: se revisa a mano en un pull request y no se genera.
 */
export function cargarNormativa() {
  const normas = []
  const incidencias = []

  for (const ruta of listarYaml(DIR_NORMATIVA)) {
    const fichero = basename(ruta)
    let crudo
    try {
      crudo = leerYaml(ruta)
    } catch (e) {
      incidencias.push({ fichero, nivel: 'error', msg: `YAML ilegible: ${e.message}` })
      continue
    }
    if (!crudo || typeof crudo !== 'object' || Array.isArray(crudo)) {
      incidencias.push({ fichero, nivel: 'error', msg: 'un fichero = una norma' })
      continue
    }

    const res = zNorma.safeParse(normalizarNorma(crudo))
    if (!res.success) {
      for (const e of res.error.issues) {
        incidencias.push({ fichero, nivel: 'error', msg: `${e.path.join('.') || '(raíz)'}: ${e.message}` })
      }
      continue
    }
    const norma = res.data
    norma.ccaa = norma.ccaa.map((c) => normalizarCcaa(c))
    if (norma.id !== fichero.replace(/\.ya?ml$/i, '')) {
      incidencias.push({ fichero, nivel: 'aviso', msg: `el id «${norma.id}» no coincide con el nombre del fichero` })
    }
    for (const p of revisarCoherenciaNorma(norma)) incidencias.push({ fichero, ...p })
    normas.push(norma)
  }

  const vistos = new Set()
  for (const n of normas) {
    if (vistos.has(n.id)) incidencias.push({ fichero: `${n.id}.yaml`, nivel: 'error', msg: 'id repetido' })
    vistos.add(n.id)
  }
  // `relacionadas` apunta dentro del propio conjunto: si el destino no existe,
  // la ficha enlazaría a un vacío.
  for (const n of normas) {
    for (const rel of n.relacionadas) {
      if (!vistos.has(rel)) {
        incidencias.push({ fichero: `${n.id}.yaml`, nivel: 'aviso', msg: `«relacionadas» apunta a la norma inexistente «${rel}»` })
      }
    }
  }

  return { normas, incidencias }
}

/** Ficheros de red y renovables: listas de objetos, validación ligera. */
export function cargarListas(dir, etiqueta) {
  const items = []
  const incidencias = []
  for (const ruta of listarYaml(dir)) {
    const fichero = basename(ruta)
    let crudo
    try {
      crudo = leerYaml(ruta)
    } catch (e) {
      incidencias.push({ fichero, nivel: 'error', msg: `YAML ilegible: ${e.message}` })
      continue
    }
    // Admite tres formas: lista suelta, objeto único, u objeto envoltorio con
    // metadatos comunes (`fuentes`, `ultima_verificacion`) y la lista dentro.
    let lista
    let comunes = {}
    if (Array.isArray(crudo)) {
      lista = crudo
    } else if (crudo == null) {
      lista = []
    } else {
      // Un objeto con `id` propio es un registro suelto, no un envoltorio: sus
      // listas internas (incertidumbres, alias…) son campos suyos.
      const clave = crudo.id ? null : Object.keys(crudo).find(
        (k) =>
          k !== 'fuentes' &&
          Array.isArray(crudo[k]) &&
          crudo[k].length > 0 &&
          crudo[k].every((v) => v && typeof v === 'object' && !Array.isArray(v)),
      )
      if (clave) {
        lista = crudo[clave]
        // Los escalares de cabecera (fechas, ámbito, notas) valen para todos
        // los registros del fichero.
        comunes = Object.fromEntries(
          Object.entries(crudo).filter(([k, v]) => k !== clave && (!Array.isArray(v) || k === 'fuentes')),
        )
      } else {
        lista = [crudo]
      }
    }
    for (const [i, it] of lista.entries()) {
      if (!it || typeof it !== 'object') continue
      // El identificador puede venir con otro nombre según la entidad
      // (un nudo de red se identifica por su nombre y tensión, no por un id).
      const id = it.id ?? (it.nudo ? clave(`${it.nudo}`) : it.nombre ? clave(it.nombre) : null)
      if (!id) {
        incidencias.push({ fichero, nivel: 'error', msg: `${etiqueta}[${i}] sin identificador` })
        continue
      }
      const fuentesItem = it.fuentes ?? comunes.fuentes
      if (!Array.isArray(fuentesItem) || fuentesItem.length === 0) {
        incidencias.push({ fichero, nivel: 'aviso', msg: `${etiqueta} «${it.id}» sin fuentes` })
      }
      const registro = { ...comunes, ...it, id, _fichero: fichero }
      if (registro.ccaa) registro.ccaa = normalizarCcaa(registro.ccaa)
      items.push(registro)
    }
  }
  const vistos = new Set()
  for (const it of items) {
    if (vistos.has(it.id)) incidencias.push({ fichero: it._fichero, nivel: 'error', msg: `id repetido: ${it.id}` })
    vistos.add(it.id)
  }
  return { items, incidencias }
}

const soloDe = (items, patron) => items.filter((i) => patron.test(i._fichero))

export function cargarTodo() {
  const sitios = cargarSitios()
  const red = cargarListas(DIR_RED, 'nodo de red')
  const renovables = cargarListas(DIR_RENOVABLES, 'activo renovable')
  const normativa = cargarNormativa()

  // En data/red conviven tres entidades distintas: los emplazamientos físicos
  // (subestaciones), las actuaciones planificadas y los datos de capacidad de
  // acceso por nudo. Solo las primeras se dibujan en el mapa.
  const subestaciones = soloDe(red.items, /subestacion/i)
  const actuaciones = soloDe(red.items, /actuacion/i)
  const capacidad = soloDe(red.items, /capacidad/i)

  // La capacidad se publica por nudo; se adjunta a su subestación para poder
  // consultarla desde el mapa sin mezclar los dos registros.
  const porSubestacion = new Map()
  for (const c of capacidad) {
    const ref = c.subestacion_id
    if (!ref) continue
    if (!porSubestacion.has(ref)) porSubestacion.set(ref, [])
    porSubestacion.get(ref).push(c)
  }
  for (const se of subestaciones) {
    const nudos = porSubestacion.get(se.id) ?? []
    if (nudos.length) se.nudos = nudos
  }

  return {
    sitios: sitios.sitios,
    red: subestaciones,
    actuaciones,
    capacidad,
    renovables: renovables.items,
    normativa: normativa.normas,
    incidencias: [
      ...sitios.incidencias,
      ...red.incidencias.map((i) => ({ ...i, fichero: `red/${i.fichero}` })),
      ...renovables.incidencias.map((i) => ({ ...i, fichero: `renovables/${i.fichero}` })),
      ...normativa.incidencias.map((i) => ({ ...i, fichero: `normativa/${i.fichero}` })),
    ],
  }
}
