# Automatización semanal, 17 de octubre de 2026

## Cambios implementados

El ejecutor local conserva hasta 30 resultados con contexto, registros, validación,
informe y entrega documental. Elimina el worktree después de archivar también archivos
nuevos y cambios ya confirmados localmente. Si falla el archivo, conserva el worktree,
registra el fallo y no devuelve éxito. La poda respeta esas entregas pendientes.

La siguiente investigación recibe pendientes priorizados, decisiones anteriores,
búsquedas fallidas y condiciones para retomarlas, además de la evolución técnica de
fuentes. Las secciones de búsquedas se extraen expresamente aunque estén al final de
un informe largo. Incluye también las últimas revisiones normativas y sus matices de
tramitación. No trata esos informes como fuentes primarias ni reabre asuntos por defecto.

Se reutiliza un PR de investigación abierto en lugar de crear otro cada semana.
Su descripción se actualiza por REST: el `gh` instalado falla al editarla mediante
la consulta antigua de Projects (classic). Se valida la URL del repositorio y se
conservan rama y entrega si la actualización falla.
La recuperación conserva las candidatas de `main` y del PR, sin importar sus cambios
factuales. Las versiones incompatibles se detienen antes del push y permanecen en sus
ramas. Un lease impide sobrescribir cambios remotos ocurridos durante la investigación.

La guardia comprueba rutas, enlaces simbólicos, borrados, renombres, decisiones previas,
identificadores y fechas futuras. Las propuestas se validan en un conjunto temporal.
La revisión mensual se reintenta después de un fallo o de un primer lunes perdido.
Se mantienen el límite de 45 minutos, la política de revisión automática de Codex y
su ámbito de trabajo. La ayuda local de Codex 0.163.0 confirma los parámetros utilizados
y la entrega del contexto por entrada estándar. No se lanzó una investigación autónoma.

En GitHub Actions, cada fase conserva su código y registro. Los códigos 10 de fuentes
y REE y 11 de conflictos se distinguen de errores de ejecución. El resumen final no
oculta fallos aunque se suban artefactos. `main` conserva la integración autorizada de
adiciones sin conflicto de `data/propuestas/`; el investigador sigue limitado a
`research/`. Los despachos de ramas simulan esa integración y no publican un PR técnico.

El historial técnico de fuentes y sus informes se conservan en el PR pendiente. Las
instantáneas de texto usan caché y un respaldo separado como artefacto durante 30 días.
El respaldo es necesario porque [GitHub puede eliminar cachés sin acceso durante siete
días](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching#usage-limits-and-eviction-policy),
un margen insuficiente para garantizar continuidad semanal. La recuperación admite
solo ejecuciones completadas de este workflow, del repositorio propio, con evento
programado o despacho manual, en la rama actual o `main`. Excluye PRs, forks y artefactos
caducados. Arranque sin respaldo y fallo de recuperación quedan diferenciados; el
comprobador continúa sin inventar comparaciones históricas. El texto no entra en Git
ni en la web.

## Acciones contrastadas

Se consultaron releases oficiales y sus `action.yml`; los usos quedan fijados a SHA.
Todas estas acciones usan Node 24. La aplicación mantiene Node 22 y los tres flujos
fijan `ubuntu-24.04`, evitando cambiar de distribución durante esta entrega.

| Acción | Release |
| --- | --- |
| checkout | [7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) |
| setup-node | [7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0) |
| upload-artifact | [7.0.2](https://github.com/actions/upload-artifact/releases/tag/v7.0.2) |
| download-artifact | [8.0.2](https://github.com/actions/download-artifact/releases/tag/v8.0.2) |
| cache | [6.1.0](https://github.com/actions/cache/releases/tag/v6.1.0) |
| create-pull-request | [8.1.1](https://github.com/peter-evans/create-pull-request/releases/tag/v8.1.1) |
| wrangler-action | [4.1.3](https://github.com/cloudflare/wrangler-action/releases/tag/v4.1.3) |

Dependabot propone actualizaciones semanales de npm y acciones con agrupación y límite
de PRs abiertos. No se ha configurado fusión automática. CI bloquea vulnerabilidades
altas o críticas; un fallo del registro se presenta como auditoría incompleta.

## Comprobaciones

- Pruebas con repositorios temporales y comandos simulados: conservación de candidatos,
  propuestas y archivos tras fallos; un único PR; actualización y recuperación; fechas;
  cambios fuera de ámbito; memoria de búsquedas; códigos de salida y resúmenes.
- Pruebas del respaldo de instantáneas: exclusión de PRs y forks, rama, antigüedad,
  artefactos caducados, caída de API y arranque sin respaldo.
- Revisión independiente de los casos de pérdida de evidencia y fechas futuras,
  con correcciones y regresiones incorporadas.
- `actionlint` 1.7.12, sintaxis Bash, verificación systemd y `git diff --check` correctos.
- Ejecución real de la puerta `check-npm-audit.mjs`: cero vulnerabilidades altas y críticas.

Se completaron dos ensayos remotos de la rama, sin publicar un PR técnico. El
[primero](https://github.com/mateo19182/mapa-datacenters-espana/actions/runs/39031389562)
comprobó una referencia BOE, REE, simulación de propuestas, validación estricta y
conservación de informes y texto. El resumen identifica alcance parcial: una fuente
de 1.021. Después se eliminó solo la caché de texto creada por ese ensayo.

El [segundo](https://github.com/mateo19182/mapa-datacenters-espana/actions/runs/39031525445)
recuperó el respaldo del primer ensayo mediante download-artifact y completó la misma
consulta parcial. Se verificaron sus metadatos y el éxito del paso de descarga.
`main` sigue comprobando el conjunto completo. No se lanzó una investigación autónoma
de 45 minutos durante estas pruebas.

Estos cambios conservan memoria y hacen visibles los fallos. No demuestran por sí solos
que las propuestas sean más exactas; fuentes, discrepancias y decisiones siguen
requiriendo revisión factual.
