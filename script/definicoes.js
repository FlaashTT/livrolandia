let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput, toggleAccountLink, submenu,
  arrowIcon, logoutBtn, userNameElement;

window.onload = function () {
  // Recupera o usuário logado do localStorage
  
  userLogged = JSON.parse(localStorage.getItem("userLogged"));

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
  dadosPessoaislink = document.getElementById("dadosPessoaislink");
  dadosPessoais = document.getElementById("dadosPessoais");
  linkCupons = document.getElementById("linkCupons");
  cupons = document.getElementById("cupons");
  linkFavoritos = document.getElementById("linkFavoritos");
  favoritos = document.getElementById("favoritos");

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
  iconFavs.addEventListener("click",(e) => {
    funcaoFavs();
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
    localStorage.removeItem("userLogged"); // Remove os dados do usuário logado do localStorage
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
  let vendasLink = document.getElementById("vendas-link"),
    moradasLink = document.getElementById("moradas-link"),
    vendasContent = document.getElementById("vendas-content"),
    moradasContent = document.getElementById("moradas-content");

  function esconderConteudo() {
    vendasContent.classList.add("hidden");
    moradasContent.classList.add("hidden");
    favoritos.classList.add("hidden");
    dadosPessoais.classList.add("hidden");
    cupons.classList.add("hidden")

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

  dadosPessoaislink.addEventListener("click",(e) =>{
    e.preventDefault();
    esconderConteudo();
    dadosPessoais.classList.remove("hidden");
  });

  linkCupons.addEventListener("click",(e) =>{
    e.preventDefault();
    esconderConteudo();
    cupons.classList.remove("hidden");
  });

  linkFavoritos.addEventListener("click",(e) =>{
    e.preventDefault();
    funcaoFavs();
  });

  function funcaoFavs(){
    esconderConteudo();
    favoritos.classList.remove("hidden");
    showFavorits();
  }

});


function showFavorits() {
  if (!userLogged) {
      favoritosHtml.innerHTML = "Indisponível, inicie sessão para continuar!<br>";
      favoritosHtml.innerHTML += `
      <input type="button" value="Iniciar sessão!" onclick="window.location.href='../html/registo.html';">
  `;
      return;
  } else {
      const id_utilizador = userLogged.id_utilizador; // Usando o id_utilizador de userLogged

      fetch('http://localhost:3000/favoritos', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id_utilizador }) // Enviando o id_utilizador na requisição
      })
          .then(response => response.json())
          .then(data => {
              let favoritosHtmlContent = ''; // Variável para armazenar o HTML dos favoritos

              if (data.success) {
                  if (Array.isArray(data.favorites) && data.favorites.length > 0) {
                      data.favorites.forEach((favorito, i) => {
                          fetch('http://localhost:3000/livro', {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ id_livro: favorito.id_livro }) // Envia o id_livro
                          })
                              .then(response => response.json())
                              .then(livroData => {
                                  if (livroData.success) {
                                      const livro = livroData.livro;

                                      // Adiciona as informações do livro ao HTML do favorito
                                      favoritosHtmlContent += `
                                    <div 
                                      class="favorito" 
                                      id="favorito${i + 1}" 
                                      onclick="window.location.href='../html/book.html'">
                                      <img src="../Res/categorias/${livro.nome_categoria}/${livro.titulo}.png" alt="imagem">
                                      <p>${livro.titulo}</p> 
                                      <p>${livro.autor}</p><br>
                                      
                                      <button class="btnFavorito" id="${livro.id_livro}" onclick="removerFavorito(event, '${livro.id_livro}')">
                                          Remover
                                      </button>
                                  </div>
                              `;
                                  } else {
                                      favoritosHtmlContent += `
                                  <div class="favorito">
                                      <p>Favorito ${i + 1}: Não foi possível carregar os dados do livro.</p>
                                  </div>
                              `;
                                  }
                                  favoritosHtml.innerHTML = favoritosHtmlContent;

                              })
                              .catch(error => console.error('Erro ao buscar detalhes do livro:', error));
                      });
                  } else {
                      favoritosHtmlContent += `
                  <div class="favorito">
                      <p>Sem nenhum livro favorito marcado</p>
                  </div>
              `;
                  }
              } else {
                  alert(data.message);
              }

              // Atualiza o HTML no contêiner com o ID 'favoritosHtml'
              favoritosHtml.innerHTML = favoritosHtmlContent;
          })
          .catch(error => console.error('Error:', error));
  }
}

