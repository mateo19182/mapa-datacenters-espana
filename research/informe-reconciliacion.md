# Informe de reconciliación

Generado el 2026-08-31 por `npm run reconcile` sobre 191 emplazamientos.

Nada de lo que sigue se corrige automáticamente: son propuestas para decidir a mano.

- Variantes de nombre de operador: **3**
- Posibles emplazamientos duplicados: **1**
- Potencias de fase que superan la cifra global: **0**
- Estados en conflicto con sus fases: **0**
- Fechas posteriores a hoy: **0**
- Editores que no cuadran con el dominio: **102**

## Variantes del nombre de operador

Si son la misma empresa, unificar el campo `operador` y dejar la otra forma como `alias`. Si no lo son, no tocar: hay grupos con nombres muy parecidos.

| Nombre A | Nombre B | Motivo |
|---|---|---|
| ACS Digital & Energy (1) | ACS Digital Infrastructure Development, S.L. (Grupo ACS) (1) | uno contiene al otro |
| Echelon Iberdrola Digital Infra (1) | Iberdrola (1) | uno contiene al otro |
| Grupo Aire (2) | Stackscale (Grupo Aire) (1) | uno contiene al otro |

## Posibles duplicados

Un campus con varios edificios debe ser **una** ficha con sus fases dentro. Dos edificios de verdad independientes pueden coexistir en el mismo municipio: verificar antes de fusionar.

| Emplazamiento A | Emplazamiento B | Motivo |
|---|---|---|
| `espanix-madrid-gran-via-hortaleza` | `espanix-madrid-mesena` | mismo operador (Asociación ESpanix) · a 199 m con coordenadas exactas · mismo municipio (Madrid) |

## Editores que no cuadran con el dominio

Suele ser una cita de segunda mano: el contenido es de un medio pero el enlace apunta a otro. Conviene enlazar el original o declarar el editor real.

