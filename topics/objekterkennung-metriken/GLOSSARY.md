# objekterkennung-metriken Glossary

Begriffe zur Bewertung eines Objektdetektors (RF-DETR) für Stempel und Unterschriften auf Dokumenten.

## Terms

**Ground Truth**:
Die von Menschen markierten echten Stempel und Unterschriften im Validierungsset, gegen die das Modell gemessen wird.
_Avoid_: Labels, Soll-Daten

**Konfidenz**:
Der Wert zwischen 0 und 1, den das Modell jeder Box mitgibt.
_Avoid_: Score, Wahrscheinlichkeit

**Konfidenzschwelle**:
Mindest-Konfidenz, ab der eine Box behalten wird.
_Avoid_: Threshold, Cutoff

**TP (True Positive)**:
Box, die auf einem echten Objekt der Ground Truth sitzt.
_Avoid_: Treffer (nur umgangssprachlich)

**FP (False Positive)**:
Box ohne echtes Objekt darunter. In der Vollständigkeitsprüfung der gefährliche Fehler.
_Avoid_: Fehlalarm (nur umgangssprachlich)

**FN (False Negative)**:
Echtes Objekt der Ground Truth, auf dem keine Box sitzt.
_Avoid_: Übersehen (nur umgangssprachlich)

**Precision**:
TP / (TP + FP), also der Anteil der gemeldeten Boxen, die stimmen.
_Avoid_: Genauigkeit (verwechselbar mit Accuracy)

**Recall**:
TP / (TP + FN), also der Anteil der echten Objekte, die gefunden werden.
_Avoid_: Trefferquote, Sensitivität

**F1**:
Harmonisches Mittel aus Precision und Recall, 2·P·R / (P + R). Wird vom schwächeren der beiden Werte dominiert.
_Avoid_: F-Score (ohne Zusatz), Genauigkeit

**Makro-Mittel**:
Eine Metrik wird zuerst pro Klasse (Stempel, Unterschrift) berechnet und dann gemittelt. Jede Klasse zählt gleich viel.
_Avoid_: Durchschnitt (ohne Zusatz)

**F1 sweep**:
Die RF-DETR-Suche über 101 Konfidenzschwellen nach dem höchsten Makro-F1. Die Tabelle zeigt F1, Prec und Recall an dieser Schwelle, die Schwelle selbst aber nicht.
_Avoid_: Best-F1, optimales F1
