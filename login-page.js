//----------Silder Button------------------------
var loginForm = document.getElementById("login");
var signupForm = document.getElementById("signup");
var slide = document.getElementById("btn");

function signupSlider() {
    loginForm.style.left = "-600px";
    signupForm.style.left = '75px';
    slide.style.left = "165px"
}

function loginSlider() {
    loginForm.style.left = "75px";
    signupForm.style.left = '675px';
    slide.style.left = "0px"
}


//-------- SignUp & LogIn Button --------------
let user;

function signUp() {
    let signupUsername = document.getElementById('signupUsername').value;
    let signupPassword = document.getElementById('signupPassword').value;

    if (localStorage.getItem(signupUsername) === null && isValid(signupUsername) && signupPassword.length >= 8) {
        console.log(isValid(signupUsername));
        user = new User(signupUsername, signupPassword)
        localStorage.setItem(signupUsername, JSON.stringify(user))
        alert('Successfully signed up');
    } else if (!isValid(signupUsername)) {
        alert('Username must contain only characters, numeric digits and underscore!')
    } else if (signupPassword.length < 8){
        alert('Password must contains at least 8 characters')
    } else {
        alert(`Username "${signupUsername}" has already existed`);
    };
};

function logIn() {
    let loginUsername = document.getElementById('loginUsername').value;
    let loginPassword = document.getElementById('loginPassword').value;

    let check = localStorage.getItem(loginUsername);
    
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


function isValid(name) {
    const VALID_NAME_REGEX = /^[a-zA-Z\w\s]+$/;
    return name.match(VALID_NAME_REGEX);
}



