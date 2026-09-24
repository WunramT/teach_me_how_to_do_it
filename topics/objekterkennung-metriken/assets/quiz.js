// Multiple-Choice-Quiz. Markup:
// <div class="quiz">
//   <p>Frage</p>
//   <button data-ok data-why="Warum richtig">Antwort A</button>
//   <button data-why="Warum falsch">Antwort B</button>
//   <p class="feedback"></p>
// </div>
document.querySelectorAll(".quiz").forEach((quiz) => {
  const feedback = quiz.querySelector(".feedback");
  quiz.querySelectorAll("button").forEach((btn) => {
    btn.type = "button";
    btn.addEventListener("click", () => {
      const ok = btn.hasAttribute("data-ok");
      btn.classList.add(ok ? "correct" : "wrong");
      if (feedback) feedback.textContent = (ok ? "Richtig. " : "Noch nicht. ") + (btn.dataset.why || "");
    });
  });
});
