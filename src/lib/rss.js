export const escaparXml = (valor) => String(valor ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c])
export function generarRss(entradas, origen = 'https://datacenters.m19182.dev') {
  const xml = escaparXml
  const fecha = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Centros de datos en España · Últimos cambios</title><link>${xml(origen)}/actualizaciones</link>
<description>Novedades verificadas e incorporadas al registro de centros de datos.</description><language>es</language>
<atom:link href="${xml(origen)}/actualizaciones.xml" rel="self" type="application/rss+xml"/>
${entradas.length ? `<lastBuildDate>${fecha(entradas.map((e) => e.fecha).sort().at(-1))}</lastBuildDate>` : ''}
${entradas.map((e) => { const url = `${origen}/actualizaciones#${encodeURIComponent(e.id)}`; return `<item><title>${xml(e.titulo)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><pubDate>${fecha(e.fecha)}</pubDate><description>${xml(e.resumen)}${e.fecha_hecho ? xml(` Hecho documentado del ${e.fecha_hecho}.`) : ''}</description></item>` }).join('\n')}
</channel></rss>\n`
}
