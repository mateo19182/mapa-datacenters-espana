# Detalle de los activos renovables

*Última revisión: 2026-08-29. Los ficheros están en `data/renovables/*.yaml`.*

## Qué activos se pueden situar

Megavatios contratados hay muchos; lo que falta es saber dónde están. De los 22
registros, solo seis nombran la planta concreta, ocho plantas en total: Ciudad
Rodrigo, Valdemoro, Iglesias, El Escudo, Escatrón II, Fuendetodos II, Cascante y
Baobab. El resto son carteras sin desglosar. Amazon anuncia 100 proyectos y 3,8
GW en España sin publicar una lista con nombre, municipio y MW. Repsol firma seis
VPPA con Microsoft y no dice cuáles son los seis activos. Equinix firma cinco PPA
con IGNIS y los sitúa en «distintas regiones de España». Sin municipio no hay
punto en el mapa, y el registro lo deja en blanco antes que colocar un centroide
provincial.

## PPA y generación ligada a CPD

MW de generación. Nunca comparar ni sumar con MW de un centro de datos.

| Comprador | Vendedor / promotor | Activo | MW | Tipo | Fecha | Fichero |
|---|---|---|---|---|---|---|
| Amazon | Iberdrola | FV Ciudad Rodrigo (Salamanca) | 212 contratados | fotovoltaica | 2025-02-03 | `ppa-amazon-iberdrola-ciudad-rodrigo` |
| Amazon | Iberdrola | Eólico Valdemoro (Burgos) | 45 contratados | eólica | 2025-02-03 | `ppa-amazon-iberdrola-valdemoro` |
| Amazon | FRV | 5 plantas sin identificar | s/d (1,5 TWh/año) | fotovoltaica | 2023-09 | `ppa-amazon-frv-espana` |
| Amazon | varios | Cartera España | 3.800 instalados | mixta | agregado | `cartera-amazon-espana` |
| Microsoft | Repsol | 3 eólicos + 3 solares sin identificar | 230 instalados | mixta | 2024-06-11 | `ppa-microsoft-repsol-espana` |
| Microsoft | Iberdrola | Eólicos Iglesias (Burgos) y El Escudo (Cantabria) | 150 contratados (conjunto) | eólica | 2025-12-16 | `ppa-microsoft-iberdrola-iglesias-el-escudo` |
| Microsoft | Zelestra | Escatrón II y Fuendetodos II (Zaragoza) | 95,7 (conjunto) | fotovoltaica | 2025-11-24 | `ppa-microsoft-zelestra-aragon` |
| Microsoft | varios | Cartera España | 1.496 nuevos, 522 operativos | mixta | agregado | `cartera-microsoft-espana` |
| Google | Exus Renewables | Eólico Cascante (Navarra) | 35 de 51 | eólica | 2025-03-20 | `ppa-google-exus-cascante` |
| Equinix | IGNIS | 5 plantas sin identificar | 225 | fotovoltaica | 2023-02-28 | `ppa-equinix-ignis-espana` |
| Equinix | Sonnedix | 3 plantas en Cuenca | 150 MWp | fotovoltaica | 2023-05-04 | `ppa-equinix-sonnedix-cuenca` |
| Equinix | ib vogt | Baobab, Abades (Segovia) | 95,1 MWp | fotovoltaica | 2025 | `ppa-equinix-ibvogt-baobab-segovia` |
| Merlin Properties | Solaria | Cartera solar (1.er acuerdo) | 445 contratados | fotovoltaica | 2025-11-17 | `ppa-merlin-solaria-cpd-225mw` |
| Merlin Properties | Solaria | Cartera solar Madrid (2.º acuerdo) | 426 contratados | fotovoltaica | 2026-02-26 | `ppa-merlin-solaria-madrid-426mw` |
| Merlin Properties | Solaria | BESS Madrid | 600 MWh | almacenamiento | 2026-02-26 | `bess-merlin-solaria-madrid-600mwh` |
| Apto | IGNIS | FV para campus de Fuenlabrada | 94 | fotovoltaica | 2026-07 | `ppa-apto-ignis-fuenlabrada` |
| Data4 | TotalEnergies | Eólico y solar sin identificar | 30 | mixta | 2025-11-04 | `ppa-data4-totalenergies-espana` |
| nLighten | Shell España | Cartera solar y eólica | s/d | mixta | 2025-07 | `ppa-nlighten-shell-madrid` |

Generación en el propio emplazamiento o promovida por el mismo actor, sin PPA
publicado:

