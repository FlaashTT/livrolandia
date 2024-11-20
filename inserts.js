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
/*

con.connect(function(err) {
    if (err) throw err;
    
  
    // Inserindo múltiplos registros
    const sql = `INSERT INTO Utilizador (name, email, password) VALUES ?`;
    const values = [
      ['leo', 'leo@gmail.com', '12345'],
      ['Maria Costa', 'Avenida Central', 'maria@gmail.com', '654321', 934567890],
      
    ];
  
    con.query(sql, [values], function(err, result) {
      if (err) throw err;
      console.log(`${result.affectedRows} registros inseridos!`);
    });
  });
*/
  con.connect(function(err) {
    if (err) throw err;
    
  
    // Inserindo múltiplos registros
    const sql = `INSERT INTO Categoria (nome) VALUES ?`;
    const values = [
      ['Arte'],
      ['Banda desenhada'],
      ['Ciencias exatas e naturais'],
      ['Ciencias sociais e humanas'],
      ['Desenvolvimento pessoal e espiritual'],
      ['Desporto e lazer'],
      ['Dicionarios e enciclopedias'],
      ['Direito'],
      ['Economia,finanças e contabilidade'],
      ['Engenharia'],
      ['Ensino e educação'],
      ['Gastronomia e vinhos'],
      ['Gestao'],
      ['Guias turísticos e mapas'],
      ['Historia'],
      ['Infantis e juvenis'],
      ['Informatica'],
      ['Literatura'],
      ['Medicina'],
      ['Plano nacional de leitura'],
      ['Politica'],
      ['Religiao e moral'],
      ['Saude e bem estar'],
      ['Vida pratica']
    ];
    
  
    con.query(sql, [values], function(err, result) {
      if (err) throw err;
      console.log(`${result.affectedRows} registros inseridos!`);
    });
  });