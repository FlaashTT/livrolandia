let btnCategorias, categorias, textoNome, sidebar, iconConta, iconFavs, iconCarrinho, searchBox, searchInput, toggleAccountLink, submenu,
  arrowIcon, logoutBtn, userNameElement, vendasLink, moradasLink, vendasContent, moradasContent, dadosPessoaislink, dadosPessoais,
  linkFavoritos, favoritos, favoritosHtml;

window.onload = function () {
  localStorage.removeItem('compra');
  inicializarElementos();
  configurarEventos();
  atualizarHeader();
  verificarParametros();
};

function inicializarElementos() {
  localStorage.removeItem('compra');
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
  linkFavoritos = document.getElementById("linkFavoritos");
  favoritos = document.getElementById("favoritos");
  favoritosHtml = document.getElementById("favoritosHtml");

  searchBox = document.querySelector(".search-box");
  searchInput = document.querySelector(".search-text");
  exibirHistorico();
}

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
  linkFavoritos.addEventListener("click", (e) => alternarConteudo(e, favoritos, funcaoFavs));
}

function atualizarHeader() {
  if (userLogged) {
    textoNome.innerHTML = `Olá <br>${userLogged.name} !`;
    userNameElement.innerHTML = `${userLogged.name}!`;
  } else {
    if(confirm("inicie sessao para acessar esta pagina")){
      window.location.href='../html/registo.html';
     }else{
       window.location.href = '../html/index.html';
     }
    
  }
}




function verificarParametros() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("show") === "favoritos") funcaoFavs();
}

function toggleSubmenu() {
  submenu.style.display = submenu.style.display === "block" ? "none" : "block";
  arrowIcon.classList.toggle("ri-arrow-up-line");
  arrowIcon.classList.toggle("ri-arrow-down-line");
}

function redirecionarConta() {
  const destino = userLogged ? "../html/definicoes.html" : "../html/registo.html";
  window.location.href = destino;
}

function esconderConteudo() {
  [vendasContent, moradasContent, favoritos, dadosPessoais].forEach(content => content.classList.add("hidden"));
  exibirHistorico();
}

function alternarConteudo(event, content, callback = null) {
  event.preventDefault();
  esconderConteudo();
  content.classList.remove("hidden");
  if (callback) callback();
}

function toggleSidebar() {
  sidebar.classList.toggle("hidden");
  sidebar.classList.toggle("show");
}

function logout() {
  localStorage.removeItem("userLogged");
  window.location.href = "../html/index.html";
}

function funcaoFavs() {
  esconderConteudo();
  favoritos.classList.remove("hidden");
  showFavorits();
}

function showFavorits() {
  if (!userLogged) {
    favoritosHtml.innerHTML = "Indisponível, inicie sessão para continuar!<br>";
    favoritosHtml.innerHTML += `
      <input type="button" value="Iniciar sessão!" onclick="window.location.href='../html/registo.html';">
    `;
    return;
  } else {
    const id_utilizador = userLogged.id_utilizador; 

    fetch('http://localhost:3000/favoritos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_utilizador }) 
    })
      .then(response => response.json())
      .then(data => {
        let favoritosHtmlContent = ''; 

        if (data.success) {
          if (Array.isArray(data.favorites) && data.favorites.length > 0) {
            data.favorites.forEach((favorito, i) => {
              fetch('http://localhost:3000/livroParaFavoritos', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_livro: favorito.id_livro }) 
              })
                .then(response => response.json())
                .then(livroData => {
                  if (livroData.success) {
                    const livro = livroData.livro;

                    favoritosHtmlContent += `
                      <div class="favorito" id="favorito${i + 1}" >
                        <img src="../Res/categorias/${livro.nome_categoria}/${livro.titulo}.png" alt="imagem" class="itemFav" onclick=paginaLivro(${livro.id_livro})>
                        <p class="itemFav" onclick=paginaLivro(${livro.id_livro}) >${livro.titulo}</p> 
                        <p class="itemFav" onclick=paginaLivro(${livro.id_livro})>${livro.autor}</p><br>
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
        favoritosHtml.innerHTML = favoritosHtmlContent;
      })
      .catch(error => console.error('Error:', error));
  }
}

function removerFavorito(idLivro) {
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
        location.reload();
      } else {
        alert("Erro ao remover o livro")
      }
    })
    .catch(error => console.error('Erro ao buscar detalhes do livro:', error));
}

function paginaLivro(idLivro) {
  window.location.href = `../html/book.html?show=${idLivro}`;
}

function exibirHistorico() {
  const historicoContent = document.getElementById("vendas-content");
  historicoContent.innerHTML = ''; 

  fetch('http://localhost:3000/buscarHistorico', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_utilizador: userLogged['id_utilizador'] }) 
  })
  .then(response => response.json())
  .then(historicoData => {
      if (historicoData.success) {
          historicoData.data.forEach(item => {
              // Formata a data para YYYY-MM-DD
              const dataFormatada = new Date(item.dataCompra).toISOString().split('T')[0];

              historicoContent.innerHTML += `
                  <div class="sale-info">
                      <div class="sale-details">
                          <p>Encomenda Nº ${item.id_compra}</p>
                          <p>Data da Compra: ${dataFormatada}</p>
                          <p class="location">Livro: ${item.titulo}</p>
                      </div>
                      <div class="price">Valor: ${item.preco.toFixed(2)}€</div>
                  </div>
              `;
          });
      } else {
          historicoContent.innerHTML = `
              <div class="carrinho-item">
                  <p>Não tem histórico de compras.</p>
              </div>
          `;
      }
  })
  .catch(error => {
      console.error('Erro ao buscar histórico:', error);
      historicoContent.innerHTML = `
          <div class="carrinho-item">
              <p>Erro ao carregar o histórico.</p>
          </div>
      `;
  });
}



