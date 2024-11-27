
window.onload = function () {
    userLogged = JSON.parse(localStorage.getItem("userLogged"));

    iconConta = document.getElementById("iconConta");
    btnCategorias = document.getElementById("btnCategorias");
    textoNome = document.getElementById("textoNome");
    iconFavs = document.getElementById("iconFavs");
    iconCarrinho = document.getElementById("iconCarrinho");

    searchBox = document.querySelector('.search-box');
    searchInput = document.querySelector('.search-text');

    favoritosHtml = document.getElementById("favoritosHtml");
    header(userLogged);
    showFavorits();
}

function header(userLogged) {
    if (userLogged != null) {
        textoNome.innerHTML = "Olá <br>" + userLogged.name + " !";
    } else {
        textoNome.innerHTML = "Olá <br> anonimo"
    }

    btnCategorias.addEventListener("click", function () {
        if (categorias.classList.contains("hidden")) {
            categorias.classList.remove("hidden");
        } else {
            categorias.classList.add("hidden");
        }
    });

    iconConta.addEventListener("click", function () {
        window.location.href = '../html/definicoes.html';
    });

    iconFavs.addEventListener("click", function () {
        window.location.href = '../html/favoritos.html';
    });
    iconCarrinho.addEventListener("click", function () {
        window.location.href = '../html/carrinho.html';
    })

    btnCategorias.addEventListener("click", function () {
        sidebar.classList.toggle("hidden");
        sidebar.classList.toggle("show");
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

function showFavorits() {
    if (!userLogged) {
        favoritosHtml.innerHTML = "Indisponível, inicie sessão para continuar!<br>";
        favoritosHtml.innerHTML += `
        <input type="button" value="Iniciar sessão!" onclick="window.location.href='../html/registo.html';">
    `;
        return;
    } else {
        const id_utilizador = userLogged.id_utilizador; // Usando o id_utilizador de userLogged

        fetch('http://localhost:3000/favoritos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_utilizador }) // Enviando o id_utilizador na requisição
        })
            .then(response => response.json())
            .then(data => {
                let favoritosHtmlContent = ''; // Variável para armazenar o HTML dos favoritos

                if (data.success) {
                    // Verifica se 'data.favorites' é um array antes de acessar 'length'
                    if (Array.isArray(data.favorites) && data.favorites.length > 0) {
                        // Para cada favorito, buscar os detalhes do livro
                        data.favorites.forEach((favorito, i) => {
                            // Buscar informações do livro com o id_livro
                            fetch('http://localhost:3000/livro', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ id_livro: favorito.id_livro }) // Envia o id_livro
                            })
                                .then(response => response.json())
                                .then(livroData => {
                                    if (livroData.success) {
                                        console.log("ok")
                                        // Adiciona as informações do livro ao HTML do favorito
                                        favoritosHtmlContent += `
                                    <div class="favorito">
                                        <p>Favorito ${i + 1}: ${livroData.livro.titulo}</p> 
                                        <p>Autor: ${livroData.livro.autor}</p>
                                        <p>Descrição: ${livroData.livro.sinopse}</p>
                                        <p>ID: ${livroData.livro.id_livro}</p><br>
                                    </div>
                                `;
                                    } else {
                                        favoritosHtmlContent += `
                                    <div class="favorito">
                                        <p>Favorito ${i + 1}: Não foi possível carregar os dados do livro.</p>
                                    </div>
                                `;
                                    }
                                    favoritosHtml.innerHTML = favoritosHtmlContent;

                                })
                                .catch(error => console.error('Erro ao buscar detalhes do livro:', error));
                        });
                    } else {
                        // Caso não tenha favoritos
                        favoritosHtmlContent += `
                    <div class="favorito">
                        <p>Sem nenhum livro favorito marcado</p>
                    </div>
                `;
                    }
                } else {
                    alert(data.message);
                }

                // Atualiza o HTML no contêiner com o ID 'favoritosHtml'
                favoritosHtml.innerHTML = favoritosHtmlContent;
            })
            .catch(error => console.error('Error:', error));
    }
}




