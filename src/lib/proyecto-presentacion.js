// Resúmenes editoriales. Las fechas son las de los hechos descritos, nunca la
// consulta de la ficha ni la publicación de una fuente que relate otro día.
const PRESENTACIONES = {
  'upf-barcelona-correfoc': {
    resumen: 'Correfoc está en servicio desde julio de 2026. La UPF publica 57 L40S y 67 nodos; los 24 nodos de la ficha RES son una partición y no se suman al total.',
    fuentes: ['src-operacion', 'src-hardware', 'src-res'],
    incluirFases: false,
    cronologia: [
      { fecha: '2026-07-01', titulo: 'Entrada en operación de Correfoc', detalle: 'Fecha de servicio explícita en el anuncio de la UPF, publicado el 9 de julio.', fuentes: ['src-operacion'] },
    ],
  },
  'uib-palma-talaia': {
    resumen: 'TalaIA publica 52 nodos CPU y acceso GPGPU en el ParcBit de Palma. La instalación terminó en el primer semestre de 2026. No se publican modelo ni cantidad de GPU.',
    fuentes: ['src-uib', 'src-res', 'src-bsai', 'src-acceso'],
    incluirFases: false,
    cronologia: [
      { fecha: '2026', titulo: 'Instalación completada en el primer semestre', detalle: 'La UIB confirma ese periodo en su noticia del 16 de julio. No da un día exacto de puesta en servicio; la guía del operador documenta acceso mediante Slurm.', fuentes: ['src-uib', 'src-acceso'] },
    ],
  },
  'nxn-madrid-juan-carlos-i': {
    resumen: 'NxN prepara un centro junto al Parque Juan Carlos I. La apertura sigue sin acreditar. Su nota discrepa entre 7,5 y 15 MW; las dos acometidas redundantes de 7,5 MW no se suman.',
    fuentes: ['src-nota', 'src-web'],
    incluirFases: false,
    cronologia: [
      { fecha: '2026-04-23', titulo: 'Anuncio del activo de Madrid y su modernización', detalle: 'NxN anuncia un activo existente, 8.500 m² de superficie total y 20 millones de euros de modernización, sin publicar dirección exacta.', fuentes: ['src-nota'] },
      { fecha: '2026-09', titulo: 'Apertura prevista en la nota de abril', detalle: 'La fecha ha pasado sin confirmación de apertura. La web consultada en octubre mantiene una próxima inauguración en 2026.', prevista: true, fuentes: ['src-nota', 'src-web'] },
    ],
  },
  'scbi-uma-malaga-picasso': {
    resumen: 'Picasso publica 32 A100 y 16 B200 entre sus recursos disponibles. La UMA anunció la compra de las B200 en julio de 2026; el inventario técnico no fecha su puesta en producción.',
    fuentes: ['src-hardware-20261014', 'src-ampliacion-20260710'],
    cronologia: [
      { fecha: '2026-07-10', titulo: 'Publicación de la adquisición de 16 B200', detalle: 'La UMA describe dos nuevos nodos adquiridos con financiación FEDER. No publica fecha de puesta en producción.', fuentes: ['src-ampliacion-20260710'] },
    ],
  },
  'cesga-santiago-a-sionlla': {
    resumen: 'A Sionlla albergará FinisTerrae IV y nueva computación cuántica. Están anunciados Radiance de 54 cúbits y Spark de 5. Falta confirmar servicio y traslado del inventario anterior a este edificio.',
    fuentes: ['src-adjudicacion-ft4', 'src-presentacion-en-20260612', 'src-contacto-sede'],
    cronologia: [
      { fecha: '2026-03-03', titulo: 'Adjudicación de FinisTerrae IV y almacenamiento', detalle: 'La Xunta anuncia la adjudicación a Fsas Technologies. El contrato no acredita recepción ni puesta en servicio; es distinto de la futura factoría 1HealthAI.', fuentes: ['src-adjudicacion-ft4'] },
      { fecha: '2026-06-12', titulo: 'Presentación programada de Radiance y Spark', detalle: 'El anuncio del CESGA convoca el acto para esa fecha. Describe equipos de 54 y 5 cúbits, sin acreditar servicio científico abierto ni instalación definitiva.', prevista: true, fuentes: ['src-presentacion-20260612', 'src-presentacion-en-20260612'] },
    ],
  },
  'nabiax-alcala-de-henares-adc': {
    resumen: 'Alcalá tiene 22,3 MW IT en servicio. ADC3 celebró su primera piedra en septiembre de 2026. Los 80 MW del nuevo edificio no están tipificados; los 100 MW IT son el objetivo del campus.',
    fuentes: ['src-1', 'src-primera-piedra-20260918', 'src-nota-cm-20260918'],
    cronologia: [
      { fecha: '2026-09-18', titulo: 'Acto de primera piedra de ADC3', detalle: 'La agenda y la nota de la Comunidad de Madrid confirman el acto en el campus. Es un hito de lanzamiento de obra; no certifica avance físico, entrega de potencia ni operación del edificio.', fuentes: ['src-primera-piedra-20260918', 'src-nota-cm-20260918'] },
    ],
  },
  'cluster-tic-galicia-a-coruna-csa': {
    titulo: 'Cidade das TIC · CSA',
    resumen: 'El CPD del Clúster TIC Galicia ofrece recursos para IA y multimedia en A Coruña. L4 y A40 documentadas; la instalación de H200 sigue sin confirmar.',
    fuentes: ['src-servicios', 'src-dosier', 'src-catalogo'],
    aviso: 'Servicio orientado al desarrollo. El dosier no ofrece disponibilidad 24×7 ni en fines de semana.',
    avisoFuentes: ['src-dosier'],
    hardware: [
      { modelo: 'NVIDIA L4 · 24 GB', dato: '15 GPU en el dosier', matiz: 'El anuncio dice más de 15; inventarios sin conciliar.', fuentes: ['src-dosier', 'src-servicios'] },
      { modelo: 'NVIDIA A40 · 48 GB', dato: 'Instaladas; total de GPU sin publicar', matiz: 'El catálogo discrepa: 2 o 3 servidores.', fuentes: ['src-catalogo'] },
      { modelo: 'NVIDIA H200 · 141 GB', dato: 'Acceso anunciado', matiz: 'Instalación física sin confirmar.', fuentes: ['src-servicios'] },
    ],
    cronologia: [
      { fecha: '2026-06-05', titulo: 'Lanzamiento del servicio del CPD', detalle: 'El Clúster anuncia máquinas virtuales y acceso a recursos de IA y multimedia en el CSA.', fuentes: ['src-servicios'] },
    ],
  },
  'qts-calatorao-rhodes': {
    titulo: 'QTS · Proyecto Rhodes, Calatorao',
    resumen: 'Campus de QTS promovido por Calanza Inmuebles. Tiene aprobación urbanística definitiva parcial; la ejecución de los edificios aún requiere evaluación ambiental, proyectos ejecutivos y un acuerdo posterior.',
    fuentes: ['src-boa-20260930'],
    aviso: 'No consta inicio de obras del campus. Los 650 MW publicados corresponden a la subestación, no a carga TI.',
    avisoFuentes: ['src-1', 'src-boa-20260930'],
    cronologia: [
      { fecha: '2024-10-14', titulo: 'Declaración de interés autonómico', detalle: 'El Gobierno de Aragón declara el proyecto inversión de interés autonómico con interés general de Aragón.', fuentes: ['src-8'] },
      { fecha: '2025-06-27', titulo: 'Redelimitación del ámbito', detalle: 'Acuerdo del Gobierno de Aragón sobre el ámbito del PIGA.', fuentes: ['src-2'] },
      { fecha: '2025-08-19', titulo: 'Aprobación inicial del PIGA', detalle: 'Orden FOM/1039/2025. No es una autorización de ejecución del campus.', fuentes: ['src-1'] },
      { fecha: '2026-07-23', titulo: 'Informe ambiental estratégico', detalle: 'INAGA resuelve no someter el PIGA a evaluación ambiental estratégica ordinaria e informa la urbanización.', fuentes: ['src-5'] },
      { fecha: '2026-09-28', titulo: 'Aprobación definitiva parcial', detalle: 'Abarca urbanismo, reparcelación, urbanización y conexiones exteriores. Los restantes proyectos quedan aprobados con carácter básico y sujetos a condiciones para su ejecución.', fuentes: ['src-boa-20260930'] },
    ],
  },
  'solaria-datasection-puertollano': {
    titulo: 'Solaria · Puertollano, La Nava II',
    resumen: 'Solaria tramita una nueva propuesta de 40 MW y 150 millones de euros en La Nava II. El operador no está publicado. El anterior acuerdo con Datasection quedó paralizado.',
    fuentes: ['src-ayto-20260924', 'src-ser'],
    aviso: 'Los 40 MW no tienen tipo publicado. La conformidad municipal no acredita autorización ambiental ni comienzo de obras.',
    avisoFuentes: ['src-ayto-20260924'],
    cronologia: [
      { fecha: '2024-09-17', titulo: 'Presentación del acuerdo con Datasection', detalle: 'Solaria presenta el acuerdo de 2024, con hasta 200 MW de suministro previsto. Es el proyecto anterior.', fuentes: ['src-solaria'] },
      { fecha: '2026-09-21', titulo: 'Anuncio de una nueva propuesta', detalle: 'El Ayuntamiento anuncia el proyecto de Solaria, una inversión de 150 millones de euros y un posible inicio de actividad a finales de 2027.', fuentes: ['src-ayto-20260921'] },
      { fecha: '2026-09-24', titulo: 'Conformidad del Pleno municipal', detalle: 'El Pleno respalda la propuesta de 40 MW en La Nava II. No equivale a una licencia de obras ni a una autorización ambiental integrada.', fuentes: ['src-ayto-20260924'] },
    ],
  },
  'aws-zaragoza-la-cartuja-car': {
    titulo: 'AWS · Zaragoza La Cartuja, CAR',
    resumen: 'La Cartuja tiene urbanización e infraestructuras hidráulicas aprobadas. La documentación de reparcelación y fibra vuelve a información pública. No se acredita aprobación definitiva de la edificación ni inicio de obras.',
    fuentes: ['src-1', 'src-2', 'src-boa-20261008017', 'src-boa-20261008021'],
    cronologia: [
      { fecha: '2025-08-22', titulo: 'Aprobación de la urbanización', detalle: 'Aprobación definitiva del proyecto ejecutivo de urbanización pública y privada del ámbito.', fuentes: ['src-2'] },
      { fecha: '2025-11-12', titulo: 'Aprobación de las infraestructuras de agua', detalle: 'El trazado eléctrico de 132 kV queda fuera de esta aprobación por estar incompleto.', fuentes: ['src-2'] },
      { fecha: '2026-10-05', titulo: 'Nueva aprobación inicial de reparcelación y fibra', detalle: 'Orden VFL/1438/2026 sobre Acampo del Marqués y las rutas de fibra 8 y 9 con El Burgo de Ebro.', fuentes: ['src-boa-20261008017'] },
      { fecha: '2026-10-08', titulo: 'Publicación de la información pública', detalle: 'El anuncio abre un mes de información y participación pública desde el día siguiente. No acredita autorización de los edificios ni comienzo de obras.', fuentes: ['src-boa-20261008021'] },
    ],
  },
  'aws-el-burgo-de-ebro-bde': {
    titulo: 'AWS · El Burgo de Ebro, BDE',
    resumen: 'AWS tiene aprobados el proyecto de edificación y urbanización interior de la fase 1 y su subestación. El nuevo trámite de fibra con La Cartuja no acredita inicio de obras.',
    fuentes: ['src-1', 'src-boa-20261008021'],
    aviso: 'La cifra térmica de los generadores de respaldo no es potencia TI ni potencia de conexión.',
    avisoFuentes: ['src-1'],
    cronologia: [
      { fecha: '2026-05-21', titulo: 'Resolución ambiental', detalle: 'INAGA resuelve la declaración de impacto ambiental y la autorización ambiental integrada.', fuentes: ['src-1'] },
      { fecha: '2026-06-10', titulo: 'Aprobación de la fase 1 y la subestación', detalle: 'El Gobierno de Aragón aprueba definitivamente la edificación y urbanización interior de la fase 1 y la subestación BDE1HV 220/20 kV.', fuentes: ['src-1'] },
      { fecha: '2026-10-05', titulo: 'Aprobación inicial de la interconexión por fibra', detalle: 'Orden VFL/1438/2026 para las rutas 8 y 9 entre El Burgo de Ebro y La Cartuja.', fuentes: ['src-boa-20261008017'] },
      { fecha: '2026-10-08', titulo: 'Publicación de la información pública', detalle: 'El anuncio abre un mes de información y participación pública desde el día siguiente. Es un trámite de fibra, sin inicio de obras del campus acreditado.', fuentes: ['src-boa-20261008021'] },
    ],
  },
}

