// AP-Werkstatt: Precision-Recall-Kurve und AP nach COCO-Regeln für eine Klasse.
// Markup:
// <div class="apc" data-gt="5" data-label="Stempel"
//      data-dets='[{"s":0.95,"iou":0.91,"l":"Firmenstempel"}, ...]'></div>
// Jede Detektion hat Konfidenz s und den IoU zu ihrem Objekt (0 = kein Objekt darunter).
// Eine Detektion ist TP, wenn iou ≥ IoU-Schwelle. Vereinfachung: jede Box hat ein eigenes Objekt,
// Doppel-Detektionen kommen nicht vor.
//
// AP wie pycocotools (cocoeval.py, accumulate): Boxen nach Konfidenz sortieren, kumulierte P/R-Punkte,
// Precision von rechts her monoton machen, an 101 Recall-Stufen 0,00…1,00 ablesen
// (nicht erreichter Recall zählt 0), Mittelwert. AP 50:95 = Mittel über IoU 0,50, 0,55 … 0,95.
globalThis.APCurve = (() => {
  const RECALL_STEPS = Array.from({ length: 101 }, (_, i) => i / 100);
  const IOU_STEPS = Array.from({ length: 10 }, (_, i) => Math.round((0.5 + i * 0.05) * 100) / 100);

  function curve(dets, gt, iouThr) {
    const sorted = [...dets].sort((a, b) => b.s - a.s);
    let tp = 0, fp = 0;
    const pts = sorted.map((d) => {
      const hit = d.iou >= iouThr - 1e-9;
      hit ? tp++ : fp++;
      return { d, hit, r: tp / gt, p: tp / (tp + fp) };
    });
    const env = pts.map((q) => q.p);
    for (let i = env.length - 1; i > 0; i--) if (env[i] > env[i - 1]) env[i - 1] = env[i];
    const sampled = RECALL_STEPS.map((rt) => {
      const i = pts.findIndex((q) => q.r >= rt - 1e-9);
      return i === -1 ? 0 : env[i];
    });
    const ap = sampled.reduce((a, b) => a + b, 0) / sampled.length;
    return { pts, env, sampled, ap };
  }
  const apRange = (dets, gt) => IOU_STEPS.reduce((a, t) => a + curve(dets, gt, t).ap, 0) / IOU_STEPS.length;
  return { curve, apRange, IOU_STEPS };
})();

