// MapLibre 6 no expone default export: solo importaciones con nombre.
// `Map` se renombra para no pisar el Map nativo que usa este módulo.
import { Map as MapaGL, NavigationControl, AttributionControl, ScaleControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// El mapa se alimenta de ficheros estáticos servidos desde /datos.
// Las capas pesadas (red de transporte) se piden solo al activarlas.

const COLOR_ESTADO = {
  operativo: '#1b7f5f',
  parcialmente_operativo: '#4da58b',
  ampliacion_en_construccion: '#4da58b',
  en_construccion: '#c1702a',
  permisos_concedidos: '#b9922a',
  en_tramitacion: '#7a6fa8',
  anunciado: '#5c83ad',
  paralizado: '#8a8a84',
  cancelado: '#a8423f',
  desconocido: '#a3a099',
}

const ETIQUETA_ESTADO = {
  operativo: 'Operativo',
  parcialmente_operativo: 'Parcialmente operativo',
  ampliacion_en_construccion: 'Operativo, ampliando',
  en_construccion: 'En construcción',
  permisos_concedidos: 'Permisos concedidos',
  en_tramitacion: 'En tramitación',
  anunciado: 'Anunciado',
  paralizado: 'Paralizado',
  cancelado: 'Cancelado',
  desconocido: 'Estado desconocido',
}

const METRICAS = {
  mw_it: 'MW IT',
  mw_conexion: 'MW de conexión',
  mw_sin_tipo: 'MW sin tipificar',
}

const oscuro = () => {
  const attr = document.documentElement.dataset.tema
  if (attr === 'oscuro') return true
  if (attr === 'claro') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const ESTILO = () =>
  oscuro()
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

const $ = (sel, raiz = document) => raiz.querySelector(sel)
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)]

const estado = {
  metrica: 'mw_it',
  texto: '',
  estados: new Set(),
  ccaa: '',
  operador: '',
  modelo: '',
  confianza: '',
  minimo: 0,
  soloConMetrica: false,
  capas: { lineas: false, subestaciones: false, renovables: false },
}

let mapa
let sitios = { type: 'FeatureCollection', features: [] }
const cargadas = new Set()

// --- expresiones de estilo ---------------------------------------------------

const colorPorEstado = [
  'match',
  ['get', 'estado'],
  ...Object.entries(COLOR_ESTADO).flat(),
  COLOR_ESTADO.desconocido,
]

// Radio proporcional a la raíz del valor: el área representa la magnitud.
const radioPorMetrica = (metrica) => [
  'interpolate',
  ['linear'],
  ['zoom'],
  4,
  ['case', ['==', ['get', metrica], null], 3, ['*', 0.55, ['sqrt', ['max', ['get', metrica], 1]]]],
  11,
  ['case', ['==', ['get', metrica], null], 6, ['*', 2.2, ['sqrt', ['max', ['get', metrica], 1]]]],
]

function filtroMapLibre() {
  const f = ['all']
  if (estado.estados.size) f.push(['in', ['get', 'estado'], ['literal', [...estado.estados]]])
  if (estado.ccaa) f.push(['==', ['get', 'ccaa'], estado.ccaa])
  if (estado.operador) f.push(['==', ['get', 'operador'], estado.operador])
  if (estado.modelo) f.push(['==', ['get', 'modelo'], estado.modelo])
  if (estado.confianza) f.push(['==', ['get', 'confianza'], estado.confianza])
  if (estado.soloConMetrica) f.push(['!=', ['get', estado.metrica], null])
  if (estado.minimo > 0) f.push(['>=', ['coalesce', ['get', estado.metrica], -1], estado.minimo])
  return f.length > 1 ? f : null
}

// El texto se filtra en JS porque hay que mirar también los alias.
function coincideTexto(p, indiceAlias) {
  if (!estado.texto) return true
  const t = estado.texto
  const campos = [p.nombre, p.operador, p.municipio, p.ccaa, indiceAlias.get(p.id) ?? '']
  return campos.some((c) => String(c ?? '').toLowerCase().includes(t))
}

// --- interfaz ----------------------------------------------------------------

const indiceAlias = new Map()

