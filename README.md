# teach_me_how_to_do_it

Persönliche Lern-Workspaces für den `/teach`-Skill von Claude Code.

Jedes Thema bekommt einen eigenen Workspace unter `topics/<thema>/`,
denn der Skill verlangt **eine Mission pro Workspace**.

## Struktur

```
.
├── CLAUDE.md              # Regeln für Claude: welcher Workspace ist aktiv
├── _template/             # Vorlage für neue Themen (nicht direkt bearbeiten)
├── scripts/
│   └── new-topic.sh       # legt ein neues Thema aus der Vorlage an
└── topics/
    └── <thema>/           # ein Lern-Workspace
        ├── MISSION.md         # Warum lerne ich das? Woran erkenne ich Erfolg?
        ├── RESOURCES.md       # vertrauenswürdige Quellen & Communities
        ├── GLOSSARY.md        # verbindliche Begriffe (wächst mit dem Verständnis)
        ├── NOTES.md           # Vorlieben & Arbeitsnotizen für Claude
        ├── lessons/           # 0001-<name>.html – eine Lektion = ein Erfolg
        ├── reference/         # Spickzettel, Syntax, Abläufe (druckbar)
        ├── learning-records/  # 0001-<name>.md – was ich nachweislich kann
        └── assets/            # wiederverwendbare Komponenten (CSS, Quiz, …)
            └── style.css
```

## So arbeitest du damit

1. Neues Thema anlegen:
   ```bash
   ./scripts/new-topic.sh python-grundlagen
   ```
2. In Claude Code starten, idealerweise im Themenordner:
   ```bash
   cd topics/python-grundlagen && claude
   ```
   dann `/teach Ich möchte Python lernen, um …` eingeben.
   Alternativ vom Repo-Root aus: `/teach python-grundlagen: …`,
   `CLAUDE.md` sorgt dann dafür, dass Claude im richtigen Ordner arbeitet.
3. In der ersten Sitzung fragt Claude nach deiner **Mission**. Nimm dir
   Zeit dafür, denn alle späteren Lektionen bauen darauf auf.
4. Lektionen im Browser öffnen (`topics/<thema>/lessons/*.html`), die
   Übungen machen und Rückfragen direkt an Claude stellen.
5. Am Ende einer Sitzung committen, damit der Lernstand erhalten bleibt.
