
window.onload = function(){
    botaoReg = document.getElementById("ButtonReg") ;

    botaoReg.addEventListener("click",processRegister);
}



function processRegister(){
    console.log("ola");
    window.location.href = '..//html/index.html';
}