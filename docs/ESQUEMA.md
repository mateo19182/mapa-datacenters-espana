# Esquema de datos

Cada emplazamiento vive en su propio fichero YAML en `data/sites/<id>.yaml`.
Un fichero = un emplazamiento físico (campus o edificio independiente). Las fases
van **dentro** del fichero del emplazamiento, nunca como ficheros sueltos.

La fuente de verdad son estos YAML. El build los valida, los carga en SQLite
(`build/datacenters.db`) y exporta JSON/GeoJSON para el sitio estático.

## Principios

1. **Nada sin fuente.** Todo dato relevante (potencia, estado, coordenadas,
   fechas, operador) lleva referencia a una fuente listada en el mismo fichero.
2. **No se rellenan huecos.** Si un dato no consta, se omite el campo o se pone
   `null`. Nunca se estima, se interpola ni se deduce «por analogía».
3. **No se mezclan tipos de potencia.** MW IT, MW de conexión a red y potencia
   instalada total son campos distintos y no se suman entre sí.
4. **Las contradicciones se conservan.** Si dos fuentes fiables discrepan, se
   registran ambas en `potencia[]` y se documenta el choque en `incertidumbres[]`.
5. **Un emplazamiento, un registro.** Los nombres alternativos van en `alias`,
   no en registros duplicados.

## Fichero de emplazamiento

```yaml
id: aws-aragon-villanueva-gallego     # kebab-case, estable, nunca se renombra
nombre: "AWS Región Aragón — Villanueva de Gállego"
alias:
  - "Amazon Villanueva de Gállego"
  - "AWS ZAZ2"
tipo: campus                          # campus | edificio
operador: "Amazon Web Services"       # quien opera el CPD
propietario: "Amazon Web Services"    # dueño del inmueble/sociedad, si difiere
cliente_ancla: null                   # inquilino principal si es build-to-suit
modelo: hyperscale                    # hyperscale | colocation | mayorista | corporativo | edge | desconocido

ubicacion:
  municipio: "Villanueva de Gállego"
  provincia: "Zaragoza"
  ccaa: "Aragón"
  direccion: "Plataforma Logística ..."
  lat: 41.7654
  lon: -0.8321
  precision: exacta                   # exacta | aproximada | municipio | desconocida
  fuentes: [src-1]

estado: operativo
# anunciado | en_tramitacion | permisos_concedidos | en_construccion
# | parcialmente_operativo | operativo | ampliacion_en_construccion
# | paralizado | cancelado | desconocido
estado_detalle: "Fase 1 operativa desde 2022-11; fases 2 y 3 en construcción."
estado_fuentes: [src-1, src-2]
fecha_puesta_en_servicio: "2022-11"   # ISO parcial admitido: YYYY | YYYY-MM | YYYY-MM-DD

potencia:
  - tipo: it                          # it | conexion_red | instalada_total | no_especificado
    valor_mw: 40
    ambito: fase                      # campus | edificio | fase
    referencia: "Fase 1"              # a qué se refiere exactamente
    estado_asociado: operativo        # estado de eso que se mide
    fecha_dato: "2024-05-01"          # cuándo era cierto según la fuente
    fuentes: [src-1]
    nota: "La fuente dice 'capacidad TI'."

fases:
  - nombre: "Fase 1"
    estado: operativo
    fecha_puesta_en_servicio: "2022-11"
    superficie_m2: 12000
    fuentes: [src-1]

conexion_electrica:
  subestacion: "SE Villanueva 400 kV"
  tension_kv: 400
  titular_red: "Red Eléctrica"        # o la distribuidora que corresponda
  mw_solicitados: null
  mw_concedidos: null
  fuentes: [src-3]

superficie_parcela_m2: null
superficie_construida_m2: null
inversion_anunciada_eur: null         # dato documental, no valoración
refrigeracion: null                   # texto breve si consta (aire, agua, consumo)
enlaces_proyecto: []                  # web oficial del proyecto/expediente

incertidumbres:
  - campo: potencia
    descripcion: "La prensa cita 200 MW; el expediente ambiental habla de 100 MW IT."
    fuentes: [src-2, src-3]

confianza: alta                       # alta | media | baja — ver criterios abajo
ultima_verificacion: "2026-08-29"

fuentes:
  - id: src-1
    url: "https://..."
    titulo: "Título literal de la página o documento"
    editor: "Amazon Web Services"
    tipo: empresa
    # oficial | empresa | asociacion | prensa_especializada
    # | consultora | prensa_general | otro
    fecha_publicacion: "2024-05-01"
    fecha_consulta: "2026-08-29"
    cita: "Fragmento literal breve que respalda el dato."
```

## Niveles de confianza

- **alta** — potencia, ubicación y estado respaldados por fuente oficial o de la
  propia compañía, sin contradicciones abiertas.
- **media** — respaldado por prensa especializada o consultora, o hay una fuente
  primaria pero con datos parciales.
- **baja** — una sola fuente secundaria, datos antiguos, o contradicciones sin
  resolver. Se marca visiblemente en la ficha.

## Tipos de potencia

| tipo | significado |
|---|---|
| `it` | Carga TI / capacidad de servidor. Lo que se usa para comparar CPDs. |
| `conexion_red` | Potencia de acceso solicitada o concedida en el punto de conexión. Siempre mayor que la TI. |
| `instalada_total` | Potencia eléctrica instalada del edificio (incluye clima, pérdidas). |
| `no_especificado` | La fuente da «MW» sin decir de qué tipo. Se registra tal cual y **no** se compara con los anteriores. |

Nunca se convierte entre tipos aplicando un PUE supuesto.

## Red eléctrica

`data/red/subestaciones.yaml` y `data/red/actuaciones.yaml` siguen el mismo
patrón de procedencia (`fuentes[]` + `ultima_verificacion`). La geometría de las
líneas de 220/400 kV se cachea en `data/red/lineas.geojson` desde OpenStreetMap
(ODbL) mediante `scripts/fetch-osm-grid.mjs`; no se consulta en tiempo real.

## Renovables y almacenamiento

`data/renovables/*.yaml` solo recoge activos con vínculo documentado a un cluster
o a un CPD concreto (PPA firmado, misma promotora, conexión al mismo nudo). No es
un inventario general de renovables en España.
