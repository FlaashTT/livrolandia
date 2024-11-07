let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput;

window.onload = function () {
    userLogged = JSON.parse(localStorage.getItem("userLogged"));
    sidebar = document.getElementById("sidebar");
    iconConta = document.getElementById("iconConta");
    btnCategorias = document.getElementById("btnCategorias");
    textoNome = document.getElementById("textoNome");
    iconFavs = document.getElementById("iconFavs");
    iconCarrinho = document.getElementById("iconCarrinho");
    
    // Corrige o seletor da search-box e searchInput
    searchBox = document.querySelector('.search-box');
    searchInput = document.querySelector('.search-text');

    header();
}

function header() {
    if (userLogged != null) {
        textoNome.innerHTML = "Olá <br>" + userLogged.name + "!";
    } else {
        textoNome.innerHTML = "Erro!";
    }

    btnCategorias.addEventListener("click", toggleSidebar);

    iconConta.addEventListener("click", function () {
        window.location.href = '../html/conta.html';
    });

    iconFavs.addEventListener("click", function () {
        window.location.href = '../html/favoritos.html';
    });

    iconCarrinho.addEventListener("click", function () {
        window.location.href = '../html/carrinho.html';
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

function toggleSidebar() {
    sidebar.classList.toggle("hidden");
    sidebar.classList.toggle("show");
}
