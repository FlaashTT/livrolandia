let btnCategorias, categorias, textoNome, sidebar,iconConta, iconFavs,iconCarrinho,searchBox,searchInput, toggleAccountLink, submenu,
    arrowIcon, logoutBtn, userNameElement;

window.onload = function () {
  // Recupera o usuário logado do localStorage
  let userLogged = JSON.parse(localStorage.getItem("userLogged"));

  // Seletores dos elementos da página
  userNameElement = document.getElementById("userName");
  sidebar = document.getElementById("sidebar");
  iconConta = document.getElementById("iconConta");
  btnCategorias = document.getElementById("btnCategorias");
  textoNome = document.getElementById("textoNome");
  iconFavs = document.getElementById("iconFavs");
  iconCarrinho = document.getElementById("iconCarrinho");
  toggleAccountLink = document.getElementById("toggle-account");
  submenu = document.getElementById("submenu");
  arrowIcon = toggleAccountLink.querySelector("i");
  logoutBtn = document.getElementById("logoutBtn");

  // Corrige o seletor da search-box e searchInput
  searchBox = document.querySelector(".search-box");
  searchInput = document.querySelector(".search-text");

  // Adiciona o evento de clique ao link "Conta"
  toggleAccountLink.addEventListener("click", function () {
    // Alterna a visibilidade do submenu
    if (submenu.style.display === "block") {
      submenu.style.display = "none"; // Oculta o submenu
      arrowIcon.classList.remove("ri-arrow-up-line"); // Remove a seta para cima
      arrowIcon.classList.add("ri-arrow-down-line"); // Adiciona a seta para baixo
    } else {
      submenu.style.display = "block"; // Exibe o submenu
      arrowIcon.classList.remove("ri-arrow-down-line"); // Remove a seta para baixo
      arrowIcon.classList.add("ri-arrow-up-line"); // Adiciona a seta para cima
    }
  });

  // Atualiza a saudação do usuário no cabeçalho
  header(userLogged);

  // Se o usuário estiver logado, mostra o nome do usuário
  if (userLogged != null) {
    userNameElement.innerHTML = userLogged.name + "!"; // Atualiza o nome na página
    textoNome.innerHTML = "Olá <br>" + userLogged.name + " !";
  } else {
    // Caso contrário, exibe "anónimo"
    userNameElement.innerHTML = "anónimo";
    textoNome.innerHTML = "Olá <br> anónimo";
  }

  // Alterar a ação do botão de conta
  iconConta.addEventListener("click", function () {
    if (userLogged != null) {
      window.location.href = "../html/definicoes.html"; // Redireciona para as configurações
    } else {
      window.location.href = "../html/registo.html"; // Se não estiver logado, vai para o registo
    }
  });

  // Outros eventos de navegação
  iconFavs.addEventListener("click", function () {
    window.location.href = "../html/favoritos.html";
  });

  iconCarrinho.addEventListener("click", function () {
    window.location.href = "../html/carrinho.html";
  });

  searchInput.addEventListener("focus", function () {
    searchBox.classList.add("expanded");
  });

  searchInput.addEventListener("blur", function () {
    if (!searchInput.value) {
      searchBox.classList.remove("expanded");
    }
  });

  btnCategorias.addEventListener("click", toggleSidebar);

  // Evento para terminar a sessão
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("userLogged"); // Remove os dados do usuário do localStorage
    window.location.href = "../html/index.html"; // Redireciona para a página inicial
  });
};

function header(userLogged) {
  if (userLogged != null) {
    textoNome.innerHTML = "Olá <br>" + userLogged.name + " !";
  } else {
    textoNome.innerHTML = "Olá <br> anónimo";
  }
}

function toggleSidebar() {
  sidebar.classList.toggle("hidden");
  sidebar.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const vendasLink = document.getElementById("vendas-link");
  const moradasLink = document.getElementById("moradas-link");
  const vendasContent = document.getElementById("vendas-content");
  const moradasContent = document.getElementById("moradas-content");

  function esconderConteudo() {
    vendasContent.classList.add("hidden");
    moradasContent.classList.add("hidden");
  }

  vendasLink.addEventListener("click", (e) => {
    e.preventDefault(); 
    esconderConteudo(); 
    vendasContent.classList.remove("hidden"); 
  });

  moradasLink.addEventListener("click", (e) => {
    e.preventDefault(); 
    esconderConteudo(); 
    moradasContent.classList.remove("hidden");
  });
});

