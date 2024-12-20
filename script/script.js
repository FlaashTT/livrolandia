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
    // Envia a requisição para o servidor para obter as categorias
    fetch('http://localhost:3000/categoria')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const HtmlContentPromises = data.categorias.map(categoria => {
                    // Cria o HTML base para a categoria
                    let categoriaHtml = `

                        <section class="suggestions" id="categoria-${categoria.id_categoria}">
                            <div class="suggestions-header">
                                <h1>Sugestões de ${categoria.nome}</h1>
                                <span class="add-icon">VER +</span>
                            </div>
                            <div class ="books-container"> 
                            `;

                    // Busca os livros para a categoria
                    return fetch('http://localhost:3000/livrosParaCat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_categoria: categoria.id_categoria })
                    })
                        .then(response => response.json())
                        .then(livrosData => {
                            if (livrosData.success) {
                                livrosData.livros.forEach(livro => {
                                    categoriaHtml += `
                                        <div class="book-card">
                                            <div class="book-image">
                                                <img src="../Res/categorias/${categoria.nome}/${livro.titulo}.png" alt="${livro.titulo}">
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
                                categoriaHtml += `<p class="no-books">Nenhum livro disponível para esta categoria.</p>`;
                            }
                            categoriaHtml += `</div></section>`; // Fecha os contêineres de livros e categoria
                            return categoriaHtml; // Retorna o HTML gerado para esta categoria
                        })
                        .catch(error => {
                            console.error('Erro ao buscar livros da categoria:', error);
                            return `
                                <div class="categoria">
                                    <h1>Sugestões de ${categoria.nome}</h1>
                                    <p class="no-books">Erro ao carregar livros. Tente novamente mais tarde.</p>
                                </div>`;
                        });
                });

                // Após processar todas as categorias, insere o HTML no DOM
                Promise.all(HtmlContentPromises).then(htmlArray => {
                    ItensLivros.innerHTML = htmlArray.join(''); // Junta todos os HTMLs de categorias
                });
            } else {
                ItensLivros.innerHTML = `<p>Erro ao carregar categorias: ${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar categorias:', error);
            ItensLivros.innerHTML = `<p>Erro ao carregar categorias. Tente novamente mais tarde.</p>`;
        });
}



