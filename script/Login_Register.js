let users = [];

let container, pwShowHide, pwFields, signUp, loginnavbarRight,loginForm,registerForm,campoLog,campoReg,selecionarOP,
regName,regEmail,regPass,tipoUser;

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

   
    regEmail = document.getElementById("regEmail");
    regName = document.getElementById("regName");
    regPass = document.getElementById("regPass");

    selecionarOP = document.getElementById("selecionarOP");
    campoLog = document.getElementById("campoLog")
    campoReg = document.getElementById("campoReg")
    loginForm = document.getElementById("loginForm"),
    registerForm = document.getElementById("registerForm"),
    botaoReg = document.getElementById("registerBtn");

   botaoReg.addEventListener("click", processRegister);

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


function User(name, email, password, tipoUser) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.tipoUser = tipoUser;
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

function loadUsers(){
    let storedUser = localStorage.getItem('users');

    if(storedUser != null){
        users = JSON.parse(storedUser);
        users = users.map(user => new User(user.name,user.email,user.password,user.tipoUser))
    }else{
        users.push(new User ("Admin","admin@gmail.com","admin","ambos"));
        users.push(new User ("Joao Pinto","admin@gmail.com","joao123","vendedor"));
        users.push(new User ("Joana Pinho","admin@gmail.com","joana123","comprador"));
        saveUsers();

    }
}

function saveUsers(){
    localStorage.setItem('users',JSON.stringify(users));
}

function cleanItens() {
    campoLog.reset();
    campoReg.reset();
}

function processRegister(){
    if(regName.value != "" && regEmail.value != "" && regPass.value != "" && tipoUser != null ){
        console.log("valido")
    }else{
        console.log("invalido")
    }
    

    
}

function processLogin(){

}