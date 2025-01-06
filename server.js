const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importando o cors
const app = express();
const port = 3000;

app.use(cors()); // Adicionando o middleware CORS para permitir requisições de qualquer origem
app.use(bodyParser.json());

// Conexão com o banco de dados
const con = mysql.createConnection({
    host: "10.147.17.227",
    user: "123hames",
    password: "password1",
    database: "livrolandia"
});



con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM Utilizador WHERE email = ? AND password = ?';

    con.query(query, [email, password], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.json({ success: false, message: "Credenciais inválidas" });
        }
    });
});

app.post('/register', (req, res) => {
    const { email, password, name, tipoUser } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!email || !password || !name || !tipoUser) {
        return res.json({ success: false, message: 'Todos os campos são obrigatórios!' });
    }

    // Verifica se o e-mail já existe
    const checkEmailQuery = 'SELECT * FROM Utilizador WHERE email = ?';
    con.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Erro ao verificar e-mail: ' + err.message });
        }

        if (result.length > 0) {
            // Caso o e-mail já exista
            return res.json({ success: false, message: 'Este e-mail já está registrado!' });
        } else {
            // Caso o e-mail não exista, prosseguir com a criação do usuário
            const sql = 'INSERT INTO Utilizador (email, password, name, tipoUtilizador) VALUES (?, ?, ?, ?)';
            con.query(sql, [email, password, name, tipoUser], (err, result) => {
                if (err) {
                    return res.json({ success: false, message: 'Erro ao registrar usuário: ' + err.message });
                }
                res.json({ success: true, message: 'Usuário registrado com sucesso!' });
            });
        }
    });
});


app.post('/forgotPass', (req, res) => {
    const { forgEmail } = req.body;
    const query = 'SELECT * FROM Utilizador WHERE email = ? ';

    con.query(query, [forgEmail], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.json({ success: false, message: "Credenciais inválidas" });
        }
    });
});

app.post('/favoritos', (req, res) => {
    const { id_utilizador } = req.body; // Obtém o id_utilizador da requisição

    // Verifica se id_utilizador foi fornecido
    if (!id_utilizador) {
        return res.json({ success: false, message: "ID do usuário é obrigatório" });
    }

    // Query para buscar os favoritos do usuário
    const query = 'SELECT * FROM Favorito WHERE id_utilizador = ?';

    con.query(query, [id_utilizador], (err, result) => {
        if (err) {
            console.error('Erro ao acessar o banco de dados:', err);
            return res.json({ success: false, message: "Erro ao acessar o banco de dados" });
        }

        // Se o usuário não tiver favoritos
        if (result.length > 0) {
            // Se houver favoritos, retornamos os dados
            res.json({ success: true, favorites: result });
        } else {
            // Se não houver favoritos, retornamos uma mensagem apropriada
            res.json({ success: true, favorites: [] });
        }
    });
});

//usado para mostrar apenas um livro na pagina book
app.post('/ExibirDadosLivro', (req, res) => {
    const { id_livro } = req.body;
    const query = `
    SELECT Livros.*, Categoria.nome AS categoria_nome
    FROM Livros
    INNER JOIN Categoria
    ON Livros.id_categoria = Categoria.id_categoria
    WHERE Livros.id_livro = ?`;

    con.query(query, [id_livro], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            res.json({
                success: true,
                livro: result[0]
            });
        } else {
            res.json({ success: false, message: "ERRO!" });
        }
    });
});

app.post('/livroParaFavoritos', (req, res) => {
    const { id_livro } = req.body;

    if (!id_livro) {
        return res.json({ success: false, message: "ID do livro é obrigatório" });
    }

    // Query para buscar os detalhes do livro e sua categoria
    const queryLivro = `
        SELECT Livros.*, Categoria.nome AS nome_categoria
        FROM Livros
        INNER JOIN Categoria ON Livros.id_categoria = Categoria.id_categoria
        WHERE Livros.id_livro = ?`;

    con.query(queryLivro, [id_livro], (err, result) => {
        if (err) {
            console.error('Erro ao acessar o banco de dados:', err);
            return res.json({ success: false, message: "Erro ao acessar o banco de dados" });
        }

        if (result.length > 0) {
            res.json({
                success: true,
                livro: result[0]
            });
        } else {
            res.json({ success: false, message: "Livro não encontrado" });
        }
    });
});

