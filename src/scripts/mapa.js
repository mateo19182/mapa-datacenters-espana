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

// Cinco colores y un neutro, no uno por combustible. La paleta está validada
// para daltonismo (separación mínima ΔE 13,1 sobre fondo claro y 12,7 sobre
// oscuro, en protanopia y deuteranopia), y eso deja de cumplirse a partir de
// seis tonos: por encima de ahí el color miente. Por eso carbón, gas y fuelóleo
// comparten grupo y la biomasa cae en «otras». El `plant:source` literal se
// conserva en la ficha, que es donde se lee sin depender de la vista.
const COLOR_FUENTE_CLARO = {
  solar: '#b99d14',
  hidraulica: '#5c80bc',
  eolica: '#42b2ae',
  nuclear: '#8b2979',
  fosil: '#a8523a',
  otra: '#77746c',
}

const COLOR_FUENTE_OSCURO = {
  solar: '#a28b23',
  hidraulica: '#405ec9',
  eolica: '#32a090',
  nuclear: '#a52280',
  fosil: '#ab2b06',
  otra: '#86837c',
}

const ETIQUETA_FUENTE = {
  solar: 'Solar',
  hidraulica: 'Hidráulica',
  eolica: 'Eólica',
  nuclear: 'Nuclear',
  fosil: 'Térmica fósil',
  otra: 'Otras y mixtas',
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
  capas: { lineas: false, subestaciones: false, renovables: false, centrales: false },
}

let mapa
// Si el estilo base no carga, el mapa de reserva no trae glifos y los rótulos
// de texto no pueden pintarse.
let conRotulos = true
let sitios = { type: 'FeatureCollection', features: [] }
let inventario = []
const cargadas = new Set()
// Registro completo de subestaciones y renovables, para las fichas emergentes.
const detalleRed = new Map()
const detalleRenovables = new Map()
const detalleCentrales = new Map()
let metadatosCentrales = null
let metadatosGeneracion = null

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

// Un solo color para toda la capa, no uno por tecnología. La capa de centrales
// ya colorea por tecnología, y su oro solar y el oro de aquí eran el mismo punto
// amarillo: con las dos encendidas no había manera de saber cuál era cuál. Estos
// veintitantos activos están en el mapa por su vínculo contractual con un centro
// de datos, no por su tecnología —que la ficha sigue diciendo—, así que el color
// que les corresponde es el de «activo vinculado», uno solo. El violeta está
// validado para convivir con los cinco de centrales sin confundirse con ninguno
// (ΔE 10,7 en protanopia y deuteranopia, sobre los dos fondos).
const COLOR_RENOVABLE_CLARO = '#a797f9'
const COLOR_RENOVABLE_OSCURO = '#9180d5'

const paletaFuente = () => (oscuro() ? COLOR_FUENTE_OSCURO : COLOR_FUENTE_CLARO)

const colorPorFuente = () => {
  const paleta = paletaFuente()
  return ['match', ['get', 'fuente'], ...Object.entries(paleta).flat(), paleta.otra]
}

