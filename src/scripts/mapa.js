// MapLibre 5: lleva su worker incorporado en el propio bundle. La rama 6 lo
// emite como fichero aparte que el empaquetado estático no llega a publicar,
// y el mapa se queda en blanco en producción.
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
let inventario = []
const cargadas = new Set()
// Registro completo de subestaciones y renovables, para las fichas emergentes.
const detalleRed = new Map()
const detalleRenovables = new Map()

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

  const visibles = inventario
    .filter((p) => coincideTexto(p, indiceAlias))
    .filter((p) => {
      if (estado.estados.size && !estado.estados.has(p.estado)) return false
      if (estado.ccaa && p.ccaa !== estado.ccaa) return false
      if (estado.operador && p.operador !== estado.operador) return false
      if (estado.modelo && p.modelo !== estado.modelo) return false
      if (estado.confianza && p.confianza !== estado.confianza) return false
      if (estado.soloConMetrica && p[estado.metrica] == null) return false
      if (estado.minimo > 0 && !(p[estado.metrica] >= estado.minimo)) return false
      return true
    })
    .sort((a, b) => (b[estado.metrica] ?? -1) - (a[estado.metrica] ?? -1))

  const sinCoordenadas = visibles.filter((p) => p.lat == null).length

  // Se dice cuántos hay y cuántos no pueden dibujarse: el mapa no es el censo.
  $('#recuento').textContent =
    visibles.length === inventario.length
      ? `${visibles.length} emplazamientos`
      : `${visibles.length} de ${inventario.length} emplazamientos`
  const fuera = $('#fuera-mapa')
  if (fuera) {
    fuera.textContent = sinCoordenadas
      ? `${sinCoordenadas} sin coordenadas publicadas, fuera del mapa`
      : ''
  }

  const conMetrica = visibles.filter((p) => p[estado.metrica] != null)
  const suma = conMetrica.reduce((a, p) => a + p[estado.metrica], 0)
  $('#suma').innerHTML = conMetrica.length
    ? `Suma de ${METRICAS[estado.metrica]}: <strong>${suma.toLocaleString('es-ES', { maximumFractionDigits: 0 })} MW</strong>
       <span class="silencio">· en ${conMetrica.length} de ${visibles.length} emplazamientos; el resto no publica esta magnitud</span>`
    : `<span class="silencio">Ningún emplazamiento del filtro publica ${METRICAS[estado.metrica]}.</span>`

  cont.innerHTML = visibles
    .slice(0, 300)
    .map((p) => {
      const v = p[estado.metrica]
      return `<li>
        <button class="fila-sitio" data-id="${p.id}" data-lon="${p.lon ?? ''}" data-lat="${p.lat ?? ''}">
          <span class="fila-punto" style="background:${COLOR_ESTADO[p.estado] ?? COLOR_ESTADO.desconocido}"></span>
          <span class="fila-texto">
            <strong>${p.nombre}</strong>
            <span class="silencio pequeno">${[p.operador, p.municipio, p.lat == null ? 'sin ubicar' : null].filter(Boolean).join(' · ')}</span>
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
      if (b.dataset.lat) {
        mapa.flyTo({ center: [Number(b.dataset.lon), Number(b.dataset.lat)], zoom: 12, duration: 800 })
      }
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
  const p = inventario.find((x) => x.id === id)
  if (!p) return
  const filas = [
    ['Operador', p.operador],
    ['Ubicación', [p.municipio, p.ccaa].filter(Boolean).join(', ')],
    ['MW IT', p.mw_it != null ? `${p.mw_it.toLocaleString('es-ES')} MW` : null],
    ['MW de conexión', p.mw_conexion != null ? `${p.mw_conexion.toLocaleString('es-ES')} MW` : null],
    ['MW sin tipificar', p.mw_sin_tipo != null ? `${p.mw_sin_tipo.toLocaleString('es-ES')} MW` : null],
  ].filter(([, v]) => v)

  panelHtml(`
    <span class="etiqueta estado-${p.estado}"><span class="punto"></span>${ETIQUETA_ESTADO[p.estado] ?? p.estado}</span>
    <h2>${p.nombre}</h2>
    <dl class="detalle">
      ${filas.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}
    </dl>
    ${
      p.coordenada_derivada
        ? '<p class="pequeno silencio">Situado en el centro de su municipio: la fuente no publica la parcela.</p>'
        : p.precision !== 'exacta'
          ? `<p class="pequeno silencio">Ubicación con precisión «${p.precision}».</p>`
          : ''
    }
    <a class="boton-ficha" href="/proyecto/${p.id}">Ver ficha completa con fuentes →</a>
  `)
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
          'line-width': ['interpolate', ['linear'], ['zoom'], 5, ['match', ['get', 'nivel'], '400', 0.9, 0.5], 12, ['match', ['get', 'nivel'], '400', 2.4, 1.4]],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.42, 9, 0.6],
        },
      },
      'sitios-borde',
    )
  }

  if (nombre === 'subestaciones') {
    const [datos, completo] = await Promise.all([
      fetch('/datos/red.geojson').then((r) => r.json()),
      fetch('/datos/red.json').then((r) => r.json()),
    ])
    for (const n of completo) detalleRed.set(n.id, n)
    mapa.addSource('subestaciones', { type: 'geojson', data: datos })
    mapa.addLayer(
      {
        id: 'subestaciones-simbolo',
        type: 'symbol',
        source: 'subestaciones',
        minzoom: 4.5,
        layout: {
          'icon-image': 'cuadro-subestacion',
          'icon-allow-overlap': false,
          'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.45, 11, 1],
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
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 8.5, 0, 10, 0.85],
          'icon-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.55, 10, 0.9],
        },
      },
      'sitios-borde',
    )
    mapa.on('click', 'subestaciones-simbolo', (e) => abrirSubestacion(e.features[0].properties.id))
    mapa.on('mouseenter', 'subestaciones-simbolo', () => (mapa.getCanvas().style.cursor = 'pointer'))
    mapa.on('mouseleave', 'subestaciones-simbolo', () => (mapa.getCanvas().style.cursor = ''))
  }

  if (nombre === 'renovables') {
    const [datos, completo] = await Promise.all([
      fetch('/datos/renovables.geojson').then((r) => r.json()),
      fetch('/datos/renovables.json').then((r) => r.json()),
    ])
    for (const a of completo) detalleRenovables.set(a.id, a)
    mapa.addSource('renovables', { type: 'geojson', data: datos })
    mapa.addLayer({
      id: 'renovables-circulo',
      type: 'circle',
      source: 'renovables',
      paint: {
        'circle-color': ['match', ['get', 'tipo'], 'bess', '#7a6fa8', 'eolica', '#4f8fa8', '#c9a227'],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 2.5, 11, 7],
        'circle-opacity': ['case', ['==', ['get', 'coordenada_derivada'], true], 0.45, 0.7],
        'circle-stroke-width': 0.8,
        'circle-stroke-color': oscuro() ? '#15171a' : '#fbfaf8',
      },
    })
    mapa.on('click', 'renovables-circulo', (e) => abrirRenovable(e.features[0].properties.id))
    mapa.on('mouseenter', 'renovables-circulo', () => (mapa.getCanvas().style.cursor = 'pointer'))
    mapa.on('mouseleave', 'renovables-circulo', () => (mapa.getCanvas().style.cursor = ''))
  }
}

const panelHtml = (contenido) => {
  const panel = $('#panel-detalle')
  panel.innerHTML = `<button class="cerrar" aria-label="Cerrar">×</button>${contenido}`
  panel.hidden = false
  $('.cerrar', panel).addEventListener('click', () => (panel.hidden = true))
}

const mw = (v) => (v == null ? null : `${Number(v).toLocaleString('es-ES', { maximumFractionDigits: 1 })} MW`)

function abrirSubestacion(id) {
  const n = detalleRed.get(id)
  if (!n) return
  const nudos = n.nudos ?? []
  // La capacidad disponible se publica con tres criterios distintos; se muestran
  // los tres en lugar de elegir uno.
  const filaNudo = (u) => {
    const d = u.disponible_criterio_general_demanda_mw ?? {}
    const valores = [d.cep_ch, d.cep_sh, d.no_cep].filter((v) => v != null)
    return `<tr>
      <td>${u.nudo}</td>
      <td class="num">${mw(u.otorgada_demanda_rdt_mw) ?? '—'}</td>
      <td class="num">${mw(u.solicitada_en_curso_demanda_rdt_mw) ?? '—'}</td>
      <td class="num">${valores.length ? valores.map((v) => mw(v)).join(' / ') : '<span class="silencio">no publicada</span>'}</td>
    </tr>`
  }

  panelHtml(`
    <span class="etiqueta">Subestación</span>
    <h2>${n.nombre ?? n.id}</h2>
    <dl class="detalle">
      <dt>Tensiones</dt><dd>${Array.isArray(n.tensiones_kv) ? n.tensiones_kv.join(' / ') : (n.tension_kv ?? '—')} kV</dd>
      <dt>Titular</dt><dd>${n.titular ?? '—'}</dd>
      <dt>Ubicación</dt><dd>${[n.municipio, n.ccaa].filter(Boolean).join(', ') || '—'}</dd>
      <dt>Estado</dt><dd>${n.estado ?? '—'}</dd>
    </dl>
    ${
      nudos.length
        ? `<p class="pequeno silencio">Capacidad de acceso para <strong>demanda</strong> (no generación), según Red Eléctrica.</p>
           <div class="tabla-mini"><table>
             <thead><tr><th>Nudo</th><th class="num">Otorgada</th><th class="num">En curso</th><th class="num">Disponible</th></tr></thead>
             <tbody>${nudos.map(filaNudo).join('')}</tbody>
           </table></div>
           <p class="pequeno silencio">«Disponible» se publica con tres criterios (con hueco, sin hueco y sin condicionar); se muestran los tres separados por barras.</p>`
        : '<p class="pequeno silencio">Sin datos de capacidad de acceso registrados para esta subestación.</p>'
    }
  `)
}

function abrirRenovable(id) {
  const a = detalleRenovables.get(id)
  if (!a) return
  panelHtml(`
    <span class="etiqueta">${a.tipo ?? 'Activo energético'}</span>
    <h2>${a.nombre ?? a.id}</h2>
    <dl class="detalle">
      <dt>Potencia</dt><dd>${mw(a.potencia_mw) ?? '—'}</dd>
      ${a.capacidad_mwh ? `<dt>Almacenamiento</dt><dd>${a.capacidad_mwh.toLocaleString('es-ES')} MWh</dd>` : ''}
      <dt>Promotor</dt><dd>${a.promotor ?? '—'}</dd>
      ${a.contraparte_ppa ? `<dt>Contraparte</dt><dd>${a.contraparte_ppa}</dd>` : ''}
      <dt>Vínculo</dt><dd>${a.tipo_vinculo ?? '—'}</dd>
      <dt>Estado</dt><dd>${a.estado ?? '—'}</dd>
      <dt>Ubicación</dt><dd>${[a.municipio, a.ccaa].filter(Boolean).join(', ') || '—'}</dd>
    </dl>
    <p class="pequeno silencio">Un PPA es un contrato de compra de energía: no implica suministro físico desde esta planta.</p>
  `)
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
    actualizarLeyenda()
  }

  if (activa && !cargadas.has(nombre)) {
    cargarCapa(nombre).then(aplicarVisibilidad)
  } else {
    aplicarVisibilidad()
  }
  guardarEnUrl()
}

// --- arranque ----------------------------------------------------------------

/** Cuadrado hueco de un píxel de trazo: presente pero sin robar protagonismo. */
function iconoSubestacion() {
  const tam = 10
  const datos = new Uint8Array(tam * tam * 4)
  const [r, g, b] = oscuro() ? [186, 170, 132] : [122, 106, 74]
  for (let y = 0; y < tam; y++) {
    for (let x = 0; x < tam; x++) {
      const i = (y * tam + x) * 4
      const borde = x === 0 || y === 0 || x === tam - 1 || y === tam - 1
      datos[i] = r
      datos[i + 1] = g
      datos[i + 2] = b
      datos[i + 3] = borde ? 235 : 0
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
      customAttribution: 'red de transporte derivada de OpenStreetMap (ODbL)',
    }),
    'bottom-right',
  )
  mapa.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left')

  const [geo, lista] = await Promise.all([
    fetch('/datos/sitios.geojson').then((r) => r.json()),
    fetch('/datos/sitios-lista.json').then((r) => r.json()),
  ])
  sitios = geo
  inventario = lista
  for (const s of lista) if (s.alias?.length) indiceAlias.set(s.id, s.alias.join(' '))

  await new Promise((r) => mapa.on('load', r))

  castellanizarRotulos()
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
      'circle-stroke-opacity': ['case', ['==', ['get', 'coordenada_derivada'], true], 0.45, 0.9],
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
      // rellena visualmente un dato que no existe. Los situados en el centro de
      // su municipio se atenúan para que no se lean como una parcela concreta.
      'circle-opacity': [
        'case',
        ['==', ['get', estado.metrica], null],
        0.1,
        ['==', ['get', 'coordenada_derivada'], true],
        0.28,
        0.55,
      ],
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

/** El estilo base rotula en inglés o en el idioma local; se prefiere el español. */
function castellanizarRotulos() {
  for (const capa of mapa.getStyle().layers ?? []) {
    if (capa.type !== 'symbol') continue
    const campo = capa.layout?.['text-field']
    if (!campo) continue
    try {
      mapa.setLayoutProperty(capa.id, 'text-field', [
        'coalesce',
        ['get', 'name:es'],
        ['get', 'name_es'],
        ['get', 'name'],
      ])
    } catch {
      // Alguna capa puede no admitir la expresión; se deja como venga.
    }
  }
}

/** Añade a la leyenda solo las capas eléctricas que estén encendidas. */
function actualizarLeyenda() {
  const extra = document.getElementById('leyenda-capas')
  if (!extra) return
  const piezas = []
  if (estado.capas.lineas) {
    piezas.push('<span class="leyenda-item"><span class="trazo trazo-400"></span>400 kV</span>')
    piezas.push('<span class="leyenda-item"><span class="trazo trazo-220"></span>220 kV</span>')
  }
  if (estado.capas.subestaciones) {
    piezas.push('<span class="leyenda-item"><span class="cuadro"></span>Subestación</span>')
  }
  if (estado.capas.renovables) {
    piezas.push('<span class="leyenda-item"><span class="punto-renovable"></span>Renovables y BESS</span>')
  }
  extra.innerHTML = piezas.join('')
  extra.hidden = piezas.length === 0
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
