// Schwellen-Simulator: Detektionen auf einer Konfidenzachse, Schieberegler = Konfidenzschwelle.
// Markup:
// <div class="sim" data-gt="8" data-start="0.5" data-f1="false"
//      data-dets='[{"s":0.97,"tp":true,"l":"Unterschrift"}, ...]'></div>
// tp=true: Box trifft ein echtes Objekt; tp=false: Fehlalarm.
// data-gt: Anzahl echter Objekte (Ground Truth) insgesamt.
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const fmt = (x) => (Number.isFinite(x) ? x.toFixed(2).replace(".", ",") : "–");
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  document.querySelectorAll(".sim").forEach((root, idx) => {
    const dets = JSON.parse(root.dataset.dets);
    const gt = Number(root.dataset.gt);
    const showF1 = root.dataset.f1 === "true";
    const W = 600, H = 130, L = 20, R = 580, Y = 80;
    const x = (s) => L + s * (R - L);

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Detektionen nach Konfidenz" });
    svg.appendChild(el("line", { class: "axis", x1: L, x2: R, y1: Y + 14, y2: Y + 14 }));
    for (let t = 0; t <= 10; t++) {
      const tx = x(t / 10);
      svg.appendChild(el("line", { class: "axis", x1: tx, x2: tx, y1: Y + 14, y2: Y + 19 }));
      const lab = el("text", { class: "tick", x: tx, y: Y + 34, "text-anchor": "middle" });
      lab.textContent = (t / 10).toFixed(1).replace(".", ",");
      svg.appendChild(lab);
    }
    // Punkte leicht versetzt, damit nahe Werte nicht überlappen
    const dots = dets.map((d, i) => {
      const c = el("circle", { cx: x(d.s), cy: Y - (i % 3) * 20, r: 8 });
      const title = el("title", {});
      title.textContent = `${d.l} · Konfidenz ${fmt(d.s)} · ${d.tp ? "echtes Objekt" : "Fehlalarm"}`;
      c.appendChild(title);
      svg.appendChild(c);
      return c;
    });
    const thr = el("line", { class: "thr", y1: 8, y2: Y + 16 });
    const thrLabel = el("text", { class: "thr-label", y: 12 });
    svg.append(thr, thrLabel);

    const id = `sim-range-${idx}`;
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = "Konfidenzschwelle";
    const range = Object.assign(document.createElement("input"), {
      type: "range", id, min: 0, max: 1, step: 0.01, value: root.dataset.start || 0.5,
    });

    const stats = document.createElement("div");
    stats.className = "stats";
    const names = ["TP", "FP", "FN", "Precision", "Recall"].concat(showF1 ? ["F1"] : []);
    const cells = Object.fromEntries(names.map((n) => {
      const d = document.createElement("div");
      d.innerHTML = `<span>${n}</span><b>–</b>`;
      stats.appendChild(d);
      return [n, d.querySelector("b")];
    }));

    const legend = document.createElement("p");
    legend.className = "legend";
    legend.textContent = "● grün = Box trifft echten Stempel/Unterschrift · ● rot = Fehlalarm · hohl = unter der Schwelle, wird verworfen";

    root.append(svg, label, range, stats, legend);

    const update = () => {
      const t = Number(range.value);
      let tp = 0, fp = 0;
      dets.forEach((d, i) => {
        const on = d.s >= t;
        if (on) d.tp ? tp++ : fp++;
        dots[i].setAttribute("class", `${d.tp ? "dot-tp" : "dot-fp"}${on ? "" : " dot-off"}`);
      });
      const fn = gt - tp;
      const p = tp + fp ? tp / (tp + fp) : NaN;
      const r = gt ? tp / gt : NaN;
      const f1 = p + r ? (2 * p * r) / (p + r) : NaN;
      thr.setAttribute("x1", x(t)); thr.setAttribute("x2", x(t));
      thrLabel.setAttribute("x", x(t) + 6);
      thrLabel.setAttribute("text-anchor", t > 0.85 ? "end" : "start");
      if (t > 0.85) thrLabel.setAttribute("x", x(t) - 6);
      thrLabel.textContent = fmt(t);
      cells.TP.textContent = tp; cells.FP.textContent = fp; cells.FN.textContent = fn;
      cells.Precision.textContent = tp + fp ? `${tp}/${tp + fp} = ${fmt(p)}` : "–";
      cells.Recall.textContent = `${tp}/${gt} = ${fmt(r)}`;
      if (showF1) cells.F1.textContent = fmt(f1);
    };
    range.addEventListener("input", update);
    update();
  });
})();
