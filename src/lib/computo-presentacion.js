// Matices de presentación para afirmaciones cuyo alcance cambia la lectura del
// recuento. No se agregan filas ni se modifican los inventarios documentales.
const esProyecto = (registro, id) => registro.proyecto === id

// Solo se repite el sistema si permite distinguir inventarios o particiones.
// La denominación documental completa se conserva en el detalle de evidencia.
const ALCANCES = {
  'Agustina': 'Agustina',
  'Mequinenza': 'Mequinenza',
  'MareNostrum 5 GPP (partición de propósito general)': 'MareNostrum 5 GPP',
  'MareNostrum 5 ACC (partición acelerada)': 'MareNostrum 5 ACC',
  'MareNostrum 5 GPP-NextGen (partición de nueva generación)': 'MareNostrum 5 GPP-NextGen',
  'MareNostrum 5 AI Upgrade (partición de IA, BSC AI Factory)': 'MareNostrum 5 AI Upgrade',
  'MareNostrum Ona (partición cuántica, digital)': 'MareNostrum Ona · digital',
  'EuroQCS-Spain (cuántico analógico)': 'EuroQCS-Spain · analógico',
  'Cibeles 3': 'Cibeles 3',
  'Cibeles 4': 'Cibeles 4',
  'FinisTerrae III': 'FinisTerrae III',
  'FinisTerrae III, partición A100': 'FinisTerrae III',
  'FinisTerrae III, partición T4': 'FinisTerrae III',
  'Qmio': 'Qmio',
  'CPD del CITIC — computación embebida': 'Computación embebida',
  'Centro de datos de IA de Puertollano (fase 1)': 'Fase 1',
  'CPD-CSA, recursos NVIDIA L4': 'Inventario L4',
  'CPD-CSA, servidores L4 IA del catálogo técnico': 'Catálogo · IA',
  'CPD-CSA, servidores L4 MEDIA del catálogo técnico': 'Catálogo · MEDIA',
  'CPD-CSA, servidores A40 IA del catálogo técnico': 'Catálogo · IA',
  'Clúster de IA de CoreWeave en Barcelona (fase 1)': 'Fase 1',
  'Altamira — partición wngpu': 'wngpu',
  'Correfoc, particiones std-gpu y high-gpu': 'std-gpu y high-gpu',
  'Correfoc, partición CPU descrita por la RES': 'CPU · inventario RES',
  'Tirant 4': 'Tirant 4',
  'Lluís Vives 2': 'Lluís Vives 2',
}

export function modeloComputo(registro) {
  if (esProyecto(registro, 'ctic-gijon-cabuenes')) {
    if (registro.sistema?.includes('CT008/2021')) return 'NVIDIA A100 · 40 GB'
    if (registro.sistema?.includes('CT004/2026')) return 'RTX PRO 6000 Blackwell Server Edition · 96 GB'
  }
  if (!registro.modelo) {
    if (esProyecto(registro, 'tecnalia-derio-deep-learning')) return 'Total declarado del clúster'
    if (esProyecto(registro, 'ctag-porrino-haaro')) return 'HAARO Lab'
    if (esProyecto(registro, 'ctic-gijon-cabuenes')) return 'Servicio GPU existente'
    if (registro.sistema === 'Superordenador de la fábrica de IA 1HealthAI') return 'Superordenador 1HealthAI'
  }
  return registro.modelo ?? registro.sistema ?? 'Modelo no publicado'
}

export function alcanceComputo(registro) {
  const sistema = registro.sistema
  if (!sistema || !registro.modelo || sistema === registro.modelo) return null
  if (esProyecto(registro, 'aimen-porrino-am-pilot-factory')) {
    if (sistema.includes('primera configuración')) return 'CPU de 16 núcleos · primera mención'
    if (sistema.includes('segunda configuración')) return 'CPU de 16 núcleos · segunda mención'
    if (sistema.includes('CPU de 8')) return 'CPU de 8 núcleos'
    if (sistema.includes('RTX 8000')) return '768 GB de RAM'
  }
  if (esProyecto(registro, 'ctic-gijon-cabuenes')) {
    if (sistema.includes('CT008/2021')) return 'Compra adjudicada CT008/2021 · DGX A100'
    if (sistema.includes('CT004/2026')) return 'Compra adjudicada CT004/2026 · ARQADE'
  }
  return ALCANCES[sistema] ?? null
}

export function estadoComplementarioComputo(registro) {
  if (registro.estado === 'desconocido') return null
  if (registro.modalidad === 'instalado' && registro.estado === 'operativo') return null
  if (registro.modalidad === 'previsto' && registro.estado === 'anunciado') return null
  return registro.estado
}

export function avisoComputo(registro) {
  const sistema = registro.sistema ?? ''
  if (esProyecto(registro, 'tecnalia-derio-deep-learning')) return 'Total y desglose en disputa.'
  if (esProyecto(registro, 'aimen-porrino-am-pilot-factory')) {
    if (sistema.includes('CPU de 16')) return 'Por configuración; dos menciones idénticas.'
    return 'Por configuración; total de flota no publicado.'
  }
  if (esProyecto(registro, 'cluster-tic-galicia-a-coruna-csa')) {
    if (sistema.includes('recursos NVIDIA L4')) return 'El anuncio dice más de 15; el dosier publica 15.'
    if (sistema.includes('servidores A40')) return 'El catálogo discrepa: dos o tres servidores.'
  }
  if (esProyecto(registro, 'cesga-santiago-campus-sur')) {
    if (registro.modelo === 'NVIDIA A100') return 'Recuento en disputa: 128 o 141 A100. Continuidad física sin confirmar.'
    return 'Última sede documentada; continuidad física sin confirmar.'
  }
  if (esProyecto(registro, 'bsc-barcelona-marenostrum') && sistema === 'MareNostrum 5 GPP (partición de propósito general)') {
    return 'Pico en disputa: 54 o 45,9 PFlop/s.'
  }
  if (esProyecto(registro, 'upf-barcelona-correfoc')) {
    if (registro.ambito === 'sistema' && registro.tipo === 'cpu_hpc') return 'Total de nodos CPU y GPU; incluye las particiones.'
    if (sistema.includes('partición CPU descrita')) return 'Parte del total de 67 nodos.'
  }
  if (esProyecto(registro, 'ctic-gijon-cabuenes') && registro.modalidad === 'adquirido') {
    return sistema.includes('CT004/2026')
      ? 'Modelo de referencia; admite equivalentes. Recepción sin confirmar.'
      : 'Recepción y modelo instalado sin confirmar.'
  }
  return null
}
