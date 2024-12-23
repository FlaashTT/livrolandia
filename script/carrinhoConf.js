let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput;
let currentSlideIndex = 0;

window.onload = function () {
    // Recupera o usuário logado do localStorage
    let userLogged = JSON.parse(localStorage.getItem("userLogged"));
    let compra = JSON.parse(localStorage.getItem("compra"));

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
    ItensLivros = document.getElementById("Sectiongeral");

    valorCompra = document.getElementById("valorCompra");
    custoPortes = document.getElementById("custoPortes");
    precoFinal = document.getElementById("preçoFinal")

    header(userLogged);

    valorCompra.innerHTML = compra.precoTotal - compra.portes + "€";
    custoPortes.innerHTML = compra.portes + "€";
    precoFinal.innerHTML = compra.precoTotal;

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




// Função para exibir/ocultar os campos com base na opção de pagamento selecionada
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', () => {
        const paymentMethod = option.getAttribute('data-payment-method');

        // Ocultar todos os campos
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.add('hidden');
        });

        // Exibir os campos correspondentes ao método de pagamento
        if (paymentMethod === 'credit-card') {
            document.querySelector('#card-name-group').classList.remove('hidden');
            document.querySelector('#card-number-group').classList.remove('hidden');
            document.querySelector('#expiry-date-group').classList.remove('hidden');
            document.querySelector('#cvv-group').classList.remove('hidden');
        } else if (paymentMethod === 'pix') {
            document.querySelector('#pix-group').classList.remove('hidden');
        } else if (paymentMethod === 'boleto') {
            document.querySelector('#boleto-group').classList.remove('hidden');
        } else if (paymentMethod === 'paypal') {
            document.querySelector('#paypal-group').classList.remove('hidden');
        } else if (paymentMethod === 'apple-pay') {
            document.querySelector('#apple-pay-group').classList.remove('hidden');
        }
    });
});

