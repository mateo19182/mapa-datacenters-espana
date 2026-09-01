// Valida el dataset y escribe un parte de incidencias legible.
// Uso: node scripts/validate.mjs [--strict]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { cargarTodo, RAIZ } from './load.mjs'

const estricto = process.argv.includes('--strict')
const { sitios, red, renovables, normativa, incidencias } = cargarTodo()

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
lineas.push(`- Normas registradas: **${normativa.length}**`)
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

// Indicadores de calidad que el sitio publica: los defectos conocidos forman
// parte del producto, no son una nota interna.
const registrosPotencia = sitios.reduce((a, s) => a + s.potencia.filter((p) => p.valor_mw != null || p.valor_mva != null).length, 0)
const citaNoSostiene = incidencias.filter((i) => i.msg.includes('no aparece en la cita')).length
const sinTipificar = incidencias.filter((i) => i.msg.includes('no distingue el tipo de MW')).length

mkdirSync(join(RAIZ, 'build'), { recursive: true })
writeFileSync(
  join(RAIZ, 'build/calidad.json'),
  JSON.stringify(
    {
      generado: new Date().toISOString().slice(0, 10),
      emplazamientos: sitios.length,
      errores: errores.length,
      avisos: avisos.length,
      registros_potencia: registrosPotencia,
      cifras_sin_cita_que_las_sostenga: citaNoSostiene,
      cifras_sin_tipificar: sinTipificar,
      emplazamientos_sin_coordenadas: sitios.filter((s) => s.ubicacion.lat == null).length,
      emplazamientos_sin_potencia: sitios.filter((s) => s.potencia.length === 0).length,
      normas: normativa.length,
      // Una norma sin ningún vínculo con el registro está catalogada pero no
      // conectada: aparece en la sección y no explica nada del mapa.
      normas_sin_vinculo: normativa.filter((n) => n.afecta.length === 0).length,
    },
    null,
    1,
  ),
  'utf8',
)

for (const i of errores.slice(0, 60)) console.error(`ERROR  ${i.fichero}: ${i.msg}`)
if (errores.length > 60) console.error(`… y ${errores.length - 60} errores más`)
console.log(
  `\n${sitios.length} emplazamientos · ${red.length} nodos de red · ${renovables.length} renovables` +
    ` · ${normativa.length} normas` +
    `\n${errores.length} errores · ${avisos.length} avisos → research/informe-validacion.md`,
)

if (estricto && errores.length) process.exit(1)
