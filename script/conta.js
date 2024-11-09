

window.onload = function() {
    userLogged = JSON.parse(localStorage.getItem("userLogged"));

    seletorConta = document.getElementById("seletorConta");
    contaOps = document.getElementById("contaOps");
    
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
    }else if(userLogged === null){
        textoNome.innerHTML = "Olá <br> anonimo"
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

function execLogout(){
    localStorage.removeItem('userLogged');
    window.location.href ='..//html/registo.html'
}

function exibirContaOps(){
    if(contaOps.classList.contains("hidden")){
        contaOps.classList.remove("hidden");
    }else{
        contaOps.classList.add("hidden");
    }
}