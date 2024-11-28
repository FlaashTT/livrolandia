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



con.connect(function(err) {
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

app.post('/livro', (req, res) => {
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
                livro: result[0] // Inclui o nome da categoria no resultado
            });
        } else {
            res.json({ success: false, message: "Livro não encontrado" });
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





app.listen(port, () => {
    console.log(`Server is running on the Moon port ${port}`);
});