function pintarLista() {
  const cont = $('#lista-resultados')
  if (!cont) return

  const visibles = sitios.features
    .filter((f) => coincideTexto(f.properties, indiceAlias))
    .filter((f) => {
      const p = f.properties
      if (estado.estados.size && !estado.estados.has(p.estado)) return false
      if (estado.ccaa && p.ccaa !== estado.ccaa) return false
      if (estado.operador && p.operador !== estado.operador) return false
      if (estado.modelo && p.modelo !== estado.modelo) return false
      if (estado.confianza && p.confianza !== estado.confianza) return false
      if (estado.soloConMetrica && p[estado.metrica] == null) return false
      if (estado.minimo > 0 && !(p[estado.metrica] >= estado.minimo)) return false
      return true
    })
    .sort((a, b) => (b.properties[estado.metrica] ?? -1) - (a.properties[estado.metrica] ?? -1))

  $('#recuento').textContent =
    visibles.length === sitios.features.length
      ? `${visibles.length} emplazamientos`
      : `${visibles.length} de ${sitios.features.length} emplazamientos`

  const conMetrica = visibles.filter((f) => f.properties[estado.metrica] != null)
  const suma = conMetrica.reduce((a, f) => a + f.properties[estado.metrica], 0)
  $('#suma').innerHTML = conMetrica.length
    ? `Suma de ${METRICAS[estado.metrica]}: <strong>${suma.toLocaleString('es-ES', { maximumFractionDigits: 0 })} MW</strong>
       <span class="silencio">· en ${conMetrica.length} de ${visibles.length} emplazamientos; el resto no publica esta magnitud</span>`
    : `<span class="silencio">Ningún emplazamiento del filtro publica ${METRICAS[estado.metrica]}.</span>`

  cont.innerHTML = visibles
    .slice(0, 300)
    .map((f) => {
      const p = f.properties
      const v = p[estado.metrica]
      return `<li>
        <button class="fila-sitio" data-id="${p.id}" data-lon="${f.geometry.coordinates[0]}" data-lat="${f.geometry.coordinates[1]}">
          <span class="fila-punto" style="background:${COLOR_ESTADO[p.estado] ?? COLOR_ESTADO.desconocido}"></span>
          <span class="fila-texto">
            <strong>${p.nombre}</strong>
            <span class="silencio pequeno">${[p.operador, p.municipio].filter(Boolean).join(' · ')}</span>
          </span>
          <span class="fila-mw">${v != null ? `${v.toLocaleString('es-ES')}<small> MW</small>` : '<span class="silencio">—</span>'}</span>
        </button>
      </li>`
    })
    .join('')

  if (visibles.length > 300) {
    cont.insertAdjacentHTML(
      'beforeend',
      `<li class="silencio pequeno" style="padding:.6rem .8rem">Se muestran los 300 primeros. Afina el filtro para ver el resto.</li>`,
    )
  }

  $$('.fila-sitio', cont).forEach((b) =>
    b.addEventListener('click', () => {
      mapa.flyTo({ center: [Number(b.dataset.lon), Number(b.dataset.lat)], zoom: 12, duration: 800 })
      abrirFicha(b.dataset.id)
    }),
  )
}

function aplicar() {
  const filtro = filtroMapLibre()
  for (const capa of ['sitios-circulo', 'sitios-borde', 'sitios-etiqueta']) {
    if (mapa.getLayer(capa)) mapa.setFilter(capa, filtro)
  }
  for (const capa of ['sitios-circulo', 'sitios-borde']) {
    if (mapa.getLayer(capa)) mapa.setPaintProperty(capa, 'circle-radius', radioPorMetrica(estado.metrica))
  }
  pintarLista()
  guardarEnUrl()
}

