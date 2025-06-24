document.addEventListener('DOMContentLoaded', function() {

    // array de memes 
    const memes = [
        { id: 1, src: "../Assets/Images-Memes/meme1.jpg", likes: 0, category: "humor", comments: ["Muito engraçado! KKKKK", "Essa gente inventa cada coisha"] },
        { id: 2, src: "../Assets/Images-Memes/meme2.jpg", likes: 0, category: "sarcasmo", comments: ["Pica pau sendo enganado kkkk", "KKKKKK"] },
        { id: 3, src: "../Assets/Images-Memes/meme3.jpg", likes: 0, category: "nostalgia", comments: ["Me lembra minha infância!", "Clássico!"] },
        { id: 4, src: "../Assets/Images-Memes/meme4.jpg", likes: 0, category: "humor", comments: ["Hahahaha!", "Não tankei!"] },
        { id: 6, src: "../Assets/Images-Memes/meme6.jpg", likes: 0, category: "sarcasmo", comments: ["Eu tô ficando igual", "Desse jeito, a um pé no caps"] },
        { id: 7, src: "../Assets/Images-Memes/meme7.jpg", likes: 0, category: "nostalgia", comments: ["Sonin", "EU kkkkkk"] },
        { id: 10, src: "../Assets/Images-Memes/meme10.jpg", likes: 0, category: "humor", comments: ["Hmmmm", "KKKKKK esse é bom cara"] },
        { id: 11, src: "../Assets/Images-Memes/meme11.jpg", likes: 0, category: "sarcasmo", comments: ["Fatos!", "Nada mais verdadeiro!"] },
        { id: 12, src: "../Assets/Images-Memes/meme12.jpg", likes: 0, category: "nostalgia", comments: ["Pica pau qnd tá produzido", "O que a pessoa n faz qnd tá com fome"] },
        { id: 13, src: "../Assets/Images-Memes/meme13.jpg", likes: 0, category: "humor", comments: ["Morri!", "Kkkkkkk"] },
        { id: 14, src: "../Assets/Images-Memes/meme14.jpg", likes: 0, category: "sarcasmo", comments: ["Mona-Lisa", "Falou tudo!"] },
        { id: 15, src: "../Assets/Images-Memes/meme15.jpg", likes: 0, category: "nostalgia", comments: ["Que saudade!", "Melhor época!"] },
        { id: 16, src: "../Assets/Images-Memes/meme16.jpg", likes: 0, category: "humor", comments: ["A um pé de surtar", "Cadê os resfrecos pica pau"] },
        { id: 17, src: "../Assets/Images-Memes/meme17.jpg", likes: 0, category: "sarcasmo", comments: ["Ele sempre representando", "Pura verdade!"] },
    ];

    // carregar memes do localStorage se existirem
    const savedMemes = JSON.parse(localStorage.getItem('userMemes')) || [];
    const allMemes = [...memes, ...savedMemes];
    
     
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
    
    //eventos listener
    // enviar novo meme
    memeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const url = document.getElementById('memeUrl').value.trim();
        const category = document.getElementById('memeCategory').value;
        
        if (url) {
            const newMeme = {
                id: Date.now(),
                src: url,
                likes: 0,
                category: category,
                comments: []
            };
            
            // adiciona ao array e salva
            savedMemes.push(newMeme);
            localStorage.setItem('userMemes', JSON.stringify(savedMemes));
            
            // atualiza a galeria
            allMemes.push(newMeme);
            renderGallery();
            
            // fecha e limpa o formulário
            memeForm.reset();
            memeFormContainer.classList.remove('active');
        }

        // Função para validar URLs de imagem
function isValidImageUrl(url) {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url) || 
           /^(https?:\/\/).*\.(jpeg|jpg|gif|png|webp)/i.test(url);
}

// Função para verificar se a imagem existe
function checkImageExists(url, callback) {
    const img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
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
    
    // carregar likes do localStorage
    function loadLikes() {
        const savedLikes = JSON.parse(localStorage.getItem('memesLikes')) || {};
        allMemes.forEach(meme => {
            if (savedLikes[meme.id] !== undefined) {
                meme.likes = savedLikes[meme.id];
            }
        });
    }
    
    // salvar likes no localStorage
    function saveLikes() {
        const likesToSave = {};
        allMemes.forEach(meme => {
            likesToSave[meme.id] = meme.likes;
        });
        localStorage.setItem('memesLikes', JSON.stringify(likesToSave));
    }
    
    // inicializar a galeria
    loadLikes();
    renderGallery();
    
    
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
                likeBtn.onclick = function() {
                    meme.likes++;
                    likeCount.textContent = meme.likes;
                    saveLikes();
                    
                    // atualizar contador na galeria
                    const memeInGallery = document.querySelector(`.grid-item[data-id="${meme.id}"] .meme-likes`);
                    if (memeInGallery) {
                        memeInGallery.textContent = `❤️ ${meme.likes}`;
                    }
                };
                
                // configurar adição de comentários
                const commentInput = modal.querySelector('.comment-input');
                const postCommentBtn = modal.querySelector('.post-comment-btn');
                
                postCommentBtn.onclick = function() {
                    if (commentInput.value.trim()) {
                        meme.comments.push(commentInput.value.trim());
                        
                        const commentElement = document.createElement('div');
                        commentElement.className = 'comment';
                        commentElement.textContent = commentInput.value.trim();
                        commentsList.appendChild(commentElement);
                        
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
    gridContainer.addEventListener('click', function(e) {
        const likeElement = e.target.closest('.meme-likes');
        if (likeElement) {
            e.preventDefault();
            e.stopPropagation();
            
            const gridItem = likeElement.closest('.grid-item');
            const memeId = parseInt(gridItem.dataset.id);
            const meme = allMemes.find(m => m.id === memeId);
            
            if (meme) {
                meme.likes++;
                likeElement.textContent = `❤️ ${meme.likes}`;
                saveLikes();
            }
        }
    });
});