// Radio proporcional a la raíz de la potencia: el área representa los MW, igual
// que en la capa de emplazamientos.
const radioPorPotencia = [
  'interpolate',
  ['linear'],
  ['zoom'],
  4,
  ['case', ['==', ['get', 'potencia_mw'], null], 1.4, ['*', 0.26, ['sqrt', ['max', ['get', 'potencia_mw'], 1]]]],
  11,
  ['case', ['==', ['get', 'potencia_mw'], null], 3.6, ['*', 0.95, ['sqrt', ['max', ['get', 'potencia_mw'], 1]]]],
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
  // `mapa?` y no `mapa`: si el lienzo no ha podido crearse, el panel y la lista
  // siguen funcionando como buscador. Los filtros no dependen del mapa.
  for (const capa of ['sitios-circulo', 'sitios-borde', 'sitios-etiqueta']) {
    if (mapa?.getLayer(capa)) mapa.setFilter(capa, filtro)
  }
  for (const capa of ['sitios-circulo', 'sitios-borde']) {
    if (mapa?.getLayer(capa)) mapa.setPaintProperty(capa, 'circle-radius', radioPorMetrica(estado.metrica))
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

// Al cambiar de estilo, MapLibre a veces conserva nuestras fuentes y capas (si
// consigue diferenciar los dos estilos) y a veces las borra. Volver a añadirlas
// sin más lanza «there is already a source with ID», así que se quitan primero.
function quitarSiEsta(capas, fuentes = []) {
  for (const c of capas) if (mapa.getLayer(c)) mapa.removeLayer(c)
  for (const f of fuentes) if (mapa.getSource(f)) mapa.removeSource(f)
}

// Los manejadores de eventos sobreviven a un cambio de estilo, que sí borra las
// capas: se registran una sola vez por capa para no abrir la ficha dos veces.
const conEventos = new Set()

function conManejadores(capa, abrir) {
  if (conEventos.has(capa)) return
  conEventos.add(capa)
  mapa.on('click', capa, (e) => abrir(e.features[0].properties.id))
  mapa.on('mouseenter', capa, () => (mapa.getCanvas().style.cursor = 'pointer'))
  mapa.on('mouseleave', capa, () => (mapa.getCanvas().style.cursor = ''))
}

async function cargarCapa(nombre) {
  if (cargadas.has(nombre)) return
  cargadas.add(nombre)

  if (nombre === 'lineas') {
    const datos = await (await fetch('/datos/lineas.geojson')).json()
    quitarSiEsta(['lineas-trazado'], ['lineas'])
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
    quitarSiEsta(['subestaciones-simbolo'], ['subestaciones'])
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
          // Sin glifos, pedir texto tumbaría la capa entera y con ella los iconos.
          ...(conRotulos
            ? {
                'text-field': ['get', 'nombre'],
                'text-size': 10,
                'text-offset': [0, 1.1],
                'text-anchor': 'top',
                'text-optional': true,
              }
            : {}),
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
    conManejadores('subestaciones-simbolo', abrirSubestacion)
  }

  if (nombre === 'centrales') {
    const datos = await (await fetch('/datos/centrales.geojson')).json()
    for (const f of datos.features) detalleCentrales.set(f.properties.id, f.properties)
    metadatosCentrales = datos.metadata ?? null
    metadatosGeneracion = datos.generacion ?? null
    quitarSiEsta(['centrales-circulo'], ['centrales'])
    mapa.addSource('centrales', { type: 'geojson', data: datos })
    mapa.addLayer(
      {
        id: 'centrales-circulo',
        type: 'circle',
        source: 'centrales',
        paint: {
          'circle-color': colorPorFuente(),
          'circle-radius': radioPorPotencia,
          // Dos cosas a la vez. Las centrales sin potencia declarada no se pueden
          // dibujar a escala, y en vez de darles un tamaño inventado se pintan
          // casi huecas: el punto dice «aquí hay una central» y el hueco dice «no
          // consta cuánta potencia». Y como son más de cinco mil puntos sobre un
          // mapa que trata de otra cosa, a escala nacional toda la capa queda
          // recesiva para que los centros de datos sigan leyéndose encima; gana
          // cuerpo al acercarse.
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4,
            ['case', ['==', ['get', 'potencia_mw'], null], 0.1, 0.4],
            8,
            ['case', ['==', ['get', 'potencia_mw'], null], 0.14, 0.62],
          ],
          'circle-stroke-width': ['case', ['==', ['get', 'potencia_mw'], null], 0.9, 0.5],
          'circle-stroke-color': colorPorFuente(),
          'circle-stroke-opacity': 0.85,
        },
      },
      'sitios-borde',
    )
    conManejadores('centrales-circulo', abrirCentral)
  }

  if (nombre === 'renovables') {
    const [datos, completo] = await Promise.all([
      fetch('/datos/renovables.geojson').then((r) => r.json()),
      fetch('/datos/renovables.json').then((r) => r.json()),
    ])
    for (const a of completo) detalleRenovables.set(a.id, a)
    quitarSiEsta(['renovables-circulo'], ['renovables'])
    mapa.addSource('renovables', { type: 'geojson', data: datos })
    mapa.addLayer({
      id: 'renovables-circulo',
      type: 'circle',
      source: 'renovables',
      paint: {
        'circle-color': oscuro() ? COLOR_RENOVABLE_OSCURO : COLOR_RENOVABLE_CLARO,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 2.5, 11, 7],
        // Macizo, y atenuado cuando la coordenada es derivada. El hueco está
        // reservado en todo el sitio para «esta magnitud no se publica».
        'circle-opacity': ['case', ['==', ['get', 'coordenada_derivada'], true], 0.45, 0.7],
        'circle-stroke-width': 0.8,
        'circle-stroke-color': oscuro() ? '#15171a' : '#fbfaf8',
      },
    })
    conManejadores('renovables-circulo', abrirRenovable)
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

function abrirCentral(id) {
  const c = detalleCentrales.get(id)
  if (!c) return

  // Tres estados distintos, y se distinguen: la cifra, «lo dice y no se pudo
  // leer» y «no lo dice». Colapsarlos en un guion perdería la diferencia entre
  // un hueco de la fuente y un fallo de lectura nuestro.
  const potencia = c.potencia_mw != null
    ? mw(c.potencia_mw)
    : c.potencia_bruta
      ? `<span class="silencio">declarada como «${c.potencia_bruta}», sin cifra legible</span>`
      : '<span class="silencio">no consta</span>'

  const generacion = c.generacion_mwh != null
    ? `
      <dt>Generación (${metadatosGeneracion?.dia ?? 'día registrado'})</dt>
      <dd>${c.generacion_mwh.toLocaleString('es-ES')} MWh${
        c.generacion_punta_mw != null ? ` · punta ${mw(c.generacion_punta_mw)}` : ''
      }</dd>
      ${c.bombeo_mwh ? `<dt>Consumo en bombeo</dt><dd>${c.bombeo_mwh.toLocaleString('es-ES')} MWh</dd>` : ''}
      ${c.unidades ? `<dt>Unidades ENTSO-E</dt><dd>${c.unidades}</dd>` : ''}`
    : ''

  const [tipo, numero] = String(c.id).split('/')
  panelHtml(`
    <span class="etiqueta">${ETIQUETA_FUENTE[c.fuente] ?? 'Central eléctrica'}</span>
    <h2>${c.nombre ?? 'Central sin nombre en OpenStreetMap'}</h2>
    <dl class="detalle">
      <dt>Potencia instalada</dt><dd>${potencia}</dd>
      ${generacion}
      ${c.fuente_osm ? `<dt>Fuente primaria</dt><dd>${c.fuente_osm}</dd>` : ''}
      ${c.metodo ? `<dt>Tecnología</dt><dd>${c.metodo}</dd>` : ''}
      <dt>Operador</dt><dd>${c.operador ?? '—'}</dd>
      ${c.inicio ? `<dt>En servicio desde</dt><dd>${c.inicio}</dd>` : ''}
    </dl>
    <p class="pequeno silencio">
      Potencia instalada y generación son magnitudes distintas y no se suman ni se
      convierten una en otra.
      ${
        c.generacion_mwh != null
          ? ''
          : metadatosGeneracion
            ? 'Esta central no aparece en la instantánea de ENTSO-E, que solo publica generación por unidad a partir de 100 MW.'
            : 'No hay ninguna instantánea de generación cargada en este momento.'
      }
    </p>
    <p class="pequeno silencio">
      Inventario de <a href="https://www.openstreetmap.org/${tipo}/${numero}" rel="noreferrer">OpenStreetMap</a>${
        metadatosCentrales?.descargado ? `, descargado el ${metadatosCentrales.descargado}` : ''
      }. No es el registro oficial de instalaciones de producción.
    </p>
  `)
}

function alternarCapa(nombre, activa) {
  estado.capas[nombre] = activa
  const capas = {
    lineas: ['lineas-trazado'],
    subestaciones: ['subestaciones-simbolo'],
    renovables: ['renovables-circulo'],
    centrales: ['centrales-circulo'],
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

// --- arranque tolerante a fallos ---------------------------------------------

// El estilo base vive en un CDN ajeno. Cuando no se puede cargar, por un
// bloqueador de contenidos o un filtro de red, el mapa se queda negro y, antes
// de este cambio, se llevaba consigo el resto de la vista: el `load` no llegaba
// nunca, así que ni los datos ni los filtros se montaban. Ahora se cae a un
// estilo servido desde este mismo dominio.
const ESTILO_RESERVA = () => ({
  version: 8,
  sources: {
    contorno: {
      type: 'geojson',
      data: '/datos/contorno.geojson',
      attribution: 'contorno: Natural Earth (dominio público)',
    },
  },
  layers: [
    { id: 'mar', type: 'background', paint: { 'background-color': oscuro() ? '#0f1215' : '#e9edf0' } },
    { id: 'tierra', type: 'fill', source: 'contorno', paint: { 'fill-color': oscuro() ? '#1b1f24' : '#fbfaf8' } },
    {
      id: 'costa',
      type: 'line',
      source: 'contorno',
      paint: { 'line-color': oscuro() ? '#3d444c' : '#c7c2b7', 'line-width': 0.9 },
    },
  ],
})

/** Un lienzo WebGL de prueba, liberado en el acto para no robarle el contexto al mapa. */
function soportaWebgl() {
  try {
    const lienzo = document.createElement('canvas')
    const ctx = lienzo.getContext('webgl2') ?? lienzo.getContext('webgl')
    if (!ctx) return false
    ctx.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/** Mensaje sobre el mapa: un fallo silencioso es indistinguible de un mapa vacío. */
function avisarEnMapa({ titulo, texto, accion }) {
  const zona = document.getElementById('mapa')?.parentElement
  if (!zona) return
  zona.querySelector('.aviso-mapa')?.remove()
  const caja = document.createElement('div')
  caja.className = 'aviso-mapa'
  caja.innerHTML = `<strong>${titulo}</strong><p>${texto}</p>`
  if (accion) {
    const boton = document.createElement('button')
    boton.type = 'button'
    boton.textContent = accion.texto
    boton.addEventListener('click', () => {
      caja.remove()
      accion.hacer()
    })
    caja.append(boton)
  }
  const cerrar = document.createElement('button')
  cerrar.type = 'button'
  cerrar.className = 'aviso-cerrar'
  cerrar.setAttribute('aria-label', 'Cerrar el aviso')
  cerrar.textContent = '\u00d7'
  cerrar.addEventListener('click', () => caja.remove())
  caja.append(cerrar)
  zona.append(caja)
}

/**
 * Espera a que el estilo cargue de verdad. Devuelve false si falla o si tarda
 * más de lo razonable: cuando el estilo no llega no se emite ningún evento de
 * carga, y esperarlo sin límite deja la vista a medio montar.
 *
 * Se consulta `isStyleLoaded()` en vez de esperar un evento: `load` solo se
 * emite en la primera carga, así que en un segundo intento no llegaría nunca,
 * y `styledata` se adelanta a que el estilo esté listo de verdad.
 */
function esperarEstilo(limite = 9000) {
  return new Promise((resolver) => {
    let resuelto = false
    const acabar = (bien) => {
      if (resuelto) return
      resuelto = true
      clearTimeout(reloj)
      clearInterval(sondeo)
      mapa.off('error', conError)
      resolver(bien)
    }
    const conError = (e) => {
      // Un sprite o una fuente que falta no impiden usar el mapa; el estilo, sí.
      if (String(e?.error?.url ?? e?.error?.message ?? '').includes('style.json')) acabar(false)
    }
    const sondeo = setInterval(() => {
      if (mapa.isStyleLoaded()) acabar(true)
    }, 150)
    const reloj = setTimeout(() => acabar(false), limite)
    mapa.on('error', conError)
  })
}

/**
 * Punto de entrada. Cualquier fallo se cuenta en pantalla: el origen de este
 * envoltorio es un mapa que se quedaba en blanco sin decir por qué.
 */
export async function iniciarMapa(opciones = {}) {
  try {
    await montarVista(opciones)
  } catch (e) {
    console.error('mapa:', e)
    avisarEnMapa({
      titulo: 'El mapa no ha podido montarse',
      texto: `Ha fallado la carga de la vista cartográfica (${String(e?.message ?? e).slice(0, 140)}). El registro completo sigue disponible en <a href="/proyectos">la lista de proyectos</a>.`,
    })
  }
}

async function montarVista(opciones = {}) {
  leerDeUrl()
  if (opciones.ccaa) estado.ccaa = opciones.ccaa
  if (opciones.operador) estado.operador = opciones.operador

  // Los datos se piden primero: son de este dominio y no dependen del mapa.
  const [geo, lista] = await Promise.all([
    fetch('/datos/sitios.geojson').then((r) => r.json()),
    fetch('/datos/sitios-lista.json').then((r) => r.json()),
  ])
  sitios = geo
  inventario = lista
  for (const s of lista) if (s.alias?.length) indiceAlias.set(s.id, s.alias.join(' '))

  if (!soportaWebgl()) {
    avisarEnMapa({
      titulo: 'Este navegador no puede dibujar el mapa',
      texto:
        'El mapa necesita WebGL, desactivado o no disponible aquí. El buscador y los filtros del panel siguen funcionando; el registro completo está en <a href="/proyectos">la lista de proyectos</a>.',
    })
    conectarControles()
    aplicar()
    return
  }

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
      customAttribution: 'red de transporte y centrales de generación derivadas de OpenStreetMap (ODbL)',
    }),
    'bottom-right',
  )
  mapa.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left')

  if (await esperarEstilo()) {
    conRotulos = true
    castellanizarRotulos()
  } else {
    conRotulos = false
    mapa.setStyle(ESTILO_RESERVA())
    await new Promise((r) => mapa.once('styledata', r))
    avisarEnMapa({
      titulo: 'Sin mapa base',
      texto:
        'No carga la cartografía de fondo (CARTO), casi siempre por un bloqueador de contenidos o un filtro de red. Los datos se dibujan igual, sobre un contorno de costa mínimo.',
      accion: { texto: 'Reintentar', hacer: reintentarMapaBase },
    })
  }

  montarCapas()
  conectarControles()
  for (const [nombre, activa] of Object.entries(estado.capas)) if (activa) alternarCapa(nombre, true)
  aplicar()
}

/** Segundo intento con el estilo remoto, a petición de quien mira. */
async function reintentarMapaBase() {
  try {
    await intentarMapaBase()
  } catch (e) {
    console.error('mapa (reintento):', e)
    avisarEnMapa({
      titulo: 'El reintento ha fallado',
      texto: `No se ha podido rehacer la vista (${String(e?.message ?? e).slice(0, 140)}). Recargar la página debería dejarla como estaba.`,
    })
  }
}

async function intentarMapaBase() {
  mapa.setStyle(ESTILO())
  cargadas.clear()
  if (await esperarEstilo()) {
    conRotulos = true
    castellanizarRotulos()
  } else {
    conRotulos = false
    mapa.setStyle(ESTILO_RESERVA())
    await new Promise((r) => mapa.once('styledata', r))
    avisarEnMapa({
      titulo: 'Sigue sin cargar el mapa base',
      texto: 'El fondo cartográfico continúa inaccesible desde esta red. Los datos no se ven afectados.',
    })
  }
  montarCapas()
  for (const [nombre, activa] of Object.entries(estado.capas)) if (activa) alternarCapa(nombre, true)
  aplicar()
}

/** Fuentes y capas propias. Se vuelve a llamar tras cada cambio de estilo, que las borra. */
function montarCapas() {
  if (!mapa.hasImage('cuadro-subestacion')) mapa.addImage('cuadro-subestacion', iconoSubestacion())
  quitarSiEsta(['sitios-etiqueta', 'sitios-circulo', 'sitios-borde'], ['sitios'])
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
  // Los rótulos necesitan los glifos del estilo base: sin él no se pintan.
  if (conRotulos) {
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
  }

  conManejadores('sitios-circulo', abrirFicha)
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
  if (estado.capas.centrales) {
    for (const [clave, etiqueta] of Object.entries(ETIQUETA_FUENTE)) {
      piezas.push(
        `<span class="leyenda-item"><span class="punto-central" style="background:${paletaFuente()[clave]}"></span>${etiqueta}</span>`,
      )
    }
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
    // El carril del deslizador se pinta con un degradado hasta --relleno: es la
    // única forma de teñir la parte recorrida en todos los navegadores.
    const pintarCarril = () => {
      const tope = Number(minimo.max) || 1
      minimo.style.setProperty('--relleno', `${(Number(minimo.value) / tope) * 100}%`)
      $('#valor-minimo').textContent = estado.minimo ? `${estado.minimo} MW` : 'sin mínimo'
    }
    minimo.value = String(estado.minimo)
    pintarCarril()
    minimo.addEventListener('input', () => {
      estado.minimo = Number(minimo.value)
      pintarCarril()
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
    // Sin lienzo no hay dónde dibujarlas: la casilla se desactiva en vez de fallar.
    if (!mapa) {
      el.checked = false
      el.disabled = true
      el.closest('.casilla')?.classList.add('inerte')
      return
    }
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
      if (minimo) {
        minimo.value = '0'
        minimo.style.setProperty('--relleno', '0%')
      }
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
