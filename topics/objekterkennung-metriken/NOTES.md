# Notes

<!-- Lernvorlieben und Arbeitsnotizen für Claude. -->

## Preferences
- Sprache: Deutsch
- „Von null an“, aber als Auffrischung: zügig, wenig Wiederholung, schnell zur echten Tabelle.
- Ziel: fachfremden Personen erklären können → jede Lektion mit einer „Erklär es einem Laien“-Übung.

## Working notes
- Kontext: `rfdetr-nano.onnx`, Klassen Stempel + Unterschrift, Ziel = Vollständigkeitsprüfung pro Dokument.
- RF-DETR 1.10.1, Tabelle (console.py): mAP [50:95 | 50 | 75] · mAR [@maxDets] · F1 sweep [F1 | Prec | Recall].
- F1 sweep (coco_eval.py): Matching bei IoU 0,5; Schwellen 0,00…1,00 in 0,01-Schritten; gewählt wird die
  Schwelle mit dem höchsten **Makro-F1** (Mittel über Klassen); Prec/Recall sind die Makrowerte an dieser Schwelle.
  Die gewählte Schwelle selbst steht NICHT in der Gesamttabelle → in späterer Lektion thematisieren.
- mAR-Label zeigt maxDets (Default im Callback: 500).
- Kern-Einsicht für die Mission: Ein FP (erfundener Stempel) lässt ein unvollständiges Dokument als vollständig durchgehen.
- Lehrplan (Entwurf): 1 TP/FP/FN + Precision/Recall · 2 Schwelle & F1 sweep · 3 IoU · 4 AP/mAP@50/75/50:95 · 5 mAR · 6 Die ganze Tabelle lesen + Dokumentebene.
