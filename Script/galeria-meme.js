document.addEventListener('DOMContentLoaded', function() {

    const API_URL = 'http://localhost:3000/memes';
    let allMemes = []; // Armazenar os memes da API
    
    // elementos do DOM
    const gridContainer = document.querySelector('.grid-container');
    const filterButtons = document.createElement('div');
    filterButtons.className = 'filter-buttons';
    
    // adicionar botões de filtro
    filterButtons.innerHTML = `
        <button class="filter-btn active" data-category="all">Todos</button>
        <button class="filter-btn" data-category="humor">Humor</button>
        <button class="filter-btn" data-category="sarcasmo">Sarcasmo</button>
        <button class="filter-btn" data-category="nostalgia">Nostalgia</button>
        <button class="add-meme-btn" id="showFormBtn">Enviar Meme</button>
    `;
    
    // inserir botões de filtro antes da galeria
    gridContainer.parentNode.insertBefore(filterButtons, gridContainer);

    // Função para carregar memes da API
    async function fetchMemes() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erro ao carregar os memes');
            allMemes = await response.json();
            renderGallery();
        } catch (error) {
            console.error("Falha ao buscar os memes:", error);
            alert("Não foi possível carregar os memes. Verifique se o json-server está rodando.");
        }
    }

    // Função para adicionar um novo meme via API
    async function addMeme(newMeme) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMeme),
            });
            if (!response.ok) throw new Error('Erro ao adicionar o meme');
            const addedMeme = await response.json();
            allMemes.push(addedMeme);
            renderGallery();
        } catch (error) {
            console.error("Falha ao adicionar o meme:", error);
            alert("Não foi possível adicionar o meme.");
        }
    }

    // Função para curtir um meme via API
    async function likeMeme(meme) {
        try {
            const updatedMeme = { ...meme, likes: meme.likes + 1 };
            const response = await fetch(`${API_URL}/${meme.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMeme),
            });
            if (!response.ok) throw new Error('Erro ao curtir o meme');
            const data = await response.json();
            Object.assign(meme, data);
            return meme.likes;
        } catch (error) {
            console.error("Falha ao curtir o meme:", error);
            return meme.likes;
        }
    }

    // Função para postar um comentário via API
    async function postComment(meme, newComment) {
        try {
            const updatedMeme = { ...meme, comments: [...meme.comments, newComment] };
            const response = await fetch(`${API_URL}/${meme.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMeme),
            });
            if (!response.ok) throw new Error('Erro ao postar o comentário');
            const data = await response.json();
            Object.assign(meme, data);
            return meme.comments;
        } catch (error) {
            console.error("Falha ao postar o comentário:", error);
            return meme.comments;
        }
    }

    // configurar eventos do formulário
    function setupForm() {
        const memeFormContainer = document.getElementById('memeFormContainer');
        const memeForm = document.getElementById('memeForm');
        
        document.getElementById('showFormBtn').addEventListener('click', () => {
            memeFormContainer.classList.add('active');
        });

        document.getElementById('cancelFormBtn').addEventListener('click', () => {
            memeFormContainer.classList.remove('active');
            memeForm.reset();
        });

        memeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const url = document.getElementById('memeUrl').value.trim();
            const category = document.getElementById('memeCategory').value;
            
            if (url) {
                const newMeme = { src: url, likes: 0, category: category, comments: [] };
                await addMeme(newMeme);
                memeForm.reset();
                memeFormContainer.classList.remove('active');
            }
        });
    }

    setupForm();

    // modal para exibir meme ampliado
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img class="modal-meme-img" src="" alt="Meme">
            <div class="meme-info">
                <div class="meme-likes">
                    <span class="like-count">0</span> curtidas
                    <button class="like-btn">❤️ Curtir</button>
                </div>
                <div class="meme-comments">
                    <h4>Comentários</h4>
                    <div class="comments-list"></div>
                    <div class="add-comment">
                        <input type="text" placeholder="Adicione um comentário..." class="comment-input">
                        <button class="post-comment-btn">Postar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // renderizar a galeria
    function renderGallery(memesToRender = allMemes) {
        gridContainer.innerHTML = '';
        memesToRender.forEach(meme => {
            const memeElement = document.createElement('div');
            memeElement.className = 'grid-item';
            memeElement.dataset.id = meme.id; // mantemos como string
            memeElement.dataset.category = meme.category;
            memeElement.innerHTML = `
                <img src="${meme.src}" alt="Meme ${meme.id}">
                <div class="meme-overlay">
                    <span class="meme-likes">❤️ ${meme.likes}</span>
                </div>
            `;
            gridContainer.appendChild(memeElement);
        });
    }

    fetchMemes();

    // filtro por categoria
    filterButtons.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            if (category === 'all') renderGallery();
            else renderGallery(allMemes.filter(meme => meme.category === category));
        }
    });

    // abrir modal com meme ampliado
    gridContainer.addEventListener('click', function(e) {
        const gridItem = e.target.closest('.grid-item');
        if (!gridItem) return;

        const memeId = gridItem.dataset.id; // agora string
        const meme = allMemes.find(m => m.id === memeId);
        if (!meme) return;

        const modalImg = modal.querySelector('.modal-meme-img');
        const likeCount = modal.querySelector('.like-count');
        const commentsList = modal.querySelector('.comments-list');

        modalImg.src = meme.src;
        likeCount.textContent = meme.likes;

        commentsList.innerHTML = '';
        meme.comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.textContent = comment;
            commentsList.appendChild(commentElement);
        });

        modal.style.display = 'block';

        // like modal
        const likeBtn = modal.querySelector('.like-btn');
        likeBtn.onclick = async function() {
            const newLikes = await likeMeme(meme);
            likeCount.textContent = newLikes;

            const memeInGallery = document.querySelector(`.grid-item[data-id="${meme.id}"] .meme-likes`);
            if (memeInGallery) memeInGallery.textContent = `❤️ ${newLikes}`;
        };

        // comentários modal
        const commentInput = modal.querySelector('.comment-input');
        const postCommentBtn = modal.querySelector('.post-comment-btn');
        postCommentBtn.onclick = async function() {
            if (commentInput.value.trim()) {
                const newComments = await postComment(meme, commentInput.value.trim());
                commentsList.innerHTML = '';
                newComments.forEach(c => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.textContent = c;
                    commentsList.appendChild(commentElement);
                });
                commentInput.value = '';
            }
        };
    });

    // fechar modal
    modal.querySelector('.close-modal').addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

    // curtir direto na galeria
    gridContainer.addEventListener('click', async function(e) {
        const likeElement = e.target.closest('.meme-likes');
        if (!likeElement) return;

        e.preventDefault();
        e.stopPropagation();
        const gridItem = likeElement.closest('.grid-item');
        const memeId = gridItem.dataset.id; // string
        const meme = allMemes.find(m => m.id === memeId);
        if (!meme) return;

        const newLikes = await likeMeme(meme);
        likeElement.textContent = `❤️ ${newLikes}`;
    });

});
