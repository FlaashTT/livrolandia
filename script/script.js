let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput;
let currentSlideIndex = 0;

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

    header(userLogged);
    addBooks();
    showSlides();
}

function header(userLogged) {
    if (userLogged != null) {
        textoNome.innerHTML = "Olá <br>" + userLogged.name + " !";
    } else {
        textoNome.innerHTML = "Olá <br> anónimo !";
    }

    btnCategorias.addEventListener("click", function(){
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

function addBooks(){
    
}

function showSlides() {
    const slides = document.querySelectorAll('.slide'); // Seleciona todos os slides
    slides.forEach((slide) => (slide.style.display = 'none')); // Esconde todos os slides
    currentSlideIndex++;
    if (currentSlideIndex > slides.length) {
        currentSlideIndex = 1; // Reinicia o slideshow
    }
    slides[currentSlideIndex - 1].style.display = 'block'; // Mostra o slide atual
    slides[currentSlideIndex - 1].style.animation = 'fadeEffect 1.5s ease-in-out'; // Aplica o efeito de fade
    setTimeout(showSlides, 5000); // Troca de slide a cada 5 segundos
}
