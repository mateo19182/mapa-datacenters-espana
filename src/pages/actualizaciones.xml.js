import actualizaciones from '../data/actualizaciones.json'
import { generarRss } from '../lib/rss.js'
// This feed contains reviewed updates only. Research candidates are separate.
export function GET() { return new Response(generarRss(actualizaciones), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }) }
