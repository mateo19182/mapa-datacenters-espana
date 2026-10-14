import { normalizarBusqueda } from '../lib/busqueda.js'
import { ordenarReferencias, renderReferencia, textoReferencia } from '../lib/referencias-render.js'

// Only one static page is in the document. The complete index is loaded when
// the reader searches, changes order, follows a remote hash or prints results.
export function iniciarReferencias(lista) {
  const meta = JSON.parse(lista.dataset.remoto)
  const form = lista.querySelector('[data-herramientas]')
  const contenido = lista.querySelector('[data-contenido-referencias]')
  const entrada = form.querySelector('[name=q]')
  const filtros = [...form.querySelectorAll('[data-filtro]')]
  const orden = form.querySelector('[data-orden]')
  const contador = lista.querySelector('[data-contador]')
  const vacio = lista.querySelector('[data-vacio]')
  const error = lista.querySelector('[data-error-carga]')
  const paginacion = lista.querySelector('[data-paginacion]')
  const anterior = lista.querySelector('[data-anterior]')
  const siguiente = lista.querySelector('[data-siguiente]')
  const tamanos = lista.querySelector('[data-tamano]')
  const abiertos = new Map()
  let items = null, peticion = null, pagina = meta.pagina, tamano = Number(lista.dataset.porPagina), visibles = null, imprimiendo = false
  const urlPagina = (n) => n === 1 ? meta.base : `${meta.base}/pagina/${n}`
  const aceptar = (datos) => {
    if (datos.version !== meta.version || datos.tipo !== meta.tipo || !Array.isArray(datos.items)) throw new Error('Índice incompatible con esta edición')
    items = datos.items.map((item) => ({ ...item, dataset: { ...item.dataset, busca: textoReferencia(meta.tipo, item) } }))
    return items
  }
  const cargar = async () => {
    if (items) return items
    if (!peticion) peticion = fetch(meta.url).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() }).then(aceptar).catch((e) => { peticion = null; throw e })
    return peticion
  }
  const leerURL = () => {
    const params = new URL(location.href).searchParams
    entrada.value = params.get('q') ?? ''
    for (const filtro of filtros) filtro.value = params.get(filtro.name) ?? ''
    orden.value = params.get('orden') ?? orden.options[0].value
    if (orden.selectedIndex < 0) orden.selectedIndex = 0
    const numeroRuta = Number(location.pathname.match(/\/pagina\/(\d+)\/?$/)?.[1]) || 1
    pagina = Math.max(1, Math.floor(Number(params.get('pagina')) || numeroRuta))
    const valor = params.get('por-pagina') ?? lista.dataset.porPagina
    tamanos.value = [...tamanos.options].some((o) => o.value === valor) ? valor : lista.dataset.porPagina
    tamano = Number(tamanos.value)
  }
  const guardarURL = (push = false, hash = false) => {
    const url = new URL(location.href)
    url.pathname = meta.base
    const guardar = (k, v) => v ? url.searchParams.set(k, v) : url.searchParams.delete(k)
    guardar('q', entrada.value.trim())
    for (const f of filtros) guardar(f.name, f.value)
    guardar('orden', orden.value !== orden.options[0].value ? orden.value : '')
    guardar('pagina', pagina > 1 ? String(pagina) : '')
    guardar('por-pagina', tamano !== Number(lista.dataset.porPagina) ? String(tamano) : '')
    if (!hash) url.hash = ''
    if (url.href !== location.href) history[push ? 'pushState' : 'replaceState'](null, '', url)
  }
  const encaja = (item) => {
    const palabras = normalizarBusqueda(entrada.value.trim()).split(/\s+/).filter(Boolean)
    return palabras.every((p) => normalizarBusqueda(item.dataset.busca).includes(p)) && filtros.every((f) => !f.value || item.dataset[f.name] === f.value)
  }
  const recordar = () => {
    if (imprimiendo) return
    for (const item of contenido.querySelectorAll('[data-list-item]')) abiertos.set(item.id, [...item.querySelectorAll('details')].map((d) => d.open))
  }
  contenido.addEventListener('toggle', recordar, true)
  const render = (todos = false) => {
    recordar()
    const opcion = orden.selectedOptions[0]
    visibles = ordenarReferencias(items.filter(encaja), opcion.dataset.campo, opcion.dataset.direccion, opcion.dataset.numerico === 'si')
    const paginas = tamano ? Math.max(1, Math.ceil(visibles.length / tamano)) : 1
    pagina = Math.min(pagina, paginas)
    const inicio = tamano ? (pagina - 1) * tamano : 0
    const fin = tamano ? Math.min(inicio + tamano, visibles.length) : visibles.length
    contenido.innerHTML = (todos ? visibles : visibles.slice(inicio, fin)).map((item) => renderReferencia(meta.tipo, item)).join('')
    for (const item of contenido.querySelectorAll('[data-list-item]')) [...item.querySelectorAll('details')].forEach((d, i) => { d.open = todos || (abiertos.get(item.id)?.[i] ?? false) })
    vacio.hidden = visibles.length > 0
    const tabla = lista.querySelector('table')
    if (tabla) tabla.hidden = !visibles.length
    contador.textContent = visibles.length ? `${todos ? 1 : inicio + 1}–${todos ? visibles.length : fin} de ${visibles.length} ${meta.tipo}${visibles.length !== meta.total ? ` · ${meta.total} en total` : ''}` : `0 de ${meta.total} ${meta.tipo}`
    anterior.disabled = pagina === 1
    siguiente.disabled = pagina === paginas
    paginacion.hidden = todos || visibles.length === 0
    lista.querySelector('[data-pagina]').textContent = `Página ${pagina} de ${paginas}`
  }
  const actualizar = async ({ push = false, guardar = true } = {}) => {
    form.setAttribute('aria-busy', 'true')
    error.hidden = true
    contador.textContent = 'Cargando resultados…'
    try { await cargar(); render(); if (guardar) guardarURL(push) }
    catch { error.hidden = false; contador.textContent = 'La búsqueda no está disponible. Se conserva la página que estabas leyendo.' }
    finally { form.removeAttribute('aria-busy') }
  }
  const revelar = async () => {
    let id
    try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
    if (!id) return
    const presente = document.getElementById(id)
    if (presente && !presente.closest('[data-list-item]')) return
    try {
      await cargar()
      const item = items.find((item) => item.id === id)
      if (!item) return
      if (!encaja(item)) { entrada.value = ''; filtros.forEach((f) => { f.value = '' }) }
      render()
      pagina = tamano ? Math.floor(visibles.findIndex((item) => item.id === id) / tamano) + 1 : 1
      render()
      guardarURL(false, true)
      const destino = document.getElementById(id)
      if (destino.querySelector('details')) destino.querySelector('details').open = true
      requestAnimationFrame(() => destino.scrollIntoView({ block: 'start' }))
    } catch { error.hidden = false }
  }
  form.hidden = false
  contador.hidden = false
  lista.querySelector('[data-resumen-estatico]').hidden = true
  lista.querySelector('[data-paginas-estaticas]').hidden = true
  paginacion.hidden = false
  leerURL()
  const paginas = Math.ceil(meta.total / tamano)
  contador.textContent = `${(meta.pagina - 1) * tamano + 1}–${Math.min(meta.pagina * tamano, meta.total)} de ${meta.total} ${meta.tipo}`
  lista.querySelector('[data-pagina]').textContent = `Página ${meta.pagina} de ${paginas}`
  anterior.disabled = meta.pagina === 1
  siguiente.disabled = meta.pagina === paginas
  form.addEventListener('submit', (event) => event.preventDefault())
  form.addEventListener('input', () => { pagina = 1; actualizar() })
  form.addEventListener('reset', (event) => {
    event.preventDefault(); entrada.value = ''; filtros.forEach((f) => { f.selectedIndex = 0 }); orden.selectedIndex = 0; pagina = 1
    actualizar({ push: true })
  })
  tamanos.addEventListener('change', () => { tamano = Number(tamanos.value); pagina = 1; actualizar({ push: true }) })
  for (const [boton, paso] of [[anterior, -1], [siguiente, 1]]) boton.addEventListener('click', async () => {
    // Keep the query and filters while the first index request is in flight.
    if (form.getAttribute('aria-busy') === 'true' || (peticion && !items)) return
    if (!items) { location.href = urlPagina(pagina + paso); return }
    pagina += paso
    await actualizar({ push: true })
    lista.scrollIntoView({ block: 'start' }); entrada.focus({ preventScroll: true })
  })
  window.addEventListener('popstate', async () => { leerURL(); await actualizar({ guardar: false }); await revelar() })
  window.addEventListener('hashchange', revelar)
  document.addEventListener('click', (event) => {
    const enlace = event.target.closest?.('a[href]')
    if (!enlace || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button) return
    const url = new URL(enlace.href, location.href)
    if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash === location.hash && url.hash) revelar()
  })
  form.querySelector('[data-imprimir]').addEventListener('click', async () => { await actualizar({ guardar: false }); if (items && error.hidden) window.print() })
  window.addEventListener('beforeprint', () => {
    recordar()
    // Native browser printing cannot await a promise. This same-origin fallback
    // is used only when printing happens before the async index has been read.
    if (!items) {
      try { const xhr = new XMLHttpRequest(); xhr.open('GET', meta.url, false); xhr.send(); if (xhr.status !== 200) throw new Error(); aceptar(JSON.parse(xhr.responseText)) }
      catch { error.hidden = false; return }
    }
    imprimiendo = true
    render(true)
  })
  window.addEventListener('afterprint', () => { if (imprimiendo) { render(); imprimiendo = false } })
  const params = new URL(location.href).searchParams
  if (entrada.value || filtros.some((f) => f.value) || orden.selectedIndex > 0 || params.has('pagina') || params.has('por-pagina')) actualizar({ guardar: false }).then(revelar)
  else revelar()
}
