// The server renders every item. Filtering and pagination only enhance that list.
import { normalizarBusqueda as normalizar } from '../lib/busqueda.js'
import { ETAPAS_CAPACIDAD } from '../lib/capacidad.js'
import { iniciarReferencias } from './referencias.js'

for (const lista of document.querySelectorAll('[data-listado]')) {
  if (lista.dataset.remoto) { iniciarReferencias(lista); continue }
  const form = lista.querySelector('[data-herramientas]')
  const items = [...lista.querySelectorAll('[data-list-item]')]
  if (!form || !items.length) continue
  const contenedor = items[0].parentElement
  const entrada = form.querySelector('[name=q]')
  const filtros = [...form.querySelectorAll('[data-filtro]')]
  const orden = form.querySelector('[data-orden]')
  const metrica = form.querySelector('[name=m]')
  const etapa = form.querySelector('[name=etapa]')
  const minimo = form.querySelector('[name=min]')
  const conDato = form.querySelector('[name=con]')
  const contador = lista.querySelector('[data-contador]')
  const vacio = lista.querySelector('[data-vacio]')
  const navegacion = lista.querySelector('[data-paginacion]')
  const anterior = lista.querySelector('[data-anterior]')
  const siguiente = lista.querySelector('[data-siguiente]')
  const tamanos = lista.querySelector('[data-tamano]')
  let pagina = 1
  let tamano = Number(lista.dataset.porPagina) || 0
  let visibles = items
  form.hidden = false
  contador.hidden = false

  const leerURL = () => {
    const params = new URL(location.href).searchParams
    entrada.value = params.get('q') ?? ''
    for (const filtro of filtros) {
      const valor = params.get(filtro.dataset.parametro ?? filtro.name) ?? params.get(filtro.name) ?? filtro.dataset.inicial ?? ''
      if (filtro.dataset.varios === 'si' && valor.includes(',')) {
        const validos = valor.split(',').filter((v) => [...filtro.options].some((o) => o.value === v))
        if (validos.length > 1 && ![...filtro.options].some((o) => o.value === validos.join(','))) {
          const opcion = document.createElement('option')
          opcion.value = validos.join(',')
          opcion.textContent = `${validos.length} estados del mapa`
          filtro.append(opcion)
        }
        filtro.value = validos.join(',')
      } else filtro.value = valor
    }
    if (filtros.some((f) => f.value && f.closest('.avanzados'))) form.querySelector('.avanzados').open = true
    if (metrica) {
      if (etapa) etapa.value = Object.hasOwn(ETAPAS_CAPACIDAD, params.get('etapa')) ? params.get('etapa') : 'operativa'
      metrica.value = params.get('m') ?? 'mw_it'
      if (metrica.selectedIndex < 0) metrica.value = 'mw_it'
      minimo.value = Math.max(0, Number(params.get('min')) || 0) || ''
      conDato.checked = params.get('con') === '1'
      if (minimo.value || conDato.checked || filtros.some((f) => f.closest('.avanzados') && f.value)) form.querySelector('.avanzados').open = true
    }
    if (orden) {
      orden.value = params.get('orden') ?? orden.options[0].value
      if (orden.selectedIndex < 0) orden.selectedIndex = 0
    }
    pagina = Math.max(1, Math.floor(Number(params.get('pagina')) || 1))
    if (tamanos) {
      const pedido = params.get('por-pagina')
      if (pedido !== null && [...tamanos.options].some((o) => o.value === pedido)) tamano = Number(pedido)
      else tamano = Number(lista.dataset.porPagina)
      tamanos.value = String(tamano)
    }
  }

  const guardarURL = () => {
    const url = new URL(location.href)
    const guardar = (clave, valor) => valor ? url.searchParams.set(clave, valor) : url.searchParams.delete(clave)
    guardar('q', entrada.value.trim())
    for (const filtro of filtros) {
      const parametro = filtro.dataset.parametro ?? filtro.name
      if (filtro.dataset.inicial && filtro.value === '') url.searchParams.set(parametro, '')
      else guardar(parametro, filtro.value !== (filtro.dataset.inicial ?? '') ? filtro.value : '')
      if (parametro !== filtro.name) url.searchParams.delete(filtro.name)
    }
    if (metrica) {
      guardar('etapa', etapa?.value !== 'operativa' ? etapa?.value : '')
      guardar('m', metrica.value !== 'mw_it' ? metrica.value : '')
      guardar('min', Number(minimo.value) > 0 ? minimo.value : '')
      guardar('con', conDato.checked ? '1' : '')
    }
    guardar('orden', orden && orden.value !== orden.options[0].value ? orden.value : '')
    guardar('pagina', pagina > 1 ? String(pagina) : '')
    guardar('por-pagina', tamanos && tamano !== Number(lista.dataset.porPagina) ? String(tamano) : '')
    if (url.href !== location.href) history.replaceState(null, '', url)
  }

  const encaja = (item) => {
    const palabras = normalizar(entrada.value.trim()).split(/\s+/).filter(Boolean)
    const campoMetrica = metrica ? { mw_it: 'it', mw_conexion: 'conexion', mw_sin_tipo: 'sintipo' }[metrica.value] : null
    const potencia = campoMetrica ? item.dataset[campoMetrica] : ''
    return palabras.every((p) => normalizar(item.dataset.busca).includes(p)) && filtros.every((f) => !f.value || (f.dataset.varios === 'si' ? f.value.split(',').includes(item.dataset[f.name]) : (item.dataset[f.name] ?? '').split('|').includes(f.value))) && (!metrica || ((!conDato.checked || potencia !== '') && (!(Number(minimo.value) > 0) || (potencia !== '' && Number(potencia) >= Number(minimo.value)))))
  }

  const actualizar = (guardar = true) => {
    if (etapa) {
      for (const item of items) {
        const grupo = JSON.parse(item.dataset.capacidades ?? '{}')[etapa.value] ?? {}
        for (const campo of ['it', 'conexion', 'sintipo']) {
          const [valor, disputada] = grupo[campo] ?? [null, false]
          item.dataset[campo] = valor == null ? '' : String(valor)
          const celda = item.querySelector(`[data-potencia-campo="${campo}"]`)
          if (!celda) continue
          celda.dataset.vacia = valor == null ? 'si' : 'no'
          celda.textContent = valor == null ? '—' : valor.toLocaleString('es-ES', { maximumFractionDigits: 3 })
          if (disputada) {
            const aviso = document.createElement('span')
            aviso.textContent = ' *'
            aviso.className = 'advertencia'
            aviso.title = 'Interpretación o lecturas disputadas. Consulta las fuentes de la ficha.'
            celda.append(aviso)
          }
        }
        const aviso = item.querySelector('[data-aviso-capacidad]')
        if (aviso) { aviso.hidden = ['it', 'conexion', 'sintipo'].some((c) => item.dataset[c] !== ''); aviso.textContent = `Sin datos para «${ETAPAS_CAPACIDAD[etapa.value]}» en estas magnitudes.` }
      }
      const lectura = lista.querySelector('[data-etapa-lectura]')
      if (lectura) lectura.textContent = `Capacidad ${ETAPAS_CAPACIDAD[etapa.value].toLocaleLowerCase('es')}.`
    }
    visibles = items.filter(encaja)
    if (orden) {
      const opcion = orden.selectedOptions[0]
      const campo = opcion.dataset.campo
      const numero = opcion.dataset.numerico === 'si'
      const direccion = opcion.dataset.direccion === 'desc' ? -1 : 1
      visibles.sort((a, b) => {
        const va = a.dataset[campo] ?? ''
        const vb = b.dataset[campo] ?? ''
        // Unpublished values stay last in either direction and never become zero.
        if (va === '' || vb === '') return va === vb ? 0 : va === '' ? 1 : -1
        return direccion * (numero ? Number(va) - Number(vb) : va.localeCompare(vb, 'es', { numeric: true, sensitivity: 'base' }))
      })
    }
    const paginas = tamano ? Math.max(1, Math.ceil(visibles.length / tamano)) : 1
    pagina = Math.min(pagina, paginas)
    const desde = tamano ? (pagina - 1) * tamano : 0
    const hasta = tamano ? Math.min(desde + tamano, visibles.length) : visibles.length
    const muestra = new Set(visibles.slice(desde, hasta))
    for (const item of items) item.hidden = !muestra.has(item)
    for (const item of visibles) contenedor.append(item)
    contador.textContent = visibles.length ? `${desde + 1}–${hasta} de ${visibles.length} ${lista.dataset.nombre}${visibles.length !== items.length ? ` · ${items.length} en total` : ''}` : `0 de ${items.length} ${lista.dataset.nombre}`
    vacio.hidden = visibles.length > 0
    const tabla = lista.querySelector('table')
    if (tabla) tabla.hidden = visibles.length === 0
    if (navegacion) {
      navegacion.hidden = visibles.length === 0
      anterior.disabled = pagina === 1
      siguiente.disabled = pagina === paginas
      lista.querySelector('[data-pagina]').textContent = `Página ${pagina} de ${paginas}`
    }
    if (guardar) guardarURL()
  }

  const revelarHash = () => {
    if (!location.hash) return
    let destino
    try { destino = document.getElementById(decodeURIComponent(location.hash.slice(1))) } catch { return }
    const item = destino?.closest('[data-list-item]')
    if (!item || !lista.contains(item)) return
    if (!encaja(item)) {
      entrada.value = ''
      for (const filtro of filtros) filtro.value = ''
      if (metrica) { minimo.value = ''; conDato.checked = false }
    }
    actualizar(false)
    pagina = tamano ? Math.floor(visibles.indexOf(item) / tamano) + 1 : 1
    actualizar()
    if (destino === item && item.querySelector('details')) item.querySelector('details').open = true
    for (let padre = destino; padre && padre !== lista; padre = padre.parentElement) if (padre.tagName === 'DETAILS') padre.open = true
    requestAnimationFrame(() => destino.scrollIntoView({ block: 'start' }))
  }

  form.addEventListener('submit', (event) => event.preventDefault())
  form.addEventListener('input', () => { pagina = 1; actualizar() })
  form.addEventListener('reset', (event) => {
    event.preventDefault()
    entrada.value = ''
    for (const filtro of filtros) filtro.value = filtro.dataset.inicial ?? ''
    if (orden) orden.selectedIndex = 0
    if (metrica) { metrica.value = 'mw_it'; minimo.value = ''; conDato.checked = false; if (etapa) etapa.value = 'operativa' }
    pagina = 1
    actualizar()
  })
  for (const [boton, paso] of [[anterior, -1], [siguiente, 1]]) boton?.addEventListener('click', () => {
    pagina += paso
    actualizar()
    lista.scrollIntoView({ block: 'start', behavior: 'instant' })
    entrada.focus({ preventScroll: true })
  })
  tamanos?.addEventListener('change', () => { tamano = Number(tamanos.value); pagina = 1; actualizar() })
  window.addEventListener('popstate', () => { leerURL(); actualizar(false); revelarHash() })
  window.addEventListener('hashchange', revelarHash)
  document.addEventListener('click', (event) => {
    const enlace = event.target.closest?.('a[href]')
    if (!enlace) return
    const url = new URL(enlace.href, location.href)
    if (url.pathname === location.pathname && url.search === location.search && url.hash && url.hash === location.hash) revelarHash()
  })
  let estadoImpresion = null
  window.addEventListener('beforeprint', () => {
    estadoImpresion = { ocultos: items.map((item) => item.hidden), contador: contador.textContent, paginacionOculta: navegacion?.hidden }
    const incluidos = new Set(visibles)
    for (const item of items) item.hidden = !incluidos.has(item)
    contador.textContent = `${visibles.length} de ${items.length} ${lista.dataset.nombre}`
    if (navegacion) navegacion.hidden = true
  })
  window.addEventListener('afterprint', () => {
    if (!estadoImpresion) return
    items.forEach((item, i) => { item.hidden = estadoImpresion.ocultos[i] })
    contador.textContent = estadoImpresion.contador
    if (navegacion) navegacion.hidden = estadoImpresion.paginacionOculta
    estadoImpresion = null
  })
  leerURL()
  actualizar(false)
  revelarHash()
}