| Proyecto | Promotor | Ubicación | MW | Estado | Fichero |
|---|---|---|---|---|---|
| FV del campus de Meta | Zarza Networks | Talavera de la Reina (Toledo) | s/d | en tramitación | `generacion-meta-talavera` |
| FV adyacente al CPD de Segovia | Acciona e IGNIS | Segovia | s/d | anunciado | `generacion-acciona-ignis-segovia` |
| FV del campus de Cáceres | Ingenostrum | Cáceres | 520 (120 autoconsumo + 400) | anunciado 2022, sin confirmar | `generacion-ingenostrum-caceres` |
| FV de Madrid Sur | Iberdrola y Echelon | Comunidad de Madrid | s/d | anunciado | `generacion-echelon-iberdrola-madrid-sur` |

## Adicionalidad: cuánta potencia es nueva

Solo cuenta como adicional lo que la fuente dice. Donde no lo dice, el campo
`adicionalidad` va a `no_consta` y no se estima.

Declaran nueva construcción:

- Microsoft y Repsol. Los seis activos «estarán operativos en diciembre de 2025»,
  o sea que no existían al firmar. 230 MW.
- Microsoft en el agregado de España. 1.496 MW de nueva capacidad solar y eólica
  ligados a 16 contratos, de los que más de 522 MW ya están operativos. Es el
  único agregado corporativo localizado que separa lo nuevo de lo operativo.
- Microsoft y Zelestra. Escatrón II y Fuendetodos II estaban en construcción al
  firmar. 95,7 MW.
- Equinix e IGNIS. Proyectos por construir en 2023, previstos operativos en 2025.
  225 MW.
- Equinix y Sonnedix. Entrada en operación prevista a finales de 2024. 150 MWp.
- Amazon e Iberdrola en Ciudad Rodrigo. Planta en construcción, inversión de unos
  200 millones. 212 MW.
- Data4 y TotalEnergies. Plantas «a punto de empezar a producir». 30 MW.
- Acciona e IGNIS en Segovia, y la planta de Meta en Talavera. Ambas de nueva
  construcción, sin MW publicados.

Declara generación existente:

- Google y Exus en Cascante. Exus compró el parque al Grupo Enhol en 2024 y
  firmó el PPA en 2025 sobre un activo ya en operación. Esos 35 MW no añaden
  capacidad al sistema.

No consta:

- Valdemoro, la cartera de Amazon en España, los 445 y 426 MW de Solaria para
  Merlin, el PPA de IGNIS con Apto, los dos eólicos de Iberdrola para Microsoft
  y el acuerdo de nLighten con Shell.

De los grandes compradores, solo Microsoft publica una cifra de adicionalidad
verificable a escala de país. Amazon, con una cartera cinco veces mayor sobre el
papel, no.

## El BESS y por qué aparece junto a los CPD

Solo hay un activo de almacenamiento con vínculo contractual documentado a un
centro de datos: los 600 MWh que Merlin contrató a Solaria a 10
años en la Comunidad de Madrid, junto al PPA solar de 426 MW a 40 años. Solaria
lo vende como el primer PPA híbrido de solar y baterías firmado en España para un
cliente del sector digital.

600 MWh es energía almacenable, no potencia. Ninguna fuente publica los MW de ese
BESS, así que el campo va a `null`. Mezclar MWh de batería con MW de planta o de
CPD produce sumas sin sentido.