function abrirFicha(id) {
  const f = sitios.features.find((x) => x.properties.id === id)
  if (!f) return
  const p = f.properties
  const panel = $('#panel-detalle')
  const filas = [
    ['Operador', p.operador],
    ['Ubicación', [p.municipio, p.ccaa].filter(Boolean).join(', ')],
    ['MW IT', p.mw_it != null ? `${p.mw_it.toLocaleString('es-ES')} MW` : null],
    ['MW de conexión', p.mw_conexion != null ? `${p.mw_conexion.toLocaleString('es-ES')} MW` : null],
    ['MW sin tipificar', p.mw_sin_tipo != null ? `${p.mw_sin_tipo.toLocaleString('es-ES')} MW` : null],
  ].filter(([, v]) => v)

  panel.innerHTML = `
    <button class="cerrar" aria-label="Cerrar">×</button>
    <span class="etiqueta estado-${p.estado}"><span class="punto"></span>${ETIQUETA_ESTADO[p.estado] ?? p.estado}</span>
    <h2>${p.nombre}</h2>
    <dl class="detalle">
      ${filas.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}
    </dl>
    ${p.precision !== 'exacta' ? `<p class="pequeno silencio">Ubicación con precisión «${p.precision}».</p>` : ''}
    <a class="boton-ficha" href="/proyecto/${p.id}">Ver ficha completa con fuentes →</a>
  `
  panel.hidden = false
  $('.cerrar', panel).addEventListener('click', () => (panel.hidden = true))
}

// --- estado en la URL --------------------------------------------------------

function guardarEnUrl() {
  const q = new URLSearchParams()
  if (estado.metrica !== 'mw_it') q.set('m', estado.metrica)
  if (estado.texto) q.set('q', estado.texto)
  if (estado.estados.size) q.set('e', [...estado.estados].join(','))
  if (estado.ccaa) q.set('r', estado.ccaa)
  if (estado.operador) q.set('o', estado.operador)
  if (estado.modelo) q.set('t', estado.modelo)
  if (estado.confianza) q.set('c', estado.confianza)
  if (estado.minimo) q.set('min', String(estado.minimo))
  const capas = Object.entries(estado.capas).filter(([, v]) => v).map(([k]) => k)
  if (capas.length) q.set('capas', capas.join(','))
  const s = q.toString()
  history.replaceState(null, '', s ? `?${s}` : location.pathname)
}

function leerDeUrl() {
  const q = new URLSearchParams(location.search)
  if (q.get('m') in METRICAS) estado.metrica = q.get('m')
  estado.texto = (q.get('q') ?? '').toLowerCase()
  if (q.get('e')) estado.estados = new Set(q.get('e').split(','))
  estado.ccaa = q.get('r') ?? ''
  estado.operador = q.get('o') ?? ''
  estado.modelo = q.get('t') ?? ''
  estado.confianza = q.get('c') ?? ''
  estado.minimo = Number(q.get('min') ?? 0) || 0
  for (const c of (q.get('capas') ?? '').split(',').filter(Boolean)) {
    if (c in estado.capas) estado.capas[c] = true
  }
}

// --- capas opcionales --------------------------------------------------------

async function cargarCapa(nombre) {
  if (cargadas.has(nombre)) return
  cargadas.add(nombre)

  if (nombre === 'lineas') {
    const datos = await (await fetch('/datos/lineas.geojson')).json()
    mapa.addSource('lineas', { type: 'geojson', data: datos })
    mapa.addLayer(
      {
        id: 'lineas-trazado',
        type: 'line',
        source: 'lineas',
        paint: {
          'line-color': ['match', ['get', 'nivel'], '400', '#b3543f', '#7d8fa3'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 5, ['match', ['get', 'nivel'], '400', 1.1, 0.6], 12, ['match', ['get', 'nivel'], '400', 3, 1.8]],
          'line-opacity': 0.75,
        },
      },
      'sitios-borde',
    )
  }

  if (nombre === 'subestaciones') {
    const datos = await (await fetch('/datos/red.geojson')).json()
    mapa.addSource('subestaciones', { type: 'geojson', data: datos })
    mapa.addLayer(
      {
        id: 'subestaciones-simbolo',
        type: 'symbol',
        source: 'subestaciones',
        layout: {
          'icon-image': 'cuadro-subestacion',
          'icon-allow-overlap': true,
          'text-field': ['get', 'nombre'],
          'text-size': 10,
          'text-offset': [0, 1.1],
          'text-anchor': 'top',
          'text-optional': true,
        },
        paint: {
          'text-color': oscuro() ? '#c9c6c0' : '#55524c',
          'text-halo-color': oscuro() ? '#15171a' : '#fbfaf8',
          'text-halo-width': 1.2,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0, 9.5, 1],
        },
      },
      'sitios-borde',
    )
  }

  if (nombre === 'renovables') {
    const datos = await (await fetch('/datos/renovables.geojson')).json()
    mapa.addSource('renovables', { type: 'geojson', data: datos })
    mapa.addLayer({
      id: 'renovables-circulo',
      type: 'circle',
      source: 'renovables',
      paint: {
        'circle-color': ['match', ['get', 'tipo'], 'bess', '#7a6fa8', 'eolica', '#4f8fa8', '#c9a227'],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 2.5, 11, 7],
        'circle-opacity': 0.7,
        'circle-stroke-width': 0.8,
        'circle-stroke-color': oscuro() ? '#15171a' : '#fbfaf8',
      },
    })
  }
}

