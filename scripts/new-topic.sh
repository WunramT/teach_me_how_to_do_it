#!/usr/bin/env bash
# Legt einen neuen Lern-Workspace unter topics/<name>/ aus _template/ an.
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Aufruf: $0 <thema-in-kebab-case>" >&2
  exit 1
fi

name="$1"
if [[ ! "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Fehler: '$name' ist kein kebab-case (z. B. python-grundlagen)." >&2
  exit 1
fi

root="$(cd "$(dirname "$0")/.." && pwd)"
target="$root/topics/$name"

if [[ -e "$target" ]]; then
  echo "Fehler: $target existiert bereits." >&2
  exit 1
fi

cp -r "$root/_template" "$target"
sed -i.bak "s/{Topic}/$name/g" "$target"/*.md && rm -f "$target"/*.md.bak

echo "Workspace angelegt: topics/$name"
echo "Nächster Schritt: cd topics/$name && claude  →  /teach <was du lernen willst>"
