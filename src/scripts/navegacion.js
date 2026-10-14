// Abre el contenido de una referencia antes de desplazar la página a ella.
export function revelarAncla() {
  let id
  try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
  if (!id) return
  const destino = document.getElementById(id)
  if (!destino) return
  if (destino.matches('details')) destino.open = true
  for (let ancestro = destino.parentElement?.closest('details'); ancestro; ancestro = ancestro.parentElement?.closest('details')) {
    ancestro.open = true
  }
  requestAnimationFrame(() => destino.scrollIntoView({ block: 'start' }))
}

export function iniciarNavegacion() {
  const boton = document.getElementById('abrir-menu')
  const menu = document.getElementById('menu')
  const cabecera = document.querySelector('.cabecera')
  document.body.classList.add('con-menu-plegable')
  const cerrarMenu = () => {
    menu?.classList.remove('abierto')
    boton?.setAttribute('aria-expanded', 'false')
    menu?.querySelectorAll('details[open]').forEach((grupo) => { grupo.open = false })
  }
  boton?.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto')
    boton.setAttribute('aria-expanded', String(abierto))
  })
  menu?.querySelectorAll('details').forEach((grupo) => grupo.addEventListener('toggle', () => {
    if (!grupo.open) return
    menu.querySelectorAll('details[open]').forEach((otro) => { if (otro !== grupo) otro.open = false })
  }))
  document.addEventListener('click', (evento) => {
    if (!cabecera?.contains(evento.target)) cerrarMenu()
    const enlace = evento.target.closest?.('a[href]')
    if (!enlace || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey || evento.button) return
    const destino = new URL(enlace.href, location.href)
    if (destino.origin === location.origin && destino.pathname === location.pathname && destino.hash) {
      // También cubre el clic repetido sobre la referencia actual.
      requestAnimationFrame(revelarAncla)
    }
  })
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return
    const foco = menu?.contains(document.activeElement)
      ? boton?.getClientRects().length ? boton : document.activeElement.closest('.nav-grupo')?.querySelector('summary')
      : null
    cerrarMenu()
    foco?.focus()
  })
  const medirCabecera = () => document.documentElement.style.setProperty('--alto-cabecera', `${cabecera?.offsetHeight ?? 50}px`)
  medirCabecera()
  if ('ResizeObserver' in window && cabecera) new ResizeObserver(medirCabecera).observe(cabecera)
  window.addEventListener('hashchange', revelarAncla)
  revelarAncla()
  // La impresión incluye los documentos y citas completos.
  let cerrados = []
  window.addEventListener('beforeprint', () => {
    cerrados = [...document.querySelectorAll('main details:not([open])')]
    cerrados.forEach((detalle) => { detalle.open = true })
  })
  window.addEventListener('afterprint', () => cerrados.forEach((detalle) => { detalle.open = false }))
}
