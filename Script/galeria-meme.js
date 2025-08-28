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
            if (!response.ok) {
                throw new Error('Erro ao carregar os memes');
            }
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMeme),
            });
            if (!response.ok) {
                throw new Error('Erro ao adicionar o meme');
            }
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMeme),
            });
            if (!response.ok) {
                throw new Error('Erro ao curtir o meme');
            }
            const data = await response.json();
            // Atualiza o objeto do meme no array local
            Object.assign(meme, data); 
            return meme.likes;
        } catch (error) {
            console.error("Falha ao curtir o meme:", error);
            return meme.likes; // Retorna o valor original em caso de erro
        }
    }

    // Função para postar um comentário via API
    async function postComment(meme, newComment) {
        try {
            const updatedMeme = { ...meme, comments: [...meme.comments, newComment] };
            const response = await fetch(`${API_URL}/${meme.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMeme),
            });
            if (!response.ok) {
                throw new Error('Erro ao postar o comentário');
            }
            const data = await response.json();
            // Atualiza o objeto do meme no array local
            Object.assign(meme, data);
            return meme.comments;
        } catch (error) {
            console.error("Falha ao postar o comentário:", error);
            return meme.comments; // Retorna o valor original em caso de erro
        }
    }
     
    // configurar eventos do formulário
    function setupForm() {
        const memeFormContainer = document.getElementById('memeFormContainer');
        const memeForm = document.getElementById('memeForm');
        
        // mostrar formulário
        document.getElementById('showFormBtn').addEventListener('click', function() {
            memeFormContainer.classList.add('active');
        });
        
        // ocultar formulário
        document.getElementById('cancelFormBtn').addEventListener('click', function() {
            memeFormContainer.classList.remove('active');
            memeForm.reset();
        });
        
        // enviar novo meme
        memeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const url = document.getElementById('memeUrl').value.trim();
            const category = document.getElementById('memeCategory').value;
            
            if (url) {
                const newMeme = {
                    src: url,
                    likes: 0,
                    category: category,
                    comments: []
                };
                
                await addMeme(newMeme);
                
                // fecha e limpa o formulário
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
            memeElement.dataset.id = meme.id;
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
    
    // iniciar a galeria
    fetchMemes();
    
    // filtro por categoria
    filterButtons.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            const category = e.target.dataset.category;
            if (category === 'all') {
                renderGallery();
            } else {
                const filteredMemes = allMemes.filter(meme => meme.category === category);
                renderGallery(filteredMemes);
            }
        }
    });
    
    // mostrar/ocultar formulário
    document.getElementById('showFormBtn').addEventListener('click', function() {
        memeForm.style.display = 'block';
    });
    
    document.getElementById('cancelFormBtn').addEventListener('click', function() {
        memeForm.style.display = 'none';
        document.getElementById('memeForm').reset();
    });
    
    
    // abrir modal com meme ampliado
    gridContainer.addEventListener('click', function(e) {
        const gridItem = e.target.closest('.grid-item');
        if (gridItem) {
            const memeId = parseInt(gridItem.dataset.id);
            const meme = allMemes.find(m => m.id === memeId);
            
            if (meme) {
                const modalImg = modal.querySelector('.modal-meme-img');
                const likeCount = modal.querySelector('.like-count');
                const commentsList = modal.querySelector('.comments-list');
                
                modalImg.src = meme.src;
                likeCount.textContent = meme.likes;
                
                // preencher comentários
                commentsList.innerHTML = '';
                meme.comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.textContent = comment;
                    commentsList.appendChild(commentElement);
                });
                
                modal.style.display = 'block';
                
                // configurar like button no modal
                const likeBtn = modal.querySelector('.like-btn');
                likeBtn.onclick = async function() {
                    const newLikes = await likeMeme(meme);
                    likeCount.textContent = newLikes;
                    
                    // atualizar contador na galeria
                    const memeInGallery = document.querySelector(`.grid-item[data-id="${meme.id}"] .meme-likes`);
                    if (memeInGallery) {
                        memeInGallery.textContent = `❤️ ${meme.likes}`;
                    }
                };
                
                // configurar adição de comentários
                const commentInput = modal.querySelector('.comment-input');
                const postCommentBtn = modal.querySelector('.post-comment-btn');
                
                postCommentBtn.onclick = async function() {
                    if (commentInput.value.trim()) {
                        const newComments = await postComment(meme, commentInput.value.trim());
                        
                        // Atualiza a lista de comentários no modal
                        commentsList.innerHTML = '';
                        newComments.forEach(comment => {
                            const commentElement = document.createElement('div');
                            commentElement.className = 'comment';
                            commentElement.textContent = comment;
                            commentsList.appendChild(commentElement);
                        });
                        
                        commentInput.value = '';
                    }
                };
            }
        }
    });
    
    // fechar modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // curtir meme diretamente na galeria
    gridContainer.addEventListener('click', async function(e) {
        const likeElement = e.target.closest('.meme-likes');
        if (likeElement) {
            e.preventDefault();
            e.stopPropagation();
            
            const gridItem = likeElement.closest('.grid-item');
            const memeId = parseInt(gridItem.dataset.id);
            const meme = allMemes.find(m => m.id === memeId);
            
            if (meme) {
                const newLikes = await likeMeme(meme);
                likeElement.textContent = `❤️ ${newLikes}`;
            }
        }
    });
});