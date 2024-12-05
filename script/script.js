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
        window.location.href = '../html/favoritos.html';
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
    fetch('http://localhost:3000/categoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            let HtmlContent = '';
            if (data.success) {
                data.categorias.forEach(categoria => {
                    HtmlContent += `
                    <div class="suggestions-header">
                        <h1>Sugestões de ${categoria.nome}</h1>
                        <span class="add-icon">VER +</span>
                    </div>
                    <div class="book-card">
                        <div class="book-image">
                            <img src="../Res/categorias/${categoria.nome}/espelho magico.png" alt="imagem">
                        <div class="favorite-icon">
                            <i id="iconFavoritos" class="ri-heart-3-line"></i>
                        </div>
                    </div>
                    <h3>${titulo}</h3>
                    <p>${nomeautor}</p>
                    <p>${preço}</p>
                    <p class="free-shipping">Portes Grátis</p>
                    </div>
                    `;
                });
            } else {
                // Imprime mensagem de erro na console
                console.error("Erro:", data.message);
            }

            // Insere o HTML gerado no contêiner
            ItensLivros.innerHTML = HtmlContent;
        })
        .catch(error => console.error('Erro na requisição:', error));
}




