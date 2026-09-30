#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
state_dir="${XDG_STATE_HOME:-$HOME/.local/state}/mapa-datacenters/research"
mkdir -p "$state_dir"
exec 9>"$state_dir/lock"
flock -n 9 || { echo 'Ya hay una investigación en curso'; exit 0; }

run_dir="$(mktemp -d "$state_dir/run.XXXXXXXX")"
checkout="$run_dir/checkout"
branch="research/semanal-$(date -u +%Y%m%d-%H%M%S)"
cleanup() {
  git -C "$repo_dir" worktree remove --force "$checkout" >/dev/null 2>&1 || true
  rm -rf "$run_dir"
}
trap cleanup EXIT

git -C "$repo_dir" fetch origin main
git -C "$repo_dir" worktree add -b "$branch" "$checkout" origin/main

prompt='Sigue docs/INVESTIGACION-PROGRAMADA.md y realiza el trabajo semanal para los últimos siete días. Limita la investigación a un máximo de 12 hallazgos relevantes. Escribe el informe y, si hay evidencia suficiente, borradores de propuestas en research/propuestas-revision/. No modifiques otros archivos, no hagas commits y no publiques nada. Trabaja sin pedir aclaraciones.'
if (( 10#$(date +%d) <= 7 )); then
  prompt+=' Es el primer lunes del mes: realiza también el trabajo mensual y anótalo en el mismo informe.'
fi
if ! timeout 45m /home/mateo/.local/bin/codex exec \
  -C "$checkout" --approve-for-me --ephemeral \
  -o "$run_dir/resultado.txt" "$prompt" >"$run_dir/codex.log" 2>&1; then
  tail -n 80 "$run_dir/codex.log" >&2
  exit 1
fi

# El agente solo puede entregar material para revisión. La publicación ocurre
# después de que una persona revise y fusione el PR.
while IFS= read -r linea; do
  archivo="${linea:3}"
  case "$archivo" in
    research/revision-semanal.md|research/propuestas-revision/*.yaml) ;;
    *) echo "Cambio fuera del alcance: $archivo" >&2; exit 1 ;;
  esac
done < <(git -C "$checkout" status --porcelain --untracked-files=all)

git -C "$checkout" add -A -- research/
if git -C "$checkout" diff --cached --quiet; then
  echo 'Sin novedades verificables; no se abre PR'
  exit 0
fi

git -C "$checkout" commit -m "Proponer investigación semanal de centros de datos"
git -C "$checkout" push -u origin "$branch"
gh pr create --repo mateo19182/mapa-datacenters-espana --base main --head "$branch" \
  --title "Investigación semanal $(date +%F)" \
  --body 'Hallazgos y propuestas documentales de la investigación programada. Revisar fuentes, duplicados y conflictos antes de trasladar nada a data/.'