app.post('/livrosParaCat', (req, res) => {
    const { id_categoria } = req.body;

    if (!id_categoria) {
        return res.json({ success: false, message: "ID da categoria é obrigatório" });
    }

    // Query para buscar os livros da categoria selecionada
    const queryLivros = `
        SELECT Livros.*, Categoria.nome AS nome_categoria
        FROM Livros
        INNER JOIN Categoria ON Livros.id_categoria = Categoria.id_categoria
        WHERE Livros.id_categoria = ?`;

    con.query(queryLivros, [id_categoria], (err, results) => {
        if (err) {
            console.error('Erro ao acessar o banco de dados:', err);
            return res.json({ success: false, message: "Erro ao acessar o banco de dados" });
        }

        if (results.length > 0) {
            res.json({
                success: true,
                livros: results // Retorna todos os livros da categoria
            });
        } else {
            res.json({ success: false, message: "Nenhum livro encontrado para esta categoria" });
        }
    });
});


app.post('/carrinho', (req, res) => {
    const { id_utilizador } = req.body; // Obtém o id_utilizador da requisição

    // Verifica se id_utilizador foi fornecido
    if (!id_utilizador) {
        return res.json({ success: false, message: "ID do usuário é obrigatório" });
    }

    // Query para buscar os favoritos do usuário
    const query = 'SELECT * FROM carrinho WHERE id_utilizador = ?';

    con.query(query, [id_utilizador], (err, result) => {
        if (err) {
            console.error('Erro ao acessar o banco de dados:', err);
            return res.json({ success: false, message: "Erro ao acessar o banco de dados" });
        }

        // Se o usuário não tiver favoritos
        if (result.length > 0) {
            // Se houver favoritos, retornamos os dados
            res.json({ success: true, carrinho: result });
        } else {
            // Se não houver favoritos, retornamos uma mensagem apropriada
            res.json({ success: true, carrinho: [] });
        }
    });
});



app.get('/categoria', (req, res) => {
    // Consulta para buscar 5 categorias aleatórias
    // const queryCategorias = 'SELECT * FROM Categoria ';
    const queryCategorias = 'SELECT * FROM Categoria ORDER BY RAND() LIMIT 5';


    con.query(queryCategorias, (err, categorias) => {
        if (err) {
            console.error('Erro ao buscar categorias:', err.message);
            return res.json({ success: false, message: 'Erro ao buscar categorias: ' + err.message });
        }

        if (categorias.length === 0) {
            console.log('Nenhuma categoria encontrada.');
            return res.json({ success: false, message: "Nenhuma categoria encontrada" });
        }

        // Array para buscar livros para cada categoria
        const categoriasComLivros = [];

        categorias.forEach(categoria => {
            const queryLivros = 'SELECT * FROM Livros WHERE id_categoria = ?';
            con.query(queryLivros, [categoria.id], (err, livros) => {
                if (err) {
                    console.error(`Erro ao buscar livros para a categoria ${categoria.id}:`, err.message);
                }

                categoria.livros = livros || []; // Adiciona livros à categoria (ou um array vazio caso ocorra erro)
                categoriasComLivros.push(categoria); // Adiciona categoria com livros à lista

                // Após todas as categorias e livros serem processados, envia a resposta
                if (categoriasComLivros.length === categorias.length) {
                    res.json({ success: true, categorias: categoriasComLivros });
                }
            });
        });
    });
});



