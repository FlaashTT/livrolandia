let precoFinal, precoTotal = 0, preçoSemQuantidade = 0, portes;

window.onload = function () {
    localStorage.removeItem('compra');
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
    totalPrecoFinal = document.getElementById("totalPrecoFinal");
    precoSemCustos = document.getElementById("precoSemCustos");
    custoPortes = document.getElementById("custoPortes");
    Textoquantidade = document.querySelectorAll("textoQuantidade");
    divPagamento = document.getElementById("divPagamento");
    TextoCupom = document.getElementById("TextoCupom")
    header(userLogged);
    showCart();
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
        window.location.href = '../html/definicoes.html?show=favoritos';
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

function showCart() {

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

                    // Verifica se 'data.carrinho' é um array antes de acessar 'length'
                    if (quantidadeItens > 0) {
                        // Para cada item no carrinho, buscar os detalhes do livro
                        Promise.all(data.carrinho.map(item => {
                            return fetch('http://localhost:3000/livroParaCarrinho', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ id_livro: item.id_livro, id_utilizador }) // Envia o id_livro e id_utilizador
                            })
                                .then(response => response.json())
                                .then(livroData => {
                                    if (livroData.success) {
                                        if (livroData.livro.desconto === 0) {
                                            precoFinal = livroData.livro.preco
                                        } else {
                                            precoInicial = livroData.livro.preco + 0
                                            descontoAplicado = livroData.livro.desconto + 0
                                            precoFinal = precoInicial * (descontoAplicado / 100)

                                        }
                                        preçoSemQuantidade = precoFinal
                                        precoFinal = precoFinal * item.quantidade
                                        precoTotal = precoTotal + precoFinal;
                                        carrinhoHTMLContent += `
                                    <div class="carrinho-item">
                                        <img src="../Res/categorias/${livroData.livro.nome_categoria}/${livroData.livro.titulo}.png" alt="Livro">
                                        <div class="carrinho-item-details">
                                            <h2>${livroData.livro.titulo}</h2>
                                            <p><strong>Autor/a:</strong> ${livroData.livro.autor}</p>
                                            <div class="entrega-info">
                                                <p>✔ Entregas (Grátis)</p>
                                                <p>✔ 2 horas em Casa</p>
                                            </div>
                                        </div>
                                        <div class="carrinho-item-actions">
                                            <p>${preçoSemQuantidade.toFixed(2)}€</p>
                                            <button id="butonRemQuantidade" onclick ="removerQuantidade(${item.id_carrinho})">-</button>
                                            <span id="quantidade${item.id_carrinho}">${item.quantidade}</span>
                                            <button id="butonAddQuantidade" onclick ="adicionarQuantidade(${item.id_carrinho})"  >+</button>
                                        </div>
                                    </div>
                                `;

                                    } else {
                                        carrinhoHTMLContent += `
                                    <div class="carrinho-item">
                                        <p>Livro ${item.id_livro}: Não foi possível carregar os dados do livro.</p>
                                    </div>
                                `;
                                    }
                                })
                                .catch(error => console.error('Erro ao buscar detalhes do livro:', error));
                        })).then(() => {
                            // Após todos os fetchs, atualizar o HTML
                            portes = 5;

                            precoSemCustos.innerHTML = '<span>Custos</span> <span>' + precoTotal.toFixed(2) + '€</span>';
                            precoTotal += portes;
                            custoPortes.innerHTML = '<span>Custos de envio estimados</span> <span>' + portes.toFixed(2) + '€</span>'
                            totalPrecoFinal.innerHTML = '<span>Total</span> <span>' + precoTotal.toFixed(2) + '€</span>';

                            carrinhoHTML.innerHTML = carrinhoHTMLContent;
                        });
                    } else {


                        // Caso não tenha livros no carrinho
                        TextoCupom.classList.remove("cupom")
                        TextoCupom.classList.add("hidden")
                        divPagamento.classList.remove("carrinho-total")
                        divPagamento.classList.add("hidden")
                        carrinhoHTMLContent += `
                    <div class="carrinho-item">
                        <p>Sem nenhum livro no carrinho</p>
                    </div>
                    `;

                        carrinhoHTML.innerHTML = carrinhoHTMLContent;
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function adicionarQuantidade(idCarrinho) {
    const quantidadeElement = document.getElementById(`quantidade${idCarrinho}`);
    let quantidade = parseInt(quantidadeElement.textContent, 10);  // Obtém a quantidade atual

    // Aumenta a quantidade
    quantidade += 1;
    fetch('http://localhost:3000/adicionarQuantidade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_carrinho: idCarrinho, quantidade: quantidade }) // Envia os dados como JSON
    })
        .then(response => response.json())  // Converte a resposta para JSON
        .then(livroData => {
            // Processa os dados recebidos
            if (livroData.success) {
                location.reload();
            } else {
                console.log('Erro ao remover o livro do carrinho');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);  // Captura qualquer erro na requisição
        });

    // Atualiza o texto no elemento
    quantidadeElement.innerHTML = quantidade;

}


function removerQuantidade(idCarrinho) {
    const quantidadeElement = document.getElementById(`quantidade${idCarrinho}`);
    let quantidade = parseInt(quantidadeElement.textContent, 10);

    idCarrinho += 0;
    // Se a quantidade for maior que 1, diminui
    if (quantidade > 1) {
        quantidade -= 1;
        fetch('http://localhost:3000/removerQuantidade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_carrinho: idCarrinho, quantidade: quantidade }) // Envia os dados como JSON
        })
            .then(response => response.json())  // Converte a resposta para JSON
            .then(livroData => {
                // Processa os dados recebidos
                if (livroData.success) {
                    location.reload();
                } else {
                    console.log('Erro ao remover o livro do carrinho');
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);  // Captura qualquer erro na requisição
            });
    } else {
        if (confirm("deseja mesmo remover o livro do carrinho?")) {
            fetch('http://localhost:3000/removerLivroDoCarrinho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_carrinho: idCarrinho }) // Envia os dados como JSON
            })
                .then(response => response.json())  // Converte a resposta para JSON
                .then(livroData => {
                    // Processa os dados recebidos
                    if (livroData.success) {
                        location.reload();
                    } else {
                        console.log('Erro ao remover o livro do carrinho');
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição:', error);  // Captura qualquer erro na requisição
                });
        }


    }

    // Atualiza o texto no elemento
    quantidadeElement.textContent = quantidade;
}

function seguirPagamento() {
    console.log('Preço Total:', precoTotal);
    console.log('Portes:', portes);

    
    const dadosPagamento = {
        precoTotal: precoTotal,
        portes: portes
    };

    // Verifique se o objeto está correto antes de armazenar
    console.log('Dados de pagamento:', dadosPagamento);

    // Armazena os dados no localStorage
    localStorage.setItem('compra', JSON.stringify(dadosPagamento));

    
    window.location.href = `../html/carrinhoConf.html`;
}