function alternarCapa(nombre, activa) {
  estado.capas[nombre] = activa
  const capas = {
    lineas: ['lineas-trazado'],
    subestaciones: ['subestaciones-simbolo'],
    renovables: ['renovables-circulo'],
  }[nombre]

  const aplicarVisibilidad = () => {
    for (const c of capas) {
      if (mapa.getLayer(c)) mapa.setLayoutProperty(c, 'visibility', activa ? 'visible' : 'none')
    }
  }

  if (activa && !cargadas.has(nombre)) {
    cargarCapa(nombre).then(aplicarVisibilidad)
  } else {
    aplicarVisibilidad()
  }
  guardarEnUrl()
}

// --- arranque ----------------------------------------------------------------

function iconoSubestacion() {
  const tam = 12
  const datos = new Uint8Array(tam * tam * 4)
  const [r, g, b] = oscuro() ? [200, 180, 120] : [120, 95, 40]
  for (let y = 0; y < tam; y++) {
    for (let x = 0; x < tam; x++) {
      const i = (y * tam + x) * 4
      const borde = x < 2 || y < 2 || x >= tam - 2 || y >= tam - 2
      datos[i] = r
      datos[i + 1] = g
      datos[i + 2] = b
      datos[i + 3] = borde ? 255 : 60
    }
  }
  return { width: tam, height: tam, data: datos }
}

export async function iniciarMapa(opciones = {}) {
  leerDeUrl()
  if (opciones.ccaa) estado.ccaa = opciones.ccaa
  if (opciones.operador) estado.operador = opciones.operador

  mapa = new MapaGL({
    container: 'mapa',
    style: ESTILO(),
    center: opciones.centro ?? [-3.6, 40.2],
    zoom: opciones.zoom ?? 5.3,
    minZoom: 4,
    maxZoom: 17,
    attributionControl: false,
  })
  mapa.addControl(new NavigationControl({ showCompass: false }), 'top-right')
  mapa.addControl(
    new AttributionControl({
      compact: true,
      customAttribution: '© OpenStreetMap · © CARTO · red de transporte derivada de OSM (ODbL)',
    }),
    'bottom-right',
  )
  mapa.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left')

  const [geo, indice] = await Promise.all([
    fetch('/datos/sitios.geojson').then((r) => r.json()),
    fetch('/datos/alias.json').then((r) => r.json()).catch(() => ({})),
  ])
  sitios = geo
  for (const [id, alias] of Object.entries(indice)) indiceAlias.set(id, alias.join(' '))

  await new Promise((r) => mapa.on('load', r))

  mapa.addImage('cuadro-subestacion', iconoSubestacion())
  mapa.addSource('sitios', { type: 'geojson', data: sitios })

  mapa.addLayer({
    id: 'sitios-borde',
    type: 'circle',
    source: 'sitios',
    paint: {
      'circle-radius': radioPorMetrica(estado.metrica),
      'circle-color': 'transparent',
      'circle-stroke-width': 1,
      'circle-stroke-color': colorPorEstado,
      'circle-stroke-opacity': 0.9,
    },
  })
  mapa.addLayer({
    id: 'sitios-circulo',
    type: 'circle',
    source: 'sitios',
    paint: {
      'circle-radius': radioPorMetrica(estado.metrica),
      'circle-color': colorPorEstado,
      // Los emplazamientos sin la métrica elegida se dibujan huecos: no se
      // rellena visualmente un dato que no existe.
      'circle-opacity': ['case', ['==', ['get', estado.metrica], null], 0.12, 0.55],
    },
  })
  mapa.addLayer({
    id: 'sitios-etiqueta',
    type: 'symbol',
    source: 'sitios',
    minzoom: 9,
    layout: {
      'text-field': ['get', 'nombre'],
      'text-size': 11,
      'text-offset': [0, 1.3],
      'text-anchor': 'top',
      'text-optional': true,
    },
    paint: {
      'text-color': oscuro() ? '#e7e5e0' : '#1b1b19',
      'text-halo-color': oscuro() ? '#15171a' : '#fbfaf8',
      'text-halo-width': 1.4,
    },
  })

  mapa.on('click', 'sitios-circulo', (e) => abrirFicha(e.features[0].properties.id))
  mapa.on('mouseenter', 'sitios-circulo', () => (mapa.getCanvas().style.cursor = 'pointer'))
  mapa.on('mouseleave', 'sitios-circulo', () => (mapa.getCanvas().style.cursor = ''))

  conectarControles()
  for (const [nombre, activa] of Object.entries(estado.capas)) if (activa) alternarCapa(nombre, true)
  aplicar()
}