app.post('/removerFavorito', (req, res) => {
    const { id_livro, id_utilizador } = req.body;

    // A consulta deve usar ambos os parâmetros id_livro e id_utilizador
    const query = 'DELETE FROM Favorito WHERE id_livro = ? AND id_utilizador = ?';

    // Passa ambos os parâmetros para a query
    con.query(query, [id_livro, id_utilizador], (err, result) => {
        if (err) {
            console.error('Erro ao remover favorito:', err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }

        // Verifica se pelo menos uma linha foi afetada
        if (result.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Livro não encontrado nos favoritos' });
        }
    });
});

app.post('/adicionarFavoritos', (req, res) => {
    const { id_utilizador, id_livro } = req.body;

    // Verifica se o livro já está nos favoritos
    const sqlCheck = 'SELECT * FROM Favorito WHERE id_utilizador = ? AND id_livro = ?';
    con.query(sqlCheck, [id_utilizador, id_livro], (err, result) => {
        if (err) {
            console.error('Erro ao verificar favorito:', err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }

        // Se já existe o favorito, retorna uma mensagem indicando isso
        if (result.length > 0) {
            return res.json({ success: false, message: 'Livro já adicionado aos favoritos' });
        }

        // Caso não esteja nos favoritos, insere o novo favorito
        const sqlInsert = 'INSERT INTO Favorito (id_utilizador, id_livro) VALUES (?, ?)';
        con.query(sqlInsert, [id_utilizador, id_livro], (err, result) => {
            if (err) {
                console.error('Erro ao adicionar favorito:', err);
                return res.json({ success: false, message: 'Erro no servidor' });
            }

            // Verifica se a inserção foi bem-sucedida
            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Livro adicionado aos favoritos' });
            } else {
                res.json({ success: false, message: 'Não foi possível adicionar o favorito' });
            }
        });
    });
});


app.post('/livroParaCarrinho', (req, res) => {
    const { id_livro, id_utilizador } = req.body;

    if (!id_livro || !id_utilizador) {
        return res.json({ success: false, message: "ID do livro e ID do utilizador são obrigatórios" });
    }

    // Query para buscar os detalhes do livro e o nome da categoria
    const queryLivro = `
        SELECT Livros.*, Categoria.nome AS nome_categoria
        FROM Livros
        INNER JOIN carrinho ON Livros.id_livro = carrinho.id_livro
        INNER JOIN Categoria ON Livros.id_categoria = Categoria.id_categoria
        WHERE carrinho.id_utilizador = ? AND carrinho.id_livro = ?;
    `;

    con.query(queryLivro, [id_utilizador, id_livro], (err, result) => {
        if (err) {
            console.error('Erro ao acessar o banco de dados:', err);
            return res.json({ success: false, message: "Erro ao acessar o banco de dados" });
        }

        if (result.length > 0) {
            res.json({
                success: true,
                livro: result[0]
            });
        } else {
            res.json({ success: false, message: "Livro não encontrado no carrinho" });
        }
    });
});


app.post('/removerLivroDoCarrinho', (req, res) => {
    const { id_carrinho } = req.body;

    // Verifica se o id_carrinho está presente
    if (!id_carrinho) {
        return res.json({ success: false, message: "ID do carrinho é obrigatório" });
    }

    // A consulta agora usa apenas o id_carrinho para remover o livro
    const query = 'DELETE FROM carrinho WHERE id_carrinho = ?';

    // Passa o id_carrinho para a query
    con.query(query, [id_carrinho], (err, result) => {
        if (err) {
            console.error('Erro ao remover livro do carrinho:', err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }

        // Verifica se pelo menos uma linha foi afetada
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Livro removido com sucesso' });
        } else {
            res.json({ success: false, message: 'Livro não encontrado no carrinho' });
        }
    });
});

app.post('/removerQuantidade', (req, res) => {
    const { quantidade, id_carrinho } = req.body;

    // Verifica se o id_carrinho está presente
    if (!id_carrinho) {
        return res.json({ success: false, message: "ID do carrinho é obrigatório" });
    }

    // A consulta agora está corrigida
    const query = 'UPDATE carrinho SET quantidade = ? WHERE id_carrinho = ?';

    // Passa os parâmetros para a query
    con.query(query, [quantidade, id_carrinho], (err, result) => {
        if (err) {
            console.error('Erro ao remover livro do carrinho:', err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }

        // Verifica se pelo menos uma linha foi afetada
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Quantidade atualizada com sucesso' });
        } else {
            res.json({ success: false, message: 'Livro não encontrado no carrinho' });
        }
    });
});


app.post('/adicionarQuantidade', (req, res) => {
    const { quantidade, id_carrinho } = req.body;

    // Verifica se o id_carrinho está presente
    if (!id_carrinho) {
        return res.json({ success: false, message: "ID do carrinho é obrigatório" });
    }

    // A consulta agora está corrigida
    const query = 'UPDATE carrinho SET quantidade = ? WHERE id_carrinho = ?';

    // Passa os parâmetros para a query
    con.query(query, [quantidade, id_carrinho], (err, result) => {
        if (err) {
            console.error('Erro ao remover livro do carrinho:', err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }

        // Verifica se pelo menos uma linha foi afetada
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Quantidade atualizada com sucesso' });
        } else {
            res.json({ success: false, message: 'Livro não encontrado no carrinho' });
        }
    });
});


app.post('/selecionado', (req, res) => {
    const { nomeCat } = req.body;

    // Consulta para buscar o id_categoria com base no nome da categoria
    const queryCategoria = 'SELECT id_categoria FROM Categoria WHERE nome = ?';

    con.query(queryCategoria, [nomeCat], (err, result) => {
        if (err) {
            console.error('Erro ao buscar categoria:', err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }

        // Verifica se encontrou a categoria
        if (result.length > 0) {
            const idCategoria = result[0].id_categoria;  // Pega o id_categoria da categoria encontrada

            // Agora, busca os livros que têm esse id_categoria
            const queryLivros = `
                SELECT Livros.*, Categoria.nome AS nome_categoria
                FROM Livros
                INNER JOIN Categoria ON Livros.id_categoria = Categoria.id_categoria
                WHERE Livros.id_categoria = ?`;

            con.query(queryLivros, [idCategoria], (err, livrosResult) => {
                if (err) {
                    console.error('Erro ao buscar livros:', err);
                    return res.json({ success: false, message: 'Erro ao acessar os livros' });
                }

                // Verifica se encontrou livros para a categoria
                if (livrosResult.length > 0) {
                    res.json({
                        success: true,
                        livros: livrosResult // Retorna os livros encontrados para a categoria
                    });
                } else {
                    res.json({ success: false, message: 'Nenhum livro encontrado para esta categoria' });
                }
            });
        } else {
            res.json({ success: false, message: 'Categoria não encontrada' });
        }
    });
});

app.post('/adicionarLivroCart', (req, res) => {
    const { id_utilizador, id_livro } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!id_utilizador || !id_livro) {
        return res.json({ success: false, message: 'Sem dados necessários!' });
    }

    // Verifica se o livro já está no carrinho
    const checkLivroQuery = 'SELECT * FROM carrinho WHERE id_utilizador = ? AND id_livro = ?';
    con.query(checkLivroQuery, [id_utilizador, id_livro], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Erro ao verificar o carrinho: ' + err.message });
        }

        if (result.length > 0) {
            // Caso o livro já esteja no carrinho
            return res.json({ success: false, message: 'Já tem este livro no carrinho!' });
        } else {
            // Caso o livro não esteja no carrinho, adiciona-o
            const sql = 'INSERT INTO carrinho (id_utilizador, id_livro, quantidade) VALUES (?, ?, 1)';
            con.query(sql, [id_utilizador, id_livro], (err, result) => {
                if (err) {
                    // Retorna erro em formato JSON
                    return res.json({ success: false, message: 'Erro ao adicionar o livro: ' + err.message });
                }
                // Retorna sucesso em formato JSON
                return res.json({ success: true, message: 'Livro adicionado ao carrinho com sucesso!' });
            });
        }
        
    });
});


