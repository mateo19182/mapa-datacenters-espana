// El estado pertenece a cada cifra, no al estado general del emplazamiento.
export const ETAPAS_CAPACIDAD = {
  operativa: 'Operativa',
  construccion: 'En construcción',
  prevista: 'Prevista',
  sin_desglose: 'Sin etapa desglosada',
  historica: 'Paralizada o cancelada',
}

export const etapaCapacidad = (estado) => {
  if (estado === 'operativo') return 'operativa'
  if (estado === 'en_construccion') return 'construccion'
  if (['anunciado', 'en_tramitacion', 'permisos_concedidos'].includes(estado)) return 'prevista'
  if (['paralizado', 'cancelado'].includes(estado)) return 'historica'
  // Una cifra de un campus parcialmente abierto no revela cuántos MW funcionan.
  return 'sin_desglose'
}

export const campoCapacidad = (metrica, etapa = 'operativa') => `${metrica}_${etapa}`

export function propiedadesCapacidad(sitio) {
  const grupos = sitio.potencia_por_etapa ?? { operativa: sitio.resumen_potencia }
  return Object.fromEntries(Object.keys(ETAPAS_CAPACIDAD).flatMap((etapa) =>
    [['mw_it', 'it'], ['mw_conexion', 'conexion_red'], ['mw_sin_tipo', 'no_especificado']]
      .map(([campo, tipo]) => [campoCapacidad(campo, etapa), grupos[etapa]?.[tipo]?.valor_mw ?? null]),
  ))
}
