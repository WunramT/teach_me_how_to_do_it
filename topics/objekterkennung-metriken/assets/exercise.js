// Rechenübung mit sofortiger Rückmeldung. Markup:
// <form class="exercise">
//   <div class="row"><label for="x">TP</label><input id="x" data-answer="4" data-tol="0"></div>
//   <button>Prüfen</button><p class="feedback" data-done="Text, wenn alles stimmt"></p>
// </form>
// Eingaben dürfen Dezimalkomma, Punkt oder Bruch (4/5) sein.
function parseValue(raw) {
  const s = String(raw).trim().replace(",", ".");
  if (s.includes("/")) {
    const [a, b] = s.split("/").map(Number);
    return b ? a / b : NaN;
  }
  if (s.endsWith("%")) return Number(s.slice(0, -1)) / 100;
  return Number(s);
}

document.querySelectorAll("form.exercise").forEach((form) => {
  const feedback = form.querySelector(".feedback");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("input[data-answer]")];
    let right = 0;
    inputs.forEach((inp) => {
      const want = Number(inp.dataset.answer);
      const tol = Number(inp.dataset.tol || 0);
      const got = parseValue(inp.value);
      const ok = inp.value.trim() !== "" && Math.abs(got - want) <= tol + 1e-9;
      inp.classList.toggle("correct", ok);
      inp.classList.toggle("wrong", !ok);
      if (ok) right++;
    });
    if (!feedback) return;
    feedback.textContent = right === inputs.length
      ? "Alles richtig. " + (feedback.dataset.done || "")
      : `${right} von ${inputs.length} richtig. Rot markierte Felder noch einmal prüfen.`;
  });
});
