export const normalizarBusqueda = (valor) => String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
export const coincideBusqueda = (consulta, texto) => normalizarBusqueda(consulta).trim().split(/\s+/).filter(Boolean).every((palabra) => normalizarBusqueda(texto).includes(palabra))
