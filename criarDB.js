const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const port = 3000;

app.use(cors()); 
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

const tables = [
    `CREATE TABLE Utilizador (
      id_utilizador INT AUTO_INCREMENT,
      name VARCHAR(30),
      morada VARCHAR(60),
      email VARCHAR(30) UNIQUE,
      password VARCHAR(30),
      telefone INT,
      verfiAdmin varchar(10) DEFAULT 'false',
      tipoUtilizador varchar(10),
      PRIMARY KEY (id_utilizador)
    )`,

    `CREATE TABLE Categoria (
      id_categoria INT AUTO_INCREMENT,
      nome VARCHAR(50),
      PRIMARY KEY (id_categoria)
    )`,

    `CREATE TABLE Livros (
      id_livro INT AUTO_INCREMENT,
      id_categoria INT,
      autor VARCHAR(100),
      imagem VARCHAR(100),
      sinopse VARCHAR(200),
      preco DECIMAL(10,2),
      titulo VARCHAR(100),
      id_utilizador INT,
      stock INT,
      desconto INT,
      FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id_utilizador),
      FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
      PRIMARY KEY (id_livro)
    )`,

    `CREATE TABLE Favorito (
      id_favorito INT AUTO_INCREMENT,
      id_utilizador INT,
      id_livro INT,
      dataAdicao DATE,
      FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id_utilizador),
      FOREIGN KEY (id_livro) REFERENCES Livros(id_livro),
      PRIMARY KEY (id_favorito, id_utilizador, id_livro)
    )`,

    `CREATE TABLE HistoricoCompras (
      id_compra INT AUTO_INCREMENT,
      id_utilizador INT,
      id_livro INT,
      id_vendedor INT,
      preco DECIMAL(10,2),
      dataCompra DATE,
      FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id_utilizador),
      FOREIGN KEY (id_livro) REFERENCES Livros(id_livro),
      PRIMARY KEY (id_compra,dataCompra, id_utilizador, id_livro)
    )`,

    `CREATE TABLE Troca (
      id_troca INT AUTO_INCREMENT,
      id_utilizador INT,
      id_vendedor INT,
      estado_troca VARCHAR(30),
      data_inicio DATE,
      FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id_utilizador),
      FOREIGN KEY (id_vendedor) REFERENCES Utilizador(id_utilizador),
      PRIMARY KEY (id_troca, id_utilizador, id_vendedor)
    )`
  ];

  // Executa a criação de cada tabela
  tables.forEach((sql, index) => {
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log(`Tabela ${index + 1} criada com sucesso!`);
    });
  });