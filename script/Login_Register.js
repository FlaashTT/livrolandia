
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

    logEmail = document.getElementById("logEmail");
    logPass = document.getElementById("logPass");
    regEmail = document.getElementById("regEmail");
    regName = document.getElementById("regName");
    regPass = document.getElementById("regPass");
    forgotEmailInput = document.getElementById("forgotEmailInput");

    selecionarOP = document.getElementById("selecionarOP");
    campoLog = document.getElementById("campoLog");
    campoReg = document.getElementById("campoReg");
    forgotForm = document.getElementById("forgotForm");
    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");
    botaoReg = document.getElementById("registerBtn");
    botaoLog = document.getElementById("loginBtn");
    ForgotBtn = document.getElementById("ForgotBtn");

    botaoReg.addEventListener("click", processRegister);
    botaoLog.addEventListener("click", processLogin);

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



function cleanItens() {
    campoLog.reset();
    campoReg.reset();
}


function processRegister() {
    let email = regEmail.value,
        password = regPass.value,
        name = regName.value;

    if (verificarEmail(email)) {
        if (email !== "" && password !== "" && name !== "" && tipoUser) {
            fetch('http://localhost:3000/register', {  // Alterando para a rota /register
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, name, tipoUser })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Usuário registrado com sucesso! Faça login para continuar.");
                        trocarForm();  // Redirecionar para a página de login
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert("Preencha todos os campos!");
        }
    } else {
        alert("email Invalido!")
    }



}

function processLogin() {
    let email = logEmail.value,
        password = logPass.value;

    if (email && password) {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {

                    localStorage.setItem('userLogged', JSON.stringify(data.user));

                    const user = data.user;
                    alert("Bem-vindo " + user.name);
                    window.location.href = '../html/index.html'; // Redireciona para a página inicial
                } else {
                    alert(data.message); // Exibe mensagem de erro se as credenciais forem inválidas
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        alert("Preencha todos os campos!"); // Alerta se campos estiverem vazios
    }

}

function forgotEmail() {
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    forgotForm.classList.remove("hidden");

    ForgotBtn.addEventListener("click", function () {
        let forgEmail = forgotEmailInput.value;

        if (forgEmail) {
            fetch('http://localhost:3000/forgotPass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ forgEmail })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {

                        alert("Foi enviado um email para alterar palavra passe!");
                        loginForm.classList.remove("hidden");
                        forgotForm.classList.add("hidden");

                    } else {
                        alert(data.message); // Exibe mensagem de erro se as credenciais forem inválidas
                    }
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert("Preencha todos os campos!"); // Alerta se campos estiverem vazios
        }

    })



}

function verificarEmail(email) {
    let arr = [];
    emailValid = false;

    // Divide o endereço de email em duas partes utilizando o símbolo "@" como delimitador
    arr = email.split("@");

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