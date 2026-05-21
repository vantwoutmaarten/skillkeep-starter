#!/usr/bin/env bash
# SkillKeep starter — installer
# https://github.com/vantwoutmaarten/skillkeep-starter

set -euo pipefail

REPO_RAW="https://raw.githubusercontent.com/vantwoutmaarten/skillkeep-starter/main"
SKILLS_DIR="${HOME}/.claude/skills"
SKILLS=(decisions-grill root-cause-debug terse-mode)

# Color / TTY gating. Honors NO_COLOR and TERM=dumb.
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ] && [ "${TERM:-}" != "dumb" ]; then
  BOLD=$'\033[1m'
  DIM=$'\033[2m'
  RESET=$'\033[0m'
  CYAN=$'\033[36m'
  GREEN=$'\033[32m'
  RED=$'\033[31m'
  CR=$'\r'
  CLR=$'\033[K'
else
  BOLD=""; DIM=""; RESET=""; CYAN=""; GREEN=""; RED=""; CR=""; CLR=""
fi

trap 'printf "\n  %sinstall aborted%s\n" "$RED" "$RESET" >&2' ERR

printf '\n'
printf '  %s%s▍%s %sSkillKeep starter%s\n' "$BOLD" "$CYAN" "$RESET" "$BOLD" "$RESET"
printf '  %s%s▍%s %sThree of the skills we use most, packaged free.%s\n' "$BOLD" "$CYAN" "$RESET" "$DIM" "$RESET"
printf '\n'

mkdir -p "${SKILLS_DIR}"

fail=0
for skill in "${SKILLS[@]}"; do
  padded=$(printf '%-20s' "$skill")

  # Pre-print "working" state in TTY mode so the line is visible while curl runs.
  if [ -n "$CR" ]; then
    printf '  %s→%s %s%s%s  %sworking...%s' \
      "$DIM" "$RESET" "$BOLD" "$padded" "$RESET" "$DIM" "$RESET"
  fi

  mkdir -p "${SKILLS_DIR}/${skill}"
  if curl -fsSL "${REPO_RAW}/skills/${skill}/SKILL.md" \
       -o "${SKILLS_DIR}/${skill}/SKILL.md" 2>/dev/null; then
    if [ -n "$CR" ]; then
      printf '%s%s  %s→%s %s%s%s  %s✓ installed%s\n' \
        "$CR" "$CLR" "$DIM" "$RESET" "$BOLD" "$padded" "$RESET" "$GREEN" "$RESET"
    else
      printf '  -> %s  installed\n' "$padded"
    fi
  else
    if [ -n "$CR" ]; then
      printf '%s%s  %s→%s %s%s%s  %s✗ failed%s\n' \
        "$CR" "$CLR" "$DIM" "$RESET" "$BOLD" "$padded" "$RESET" "$RED" "$RESET"
    else
      printf '  -> %s  failed\n' "$padded"
    fi
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  printf '\n  %sone or more skills failed to install%s\n' "$RED" "$RESET" >&2
  exit 1
fi

printf '\n'
printf '  %sInstalled to ~/.claude/skills%s\n' "$DIM" "$RESET"
printf '  Open Claude Code in any directory to use them.\n'
printf '\n'
printf '  %sMore at https://skillkeep.io%s\n' "$DIM" "$RESET"
printf '\n'
