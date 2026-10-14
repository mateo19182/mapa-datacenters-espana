import { z } from 'zod'

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => {
  const date = new Date(`${s}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === s
}, 'fecha inválida')
const referencia = z.union([
  z.strictObject({ proyecto: z.string(), fuente: z.string() }),
  z.strictObject({ norma: z.string(), fuente: z.string() }),
  z.strictObject({ url: z.url().startsWith('https://'), titulo: z.string().min(1) }),
])
const esquema = z.array(z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  fecha,
  fecha_hecho: fecha.optional(),
  tipo: z.enum(['nuevo', 'proyecto', 'permisos', 'normativa', 'red']),
  titulo: z.string().min(1).max(120),
  resumen: z.string().min(1).max(650),
  enlaces: z.array(z.strictObject({ texto: z.string().min(1), href: z.string().regex(/^\/(?!\/)[^?#\s]*$/) })).min(1),
  fuentes: z.array(referencia).min(1),
}))

// Las referencias apuntan a las fuentes mantenidas de cada ficha, sin copiar URL.
export function prepararActualizaciones(datos, { sitios, normativa, hoy = new Date().toISOString().slice(0, 10) }) {
  const entradas = esquema.parse(datos)
  const ids = new Set()
  const rutas = new Set(['/red-electrica', ...sitios.map((s) => `/proyecto/${s.id}`), ...normativa.map((n) => `/normativa/${n.id}`)])
  return entradas.map((entrada) => {
    if (ids.has(entrada.id)) throw new Error(`Actualización duplicada: ${entrada.id}`)
    ids.add(entrada.id)
    if (entrada.fecha > hoy) throw new Error(`Actualización aún no publicada: ${entrada.id}`)
    if (entrada.fecha_hecho && entrada.fecha_hecho > entrada.fecha) throw new Error(`El hito es posterior a la incorporación: ${entrada.id}`)
    for (const enlace of entrada.enlaces) if (!rutas.has(enlace.href)) throw new Error(`Destino desconocido: ${enlace.href}`)
    const fuentes = entrada.fuentes.map((ref) => {
      if ('url' in ref) return ref
      const entidad = ref.proyecto ? sitios.find((s) => s.id === ref.proyecto) : normativa.find((n) => n.id === ref.norma)
      const fuente = entidad?.fuentes.find((f) => f.id === ref.fuente)
      if (!fuente) throw new Error(`Fuente inexistente en ${entrada.id}: ${ref.fuente}`)
      return { titulo: fuente.titulo, url: fuente.url }
    })
    return { ...entrada, fuentes }
  }).sort((a, b) => b.fecha.localeCompare(a.fecha))
}
