// Recupera os favoritos do localStorage
function getFavoritos() {
    const favoritos = localStorage.getItem("favoritosPicaPau");
    return favoritos ? JSON.parse(favoritos) : [];
}

// Salva um item nos favoritos
function salvarFavorito(item) {
    const favoritos = getFavoritos();
    if (!favoritos.find(fav => fav.id === item.id)) {
        favoritos.push(item);
        localStorage.setItem("favoritosPicaPau", JSON.stringify(favoritos));
        alert("Item salvo nos favoritos!");
    } else {
        alert("Este item já está nos favoritos.");
    }
}

// Remove um item dos favoritos
function removerFavorito(id) {
    const favoritos = getFavoritos();

    // Aqui garanto que a comparação vai bater tanto se o id for string quanto número
    const novosFavoritos = favoritos.filter(item => String(item.id) !== String(id));

    localStorage.setItem("favoritosPicaPau", JSON.stringify(novosFavoritos));
    renderizarFavoritos(); 
}

// Renderiza os favoritos na página
function renderizarFavoritos() {
    const lista = document.getElementById("lista-coletas");
    if (!lista) return;

    const favoritos = getFavoritos();
    const total = favoritos.length;

    if (total === 0) {
        lista.innerHTML = '<p class="sem-coletas">Você ainda não salvou nenhum item. Comece a explorar e salve seus favoritos!</p>';
        document.getElementById("total-coletas").innerText = 0;
        document.getElementById("episodios-contador").innerText = 0;
        document.getElementById("curiosidades-contador").innerText = 0;
        document.getElementById("memes-contador").innerText = 0;
        return;
    }

    let html = "";
    let episodios = 0, curiosidades = 0, memes = 0;

    favoritos.forEach(item => {
        let cor = "";
        if (item.tipo === "episodio") {
            episodios++;
            cor = "#FFD700"; 
        } else if (item.tipo === "curiosidade") {
            curiosidades++;
            cor = "#7FFFD4"; 
        } else if (item.tipo === "meme") {
            memes++;
            cor = "#FF69B4"; 
        }

        html += `
        <div class="coleta-item" data-tipo="${item.tipo}">
            <button class="btn-remover" onclick="removerFavorito('${item.id}')">×</button>
            <img src="${item.imagem}" alt="${item.titulo}" />
            <p class="titulo-item ${item.tipo}">${item.titulo}</p>
        </div>
        `;
    });

    lista.innerHTML = html;

    document.getElementById("total-coletas").innerText = total;
    document.getElementById("episodios-contador").innerText = episodios;
    document.getElementById("curiosidades-contador").innerText = curiosidades;
    document.getElementById("memes-contador").innerText = memes;

    aplicarFiltro();
}

// Filtro por categoria
function aplicarFiltro() {
    const botoes = document.querySelectorAll(".filtro-btn");
    const itens = document.querySelectorAll(".coleta-item");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            botao.classList.add("active");

            const tipo = botao.dataset.tipo;
            itens.forEach(item => {
                item.style.display = (tipo === "todos" || item.dataset.tipo === tipo) ? "block" : "none";
            });
        });
    });
}

// Só roda na página de favoritos
if (window.location.pathname.includes("favoritos.html")) {
    window.addEventListener("DOMContentLoaded", renderizarFavoritos);
}
