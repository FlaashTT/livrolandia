let users = [];

let container, pwShowHide, pwFields, signUp, loginnavbarRight, loginForm, registerForm, campoLog, campoReg, selecionarOP,
    regName, regEmail, regPass, logEmail, logPass, tipoUser;

// Variáveis para os elementos do HTML
container = document.querySelector(".container"),
    pwShowHide = document.querySelectorAll(".showHidePw"),
    pwFields = document.querySelectorAll(".password"),
    signUp = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link"),

    navbarRight = document.querySelector('.nav-right');


window.onload = function () {
    localStorage.removeItem('userLogged');
    loadUsers();

    logEmail = document.getElementById("logEmail");
    logPass = document.getElementById("logPass");
    regEmail = document.getElementById("regEmail");
    regName = document.getElementById("regName");
    regPass = document.getElementById("regPass");

    selecionarOP = document.getElementById("selecionarOP");
    campoLog = document.getElementById("campoLog");
    campoReg = document.getElementById("campoReg");
    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");
    botaoReg = document.getElementById("registerBtn");
    botaoLog = document.getElementById("loginBtn");

    botaoReg.addEventListener("click", processRegister);
    botaoLog.addEventListener("click",processLogin);

    selecionarOP.addEventListener("change", function () {
        let selectedValue = selecionarOP.value;
        switch (selectedValue) {
            case "opcao1":
                tipoUser = "comprador";
                break;
            case "opcao2":
                tipoUser = "vendedor";
                break;
            case "opcao3":
                tipoUser = "ambos";
                break;

        }
    });
}


function User(name, email, password, tipoUser, verfAdmin) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.tipoUser = tipoUser;
    this.verfAdmin = verfAdmin
}

User.prototype = {
    getName: function () {
        return this.name;
    },
    getEmail: function () {
        return this.email;
    },
    getPassword: function () {
        return this.password;
    },
    getTipoUser: function () {
        return this.tipoUser;
    },
    getVerfAdmin: function () {
        return this.verfAdmin;
    }
};


function trocarForm() {
    if (loginForm.classList.contains("hidden")) {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        cleanItens();
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        cleanItens();
    }
}

function processRegister() {
    console.log("ola");
    window.location.href = '..//html/index.html';
}

// Adicionando evento de clique para mostrar/ocultar senha
pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach(pwField => {
            if (pwField.type === "password") {
                pwField.type = "text";
                eyeIcon.classList.replace("ri-eye-off-fill", "ri-eye-fill");
            } else {
                pwField.type = "password";
                eyeIcon.classList.replace("ri-eye-fill", "ri-eye-off-fill");
            }
        });
    });
});

function loadUsers() {
    let storedUser = localStorage.getItem('users');

    if (storedUser != null) {
        users = JSON.parse(storedUser);
        users = users.map(user => new User(user.name, user.email, user.password, user.tipoUser, user.verfAdmin))
    } else {
        users.push(new User("Admin", "admin@gmail.com", "admin", "ambos", "true"));
        users.push(new User("Joao Pinto", "admin@gmail.com", "joao123", "vendedor", "false"));
        users.push(new User("Joana Pinho", "admin@gmail.com", "joana123", "comprador", "false"));
        saveUsers();

    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function cleanItens() {
    campoLog.reset();
    campoReg.reset();
}

function processRegister() {
    if (regName.value != "" && regEmail.value != "" && regPass.value != "" && tipoUser != null) {
        if (regName.value === "admin") {
            alert("Nome invalido!");
        } else {
            for (let i = 0; i < users.length; i++) {
                if (users[i].getEmail() === regEmail.value) {
                    alert("Email ja utilizado!");
                    break;
                }
            }
            if (verificarEmail(regEmail.value)) {
                users.push(new User(regName.value, regEmail.value, regPass.value, tipoUser, "false"));
                saveUsers();
                trocarForm();
            } else {
                alert("Endereço email incorreto");
            }

        }
    } else {
        alert("Dados invalidos,preencha os dados todos");
    }



}

function processLogin() {
    let loggedInUser = null;
    if (logEmail.value != "" && logPass.value != "") {
        for (let i = 0; i < users.length; i++) {
            if (logEmail.value === users[i].getEmail()) {
                if (logPass.value === users[i].getPassword()) {
                    loggedInUser = users[i];

                    localStorage.setItem('userLogged', JSON.stringify(loggedInUser));
                    alert("Bem vindo " + users[i].getName());
                    window.location.href = '../html/index.html';
                    break;
                } else {
                    alert("Credenciais invalidas")
                }
            } else {
                alert("Email inexistente")
            }
        }
    } else {
        alert("preencha todos os campos!")
    }

}

function forgotEmail(){
    if(forgEmail.value != "" || verificarEmail(forgEmail.value)){
        for(let i =0;i<users.length;i++){
            if(users[i].getEmail() === forgEmail.value){
                alert ("Foi enviado um email para alterar palavra passe!");
                
                //falta codigo para voltar ao login 
            }else{
                alert("Email não existente")
            }
        }
    }else{
        alert("Insira um email valido")
    }
}

function verificarEmail(emailreg) {
    let arr = [];
    emailValid = false;

    // Divide o endereço de email em duas partes utilizando o símbolo "@" como delimitador
    arr = emailreg.split("@");

    if (arr.length === 2) { // O endereço deve conter um único "@"
        if (arr[0].length !== 0 && arr[1].length >= 2) { // À esquerda do "@" deve haver algum dado e à direita pelo menos dois caracteres
            // Processa a parte direita do endereço de email
            arr = arr[1].split(".");
            if (arr.length >= 2) { // Deve haver pelo menos um "." na parte direita
                emailValid = true;
                // Verifica cada parte separada pelo ponto
                arr.forEach(function (item) {
                    if (item.length === 0) { // Se alguma das partes tiver comprimento zero, o email é inválido
                        emailValid = false;
                    }
                });
            }
        }
    }
    return emailValid;
}