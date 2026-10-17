// Prueba el sitio construido, sin depender de servicios cartográficos externos.
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises'
import { resolve, extname, join, sep } from 'node:path'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const raiz = resolve('dist')
await stat(join(raiz, 'index.html')).catch(() => { throw new Error('Construye el sitio con npm run build antes de ejecutar test:ui.') })
const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }
const servidor = createServer(async (req, res) => {
  try {
    let ruta = resolve(raiz, `.${decodeURIComponent(new URL(req.url, 'http://localhost').pathname)}`)
    if (ruta !== raiz && !ruta.startsWith(raiz + sep)) { res.writeHead(403).end(); return }
    const archivo = await stat(ruta).catch(() => null)
    if (archivo?.isDirectory()) ruta = join(ruta, 'index.html')
    const contenido = await readFile(ruta)
    res.writeHead(200, { 'Content-Type': tipos[extname(ruta)] ?? 'application/octet-stream' }).end(contenido)
  } catch { res.writeHead(404).end('No encontrado') }
})
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok))
const origen = `http://127.0.0.1:${servidor.address().port}`
const artefactos = resolve('build/ui')
await mkdir(artefactos, { recursive: true })
let navegador
const resultados = []
try {
  navegador = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  })
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' })
  const pagina = await contexto.newPage()
  const errores = []
  pagina.on('pageerror', (error) => errores.push(error.message))
  const ir = async (ruta) => {
    const respuesta = await pagina.goto(origen + ruta, { waitUntil: 'networkidle' })
    if (respuesta) assert.equal(respuesta.status(), 200, ruta)
    else await pagina.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))))
  }
  const comprobar = async (nombre, prueba) => {
    await prueba()
    resultados.push(nombre)
    console.log(`✓ ${nombre}`)
  }
  await comprobar('Fuentes: paginación, búsqueda, vacío y restablecer', async () => {
    await ir('/fuentes/')
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), 25)
    await pagina.locator('[data-siguiente]').click()
    await pagina.waitForURL(/\/fuentes\/pagina\/2\/?$/)
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), 25)
    await pagina.locator('input[name=q]').fill('fuente-inexistente-zzzz')
    await pagina.locator('[data-vacio]').waitFor({ state: 'visible' })
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), 0)
    assert.equal(await pagina.locator('[data-vacio]').isVisible(), true)
    await pagina.getByRole('button', { name: 'Limpiar', exact: true }).click()
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), 25)
  })
  await comprobar('Referencias: un enlace revela su página y su cita', async () => {
    const indice = await (await fetch(origen + '/datos/indice-fuentes.json')).json()
    const id = indice.items.at(-1).id
    await ir(`/fuentes/#${id}`)
    await pagina.locator(`#${id}`).waitFor({ state: 'visible' })
    assert.equal(await pagina.locator(`#${id}`).isVisible(), true)
    assert.equal(await pagina.locator(`#${id} details`).first().evaluate((e) => e.open), true)
    await pagina.reload({ waitUntil: 'networkidle' })
    assert.equal(await pagina.locator(`#${id}`).isVisible(), true)
  })
  await comprobar('Referencias: la primera carga mantiene un tamaño y un DOM acotados', async () => {
    for (const ruta of ['/fuentes/', '/incertidumbres/']) {
      assert((await stat(join(raiz, ruta, 'index.html'))).size < 200_000, ruta)
      await ir(ruta)
      assert(await pagina.locator('*').count() < 1_500, ruta)
    }
  })
  await comprobar('Capacidad: el estado de la cifra separa el edificio operativo del campus futuro', async () => {
    await ir('/proyectos/?q=iron+mountain')
    const fila = pagina.locator('[data-list-item]:visible').first()
    assert.equal(await pagina.locator('select[name=etapa]').inputValue(), 'operativa')
    assert.equal(await fila.getAttribute('data-it'), '3')
    await pagina.locator('select[name=etapa]').selectOption('construccion')
    assert.equal(await fila.getAttribute('data-it'), '20')
    assert.equal(new URL(pagina.url()).searchParams.get('etapa'), 'construccion')
    await pagina.reload({ waitUntil: 'networkidle' })
    assert.equal(await pagina.locator('[data-list-item]:visible').first().getAttribute('data-it'), '20')
    await pagina.locator('select[name=etapa]').selectOption('prevista')
    assert.equal(await pagina.locator('[data-list-item]:visible').first().getAttribute('data-it'), '79')
  })
  await comprobar('Getafe 2: los MW futuros quedan fuera de la vista operativa', async () => {
    await ir('/proyectos/?q=getafe+2')
    const fila = pagina.locator('[data-list-item]:visible').filter({ has: pagina.locator('a[href="/proyecto/merlin-edged-getafe-2"]') })
    assert.equal(await fila.count(), 1)
    assert.equal(await fila.getAttribute('data-estado'), 'en_tramitacion')
    assert.equal(await fila.getAttribute('data-it'), '')
    await pagina.locator('select[name=etapa]').selectOption('prevista')
    assert.equal(await fila.getAttribute('data-it'), '48')
    assert.equal(await fila.getAttribute('data-conexion'), '70')
  })
  await comprobar('DATA4: la exportación conserva las líneas de respaldo fuera de la capacidad principal', async () => {
    const sitios = await (await fetch(origen + '/datos/sitios.json')).json()
    const data4 = sitios.find((s) => s.id === 'data4-alcobendas-mad01')
    assert.equal(data4.potencia_por_etapa.operativa.conexion_red.valor_mw, 20)
    assert.equal(data4.conexion_electrica.mw_concedidos, null)
    assert(data4.conexion_electrica.nota.includes('10 MW'))
    assert(data4.conexion_electrica.nota.includes('respaldo'))
    await ir('/proyecto/data4-alcobendas-mad01/#conexion-electrica')
    assert.equal(await pagina.locator('#conexion-electrica').evaluate((e) => e.open), true)
    const texto = await pagina.locator('#conexion-electrica').innerText()
    assert(texto.includes('Alcobendas') && texto.includes('Arroyo de la Vega'))
  })
  await comprobar('Fuentes: un fallo de comprobación se distingue de un recurso no encontrado', async () => {
    const fuentes = await (await fetch(origen + '/datos/fuentes.json')).json()
    const total = fuentes.filter((f) => f.enlace?.clase === 'error').length
    await ir('/fuentes/?enlace=error')
    assert.equal(await pagina.locator('select[name=enlace]').inputValue(), 'error')
    const filas = pagina.locator('[data-list-item]:visible')
    assert.equal(await filas.count(), Math.min(25, total))
    assert((await filas.evaluateAll((items) => items.map((e) => e.dataset.enlace))).every((clase) => clase === 'error'))
    if (total) assert((await filas.first().innerText()).includes('Comprobación sin resultado'))
  })
  await comprobar('Cómputo: acceso a H200 no se muestra como instalación física', async () => {
    await ir('/computo/?q=cidade')
    await pagina.locator('select[name=modalidad]').selectOption('acceso')
    assert(await pagina.locator('[data-list-item]:visible').count() > 0)
    const filas = await pagina.locator('[data-list-item]:visible').innerText()
    assert(filas.includes('H200'))
    await pagina.locator('select[name=modalidad]').selectOption('instalado')
    assert(!(await pagina.locator('[data-list-item]:visible td:first-child strong').allTextContents()).join(' ').includes('H200'))
  })
  await comprobar('Cómputo: configuraciones repetidas y recuentos disputados conservan sus matices visibles', async () => {
    await ir('/computo/?q=aimen')
    const filas = pagina.locator('[data-list-item]:visible')
    assert.equal(await filas.count(), 4)
    const alcances = await filas.locator('.alcance').allTextContents()
    assert(alcances.some((t) => t.includes('primera mención')))
    assert(alcances.some((t) => t.includes('segunda mención')))
    assert(alcances.some((t) => t.includes('8 núcleos')))
    assert((await filas.locator('.matiz:visible').allTextContents()).join(' ').includes('dos menciones idénticas'))
    await ir('/computo/?q=tecnalia')
    const total = pagina.locator('[data-list-item]:visible').filter({ hasText: '13 aceleradores' })
    assert.equal(await total.count(), 1)
    assert((await total.innerText()).includes('Total y desglose en disputa'))
  })
  await comprobar('CESGA: dos sedes, inventarios únicos y compra sin instalación confirmada', async () => {
    await ir('/computo/?q=cesga')
    const anteriores = pagina.locator('[data-list-item]:visible').filter({ has: pagina.locator('a[href="/proyecto/cesga-santiago-campus-sur#detalle-computo"]') })
    const nuevos = pagina.locator('[data-list-item]:visible').filter({ has: pagina.locator('a[href="/proyecto/cesga-santiago-a-sionlla#detalle-computo"]') })
    assert.equal(await anteriores.count(), 4)
    assert.equal(await nuevos.count(), 4)
    assert((await anteriores.locator('.matiz').allTextContents()).every((t) => /sin confirmar/.test(t)))
    const ft4 = nuevos.filter({ hasText: 'FinisTerrae IV' })
    assert.equal(await ft4.getAttribute('data-modalidad'), 'adquirido')
    assert((await ft4.innerText()).includes('instalación sin confirmar'))
    assert(!(await nuevos.locator('td:first-child strong').allTextContents()).join(' ').includes('NVIDIA A100'))
  })
  await comprobar('Mapa y tabla conservan estados, región y potencia conocida', async () => {
    await ir('/proyectos/?e=operativo,parcialmente_operativo&r=Comunidad+de+Madrid&con=1&min=5')
    const filas = await pagina.locator('[data-list-item]:visible').evaluateAll((rows) => rows.map((e) => ({ estado: e.dataset.estado, region: e.dataset.region, it: e.dataset.it })))
    assert(filas.length > 0)
    for (const fila of filas) {
      assert(['operativo', 'parcialmente_operativo'].includes(fila.estado))
      assert.equal(fila.region, 'Comunidad de Madrid')
      assert(fila.it !== '' && Number(fila.it) >= 5)
    }
  })
  await comprobar('REE: cero y dato no publicado son filtros diferentes', async () => {
    await ir('/red-electrica/')
    await pagina.locator('select[name=ccaa]').selectOption('Comunidad de Madrid')
    await pagina.locator('select[name=margen]').selectOption('con_margen')
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), 0)
    await pagina.locator('select[name=margen]').selectOption('no_publicado')
    assert(await pagina.locator('[data-list-item]:visible').count() > 0)
    assert((await pagina.locator('[data-list-item]:visible').first().innerText()).includes('No publicado'))
  })
  await comprobar('Proyecto: hardware con sus matices y fuentes accesibles', async () => {
    await ir('/proyecto/cluster-tic-galicia-a-coruna-csa/')
    const texto = await pagina.locator('main').innerText()
    assert(texto.includes('15 GPU'))
    assert(texto.includes('NVIDIA A40'))
    assert(texto.includes('Instalación física sin confirmar'))
    assert.equal(await pagina.locator('#fuentes').evaluate((e) => e.open), false)
    await ir('/proyecto/cluster-tic-galicia-a-coruna-csa/#fuente-src-catalogo')
    assert.equal(await pagina.locator('#fuentes').evaluate((e) => e.open), true)
    assert.equal(await pagina.locator('#fuente-src-catalogo').isVisible(), true)
  })
  await comprobar('Cronología: los hitos administrativos no son aperturas', async () => {
    await ir('/proyecto/meta-talavera-de-la-reina-torrehierro/')
    const cronologia = await pagina.locator('.cronologia-proyecto').innerText()
    assert(cronologia.includes('Publicación'))
    assert(!cronologia.includes('Puesta en servicio · Declaración'))
  })
  await comprobar('Inversión: fecha de corte y tesis completa bajo demanda', async () => {
    await ir('/inversion/merlin-properties/')
    assert.equal(await pagina.locator('#informe-completo').evaluate((e) => e.open), false)
    assert((await pagina.locator('main').innerText()).includes('31 de agosto de 2026'))
    await ir('/inversion/merlin-properties/#valoracion')
    assert.equal(await pagina.locator('#informe-completo').evaluate((e) => e.open), true)
    assert.equal(await pagina.locator('#valoracion').isVisible(), true)
  })
  await comprobar('Últimos cambios: destinos válidos y dos fechas diferenciadas', async () => {
    await ir('/actualizaciones/')
    const feed = await (await fetch(origen + '/datos/actualizaciones.json')).json()
    assert(feed.length > 0)
    assert.equal(await pagina.locator('.historial-cambios > li').count(), feed.length)
    for (const entrada of feed) {
      assert(entrada.fecha)
      if (entrada.fecha_hecho) assert(entrada.fecha_hecho <= entrada.fecha)
      for (const enlace of entrada.enlaces) assert.equal((await fetch(origen + enlace.href)).status, 200)
    }
  })
  await comprobar('Revisión y RSS: las candidatas abiertas quedan fuera de las novedades publicadas', async () => {
    const revision = await (await fetch(origen + '/datos/revision.json')).json()
    const novedades = await (await fetch(origen + '/datos/actualizaciones.json')).json()
    const xml = await (await fetch(origen + '/actualizaciones.xml')).text()
    const rss = await pagina.evaluate((texto) => {
      const doc = new DOMParser().parseFromString(texto, 'application/xml')
      return { errores: doc.querySelectorAll('parsererror').length, ids: [...doc.querySelectorAll('item guid')].map((e) => e.textContent) }
    }, xml)
    assert.equal(rss.errores, 0)
    assert.equal(rss.ids.length, novedades.length)
    for (const entrada of novedades) assert(rss.ids.some((id) => id.endsWith(`#${entrada.id}`)), entrada.id)
    for (const entrada of revision.hallazgos.filter((h) => !['published', 'discarded'].includes(h.estado))) {
      assert(!novedades.some((n) => n.id === entrada.id), entrada.id)
    }
    await ir('/revision/?estado=awaiting_primary')
    const pendientesPrimaria = revision.hallazgos.filter((h) => h.estado === 'awaiting_primary').length
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), Math.min(25, pendientesPrimaria))
    await pagina.locator('[data-tamano]').selectOption('0')
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), pendientesPrimaria)
  })
  await comprobar('Revisión: pendientes por defecto, pistas sin duplicar e historial enlazable', async () => {
    const revision = await (await fetch(origen + '/datos/revision.json')).json()
    await ir('/revision/')
    assert.equal(await pagina.locator('select[name=estado]').inputValue(), 'detected,awaiting_primary,proposed')
    const iniciales = await pagina.locator('[data-list-item]:visible').evaluateAll((items) => items.map((e) => e.dataset.estado))
    assert(iniciales.length > 0 && iniciales.every((e) => !['published', 'discarded'].includes(e)))
    await pagina.locator('input[name=q]').fill('Quetta')
    const pista = pagina.locator('#pista-quetta-ubicaciones')
    assert.equal(await pista.isVisible(), true)
    assert((await pista.innerText()).includes('Pista anterior'))
    await pagina.getByRole('button', { name: 'Limpiar', exact: true }).click()
    await pagina.locator('select[name=estado]').selectOption('published,discarded')
    const cerrados = await pagina.locator('[data-list-item]:visible').evaluateAll((items) => items.map((e) => e.dataset.estado))
    assert(cerrados.length > 0 && cerrados.every((e) => ['published', 'discarded'].includes(e)))
    await pagina.locator('select[name=estado]').selectOption('')
    await pagina.reload({ waitUntil: 'networkidle' })
    assert.equal(await pagina.locator('select[name=estado]').inputValue(), '')
    await pagina.getByRole('button', { name: 'Limpiar', exact: true }).click()
    assert.equal(await pagina.locator('select[name=estado]').inputValue(), 'detected,awaiting_primary,proposed')
    const publicada = revision.hallazgos.find((h) => h.estado === 'published')
    await ir(`/revision/#${publicada.id}`)
    assert.equal(await pagina.locator(`#${publicada.id}`).isVisible(), true)
    assert.equal(await pagina.locator(`#${publicada.id} details`).first().evaluate((e) => e.open), true)
  })
  await comprobar('Navegación: Escape devuelve el foco al menú abierto', async () => {
    await pagina.locator('.nav-grupo > summary').filter({ hasText: 'Explorar' }).click()
    await pagina.locator('#menu a[href="/companias"]').focus()
    await pagina.keyboard.press('Escape')
    assert.equal(await pagina.evaluate(() => document.activeElement.tagName), 'SUMMARY')
  })
  await comprobar('Glosario: alias, resultados visibles y enlace directo al término', async () => {
    await ir('/glosario/')
    await pagina.locator('#busca-termino').fill('coubicación')
    assert.equal(await pagina.locator('.termino:visible').count(), 1)
    assert((await pagina.locator('.termino:visible').innerText()).includes('Colocation'))
    await ir('/glosario/?q=coubicacion#mw-it')
    assert.equal(await pagina.locator('#mw-it').isVisible(), true)
  })
  await comprobar('Móvil: datos principales visibles y sin desbordamiento', async () => {
    await pagina.setViewportSize({ width: 390, height: 844 })
    for (const ruta of ['/proyectos/', '/computo/', '/revision/', '/red-electrica/', '/normativa/', '/proyecto/cluster-tic-galicia-a-coruna-csa/', '/inversion/merlin-properties/', '/datos/']) {
      await ir(ruta)
      assert.equal(await pagina.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, ruta)
    }
    await pagina.screenshot({ path: join(artefactos, 'inversion-movil.png') })
  })
  await comprobar('Mapa: el worker publicado carga y WebGL2 dibuja sin depender del mapa base externo', async () => {
    const contextoMapa = await navegador.newContext({ viewport: { width: 1440, height: 900 } })
    const prueba = await contextoMapa.newPage()
    const fallos = []
    prueba.on('pageerror', (e) => fallos.push(e.message))
    await prueba.addInitScript(() => {
      window.__dibujosMapa = 0
      for (const nombre of ['drawArrays', 'drawElements']) {
        const original = WebGL2RenderingContext.prototype[nombre]
        WebGL2RenderingContext.prototype[nombre] = function (...args) {
          window.__dibujosMapa++
          return original.apply(this, args)
        }
      }
    })
    await prueba.route('https://basemaps.cartocdn.com/**', (ruta) => ruta.fulfill({
      contentType: 'application/json', body: JSON.stringify({ version: 8, glyphs: `${origen}/glifos-prueba/{fontstack}/{range}.pbf`, sources: {}, layers: [{ id: 'fondo-prueba', type: 'background', paint: { 'background-color': '#faf8f3' } }] }),
    }))
    const worker = prueba.waitForResponse((r) => /maplibre-gl-worker.*\.mjs/.test(r.url()))
    await prueba.goto(origen + '/', { waitUntil: 'networkidle' })
    const respuesta = await worker
    assert.equal(respuesta.status(), 200)
    assert.match(respuesta.headers()['content-type'], /javascript/)
    await prueba.waitForFunction(() => window.__dibujosMapa > 1)
    assert.equal(await prueba.locator('#mapa canvas').count(), 1)
    assert.equal(await prueba.locator('.aviso-mapa').count(), 0)
    assert.deepEqual(fallos, [])
    await prueba.screenshot({ path: join(artefactos, 'mapa-webgl2-worker.png') })
    await contextoMapa.close()
  })
  await comprobar('Mapa sin WebGL: búsqueda, lista, foco y enlaces compartidos siguen disponibles', async () => {
    await pagina.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (tipo, ...args) { return String(tipo).includes('webgl') ? null : original.call(this, tipo, ...args) }
    })
    await ir('/?min=500')
    await pagina.locator('#alternar-panel').click()
    await pagina.locator('#filtros-avanzados > summary').click()
    assert.equal(await pagina.locator('#filtro-minimo').inputValue(), '500')
    await pagina.locator('#limpiar-filtros').click()
    await pagina.locator('#filtro-texto').fill('coruna cidade')
    await pagina.waitForTimeout(250)
    assert.equal(await pagina.locator('.fila-sitio').count(), 1)
    await pagina.locator('.fila-sitio').click()
    assert.equal(await pagina.locator('#panel-detalle').isVisible(), true)
    assert.equal(await pagina.locator('#panel-detalle .cerrar').evaluate((e) => e === document.activeElement), true)
    await pagina.keyboard.press('Escape')
    assert.equal(await pagina.locator('#alternar-panel').evaluate((e) => e === document.activeElement), true)
    await pagina.screenshot({ path: join(artefactos, 'mapa-respaldo-movil.png') })
  })
  await comprobar('Mapa móvil: obras incluye ampliaciones y la tabla conserva los filtros', async () => {
    await ir('/?q=ctag&r=Galicia&etapa=prevista')
    await pagina.locator('#alternar-panel').click()
    const tabla = pagina.locator('.tabla-movil')
    assert.equal(await tabla.isVisible(), true)
    await tabla.click()
    await pagina.waitForURL((url) => url.pathname.replace(/\/$/, '') === '/proyectos')
    await pagina.locator('[data-herramientas]').waitFor({ state: 'visible' })
    const parametros = new URL(pagina.url()).searchParams
    assert.equal(parametros.get('q'), 'ctag')
    assert.equal(parametros.get('r'), 'Galicia')
    assert.equal(parametros.get('etapa'), 'prevista')
    assert.equal(await pagina.locator('[data-list-item]:visible').count(), 1)
    assert((await pagina.locator('[data-list-item]:visible').innerText()).includes('CTAG · HAARO'))
    await ir('/')
    await pagina.locator('[data-grupo-estado=construccion]').click()
    await pagina.locator('#alternar-panel').click()
    const ids = await pagina.locator('.fila-sitio').evaluateAll((filas) => filas.map((e) => e.dataset.id))
    const sitios = await (await fetch(origen + '/datos/sitios.json')).json()
    const ampliaciones = sitios.filter((s) => s.estado === 'ampliacion_en_construccion')
    assert(ampliaciones.length > 0)
    assert(ampliaciones.every((s) => ids.includes(s.id)))
  })
  assert.deepEqual(errores, [])
  await contexto.close()
  const sinJS = await navegador.newContext({ javaScriptEnabled: false })
  const paginaSinJS = await sinJS.newPage()
  await paginaSinJS.goto(origen + '/fuentes/')
  assert.equal(await paginaSinJS.locator('[data-list-item]:visible').count(), 25)
  const primera = await paginaSinJS.locator('[data-list-item]').first().getAttribute('id')
  await paginaSinJS.locator('a[rel=next]').click()
  assert.equal(await paginaSinJS.locator('[data-list-item]:visible').count(), 25)
  assert.notEqual(await paginaSinJS.locator('[data-list-item]').first().getAttribute('id'), primera)
  resultados.push('Sin JavaScript: las páginas estáticas permiten recorrer las fuentes')
  await sinJS.close()
  await writeFile(join(artefactos, 'resultados.json'), JSON.stringify({ comprobaciones: resultados, errores }, null, 2) + '\n')
  console.log(`${resultados.length} comprobaciones de interfaz superadas.`)
} finally {
  await navegador?.close()
  servidor.closeAllConnections()
  await new Promise((ok) => servidor.close(ok))
}
