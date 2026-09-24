// IoU-Spielwiese: feste Ground-Truth-Box, verschiebbare und skalierbare Vorhersage-Box.
// Markup:
// <div class="iou" data-gt="[120,70,160,80]" data-pred="[150,80,160,80]"
//      data-thresholds="[0.5,0.75]" data-label="Unterschrift"></div>
// Boxen als [x, y, Breite, Höhe] in einer 400×220-Fläche. Die Vorhersage lässt sich
// mit der Maus/dem Finger ziehen oder über Regler ändern. Optionale Voreinstellungen:
// data-presets='{"Perfekt":[120,70,160,80], ...}'
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const W = 400, H = 220;
  const fmt = (x, d = 2) => x.toFixed(d).replace(".", ",");
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  // IoU zweier Boxen [x, y, w, h]
  const iou = (a, b) => {
    const iw = Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]));
    const ih = Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]));
    const inter = iw * ih;
    const union = a[2] * a[3] + b[2] * b[3] - inter;
    return { inter, union, iou: union ? inter / union : 0, ix: Math.max(a[0], b[0]), iy: Math.max(a[1], b[1]), iw, ih };
  };

  document.querySelectorAll(".iou").forEach((root, idx) => {
    const gt = JSON.parse(root.dataset.gt);
    const pred = JSON.parse(root.dataset.pred);
    const thresholds = JSON.parse(root.dataset.thresholds || "[0.5]");
    const presets = root.dataset.presets ? JSON.parse(root.dataset.presets) : null;
    const label = root.dataset.label || "Objekt";

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Ground-Truth-Box und Vorhersage-Box" });
    svg.appendChild(el("rect", { class: "iou-page", x: 0, y: 0, width: W, height: H }));
    // angedeutete Textzeilen des Dokuments
    for (let y = 22; y < H; y += 22) svg.appendChild(el("line", { class: "iou-line", x1: 16, x2: W - 16, y1: y, y2: y }));
    // angedeutete Unterschrift in der Ground Truth
    const [gx, gy, gw, gh] = gt;
    const sx = (t) => gx + t * gw, sy = (t) => gy + t * gh;
    svg.appendChild(el("path", {
      class: "iou-ink",
      d: `M${sx(0.08)},${sy(0.7)} C${sx(0.2)},${sy(0.05)} ${sx(0.28)},${sy(0.95)} ${sx(0.38)},${sy(0.45)} ` +
         `S${sx(0.55)},${sy(0.2)} ${sx(0.6)},${sy(0.6)} S${sx(0.8)},${sy(0.3)} ${sx(0.92)},${sy(0.55)}`,
    }));
    const interRect = el("rect", { class: "iou-inter" });
    const gtRect = el("rect", { class: "iou-gt", x: gx, y: gy, width: gw, height: gh });
    const predRect = el("rect", { class: "iou-pred", tabindex: 0 });
    const gtText = el("text", { class: "iou-text", x: gx, y: gy - 5 });
    gtText.textContent = `Ground Truth: ${label}`;
    const predText = el("text", { class: "iou-text iou-text--pred" });
    predText.textContent = "Vorhersage";
    svg.append(interRect, gtRect, predRect, gtText, predText);

    // Regler
    const controls = document.createElement("div");
    controls.className = "iou-controls";
    const specs = [
      ["x", "Verschieben ←→", 0, W - 20, 0],
      ["y", "Verschieben ↑↓", 0, H - 20, 1],
      ["w", "Breite", 20, W, 2],
      ["h", "Höhe", 10, H, 3],
    ];
    const inputs = specs.map(([key, text, min, max, i]) => {
      const id = `iou-${idx}-${key}`;
      const wrap = document.createElement("div");
      wrap.innerHTML = `<label for="${id}">${text}</label>`;
      const inp = Object.assign(document.createElement("input"), { type: "range", id, min, max, step: 1, value: pred[i] });
      inp.addEventListener("input", () => { pred[i] = Number(inp.value); update(); });
      wrap.appendChild(inp);
      controls.appendChild(wrap);
      return inp;
    });

    const out = document.createElement("div");
    out.className = "stats";
    const cells = {};
    ["Schnitt", "Vereinigung", "IoU"].concat(thresholds.map((t) => `Bei IoU ≥ ${fmt(t)}`)).forEach((n) => {
      const d = document.createElement("div");
      d.innerHTML = `<span>${n}</span><b>–</b>`;
      out.appendChild(d);
      cells[n] = d.querySelector("b");
    });

    root.append(svg);
    if (presets) {
      const bar = document.createElement("div");
      bar.className = "iou-presets";
      Object.entries(presets).forEach(([name, box]) => {
        const b = Object.assign(document.createElement("button"), { type: "button", textContent: name });
        b.addEventListener("click", () => { box.forEach((v, i) => { pred[i] = v; }); update(); });
        bar.appendChild(b);
      });
      root.append(bar);
    }
    root.append(controls, out);

    function update() {
      pred[0] = Math.min(Math.max(pred[0], 0), W - 20);
      pred[1] = Math.min(Math.max(pred[1], 0), H - 10);
      const [px, py, pw, ph] = pred;
      predRect.setAttribute("x", px); predRect.setAttribute("y", py);
      predRect.setAttribute("width", pw); predRect.setAttribute("height", ph);
      predText.setAttribute("x", px + pw);
      predText.setAttribute("y", Math.min(py + ph + 14, H - 4));
      predText.setAttribute("text-anchor", "end");
      const r = iou(gt, pred);
      interRect.setAttribute("x", r.ix); interRect.setAttribute("y", r.iy);
      interRect.setAttribute("width", r.iw); interRect.setAttribute("height", r.ih);
      cells.Schnitt.textContent = Math.round(r.inter).toLocaleString("de-DE");
      cells.Vereinigung.textContent = Math.round(r.union).toLocaleString("de-DE");
      cells.IoU.textContent = fmt(r.iou);
      thresholds.forEach((t) => {
        const ok = r.iou >= t;
        const c = cells[`Bei IoU ≥ ${fmt(t)}`];
        c.textContent = ok ? "TP" : "FP + FN";
        c.className = ok ? "ok" : "err";
      });
      inputs.forEach((inp, i) => { inp.value = pred[i]; });
    }

    // Ziehen mit Maus oder Finger
    let drag = null;
    const toSvg = (e) => {
      const p = svg.createSVGPoint();
      p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    };
    predRect.addEventListener("pointerdown", (e) => {
      const p = toSvg(e);
      drag = { dx: p.x - pred[0], dy: p.y - pred[1] };
      predRect.setPointerCapture(e.pointerId);
    });
    predRect.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const p = toSvg(e);
      pred[0] = Math.round(p.x - drag.dx); pred[1] = Math.round(p.y - drag.dy);
      update();
    });
    predRect.addEventListener("pointerup", () => { drag = null; });
    predRect.addEventListener("keydown", (e) => {
      const step = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key];
      if (!step) return;
      e.preventDefault();
      pred[0] += step[0]; pred[1] += step[1];
      update();
    });

    update();
  });
})();
