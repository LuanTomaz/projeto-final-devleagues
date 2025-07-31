const quiz = [
  {
    image: "../Assets/Imagens-Quiz/picapau.jpg",
    options: ["Zeca Urubu", "Picolino", "Pica-Pau", "Andy Panda"],
    answer: "Pica-Pau"
  },
  {
    image: "../Assets/Imagens-Quiz/zecaurubu.webp",
    options: ["Toquinho", "Zeca Urubu", "Pé de Pano", "Wally Walrus"],
    answer: "Zeca Urubu"
  },
  {
    image: "../Assets/Imagens-Quiz/leoncio.jpg",
    options: ["Leôncio", "Zeca Urubu", "Wally Walrus", "Buzz Buzzard"],
    answer: "Leôncio"
  },
  {
    image: "../Assets/Imagens-Quiz/meany.jpg",
    options: ["Meany Ranheta", "Paulina", "Lasquita", "Leôncio"],
    answer: "Meany Ranheta"
  },
  {
    image: "../Assets/Imagens-Quiz/toquinho.webp",
    options: ["Picolino", "Toquinho", "Zeca Urubu", "Andy Panda"],
    answer: "Toquinho"
  },
  {
    image: "../Assets/Imagens-Quiz/lasquita.webp",
    options: ["Lasquita", "Paulina", "Toquinho", "Meany Ranheta"],
    answer: "Lasquita"
  },
  {
    image: "../Assets/Imagens-Quiz/picolino.webp",
    options: ["Paulina", "Picolino", "Wally Walrus", "Buzz Buzzard"],
    answer: "Picolino"
  },
  {
    image: "../Assets/Imagens-Quiz/zejacare.webp",
    options: ["Paulina", "Meany Ranheta", "Zé jacare", "Zeca Urubu"],
    answer: "Zé jacare"
  },
  {
    image: "../Assets/Imagens-Quiz/pédepano.jpg",
    options: ["Pé de Pano", "Buzz Buzzard", "Leôncio", "Andy Panda"],
    answer: "Pé de Pano"
  }
];

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
  const q = quiz[currentQuestion];
  const img = new Image();
  img.src = q.image;

  img.onload = () => {
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
  };
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

function showResult() {
  const container = document.getElementById("quiz-container");
  let mensagemFinal = "";

  if (score === 0) {
    mensagemFinal = "Nunca assistiu Pica-Pau";
  } else if (score <= 3) {
    mensagemFinal = "Você conhece pouco sobre o Pica-Pau.";
  } else if (score <= 6) {
    mensagemFinal = "Está na Média";
  } else if (score <= 8) {
    mensagemFinal = "Você é um fã de carteirinha!";
  } else {
    mensagemFinal = "Excelente!!!";
  }

  saveScore(score);
  const ranking = getRankingHTML();

  container.innerHTML = `
    <h2>Quiz concluído!</h2>
    <p id="result">Você acertou ${score} de ${quiz.length} personagens.</p>
    <p class="mensagem-final">${mensagemFinal}</p>
    <h3>Ranking:</h3>
    <ol>${ranking}</ol>
    <button onclick="restartQuiz()" class="btn">Jogar Novamente</button>
  `;
}

function saveScore(score) {
  const stored = JSON.parse(localStorage.getItem("ranking")) || [];
  stored.push(score);
  stored.sort((a, b) => b - a);
  const top5 = stored.slice(0, 5);
  localStorage.setItem("ranking", JSON.stringify(top5));
}

function getRankingHTML() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  return ranking.map((s, i) => `<li>${i + 1}º lugar: ${s} pontos</li>`).join("");
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

window.onload = loadQuestion;
