let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput;
let currentSlideIndex = 0, userLogged;

window.onload = function () {
    localStorage.removeItem('compra');
    userLogged = JSON.parse(localStorage.getItem("userLogged"));

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
                                                <img src="../Res/categorias/${categoria.nome}/${livro.titulo}.png" alt="${livro.titulo}" onclick=paginaLivro(${livro.id_livro})>
                                                <div class="favorite-icon">
                                                   <i id="iconFavoritos" class="ri-heart-3-line" onclick="adicionarFavorito('${livro.id_livro}')"></i>

                                                </div>
                                            </div>
                                            <h3 onclick=paginaLivro(${livro.id_livro})> ${livro.titulo} </h3>
                                            <p onclick=paginaLivro(${livro.id_livro})> ${livro.autor} </p>
                                            <p onclick=paginaLivro(${livro.id_livro})> ${livro.preco}€ </p>
                                            <p class="free-shipping" onclick=paginaLivro(${livro.id_livro})> Portes Grátis</p>
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

function adicionarFavorito(idLivro) {
    const idUser = userLogged.id_utilizador;

    fetch('http://localhost:3000/adicionarFavoritos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_livro: idLivro, id_utilizador: idUser })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (confirm("Adicionado aos favoritos, deseja ir para os favoritos?")) {
                    window.location.href = '../html/definicoes.html?show=favoritos';
                }
            } else if (data.message === "Livro já adicionado aos favoritos") {
                alert("Livro já adicionado aos favoritos!");
            } else {
                alert("Erro ao adicionar o livro aos favoritos!");
            }
        })
        .catch(error => console.error('Erro ao adicionar favorito:', error));
}

function paginaLivro(idLivro) {
    window.location.href = `../html/book.html?show=${idLivro}`;
}

function selecionado(nome) {
    fetch('http://localhost:3000/selecionado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nomeCat: nome })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Verifica o que está sendo retornado pela API
            if (data.success) {
                exibirLivros(data.livros, nome);
            } else {
                console.log(data.message || "Erro desconhecido");
            }
        })
        .catch(error => console.error('Erro ao adicionar favorito:', error));
}



function exibirLivros(livros, categoriaNome) {
    const booksContainer = document.querySelector(".books-container"); // O contêiner onde os livros serão exibidos
    booksContainer.innerHTML = ''; // Limpa os livros anteriores
    ItensLivros.innerHTML = "";

    if (livros.length > 0) {
        // Cria o cabeçalho com o nome da categoria

        let categoriaHtml = `
            <div class="suggestions-header">
                <h1>Livros de ${categoriaNome}</h1>
                <span class="add-icon">VER +</span>
            </div>
            <div class="books-container"> 
        `;

        // Loop pelos livros e gera os cards
        livros.forEach(livro => {
            categoriaHtml += `
                <div class="book-card">
                    <div class="book-image">
                        <img src="../Res/categorias/${categoriaNome}/${livro.titulo}.png" alt="${livro.titulo}" onclick="paginaLivro(${livro.id_livro})">
                        <div class="favorite-icon">
                            <i id="iconFavoritos" class="ri-heart-3-line" onclick="adicionarFavorito('${livro.id_livro}')"></i>
                        </div>
                    </div>
                    <h3 onclick="paginaLivro(${livro.id_livro})">${livro.titulo}</h3>
                    <p onclick="paginaLivro(${livro.id_livro})">${livro.autor}</p>
                    <p onclick="paginaLivro(${livro.id_livro})">${livro.preco}€</p>
                    <p class="free-shipping" onclick="paginaLivro(${livro.id_livro})">Portes Grátis</p>
                </div>
            `;
        });

        categoriaHtml += `</div>`; // Fecha o contêiner de livros

        // Insere o HTML gerado no contêiner da página
        ItensLivros.innerHTML = categoriaHtml;
    } else {
        ItensLivros.innerHTML = '<p>Nenhum livro encontrado para esta categoria.</p>';
    }
}






