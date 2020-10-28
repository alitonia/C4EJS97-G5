//----------Silder Button------------------------
var loginForm = document.getElementById("login");
var signupForm = document.getElementById("signup");
var slide = document.getElementById("btn");

function signupSlider() {
    loginForm.style.left = "-400px";
    signupForm.style.left = '50px';
    slide.style.left = "110px"
}

function loginSlider() {
    loginForm.style.left = "50px";
    signupForm.style.left = '450px';
    slide.style.left = "0px"
}


//-------- SignUp & LogIn Button --------------
let user;

function signUp() {
    let signupUsername = document.getElementById('signupUsername').value;
    let signupPassword = document.getElementById('signupPassword').value;

    if (localStorage.getItem(signupUsername) === null) {
        user = new User(signupUsername, signupPassword)
        localStorage.setItem(signupUsername, JSON.stringify(user))
        alert('Successfully signed up');
    } else {
        alert(`Username "${signupUsername}" has already existed`);
    };
};

function logIn() {
    let loginUsername = document.getElementById('loginUsername').value;
    let loginPassword = document.getElementById('loginPassword').value;

    let check = localStorage.getItem(loginUsername);
    console.log(check);
    
    if (check === null){
        alert(`Username "${loginUsername}" not existed`);
        return;
    }
    check = JSON.parse(check)
    if (loginUsername === check.userName && loginPassword === check.password){
        alert(`Successfully loged in`);
    } else {
        alert(`Wrong password entered`);
    };
};




