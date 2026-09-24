# Hinweise für Claude

Dieses Repo sammelt Lern-Workspaces für den `/teach`-Skill.

## Aktiven Workspace bestimmen

- Jedes Thema ist ein eigener Workspace unter `topics/<thema>/`.
  Der Skill spricht vom "aktuellen Verzeichnis" – gemeint ist immer dieser
  Themenordner, **nie** der Repo-Root.
- Läuft die Sitzung im Repo-Root, bestimme das Thema aus der `/teach`-Anfrage
  (z. B. `/teach python-grundlagen: …`). Ist es unklar, liste die vorhandenen
  Ordner in `topics/` auf und frage nach.
- Existiert das Thema noch nicht, lege es mit `./scripts/new-topic.sh <thema>`
  an (Ordnername in kebab-case) und beginne mit dem Mission-Interview.
- Themen nicht vermischen: Lektionen, Learning Records und Glossar gehören
  jeweils nur in ihren eigenen Workspace.

## Konventionen

- Sprache der Inhalte: Deutsch, sofern `NOTES.md` nichts anderes sagt.
  Die Dateinamen aus dem Skill (`MISSION.md`, `lessons/` …) bleiben englisch.
- Jede Lektion bindet `../assets/style.css` ein; neue wiederverwendbare
  Komponenten kommen nach `assets/`, nicht inline in die Lektion.
- `_template/` nur ändern, wenn sich die Vorlage für *alle* neuen Themen
  ändern soll.
- Nach einer Sitzung die Änderungen im Themenordner committen
  (z. B. `teach(python-grundlagen): Lektion 0003 Schleifen`).
