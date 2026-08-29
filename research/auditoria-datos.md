# Auditoría independiente de datos

Auditor externo. No participé en la investigación. El encargo era intentar tumbar
lo afirmado en las fichas, no confirmarlo.

- **Fecha de auditoría:** 2026-08-29
- **Método:** apertura directa de las URL que citan las propias fichas
  (`WebFetch`), extracción local con `pdftotext -layout` de los PDF de boletines
  oficiales que `WebFetch` no sabe leer, conversión UTM ETRS89 → WGS84 para
  contrastar coordenadas contra los expedientes, y barridos mecánicos sobre
  `public/datos/sitios.json`, `data/sites/*.yaml` y `data/huellas.json`.
- **Presupuesto de WebSearch agotado:** no se ha buscado nada. Todo lo que sigue
  sale de las fuentes que el propio conjunto cita.

## Aviso sobre el estado del repositorio durante la auditoría

El repositorio se reconstruyó **mientras la auditoría estaba en curso**
(commit `784efc0`, «Separar la potencia de respaldo y de generación de la
capacidad del centro», 20:08). Dos de los hallazgos más graves que había
levantado contra la instantánea de las 20:00 quedaron corregidos por ese commit
mientras escribía. Los dejo documentados en la sección
[«Corregido durante la auditoría»](#corregido-durante-la-auditoría) porque
describen fallos reales del conjunto publicado, y porque el segundo de ellos
**deja un residuo sin corregir**. Todo lo demás está verificado contra el estado
posterior a `784efc0`.

## Alcance

47 emplazamientos seleccionados sobre 163:

| Criterio | Nº |
|---|---|
| 25 mayores por cualquier cifra de potencia declarada | 25 |
| Operadores hiperescalares (AWS, Microsoft, Meta, Google) | 21 |
| Muestra de `confianza: baja` | 14 |
| *(solapes)* | −13 |
| **Total auditado** | **47** |

No hay ninguna ficha de Oracle en el conjunto.

Además se han corrido cinco barridos mecánicos sobre las **163** fichas:
respaldo literal de cada cifra en su cita (189 registros de potencia), tipo de
fuente `oficial` frente a dominio, coherencia `precision` YAML → export, salud de
enlaces export frente a `data/huellas.json`, y coordenadas `exacta` frente a
centroides municipales.

---

## Lo que resiste el ataque

Antes de la lista de fallos, conviene decir lo que no se ha podido tumbar, porque
es mucho y es lo caro de hacer bien:

- **Las coordenadas `exacta` son exactas.** Convertí las UTM ETRS89 Huso 30 que
  publican las resoluciones de INAGA y las comparé con las fichas: VDG2, VDG1,
  WQA, VDG0, BDE0, PLHUS y BDE coinciden **al metro** (distancia 0 m en los
  siete). Ninguna de las 44 fichas `precision: exacta` cae a menos de 250 m de un
  centroide municipal, y ninguna tiene menos de cuatro decimales. El barrido
  buscando «exactas» que en realidad fueran centroides no encontró nada.
- **La separación VDG0/VDG1/VDG2 y BDE0/BDE es correcta, no un duplicado.** El
  validador del proyecto avisa de «posible duplicado… a 322 m», pero son
  expedientes de AAI distintos (INAGA 2024/12129, /12130, y la AAI de 2020) con
  coordenadas distintas publicadas. Las fichas ya lo documentan en
  `incertidumbres`. La distancia real entre VDG0 y VDG1 es de 868 m (la ficha
  dice «unos 900 m») y entre BDE0 y BDE de 970 m (la ficha dice «unos 1,1 km»).
  Ambas descripciones son honestas.
- **Los MWt de AWS son literales.** `pdftotext` sobre la ORDEN VFL/654/2026
  devuelve, palabra por palabra, «una potencia térmica nominal total de
  1.169,46 MWt» para VDG2 (ZAZ100), 327 MWt para VDG1 (ZAZ080) y 342,08 MWt para
  WQA (ZAZ081/ZAZ111). Las citas registradas son fieles, con elisión marcada.
- **SAMCA/Green IT Aragón es de manual.** La memoria del PIGA dice literalmente
  «Cada uno de ellos se proyecta para una demanda de potencia IT de 72 MW, siendo
  la potencia activa máxima que será absorbida de la Red de Transporte por los
  tres edificios, de 300 MW». La cita del fichero reproduce esa frase sin
  alterarla.
- **Forestalia queda confirmado en los dos sentidos.** El BOA de 2 de diciembre
  de 2025 contiene tanto «70 MW para "DCM Data", 81 MW para "DCM Dédalo" y
  146,5 MW para "DCM Blue"; en total 297,5 MW de demanda IT» como
  «Ampliación de la potencia IT hasta 450 MW» para DCM Blue y «hasta 275 MW» para
  los otros dos.
- **Ninguna fuente `oficial` apunta a un dominio que no sea de una
  administración o de un organismo público.** Los cuatro casos que mi filtro
  marcó (`catalonia.com` = ACCIÓ/Generalitat, `csuc.cat` = consorcio público,
  `flix.cat` = ayuntamiento, `ungsc.org` = organismo de Naciones Unidas) y
  `investincantabria.com` (SODERCAN) son todos entes públicos. **Cero
  infracciones.**
- **No hay doble conteo por suma indebida en los casos que revisé.** La regla de
  `potencia.mjs` (una cifra de ámbito global manda y no se le suman las fases)
  funciona: DATA4 Alcobendas no suma sus dos líneas de respaldo de 10 MW con la
  acometida de 20 MW; Nabiax no suma 22,3 + 100 + 7,5; Arasur no suma sus cinco
  registros. Aquí el sesgo del agregador es a la baja, no al alza — que es el
  error correcto en un proyecto como este.
- **QTS Rhodes, Box2Bit Epilon, ACS La Puebla, Saltburn (los 100 MW IT), Alto
  Infrastructure (los 70 MW IT), MERLIN Navalmoral (20 MW IT y 29 MW), Meta
  (los 248 MW), Echelon (los 230 MW), Edged Getafe y Getafe 2** contienen todos,
  en la página citada, la cifra que se les atribuye.

---

## Tabla de veredictos

Leyenda: **C** confirmado · **CP** confirmado con reserva · **NE** no encontrado ·
**NV** no verificable · **E** error.

| # | id | Dato auditado | Veredicto | Nota |
|---|---|---|---|---|
| 1 | `aws-villanueva-de-gallego-vdg2` | 1.169,46 MWt · coords `exacta` | **C** | Literal en BOA; UTM→WGS84 coincide al metro |
| 2 | `aws-villanueva-de-gallego-vdg1` | 327 MWt · coords | **C** | Ídem |
| 3 | `aws-huesca-walqa-wqa` | 342,08 MWt · coords | **C** | Ídem |
| 4 | `aws-el-burgo-de-ebro-bde` | 750,66 MWt · coords | **CP** | Coords verificadas al metro contra UTM del expediente; la cifra procede de la orden de junio, que no abrí |
| 5 | `aws-villanueva-de-gallego-vdg0` | 110,4 MW grupos · coords | **CP** | Coords exactas ✓; los 110,4 MW **no aparecen** en la cita (§E4) |
| 6 | `aws-el-burgo-de-ebro-bde0` | 110,4 / 107,5 MW · coords | **CP** | Coords exactas ✓; 110,4 sin respaldo en cita; 107,5 sí («107,5 MWe») |
| 7 | `aws-huesca-plhus` | 110,4 MW · coords | **CP** | Coords exactas ✓; cifra sin respaldo en cita |
| 8 | `aws-huesca-plhus-sur` | Coordenadas | **E** | El export inventa un punto y sube `precision` (§E2) |
| 9 | `aws-la-puebla-de-hijar-la-llanada` | 100 MW «garantizados» | **NV** | Única fuente (`hoyaragon.es`) devuelve 403 |
| 10 | `aws-san-mateo-de-gallego-el-boyal` | Sin potencia | **C** | Correctamente vacío; el Acuerdo no publica potencia |
| 11 | `aws-zaragoza-la-cartuja-car` | Sin potencia · estado | **C** | La cita respalda que no se presentó a aprobación definitiva |
| 12 | `frv-edison-monfarracinos-zamora` | 1.160 MW `generacion_asociada` | **CP** | El artículo dice «una central térmica de 1,16 GWt» ✓; la cita registrada no contiene la cifra (§E4) |
| 13 | `merlin-edged-navalmoral-de-la-mata` | 1.000 MW IT | **CP** | Sustancia ✓ («8 and 10 buildings, each with 100MW of IT capacity»); **cita traducida** (§E5) |
| 14 | `merlin-edged-navalmoral-de-la-mata` | 288 MW / 192 MW | **C** | COPE: «demanda energética total de 288 MW, con 192 MW de demanda crítica» |
| 15 | `merlin-edged-navalmoral-de-la-mata` | 20 MW IT / 29 MW | **C** | Brains: literal en ambos casos |
| 16 | `merlin-edged-valdecaballeros` | 1.000 MW IT | **CP** | «It will count with 10 buildings, each with 100MW of IT capacity» ✓; cita traducida (§E5) |
| 17 | `qts-calatorao-rhodes` | 650 MW `conexion_red` | **C** | «proporcionando hasta 650 MW de capacidad», referido a la subestación. Tipo correcto |
| 18 | `box2bit-epila-epilon` | 150 / 520 MW | **C** | «fase será de 150 MW, y en las fases posteriores alcanzaría hasta 520 MW» |
| 19 | `stoneshield-pielagos-altamira` | 100 / 500 MW | **CP** | «100 megawatts in 2028 and 500 in 2030» ✓; **cita medio traducida** (§E5); tipo discutible (§E7) |
| 20 | `forestalia-alfamen-dcm-blue` | 450 MW IT | **C** | «Ampliación de la potencia IT hasta 450 MW» (Fase 3, 2030) |
| 21 | `forestalia-alfamen-dcm-blue` | 146,5 MW `conexion_red` | **CP** | Reclasificación editorial documentada (§E7); el BOA usa el mismo 146,5 con dos sentidos |
| 22 | `forestalia-magallon-dcm-data` | 275 MW IT / 70 MW | **C** | Literal en BOA |
| 23 | `forestalia-botorrita-dcm-dedalo` | 275 MW IT / 81 MW | **C** | Literal en BOA |
| 24 | `samca-luceni-ribera-alta-ebro` | 72 MW IT | **E** | Cita literal ✓, pero el agregado publica 72 MW cuando la fuente dice 72 **por cada uno de tres** (§E1) |
| 25 | `samca-luceni-ribera-alta-ebro` | 300 MW `conexion_red` | **C** | «potencia activa máxima que será absorbida de la Red de Transporte» |
| 26 | `samca-luceni-ribera-alta-ebro` | 125,5 MW `instalada_total` | **E** | Turbinas de gas de **emergencia** clasificadas como capacidad (§E3) |
| 27 | `tillion-villamayor-de-gallego` | 75 / 300 / 150 MW | **CP** | Coherentes entre sí (75 × 4 = 300); fuente `aragon.es` no abierta |
| 28 | `saltburn-malaga-pta-extension` | 100 MW IT | **C** | BOJA: «100 MW de potencia IT» |
| 29 | `saltburn-malaga-pta-extension` | 150 MW `conexion_red` | **E** | El BOJA lo llama «consumo eléctrico», no acceso a red (§E6) |
| 30 | `acs-la-puebla-de-alfinden-centro-datos` | 150 MW / 100 MW IT | **CP** | Cifras coherentes; los 100 MW IT no aparecen en la cita (§E4) |
| 31 | `acs-alcala-de-henares-campus` | 100 MW IT / 50 MW | **CP** | Ambas de fuente de la propia empresa; tipos correctos |
| 32 | `alto-infrastructure-escuzar-sp01` | 70 MW IT | **C** | «alcanzar los 70 MW de potencia IT» |
| 33 | `alto-infrastructure-escuzar-sp01` | Fase 45 MW (2028) | **NE** | La fuente salta de 25 MW (2027) a 70 MW (2029). Sin 45 MW (§E8) |
| 34 | `alto-infrastructure-escuzar-sp01` | Fase 10 MW | **CP** | La fuente da un rango, «entre 10 y 15 MW»; se registra el mínimo con `valor_mw_max: null` (§E8) |
| 35 | `dc-mudarra-torrelobaton-valladolid` | 160 MW IT | **CP** | Dos fuentes concordantes; 786,82 MWt de grupos correctamente **no** registrados |
| 36 | `merlin-edged-ribera-baja-arasur` | 118 MW IT (48+48+22) | **C** | La suma de edificios cuadra con la cifra de campus. Corrobora §E1 |
| 37 | `nabiax-alcala-de-henares-adc` | 22,3 / 100 / 135 MW | **C** | Tipos bien separados (`it` vs `instalada_total`) |
| 38 | `microsoft-la-muela-centrovia` | 50 / 300 MW | **E** | **Cita reescrita que cambia el sentido** (§E9) |
| 39 | `microsoft-villamayor-de-gallego` | 50 / 300 MW | **E** | La cita de `src-3` en esta ficha ni siquiera habla de MW (§E4, §E9) |
| 40 | `microsoft-zaragoza-puerto-venecia` | 50 / 300 MW | **E** | Ídem |
| 41 | `microsoft-alcala-de-henares-campus` | Estado | **NV** | Su única fuente oficial (`ayto-alcaladehenares.es`) está **rota** |
| 42 | `microsoft-algete` | Estado `en_construccion` | **NV** | Única fuente 403; sostenido solo por una nota de 2024 |
| 43 | `microsoft-meco` | Estado `en_construccion` | **NV** | Ídem |
| 44 | `microsoft-san-sebastian-de-los-reyes` | Estado `en_construccion` | **NV** | Ídem |
| 45 | `google-santander-pctcan-sol` | Sin potencia · superficie | **C** | Ficha honesta; la propia `incertidumbres` cuestiona su inclusión |
| 46 | `meta-talavera-de-la-reina-torrehierro` | 248 MW | **E** | La fuente dice «Potencia instalada **estimada**»; la cita suprime «estimada» (§E10) |
| 47 | `merlin-edged-getafe-mad01` | 20 / 27 MW | **C** | Edged y MERLIN concuerdan |
| 48 | `merlin-edged-getafe-2` | 48 y 20 MW | **C** | Ambas cifras están en la página; la ficha conserva las dos y lo advierte |
| 49 | `echelon-iberdrola-madrid-sur` | 230 MW `conexion_red` | **C** | «The site has already secured a 230MW grid connection» |
| 50 | `echelon-iberdrola-madrid-sur` | 144 MW IT | **NV** | La página de la compañía **no menciona 144 MW**; única fuente bloqueada (§E11) |
| 51 | `edgemode-cordoba-green-dc` | 300 MW | **C** | «Córdoba y Torrecampo, dotadas con 300 MW cada una» |
| 52 | `edgemode-torrecampo-green-dc` | 300 MW | **C** | Misma frase, «cada una». No es doble conteo |
| 53 | `edgemode-mora-malpica-ai` | 300 MW | **E** | Su propia segunda fuente lo describe como generación de gas autónoma (§E3) |
| 54 | `vdr-cizur-campus-data-navarra` | 300 MW `instalada_total` | **NV** | Tipo bien mapeado («300 MW installed capacity») pero la fuente devuelve 403 |
| 55 | `quetta-molins-de-rei` | 30 MW campus | **E** | Es el agregado de **toda** Quetta, no de este campus (§E12) |
| 56 | `aq-compute-cerdanyola-parc-alba` | 60 / 15 MW | **C** | ACCIÓ respalda ambas |
| 57 | `atlasedge-sant-adria-barcelona2` | 10 MW | **CP** | Cifra de directorio; no consta en la cita registrada (§E4) |
| 58 | `solaria-datasection-puertollano` | 40 MW | **C** | «más de 40 megavatios de potencia» |
| 59 | `vdpc-alicante-puerto-cls` | 1,5 MW · `cancelado` | **NV** | Fuente 403. Conservar el proyecto cancelado es buena práctica |
| 60 | `itnow-cerdanyola-cd2` | Sin potencia | **C** | Correctamente vacío |
| 61 | `go-energy-trigueros-tron` | 200 / 133 MW | **CP** | Discrepancia conservada; las dos fuentes que dan 200 MW están bloqueadas |
| 62 | `gigafactoria-ia-mora-la-nova-tivissa` | 55 / 125 / 150 MW | **C** | Contradicción conservada y atribuida correctamente |

---

## Errores que hay que corregir

Ordenados por gravedad. Cada uno lleva fichero, campo y corrección concreta.

### E1 — GRAVE · SAMCA: el campus publica un tercio de su capacidad IT

**Fichero:** `data/sites/samca-luceni-ribera-alta-ebro.yaml` → `potencia[0]`
**Consumidor afectado:** `public/datos/sitios.json` → `resumen_potencia.it`,
`sitios-lista.json` → `mw_it`, y el total de cartera `it` del `resumen.json`.

La memoria del PIGA dice: *«Cada uno de ellos se proyecta para una demanda de
potencia IT de 72 MW»* — **tres** edificios (DC «Atalaya del Ebro», DC «Ribera
Alta del Ebro», DC «Ribera Alta del Ebro II»). La ficha registra un solo
`potencia[]` de `valor_mw: 72` con `ambito: edificio`. Como `potencia.mjs` da a
`edificio` la misma prioridad que a `campus` (`ORDEN_AMBITO = {campus:0,
edificio:0, fase:1}`), ese 72 se publica como la capacidad IT del emplazamiento.

Que es un error se demuestra con la aritmética de la propia ficha: la misma
memoria da 300 MW de potencia absorbida de la red de transporte. 300 / 72 implica
un PUE de 4,2, que es absurdo. 300 / 216 da 1,39, que es exactamente lo que la
memoria dice haber usado («el valor de diseño del Peak PUE y los coeficientes de
simultaneidad»).

Y se corrobora en otras dos fichas donde la fuente sí publica el total del
campus: en `merlin-edged-ribera-baja-arasur` los edificios BIL01+BIL02+BIL03
(48+48+22) suman **exactamente** los 118 MW de campus; en
`tillion-villamayor-de-gallego` los cuatro edificios de 75 MW suman
**exactamente** los 300 MW de campus. La regla correcta es sumar los registros de
`ambito: edificio` que describen unidades distintas.

**Corrección propuesta (dos partes):**

1. **Datos** — sustituir el registro único por tres, uno por edificio, sin
   inventar nada (los tres valores están en la fuente):

   ```yaml
   potencia:
     - tipo: it
       valor_mw: 72
       ambito: edificio
       referencia: 'DC "Atalaya del Ebro"'
       ...
     - tipo: it
       valor_mw: 72
       ambito: edificio
       referencia: 'DC "Ribera Alta del Ebro"'
       ...
     - tipo: it
       valor_mw: 72
       ambito: edificio
       referencia: 'DC "Ribera Alta del Ebro II"'
       ...
   ```

2. **Agregación** — en `scripts/potencia.mjs`, `ambito: edificio` no puede
   compartir prioridad con `campus`. Varios `edificio` con `referencia` distinta
   son componentes y deben sumarse; varios `edificio` con la misma `referencia`
   (caso `merlin-edged-getafe-mad01`, que tiene 20/20/27 MW para **el mismo**
   edificio) son cifras rivales y no deben sumarse. Sugerencia mínima:

   ```js
   const ORDEN_AMBITO = { campus: 0, edificio: 1, fase: 1 }
   ```

   agrupando previamente los `edificio` por `referencia` y quedándose con el más
   reciente dentro de cada grupo antes de sumar entre grupos.

   Verificar tras el cambio que Arasur sigue dando 118 y Getafe MAD01 sigue
   dando 20.

**Efecto:** `samca-luceni` pasa de 72 a 216 MW IT; el total de cartera `it` sube
de 4.308,5 a 4.452,5 MW.

### E2 — GRAVE · El export inventa una coordenada que la ficha rehusó dar

**Fichero:** `scripts/export.mjs` (derivación de centroides) ·
**Ficha afectada:** `data/sites/aws-huesca-plhus-sur.yaml`

El YAML declara `precision: desconocida`, sin `lat` ni `lon`, y su
`incertidumbres` dice textualmente: *«No se registran coordenadas para no
inventar posición.»*

El export publica `lat: 42.13825, lon: -0.40809` y **reescribe
`precision` a `municipio`**. Ese punto es el centro de Huesca (a 233 m del
centroide), cuando la única fuente sitúa el ámbito *«aproximadamente a 7,8 km al
suroeste del centro de la ciudad de Huesca»*. El mapa coloca el emplazamiento a
7,8 km de donde su fuente dice que está, en una ficha que había decidido
explícitamente no situarlo.

Es el **único** caso en las 163 fichas donde el export **sube** el nivel de
precisión declarado. En los otros 22 casos de `coordenada_derivada` el export
baja o mantiene la precisión, que es correcto.

**Corrección propuesta:** en `export.mjs`, no derivar centroide cuando el YAML
declara `precision: desconocida`; y en ningún caso escribir un `precision` mayor
que el declarado en el YAML. Regla de una línea: la precisión publicada es
`min(declarada, derivada)`, nunca `max`.

### E3 — GRAVE · Queda generación de respaldo dentro de los totales de capacidad

El commit `784efc0` movió ocho registros de AWS y uno de FRV a
`termica_respaldo` / `generacion_asociada`, que `export.mjs` excluye
correctamente de los totales (`TIPOS_CAPACIDAD`). **Quedaron dos fuera.**

**E3a — `data/sites/samca-luceni-ribera-alta-ebro.yaml` → `potencia[2]`**

```yaml
tipo: instalada_total          # ← incorrecto
valor_mw: 125.5
referencia: "Potencia eléctrica instalada de la planta de turbinas de gas de emergencia asociada a cada edificio"
nota: "...Es generación de respaldo, no carga TI."
```

La propia `nota` dice que es generación de respaldo. `instalada_total` **sí** se
suma a la cartera. Cambiar a `tipo: termica_respaldo`.
**Efecto:** el total `instalada_total` baja de 756,9 a **631,4 MW**.

**E3b — `data/sites/edgemode-mora-malpica-ai.yaml` → `potencia[0]`**

Registra 300 MW como `no_especificado`, que también se suma. Su segunda fuente
(`encastillalamancha.es`) describe el proyecto como *«30 módulos de 10 Mw
alimentados mediante gas natural, de forma autónoma de la Red Eléctrica»* — es
decir, 300 MW de **generación de gas aislada de la red**, no carga del centro.
La primera fuente (Idealista) solo dice «300 MW de potencia».

Dado que la única caracterización técnica disponible es la de generación,
reclasificar a `tipo: generacion_asociada` y dejar constancia en
`incertidumbres` de que Idealista lo presenta como potencia del proyecto.
Alternativa mínima aceptable: mantener `no_especificado` pero añadir una
`incertidumbre` de tipo, que hoy no existe.
**Efecto:** el total `no_especificado` baja de 5.022 a **4.722 MW**.

### E4 — GRAVE (sistémico) · Una de cada cuatro cifras no está en su propia cita

**Barrido mecánico sobre las 163 fichas:** de **189** registros de `potencia[]`
con valor numérico, **50 (26,5 %)** no contienen esa cifra —en ninguna variante
de formato, ni en GW, ni con separador de millares— en el campo `cita` de
**ninguna** de las fuentes que el propio registro invoca en `potencia[].fuentes`.

Esto no significa que el dato sea falso: abrí bastantes y el número **sí** está
en la página (Forestalia 450/275, Epilon 150/520, MERLIN 1.000, Microsoft
50/300, Meta 248, Alto 70). Significa que el campo `cita`, que es el único
mecanismo del esquema para que un tercero compruebe un dato sin volver a
investigar, no cumple su función en un cuarto de los casos. Y para las **34 URL
bloqueadas o rotas** esa comprobación ya es imposible: el dato queda sin
respaldo verificable de ninguna manera.

Choca de frente con el Principio 1 de `docs/ESQUEMA.md` («Nada sin fuente») y con
la definición del campo en el propio esquema: *«cita: Fragmento literal breve que
respalda el dato.»*

**Corrección propuesta:** añadir una regla a `scripts/validate.mjs` que emita
aviso cuando el `valor_mw` / `valor_mva` de un registro de `potencia[]` no
aparezca en la `cita` de ninguna de sus `fuentes`, y recorrer los 50 casos
sustituyendo la cita por el fragmento que sí contiene la cifra. Muchos ya están
transcritos en el campo `nota` del propio registro (p. ej. Forestalia,
Saltburn, ACS Alfindén): en esos casos la corrección es mover el texto de `nota`
a `cita`.

Lista completa reproducible con:

```bash
node -e "…"  # ver el barrido de esta auditoría; 50 registros, encabezados por
             # forestalia-*, microsoft-*, merlin-*, digital-realty-*, templus-*
```

Los diez de mayor impacto por MW: `merlin-edged-navalmoral-de-la-mata` (1.000),
`merlin-edged-valdecaballeros` (1.000), `frv-edison-monfarracinos-zamora`
(1.160), `box2bit-epila-epilon` (520 y 150), `forestalia-alfamen-dcm-blue` (450),
`forestalia-magallon-dcm-data` (275), `forestalia-botorrita-dcm-dedalo` (275),
`microsoft-villamayor-de-gallego` (300), `microsoft-zaragoza-puerto-venecia`
(300), `ingenostrum-badajoz-nostrum-evergreen` (300).

### E5 — MEDIA · Citas traducidas presentadas como literales

El esquema pide *fragmento literal*. Tres fichas guardan en `cita` una
**traducción al castellano** de una página escrita en inglés. El sentido se
conserva, pero la cadena no existe en la fuente, de modo que nadie puede
localizarla con Ctrl+F ni contrastarla:

| Fichero | `cita` registrada | Lo que dice la página |
|---|---|---|
| `merlin-edged-navalmoral-de-la-mata.yaml` (`src-merlin`) | «8 y 10 edificios con 100MW de capacidad IT cada uno» | «The facility will consist of between 8 and 10 buildings, each with 100MW of IT capacity» |
| `merlin-edged-valdecaballeros.yaml` (`src-merlin`) | «10 edificios con 100MW de capacidad IT cada uno […] Decommissioned Nuclear Power Plant grounds» | «It will count with 10 buildings, each with 100MW of IT capacity» / «located on the grounds of the decommissioned Nuclear Power Plant» |
| `stoneshield-pielagos-altamira.yaml` (`src-1`) | «100 megawatts en 2028 y 500 en 2030» | «The Penagos substation, with 220,000 volts, will provide the necessary power for the project: 100 megawatts in 2028 and 500 in 2030.» |

**Corrección propuesta:** sustituir por el literal en el idioma original. Si se
quiere traducción, que vaya en `nota`, nunca en `cita`.

### E6 — MEDIA · Saltburn: «consumo eléctrico» clasificado como acceso a red

**Fichero:** `data/sites/saltburn-malaga-pta-extension.yaml` → `potencia[1]`

El BOJA (verificado abriendo `juntadeandalucia.es/boja/2026/104/37`) dice
literalmente **«150 MW de consumo eléctrico y 100 MW de potencia IT»**. La ficha
registra los 100 MW como `it` —correcto— y los 150 MW como `conexion_red`.

Pero `conexion_red` está definido en el esquema como *«potencia de acceso
solicitada o concedida en el punto de conexión»*, y el BOJA no dice eso: dice
*consumo eléctrico*. 150 frente a 100 MW IT es un PUE de 1,5, o sea la potencia
eléctrica total de la instalación — que es exactamente la definición de
`instalada_total` («incluye clima, pérdidas»). La `nota` de la ficha reconoce el
problema y lo resuelve apoyándose en que *«las fuentes de prensa lo vinculan al
punto de suministro en el nudo SET Cártama»*; comprobé que **el BOJA no menciona
el nudo SET Cártama en ninguna parte**. Se está usando prensa para reclasificar
lo que dice un boletín oficial.

Esta es, literalmente, la «conversión implícita entre tipos de potencia» que el
esquema prohíbe, y ocurre en una ficha de `confianza: alta`.

**Corrección propuesta:** `tipo: instalada_total`, `referencia: "Consumo
eléctrico previsto del centro de datos"`, y trasladar la vinculación con el nudo
SET Cártama a `conexion_electrica.subestacion` con sus fuentes de prensa.
**Efecto:** `conexion_red` baja de 3.086,5 a 2.936,5 MW; `instalada_total` sube
en 150 MW.

### E7 — MEDIA · Reclasificaciones editoriales contra la letra de la fuente

Dos casos donde el investigador **contradice deliberadamente** el término que usa
la fuente. Ambos están documentados en `nota` e `incertidumbres`, lo que es
honesto, pero siguen siendo interpretación registrada como dato:

- **`forestalia-*`** (tres fichas, `potencia[0]`): el BOA dice «en total
  297,5 MW de **demanda IT** suministrada por la red de transporte»; la ficha lo
  registra como `conexion_red`. *Observación adicional no documentada:* el mismo
  BOA usa «146,5 MW» una segunda vez con otro sentido —«146,5 MW de generación
  renovable eólica y fotovoltaica asociada»— en el desglose de la Fase 1. Esa
  ambigüedad de la fuente debería estar en `incertidumbres` y no lo está.
- **`echelon-iberdrola-madrid-sur`** (`potencia[1]`): pv-magazine dice «144 MW
  para procesamiento de datos»; la ficha lo convierte en `tipo: it` razonando en
  la `nota` que *«expresión que se corresponde con carga TI»*. Es una deducción.
- **`stoneshield-pielagos-altamira`**: aquí el sesgo va al revés. La fuente
  atribuye los 100/500 MW a lo que *«the Penagos substation … will provide»*, lo
  que apunta a `conexion_red`; la ficha usa `no_especificado`. Conservador y
  aceptable, pero conviene que la decisión sea explícita.

**Corrección propuesta:** mantener las clasificaciones si se quiere, pero añadir
a `incertidumbres[].campo: potencia` la frase exacta que se está desestimando, de
modo que quede claro que es una decisión del proyecto y no lo que dice la fuente.
En Forestalia, añadir además la ambigüedad del doble uso de «146,5 MW».

### E8 — MEDIA · Alto Infrastructure: una fase que la fuente no da y un rango aplanado

**Fichero:** `data/sites/alto-infrastructure-escuzar-sp01.yaml`

Abriendo `datacentermarket.es` (`src-2`), el despliegue por fases que publica la
fuente es: primera fase operativa en verano de 2027 con **«entre 10 y 15 MW»**;
**«alcanzar los 25 MW hacia finales de ese mismo año»** (2027); y **70 MW de
potencia IT** al completarse en 2029.

- `potencia[4]`: **45 MW «acumulados en 2028» no aparece en la fuente.** El texto
  salta de 25 MW (2027) a 70 MW (2029) sin hito intermedio. Verificar contra
  `src-1`/`src-3`; si tampoco está, eliminar el registro.
- `potencia[2]`: la fuente da un **rango**, «entre 10 y 15 MW». La ficha guarda
  `valor_mw: 10` con `valor_mw_max: null`, aplanando el rango a su extremo
  inferior cuando el esquema tiene un campo justo para esto. Poner
  `valor_mw: 10, valor_mw_max: 15`.

Impacto en agregados: nulo (manda la cifra de campus, 70 MW IT). Impacto en
credibilidad: no nulo, porque es una cifra sin fuente.

### E9 — MEDIA · Microsoft Aragón: cita reescrita que altera el sentido

**Ficheros:** `microsoft-la-muela-centrovia.yaml`,
`microsoft-villamayor-de-gallego.yaml`, `microsoft-zaragoza-puerto-venecia.yaml`

`cita` registrada en `src-3` (La Muela):

> «Por ahora, la multinacional estadounidense tiene asegurados 50 megavatios de
> 'enchufe' para cada instalación; **el resto, hasta 300 MW por planta**, está
> previsto para una segunda fase.»

Al abrir `eldiario.es/aragon/…12768636.html`, el texto que aparece es:

> «Por ahora, la compañía solo tiene garantizados 50 megavatios de potencia para
> cada una de sus tres instalaciones, suficientes para completar la primera fase
> de sus planes. **En una segunda etapa aspira a alcanzar los 300 MW por
> planta.**»

Dos problemas. Uno, la cita no es literal: reescribe la frase entera. Dos, y más
grave, **el cambio altera el sentido**: «el resto, hasta 300 MW» sugiere 300 MW
*adicionales* a los 50; la fuente dice que 300 MW es el *objetivo total* de la
segunda etapa. La `nota` del registro de 300 MW amplifica el error —«ha
solicitado al Ministerio conexión para **otros** 300 MW»— y nada en la página
respalda ese «otros».

*Reserva del auditor:* no puedo descartar que el medio haya reescrito el párrafo
después de la consulta. Pero las dos versiones no pueden ser ambas literales, y
la registrada es la que empuja la cifra al alza.

Añadido: en las fichas de Villamayor y Puerto Venecia, `src-3` lleva una `cita`
**distinta**, sobre subestaciones y sobre 132 kV, que no contiene ninguna cifra
de MW — pero es la única fuente que respalda sus registros de 50 y 300 MW
(instancia de §E4).

**Corrección propuesta:** reemplazar la `cita` de `src-3` en las tres fichas por
el literal actual de la página; corregir la `nota` de `potencia[1]` eliminando
«otros»; y revisar si los 300 MW deben ser `conexion_red` en vez de
`no_especificado`, dado que la fuente los describe como potencia de «enchufe»
solicitada al Ministerio (900 MW en juego entre las tres fichas).

### E10 — MEDIA · Meta Talavera: la cita recorta «estimada»

**Fichero:** `data/sites/meta-talavera-de-la-reina-torrehierro.yaml`
(`src-talaveravalley`, y `potencia[0].referencia`)

- `cita` registrada: **«Potencia instalada: 248 MW** — Consumo hídrico: ~4.800
  millones de litros anuales»
- Lo que dice la ficha de Talavera Valley: **«Potencia instalada estimada |
  248 MW»**

Suprimir «estimada» convierte una estimación de una asociación empresarial local
en un dato declarado. Es un recorte que refuerza la afirmación, en la única
cifra de potencia que tiene el mayor proyecto de Meta en España. La `referencia`
del registro repite el recorte: «Potencia instalada del campus según ficha
divulgativa local».

No pude localizar en la tabla técnica la segunda mitad de la cita (los 4.800
millones de litros); puede estar en otro punto de la página, pero conviene
verificarlo.

**Corrección propuesta:** `cita: "Potencia instalada estimada | 248 MW"` y
`referencia: "Potencia instalada estimada del campus según ficha divulgativa
local"`. Verificar por separado la cifra hídrica y, si está, citarla aparte.

*Nota de tipo:* con «potencia instalada» explícito en la fuente, `no_especificado`
es discutible frente a `instalada_total`. Dado que quien lo dice es una
asociación local y la palabra es «estimada», mantener `no_especificado` me parece
defendible; pero entonces la `incertidumbre` debería decir que se desestima el
término de la fuente, no que la fuente «no distingue el tipo».

### E11 — MEDIA · Echelon: 144 MW IT sin ninguna fuente accesible

**Fichero:** `data/sites/echelon-iberdrola-madrid-sur.yaml` → `potencia[1]`

Abrí la página de la compañía (`echelon-dc.com`, `src-1`): confirma
«The site has already secured a 230MW grid connection» y «160,000 sqm data centre
campus», y **no menciona 144 MW en ningún punto**. La única fuente de los 144 MW
es `src-2` (pv-magazine), que `data/huellas.json` marca `bloqueada` (HTTP 403).

Resultado: 144 MW IT —el séptimo mayor valor de MW IT del conjunto, un 3,3 % del
total de cartera— descansan sobre una fuente inaccesible, una expresión que no
dice «IT» («144 MW para procesamiento de datos»), una reclasificación deducida
(§E7) y una ficha sin municipio, provincia ni coordenadas.

**Corrección propuesta:** no eliminar el dato, pero degradarlo: pasar
`potencia[1].tipo` a `no_especificado`, o marcar el registro con una
`incertidumbre` que diga expresamente que la clasificación como IT es una
deducción del proyecto y que la fuente no es verificable. La `confianza: baja` ya
está bien puesta.

### E12 — MEDIA · Quetta: un agregado de compañía registrado como capacidad de campus

**Fichero:** `data/sites/quetta-molins-de-rei.yaml` → `potencia[0]`

```yaml
valor_mw: 30
ambito: campus
referencia: "Capacidad conjunta de Quetta tras Molins de Rei y la ampliación de Madrid"
nota: "La fuente corporativa solo publica el agregado: 'a total capacity to 30 MW, 50% of its overall target of 60 MW'"
```

El `ambito: campus` significa, en este esquema, «la capacidad de este
emplazamiento». Los 30 MW son la capacidad **conjunta de la compañía** —Molins de
Rei *más* la ampliación de Madrid—, como reconoce la propia `referencia`. Se está
atribuyendo a un emplazamiento una cifra de cartera corporativa. Hoy no produce
doble conteo porque no hay ficha del centro de Madrid de Quetta, pero la
producirá en cuanto se añada.

**Corrección propuesta:** eliminar el registro de `potencia[]` y trasladar los
30 MW a `incertidumbres` («la compañía solo publica un agregado de 30 MW para
Molins de Rei y Madrid conjuntamente; no consta el reparto»), que es lo que el
Principio 2 del esquema («no se rellenan huecos») exige aquí.

### E13 — BAJA · `ultima_verificacion` no distingue nada

Las **163** fichas tienen `ultima_verificacion: 2026-08-29` y las **454**
fuentes `fecha_consulta: 2026-08-29`. No hay ninguna fecha inventada ni
incoherente —ninguna `fecha_publicacion` posterior a su `fecha_consulta`, ninguna
`fecha_dato` en el futuro— así que el campo no *miente*. Pero al ser idéntico en
todo el conjunto no aporta información: no permite saber qué se ha revisado
recientemente y qué arrastra desde hace meses, que es para lo que sirve el campo.

**Corrección propuesta:** que `scripts/check-updates.mjs` actualice
`ultima_verificacion` solo en las fichas cuyas fuentes ha reconsultado con éxito,
en vez de sellar todo el conjunto con la fecha de generación.

### E14 — BAJA · Cuatro centros de Alcalá y dos de Meco comparten píxel

`acs-alcala-de-henares-campus`, `microsoft-alcala-de-henares-campus`,
`templus-alcala-de-henares-mad01` y `vaultica-alcala-de-henares-mad01` reciben
todos la coordenada derivada **40.48195, −3.36398**; `microsoft-meco` y
`pure-dc-meco` comparten **40.55375, −3.32816**. Está correctamente marcado con
`coordenada_derivada: true` y `precision: municipio`, así que no es un dato
falso, pero en el mapa son marcadores superpuestos indistinguibles.

**Corrección propuesta:** dispersión determinista (jitter) en el render para
`coordenada_derivada: true`, o agrupación con contador. Es cosa del mapa, no de
los datos.

---

## Corregido durante la auditoría

Dos hallazgos que levanté contra la instantánea de las 20:00 y que el commit
`784efc0` resolvió mientras redactaba. Los documento porque describen fallos
reales del conjunto tal como estaba publicado, y porque el segundo dejó residuo.

### C1 — Salud de enlaces falseada en el export *(resuelto)*

`public/datos/sitios.json` declaraba `enlace.clase: "viva"` para **450 de 454**
referencias, incluidas **56** que `data/huellas.json` marcaba como `bloqueada`
(403/429/timeout) o `rota`. Causa: la versión de `huellas.json` vigente cuando
corrió el export no tenía ninguna entrada con `clase` (todas por defecto
`viva`), y `npm run data` no incluye `npm run refresh`.

Estado actual: correcto — 398 `viva`, 54 `bloqueada`, 2 `rota`, y **0**
discrepancias con `huellas.json`.

**Riesgo residual, sin corregir:** el orden sigue siendo una trampa. `npm run
data` (`validate → reconcile → db → export`) no ejecuta `refresh`, así que
cualquier export lanzado antes del siguiente `refresh` volverá a publicar
`viva` para todo. **Corrección propuesta:** o bien `estadoEnlace` devuelve
`null` (no `viva`) cuando la huella no tiene `visto`, o bien `refresh` entra en
la cadena de `data`.

### C2 — Potencia térmica sumada a los totales de capacidad *(resuelto parcialmente)*

En la instantánea auditada, **4.187,9 MW** de potencia de grupos electrógenos y
de generación asociada estaban tipados como `no_especificado` —que sí se suma— y
representaban el **46 %** del total publicado de 9.099,5 MW de esa categoría.
Encabezaban además la clasificación de «mayores centros de datos de España»:
AWS VDG2 aparecía como el mayor del país con 1.169 MW, que son MW **térmicos** de
motores diésel de respaldo.

Lo agrio del caso es que el esquema ya tenía los tipos correctos
(`termica_respaldo`, `generacion_asociada`, documentados en `docs/ESQUEMA.md` y
excluidos de `TIPOS_CAPACIDAD` en `export.mjs`) y las `nota` de las fichas decían
exactamente lo que pasaba («No es carga TI ni potencia de conexión a red»). La
prosa era correcta y el enum estaba mal, lo que anulaba justo la salvaguarda que
el proyecto había construido.

`784efc0` reclasificó nueve registros y el total `no_especificado` bajó a
5.022 MW. **Quedan dos casos sin reclasificar:** §E3a (SAMCA, 125,5 MW) y §E3b
(EdgeMode Mora, 300 MW).

---

## No verificable

Nada de lo siguiente cuenta como fallo del dato. Es lo que quedó fuera de
alcance y por qué.

### Bloqueos antibot (34 URL distintas · 56 referencias)

`data/huellas.json` las clasifica correctamente como `bloqueada` (401/403/429/
timeout) y no como rotas, lo que es la distinción acertada. Concentradas en
`datacenterdynamics.com` (7), `pv-magazine.es` (3), `ocolo.io` (3), `edged.es`
(3, aunque `WebFetch` sí las abrió) y páginas corporativas tras Cloudflare.

**Tres fichas tienen bloqueada la totalidad de sus fuentes** —una sola fuente
cada una, la nota de prensa de Microsoft de 2024—: `microsoft-algete`,
`microsoft-meco`, `microsoft-san-sebastian-de-los-reyes`. Las tres están
marcadas `estado: en_construccion` y `confianza: baja`. La afirmación es
plausible (la nota decía «avanza en la construcción […] se inaugurarán
próximamente») pero es de 2024 y hoy nadie puede reabrirla automáticamente.

### Enlaces rotos (2)

- `ayto-alcaladehenares.es/…campus-de-microsoft…` (`fetch failed`): es la
  **única fuente oficial** de `microsoft-alcala-de-henares-campus`, la que
  sostiene la aprobación inicial del Plan Especial. Prioridad alta para buscar
  copia en archivo.
- `datacenter.hello.global.ntt/…madrid-1-data-center` (`fetch failed`).

### PDF de boletines oficiales

`WebFetch` no sabe leer los PDF con streams comprimidos del BOA ni de
`aragon.es`: devuelve «no puedo extraer el texto». **No es un problema del
dato.** Los descargué y los leí con `pdftotext -layout`, y así verifiqué al
literal la AAI de AWS, el PIGA Rhodes, el Acuerdo de Epilon, el BOA de
Forestalia y la memoria del PIGA de SAMCA. **Recomendación operativa: cualquier
verificación futura de fuentes del BOA/BOE debe hacerse con `pdftotext`, no con
`WebFetch`.**

Quedaron sin abrir por falta de presupuesto de tiempo, no por bloqueo:
`aragon.es/documents/…til_1_01_memoria-piga…` (Tillion) y la orden de junio de
2026 que respalda los 750,66 MWt de `aws-el-burgo-de-ebro-bde`.

### Fuera de alcance deliberado

No he auditado `data/red/*`, `data/renovables/*` ni las 116 fichas no
seleccionadas. Los barridos mecánicos (§E4, precisión, salud de enlaces, tipo de
fuente) sí cubren las 163.

---

## Juicio final

**El conjunto se sostiene en lo sustantivo y falla en la trazabilidad.**

Separo las dos cosas porque no se comportan igual.

**Sobre las cifras (sólido).** Abrí las fuentes de 62 datos concretos. En
**ninguno** encontré una cifra que la fuente citada no contuviera. No hay ni un
solo caso de número inventado, que era el fallo más grave que buscaba. Cuando
comprobé lo más caro de falsificar —las coordenadas `exacta` contra las UTM de
los expedientes de INAGA— salió coincidencia **al metro en los siete casos**. Los
únicos dos números que no localicé en su fuente son los 45 MW de una fase de Alto
Infrastructure (§E8), que no afecta a ningún agregado, y los 144 MW IT de Echelon
(§E11), que están en una fuente que no pude abrir. Eso es un porcentaje de acierto
que no esperaba encontrar.

**Sobre la clasificación de tipos (mejorable, con un patrón).** Cinco
reclasificaciones cuestionables sobre las ~50 revisadas (§E3a, §E3b, §E6, §E7 ×2).
Tienen un rasgo común y tranquilizador: **todas están documentadas en `nota` o en
`incertidumbres`**. No hay conversiones ocultas por PUE ni saltos MVA→MW; hay
decisiones editoriales explícitas con las que se puede discrepar. La única que me
parece claramente equivocada es Saltburn (§E6), porque usa prensa para
recalificar lo que dice un boletín oficial, y ocurre en una ficha de
`confianza: alta`.

**Sobre la trazabilidad (aquí está el problema).** El **26,5 %** de los registros
de potencia no lleva en su `cita` la cifra que dice respaldar (§E4). Sumado a las
34 URL inaccesibles, hay un bloque de datos que son —hasta donde pude
comprobar— correctos, pero que un tercero **no puede verificar con lo que el
fichero le da**. Para un proyecto cuyo primer principio es «Nada sin fuente», ese
es el fallo de fondo, y es el que yo arreglaría antes que ninguno.

**Sobre la agregación (dos fallos reales, uno de ellos serio).** §E1 (SAMCA
publica 72 MW donde la fuente da 72 por cada uno de tres) es un error demostrable
con la aritmética del propio expediente, y su causa —`edificio` compartiendo
prioridad con `campus`— es estructural, no un despiste. §E2 (el export inventa
una coordenada que la ficha rehusó dar, y sube el `precision` declarado) es el
único punto donde encontré que la tubería **contradice** al fichero fuente, y por
eso lo pongo entre los graves aunque afecte a una sola ficha: es un fallo de
principio.

**Sobre lo que los totales publicados significan.** Las cifras agregadas resisten
técnicamente, pero se prestan a malinterpretación y el sitio debería decirlo más
alto de lo que lo dice:

- De los **4.308,5 MW IT** de cartera, el **46,4 %** son dos fichas —MERLIN
  Navalmoral y MERLIN Valdecaballeros, 1.000 MW cada una— que descansan sobre
  **una única página de relaciones con inversores de enero de 2025**. Y
  Valdecaballeros está en estado `anunciado` con una `incertidumbre` que dice
  «No consta expediente urbanístico ni ambiental iniciado a agosto de 2026».
- El **54 %** de todos los MW IT está en estado `anunciado`; solo el **0,6 %**
  (27,2 MW) está `operativo`. El **86,5 %** se apoya en `confianza: media`.
- La cobertura es baja y el conjunto lo declara: 16 % de las fichas tienen dato
  de MW IT, 6 % de `instalada_total`. **63 de 163 fichas no tienen ninguna cifra
  de potencia.** Eso es honesto, y prefiero eso a que estuvieran rellenas.

**Proporción de lo auditado que se sostiene.** De los 62 datos con veredicto:
**34 confirmados (55 %)**, **16 confirmados con reserva (26 %)** —la reserva casi
siempre es §E4, la cita que no lleva la cifra—, **8 no verificables (13 %)** por
bloqueo o enlace roto, y **9 errores (15 %)**, de los cuales **3 graves**. Ningún
dato refutado por la fuente.

Dicho en una frase: **le creo a este conjunto los números, y no le creo todavía
las citas.** El trabajo de investigación es serio y en los expedientes oficiales
es excelente; el eslabón débil es el campo `cita` y la tubería que publica. Ambos
se arreglan sin volver a investigar nada, que es justo lo que pedía el encargo.

**Orden de ataque recomendado:** §E4 (afecta a 50 registros y es mecanizable) →
§E1 y §E2 (los dos fallos de tubería) → §E3a y §E3b (residuo de `784efc0`) →
§E6, §E9, §E10 (citas y tipos con impacto en cifras destacadas) → el resto.
