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


app.listen(port, () => {
    console.log(`Server is running on the Moon port ${port}`);
});
