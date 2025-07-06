const curiosidades = [
    { personagem: "Pica-Pau", imagem: "/assets/Curiosidades-Personagens/pica-pau.png", curiosidades: ["Criado por Walter Lantz em 1940. Sua risada icônica foi dublada por Mel Blanc. O personagem já teve mais de 3 versões visuais ao longo das décadas."] },
    { personagem: "Zeca Urubu", imagem: "/assets/Curiosidades-Personagens/zeca.png", curiosidades: ["É o principal antagonista do Pica-Pau. Costuma criar planos mirabolantes que quase nunca funcionam.Sua voz no Brasil foi dublada por diversos artistas ao longo do tempo."] },
    { personagem: "Leôncio", imagem: "/assets/Curiosidades-Personagens/leoncio.png", curiosidades: ["É um leão-marinho norueguês. Geralmente aparece como chefe ou figura de autoridade. Sua paciência é sempre testada pelo Pica-Pau."] },
    { personagem: "Andy Panda", imagem: "/assets/Curiosidades-Personagens/andy.png", curiosidades: ["Foi um dos primeiros personagens de Walter Lantz. É mais calmo e educado do que o Pica-Pau. Participou de episódios com temática mais leve e infantil."] },
    { personagem: "Toquinho", imagem: "/assets/Curiosidades-Personagens/toquinho.png", curiosidades: ["É o sobrinho do Pica-Pau. Sempre tenta ajudar, mesmo sendo atrapalhado. Aparece principalmente nos episódios mais novos."] },
    { personagem: "Lasquita", imagem: "/assets/Curiosidades-Personagens/lasquita.png", curiosidades: ["É a sobrinha do Pica-Pau.Tem personalidade forte e é inteligente. Costuma entrar em aventuras com Toquinho."] },
    { personagem: "Dália", imagem: "/assets/Curiosidades-Personagens/dalia.png", curiosidades: ["É uma pica-pau fêmea que aparece como a namorada do Pica-Pau nas versões mais modernas da série. É vaidosa e muito preocupada com sua aparência. Geralmente rejeita o Pica-Pau por suas travessuras."] },
    { personagem: "Meany Ranheta", imagem: "/assets/Curiosidades-Personagens/Meany Ranheta.png", curiosidades: ["Vizinha ranzinza do Pica-Pau, Meany Ranheta é conhecida por seu temperamento explosivo e por sempre tentar impor regras. Vive se irritando com as travessuras do Pica-Pau, mas raramente consegue sair por cima nas confusões."] },
    { personagem: "Picolino", imagem: "/assets/Curiosidades-Personagens/picolino.png", curiosidades: ["É um pinguim amigo do Pica-Pau. Tem episódios em que precisa de ajuda para escapar de enrascadas. Geralmente aparece sem falar, com comunicação visual."] },
    { personagem: "Pigeon Boss", imagem: "/assets/Curiosidades-Personagens/pigeon-boss.png", curiosidades: ["Chefe mal-humorado do prédio onde o Pica-Pau mora, Pigeon Boss é um pombo sisudo que está sempre tentando expulsar o protagonista por perturbar a ordem. Vive em guerra com o Pica-Pau, mas quase nunca consegue vencê-lo."] }
  ];

  const filtroContainer = document.getElementById("filtro-personagens");
  const cardsContainer = document.getElementById("cards-curiosidades");
  const curiosidadeDia = document.getElementById("curiosidade-dia");
  const botaoAleatorio = document.getElementById("botao-aleatorio");

  function renderizarFiltros() {
    const btnTodos = document.createElement("button");
    btnTodos.textContent = "Todos";
    btnTodos.style.cssText = "padding:10px 15px; border-radius:6px; background-color:#fff; color:#000; font-weight:bold; cursor:pointer; transition:background-color 0.3s;";
    btnTodos.onmouseover = () => btnTodos.style.backgroundColor = "#ddd";
    btnTodos.onmouseleave = () => btnTodos.style.backgroundColor = "#fff";
    btnTodos.onclick = () => mostrarTodos();
    filtroContainer.appendChild(btnTodos);

    curiosidades.forEach(({ personagem }) => {
      const btn = document.createElement("button");
      btn.textContent = personagem;
      btn.style.cssText = "padding:10px 15px; border-radius:6px; background-color:#fff; color:#000; font-weight:bold; cursor:pointer; transition:background-color 0.3s;";
      btn.onmouseover = () => btn.style.backgroundColor = "#ddd";
      btn.onmouseleave = () => btn.style.backgroundColor = "#fff";
      btn.onclick = () => mostrarCuriosidades(personagem);
      filtroContainer.appendChild(btn);
    });
  }

  function mostrarCuriosidades(personagem) {
    cardsContainer.innerHTML = "";
    const escolhido = curiosidades.find(p => p.personagem === personagem);
    escolhido.curiosidades.forEach(texto => {
      const card = criarCard(escolhido.imagem, personagem, texto);
      cardsContainer.appendChild(card);
    });
  }

  function mostrarTodos() {
    cardsContainer.innerHTML = "";
    curiosidades.forEach(p => {
      p.curiosidades.forEach(c => {
        const card = criarCard(p.imagem, p.personagem, c);
        cardsContainer.appendChild(card);
      });
    });
  }

  function mostrarCuriosidadeAleatoria() {
    const todas = curiosidades.flatMap(p => p.curiosidades.map(c => ({ img: p.imagem, personagem: p.personagem, texto: c })));
    const r = todas[Math.floor(Math.random() * todas.length)];
    cardsContainer.innerHTML = "";
    const card = criarCard(r.img, r.personagem, r.texto);
    cardsContainer.appendChild(card);
  }

  function criarCard(imagem, personagem, texto) {
    const div = document.createElement("div");
    div.className = "card";
    div.style.cssText = "background:#ffffff10; padding:20px; border-radius:12px; color:white; text-align:center; box-shadow:0 4px 8px rgba(0,0,0,0.3);";
    div.innerHTML = `
      <img src="${imagem}" alt="${personagem}" style="width:200px; height: 200px; border-radius:50%; margin-bottom:10px;">
      <h4>${personagem}</h4>
      <p>${texto}</p>
    `;
    return div;
  }

  function curiosidadeDoDia() {
    const todas = curiosidades.flatMap(p => p.curiosidades);
    const random = todas[Math.floor(Math.random() * todas.length)];
    curiosidadeDia.textContent = `Curiosidade do dia: ${random}`;
  }

  renderizarFiltros();
  curiosidadeDoDia();
  botaoAleatorio.onclick = mostrarCuriosidadeAleatoria;