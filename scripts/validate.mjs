// Valida el dataset y escribe un parte de incidencias legible.
// Uso: node scripts/validate.mjs [--strict]
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { cargarTodo, RAIZ } from './load.mjs'

const estricto = process.argv.includes('--strict')
const { sitios, red, renovables, incidencias } = cargarTodo()

const errores = incidencias.filter((i) => i.nivel === 'error')
const avisos = incidencias.filter((i) => i.nivel === 'aviso')

const porFichero = new Map()
for (const i of incidencias) {
  if (!porFichero.has(i.fichero)) porFichero.set(i.fichero, [])
  porFichero.get(i.fichero).push(i)
}

const lineas = []
lineas.push('# Parte de validación del dataset', '')
lineas.push(`Generado el ${new Date().toISOString().slice(0, 10)} por \`npm run validate\`.`, '')
lineas.push(`- Emplazamientos cargados: **${sitios.length}**`)
lineas.push(`- Nodos de red: **${red.length}**`)
lineas.push(`- Activos renovables/BESS: **${renovables.length}**`)
lineas.push(`- Errores: **${errores.length}** · Avisos: **${avisos.length}**`, '')

if (incidencias.length) {
  lineas.push('## Incidencias por fichero', '')
  for (const [fichero, lista] of [...porFichero.entries()].sort()) {
    lineas.push(`### \`${fichero}\``, '')
    for (const i of lista) lineas.push(`- ${i.nivel === 'error' ? '**ERROR**' : 'aviso'}: ${i.msg}`)
    lineas.push('')
  }
} else {
  lineas.push('Sin incidencias.', '')
}

writeFileSync(join(RAIZ, 'research/informe-validacion.md'), lineas.join('\n'), 'utf8')

for (const i of errores.slice(0, 60)) console.error(`ERROR  ${i.fichero}: ${i.msg}`)
if (errores.length > 60) console.error(`… y ${errores.length - 60} errores más`)
console.log(
  `\n${sitios.length} emplazamientos · ${red.length} nodos de red · ${renovables.length} renovables` +
    `\n${errores.length} errores · ${avisos.length} avisos → research/informe-validacion.md`,
)

if (estricto && errores.length) process.exit(1)
