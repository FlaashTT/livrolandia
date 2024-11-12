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
    const query = 'SELECT * FROM loginDados WHERE email = ? AND password = ?';
    
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
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.json({ success: false, message: 'Todos os campos são obrigatórios!' });
    }

    // Inserir o novo usuário na base de dados
    const sql = 'INSERT INTO loginDados (email, password, name) VALUES (?, ?, ?)';
    con.query(sql, [email, password, name], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Erro ao registrar usuário: ' + err.message });
        }
        res.json({ success: true, message: 'Usuário registrado com sucesso!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
