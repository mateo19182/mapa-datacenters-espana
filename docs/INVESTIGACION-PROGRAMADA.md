# Investigación programada

El temporizador local `ops/mapa-research.timer` lanza
`scripts/run-research-agent.sh` cada lunes a las 09:00, hora del equipo. Hace
falta que el equipo y el gestor de servicios de usuario estén en marcha, y que
`codex` y `gh` sigan autenticados. El script limita la ejecución a 45 minutos,
usa un worktree nuevo y abre un PR con el informe. Rechaza cambios fuera de
`research/revision-semanal.md` y `research/propuestas-revision/`.
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

Lee `docs/ESQUEMA.md`, los YAML pertinentes y el informe anterior antes de
proponer nada. Comprueba identificadores, alias, municipio y operador para evitar
duplicados. No infieras MW IT de potencia de conexión, ni conviertas MVA a MW.

Escribe `research/revision-semanal.md` con una tabla de hallazgos. Cada fila debe
incluir fecha del hecho, URL primaria, identificador existente o candidato,
campo afectado, dato anterior, dato propuesto, fragmento de evidencia y decisión
pendiente. Separa los resultados sin fuente primaria y los hallazgos descartados.
Incluye búsquedas realizadas y el periodo examinado para que se vean los huecos.

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
