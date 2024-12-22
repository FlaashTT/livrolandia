let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput, idLivro;

let livro, subtitulo, nomeAutor, imagemLivro,imagemPequena, PreçoLivro, Sinopse,precoAntigo, descontoLivro,descontoImediato;
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

    imagemLivro = document.getElementById("ImagemLivro"),
    imagemPequena = document.getElementById("imagemPequena"),
        descontoLivro = document.getElementById("descontoLivro"),
        Sinopse = document.getElementById("Sinopse"),
        PreçoLivro = document.getElementById("PreçoLivro"),
        livro = document.getElementById("Titulo"), 
        subtitulo = document.getElementById("Subtítulo"),
        descontoImediato = document.getElementById("descontoImediato"),
        precoAntigo = document.getElementById("precoAntigo"),
        nomeAutor = document.getElementById("NomeAutor");

    header(userLogged);


    const params = new URLSearchParams(window.location.search);
    idLivro = params.get("show");
    if (params.get("show") != " ") showLivro();
    else (alert("Erro ao carregar livro,tente novamente mais tarde!"))

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
            // Variável para armazenar o HTML dos favoritos
            let precoInicial,descontoAplicado,precoFinal
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
                    descontoAplicado = data.livro.desconto +0
                    precoFinal = precoInicial * (descontoAplicado/100)
                    
                    descontoLivro.innerHTML = data.livro.desconto + "% de desconto"
                }

                imagemLivro.src = "../Res/categorias/" + data.livro.categoria_nome + "/" + data.livro.titulo + ".png";
                imagemPequena.src = "../Res/categorias/" + data.livro.categoria_nome + "/" + data.livro.titulo + ".png";
                livro.innerHTML = data.livro.titulo
                nomeAutor.innerHTML = data.livro.autor

                precoAntigo.innerHTML = precoInicial+"€"
                PreçoLivro.innerHTML = precoFinal +"€"
                descontoImediato.innerHTML = precoInicial-precoFinal+"€ de desconto"

                Sinopse.innerHTML = data.livro.sinopse
            } else {
                alert(data.message);
            }

            // Atualiza o HTML no contêiner com o ID 'favoritosHtml'

        })
        .catch(error => console.error('Error:', error));
}

