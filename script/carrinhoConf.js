let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput, metodo;
let currentSlideIndex = 0, userLogged;

window.onload = function () {
    // Recupera o usuário logado do localStorage
    userLogged = JSON.parse(localStorage.getItem("userLogged"));
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
    precoFinal = document.getElementById("preçoFinal");

    payButton = document.getElementById("payButton");

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

        // Ocultar todos os campos primeiro
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.add('hidden');
        });

        // Mostrar os campos específicos de acordo com o método selecionado
        switch (paymentMethod) {
            case 'credit-card':
                document.querySelector('#card-name-group').classList.remove('hidden');
                document.querySelector('#card-number-group').classList.remove('hidden');
                document.querySelector('#expiry-date-group').classList.remove('hidden');
                document.querySelector('#cvv-group').classList.remove('hidden');
                metodo = 'creditCard';
                break;

            case 'mbway':
                document.querySelector('#mbway-group').classList.remove('hidden');
                metodo = 'mbway';
                break;

            case 'multibanco':
                document.querySelector('#multibanco-group').classList.remove('hidden');
                metodo = 'multibanco';
                break;

            case 'paypal':
                document.querySelector('#paypal-group').classList.remove('hidden');
                metodo = 'paypal';
                break;

            case 'apple-pay':
                document.querySelector('#apple-pay-group').classList.remove('hidden');
                metodo = 'applePay';
                break;

            default:
                alert("Método de pagamento inválido!");
                break;
        }
    });
});

payButton.addEventListener("click", function (event) {
    event.preventDefault();
    //console.log("paymentMethod Selecionado:", paymentMethod);

    switch (metodo) {
        case ("creditCard"):
            InputNome = document.getElementById("card-name").value;
            InputNumero = document.getElementById("card-number").value;
            InputValidade = document.getElementById("expiry-date").value;
            InputCvv = document.getElementById("cvv").value;

            if (InputNome.trim() === "" || InputNumero.trim() === "" || InputValidade.trim() === "" || InputCvv.trim() === "") {
                alert("Você deve inserir todos os campos.");
                return;
            }
            if (InputNumero.length != 16) {
                alert("Numero do cartão invalido");
                return;
            }

            // para gatanti que fica no estilo de 01/12
            const regexData = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

            // Remover espaços extras antes da verificação
            const validadeValor = InputValidade.trim();

            if (!regexData.test(validadeValor)) {
                alert("Data inválida! O formato deve ser MM/AA.");
                return;
            }

            if (InputCvv.length != 3) {
                alert("cvv invalido");
                return;
            }

            realizarPagamento();
            break;

        case ("mbway"):
            console.log("mbway");
            break;

        case ("multibanco"):
            console.log("multibanco");
            break;

        case ("paypal"):
            console.log("paypal");
            break;

        case ("applePay"):
            console.log("applePay");
            break;
    }
})

async function realizarPagamento() {
    try {
        // Carregar dados do carrinho
        const carrinhoResponse = await fetch('http://localhost:3000/buscarDadosCart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_user: userLogged['id_utilizador'] })
        });

        const carrinhoData = await carrinhoResponse.json();

        if (!carrinhoData.success) {
            alert("Erro ao carregar dados do carrinho!");
            console.log('Erro:', carrinhoData.message);
            return;
        }

        // Extrai dados do carrinho
        const id_livro = carrinhoData.data.map(item => item.id_livro);
        const quantidade = carrinhoData.data.map(item => item.quantidade);
        const precoTotal = compra['precoTotal'];
        const dataCompra = new Date().toISOString().split('T')[0]; // Data no formato YYYY-MM-DD

        console.log('IDs dos livros:', id_livro.join(','));
        console.log('Quantidades:', quantidade);
        console.log('Preço total:', precoTotal);

        // Limpar carrinho
        const limparResponse = await fetch('http://localhost:3000/limparCarrinho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_user: userLogged['id_utilizador'] })
        });

        const limparData = await limparResponse.json();

        if (!limparData.success) {
            alert("Erro ao limpar o carrinho!");
            console.log('Erro:', limparData.message);
            return;
        }

        // Adicionar ao histórico
        const historicoResponse = await fetch('http://localhost:3000/adicionarHistorico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_user: userLogged['id_utilizador'],
                id_livro: id_livro,
                preco: precoTotal,
                data: dataCompra
            })
        });

        const historicoData = await historicoResponse.json();

        if (historicoData.success) {
            alert("Pagamento realizado com sucesso!");
            window.location.href = "../html/carrinho.html";
        } else {
            alert("Erro ao adicionar ao histórico!");
            console.log('Erro:', historicoData.message);
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert("Ocorreu um erro no processo de pagamento.");
    }
}



