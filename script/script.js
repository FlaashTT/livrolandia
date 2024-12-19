let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput;
let currentSlideIndex = 0;

window.onload = function () {
    // Recupera o usuário logado do localStorage
    let userLogged = JSON.parse(localStorage.getItem("userLogged"));

    // Seletores dos elementos da página
    sidebar = document.getElementById("sidebar");
    iconConta = document.getElementById("iconConta");
    btnCategorias = document.getElementById("btnCategorias");
    textoNome = document.getElementById("textoNome");
    iconFavs = document.getElementById("iconFavs");
    iconCarrinho = document.getElementById("iconCarrinho");

    // Corrige o seletor da search-box e searchInput
    searchBox = document.querySelector('.search-box');
    searchInput = document.querySelector('.search-text');
    ItensLivros = document.getElementById("Sectiongeral");

    header(userLogged);
    addItens();
    
}



function header(userLogged) {
    if (userLogged != null) {
        textoNome.innerHTML = "Olá <br>" + userLogged.name + " !";
    } else {
        textoNome.innerHTML = "Olá <br> anónimo !";
    }

    btnCategorias.addEventListener("click", function () {
        sidebar.classList.toggle("hidden");
        sidebar.classList.toggle("show");
    });

    iconConta.addEventListener("click", function () {
        if (userLogged != null) {
            window.location.href = '../html/definicoes.html';
        } else {
            window.location.href = '../html/registo.html';
        }
    });

    iconFavs.addEventListener("click", function () {
        window.location.href = '../html/definicoes.html?show=favoritos';
    });

    iconCarrinho.addEventListener("click", function () {
        window.location.href = '../html/carrinho.html';
    });

    searchInput.addEventListener('focus', function () {
        searchBox.classList.add('expanded');
    });

    searchInput.addEventListener('blur', function () {
        if (!searchInput.value) {
            searchBox.classList.remove('expanded');
        }
    });
}



function addItens() {
    fetch('http://localhost:3000/ImprimirPgInicial', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            let HtmlContent = '';
            if (data.success) {

                HtmlContent += `
                            <div class="suggestions-header">
                                <h1>Sugestões de NOme</h1>
                                <span class="add-icon">VER +</span>
                            </div>`;

                        // Itera sobre os livros da categoria
                        
                            HtmlContent += `
                                <div class="book-card">
                                    <div class="book-image">
                                        <img src="../Res/categorias/.png" alt="imagem">
                                        <div class="favorite-icon">
                                            <i id="iconFavoritos" class="ri-heart-3-line"></i>
                                        </div>
                                    </div>
                                    <h3>tobias</h3>
                                    <p>Ja mias</p>
                                    <p>10€</p>
                                    <p class="free-shipping">Portes Grátis</p>
                                </div>`;
                
                    // Verifica se "categoria.livros" é um array válido
                   
                        HtmlContent += `
                            <div class="suggestions-header">
                                <h1>Sugestões de ${categoria.nome}</h1>
                                <span class="add-icon">VER +</span>
                            </div>`;

                        // Itera sobre os livros da categoria
                        categoria.livros.forEach(livro => {
                            HtmlContent += `
                                <div class="book-card">
                                    <div class="book-image">
                                        <img src="../Res/categorias/${categoria.nome}/${livro.titulo}.png" alt="imagem">
                                        <div class="favorite-icon">
                                            <i id="iconFavoritos" class="ri-heart-3-line"></i>
                                        </div>
                                    </div>
                                    <h3>${livro.titulo}</h3>
                                    <p>${livro.autor}</p>
                                    <p>${livro.preco}€</p>
                                    <p class="free-shipping">Portes Grátis</p>
                                </div>`;
                        });
                   
              
            } else {
                // Caso não haja sucesso na resposta
                HtmlContent = `<p>Erro ao carregar livros: ${data.message}</p>`;
            }

            // Insere o HTML gerado no contêiner
            ItensLivros.innerHTML = HtmlContent;
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            ItensLivros.innerHTML = `<p>Erro ao carregar livros. Tente novamente mais tarde.</p>`;
        });
}

/*
function addItens() {
    fetch('http://localhost:3000/BuscarCategorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Diagnóstico: verificar se os dados foram retornados corretamente
            console.log("Dados recebidos:", data);

            if (!data || !data.success) {
                console.error("Erro: resposta inesperada do servidor.");
                throw new Error(data?.message || "Resposta inválida do servidor.");
            }

            if (!data.categorias || !Array.isArray(data.categorias)) {
                console.error("Erro: 'categorias' está ausente ou não é uma lista.");
                throw new Error("Estrutura inválida retornada pelo servidor.");
            }

            let HtmlContent = '';
            // Iteração sobre categorias
            data.categorias.forEach(categoria => {
                HtmlContent += `
                    <div class="suggestions-header">
                        <h1>Sugestões de ${categoria.nome}</h1>
                        <span class="add-icon">VER +</span>
                    </div>
                    <div class="book-list" id="categoria-${categoria.id_categoria}">
                        <!-- Livros desta categoria serão inseridos aqui -->
                    </div>
                `;
            });

            // Insere o HTML gerado no contêiner
            const ItensLivros = document.getElementById('ItensLivros'); // Certifique-se de ter este elemento no HTML
            if (!ItensLivros) {
                throw new Error("Elemento com ID 'ItensLivros' não encontrado no DOM.");
            }
            ItensLivros.innerHTML = HtmlContent;
        })
        .catch(error => console.error('Erro na requisição:', error));
}*/