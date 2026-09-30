// Detecta nuevas publicaciones de capacidad de acceso para demanda de REE.
// No modifica las cifras: el CSV necesita una reconciliación por nudo.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import YAML from 'yaml'
import { RAIZ } from './load.mjs'

const PAGINA = 'https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso'
const rutaDatos = join(RAIZ, 'data/red/capacidad.yaml')
const rutaInforme = join(RAIZ, 'research/informe-ree.md')
const fechaActual = YAML.parse(readFileSync(rutaDatos, 'utf8')).fecha_publicacion_dato
const hoy = new Date().toISOString().slice(0, 10)

const lineas = ['# Revisión de capacidad de acceso de REE', '', `Comprobado el ${hoy}.`, '']
try {
  const respuesta = await fetch(PAGINA, { signal: AbortSignal.timeout(20000) })
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
  const html = await respuesta.text()
  const enlaces = [...html.matchAll(/href="([^"]*?(\d{4})_(\d{2})_(\d{2})_GRT_demanda\.csv)"/g)]
  if (!enlaces.length) throw new Error('No se encontró el enlace al CSV de demanda')
  const ultimo = enlaces.sort((a, b) => a[1].localeCompare(b[1])).at(-1)
  const fechaNueva = `${ultimo[2]}-${ultimo[3]}-${ultimo[4]}`
  const urlNueva = new URL(ultimo[1].replaceAll('&amp;', '&'), PAGINA).href
  lineas.push(`- Fecha en el repositorio: **${fechaActual}**`)
  lineas.push(`- Fecha publicada por REE: **${fechaNueva}**`)
  lineas.push(`- [Página oficial](${PAGINA})`)
  lineas.push(`- [CSV oficial](${urlNueva})`, '')
  if (fechaNueva > fechaActual) {
    lineas.push('## Pendiente', '')
    lineas.push('Hay una edición más reciente. Comparar el CSV por código de subestación,')
    lineas.push('revisar columnas y unidades, actualizar `data/red/capacidad.yaml` y validar.')
    lineas.push('No cambiar solo la fecha: los valores del YAML siguen siendo los de la edición anterior.')
  } else {
    lineas.push('El repositorio ya usa la última edición enlazada por REE.')
  }
  writeFileSync(rutaInforme, lineas.join('\n') + '\n')
  console.log(`REE: repositorio ${fechaActual}, publicación ${fechaNueva}`)
  if (fechaNueva > fechaActual) process.exitCode = 10
} catch (error) {
  lineas.push(`No se pudo verificar la publicación: ${error.message}`)
  writeFileSync(rutaInforme, lineas.join('\n') + '\n')
  console.error(error.message)
  process.exitCode = 1
}