// Algunas fichas conservan hitos administrativos en el campo histórico de fecha
// de fase. Se nombran por su acto; no se presentan como aperturas del CPD.
const FASES_QUE_SON_HITOS = new Map([
  ['meta-talavera-de-la-reina-torrehierro', new Set([
    'Declaración de Interés Regional (DIR)',
    'Aprobación inicial del PSI e información pública',
    'Declaración de Impacto Ambiental',
    'Aprobación definitiva del PSI',
    'Información pública en materia de expropiación forzosa',
    'Reparcelación urbanística definitiva',
  ])],
])
const FASES_SIN_FECHA_DE_APERTURA = new Map([
  ['nostrum-guadalajara-el-ruisenor', new Set(['Fase de diseño'])],
  ['ingenostrum-badajoz-nostrum-evergreen', new Set(['Ejecución por fases desde 2026'])],
])

const TITULOS_DE_PUBLICACION = new Map([
  ['meta-talavera-de-la-reina-torrehierro', new Map([
    ['Declaración de Impacto Ambiental', 'Publicación de la declaración de impacto ambiental'],
    ['Aprobación definitiva del PSI', 'Publicación de la aprobación definitiva del PSI'],
    ['Información pública en materia de expropiación forzosa', 'Publicación de la información pública de expropiación'],
  ])],
])

