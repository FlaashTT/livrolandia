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
      
    ];
  
    con.query(sql, [values], function(err, result) {
      if (err) throw err;
      console.log(`${result.affectedRows} registros inseridos!`);
    });
  });

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

con.connect(function (err) {
  if (err) throw err;


  const sql = `INSERT INTO Livros (id_categoria, autor, imagem, sinopse, preco, titulo) VALUES ?`;
  const values = [
    //arte
   
    ['1', 'Francisco Valente', '../RES/espelho_magico.png', 'Espelho Mágico convida-nos a embarcar numa viagem no tempo dos clássicos ao cinema contemporâneo detendo-se em cada paragem na relação entre espectadores e filmes. Como tem o cinema refletido os sentimentos desejos obsessões bem como as políticas do passado e a política do presente e o que nos diz tudo isso de quem fomos e quem somos hoje?', 18.90, 'Espelho Mágico'],
    ['1', 'Katy Hessel', '../RES/historia_da_arte_sem_homens.png', 'Uma nova narrativa da história da arte destacando artistas mulheres que foram ignoradas ou subestimadas nos relatos tradicionais. Passa por movimentos globais como o Renascimento e o Modernismo com foco na perspectiva feminina.', 22.90, 'História da Arte Sem Homens'],
    ['1', 'Henri Matisse', '../RES/o_ato_criativo.png', 'Uma coletânea de ensaios e reflexões sobre o processo criativo do ponto de vista artístico abordando a inspiração e os desafios enfrentados pelos artistas em diferentes contextos culturais e históricos.', 16.90, 'O Ato Criativo'],
    ['1', 'Clive Bell', '../RES/o_que_e_a_arte.png', 'Este livro explora a definição de arte através da teoria da forma significativa defendendo que as emoções estéticas são despertadas pela relação entre formas e cores na obra de arte.', 19.50, 'O Que É a Arte'],
    ['1', 'Taylor Swift', '../RES/TaylorSwift.png', 'Uma biografia ilustrada sobre a trajetória musical e pessoal da artista Taylor Swift explorando sua influência cultural prêmios e evolução artística.', 25.00, 'Taylor Swift']
  
    //banda desenhada
    ['2', 'Koyoharu Gotouge', '../RES/demon_slayer_N18.png', 'Tanjirou e Giyuu enfrentam Akaza o Jougen da Terceira Posição em uma batalha intensa. Durante a luta Tanjirou relembra o ensinamento de seu pai sobre o Mundo Transparente o que pode mudar o rumo do combate.', 10.90, 'Demon Slayer N.º 18'],
    ['2', 'William Golding', '../RES/o_deus_das_moscas.png', 'Este romance alegórico explora o comportamento humano em situações extremas seguindo um grupo de meninos presos em uma ilha deserta e suas tentativas de sobreviver e criar uma sociedade própria.', 14.90, 'O Deus das Moscas'],
    ['2', 'Irene Vallejo', '../RES/o_infinito_num_junco.png', 'Um mergulho fascinante na história dos livros desde as bibliotecas da Antiguidade até os dias atuais revelando como as palavras escritas moldaram o mundo.', 21.50, 'O Infinito num Junco'],
    ['2', 'Eiichiro Oda', '../RES/one_piece_N4.png', 'Neste volume Luffy e sua tripulação continuam a busca pelo lendário tesouro One Piece enfrentando desafios emocionantes e encontros inesperados no Grand Line.', 9.90, 'One Piece N.º 4'],
    ['2', 'Quino', '../RES/toda_a_mafalda_ed_especial.png', 'Uma coletânea das tiras de Mafalda a icônica personagem que aborda questões sociais políticas e existenciais de forma crítica e bem-humorada.', 34.90, 'Toda a Mafalda (Edição Especial)']
  
  
    //ciencias exatas e naturais
    ['3', 'António Manuel Baptista', '../RES/a-ciencia-no-grande-teatro-do-mundo.png', 'A Ciência no Grande Teatro do Mundo aborda o impacto da ciência no teatro da vida, explicando como esta molda a sociedade e as relações humanas.', 18.90, 'A Ciência no Grande Teatro do Mundo'],
    ['3', 'Mustafa Suleyman e Michael Bhaskar', '../RES/a-proxima-vaga.png', 'A Próxima Vaga explora as oportunidades e desafios que a revolução tecnológica trará, abordando questões éticas e práticas.', 19.50, 'A Próxima Vaga'],
    ['3', 'Kate Hosford', '../RES/as-vidas-secretas-dos-numeros.png', 'As Vidas Secretas dos Números apresenta curiosidades e histórias fascinantes sobre os números que usamos diariamente.', 14.90, 'As Vidas Secretas dos Números'],
    ['3', 'Lixing Sun', '../RES/os-mentirosos-da-natureza-e-a-natureza-dos-mentirosos.png', 'Os Mentirosos da Natureza e a Natureza dos Mentirosos discute estratégias de engano na natureza e como elas moldam o comportamento animal.', 19.90, 'Os Mentirosos da Natureza e a Natureza dos Mentirosos'],
    ['3', 'Carlos Fiolhais', '../RES/toda-a-fisica-divertida.png', 'Toda a Física Divertida desmistifica conceitos complexos de física com explicações simples e divertidas.', 19.50, 'Toda a Física Divertida']
  

    //ciencias sociais e humana
    ['4', 'Dr. David Walton', '../RES/inteligencia_emocional.png', 'Este livro é um guia prático com ferramentas para desenvolver uma inteligência emocional mais elevada, ajudando a gerir emoções e a construir melhores relacionamentos.', 17.50, 'Inteligência Emocional - O Que É'],
    ['4', 'Maria Pia', '../RES/pequenas_resistencias.png', 'O livro explora o impacto do jornalismo, utopias e amor público em nossas vidas, trazendo reflexões profundas sobre o papel da mídia e da criatividade.', 21.30, 'Pequenas Resistências - Ideias Sobre Jornalismo, Utopias e Amor Público'],
    ['4', 'Isaiah Berlin', '../RES/reflexoes_liberdade.png', 'Uma obra clássica que analisa os conceitos de liberdade positiva e negativa, além de suas implicações filosóficas e sociais.', 23.90, 'Reflexões Sobre a Liberdade'],
    ['4', 'Vários Autores', '../RES/servico_social.png', 'O livro discute o uso da arte como ferramenta na intervenção social, analisando práticas inovadoras e seu impacto na sociedade.', 19.95, 'Serviço Social e Intervenção Pela Arte'],
    ['4', 'Dr. Andrew Johnson', '../RES/stop_insonia.png', 'Uma abordagem prática para combater a insônia, com estratégias baseadas em técnicas de relaxamento e gestão do sono.', 15.60, 'Stop Insônia']


    //desenvolvimento pessoal e espiritual
    ['5', 'Rafael Pereira', '../RES/o_ano_da_mudanca.png', 'Um guia para implementar mudanças efetivas nas empresas, com foco no desenvolvimento humano e na adaptação às transformações organizacionais.', 22.50, 'O Ano da Mudança'],
    ['5', 'Lama Sopa', '../RES/o_livro_tibetano_dos_mortos.png', 'Exploração dos ensinamentos tibetanos sobre a morte e o pós-morte, como um manual para navegar o processo de transição espiritual.', 27.90, 'O Livro Tibetano dos Mortos'],
    ['5', 'Dr. Brian Smith', '../RES/pare_de_tentar_agradar.png', 'Uma obra que desafia o leitor a abandonar a necessidade de agradar aos outros e a buscar autenticidade e bem-estar emocional.', 16.80, 'Pare de Tentar Agradar aos Outros'],
    ['5', 'David Lane', '../RES/redescobre_te_com_human_design.png', 'Livro que apresenta o Human Design, ajudando o leitor a entender sua verdadeira natureza e como viver de maneira mais alinhada com seu eu interior.', 19.50, 'Redescobre-te com o Human Design'],
    ['5', 'Susan Hartley', '../RES/relacionamentos_amorosos.png', 'Uma análise profunda dos relacionamentos amorosos, abordando comunicação, intimidade e os fatores que ajudam a construir vínculos saudáveis e duradouros.', 20.00, 'Relacionamentos Amorosos']


    //desporto e lazer
    ['6', 'João Ribeiro', '../RES/azul_ate_ao_fim.png', 'Este livro é uma reflexão profunda sobre a vida e o amor, explorando as emoções humanas com uma sensibilidade única. A obra leva o leitor a uma jornada de autoconhecimento e redescoberta.', 19.90, 'Azul Até ao Fim'],
    ['6', 'M. Diane Vogt', '../RES/detetive_wc.png', 'Em "Detetive WC", você é desafiado a resolver mais de 60 mistérios na casa de banho. Com atenção aos detalhes e pistas, o objetivo é descobrir o culpado, o motivo e outros aspectos dos crimes de forma divertida e interativa.', 12.90, 'Detetive WC'],
    ['6', 'John Carter', '../RES/exercicio_cerebro.png', 'Este livro oferece exercícios mentais práticos para melhorar a memória e as habilidades cognitivas, visando uma melhor performance cerebral e combate ao declínio cognitivo.', 16.50, 'Exercício para Recarregar o Cérebro'],
    ['6', 'Vários Autores', '../RES/murdle1.png', 'Murdle #1 é um desafio intrigante de mistério, onde cada leitor deve resolver enigmas e descobrir os segredos ocultos. Através de pistas e lógica, você se tornará um mestre em desvendar os mistérios.', 18.00, 'Murdle #1'],
    ['6', 'Vários Autores', '../RES/murdle2.png', 'Em Murdle #2, os leitores continuam a desvendar mistérios, com novos enigmas e personagens que desafiarão sua inteligência e habilidades de resolução de problemas. Prepare-se para uma nova aventura cheia de surpresas.', 18.00, 'Murdle #2']


    //dicionarios e enciclopedias
    ['7', 'João Silva', '../RES/com_ou_sem_consoante.png', 'Este livro examina as regras ortográficas da língua portuguesa, focando-se nas consoantes que podem ou não ser usadas em algumas palavras, ajudando a compreender melhor as complexidades da escrita.', 12.90, 'Com ou Sem Consoante'],
    ['7', 'Ana Costa', '../RES/com_ou_sem_hifen.png', 'A obra explora o uso do hífen na língua portuguesa, esclarecendo quando ele deve ou não ser utilizado, com exemplos práticos para facilitar a compreensão do leitor.', 15.20, 'Com ou Sem Hífen'],
    ['7', 'Carlos Pereira', '../RES/com_ou_sem_virgula.png', 'Este livro oferece um estudo detalhado sobre a pontuação, especificamente a vírgula, abordando sua importância para a correta interpretação das frases.', 13.80, 'Com ou Sem Vírgula'],
    ['7', 'Vários Autores', '../RES/dicionario_escolar_lingua_portuguesa.png', 'O Dicionário Escolar da Língua Portuguesa é um recurso essencial para estudantes e público em geral, trazendo mais de 25.000 entradas e abrangendo as mudanças do Novo Acordo Ortográfico.', 19.99, 'Dicionário Escolar da Língua Portuguesa'],
    ['7', 'José Almeida', '../RES/oque_ha_de_novo_na_gramatica.png', 'Este livro atualiza as normas gramaticais da língua portuguesa, destacando os principais desenvolvimentos e mudanças que afetaram a gramática ao longo dos anos.', 22.50, 'O Que Há de Novo na Gramática']

   
    //direito
    ['8', 'Filipa Matias Magalhães', '../RES/codigo_trabalho.png', 'Este livro oferece uma análise detalhada das últimas alterações no Código do Trabalho, incluindo a Lei n.º 13/2023, focando-se na Agenda do Trabalho Digno e em seus impactos nas relações de trabalho.', 16.20, 'Código do Trabalho'],
    ['8', 'Joana Almeida', '../RES/codigo_contratos_publicos.png', 'A obra trata das regras e princípios fundamentais do regime jurídico dos contratos públicos, oferecendo uma visão clara das alterações mais recentes e suas implicações práticas.', 23.50, 'Código dos Contratos Públicos'],
    ['8', 'Vários Autores', '../RES/codigo_penal.png', 'A edição acadêmica do Código Penal oferece uma visão atualizada e detalhada dos artigos e suas interpretações, com ênfase nas últimas mudanças legislativas e jurisprudência relevante.', 25.00, 'Código Penal - Edição Acadêmica'],
    ['8', 'Vários Autores', '../RES/fiscal_edicao_academica.png', 'Esta obra fornece uma análise profunda da legislação fiscal portuguesa, com explicações práticas das normas fiscais aplicáveis e seus impactos nas operações financeiras e contábeis.', 18.90, 'Fiscal - Edição Acadêmica'],
    ['8', 'Vários Autores', '../RES/novo_codigo_processocivil.png', 'O Novo Código de Processo Civil oferece uma análise detalhada das regras e procedimentos processuais, com ênfase nas reformas mais recentes e na sua aplicação prática nos tribunais.', 22.80, 'Novo Código de Processo Civil']

   
    //economia,finanças e contabilidade
    ['9', 'Bruna Fernandes', '../RES/a_contabilista.png', 'Este livro simplifica os conceitos de contabilidade e fiscalidade, tornando-os acessíveis para empreendedores, ajudando-os a tomar decisões mais seguras e a focar no seu negócio em vez de nas obrigações fiscais.', 25.90, 'A Contabilista'],
    ['9', 'Morgan Housel', '../RES/psicologia_do_dinheiro.png', 'O livro explora como as nossas crenças, emoções e comportamentos moldam nossas decisões financeiras, desafiando a sabedoria convencional sobre dinheiro e investimentos.', 22.40, 'A Psicologia do Dinheiro'],
    ['9', 'George S. Clason', '../RES/homem_mais_rico_da_babilonia.png', 'Uma coleção de parábolas sobre como alcançar a riqueza e prosperidade, com lições atemporais sobre finanças pessoais baseadas nos princípios da antiga Babilônia.', 18.30, 'O Homem Mais Rico da Babilônia'],
    ['9', 'Robert Kiyosaki', '../RES/pai_rico_pai_pobre.png', 'Uma análise dos contrastes entre a mentalidade de um “pai rico” e um “pai pobre”, oferecendo lições sobre como alcançar a independência financeira e investir de forma inteligente.', 19.99, 'Pai Rico, Pai Pobre'],
    ['9', 'Bodo Schaefer', '../RES/ponha_seu_dinheiro_trabalhar.png', 'O livro oferece um passo a passo para transformar os seus hábitos financeiros e aprender a investir, ajudando a construir riqueza de maneira eficiente e sustentável.', 16.50, 'Ponha o Seu Dinheiro a Trabalhar Para Si']

      
    //engenharia
    ['10', 'Vários Autores', '../RES/abc_regras_tecnicas.png', 'O livro explora as principais normas e diretrizes que regem a aplicação de regras técnicas em diversas áreas, como a engenharia, construção e segurança, oferecendo uma abordagem prática e atualizada para profissionais e estudantes.', 29.90, 'ABC das Regras Técnicas'],
    ['10', 'José Paulo Saraiva Cabral', '../RES/gestao_manutencao.png', 'A obra apresenta uma visão moderna e atualizada sobre a gestão da manutenção de equipamentos e instalações, cobrindo aspectos como gestão energética, segurança, novos normativos e sistemas informáticos de apoio à manutenção.', 45.00, 'Gestão da Manutenção de Equipamentos, Instalações e Edifícios'],
    ['10', 'Vários Autores', '../RES/introducao_engenharia_som.png', 'Este livro serve como uma introdução ao campo da engenharia do som, abordando os fundamentos do som, acústica, e técnicas utilizadas em gravações e produções sonoras, ideal para iniciantes na área.', 24.90, 'Introdução à Engenharia do Som'],
    ['10', 'Vários Autores', '../RES/manual_seguranca.png', 'O manual abrange as melhores práticas e regulamentos relacionados à segurança no ambiente de trabalho e em atividades industriais, destacando normas de prevenção e protocolos de segurança.', 19.80, 'Manual de Segurança'],
    ['10', 'Vários Autores', '../RES/manual_tecnico_eletricista.png', 'Um guia completo para técnicos eletricistas, com instruções práticas e teóricas sobre instalação e manutenção de sistemas elétricos, com ênfase na segurança e na eficiência operacional.', 22.50, 'Manual do Técnico Eletricista']

  
   
    //ensino e educaçao
    ['11', 'Vários Autores', '../RES/alimentacao_palmo_meio.png', 'O livro fornece um guia completo para preparar refeições saudáveis e saborosas para crianças, enfatizando a criação de pratos nutritivos adequados às necessidades e preferências infantis.', 18.50, 'Alimentação para Gente de Palmo e Meio'],
    ['11', 'Adele Faber e Elaine Mazlish', '../RES/como_falar_para_as_criancas.png', 'Este é um guia prático para pais, com estratégias de comunicação eficazes para melhorar a relação entre pais e filhos, ajudando a tornar o ambiente familiar mais harmonioso.', 22.90, 'Como Falar para as Crianças Ouvirem e Ouvir para as Crianças Falarem'],
    ['11', 'Daniel J. Siegel', '../RES/o_cerebro_da_crianca.png', 'A obra explora como o cérebro das crianças se desenvolve e como os pais podem usar o entendimento desse processo para melhorar a educação e comunicação com seus filhos.', 24.90, 'O Cérebro da Criança'],
    ['11', 'Ross Campbell', '../RES/o_livro_que_gostaria.png', 'Este livro oferece uma visão única sobre como melhorar o relacionamento entre pais e filhos, focando nas necessidades emocionais das crianças e no impacto positivo dos pais em sua formação.', 20.70, 'O Livro que Gostaria que os Seus Pais Tivessem Lido'],
    ['11', 'Terry Brazelton', '../RES/o_sono_do_meu_bebe.png', 'Um guia essencial para pais de recém-nascidos, abordando os aspectos do sono infantil, com dicas para melhorar a qualidade do sono dos bebês e estabelecer uma rotina de descanso saudável.', 21.50, 'O Sono do Meu Bebê']
 
    
    //gastronomia e vinhos
    ['12', 'Vera Aleixo', '../RES/com_todo_o_gosto.png', 'Este livro oferece receitas low carb para diabéticos tipo 1, com dicas práticas para controlar a doença através de uma alimentação equilibrada, sem abrir mão do sabor.', 19.90, 'Com Todo o Gosto'],
    ['12', 'Raquel Amaral', '../RES/como_fazer_quase_tudo_na_airfryer.png', 'Neste livro, a autora ensina como utilizar a air fryer para preparar pratos deliciosos e saudáveis de maneira rápida e eficiente, sem perder o sabor.', 18.00, 'Como Fazer Quase Tudo na Air Fryer'],
    ['12', 'Vários Autores', '../RES/curso_de_cozinha.png', 'O livro oferece uma introdução prática ao mundo da cozinha, com receitas simples e técnicas essenciais para quem deseja aprimorar suas habilidades culinárias.', 25.00, 'Curso de Cozinha'],
    ['12', 'Vários Autores', '../RES/na_travessa.png', 'Este livro é uma coletânea de receitas clássicas e contemporâneas, oferecendo uma diversidade de pratos para diferentes ocasiões e preferências gastronômicas.', 22.50, 'Na Travessa'],
    ['12', 'Vários Autores', '../RES/receitas_faceis_de_pastelaria.png', 'A obra traz uma série de receitas fáceis e rápidas de pastelaria, perfeitas para quem deseja se aventurar na cozinha sem complicações, com resultados saborosos.', 16.80, 'Receitas Fáceis de Pastelaria na Air Fryer']

    
    //gestao
    ['13', 'Timothy Ferriss', '../RES/4_horas_por_semana.png', 'Este livro ensina como viver mais e trabalhar menos, revelando os segredos dos “novos ricos” que usam o tempo e a mobilidade para criar um estilo de vida luxuoso agora e não no futuro.', 23.50, '4 Horas por Semana'],
    ['13', 'Sun Tzu', '../RES/arte_da_guerra.png', 'A Arte da Guerra é uma obra clássica sobre estratégia militar e sabedoria que se aplica tanto a batalhas no campo quanto aos desafios da vida e dos negócios.', 18.90, 'A Arte da Guerra'],
    ['13', 'Marcia Tiburi', '../RES/a_vida_nao_pode_esperar.png', 'A Vida Não Pode Esperar é uma reflexão profunda sobre a urgência de tomar decisões que promovam o sentido da vida e a transformação pessoal no contexto contemporâneo.', 19.90, 'A Vida Não Pode Esperar'],
    ['13', 'Greg McKeown', '../RES/essencialismo.png', 'O essencialismo é um método para identificar o que realmente importa e eliminar o desnecessário, permitindo viver com mais foco e menos sobrecarga.', 21.00, 'Essencialismo'],
    ['13', 'T. Harv Eker', '../RES/segredos_da_mente_milionaria.png', 'O livro explora os padrões mentais que fazem os milionários e os hábitos que eles seguem para alcançar riqueza e sucesso pessoal, desafiando crenças limitantes sobre dinheiro e sucesso.', 22.90, 'Segredos da Mente Milionária']

    
    //guias turisticos e mapas
    ['14', 'Eugene Jackson & Adolph Geiger', '../RES/aprenda_alemao_sem_mestre.png', 'Este manual foi criado para quem deseja aprender a língua alemã de forma independente ou melhorar seus conhecimentos existentes. Apresenta as bases da gramática alemã de maneira gradual, com textos bilíngues, diálogos e exercícios práticos.', 19.90, 'Aprenda Alemão Sem Mestre'],
    ['14', 'Pierre Chardel', '../RES/frances_30_dias.png', 'Este livro oferece um plano de aprendizado do francês em 30 dias, ideal para iniciantes ou quem deseja revisar os fundamentos do idioma de forma prática e objetiva.', 16.50, 'Francês em 30 Dias'],
    ['14', 'Vários Autores', '../RES/guia_caminhos_santiago.png', 'Guia completo e detalhado sobre os Caminhos de Santiago, com informações úteis sobre o percurso, história, hospedagens e dicas para os peregrinos.', 24.90, 'Guia dos Caminhos de Santiago'],
    ['14', 'Vários Autores', '../RES/guia_viagem_porto_editora_top10_paris.png', 'Este guia traz as 10 principais atrações turísticas de Paris, oferecendo dicas práticas, mapas e informações para aproveitar ao máximo a estadia na cidade.', 22.90, 'Guias de Viagem Porto Editora Top 10 Paris'],
    ['14', 'Vários Autores', '../RES/portugal_norte_sul_estrada_nacional_2.png', 'A obra oferece um olhar sobre a famosa Estrada Nacional 2, desde o norte até o sul de Portugal, explorando as paisagens e histórias das localidades ao longo do percurso.', 29.90, 'Portugal de Norte a Sul pela Mítica Estrada Nacional 2']

    
    //historia
    ['15', 'A.R. Disney', '../RES/historia_portugal_imperio_vol1.png', 'A obra oferece uma análise detalhada da história de Portugal e do seu império ultramarino até o século XIX, destacando os principais eventos que moldaram o primeiro império global da história mundial.', 24.90, 'A História de Portugal e do Império Português - Volume 1'],
    ['15', 'Jared Diamond', '../RES/queda_das_civilizacoes.png', 'O autor examina as razões por trás do colapso das grandes civilizações da história, explorando fatores ambientais, sociais e políticos que contribuíram para sua queda.', 22.50, 'A Queda das Civilizações'],
    ['15', 'João Ferreira Duarte', '../RES/historia_global_literatura_portuguesa.png', 'Este livro traça a evolução da literatura portuguesa desde suas raízes até o cenário literário global, analisando os autores e obras que marcaram a história literária de Portugal.', 19.80, 'História Global da Literatura Portuguesa'],
    ['15', 'Simon Singh', '../RES/o_homem_que_decifrou_o_codigo.png', 'A obra narra a história de Alan Turing e como ele decifrou o código Enigma, uma das façanhas mais importantes da Segunda Guerra Mundial, além de seu impacto nas ciências da computação.', 21.90, 'O Homem que Decifrou o Código'],
    ['15', 'Vários Autores', '../RES/100_grandes_momentos_historia.png', 'O livro apresenta os 100 momentos mais significativos da história, proporcionando uma visão única sobre eventos que mudaram o rumo da humanidade.', 25.00, 'Os 100 Grandes Momentos da História']

    
    //infantis e juvenis
    ['16', 'J.K. Rowling', '../RES/harry_potter_camara.png', 'Harry Potter e a Câmara Secreta segue Harry em seu segundo ano na escola de magia Hogwarts, onde ele investiga mistérios envolvendo uma câmara secreta e um monstro mortal. Junto com seus amigos, Harry enfrenta desafios perigosos e descobre segredos sobre seu próprio passado.', 22.90, 'Harry Potter e a Câmara dos Segredos'],
    ['16', 'J.K. Rowling', '../RES/harry_potter_pedra.png', 'O primeiro livro da série Harry Potter introduz o jovem bruxo que descobre ser famoso no mundo mágico, ao embarcar em uma jornada cheia de magia, mistério e aventuras ao lado de seus amigos Rony e Hermione.', 21.50, 'Harry Potter e a Pedra Filosofal'],
    ['16', 'J.K. Rowling', '../RES/harry_potter_prisioneiro.png', 'Harry Potter e o Prisioneiro de Azkaban segue Harry enquanto ele lida com a fuga de um prisioneiro de Azkaban, Sirius Black, e tenta desvendar a verdade por trás do mistério envolvendo seu padrinho e o que realmente aconteceu no passado.', 24.90, 'Harry Potter e o Prisioneiro de Azkaban'],
    ['16', 'Vários Autores', '../RES/historias_empatia.png', 'Este livro reúne histórias inspiradoras e emocionantes que exploram o tema da empatia, mostrando como o entendimento e a compaixão podem transformar vidas e fortalecer laços humanos.', 19.99, 'Histórias Sobre Empatia'],
    ['16', 'Vários Autores', '../RES/bando_cavernas.png', 'O Bando das Cavernas N45 é uma coleção de histórias que transportam o leitor para tempos pré-históricos, com narrativas envolventes sobre sobrevivência, amizade e os desafios enfrentados por um grupo de caçadores e coletadores.', 15.90, 'O Bando das Cavernas N45']
 
   
    //informatica
    ['17', 'Pedro Domingos', '../RES/a_revolucao_do_algoritmo_mestre.png', 'O autor explora o conceito do "algoritmo-mestre", a última invenção que precisaremos, que terá a capacidade de resolver qualquer problema uma vez descoberto. Ele compara o algoritmo-mestre com a inteligência humana, detalhando como isso pode transformar a tecnologia e a vida cotidiana.', 12.50, 'A Revolução do Algoritmo-Mestre'],
    ['17', 'Autor desconhecido', '../RES/ciberseguranca.png', 'O livro aborda os conceitos essenciais da cibersegurança, incluindo ameaças digitais, medidas de proteção e como os indivíduos e empresas podem proteger dados e sistemas contra ataques cibernéticos.', 22.90, 'Cibersegurança'],
    ['17', 'Autor desconhecido', '../RES/enriqueca_com_o_chatgpt.png', 'Este livro oferece estratégias para usar o ChatGPT como ferramenta de aprimoramento de negócios, marketing e desenvolvimento pessoal, ajudando a potencializar seus ganhos com o uso inteligente da IA.', 18.50, 'Enriqueça com o ChatGPT'],
    ['17', 'Autor desconhecido', '../RES/introducao_algoritmia_programacao_python.png', 'Uma introdução prática e acessível à algoritmia e à programação com Python, ideal para iniciantes que buscam entender a base do pensamento computacional e suas aplicações no mundo real.', 25.00, 'Introdução à Algoritmia e Programação com Python'],
    ['17', 'Autor desconhecido', '../RES/utilizacao_excel_economia_gestao.png', 'Este livro apresenta técnicas e métodos para usar o Excel de maneira eficaz em economia e gestão, incluindo análise de dados financeiros, criação de relatórios e modelagem de cenários.', 21.80, 'Utilização do Excel para Economia e Gestão']
 
    
    //literatura
    ['18', 'Marie NDiaye', '../RES/a_vinganca_e_minha.png', 'Este romance gira em torno de uma advogada chamada Dra. Susane, que é contratada para defender uma mulher acusada de assassinar os filhos, e sua jornada traz à tona questões sobre o passado e o impacto das escolhas que fizemos.', 19.90, 'A Vingança É Minha'],
    ['18', 'Vários Autores', '../RES/isto_comeca_aqui.png', 'O livro aborda os momentos iniciais de eventos históricos e sociais significativos, com um olhar único sobre como pequenas ações podem levar a mudanças transformadoras.', 22.90, 'Isto Começa Aqui'],
    ['18', 'Nadine Gonçalves', '../RES/nao_incomodar.png', 'Com humor e sensibilidade, o livro discute as situações cotidianas em que o estresse e a necessidade de espaço pessoal entram em jogo, mostrando como podemos lidar com a sobrecarga emocional e mental.', 18.70, 'Não Incomodar'],
    ['18', 'Vários Autores', '../RES/proibida_na_normandia.png', 'Este livro conta a história de resistência e luta durante a ocupação da Normandia, explorando o papel crucial da coragem e da determinação na história de uma região ocupada.', 23.50, 'Proibida na Normandia'],
    ['18', 'Vários Autores', '../RES/teu_para_sempre.png', 'Uma narrativa emocionante que explora os altos e baixos de um relacionamento, mostrando como o amor e a lealdade podem resistir ao tempo e às dificuldades da vida.', 20.90, 'Teu Para Sempre']

    
    //medicina
    ['19', 'Olga Ribeiro', '../RES/ambientes_pratica_enfermagem.png', 'O livro explora a importância de ambientes de prática de enfermagem positivos, destacando como a qualidade, segurança e bem-estar dos profissionais impactam os resultados organizacionais e a satisfação dos clientes.', 29.99, 'Ambientes de Prática de Enfermagem Positivos'],
    ['19', 'Nelson Coimbra', '../RES/enfermagem_urgencia_emergencia.png', 'Este livro aborda a enfermagem no contexto de urgências e emergências, oferecendo uma abordagem prática para os profissionais da saúde que lidam com situações críticas e de alta pressão.', 34.90, 'Enfermagem de Urgência e Emergência'],
    ['19', 'Vários Autores', '../RES/manual_pratico_medico_orientador.png', 'Um manual essencial para médicos orientadores, fornecendo técnicas e orientações práticas para apoiar estudantes e profissionais da saúde em suas práticas clínicas e formativas.', 28.70, 'Manual Prático do Médico Orientador de Formação'],
    ['19', 'Vários Autores', '../RES/medicina_laboratorial.png', 'Este livro aborda os estados inflamatórios no contexto da medicina laboratorial, detalhando os exames, diagnósticos e tratamentos associados a essas condições.', 35.00, 'Medicina Laboratorial - Estados Inflamatórios'],
    ['19', 'Vários Autores', '../RES/psiquiatria_fundamental.png', 'Com uma abordagem abrangente, este livro aborda os conceitos fundamentais da psiquiatria, explorando as condições mentais mais comuns e suas implicações no tratamento dos pacientes.', 32.90, 'Psiquiatria Fundamental']

    //plano nacional de leitura
    ['20', 'Eric Carle', '../RES/a_lagartinha_muito_comilona.png', 'A história de uma lagarta que comeu vários alimentos ao longo de uma semana, ensinando os dias da semana e números de 1 a 10, enquanto mostra a transformação da lagarta em uma bela borboleta.', 15.90, 'A Lagartinha Muito Comilona'],
    ['20', 'Vários Autores', '../RES/eu_e_a_minha_avo.png', 'Este livro celebra a relação especial entre avós e netos, contando histórias com momentos de carinho e sabedoria que são passados de geração em geração.', 18.00, 'Eu e a Minha Avó'],
    ['20', 'Vários Autores', '../RES/eu_sou_eu_sei.png', 'Um livro educativo que incentiva as crianças a se conhecerem e a desenvolverem a autoestima, com histórias e atividades que ajudam a explorar suas próprias emoções e habilidades.', 20.50, 'Eu Sou, Eu Sei'],
    ['20', 'Vários Autores', '../RES/jardim_dos_pequeninos.png', 'Um livro interativo que apresenta um desfile de animais coloridos, ajudando as crianças a aprender sobre diferentes espécies e suas características de forma lúdica e divertida.', 16.75, 'Jardim dos Pequeninos - Desfile de Animais'],
    ['20', 'Vários Autores', '../RES/o_cao_de_milu.png', 'Uma história encantadora sobre a amizade e o cuidado entre um cachorro e seu dono, com lições sobre lealdade e companheirismo.', 17.30, 'O Cão de Milu']

    //politica
    ['21', 'Vários Autores', '../RES/a_verdade_vos_libertara.png', 'O livro reúne uma série de fotografias icônicas que documentam a política brasileira entre 2013 e 2023, com um olhar crítico sobre o governo de Jair Bolsonaro e os protestos sociais. A obra também inclui áudios, memes e uma análise visual da realidade política.', 25.90, 'A Verdade Vos Libertará'],
    ['21', 'Vários Autores', '../RES/autocracia_inc.png', 'Este livro examina o ascendente autoritarismo no Brasil e no mundo, com uma crítica às tendências políticas contemporâneas que ameaçam a democracia e os direitos humanos.', 22.00, 'Autocracia, Inc.'],
    ['21', 'Vários Autores', '../RES/eleicoes_partidos.png', 'A obra oferece uma análise profunda das eleições, dos partidos políticos e do sistema de representação política no Brasil, refletindo sobre a dinâmica da política nacional.', 19.90, 'Eleições, Partidos e Representação Política'],
    ['21', 'Vários Autores', '../RES/o_pais_dos_cucos.png', 'Este livro investiga as mazelas sociais e políticas do Brasil, explorando as narrativas e personagens que fazem parte da história recente do país.', 21.50, 'O País dos Cucos'],
    ['21', 'Vários Autores', '../RES/patriota.png', 'Com uma crítica afiada, o livro examina o conceito de patriotismo no Brasil e no mundo, refletindo sobre o significado de ser patriota em tempos de polarização política.', 23.00, 'Patriota']

    
    //religiao e moral
    ['22', 'Papa Francisco', '../RES/amou-nos.png', 'O Papa Francisco propõe um novo entendimento da devoção ao Sagrado Coração de Jesus, enfatizando o amor divino e humano e sua relevância na construção de um mundo mais amoroso e compassivo.', 6.30, 'Amou-nos'],
    ['22', 'Matthew R. Collins', '../RES/deus_ciencia_provas.png', 'O livro explora como a ciência moderna interage com conceitos teológicos, apresentando uma discussão sobre as provas da existência de Deus e a compatibilidade entre ciência e fé.', 22.00, 'Deus, a Ciência, as Provas'],
    ['22', 'Vários Autores', '../RES/envelho_diario.png', 'Este diário contém reflexões, orações e pensamentos para cada dia do ano de 2025, trazendo uma perspectiva espiritual e religiosa para o cotidiano.', 19.90, 'Envelho Diário 2025'],
    ['22', 'Vários Autores', '../RES/livro_tibetano.png', 'O Livro Tibetano dos Mortos oferece ensinamentos sobre a morte, o processo de renascimento e o caminho para a libertação espiritual, com base na tradição budista tibetana.', 18.50, 'O Livro Tibetano dos Mortos'],
    ['22', 'Vários Autores', '../RES/quatro_evangelhos.png', 'Os Quatro Evangelhos apresentam as narrações das vidas de Jesus Cristo conforme os apóstolos Mateus, Marcos, Lucas e João, destacando aspectos do ministério e ensinamentos do Cristo.', 25.00, 'Os Quatro Evangelhos']

    
    //saude e bem estar
    ['23', 'Jessie Inchauspé', '../RES/a_revolucao_da_glicose.png', 'Este livro explora como a glicose afeta a saúde de várias maneiras, desde o controle de peso até o humor, oferecendo estratégias para equilibrar os níveis de glicose e melhorar a saúde e o bem-estar.', 19.90, 'A Revolução da Glicose'],
    ['23', 'Dr. Neil Stanley', '../RES/dormir_e_fácil.png', 'Uma obra que desmistifica o sono, oferecendo dicas práticas e científicas para melhorar a qualidade do sono e garantir noites de descanso reparador.', 17.80, 'Dormir É Fácil'],
    ['23', 'Vários Autores', '../RES/energiza_te.png', 'O livro fornece técnicas e estratégias para aumentar a energia diária de forma natural, por meio de alimentação, exercícios e outros hábitos saudáveis.', 18.90, 'Energiza-te'],
    ['23', 'Vários Autores', '../RES/estamos_gravidos.png', 'Este livro aborda de forma leve e informativa o que esperar ao longo da gravidez, oferecendo conselhos sobre o que fazer, como se preparar e como lidar com as mudanças.', 22.50, 'Estamos Grávidos! E Agora?'],
    ['23', 'Vários Autores', '../RES/meno_que.png', 'O livro traz uma reflexão profunda sobre as dinâmicas de gênero e as transformações sociais, com foco nas questões femininas e suas representações na sociedade.', 16.40, 'Meno... Que']

    //vida pratica
    ['24', 'Maria Raquel', '../RES/agenda_maria_raquel_2025.png', 'Muito mais do que uma Agenda: Curiosidades, Contos, Etiqueta, Decoração do lar, Jogos, Anedotas, Culinária, Passatempos e Prémios, Elegância feminina e Conselhos de beleza.', 12.96, 'Agenda Maria Raquel 2025'],
    ['24', 'Vários Autores', '../RES/agenda_semanal_taylor_swift.png', 'Agenda com espaço para organizar a sua semana, personalizável com imagens e citações inspiradoras de Taylor Swift para cada dia.', 16.50, 'Agenda Semanal Taylor Swift'],
    ['24', 'Vários Autores', '../RES/como_ter_mais_dinheiro.png', 'O livro apresenta estratégias e dicas práticas para melhorar a gestão financeira pessoal e alcançar uma maior independência econômica.', 19.95, 'Como Ter Mais Dinheiro'],
    ['24', 'Vários Autores', '../RES/contas_poupanca_superar_inflacao.png', 'Explora como utilizar contas de poupança para se proteger contra a inflação e como maximizar os rendimentos mesmo em tempos de crise econômica.', 18.00, 'Contas Poupança: Como Superar a Inflação e Ganhar com a Crise'],
    ['24', 'Vários Autores', '../RES/multiplique_seu_dinheiro.png', 'Este livro ensina como multiplicar o seu dinheiro através de investimentos inteligentes e estratégias financeiras eficazes.', 21.80, 'Multiplique o Seu Dinheiro']

  ];


  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log(`${result.affectedRows} registros inseridos!`);
  });
});

con.connect(function(err) {
  if (err) throw err;
  

  // Inserindo múltiplos registros
  const sql = `INSERT INTO Favorito (id_utilizador, id_livro, dataAdicao) VALUES ?`;
  const values = [
    ['1', '50', '2024/11/21'],
    ['1', '55', '2024/11/21'],
    
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
  const sql = `INSERT INTO carrinho (id_utilizador, id_livro) VALUES ?`;
const values = [
    ['1', '2'] // Valores a serem inseridos
];

  con.query(sql, [values], function(err, result) {
    if (err) throw err;
    console.log(`${result.affectedRows} registros inseridos!`);
  });
});