const container = document.getElementById('containerEpisodios');
const filtroProtagonista = document.getElementById('filtroProtagonista');
const filtroAno = document.getElementById('filtroAno');
const btnSurpreenda = document.getElementById('btnSurpreenda');
const modal = document.getElementById('modalPlayer');
const iframePlayer = document.getElementById('player');
const closeModal = document.getElementById('closeModal');
const selectDeletar = document.getElementById('delId');
const selectAtualizar = document.getElementById('upId');

const API_URL = 'http://localhost:3000/episodios';

// -------------------- FUNÇÕES AUXILIARES -------------------- //

async function buscarEpisodios() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar episódios:', err);
    return [];
  }
}

function renderizarEpisodios(lista) {
  container.innerHTML = '';
  if (!lista.length) {
    container.innerHTML = '<p style="color:white;">Nenhum episódio encontrado.</p>';
    return;
  }

  lista.forEach(ep => {
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = `
      <img src="${ep.imagem}" alt="Episódio ${ep.titulo}">
      <button class="btnAssistir" data-youtube="${ep.youtube}">Assistir</button>
      <button class="btnFavoritar" data-id="${ep.id}">⭐ Favoritar</button>
      <p class="titulo-episodio">${ep.titulo}</p>
    `;
    container.appendChild(box);
  });

  document.querySelectorAll('.btnAssistir').forEach(btn => {
    btn.addEventListener('click', () => abrirModal(btn.dataset.youtube));
  });

  document.querySelectorAll('.btnFavoritar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const epId = btn.dataset.id;
      const episodios = await buscarEpisodios();
      const epSelecionado = episodios.find(e => e.id == epId);
      salvarFavorito({
        id: epSelecionado.id,
        titulo: epSelecionado.titulo,
        imagem: epSelecionado.imagem,
        tipo: 'episodio'
      });
    });
  });
}

function salvarFavorito(item) {
  let favoritos = JSON.parse(localStorage.getItem('favoritosPicaPau')) || [];
  if (!favoritos.some(fav => fav.id === item.id && fav.tipo === item.tipo)) {
    favoritos.push(item);
    localStorage.setItem('favoritosPicaPau', JSON.stringify(favoritos));
    alert('Episódio favoritado!');
  } else {
    alert('Episódio já está nos favoritos!');
  }
}

function removerFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem('favoritosPicaPau')) || [];
  favoritos = favoritos.filter(fav => fav.id != id);
  localStorage.setItem('favoritosPicaPau', JSON.stringify(favoritos));
}

function abrirModal(youtubeLink) {
  iframePlayer.src = youtubeLink;
  modal.style.display = 'flex';
}

function fecharModal() {
  iframePlayer.src = '';
  modal.style.display = 'none';
}

closeModal.addEventListener('click', fecharModal);
modal.addEventListener('click', e => { if (e.target === modal) fecharModal(); });

// -------------------- FILTROS -------------------- //
async function aplicarFiltros() {
  const prot = filtroProtagonista.value;
  const ano = filtroAno.value;
  const episodios = await buscarEpisodios();
  const filtrados = episodios.filter(ep => (prot === '' || ep.protagonista === prot) && (ano === '' || ep.ano === ano));
  renderizarEpisodios(filtrados);
}

filtroProtagonista.addEventListener('change', aplicarFiltros);
filtroAno.addEventListener('change', aplicarFiltros);

// -------------------- ME SURPREENDA -------------------- //
btnSurpreenda.addEventListener('click', async () => {
  const episodios = await buscarEpisodios();
  if (!episodios.length) return alert('Nenhum episódio disponível.');
  const aleatorio = episodios[Math.floor(Math.random() * episodios.length)];
  abrirModal(aleatorio.youtube);
});

// -------------------- ADICIONAR -------------------- //
document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const episodios = await buscarEpisodios();
  const ultimoId = episodios.length ? Math.max(...episodios.map(ep => ep.id)) : 0;

  const novoEpisodio = {
    id: ultimoId + 1,
    titulo: document.getElementById('adTitulo').value,
    imagem: document.getElementById('adImagem').value,
    youtube: document.getElementById('adYoutube').value,
    protagonista: document.getElementById('adProtagonista').value,
    ano: document.getElementById('adAno').value
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoEpisodio)
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    await atualizarEpisodios();
    alert(`Episódio "${novoEpisodio.titulo}" adicionado!`);
  } catch (err) {
    console.error(err);
  }
});

// -------------------- ATUALIZAR -------------------- //
document.getElementById('formAtualizar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = selectAtualizar.value;
  const episodios = await buscarEpisodios();
  const epExistente = episodios.find(ep => ep.id == id);
  if (!epExistente) return alert("Episódio não encontrado!");

  const dadosAtualizados = {
    titulo: document.getElementById('upTitulo').value || epExistente.titulo,
    imagem: document.getElementById('upImagem').value || epExistente.imagem,
    youtube: document.getElementById('upYoutube').value || epExistente.youtube,
    protagonista: document.getElementById('upProtagonista').value || epExistente.protagonista,
    ano: document.getElementById('upAno').value || epExistente.ano
  };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(id), ...dadosAtualizados })
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    alert(`Episódio "${dadosAtualizados.titulo}" atualizado!`);
    await atualizarEpisodios();
  } catch (err) {
    console.error(err);
  }
});

// Preencher campos update ao selecionar
selectAtualizar.addEventListener('change', async () => {
  const id = selectAtualizar.value;
  const episodios = await buscarEpisodios();
  const ep = episodios.find(e => e.id == id);
  if (!ep) return;
  document.getElementById('upTitulo').value = ep.titulo;
  document.getElementById('upImagem').value = ep.imagem;
  document.getElementById('upYoutube').value = ep.youtube;
  document.getElementById('upProtagonista').value = ep.protagonista;
  document.getElementById('upAno').value = ep.ano;
});

// -------------------- DELETAR -------------------- //
document.getElementById('formDeletar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = selectDeletar.value;
  const episodios = await buscarEpisodios();
  const epParaDeletar = episodios.find(ep => ep.id == id);
  if (!epParaDeletar) return alert("ID inválido!");

  if (!confirm(`Tem certeza que deseja deletar "${epParaDeletar.titulo}"?`)) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    removerFavorito(epParaDeletar.id);
    alert(`Episódio "${epParaDeletar.titulo}" deletado!`);
    await atualizarEpisodios();
  } catch (err) {
    console.error(err);
  }
});

// -------------------- ATUALIZAR LISTA E SELECTS -------------------- //
async function atualizarEpisodios() {
  const lista = await buscarEpisodios();
  renderizarEpisodios(lista);

  // Select deletar
  selectDeletar.innerHTML = '';
  lista.forEach(ep => {
    const option = document.createElement('option');
    option.value = ep.id;
    option.textContent = `ID: ${ep.id} | ${ep.titulo} | Ano: ${ep.ano}`;
    selectDeletar.appendChild(option);
  });

  // Select atualizar
  selectAtualizar.innerHTML = '';
  lista.forEach(ep => {
    const option = document.createElement('option');
    option.value = ep.id;
    option.textContent = `ID: ${ep.id} | ${ep.titulo} | Ano: ${ep.ano}`;
    selectAtualizar.appendChild(option);
  });
}

// -------------------- INICIALIZAÇÃO -------------------- //
(async () => { await atualizarEpisodios(); })();
