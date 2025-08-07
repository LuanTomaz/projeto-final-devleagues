const episodios = [
  {
    id: 'ep01',
    titulo: 'Barbeiro de Sevilla',
    imagem: '../Assets/Imagens-EpisodiosClassicos/BarbeiroSevilla.jpg',
    youtube: 'https://www.youtube.com/embed/UpIz6f6iuDw',
    protagonista: 'Pica-Pau',
    ano: '1944',
  },
  {
    id: 'ep02',
    titulo: 'Azares de um corvo',
    imagem: '../Assets/Imagens-EpisodiosClassicos/AzaresDeUmCorvo.jpg',
    youtube: 'https://www.youtube.com/embed/NcBb12z0lMg',
    protagonista: 'Corvo',
    ano: '1945',
  },
  {
    id: 'ep03',
    titulo: 'Pica-Pau Biruta',
    imagem: '../Assets/Imagens-EpisodiosClassicos/PicaPauBiruta.jpg',
    youtube: 'https://www.youtube.com/embed/f4VLjEdB0Ug',
    protagonista: 'Pica-Pau',
    ano: '1946',
  },
  {
    id: 'ep04',
    titulo: 'Cataratas do Niágara',
    imagem: '../Assets/Imagens-EpisodiosClassicos/NiagaraFalls.jpg',
    youtube: 'https://www.youtube.com/embed/hL5OkqZ4L7U',
    protagonista: 'Outro',
    ano: '1950',
  },
  {
    id: 'ep05',
    titulo: 'Bebê Abutre',
    imagem: '../Assets/Imagens-EpisodiosClassicos/BebeAbutre.jpg',
    youtube: 'https://www.youtube.com/embed/zqd3yxBIi_A',
    protagonista: 'Outro',
    ano: '1952',
  },
  {
    id: 'ep06',
    titulo: 'A Vassoura da Bruxa',
    imagem: '../Assets/Imagens-EpisodiosClassicos/AVassouraDaBruxa.jpg',
    youtube: 'https://www.youtube.com/embed/4qZgTsqCCAs',
    protagonista: 'Pica-Pau',
    ano: '1960',
  },
];

const container = document.getElementById('containerEpisodios');
const filtroProtagonista = document.getElementById('filtroProtagonista');
const filtroAno = document.getElementById('filtroAno');
const btnSurpreenda = document.getElementById('btnSurpreenda');
const modal = document.getElementById('modalPlayer');
const iframePlayer = document.getElementById('player');
const closeModal = document.getElementById('closeModal');

function renderizarEpisodios(lista) {
  container.innerHTML = '';
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
    btn.addEventListener('click', () => {
      abrirModal(btn.dataset.youtube);
    });
  });

  document.querySelectorAll('.btnFavoritar').forEach(btn => {
    btn.addEventListener('click', () => {
      const epId = btn.dataset.id;
      const epSelecionado = episodios.find(e => e.id === epId);
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
  const jaExiste = favoritos.some(fav => fav.id === item.id && fav.tipo === item.tipo);

  if (!jaExiste) {
    favoritos.push(item);
    localStorage.setItem('favoritosPicaPau', JSON.stringify(favoritos));
    alert('Episódio favoritado!');
  } else {
    alert('Episódio já está nos favoritos!');
  }
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
modal.addEventListener('click', e => {
  if (e.target === modal) fecharModal();
});

function aplicarFiltros() {
  const prot = filtroProtagonista.value;
  const ano = filtroAno.value;

  const filtrados = episodios.filter(ep => {
    return (prot === '' || ep.protagonista === prot) &&
           (ano === '' || ep.ano === ano);
  });

  renderizarEpisodios(filtrados);
}

filtroProtagonista.addEventListener('change', aplicarFiltros);
filtroAno.addEventListener('change', aplicarFiltros);

btnSurpreenda.addEventListener('click', () => {
  const aleatorio = episodios[Math.floor(Math.random() * episodios.length)];
  abrirModal(aleatorio.youtube);
});

renderizarEpisodios(episodios);
