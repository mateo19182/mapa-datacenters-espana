// Technical observations never renew factual review dates or accept changes.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { cargarTodo, RAIZ } from './load.mjs'
import { registrarLectura, aceptarPendiente, claseFallo } from './source-state.mjs'
import { comprobarFuente } from './source-check.mjs'
import { prepararRevision, fusionarHuellas } from './revision.mjs'
import { informeFuentes, requiereRevision } from './source-report.mjs'

const args = process.argv.slice(2)
const permitidos = new Set(['--limite', '--dias', '--solo-caducados', '--sellar', '--aceptar', '--informe', '--fusionar'])
for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (!permitidos.has(arg)) throw new Error(`Opción desconocida: ${arg}`)
  if (['--limite', '--dias', '--aceptar', '--fusionar'].includes(arg)) {
    const valor = args[++i]
    if (!valor || valor.startsWith('--')) throw new Error(`Falta el valor de ${arg}`)
    if (['--limite', '--dias'].includes(arg) && (!/^\d+$/.test(valor) || (arg === '--dias' && Number(valor) < 1))) throw new Error(`Valor inválido para ${arg}`)
    if (arg === '--dias' && valor !== '180') throw new Error('Los plazos dependen de la actividad. --dias 180 se admite por compatibilidad; usa /revision para consultar cada plazo.')
  }
}
const indiceLimite = args.indexOf('--limite')
const limite = indiceLimite < 0 ? Infinity : Number(args[indiceLimite + 1])
const rutaHuellas = join(RAIZ, 'data/huellas.json')
let huellas = existsSync(rutaHuellas) ? JSON.parse(readFileSync(rutaHuellas, 'utf8')) : {}
const hoy = new Date().toISOString().slice(0, 10)
const indiceFusionar = args.indexOf('--fusionar')
if (indiceFusionar >= 0) {
  huellas = fusionarHuellas(huellas, JSON.parse(readFileSync(args[indiceFusionar + 1], 'utf8')))
  writeFileSync(rutaHuellas, JSON.stringify(huellas, null, 1), 'utf8')
  console.log('Observaciones anteriores fusionadas; se conserva la huella aceptada en main.')
}
const indiceAceptar = args.indexOf('--aceptar')
if (indiceAceptar >= 0) {
  const url = args[indiceAceptar + 1]
  huellas[url] = aceptarPendiente(huellas[url], hoy)
  writeFileSync(rutaHuellas, JSON.stringify(huellas, null, 1), 'utf8')
  console.log(`Cambio aceptado: ${url}`)
}

const datos = cargarTodo()
const errores = datos.incidencias.filter((i) => i.nivel === 'error')
if (errores.length) throw new Error(`Datos inválidos: ${errores.map((e) => `${e.fichero}: ${e.msg}`).join('; ')}`)
let revision = prepararRevision([], { ...datos, huellas, hoy })
let comprobadas = 0
if (indiceAceptar < 0 && !args.includes('--informe') && !args.includes('--solo-caducados')) {
  const cola = revision.comprobacion_automatica.fuentes.map((f) => f.url).slice(0, limite)
  const total = cola.length
  console.log(`Comprobando ${total} fuentes…`)
  const trabajador = async () => {
    while (cola.length) {
      const url = cola.shift()
      const lectura = await comprobarFuente(url)
      if (lectura.estado === 'ok') huellas[url] = registrarLectura(huellas[url], lectura, hoy).estado
      else {
        huellas[url] = {
          ...huellas[url], ultimo_fallo: hoy,
          clase: lectura.estado === 'bloqueada' ? 'bloqueada' : claseFallo(lectura),
          motivo: lectura.codigo ? `HTTP ${lectura.codigo}` : lectura.mensaje,
        }
      }
      comprobadas++
      if (comprobadas % 50 === 0 || comprobadas === total) {
        writeFileSync(rutaHuellas, JSON.stringify(huellas, null, 1), 'utf8')
        console.log(`${comprobadas}/${total} fuentes observadas`)
      }
      if (cola.length) await new Promise((resolve) => setTimeout(resolve, 400))
    }
  }
  await Promise.all(Array.from({ length: 4 }, trabajador))
  writeFileSync(rutaHuellas, JSON.stringify(huellas, null, 1), 'utf8')
  revision = prepararRevision([], { ...datos, huellas, hoy })
}
if (args.includes('--sellar')) console.log('--sellar conserva las fechas de revisión factual.')
writeFileSync(join(RAIZ, 'research/informe-actualizacion.md'), informeFuentes(revision, { huellas }))
const tecnica = revision.comprobacion_automatica
console.log(`${comprobadas} fuentes comprobadas en esta ejecución; ${tecnica.con_observacion}/${tecnica.registradas} con observación guardada.`)
console.log(`${tecnica.cambios_pendientes} cambios pendientes; ${tecnica.rotas} respuestas 404/410; ${tecnica.bloqueadas} bloqueadas; ${tecnica.errores} fallos sin resultado.`)
console.log(`→ research/informe-actualizacion.md; ${revision.revision_factual.pendientes} revisiones factuales pendientes.`)
// 10 means review is needed, 1 is an execution failure, 0 has no pending work.
if (indiceAceptar < 0 && !args.includes('--informe') && requiereRevision(revision)) process.exitCode = 10
