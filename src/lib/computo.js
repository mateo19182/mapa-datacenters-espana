export const MODALIDAD_COMPUTO_ETIQUETA = {
  instalado: 'Instalado',
  adquirido: 'Adquirido; instalación sin confirmar',
  previsto: 'Previsto',
  acceso: 'Acceso',
  sin_confirmar: 'Ubicación o instalación sin confirmar',
}

export const MODALIDAD_COMPUTO_DESCRIPCION = {
  instalado: 'Instalación física documentada en este emplazamiento.',
  adquirido: 'Compra o adjudicación documentada, sin recepción o puesta en servicio confirmada.',
  previsto: 'Despliegue anunciado, pendiente de instalación o servicio.',
  acceso: 'Servicio ofertado o capacidad contratada; no acredita inventario físico instalado.',
  sin_confirmar: 'Falta confirmar el emplazamiento físico o la instalación del equipo.',
}

export const AMBITO_COMPUTO_ETIQUETA = {
  sistema: 'Sistema completo',
  particion: 'Parte del sistema',
}

// Una fila por afirmación. No se agregan particiones, modelos ni precisiones,
// ni se suman cifras que pueden describir el mismo equipo.
export function inventarioComputo(sitios) {
  return sitios.flatMap((sitio) => (sitio.computo ?? []).map((computo, i) => ({
    ...computo,
    id: `${sitio.id}-computo-${i}`,
    modalidad: computo.modalidad ?? 'sin_confirmar',
    proyecto: sitio.id,
    nombre_proyecto: sitio.nombre,
    operador_centro: sitio.operador,
    operador_hardware: computo.operador_computo ?? sitio.operador,
    municipio: sitio.ubicacion.municipio,
    ccaa: sitio.ubicacion.ccaa,
    ultima_verificacion: sitio.ultima_verificacion,
    fuentes: computo.fuentes.map((id) => sitio.fuentes.find((f) => f.id === id)).filter(Boolean),
  })))
}
