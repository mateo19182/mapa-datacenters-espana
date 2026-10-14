# Investigación programada

El temporizador local `ops/mapa-research.timer` lanza
`scripts/run-research-agent.sh` cada lunes a las 09:00, hora del equipo. Hace
falta que el equipo y el gestor de servicios de usuario estén en marcha, y que
`codex` y `gh` sigan autenticados. El script limita la ejecución a 45 minutos,
usa un worktree nuevo y abre un PR con el informe. Rechaza cambios fuera de
`research/revision-semanal.md`, `research/hallazgos.yaml` y `research/propuestas-revision/`.
El primer lunes de cada mes añade la revisión mensual al mismo informe.

Para instalarlo después de integrar estos archivos en `main`:

```bash
systemctl --user link "$PWD/ops/mapa-research.service" "$PWD/ops/mapa-research.timer"
systemctl --user enable --now mapa-research.timer
systemctl --user list-timers mapa-research.timer
```

## Trabajo semanal

Revisa publicaciones de los últimos siete días sobre centros de datos en España.
Empieza por BOE y boletines autonómicos, operadores, ayuntamientos y Red Eléctrica.
Busca tanto emplazamientos nuevos como cambios de estado, potencia, ubicación o
permisos en las fichas existentes. Usa prensa para localizar pistas y comprueba
cada hecho en la fuente primaria siempre que exista.

Lee `docs/ESQUEMA.md`, `data/revision.yaml`, `research/hallazgos.yaml`, los YAML pertinentes y el informe anterior antes de
proponer nada. Comprueba identificadores, alias, municipio y operador para evitar
duplicados. No infieras MW IT de potencia de conexión, ni conviertas MVA a MW.

Escribe `research/revision-semanal.md` con una tabla de hallazgos. Cada fila debe
incluir fecha del hecho, URL primaria, identificador existente o candidato,
campo afectado, dato anterior, dato propuesto, fragmento de evidencia y decisión
pendiente. Separa los resultados sin fuente primaria y los hallazgos descartados.
Incluye búsquedas realizadas y el periodo examinado para que se vean los huecos.

Añade al informe una sección «Candidatas a Últimos cambios», con un título breve,
fecha del hecho, identificador afectado y fuente primaria para cada novedad que
merezca publicarse. Distingue el día del hecho del día de incorporación al mapa.
Las comprobaciones de enlaces y las pistas sin confirmar no son novedades.
Después de revisar e integrar los datos, la publicación añade las entradas
aprobadas a `data/actualizaciones.yaml`. La construcción valida fechas, destinos
y referencias y genera `/actualizaciones` y `/datos/actualizaciones.json`.
El trabajo semanal sigue limitado a material para revisión y no escribe ese YAML.

Si hay evidencia suficiente, crea propuestas parciales en
`research/propuestas-revision/<id>.yaml` con la forma de `data/propuestas/`.
No escribas en `data/propuestas/`, `data/sites/` ni `data/red/`: el flujo semanal
integra automáticamente las propuestas de `data/propuestas/` y esa decisión
corresponde a una persona. No cambies `ultima_verificacion` ni aceptes huellas.
Ejecuta `npm run validate` si modificas datos, y deja los errores en el informe.

Entrega un resumen con enlaces a los archivos y distingue hechos, inferencias y
preguntas abiertas. Si no encuentras novedades verificables, escribe ese resultado
con las búsquedas realizadas. No inventes una actualización para producir un diff.

## Trabajo mensual

Revisa `research/informe-ree.md` y la página oficial de capacidad de demanda de
REE. Si hay un CSV posterior al de `data/red/capacidad.yaml`, registra la fecha y
el enlace. Propón una reconciliación por código de subestación y comprueba los
nombres y unidades de las columnas antes de cambiar cifras. La fecha del YAML
solo se cambia junto con los valores correspondientes.

Revisa además normas en tramitación y fechas prometidas ya vencidas. Registra en
el mismo informe qué ha cambiado y qué sigue sin fuente accesible.

## Cola persistente de revisión

`data/revision.yaml` conserva las decisiones revisadas. `research/hallazgos.yaml`
acumula candidatas de la investigación programada. Usa identificadores estables;
comprueba ambos archivos antes de añadir una entrada. Si el asunto ya existe,
explica la evidencia nueva en el informe semanal y enlaza su identificador.
No dupliques la candidata, no cambies estados anteriores y no borres entradas.
El guardado automático valida esta regla antes de crear el PR.

Cada candidata incluye `id`, `titulo`, `tipo`, `estado`, `prioridad`, `detectado`,
`revisar_antes`, `motivo`, `siguiente_paso`, `enlaces` y `fuentes`. Las fuentes
llevan URL, título y `primaria`; una publicación revisada puede citar prensa sin
convertirla en fuente primaria. Solo permite `detected`, `awaiting_primary` o
`proposed` en las candidatas nuevas, sin `revisado`. Una propuesta requiere
fuente primaria. `published` y `discarded` son decisiones editoriales y solo se
registran tras revisión. `published` significa incorporado al registro, con
identificador y destino existentes, no una promesa de que se integrará.

La publicación genera `/datos/revision.json` y `/revision`, donde los seguimientos
se distinguen de los hechos incorporados. Los plazos son prioridades de trabajo,
no vencimientos administrativos: 14 días para trámites, obras y normas abiertas;
30 para anuncios; 90 para instalaciones operativas y normas vigentes; 180 para
proyectos paralizados o cancelados. Una previsión mensual o anual vence al final
del mes o del año, y un acto administrativo no se trata como fecha de apertura.

Las comprobaciones técnicas viven en `data/huellas.json`. Conservan por separado
la huella aceptada y el contenido cambiado pendiente. Una URL que responde o no
ha cambiado no renueva `ultima_verificacion` de los hechos. La opción histórica
`--sellar` ya no cambia fechas de las fichas; se conserva por compatibilidad.
Aceptar una huella cambiada sigue requiriendo una revisión explícita.

El RSS `/actualizaciones.xml` usa exclusivamente las novedades revisadas de
`data/actualizaciones.yaml`, resueltas y validadas por la construcción. Las
candidatas y los fallos de enlaces no entran en ese canal.
