

window.onload = function () {
    userLogged = JSON.parse(localStorage.getItem("userLogged"));

    iconConta = document.getElementById("iconConta");
    btnCategorias = document.getElementById("btnCategorias");
    textoNome = document.getElementById("textoNome");
    iconFavs = document.getElementById("iconFavs");
    iconCarrinho = document.getElementById("iconCarrinho");
    header();
}

function header() {
    if(userLogged !=null){
        textoNome.innerHTML = "Olá <br>" + userLogged.name + " !";
    }else{
        textoNome.innerHTML = "Erro!"
    }
    btnCategorias.addEventListener("click", function () {
        if (categorias.classList.contains("hidden")) {
            categorias.classList.remove("hidden");
        } else {
            categorias.classList.add("hidden");
        }
    });

    iconConta.addEventListener("click", function () {
        window.location.href = '..//html/conta.html';
    });

    iconFavs.addEventListener("click", function () {
        window.location.href = '..//html/favoritos.html';
    });
    iconCarrinho.addEventListener("click",function(){
        window.location.href = '..//html/carrinho.html';
    })


}