// Shared by static pages and browser search. Source text is always escaped.
import { fechaLegible } from './etiquetas.js'
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const fecha = (value) => fechaLegible(value) ?? 'Sin fecha'
const enlace = (url, text, externo = false) => `<a href="${escape(url)}"${externo ? ' target="_blank" rel="noopener nofollow"' : ''}>${escape(text)}</a>`
const attrs = (item) => `id="${escape(item.id)}" data-list-item ${Object.entries(item.dataset).map(([key, value]) => `data-${key}="${escape(value)}"`).join(' ')}`
export function renderFuente(item) {
  const f = { titulo: item.dataset.titulo, consulta: item.dataset.consulta, publicacion: item.dataset.publicacion, ...item.contenido }
  const usos = f.usos.map((u) => enlace(`/proyecto/${u.id}`, u.nombre))
  return `<tr ${attrs(item)}><td>${enlace(f.url, f.titulo, true)}<span class="editor pequeno silencio">${escape([f.editor, f.dominio].filter(Boolean).join(' · '))}</span>
  <details class="respaldo"><summary>Consulta y cita</summary><p>Consultada: ${fecha(f.consulta)} · ${enlace(`#${item.id}`, 'Enlace a esta referencia')}</p>${f.cita ? `<blockquote>${escape(f.cita)}</blockquote>` : ''}</details></td>
  <td class="pequeno" data-etiqueta="Tipo y acceso">${escape(f.tipo)}${f.acceso ? `<span class="acceso${item.dataset.enlace === 'rota' ? ' rota' : ''}">${escape(f.acceso)}</span>` : ''}</td>
  <td class="pequeno" data-etiqueta="Publicado">${fecha(f.publicacion)}</td><td class="pequeno" data-etiqueta="Documenta">${usos.length > 3 ? `<details><summary>${usos.length} emplazamientos</summary><ul>${usos.map((u) => `<li>${u}</li>`).join('')}</ul></details>` : usos.join(' · ')}</td></tr>`
}
export function renderIncertidumbre(item) {
  const e = { nombre: item.dataset.nombre, etiqueta: item.dataset.etiqueta, ...item.contenido }
  return `<li ${attrs(item)}><details><summary><span>${escape(e.nombre)}</span><span class="campo">${escape(e.etiqueta)}</span></summary><p class="descripcion">${escape(e.descripcion)}</p><p class="pequeno">${enlace(`/proyecto/${e.sitio}#incertidumbres`, 'Ver proyecto')} · ${enlace(`#${item.id}`, 'Enlace a esta entrada')} · ${escape(e.estado)}</p>${e.fuentes.length ? `<p class="pequeno silencio">Fuentes: ${e.fuentes.map((f) => enlace(f.url, f.nombre, true)).join(' · ')}</p>` : ''}</details></li>`
}
export const renderReferencia = (tipo, item) => tipo === 'fuentes' ? renderFuente(item) : renderIncertidumbre(item)
export function ordenarReferencias(items, campo = 'nombre', direccion = 'asc', numerico = false) {
  return [...items].sort((a, b) => {
    const va = a.dataset[campo] ?? '', vb = b.dataset[campo] ?? ''
    if (va === '' || vb === '') return va === vb ? 0 : va === '' ? 1 : -1
    return (direccion === 'desc' ? -1 : 1) * (numerico ? Number(va) - Number(vb) : va.localeCompare(vb, 'es', { numeric: true, sensitivity: 'base' }))
  })
}

export function textoReferencia(tipo, item) {
  const d = item.dataset, c = item.contenido
  return tipo === 'fuentes' ? `${d.titulo} ${c.editor ?? ''} ${c.dominio} ${c.usos.map((u) => u.nombre).join(' ')}` : `${d.nombre} ${d.operador ?? ''} ${d.region ?? ''} ${d.etiqueta} ${c.descripcion}`
}
