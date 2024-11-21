
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
        let favoritosHtml = ''; // Variável para armazenar o HTML dos favoritos

        if (data.success) {
            // Verifica se 'data.favorites' é um array antes de acessar 'length'
            if (Array.isArray(data.favorites) && data.favorites.length > 0) {
                data.favorites.forEach((favorito, i) => {
                    favoritosHtml += `
                        <div class="favorito">
                            <p>Favorito ${i + 1}: ${favorito.nome}</p> 
                        </div>
                    `;
                });
            } else {
                // Caso não tenha favoritos
                favoritosHtml += `
                    <div class="favorito">
                        <p>Não tem favoritos</p>
                    </div>
                `;
            }
        } else {
            // Se a resposta da API não for bem-sucedida, exibe a mensagem de erro
            alert(data.message);
            
        }

        // Atualiza o HTML no contêiner com o ID 'favoritosHtml'
        document.getElementById('favoritosHtml').innerHTML = favoritosHtml;
    })
    .catch(error => console.error('Error:', error));
}



