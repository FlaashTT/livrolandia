

window.onload = function () {
    userLogged = JSON.parse(localStorage.getItem("userLogged"));

    iconConta = document.getElementById("iconConta");
    btnCategorias = document.getElementById("btnCategorias");
    textoNome = document.getElementById("textoNome");
    iconFavs = document.getElementById("iconFavs");
    iconCarrinho = document.getElementById("iconCarrinho");

    searchBox = document.querySelector('.search-box');
    searchInput = document.querySelector('.search-text');
    carrinhoHTML = document.getElementById("CarrinhoHTML");
    HeaderCarrinho = document.getElementById("HeaderCarrinho");
    header(userLogged);
    showCart();
}

function header(userLogged) {
    if(userLogged !=null){
        textoNome.innerHTML = "Olá <br>" + userLogged.name + " !";
    }else {
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
    iconCarrinho.addEventListener("click",function(){
        window.location.href = '../html/carrinho.html';
    })

    btnCategorias.addEventListener("click", function(){
        sidebar.classList.toggle("hidden");
        sidebar.classList.toggle("show");
    });

    searchInput.addEventListener('focus', function() {
        searchBox.classList.add('expanded');
    });

    searchInput.addEventListener('blur', function() {
        if (!searchInput.value) {
            searchBox.classList.remove('expanded');
        }
    });


}

function showCart(){
    if (!userLogged) {
        carrinhoHTML.innerHTML = "Indisponível, inicie sessão para continuar!<br>";
        carrinhoHTML.innerHTML += `
        <input type="button" value="Iniciar sessão!" onclick="window.location.href='../html/registo.html';">
    `;
        return;
    } else {
        const id_utilizador = userLogged.id_utilizador; // Usando o id_utilizador de userLogged

        fetch('http://localhost:3000/carrinho', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_utilizador }) // Enviando o id_utilizador na requisição
        })
        .then(response => response.json())
        .then(data => {
            let carrinhoHTMLContent = ''; // Variável para armazenar o HTML do carrinho

            if (data.success) {
                let quantidadeItens = data.carrinho.length;

                if (quantidadeItens === 1) {
                    HeaderCarrinho.innerHTML = " " + quantidadeItens + " artigo";
                } else {
                    HeaderCarrinho.innerHTML = quantidadeItens + " artigos";
                }

                // Verifica se 'data.carrinho' é um array antes de acessar 'length'
                if (quantidadeItens > 0) {
                    // Para cada item no carrinho, buscar os detalhes do livro
                    data.carrinho.forEach((item, i) => {
                        // Buscar informações do livro com o id_livro
                        fetch('http://localhost:3000/livro', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id_livro: item.id_livro }) // Envia o id_livro
                        })
                        .then(response => response.json())
                        .then(livroData => {
                            if (livroData.success) {
                                // Adiciona as informações do livro ao HTML do carrinho
                                carrinhoHTMLContent += `
                                    <div class="carrinho-item">
                                        <p>Livro ${i + 1}: ${livroData.livro.titulo}</p> 
                                        <p>Autor: ${livroData.livro.autor}</p>
                                        <p>Preço: ${livroData.livro.preco}€</p>
                                        <p>ID: ${livroData.livro.id_livro}</p><br>
                                    </div>
                                `;
                            } else {
                                carrinhoHTMLContent += `
                                    <div class="carrinho-item">
                                        <p>Livro ${i + 1}: Não foi possível carregar os dados do livro.</p>
                                    </div>
                                `;
                            }
                            carrinhoHTML.innerHTML = carrinhoHTMLContent;
                        })
                        .catch(error => console.error('Erro ao buscar detalhes do livro:', error));
                    });
                } else {
                    // Caso não tenha livros no carrinho
                    carrinhoHTMLContent += `
                    <div class="carrinho-item">
                        <p>Sem nenhum livro no carrinho</p>
                    </div>
                `;
                }

            } else {
                alert(data.message);
            }

            // Atualiza o HTML no contêiner com o ID 'carrinhoHTML'
            carrinhoHTML.innerHTML = carrinhoHTMLContent;
        })
        .catch(error => console.error('Error:', error));
    }
}
