// Keep the reviewed fingerprint separate from observations awaiting review.
// Only an explicit missing-resource response establishes a broken URL. A
// transport failure or server error cannot tell us whether the page exists.
export function claseFallo({ codigo, mensaje } = {}) {
  if (mensaje?.startsWith('Página de verificación automática')) return 'bloqueada'
  const status = codigo ?? Number(/^HTTP (\d{3})$/.exec(mensaje ?? '')?.[1])
  if ([404, 410].includes(status)) return 'rota'
  if ([401, 403, 405, 406, 429, 451].includes(status)) return 'bloqueada'
  return 'error'
}

export function registrarLectura(previa, lectura, hoy) {
  if (lectura.estado !== 'ok') throw new Error('registrarLectura expects a successful read')

  if (!previa?.hash) {
    return { estado: { hash: lectura.hash, longitud: lectura.longitud, visto: hoy }, resultado: 'nueva' }
  }

  if (previa.hash !== lectura.hash) {
    return {
      estado: {
        hash: previa.hash,
        longitud: previa.longitud,
        visto: previa.visto,
        ...(previa.aceptado ? { aceptado: previa.aceptado } : {}),
        pendiente: {
          hash: lectura.hash,
          longitud: lectura.longitud,
          detectado: previa.pendiente?.hash === lectura.hash ? previa.pendiente.detectado : hoy,
          visto: hoy,
        },
      },
      resultado: 'cambiada',
    }
  }

  return {
    estado: { hash: previa.hash, longitud: lectura.longitud, visto: hoy, ...(previa.aceptado ? { aceptado: previa.aceptado } : {}) },
    resultado: 'igual',
  }
}

export function aceptarPendiente(previa, hoy) {
  if (!previa?.pendiente?.hash) throw new Error('No hay cambio pendiente para aceptar')
  return {
    hash: previa.pendiente.hash,
    longitud: previa.pendiente.longitud,
    visto: previa.pendiente.visto ?? previa.pendiente.detectado ?? previa.visto,
    aceptado: hoy,
    ...(previa.clase ? { clase: previa.clase, motivo: previa.motivo, ultimo_fallo: previa.ultimo_fallo } : {}),
  }
}
