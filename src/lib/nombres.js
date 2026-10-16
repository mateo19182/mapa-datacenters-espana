// El nombre completo y los alias siguen en los datos y en la búsqueda.
const NOMBRES = {
  'cogent-san-sebastian-de-los-reyes': 'Cogent Madrid · San Sebastián de los Reyes',
  'tecnalia-derio-deep-learning': 'TECNALIA · Deep learning, Derio',
  'aimen-porrino-am-pilot-factory': 'AIMEN · AM Pilot Factory, O Porriño',
  'ctag-porrino-haaro': 'CTAG · HAARO, O Porriño',
  'ctic-gijon-cabuenes': 'CTIC · DataHub, Gijón',
  'cluster-tic-galicia-a-coruna-csa': 'Cidade das TIC · CSA',
  'qts-calatorao-rhodes': 'QTS · Proyecto Rhodes, Calatorao',
  'solaria-datasection-puertollano': 'Solaria · Puertollano, La Nava II',
  'aws-zaragoza-la-cartuja-car': 'AWS · Zaragoza La Cartuja, CAR',
  'aws-el-burgo-de-ebro-bde': 'AWS · El Burgo de Ebro, BDE',
  'bsc-barcelona-marenostrum': 'BSC · MareNostrum, Barcelona',
  'cesga-santiago-a-sionlla': 'CESGA · A Sionlla, Santiago',
  'nabiax-alcala-de-henares-adc': 'Nabiax · Alcalá ADC',
  'nabiax-madrid-julian-camarillo': 'Nabiax · Julián Camarillo, Madrid',
  'iron-mountain-san-fernando-de-henares-mad': 'Iron Mountain · Madrid MAD',
  'merlin-edged-getafe-mad01': 'MERLIN Edged · Getafe MAD01',
  'merlin-edged-getafe-2': 'MERLIN Edged · Getafe 2',
  'merlin-edged-ribera-baja-arasur': 'MERLIN Edged · Bilbao-Arasur',
  'merlin-barcelona-zona-franca': 'MERLIN Edged · Barcelona',
}

export function nombreProyecto(sitio) {
  return NOMBRES[sitio.proyecto ?? sitio.id] ?? sitio.nombre ?? sitio.nombre_proyecto
}
