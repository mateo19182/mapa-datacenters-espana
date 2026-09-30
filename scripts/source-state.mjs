// Keep the reviewed fingerprint separate from observations awaiting review.
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
        pendiente: {
          hash: lectura.hash,
          longitud: lectura.longitud,
          detectado: previa.pendiente?.detectado ?? hoy,
          visto: hoy,
        },
      },
      resultado: 'cambiada',
    }
  }

  return {
    estado: { hash: previa.hash, longitud: lectura.longitud, visto: hoy },
    resultado: 'igual',
  }
}

export function aceptarPendiente(previa, hoy) {
  if (!previa?.pendiente?.hash) throw new Error('No hay cambio pendiente para aceptar')
  return {
    hash: previa.pendiente.hash,
    longitud: previa.pendiente.longitud,
    visto: hoy,
  }
}
