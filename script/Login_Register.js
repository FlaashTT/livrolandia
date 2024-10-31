let users = [];

let container, pwShowHide, pwFields, signUp, loginnavbarRight;

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
    botaoReg = document.getElementById("ButtonReg");

   // botaoReg.addEventListener("click", processRegister);
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


function trocaForm() {
    console.log("ola")
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