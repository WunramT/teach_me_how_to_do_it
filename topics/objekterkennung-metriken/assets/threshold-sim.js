// Schwellen-Simulator: Detektionen auf einer Konfidenzachse, Schieberegler = Konfidenzschwelle.
//
// Eine Klasse (Lektion 1):
// <div class="sim" data-gt="8" data-start="0.5" data-f1="false"
//      data-dets='[{"s":0.97,"tp":true,"l":"Unterschrift"}, ...]'></div>
//
// Mehrere Klassen (ab Lektion 2): data-gt ist ein Objekt, jede Detektion hat "c".
// Zeigt pro Klasse eine Spur, eine Tabelle pro Klasse plus Makro-Zeile.
// data-sweep="true" ergänzt einen Knopf, der wie RF-DETR die Schwellen 0,00…1,00
// durchprobiert und die mit dem höchsten Makro-F1 einstellt.
// <div class="sim" data-gt='{"Stempel":4,"Unterschrift":5}' data-sweep="true"
//      data-dets='[{"s":0.95,"tp":true,"c":"Stempel","l":"Firmenstempel"}, ...]'></div>
//
// tp=true: Box trifft ein echtes Objekt; tp=false: Fehlalarm.
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const fmt = (x) => (Number.isFinite(x) ? x.toFixed(2).replace(".", ",") : "–");
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  // Zählt TP/FP/FN und rechnet Precision, Recall, F1 – wie rfdetr/evaluation/f1_sweep.py
  // (keine Box → Precision 0; P + R = 0 → F1 0).
  const score = (dets, gt, t) => {
    let tp = 0, fp = 0;
    dets.forEach((d) => { if (d.s >= t) d.tp ? tp++ : fp++; });
    const p = tp + fp ? tp / (tp + fp) : 0;
    const r = gt ? tp / gt : 0;
    const f1 = p + r ? (2 * p * r) / (p + r) : 0;
    return { tp, fp, fn: gt - tp, p, r, f1 };
  };

  document.querySelectorAll(".sim").forEach((root, idx) => {
    const dets = JSON.parse(root.dataset.dets);
    const gtRaw = JSON.parse(root.dataset.gt);
    const multi = typeof gtRaw === "object";
    const gt = multi ? gtRaw : { _: gtRaw };
    const classes = Object.keys(gt);
    const byClass = Object.fromEntries(classes.map((c) => [c, dets.filter((d) => (multi ? d.c === c : true))]));
    const showF1 = multi || root.dataset.f1 === "true";

    const LANE = 70, TOP = 20, L = multi ? 110 : 20, R = 580, W = 600;
    const H = TOP + LANE * classes.length + 40;
    const axisY = TOP + LANE * classes.length;
    const x = (s) => L + s * (R - L);

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Detektionen nach Konfidenz" });
    svg.appendChild(el("line", { class: "axis", x1: L, x2: R, y1: axisY, y2: axisY }));
    for (let t = 0; t <= 10; t++) {
      const tx = x(t / 10);
      svg.appendChild(el("line", { class: "axis", x1: tx, x2: tx, y1: axisY, y2: axisY + 5 }));
      const lab = el("text", { class: "tick", x: tx, y: axisY + 22, "text-anchor": "middle" });
      lab.textContent = (t / 10).toFixed(1).replace(".", ",");
      svg.appendChild(lab);
    }
    const dotOf = new Map();
    classes.forEach((c, ci) => {
      const laneBase = TOP + LANE * (ci + 1) - 14;
      if (multi) {
        const lab = el("text", { class: "tick", x: 0, y: laneBase - 14 });
        lab.textContent = c;
        svg.appendChild(lab);
      }
      byClass[c].forEach((d, i) => {
        // leicht versetzt, damit nahe Werte nicht überlappen
        const dot = el("circle", { cx: x(d.s), cy: laneBase - (i % 3) * 18, r: 8 });
        const title = el("title", {});
        title.textContent = `${d.l} · Konfidenz ${fmt(d.s)} · ${d.tp ? "echtes Objekt" : "Fehlalarm"}`;
        dot.appendChild(title);
        svg.appendChild(dot);
        dotOf.set(d, dot);
      });
    });
    const thr = el("line", { class: "thr", y1: 14, y2: axisY + 2 });
    const thrLabel = el("text", { class: "thr-label", y: 14 });
    svg.append(thr, thrLabel);

    const id = `sim-range-${idx}`;
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = "Konfidenzschwelle";
    const range = Object.assign(document.createElement("input"), {
      type: "range", id, min: 0, max: 1, step: 0.01, value: root.dataset.start || 0.5,
    });

    // Kennzahlen: Kacheln bei einer Klasse, Tabelle bei mehreren
    let render;
    const stats = document.createElement("div");
    if (!multi) {
      stats.className = "stats";
      const names = ["TP", "FP", "FN", "Precision", "Recall"].concat(showF1 ? ["F1"] : []);
      const cells = Object.fromEntries(names.map((n) => {
        const d = document.createElement("div");
        d.innerHTML = `<span>${n}</span><b>–</b>`;
        stats.appendChild(d);
        return [n, d.querySelector("b")];
      }));
      render = (t) => {
        const s = score(byClass._, gt._, t);
        cells.TP.textContent = s.tp; cells.FP.textContent = s.fp; cells.FN.textContent = s.fn;
        cells.Precision.textContent = s.tp + s.fp ? `${s.tp}/${s.tp + s.fp} = ${fmt(s.p)}` : "–";
        cells.Recall.textContent = `${s.tp}/${gt._} = ${fmt(s.r)}`;
        if (showF1) cells.F1.textContent = fmt(s.f1);
      };
    } else {
      stats.className = "table-wrap";
      const cols = ["Klasse", "TP", "FP", "FN", "Precision", "Recall", "F1"];
      const table = document.createElement("table");
      table.innerHTML = `<tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr>`;
      const rows = classes.concat(["Makro"]).map((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = cols.map((_, i) => (i === 0 ? `<td>${c === "Makro" ? "<b>Makro</b>" : c}</td>` : "<td></td>")).join("");
        table.appendChild(tr);
        return tr.querySelectorAll("td");
      });
      stats.appendChild(table);
      render = (t) => {
        const per = classes.map((c) => score(byClass[c], gt[c], t));
        per.forEach((s, i) => {
          const td = rows[i];
          [s.tp, s.fp, s.fn, fmt(s.p), fmt(s.r), fmt(s.f1)].forEach((v, j) => { td[j + 1].textContent = v; });
        });
        const mean = (k) => per.reduce((a, s) => a + s[k], 0) / per.length;
        const m = rows[rows.length - 1];
        ["", "", "", fmt(mean("p")), fmt(mean("r")), fmt(mean("f1"))].forEach((v, j) => { m[j + 1].innerHTML = v ? `<b>${v}</b>` : ""; });
      };
    }

    const legend = document.createElement("p");
    legend.className = "legend";
    legend.textContent = "● grün = Box trifft echtes Objekt · ● rot = Fehlalarm · hohl = unter der Schwelle, wird verworfen";

    root.append(svg, label, range, stats);

    if (root.dataset.sweep === "true") {
      const btn = Object.assign(document.createElement("button"), { type: "button", textContent: "Beste F1-Schwelle suchen (wie RF-DETR)" });
      const out = document.createElement("p");
      out.className = "legend";
      btn.addEventListener("click", () => {
        // 101 Schwellen, erste mit maximalem Makro-F1 gewinnt (wie max() in coco_eval.py)
        let best = { t: 0, f1: -1 };
        for (let i = 0; i <= 100; i++) {
          const t = i / 100;
          const f1 = classes.reduce((a, c) => a + score(byClass[c], gt[c], t).f1, 0) / classes.length;
          if (f1 > best.f1 + 1e-12) best = { t, f1 };
        }
        range.value = best.t;
        update();
        out.textContent = `101 Schwellen geprüft. Bestes Makro-F1 = ${fmt(best.f1)} bei Schwelle ${fmt(best.t)}.`;
      });
      root.append(btn, out);
    }
    root.append(legend);

    const update = () => {
      const t = Number(range.value);
      dets.forEach((d) => {
        dotOf.get(d).setAttribute("class", `${d.tp ? "dot-tp" : "dot-fp"}${d.s >= t ? "" : " dot-off"}`);
      });
      const right = t > 0.85;
      thr.setAttribute("x1", x(t)); thr.setAttribute("x2", x(t));
      thrLabel.setAttribute("x", x(t) + (right ? -6 : 6));
      thrLabel.setAttribute("text-anchor", right ? "end" : "start");
      thrLabel.textContent = fmt(t);
      render(t);
    };
    range.addEventListener("input", update);
    update();
  });
})();
