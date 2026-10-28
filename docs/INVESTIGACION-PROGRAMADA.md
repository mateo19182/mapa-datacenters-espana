# Investigación programada

El temporizador local `ops/mapa-research.timer` ejecuta la investigación los lunes
a las 09:00 de Europe/Madrid. Requiere el equipo encendido, el gestor de usuario,
Node.js, OpenCode y la sesión de `gh` vigentes. El agente (OpenCode, `.opencode/agents/mapa-research.md`) tiene un límite de 45 minutos: prueba Opus, reintenta a los dos minutos y después usa `gpt-6.1-sol`. Solo puede leer el repositorio, buscar y leer la web y escribir bajo `research/`; no tiene shell.
El ejecutor usa un worktree aislado y una única propuesta abierta en
`research/semanal`. Si sigue pendiente un PR anterior, recupera su material de
investigación y lo actualiza. Conserva las decisiones factuales de `main`.

Solo admite cambios en `research/revision-semanal.md`, nuevas candidatas en
`research/hallazgos.yaml` y archivos nuevos `research/propuestas-revision/<id>.yaml`.
Rechaza otras rutas, borrados, renombres, enlaces simbólicos, cambios de decisiones
anteriores y propuestas que no pasan el esquema. Las propuestas se comprueban en
una copia temporal del conjunto de datos; los conflictos se dejan para revisión.
No se trasladan automáticamente desde `research/` a `data/propuestas/`.

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
Incluye el periodo examinado y una tabla de búsquedas sin resultado con
identificador, fecha, consulta, resultado y condición para retomarla. Si reabres
una pista fallida o descartada, señala qué publicación, documento o fecha alcanzada
justifica repetirla. No repitas consultas anteriores solo para rellenar el informe.

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
El ejecutor valida los borradores y las propuestas; cualquier error impide abrir o actualizar el PR.

Entrega un resumen con enlaces a los archivos y distingue hechos, inferencias y
preguntas abiertas. Si no encuentras novedades verificables, escribe ese resultado
con las búsquedas realizadas. No inventes una actualización para producir un diff.

## Memoria y registros del agente

El contexto de cada ejecución reúne pendientes vencidos, prioridad, pistas nuevas,
decisiones publicadas o descartadas, el PR pendiente, informes anteriores y la
evolución técnica de fuentes. Lee ese contexto antes de buscar. Los cambios de
plantilla, una primera huella PDF o la ausencia de texto histórico no son hechos
nuevos del proyecto. Una cola menor tampoco demuestra una mayor exactitud factual.

El estado local vive en `~/.local/state/mapa-datacenters/research/`, con permisos
privados y exclusión de ejecuciones simultáneas. `history.json` conserva 30 resultados.
Cada directorio `run.*` guarda contexto, informe, diff, validación, salida del agente (`agente.log`)
y `ejecucion.json`. También se conservan fallos, tiempos agotados y publicaciones
fallidas; los registros individuales se limitan a sus últimos 4 MiB. El worktree
se elimina tras archivar la entrega. Si falla la conservación, el ejecutor termina
con error y conserva el worktree; la poda no elimina ese directorio hasta recuperarlo.
La siguiente investigación recibe los últimos informes
y fallos, sin tratarlos como evidencia primaria.

Consulta de diagnóstico:

```bash
systemctl --user status mapa-research.service
journalctl --user -u mapa-research.service --since '7 days ago'
cat ~/.local/state/mapa-datacenters/research/history.json
```

## Trabajo mensual

La primera ejecución semanal que termine satisfactoriamente cada mes incluye
esta revisión. Si el equipo estuvo apagado el primer lunes o falló el trabajo,
se intenta en la siguiente ejecución; la fecha del calendario no la omite.

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

`npm run refresh:informe` y la exportación reconstruyen el informe técnico desde las
mismas observaciones y plazos que `/datos/revision.json`. Regenerar el informe no es
volver a consultar las fuentes. Los 404 y 410, bloqueos y fallos de red o servidor se
cuentan por separado. Un PDF antes vigilado solo por tamaño necesita una primera
huella de contenido; ese cambio de método no prueba que el documento haya cambiado.
Antes de comprobar fuentes, el flujo semanal fusiona las observaciones del PR automático
anterior, aunque siga sin integrar. Conserva las huellas aceptadas de `main` y las fechas
de detección de los cambios; no importa revisiones factuales de esa rama.
La integración de propuestas tampoco renueva fechas factuales de fichas existentes.
Un alta necesita una fecha de revisión explícita, distinta de la fecha de ejecución.

