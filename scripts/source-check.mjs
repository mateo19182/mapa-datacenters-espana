import { createHash } from 'node:crypto'
import { extraerContenido } from './source-content.mjs'

export function huellaContenido(contenido, tipo = '') {
  if (!/text|html|xml|json/i.test(tipo)) {
    return { hash: `bin-sha256:${createHash('sha256').update(contenido).digest('hex').slice(0, 16)}`, longitud: contenido.length }
  }
  const texto = contenido.toString('utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
  return { hash: createHash('sha256').update(texto).digest('hex').slice(0, 16), longitud: texto.length }
}

export async function comprobarFuente(url, { fetchImpl = fetch, tiempoLimiteMs = 25000 } = {}) {
  const control = new AbortController()
  const temporizador = setTimeout(() => control.abort(), tiempoLimiteMs)
  try {
    const respuesta = await fetchImpl(url, {
      redirect: 'follow', signal: control.signal,
      headers: {
        'User-Agent': 'mapa-datacenters-espana/0.1 (revision periodica de fuentes; contacto en el repositorio)',
        Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.8,*/*;q=0.5',
      },
    })
    if (!respuesta.ok) return { estado: 'http', codigo: respuesta.status }
    const tipo = respuesta.headers.get('content-type') ?? ''
    const contenido = Buffer.from(await respuesta.arrayBuffer())
    if (/html/i.test(tipo)) {
      const titulo = /<title[^>]*>([^<]*)<\/title>/i.exec(contenido.toString('utf8'))?.[1]?.trim() ?? ''
      if (/^(just a moment[.!…\s]*|access denied[.!\s]*|attention required!?(?:\s*\|\s*cloudflare)?)$/i.test(titulo)) {
        return { estado: 'bloqueada', mensaje: 'Página de verificación automática; HTTP 200' }
      }
    }
    return { estado: 'ok', ...huellaContenido(contenido, tipo), tipo, contenido: extraerContenido(contenido, tipo) }
  } catch (error) {
    return { estado: 'error', mensaje: error.name === 'AbortError' ? 'tiempo agotado' : error.message }
  } finally {
    clearTimeout(temporizador)
  }
}