Aparecen juntos por una razón física. Un centro de datos consume plano las 24
horas y la fotovoltaica produce en campana. Sin almacenamiento, un PPA solar
cubre bien las horas centrales y nada la noche. El requisito de casación horaria
del nuevo Real Decreto (ver abajo) convierte eso en un problema regulatorio, no
solo económico. pv magazine recoge además el argumento técnico de que los picos
sincronizados de las GPU exigen respuesta casi instantánea, que las baterías se
degradan con ciclos muy frecuentes y que solar más almacenamiento no basta como
solución aislada
([pv magazine, 2026-02-03](https://www.pv-magazine.es/2026/02/03/solar-almacenamiento-para-centros-de-datos-viabilidad-tecnica-si-pero-no-como-solucion-aislada/)).

Hay un segundo motivo, menos limpio. Quien promueve baterías suele controlar
nudos y derechos de acceso. Solaria pasó de vender electrones a vender conexión.
Entró en el negocio en junio de 2024 con 155 MW de acceso concedidos por Red
Eléctrica y una filial, Solaria Data Center, apoyada en «infraestructuras
eléctricas propias vinculadas a sus proyectos de generación»
([Data Center Market, 2024-06-04](https://www.datacentermarket.es/news/solaria-se-adentra-en-el-mercado-de-los-centros-de-datos/)).
Después encadenó 213 MW en Madrid (febrero de 2025), 225 MW en el País Vasco
(febrero de 2025) y 130 MW más en Madrid
([Data Center Market, 2025-03-18](https://www.datacentermarket.es/datacenter-infrastructure/solaria-obtiene-las-aprobaciones-para-conectar-dos-data-centers-en-madrid/)).
El mismo patrón se repite con IGNIS, que en Fuenlabrada aporta a Apto los 82 MW
de acceso y el PPA de 94 MW en el mismo paquete, y con Iberdrola, que aporta a
Echelon terrenos con conexión.

El activo escaso no es el sol. Es el punto de conexión.

## Un PPA no es un cable

Un PPA fija precio y volumen entre un generador y un comprador durante años. No
es una línea eléctrica entre la planta y el centro de datos. La electricidad de
Escatrón II entra al sistema peninsular y se mezcla con la de todos los demás, y
la que consume un CPD en Villanueva de Gállego sale de la red, no de un panel
identificable.

Tres consecuencias:

1. La planta y el centro de datos pueden estar a cientos de kilómetros y en nudos
   sin relación. Ciudad Rodrigo está en Salamanca; los CPD de AWS, en Zaragoza y
   Huesca. Dibujar una línea entre ambos puntos sería inventar una infraestructura
   que no existe.
2. Buena parte de estos contratos son VPPA, acuerdos virtuales. Los seis de
   Repsol con Microsoft lo son. Ahí no hay ni siquiera entrega física al
   comprador: es una liquidación financiera por diferencias más la transferencia
   de garantías de origen. El generador vende su energía al mercado como
   cualquier otro.
3. «100 % renovable» en el material corporativo casi siempre significa
   compensación anual, no coincidencia horaria. AWS dice que compensa su consumo
   eléctrico en España con un 100 % de energía renovable desde 2022. Compensar y
   consumir no son lo mismo.

El contrato tampoco garantiza que el negocio funcione.
[Merca2 documentó en junio de 2026](https://www.merca2.es/2026/06/19/renovable-precio-cero-espana-amazon-2401403/)
el caso de FRV con Amazon. Cuando el precio horario cae a cero o entra en
negativo, la cobertura del PPA desaparece y FRV sigue entregando energía sin
cobrarla. En el primer trimestre de 2026 hubo 397 horas de precios negativos en
España, la mayoría en los picos solares. El PPA existe, los megavatios existen, y
aun así el reparto de riesgo entre las partes es cualquier cosa menos simétrico.

## El Real Decreto de agosto de 2026 cambia las reglas

El Consejo de Ministros aprobó el 25 de agosto de 2026, por vía de urgencia, un
proyecto de Real Decreto que afecta a todo centro de datos desde 1 MW
([pv magazine, 2026-08-26](https://www.pv-magazine.es/2026/08/26/espana-exigira-a-los-centros-de-datos-un-80-de-renovables-adicionales-y-datos-bajo-control-europeo/)):

- Al menos el 80 % de la electricidad consumida debe ser renovable, hasta que la
  generación renovable supere el 90 % del mix.
- Cada nuevo MW de demanda debe ir acompañado de un nuevo MW de generación
  renovable instalado en los 18 meses anteriores a la entrada en funcionamiento.
- La nueva capacidad puede venir de autoconsumo o de PPA a largo plazo.
- En cada hora de funcionamiento, al menos el 80 % del consumo debe estar
  respaldado por generación renovable producida esa misma hora.

La casación horaria es lo que rompe el modelo actual: un VPPA anual sobre una
cartera solar sin identificar no acredita el 80 % horario. Si la norma sale como
está, contrato financiero, entrega física y coincidencia horaria pasan a ser tres
datos distintos, y previsiblemente aparecerá mucho más almacenamiento pegado a
los campus.

## Casos descartados

- Comunidad energética del CPI La Cabañeta, El Burgo de Ebro (Zaragoza), 17,64
  kWp financiados por Amazon dentro del programa Escuela Solar
  ([pv magazine, 2026-03-12](https://www.pv-magazine.es/2026/03/12/el-burgo-de-ebro-pone-en-marcha-una-comunidad-energetica-financiada-por-amazon/)).
  Amazon tiene centros de datos en el municipio, pero la instalación no alimenta
  el CPD. Es compensación social, no suministro.
- Cuerva y Alto Infrastructure en Escúzar (Granada), 100 MW de potencia eléctrica
  redundante y ampliación de la subestación de Escúzar
  ([El Periódico de la Energía, 2026-07-08](https://elperiodicodelaenergia.com/cuerva-y-alto-infrastructure-impulsan-el-primer-gran-centro-de-datos-especializado-en-inteligencia-artificial-de-andalucia/)).
  La fuente dice «alimentada íntegramente con energía renovable» sin nombrar una
  sola planta. Sin activo identificable, no entra.
- La cartera de almacenamiento de Solaria en general. En marzo de 2026 sumaba
  3.280 MWh con aprobación ambiental, incluidos 480 MWh nuevos asociados a siete
  plantas en Castilla-La Mancha
  ([Solaria, 2026-03-17](https://solariaenergia.com/solaria-obtiene-aprobacion-ambiental-para-480-mwh-adicionales-de-baterias-en-espana-y-refuerza-su-liderazgo-en-almacenamiento-energetico/)).
  Ninguna fuente liga esos MWh a un CPD concreto, así que solo entran los 600 MWh
  del contrato con Merlin.
- CoreWeave, que según Data Center Dynamics firmó en junio de 2025 un PPA solar y
  eólico «a gran escala» en España. La fuente original no es accesible ni la
  noticia aparece en un medio abierto, así que no se registra.
- Digital Realty, que en mayo de 2024 habría firmado cinco PPA en Francia y
  España con Bruc y wpd. Mismo problema: no hay fuente primaria accesible, ni el
  artículo de El Periódico de la Energía que lo recoge.
- Samca, con tres centros de datos en Luceni (Zaragoza) y generación renovable
  propia, incluidas dos plantas solares con baterías por 60 millones. Lo único
  legible en fuente accesible es que el PIGA de Luceni prevé «llegar a 300 MW de
  potencia, con un consumo potencial de 2.600 GWh»
  ([AraInfo, 2026-02-11](https://arainfo.org/el-ano-de-los-pigas-las-macrocorporaciones-se-aduenan-de-aragon/)),
  y ese texto no describe la generación asociada. Pendiente.

## Huecos

Ordenados por lo que más daña al mapa.

1. **Identidad de las plantas.** Es el hueco grande. Amazon (3,8 GW), Repsol para
   Microsoft (230 MW), IGNIS para Equinix (225 MW), Sonnedix en Cuenca (150 MWp),
   FRV (5 plantas), TotalEnergies para Data4 (30 MW) y Solaria para Merlin (871
   MW entre los dos acuerdos) se anuncian sin nombre de planta ni municipio. Son
   más de 5 GW anunciados que no se pueden situar en un mapa.
2. **Coordenadas.** Ningún fichero lleva `lat`/`lon`. Donde consta el municipio,
   `precision` va a `municipio` y las coordenadas a `null`. Geocodificar contra
   una fuente oficial de municipios queda pendiente.
3. **Asignación a CPD concreto.** Casi ningún PPA de hyperscaler se asigna a un
   emplazamiento. `cpds_relacionados` solo está relleno en los tres casos de
   generación en el propio proyecto: Meta en Talavera, Acciona e IGNIS en Segovia
   e Ingenostrum en Cáceres. En los dieciocho contratos de compraventa va vacío,
   porque cruzarlos por operador sería una atribución propia, no de la fuente.
4. **Precios y duración.** El precio nunca se publica. La duración solo consta en
   siete de los dieciocho contratos.
5. **Potencia de las baterías.** Los 600 MWh de Merlin y Solaria no llevan MW
   asociados en ninguna fuente.
6. **Reparto dentro de acuerdos conjuntos.** Iberdrola no reparte los 150 MW
   entre Iglesias y El Escudo. Zelestra no reparte los 95,7 MW entre Escatrón II
   y Fuendetodos II. Son dos plantas, dos municipios y un solo número.
7. **Potencia total de Ciudad Rodrigo.** pv magazine titula «planta de 212 MW»;
   Data Center Market presenta los 212 MW como lo que compra Amazon dentro de una
   planta mayor. Sin fuente primaria accesible, queda como incertidumbre abierta.
8. **Meta en Talavera.** El PSI confirma una planta solar al norte de los
   edificios, promovida por Zarza Networks y ejecutable por un tercero, sin MW de
   la planta ni potencia eléctrica del campus. La Declaración de Impacto Ambiental
   y los proyectos técnicos deberían tenerlo.
9. **Verificación de puesta en servicio.** De los activos con fecha prevista
   (Ignis-Equinix 2025, Sonnedix 2024, Repsol-Microsoft diciembre de 2025,
   Ciudad Rodrigo 2025) ninguno se ha confirmado operativo. Los estados están
   registrados como los describía la fuente en su fecha, no como están hoy.

## Sesgo de las fuentes

Casi todo sale de pv magazine España, Data Center Market y las notas de los
propios promotores. Data Center Dynamics, El Economista, Expansión, Heraldo de
Aragón, El Periódico de Aragón y Ecologistas en Acción quedaron fuera de alcance
por muros de pago o antirrobots. El conjunto queda sesgado hacia lo que publican
las empresas y la prensa técnica abierta, y ahí están los huecos de Aragón.
