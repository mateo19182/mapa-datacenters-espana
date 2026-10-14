export const MODALIDAD_COMPUTO_ETIQUETA = {
  instalado: 'Instalación física documentada',
  adquirido: 'Adquirido; servicio sin confirmar',
  previsto: 'Despliegue previsto',
  acceso: 'Acceso o capacidad contratada',
  sin_confirmar: 'Ubicación o despliegue sin confirmar',
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
