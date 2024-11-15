

window.onload = function () {
    userLogged = JSON.parse(localStorage.getItem("userLogged"));

    iconConta = document.getElementById("iconConta");
    btnCategorias = document.getElementById("btnCategorias");
    textoNome = document.getElementById("textoNome");
    iconFavs = document.getElementById("iconFavs");
    iconCarrinho = document.getElementById("iconCarrinho");

    searchBox = document.querySelector('.search-box');
    searchInput = document.querySelector('.search-text');
    header(userLogged);
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