import { indiceReferencias } from '../../lib/referencias-data.js'
export function GET() { return new Response(JSON.stringify(indiceReferencias('fuentes')), { headers: { 'Content-Type': 'application/json; charset=utf-8' } }) }
