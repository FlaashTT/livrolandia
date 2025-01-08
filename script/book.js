let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput, idLivro;

let livro, subtitulo, nomeAutor, imagemLivro, imagemPequena, PreçoLivro, Sinopse, precoAntigo, descontoLivro, descontoImediato;
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

    
    searchBox = document.querySelector('.search-box');
    searchInput = document.querySelector('.search-text');

    imagemLivro = document.getElementById("ImagemLivro"),
        imagemPequena = document.getElementById("imagemPequena"),
        descontoLivro = document.getElementById("descontoLivro"),
        Sinopse = document.getElementById("Sinopse"),
        PreçoLivro = document.getElementById("PreçoLivro"),
        livro = document.getElementById("Titulo"),
        subtitulo = document.getElementById("Subtítulo"),
        descontoImediato = document.getElementById("descontoImediato"),
        precoAntigo = document.getElementById("precoAntigo"),
        nomeAutor = document.getElementById("NomeAutor"),
        buttonCompra = document.getElementById("buttonCompra");

    header(userLogged);


    const params = new URLSearchParams(window.location.search);
    idLivro = params.get("show");
    if (params.get("show") != " ") showLivro();
    else {
        alert("Erro ao carregar livro, tente novamente mais tarde!");
        return;
    }


    buttonCompra.addEventListener("click", function () {
        if (!userLogged) {
            alert("Nao tem sessao iniciada");
        } else {

        
        idUtilizador = userLogged['id_utilizador'];
        // Verifica se os valores existem
        if (!idLivro || !idUtilizador) {
            alert("Dados insuficientes para adicionar ao carrinho!");
            return;
        }
    }

        // Faz a requisição para adicionar o livro ao carrinho
        fetch('http://localhost:3000/adicionarLivroCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_utilizador: idUtilizador, id_livro: idLivro })
    })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (confirm("Livro adicionado ao carrinho!Deseja proseguir o pagamento?")) {
                        window.location.href = "../html/carrinho.html";
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Erro ao processar a requisição:", error);
                alert("Erro ao adicionar o livro ao carrinho!");
            });
});

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

function showLivro() {


    fetch('http://localhost:3000/ExibirDadosLivro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_livro: idLivro })
    })
        .then(response => response.json())
        .then(data => {
            let precoInicial, descontoAplicado, precoFinal
            if (data.success) {


                if (data.livro.desconto === 0) {

                    descontoLivro.classList.remove("discount");
                    descontoLivro.classList.add("hidden");

                    precoFinal = data.livro.preco;

                    descontoImediato.classList.remove("new-discount");
                    descontoImediato.classList.add("hidden")

                    precoAntigo.classList.remove("price-ant")
                    precoAntigo.classList.add("hidden");

                } else {
                    precoInicial = data.livro.preco + 0
                    descontoAplicado = data.livro.desconto + 0
                    precoFinal = precoInicial * (descontoAplicado / 100)

                    descontoLivro.innerHTML = data.livro.desconto + "% de desconto"
                }

                imagemLivro.src = "../Res/categorias/" + data.livro.categoria_nome + "/" + data.livro.titulo + ".png";
                imagemPequena.src = "../Res/categorias/" + data.livro.categoria_nome + "/" + data.livro.titulo + ".png";
                livro.innerHTML = data.livro.titulo
                nomeAutor.innerHTML = data.livro.autor

                precoAntigo.innerHTML = precoInicial + "€"
                PreçoLivro.innerHTML = precoFinal.toFixed(2) + "€"
                descontoImediato.innerHTML = precoInicial - precoFinal + "€ de desconto"

                Sinopse.innerHTML = data.livro.sinopse
            } else {
                alert(data.message);
            }

        })
        .catch(error => console.error('Error:', error));
}

