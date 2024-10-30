// 1. Requisitos Funcionais

// RF1: O site deve permitir o cadastro de animais disponíveis para adoção, incluindo fotos, descrição, idade, e características (cão/gato, tamanho, etc.).

// RF2: Implementar uma seção para cadastro de interessados na adoção, onde as pessoas possam preencher um formulário online. -- feito

// RF3: Oferecer uma área para doações, com integração a meios de pagamento (cartão de crédito, boleto, Pix). -- feito

// RF4: Incluir uma seção para voluntários se inscreverem e informarem disponibilidade para ajudar (passeios com os animais, resgates, etc.). -- feito

// RF5: Disponibilizar informações sobre a ONG, como história, missão, e eventos futuros (ex: feiras de adoção).

// RF6: Um painel de administração para que a equipe da ONG possa gerenciar os animais, doadores e voluntários (acesso restrito por login e senha). -- feito

// RF7: Implementar um sistema de notificações por e-mail para interessados em adoção e voluntários sobre novos animais e eventos. -- feito



const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inter2024.2'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar: ' + err.stack);
        return;
    }
    console.log('Conectado como id ' + connection.threadId);
});

const app = express()

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.listen(3000, () => { 
    console.log("Server running on port 3000");
})

app.get("/animais", (req, res) => {
    connection.query('SELECT * FROM animais', [], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        res.send(results);
    });
});

// Rota para processar o formulário
app.post('/cadastroFuncionario', (req, res) => {
    const cpf = req.body.cpf;
    const nome = req.body.nome;
    const email = req.body.email;
    const telefone = req.body.telefone;
    const mensagem = req.body.mensagem;


    connection.query('SELECT * FROM voluntarios WHERE cpf = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        if (results[0]) {
            res.send("Ja temos um voluntário com esse cpf!");
            return
        }
    });

    connection.query('INSERT INTO voluntarios (cpf,nome,email,telefone,`desc`) VALUES(?,?,?,?,?)', [cpf,nome,email,telefone,mensagem], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        res.send("Você se cadastrou com sucesso");
    });
});

// Rota para processar o formulário
app.post('/cadastroDoacao', (req, res) => {
    const cpf = req.body.cpf;
    const tipo = req.body.tipo;
    const valor = req.body.valor;

    connection.query('INSERT INTO doacoes (cpf,tipo,valor) VALUES(?,?,?)', [cpf,tipo,valor], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        res.send("Você doou com sucesso");
    });
});

app.post('/login', (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    connection.query('SELECT * FROM funcionarios WHERE user = ?', [usuario,senha], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        if (results[0].password == senha) {
            res.send("Você entrou!");

        } else {
            res.send("Usuario e/ou senha incorretos!");
        }
    });
});

app.post('/getDoacao', (req, res) => {

    connection.query('SELECT * FROM doacoes', [], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        res.send(results);
    });
});

app.post('/getVoluntarios', (req, res) => {

    connection.query('SELECT * FROM voluntarios', [], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        res.send(results);
    });
});
const dadosEmailEmpresa = {
    "email":'patinhasdoamor.noreply@gmail.com',
    "senha":'ugvr ywnd orhy hmxk',
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: dadosEmailEmpresa.email,
        pass: dadosEmailEmpresa.senha
    }
});

app.post('/sentEmail', (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const mensagem = req.body.mensagem;
    let mailOptions = {
        from: dadosEmailEmpresa.email,
        to: email,
        subject: 'Agradeçemos pelo seu contato!',
        text: "Boa tarde Sr(a). "+nome+"\nGostariamos de informar que recebemos seu email e iremos te responder o mais rápido possivel!"
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send("algo deu errado!");
        } else {
            res.send("Suas informações de contato foram enviadas!");
        }
    });
    
});


app.post('/cadastrarAnimal', (req, res) => {
    const nome = req.body.nome;
    const desc = req.body.desc;
    const idade = req.body.idade;
    const caracteristicas = req.body.caracteristicas;
    const foto = req.body.foto;
    connection.query('INSERT INTO animais (nome,descricao,idade,caracteristicas,foto) VALUES(?,?,?,?,?)', [nome,desc,idade,caracteristicas,foto], (error, results) => {
        if (error) {
            console.error('Erro na consulta: ', error);
            return;
        }
        res.send("Você cadastrou o animal com sucesso!");
    });
});