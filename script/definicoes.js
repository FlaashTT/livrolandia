let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput, toggleAccountLink, submenu,
  arrowIcon, logoutBtn, userNameElement, vendasLink, moradasLink, vendasContent, moradasContent, dadosPessoaislink, dadosPessoais,
  linkCupons, cupons, linkFavoritos, favoritos, favoritosHtml;

// Carregamento da página
window.onload = function () {
  inicializarElementos();
  configurarEventos();
  atualizarHeader();
  verificarParametros();
};

// Função para inicializar os elementos
function inicializarElementos() {
  userLogged = JSON.parse(localStorage.getItem("userLogged"));

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

  vendasLink = document.getElementById("vendas-link");
  moradasLink = document.getElementById("moradas-link");
  vendasContent = document.getElementById("vendas-content");
  moradasContent = document.getElementById("moradas-content");

  dadosPessoaislink = document.getElementById("dadosPessoaislink");
  dadosPessoais = document.getElementById("dadosPessoais");
  linkCupons = document.getElementById("linkCupons");
  cupons = document.getElementById("cupons");
  linkFavoritos = document.getElementById("linkFavoritos");
  favoritos = document.getElementById("favoritos");
  favoritosHtml = document.getElementById("favoritosHtml");

  searchBox = document.querySelector(".search-box");
  searchInput = document.querySelector(".search-text");
}

// Função para configurar eventos
function configurarEventos() {
  toggleAccountLink.addEventListener("click", toggleSubmenu);
  iconConta.addEventListener("click", redirecionarConta);
  iconFavs.addEventListener("click", funcaoFavs);
  iconCarrinho.addEventListener("click", () => window.location.href = "../html/carrinho.html");
  searchInput.addEventListener("focus", () => searchBox.classList.add("expanded"));
  searchInput.addEventListener("blur", () => {
    if (!searchInput.value) searchBox.classList.remove("expanded");
  });
  btnCategorias.addEventListener("click", toggleSidebar);
  logoutBtn.addEventListener("click", logout);
  vendasLink.addEventListener("click", (e) => alternarConteudo(e, vendasContent));
  moradasLink.addEventListener("click", (e) => alternarConteudo(e, moradasContent));
  dadosPessoaislink.addEventListener("click", (e) => alternarConteudo(e, dadosPessoais));
  linkCupons.addEventListener("click", (e) => alternarConteudo(e, cupons));
  linkFavoritos.addEventListener("click", (e) => alternarConteudo(e, favoritos, funcaoFavs));
}

// Função para atualizar o header com o nome do usuário
function atualizarHeader() {
  if (userLogged) {
    textoNome.innerHTML = `Olá <br>${userLogged.name} !`;
    userNameElement.innerHTML = `${userLogged.name}!`;
  } else {
    textoNome.innerHTML = "Olá <br> anónimo";
    userNameElement.innerHTML = "anónimo";
  }
}

// Função para verificar parâmetros da URL
function verificarParametros() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("show") === "favoritos") funcaoFavs();
}

// Função para alternar o submenu de conta
function toggleSubmenu() {
  submenu.style.display = submenu.style.display === "block" ? "none" : "block";
  arrowIcon.classList.toggle("ri-arrow-up-line");
  arrowIcon.classList.toggle("ri-arrow-down-line");
}

// Função para redirecionar a conta
function redirecionarConta() {
  const destino = userLogged ? "../html/definicoes.html" : "../html/registo.html";
  window.location.href = destino;
}

// Função para esconder o conteúdo
function esconderConteudo() {
  [vendasContent, moradasContent, favoritos, dadosPessoais, cupons].forEach(content => content.classList.add("hidden"));
}

// Função para alternar o conteúdo visível
function alternarConteudo(event, content, callback = null) {
  event.preventDefault();
  esconderConteudo();
  content.classList.remove("hidden");
  if (callback) callback();
}

// Função para alternar a sidebar
function toggleSidebar() {
  sidebar.classList.toggle("hidden");
  sidebar.classList.toggle("show");
}

// Função para encerrar a sessão
function logout() {
  localStorage.removeItem("userLogged");
  window.location.href = "../html/index.html";
}

// Função para exibir favoritos
function funcaoFavs() {
  esconderConteudo();
  favoritos.classList.remove("hidden");
  showFavorits();
}

// Função para carregar os favoritos
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
              fetch('http://localhost:3000/livroParaFavoritos', {
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
                        onclick="window.location.href='../html/book.html?show=${livro.id_livro}'">
                        <img src="../Res/categorias/${livro.nome_categoria}/${livro.titulo}.png" alt="imagem">
                        <p>${livro.titulo}</p> 
                        <p>${livro.autor}</p><br>
                        <button class="btnFavorito" id="${livro.id_livro}" onclick="removerFavorito('${livro.id_livro}')">
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

function removerFavorito(idLivro){
  idUser = userLogged.id_utilizador

  fetch('http://localhost:3000/removerFavorito', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_livro: idLivro, id_utilizador: idUser })
  })
    .then(response => response.json())
    .then(livroData => {
      if (livroData.success) {
        alert("Livro removido com sucesso")
      } else {
        alert("Erro ao remover o livro")
      }
    })
    .catch(error => console.error('Erro ao buscar detalhes do livro:', error));
}