app.post('/buscarDadosCart', (req, res) => {
    const { id_user } = req.body;

    // Validação do id_user
    if (!id_user || isNaN(id_user)) {
        return res.json({ success: false, message: "ID do utilizador é inválido" });
    }

    // Consulta para buscar os dados do carrinho
    const query = `
        SELECT id_livro, quantidade
        FROM carrinho
        WHERE id_utilizador = ?`;

    con.query(query, [id_user], (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados do carrinho:', err);
            return res.json({ success: false, message: 'Erro ao buscar dados do carrinho' });
        }

        if (results.length > 0) {
            res.json({ success: true, data: results });
        } else {
            res.json({ success: false, message: 'Carrinho vazio' });
        }
    });
});


app.post('/limparCarrinho', (req, res) => {
    const { id_user } = req.body;

    // Verifica se o id_carrinho está presente
    if (!id_user) {
        return res.json({ success: false, message: "ID do carrinho é obrigatório" });
    }

    // A consulta agora usa apenas o id_carrinho para remover o livro
    const query = 'DELETE FROM carrinho WHERE id_utilizador = ?';

    // Passa o id_carrinho para a query
    con.query(query, [id_user], (err, result) => {
        if (err) {
            console.error('Erro ao remover livro do carrinho:', err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }

        // Verifica se pelo menos uma linha foi afetada
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Livro removido com sucesso' });
        } else {
            res.json({ success: false, message: 'Livro não encontrado no carrinho' });
        }
    });
});

app.post('/adicionarHistorico', (req, res ) =>{



});







app.listen(port, () => {
    console.log(`Server is running on the Moon port ${port}`);
});