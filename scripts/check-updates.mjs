// Technical observations never renew factual review dates or accept changes.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import YAML from 'yaml'
import { cargarTodo, RAIZ } from './load.mjs'
import { registrarLectura, aceptarPendiente, claseFallo } from './source-state.mjs'
import { comprobarFuente } from './source-check.mjs'
import { prepararRevision, fusionarHuellas } from './revision.mjs'
import { informeFuentes, requiereRevision } from './source-report.mjs'
import { guardarComparacion } from './source-content.mjs'
import { fusionarHistorial, resumenSeguimiento, informeSeguimiento } from './source-review.mjs'

const args = process.argv.slice(2)
const permitidos = new Set(['--limite', '--dias', '--solo-caducados', '--sellar', '--aceptar', '--informe', '--fusionar', '--fusionar-historial', '--url'])
for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (!permitidos.has(arg)) throw new Error(`Opción desconocida: ${arg}`)
  if (['--limite', '--dias', '--aceptar', '--fusionar', '--fusionar-historial', '--url'].includes(arg)) {
    const valor = args[++i]
    if (!valor || valor.startsWith('--')) throw new Error(`Falta el valor de ${arg}`)
    if (['--limite', '--dias'].includes(arg) && (!/^\d+$/.test(valor) || (arg === '--dias' && Number(valor) < 1))) throw new Error(`Valor inválido para ${arg}`)
    if (arg === '--dias' && valor !== '180') throw new Error('Los plazos dependen de la actividad. --dias 180 se admite por compatibilidad; usa /revision para consultar cada plazo.')
  }
}
const indiceLimite = args.indexOf('--limite')
const limite = indiceLimite < 0 ? Infinity : Number(args[indiceLimite + 1])
const rutaHuellas = join(RAIZ, 'data/huellas.json')
const rutaHistorial = join(RAIZ, 'data/seguimiento-fuentes.json')
let historial = existsSync(rutaHistorial) ? JSON.parse(readFileSync(rutaHistorial, 'utf8')) : { version: 1, ejecuciones: [] }
let huellas = existsSync(rutaHuellas) ? JSON.parse(readFileSync(rutaHuellas, 'utf8')) : {}
const hoy = new Date().toISOString().slice(0, 10)
const indiceFusionar = args.indexOf('--fusionar')
if (indiceFusionar >= 0) {
  huellas = fusionarHuellas(huellas, JSON.parse(readFileSync(args[indiceFusionar + 1], 'utf8')))
  writeFileSync(rutaHuellas, JSON.stringify(huellas, null, 1), 'utf8')
  console.log('Observaciones anteriores fusionadas; se conserva la huella aceptada en main.')
}
const indiceHistorial = args.indexOf('--fusionar-historial')
if (indiceHistorial >= 0) {
  historial = fusionarHistorial(historial, JSON.parse(readFileSync(args[indiceHistorial + 1], 'utf8')))
  writeFileSync(rutaHistorial, JSON.stringify(historial, null, 1))
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
const decisiones = YAML.parse(readFileSync(join(RAIZ, 'data/revision.yaml'), 'utf8'))
const contexto = {
  ...datos, hoy,
  pendientes: YAML.parse(readFileSync(join(RAIZ, 'data/pendientes.yaml'), 'utf8')),
  borradores: existsSync(join(RAIZ, 'research/hallazgos.yaml')) ? YAML.parse(readFileSync(join(RAIZ, 'research/hallazgos.yaml'), 'utf8')) : [],
}
let revision = prepararRevision(decisiones, { ...contexto, huellas })
let comprobadas = 0
let fallo
if (indiceAceptar < 0 && !args.includes('--informe') && !args.includes('--solo-caducados')) {
  const indiceUrl = args.indexOf('--url')
  const fuentes = revision.comprobacion_automatica.fuentes.map((f) => f.url)
  if (indiceUrl >= 0 && !fuentes.includes(args[indiceUrl + 1])) throw new Error('La URL no está registrada')
  const cola = (indiceUrl < 0 ? fuentes : [args[indiceUrl + 1]]).slice(0, limite)
  const total = cola.length
  const iniciada = new Date().toISOString(), inicio = Date.now(), antes = resumenSeguimiento(revision)
  const resultados = { ok: 0, bloqueada: 0, rota: 0, error: 0 }
  console.log(`Comprobando ${total} fuentes…`)
  const trabajador = async () => {
    while (cola.length && !fallo) {
      const url = cola.shift()
      try {
        const lectura = await comprobarFuente(url)
        if (lectura.estado === 'ok') {
          lectura.comparacion = guardarComparacion(url, lectura, huellas[url], { directorio: join(RAIZ, 'build/fuentes-cache'), hoy })
          huellas[url] = registrarLectura(huellas[url], lectura, hoy).estado
          resultados.ok++
        } else {
          const clase = lectura.estado === 'bloqueada' ? 'bloqueada' : claseFallo(lectura)
          huellas[url] = { ...huellas[url], ultimo_fallo: hoy, clase,
            motivo: lectura.codigo ? `HTTP ${lectura.codigo}` : lectura.mensaje }
          resultados[clase === 'bloqueada' ? 'bloqueada' : clase === 'rota' ? 'rota' : 'error']++
        }
        comprobadas++
        if (comprobadas % 50 === 0 || comprobadas === total) {
          writeFileSync(rutaHuellas, JSON.stringify(huellas, null, 1), 'utf8')
          console.log(`${comprobadas}/${total} fuentes observadas`)
        }
      } catch (error) {
        fallo = error
      }
      if (cola.length && !fallo) await new Promise((resolve) => setTimeout(resolve, 400))
    }
  }
  await Promise.all(Array.from({ length: 4 }, trabajador))
  writeFileSync(rutaHuellas, JSON.stringify(huellas, null, 1), 'utf8')
  revision = prepararRevision(decisiones, { ...contexto, huellas })
  if (total > 0) {
    const ejecucion = {
      version: 1, id: process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? 1}` : `${iniciada}-${randomUUID().slice(0, 8)}`,
      iniciada, finalizada: new Date().toISOString(), estado: fallo ? 'fallida' : comprobadas === fuentes.length ? 'completa' : 'parcial',
      comprobadas, resultados, antes, despues: resumenSeguimiento(revision), duracion_ms: Date.now() - inicio,
    }
    historial = fusionarHistorial(historial, { version: 1, ejecuciones: [ejecucion] })
    writeFileSync(rutaHistorial, JSON.stringify(historial, null, 1))
    mkdirSync(join(RAIZ, 'build/monitorizacion'), { recursive: true })
    writeFileSync(join(RAIZ, 'build/monitorizacion/ejecucion.json'), JSON.stringify(ejecucion, null, 1))
  }
}
if (args.includes('--sellar')) console.log('--sellar conserva las fechas de revisión factual.')
writeFileSync(join(RAIZ, 'research/informe-actualizacion.md'), informeFuentes(revision, { huellas }))
if (historial.ejecuciones.length) writeFileSync(join(RAIZ, 'research/informe-evolucion-fuentes.md'), informeSeguimiento(historial))
const tecnica = revision.comprobacion_automatica
console.log(`${comprobadas} fuentes comprobadas en esta ejecución; ${tecnica.con_observacion}/${tecnica.registradas} con observación guardada.`)
console.log(`${tecnica.cambios_pendientes} cambios pendientes; ${tecnica.rotas} respuestas 404/410; ${tecnica.bloqueadas} bloqueadas; ${tecnica.errores} fallos sin resultado.`)
console.log(`→ research/informe-actualizacion.md; ${revision.revision_factual.pendientes} revisiones factuales pendientes.`)
// 10 means review is needed, 1 is an execution failure, 0 has no pending work.
if (indiceAceptar < 0 && !args.includes('--informe') && requiereRevision(revision)) process.exitCode = 10
if (fallo) throw fallo