| Emplazamiento | Fuente | Editor declarado | Dominio |
|---|---|---|---|
| `abanca-a-coruna-pocomaco` | src-1 | ABANCA | comunicacion.abanca.com |
| `acciona-ignis-segovia` | src-pvmag | pv magazine España | pv-magazine.es |
| `acs-alcala-de-henares-campus` | src-1 | Grupo ACS | pressroom.grupoacs.com |
| `acs-la-puebla-de-alfinden-centro-datos` | src-3 | Wikidata | query.wikidata.org |
| `adequa-odena-d-hub-can-morera` | src-1 | D-Hub Òdena (Adequa Real Estate) | d-hubodena.cat |
| `adequa-odena-d-hub-can-morera` | src-2 | Adequa Real Estate | adequa-re.cat |
| `adequa-odena-d-hub-can-morera` | src-4 | La Veu de l'Anoia | veuanoia.cat |
| `adequa-odena-d-hub-can-morera` | src-5 | D-Hub Òdena (Adequa Real Estate) | d-hubodena.cat |
| `afr-ix-barbate-medusa-zahara` | src-1 | AFR-IX telecom / Medusa Submarine Cable System | medusascs.com |
| `asac-llanera-data-center-1` | src-1 | ASAC Comunicaciones | asacti.es |
| `asac-llanera-data-center-1` | src-2 | ASAC Comunicaciones | asacti.es |
| `aws-huesca-plhus` | src-3 | Amazon Web Services | aws.amazon.com |
| `aws-la-puebla-de-hijar-la-llanada` | src-3 | Wikidata | query.wikidata.org |
| `aws-san-mateo-de-gallego-el-boyal` | src-2 | Wikidata | query.wikidata.org |
| `aws-villanueva-de-gallego-vdg0` | src-2 | Amazon Web Services | aws.amazon.com |
| `aws-zaragoza-la-cartuja-car` | src-3 | Wikidata | query.wikidata.org |
| `bbva-tres-cantos` | src-5 | Uptime Institute | es.uptimeinstitute.com |
| `box2bit-carinena-ebro` | src-3 | Wikidata | query.wikidata.org |
| `box2bit-epila-epilon` | src-3 | Wikidata | query.wikidata.org |
| `cartagena-data-green-escombreras` | src-2 | Observatorio Español de Data Centers | observatorioedc.com |
| `cesga-santiago-a-sionlla` | src-3 | Dominion Global | dominion-global.com |
| `cyrusone-alcobendas-mad1` | src-4 | CyrusOne | documents.cyrusone.com |
| `digital-realty-sant-adria-bcn1` | src-5 | Digital Realty Trust | investor.digitalrealty.com |
| `digital-valley-picassent` | src-1 | Levante-EMV | levante-emv.com |
| `echelon-iberdrola-madrid-sur` | src-1 | Echelon Data Centres | echelon-dc.com |
| `echelon-iberdrola-madrid-sur` | src-2 | pv magazine España | pv-magazine.es |
| `edgemode-cordoba-green-dc` | src-2 | PV Tech | pv-tech.org |
| `edgemode-torrecampo-green-dc` | src-1 | PV Tech | pv-tech.org |
| `edgnex-madrid-vicalvaro` | src-1 | EDGNEX Data Centers by DAMAC (nota de prensa) | zawya.com |
| `equinix-alcobendas-campus` | src-4 | Equinix | newsroom.equinix.com |
| `exa-riba-roja-de-turia` | src-1 | Observatorio Español de Data Centers | observatorioedc.com |
| `forestalia-alfamen-dcm-blue` | src-2 | Wikidata | query.wikidata.org |
| `forestalia-alfamen-dcm-blue` | src-11 | MERLIN Properties SOCIMI, S.A. | ir.merlinproperties.com |
| `forestalia-botorrita-dcm-dedalo` | src-2 | Wikidata | query.wikidata.org |
| `forestalia-botorrita-dcm-dedalo` | src-11 | MERLIN Properties SOCIMI, S.A. | ir.merlinproperties.com |
| `forestalia-magallon-dcm-data` | src-2 | Wikidata | query.wikidata.org |
| `fotones-murcia-espinardo-casiopeia` | src-3 | Observatorio Español de Data Centers | observatorioedc.com |
| `go-energy-trigueros-tron` | src-2 | pv magazine España | pv-magazine.es |
| `go-energy-trigueros-tron` | src-6 | pv magazine España | pv-magazine.es |
| `go-energy-trigueros-tron` | src-7 | Energías Renovables | energias-renovables.com |
| `goodman-madrid-mad01-pegaso` | src-1 | Goodman | es.goodman.com |
| `goodman-madrid-mad01-pegaso` | src-2 | Goodman | es.goodman.com |
| `grupo-aire-elche-oasix` | src-3 | Observatorio Español de Data Centers | observatorioedc.com |
| `ingenostrum-curtis-galicia-green-data-center` | src-4 | SPAIN DC (Asociación Española de Data Centers) | spaindc.com |
| `islalink-valencia-fsl` | src-2 | Observatorio Español de Data Centers | observatorioedc.com |
| `kumo-murcia-espinardo` | src-3 | Observatorio Español de Data Centers | observatorioedc.com |
| `kumo-paterna-tactica` | src-3 | Observatorio Español de Data Centers | observatorioedc.com |
| `merlin-barcelona-zona-franca` | src-1 | MERLIN Properties SOCIMI | merlinproperties.com |
| `merlin-barcelona-zona-franca` | src-2 | MERLIN Properties SOCIMI | merlinproperties.com |
| `merlin-barcelona-zona-franca` | src-5 | CoreWeave | investors.coreweave.com |
| `merlin-botorrita-zaragoza-wind` | src-2 | Wikidata | query.wikidata.org |
| `merlin-botorrita-zaragoza-wind` | src-9 | MERLIN Properties SOCIMI, S.A. | merlinproperties.com |
| `merlin-botorrita-zaragoza-wind` | src-11 | MERLIN Properties SOCIMI, S.A. | ir.merlinproperties.com |
| `merlin-edged-getafe-2` | src-2 | MERLIN Properties | ir.merlinproperties.com |
| `merlin-edged-getafe-2` | src-3 | Edged (MERLIN Edged) | es.edged.es |
| `merlin-edged-getafe-mad01` | src-3 | MERLIN Properties | ir.merlinproperties.com |
| `merlin-edged-getafe-mad01` | src-8 | Edged (MERLIN Edged) | es.edged.es |
| `merlin-edged-navalmoral-de-la-mata` | src-merlin | MERLIN Properties SOCIMI | ir.merlinproperties.com |
| `merlin-edged-ribera-baja-arasur` | src-1 | MERLIN Properties SOCIMI | merlinproperties.com |
| `merlin-edged-ribera-baja-arasur` | src-2 | MERLIN Properties SOCIMI | merlinproperties.com |
| `merlin-edged-ribera-baja-arasur` | src-8 | Material Eléctrico (CdeComunicacion.es) | material-electrico.cdecomunicacion.es |
| `merlin-edged-valdecaballeros` | src-merlin | MERLIN Properties SOCIMI | ir.merlinproperties.com |
| `merlin-edged-valdecaballeros` | src-merlin-es | MERLIN Properties SOCIMI | merlinproperties.com |
| `meta-talavera-de-la-reina-torrehierro` | src-cmm | Castilla-La Mancha Media | cmmedia.es |
| `microsoft-algete` | src-1 | Microsoft | news.microsoft.com |
| `microsoft-la-muela-centrovia` | src-4 | Wikidata | query.wikidata.org |
| `microsoft-meco` | src-1 | Microsoft | news.microsoft.com |
| `microsoft-san-sebastian-de-los-reyes` | src-1 | Microsoft | news.microsoft.com |
| `microsoft-villamayor-de-gallego` | src-4 | Wikidata | query.wikidata.org |
| `microsoft-zaragoza-puerto-venecia` | src-4 | Wikidata | query.wikidata.org |
| `nasertic-pamplona-orkoien` | src-3 | Legrand | obrasemblematicas.legrand.es |
| `nixval-paterna-fuente-del-jarro` | src-2 | Observatorio Español de Data Centers | observatorioedc.com |
| `ntt-las-rozas-mad1` | src-3 | NTT DATA Global Data Centers | services.global.ntt |
| `nxn-valencia-vara-de-quart-nx01` | src-1 | Levante-EMV | levante-emv.com |
| `nxn-valencia-vara-de-quart-nx01` | src-2 | Levante-EMV | levante-emv.com |
| `nxn-valencia-vara-de-quart-nx01` | src-4 | Observatorio Español de Data Centers | observatorioedc.com |
| `nxn-valencia-vara-de-quart-nx01` | src-7 | InfraRed Capital Partners | ircp.com |
| `oxigen-sant-cugat` | src-2 | Oxigen Data Center | oxigendc.com |
| `oxigen-sant-cugat` | src-4 | Data Center Market | guia.datacentermarket.es |
| `oxigen-sant-fruitos-de-bages` | src-2 | Oxigen Data Center (LinkedIn) | es.linkedin.com |
| `plexval-paterna-ciudad-de-sevilla` | src-2 | Observatorio Español de Data Centers | observatorioedc.com |
| `qts-calatorao-rhodes` | src-4 | Wikidata | query.wikidata.org |
| `saltburn-malaga-pta-extension` | src-5 | Data Centre & Network News | dcnnmagazine.com |
| `samca-luceni-ribera-alta-ebro` | src-3 | Wikidata | query.wikidata.org |
| `stackscale-talavera-de-la-reina` | src-aire | Aire Cloud (Grupo Aire) | airetech.es |
| `sys4net-alcantarilla-magalia` | src-2 | Observatorio Español de Data Centers | observatorioedc.com |
| `t-systems-cerdanyola` | src-4 | T-Systems Iberia | t-systemsblog.es |
| `telxius-conil-estacion-cables-submarinos` | src-1 | Canal Sur — Archivo y Documentación | blogs.canalsur.es |
| `templus-alcala-de-henares-mad01` | src-4 | Data Center Market | guia.datacentermarket.es |
| `templus-alcala-de-henares-mad01` | src-5 | Material Eléctrico (CdeComunicación) | material-electrico.cdecomunicacion.es |
| `templus-barcelona-bcn02` | src-4 | Colt Technology Services | coltdatacentres.net |
| `templus-paterna-parque-tecnologico` | src-3 | Observatorio Español de Data Centers | observatorioedc.com |
| `tillion-villamayor-de-gallego` | src-3 | Wikidata | query.wikidata.org |
| `trevenque-granada-cloud-center-andalucia` | src-1 | Data Center Market | guia.datacentermarket.es |
| `ungsc-quart-de-poblet-unictf` | src-2 | Observatorio Español de Data Centers | observatorioedc.com |
| `valencia-docks-marina-data-center` | src-1 | Levante-EMV | levante-emv.com |
| `valencia-docks-marina-data-center` | src-2 | Levante-EMV | levante-emv.com |
| `valencia-docks-marina-data-center` | src-5 | Levante-EMV | levante-emv.com |
| `vantage-villanueva-de-gallego-el-olivar` | src-3 | Wikidata | query.wikidata.org |
| `vdpc-sagunto-barracuda` | src-5 | Levante-EMV | levante-emv.com |
| `walhalla-castellon-espaitec` | src-3 | Observatorio Español de Data Centers | observatorioedc.com |
| `walhalla-castellon-espaitec` | src-4 | Material Eléctrico (C de Comunicación) | material-electrico.cdecomunicacion.es |
