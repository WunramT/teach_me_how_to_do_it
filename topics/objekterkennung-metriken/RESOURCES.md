# objekterkennung-metriken Resources

<!-- Nur vertrauenswürdige Quellen, jede mit einer Zeile "Use for: …". -->

## Knowledge

- [Google ML Crash Course: Accuracy, precision, recall](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall)
  Kurze, saubere Definitionen von Precision, Recall, F1 und dem Schwellen-Trade-off. Use for: Grundlagen (Lektion 1–2).
- [COCO Detection Evaluation](https://cocodataset.org/#detection-eval) ([Rohtext](https://raw.githubusercontent.com/cocodataset/cocodataset.github.io/master/dataset/detection-eval.htm))
  Offizielle Definition von AP, AP50, AP75, AR@maxDets; „AP = mAP“, gemittelt über IoU .50:.05:.95. Use for: mAP- und mAR-Spalten.
- [Padilla et al. (2021): A Comparative Analysis of Object Detection Metrics](https://doi.org/10.3390/electronics10030279) · [Toolkit auf GitHub](https://github.com/rafaelpadilla/review_object_detection_metrics)
  Peer-reviewter Überblick: TP/FP/FN über IoU, Interpolation, Unterschiede der Tools. Use for: Wie wird AP genau gerechnet?
- [scikit-learn User Guide 3.3: Tuning the decision threshold](https://scikit-learn.org/stable/modules/classification_threshold.html) · [fbeta_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.fbeta_score.html)
  Warum 0,5 selten passt und wie man die Schwelle nach dem Ziel der Anwendung wählt. F-beta gewichtet P und R unterschiedlich. Use for: Schwellenwahl (Lektion 2, 6).
- [Rafael Padilla: Object-Detection-Metrics (GitHub)](https://github.com/rafaelpadilla/Object-Detection-Metrics)
  Vorarbeit zum Artikel von 2021, mit klaren Bildern zu IoU, TP/FP/FN (TN „does not apply“), Doppel-Detektionen und AP-Kurven. Use for: Lektion 3–4.
- [RF-DETR Quellcode (roboflow/rf-detr)](https://github.com/roboflow/rf-detr)
  Maßgeblich dafür, was *unsere* Tabelle zeigt. Geprüft in v1.10.1: `rfdetr/utilities/console.py` (Tabelle),
  `rfdetr/evaluation/f1_sweep.py` + `rfdetr/training/callbacks/coco_eval.py` (F1 sweep). Use for: Details der Spalten.

## Wisdom (Communities)

- [Roboflow Forum](https://discuss.roboflow.com/) – Community der RF-DETR-Macher. Use for: Fragen zu RF-DETR-Auswertung.
- [Cross Validated (stats.stackexchange.com)](https://stats.stackexchange.com/questions/tagged/precision-recall) – moderiert, hohe Qualität. Use for: Fragen zu Metriken allgemein.

## Gaps
- Metrik auf **Dokumentebene** („alle Stempel da?“) liefert die Tabelle nicht – dafür brauchen wir später eine eigene Auswertung.