(() => {
  if (typeof document === "undefined") return;
  const NS = "http://www.w3.org/2000/svg";
  const fmt = (x) => x.toFixed(2).replace(".", ",");
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  document.querySelectorAll(".apc").forEach((root, idx) => {
    const dets = JSON.parse(root.dataset.dets);
    const gt = Number(root.dataset.gt);
    const label = root.dataset.label || "Klasse";
    let iouThr = 0.5;

    // IoU-Umschalter
    const bar = document.createElement("div");
    bar.className = "apc-switch";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "IoU-Schwelle");
    const choices = [["0,50", 0.5], ["0,75", 0.75]];
    const buttons = choices.map(([txt, v]) => {
      const b = Object.assign(document.createElement("button"), { type: "button", textContent: `IoU ≥ ${txt}` });
      b.addEventListener("click", () => { iouThr = v; update(); });
      bar.appendChild(b);
      return [b, v];
    });

    // Tabelle der Boxen in Rangfolge
    const tableWrap = document.createElement("div");
    tableWrap.className = "table-wrap";
    const table = document.createElement("table");
    tableWrap.appendChild(table);

    // Kurve
    const W = 370, H = 250, L = 60, R = 354, T = 12, B = 206;
    const x = (r) => L + r * (R - L), y = (p) => B - p * (B - T);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `Precision-Recall-Kurve ${label}` });
    for (let v = 0; v <= 1.0001; v += 0.25) {
      svg.appendChild(el("line", { class: "apc-grid", x1: L, x2: R, y1: y(v), y2: y(v) }));
      svg.appendChild(el("line", { class: "apc-grid", x1: x(v), x2: x(v), y1: T, y2: B }));
      const ty = el("text", { class: "tick", x: L - 6, y: y(v) + 4, "text-anchor": "end" });
      ty.textContent = fmt(v);
      const tx = el("text", { class: "tick", x: x(v), y: B + 16, "text-anchor": "middle" });
      tx.textContent = fmt(v);
      svg.append(ty, tx);
    }
    const xl = el("text", { class: "tick", x: (L + R) / 2, y: H - 6, "text-anchor": "middle" });
    xl.textContent = "Recall";
    const yl = el("text", { class: "tick", x: 10, y: (T + B) / 2, transform: `rotate(-90 10 ${(T + B) / 2})`, "text-anchor": "middle" });
    yl.textContent = "Precision";
    const area = el("path", { class: "apc-area" });
    const raw = el("polyline", { class: "apc-raw" });
    const envLine = el("path", { class: "apc-env" });
    const dots = el("g", {});
    svg.append(xl, yl, area, raw, envLine, dots);

    const out = document.createElement("div");
    out.className = "stats";
    const cells = {};
    [`AP (Umschalter)`, "AP 50", "AP 75", "AP 50:95"].forEach((n) => {
      const d = document.createElement("div");
      d.innerHTML = `<span>${n}</span><b>–</b>`;
      out.appendChild(d);
      cells[n] = d.querySelector("b");
    });

    const legend = document.createElement("p");
    legend.className = "legend";
    legend.textContent = "Graue Zickzacklinie = rohe P/R-Punkte · rote Treppe = geglättete Kurve nach COCO · Fläche darunter ≈ AP";

    root.append(bar, tableWrap, svg, out, legend);

    const all50 = globalThis.APCurve.curve(dets, gt, 0.5).ap;
    const all75 = globalThis.APCurve.curve(dets, gt, 0.75).ap;
    const allRange = globalThis.APCurve.apRange(dets, gt);
    cells["AP 50"].textContent = fmt(all50);
    cells["AP 75"].textContent = fmt(all75);
    cells["AP 50:95"].textContent = fmt(allRange);

    function update() {
      buttons.forEach(([b, v]) => b.setAttribute("aria-pressed", String(v === iouThr)));
      const c = globalThis.APCurve.curve(dets, gt, iouThr);
      table.innerHTML = "<tr><th>Rang</th><th>Box</th><th>Konf.</th><th>IoU</th><th></th><th>Precision</th><th>Recall</th></tr>" +
        c.pts.map((q, i) => `<tr><td>${i + 1}</td><td>${q.d.l}</td><td>${fmt(q.d.s)}</td><td>${q.d.iou ? fmt(q.d.iou) : "–"}</td>` +
          `<td class="${q.hit ? "ok" : "err"}">${q.hit ? "TP" : "FP"}</td><td>${fmt(q.p)}</td><td>${fmt(q.r)}</td></tr>`).join("") +
        `<tr><td></td><td colspan="6" class="legend">${label}: ${gt} echte Objekte im Set</td></tr>`;

      raw.setAttribute("points", c.pts.map((q) => `${x(q.r)},${y(q.p)}`).join(" "));
      dots.innerHTML = "";
      c.pts.forEach((q) => dots.appendChild(el("circle", { class: q.hit ? "dot-tp" : "dot-fp", cx: x(q.r), cy: y(q.p), r: 4.5 })));
      // Treppe der 101 abgelesenen Werte
      let d = `M${x(0)},${y(c.sampled[0])}`;
      for (let i = 1; i < 101; i++) d += ` H${x(i / 100)} V${y(c.sampled[i])}`;
      envLine.setAttribute("d", d);
      area.setAttribute("d", `${d} V${y(0)} H${x(0)} Z`);
      cells["AP (Umschalter)"].textContent = fmt(c.ap);
    }
    update();
  });
})();

if (typeof module !== "undefined") module.exports = globalThis.APCurve;
