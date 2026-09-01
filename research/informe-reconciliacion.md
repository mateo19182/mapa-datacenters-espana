# Informe de reconciliación

Generado el 2026-09-01 por `npm run reconcile` sobre 203 emplazamientos.

Nada de lo que sigue se corrige automáticamente: son propuestas para decidir a mano.

- Variantes de nombre de operador: **3**
- Posibles emplazamientos duplicados: **1**
- Potencias de fase que superan la cifra global: **0**
- Estados en conflicto con sus fases: **0**
- Fechas posteriores a hoy: **0**
- Editores que no cuadran con el dominio: **2**

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
| `uvigo-vigo-estacion-optica-terrena` | `vqcc-uvigo-vigo-marcosende` | mismo operador (Vigo Quantum Communication Center (VQCC), centro atlanTTic de la Universidade de Vigo) · mismo municipio (Vigo) · comparten «universidade», «vqcc» |

## Editores que no cuadran con el dominio

Suele ser una cita de segunda mano: el contenido es de un medio pero el enlace apunta a otro. Conviene enlazar el original o declarar el editor real.

| Emplazamiento | Fuente | Editor declarado | Dominio |
|---|---|---|---|
| `edgnex-madrid-vicalvaro` | src-1 | EDGNEX Data Centers by DAMAC (nota de prensa) | zawya.com |
| `nxn-valencia-vara-de-quart-nx01` | src-7 | InfraRed Capital Partners | ircp.com |
