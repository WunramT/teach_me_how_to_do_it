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
