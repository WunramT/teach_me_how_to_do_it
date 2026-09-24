# Mission: objekterkennung-metriken

## Why
Ein RF-DETR-Modell (`rfdetr-nano`, trainiert mit PyTorch, exportiert als ONNX) soll auf unseren
Dokumenten Stempel und Unterschriften finden und so prüfen, ob **alle** geforderten Stempel und
Unterschriften vorliegen. Ich will die Auswertungstabelle (mAP · mAR · F1 sweep) sicher lesen,
um zu entscheiden, ob das Modell dafür gut genug ist.

## Success looks like
- Ich lese jede Spalte der RF-DETR-Tabelle und sage, was die Zahl über Stempel/Unterschriften aussagt.
- Ich entscheide begründet, ob das Modell für die Vollständigkeitsprüfung taugt, und welche Konfidenzschwelle ich einsetze.
- Ich erkläre mAP, mAR und F1 einer fachfremden Person in eigenen Worten.

## Constraints
- Grundlagen waren schon einmal bekannt – Auffrischung von null an, zügiges Tempo.
- Kurze Lektionen, Sprache Deutsch.

## Out of scope
- Modellarchitektur von RF-DETR / DETR, Training-Tuning, ONNX-Deployment.
