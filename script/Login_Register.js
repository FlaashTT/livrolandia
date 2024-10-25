
// Variáveis para os elementos do HTML
const container = document.querySelector(".container");
const pwShowHide = document.querySelectorAll(".showHidePw");
const pwFields = document.querySelectorAll(".password");
const signUp = document.querySelector(".signup-link");
const login = document.querySelector(".login-link");
const navbarRight = document.querySelector('.nav-right');

window.onload = function(){
    botaoReg = document.getElementById("ButtonReg") ;

    botaoReg.addEventListener("click",processRegister);
}



function processRegister(){
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