El RSS `/actualizaciones.xml` usa exclusivamente las novedades revisadas de
`data/actualizaciones.yaml`, resueltas y validadas por la construcción. Las
candidatas y los fallos de enlaces no entran en ese canal.

## Flujo técnico de GitHub Actions

`revision-fuentes.yml` comprueba fuentes y REE, valida y genera los informes.
En las publicaciones de `main`, mantiene la integración existente de adiciones
sin conflicto de `data/propuestas/`. Los conflictos y las fechas factuales quedan
protegidos por el integrador. La investigación local no puede escribir esas propuestas.

Los códigos 10 de fuentes/REE y 11 de conflictos son trabajo pendiente, no fallos
de ejecución. Un error distinto queda identificado por fase y hace fallar el flujo,
aunque se conserven sus observaciones y artefactos. La recuperación de una rama
pendiente fallida bloquea la actualización del PR para evitar perder evidencias.
Las validaciones fallidas también bloquean su publicación.

Las instantáneas de texto viven en `build/fuentes-cache/`, fuera de Git y de la
publicación. Actions usa caché y un respaldo de instantáneas como artefacto durante
30 días. Cuando falta la caché, busca el último respaldo de este mismo workflow en
la rama actual o `main`, con evento programado o despacho manual y repositorio
propio. No usa ejecuciones de PR o forks. Distingue arranque sin respaldo y fallo
de restauración; las fuentes se comprueban igualmente sin inventar texto histórico.
El resumen por ejecución es
`build/monitorizacion/ejecucion.json`; los códigos y registros de cada fase están
en `build/monitorizacion/pasos/`. El historial técnico de hasta 52 ejecuciones usa
`data/seguimiento-fuentes.json` y se explica en `research/informe-evolucion-fuentes.md`.
El PR semanal pendiente aporta sus observaciones e historial a la siguiente ejecución,
sin aceptar huellas. El resumen y los informes se conservan como artefactos durante
30 días incluso tras un fallo. Una caída de la caché o de la subida de artefactos
no sustituye el resultado de las comprobaciones.

Para probar una rama publicada sin abrir un PR ni integrar datos:

```bash
gh workflow run revision-fuentes.yml --ref nombre-de-la-rama -f publicar=false
gh run list --workflow revision-fuentes.yml --limit 3
```

El parámetro opcional `fuente` limita una prueba de rama a una URL ya registrada;
en `main` se ignora y se comprueba el conjunto completo.
El despacho manual usa simulación por defecto. Solo `main`, con el horario semanal
o `publicar=true`, puede actualizar `revision/fuentes`. Las pruebas locales del
runner usan comandos simulados y repositorios temporales, sin lanzar una sesión
real de investigación ni escribir en remotos externos:

```bash
node --test scripts/research-agent.test.mjs scripts/weekly-step.test.mjs
```

`MAPA_RESEARCH_REPO`, `MAPA_RESEARCH_STATE_DIR`, `MAPA_RESEARCH_AGENT_BIN`,
`MAPA_RESEARCH_GH_BIN` y `MAPA_RESEARCH_GITHUB_REPO` permiten aislar esas pruebas.
No cambian los límites de tiempo, el ámbito de escritura ni los permisos del agente.

Dependabot propone actualizaciones semanales de npm y acciones, con agrupación y
límite de PRs abiertos, sin fusión automática. CI consulta `npm audit` y bloquea
vulnerabilidades altas o críticas. Un fallo del registro se identifica como auditoría
incompleta; no se presenta como conjunto libre de vulnerabilidades.

Los tres flujos fijan `ubuntu-24.04` para conservar la distribución comprobada.
Las acciones usan Node 24 como runtime; la aplicación sigue probándose con Node 22.
Cambiar de imagen se revisará como una actualización explícita.