function conectarControles() {
  const buscador = $('#filtro-texto')
  if (buscador) {
    buscador.value = estado.texto
    let t
    buscador.addEventListener('input', () => {
      clearTimeout(t)
      t = setTimeout(() => {
        estado.texto = buscador.value.trim().toLowerCase()
        aplicar()
      }, 180)
    })
  }

  $$('[data-filtro]').forEach((el) => {
    const campo = el.dataset.filtro
    if (estado[campo]) el.value = estado[campo]
    el.addEventListener('change', () => {
      estado[campo] = el.value
      aplicar()
    })
  })

  $$('[data-estado]').forEach((el) => {
    el.checked = estado.estados.has(el.dataset.estado)
    el.addEventListener('change', () => {
      if (el.checked) estado.estados.add(el.dataset.estado)
      else estado.estados.delete(el.dataset.estado)
      aplicar()
    })
  })

  const metrica = $('#filtro-metrica')
  if (metrica) {
    metrica.value = estado.metrica
    metrica.addEventListener('change', () => {
      estado.metrica = metrica.value
      $('#etiqueta-minimo-metrica').textContent = METRICAS[estado.metrica]
      aplicar()
    })
    $('#etiqueta-minimo-metrica').textContent = METRICAS[estado.metrica]
  }

  const minimo = $('#filtro-minimo')
  if (minimo) {
    minimo.value = String(estado.minimo)
    $('#valor-minimo').textContent = estado.minimo ? `${estado.minimo} MW` : 'sin mínimo'
    minimo.addEventListener('input', () => {
      estado.minimo = Number(minimo.value)
      $('#valor-minimo').textContent = estado.minimo ? `${estado.minimo} MW` : 'sin mínimo'
      aplicar()
    })
  }

  const soloCon = $('#filtro-solo-con-metrica')
  if (soloCon) {
    soloCon.checked = estado.soloConMetrica
    soloCon.addEventListener('change', () => {
      estado.soloConMetrica = soloCon.checked
      aplicar()
    })
  }

  $$('[data-capa]').forEach((el) => {
    el.checked = estado.capas[el.dataset.capa] ?? false
    el.addEventListener('change', () => alternarCapa(el.dataset.capa, el.checked))
  })

  const limpiar = $('#limpiar-filtros')
  if (limpiar) {
    limpiar.addEventListener('click', () => {
      estado.texto = ''
      estado.estados.clear()
      estado.ccaa = ''
      estado.operador = ''
      estado.modelo = ''
      estado.confianza = ''
      estado.minimo = 0
      estado.soloConMetrica = false
      if (buscador) buscador.value = ''
      $$('[data-filtro]').forEach((el) => (el.value = ''))
      $$('[data-estado]').forEach((el) => (el.checked = false))
      if (minimo) minimo.value = '0'
      if (soloCon) soloCon.checked = false
      $('#valor-minimo').textContent = 'sin mínimo'
      aplicar()
    })
  }

  const alternarPanel = $('#alternar-panel')
  if (alternarPanel) {
    alternarPanel.addEventListener('click', () => {
      const p = $('#panel-filtros')
      const abierto = p.classList.toggle('abierto')
      alternarPanel.setAttribute('aria-expanded', String(abierto))
    })
  }
}
