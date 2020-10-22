var loginForm = document.getElementById("login");
var signupForm = document.getElementById("signup");
var slide = document.getElementById("btn");

function signup(){
    loginForm.style.left = "-400px";
    signupForm.style.left = '50px';
    slide.style.left = "110px"
}

function login(){
    loginForm.style.left = "50px";
    signupForm.style.left = '450px';
    slide.style.left = "0px"
}