export function vinculosEnergiaProyecto(sitio, activos) {
  const emplazamiento = activos.filter((activo) => (activo.cpds_relacionados ?? []).includes(sitio.id))
  const operador = sitio.operador
    ? activos.filter((activo) => activo.contraparte_ppa === sitio.operador && !emplazamiento.includes(activo))
    : []
  return { emplazamiento, operador }
}

export function presentacionProyecto(sitio) {
  const editada = PRESENTACIONES[sitio.id] ?? {}
  const fuentes = new Set(sitio.fuentes.map((f) => f.id))
  const fases = (editada.incluirFases === false ? [] : sitio.fases ?? [])
    .filter((fase) => fase.fecha_puesta_en_servicio && fase.fuentes?.length && fase.fuentes.every((id) => fuentes.has(id)))
    // El calendario retirado sigue en las fases originales, sin anunciar una
    // apertura vigente. Los actos administrativos históricos se conservan.
    .filter((fase) => FASES_QUE_SON_HITOS.get(sitio.id)?.has(fase.nombre) || !['cancelado', 'paralizado'].includes(fase.estado))
    .map((fase) => {
      const hito = FASES_QUE_SON_HITOS.get(sitio.id)?.has(fase.nombre)
      const sinApertura = FASES_SIN_FECHA_DE_APERTURA.get(sitio.id)?.has(fase.nombre)
      const tituloHito = TITULOS_DE_PUBLICACION.get(sitio.id)?.get(fase.nombre) ?? fase.nombre
      return {
        fecha: fase.fecha_puesta_en_servicio,
        titulo: hito || sinApertura ? tituloHito : `${fase.estado === 'operativo' ? 'Puesta en servicio' : 'Puesta en servicio prevista'} · ${fase.nombre}`,
        detalle: fase.nota ?? null,
        prevista: !hito && fase.estado !== 'operativo',
        fuentes: fase.fuentes,
      }
    })
  const cronologia = [...(editada.cronologia ?? []), ...fases]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  for (const entrada of [editada, ...(editada.hardware ?? []), ...cronologia]) {
    for (const id of entrada.fuentes ?? []) {
      if (!fuentes.has(id)) throw new Error(`Fuente inexistente ${id} en la presentación de ${sitio.id}`)
    }
  }
  for (const id of editada.avisoFuentes ?? []) {
    if (!fuentes.has(id)) throw new Error(`Fuente inexistente ${id} en el aviso de ${sitio.id}`)
  }
  return { ...editada, titulo: editada.titulo ?? sitio.nombre, cronologia }
}
