let quiz = [];
let currentQuestion = 0;
let score = 0;

async function loadQuizData() {
  try {
    const res = await fetch("http://localhost:3000/quiz");
    quiz = await res.json();
    loadQuestion();
  } catch (err) {
    console.error("Erro ao carregar quiz:", err);
    document.getElementById("quiz-container").innerHTML =
      "<p>Erro ao carregar o quiz. Verifique se o json-server está rodando.</p>";
  }
}

function loadQuestion() {
  const q = quiz[currentQuestion];
  const container = document.getElementById("quiz-container");

  container.innerHTML = `
    <h2>Quem é esse personagem?</h2>
    <img src="${q.image}" alt="Personagem do Quiz" class="quiz-image">
    <div id="options"></div>  
    <div id="result"></div>
  `;

  const optionsEl = document.getElementById("options");
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "btn";
    btn.onclick = () => checkAnswer(option);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === quiz[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;
  if (currentQuestion < quiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

async function showResult() {
  const container = document.getElementById("quiz-container");

  let mensagemFinal = "";
  if (score === 0) mensagemFinal = "Nunca assistiu Pica-Pau";
  else if (score <= 3) mensagemFinal = "Você conhece pouco sobre o Pica-Pau.";
  else if (score <= 6) mensagemFinal = "Está na Média";
  else if (score <= 8) mensagemFinal = "Você é um fã de carteirinha!";
  else mensagemFinal = "Excelente!!!";

  await fetch("http://localhost:3000/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pontos: score })
  });

  const res = await fetch("http://localhost:3000/ranking");
  let ranking = await res.json();

  ranking.sort((a, b) => b.pontos - a.pontos);

  container.innerHTML = `
    <h2>Quiz concluído!</h2>
    <p id="result">Você acertou ${score} de ${quiz.length} personagens.</p>
    <p class="mensagem-final">${mensagemFinal}</p>
    <h3>Ranking:</h3>
    <ol>
      ${ranking.slice(0, 5).map((s, i) => `<li>${i + 1}º lugar: ${s.pontos} pontos</li>`).join("")}
    </ol>
    <button onclick="restartQuiz()" class="btn">Jogar Novamente</button>
  `;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

window.onload = loadQuizData;
