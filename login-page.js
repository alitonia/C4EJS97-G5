//----------Silder Button------------------------
var loginForm = document.getElementById("login");
var signupForm = document.getElementById("signup");
var slide = document.getElementById("btn");

function signupSlider() {
    loginForm.style.left = "-600px";
    signupForm.style.left = '75px';
    slide.style.left = "165px";
    $('.error-alert').text("");
}

function loginSlider() {
    loginForm.style.left = "75px";
    signupForm.style.left = '675px';
    slide.style.left = "0px";
    $('.error-alert').text("");
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
        loginSlider();
    };
};

function logIn() {
    let loginUsername = document.getElementById('loginUsername').value;
    let loginPassword = document.getElementById('loginPassword').value;

    let check = localStorage.getItem(loginUsername);
    
    if (check === null){
        $('#loginUsername').addClass("error-alert-border");
        $('.error-alert').text(`Username "${loginUsername}" not existed`);    
        
    } else {
        check = JSON.parse(check)
        if (loginUsername === check.userName && loginPassword === check.password){
            alert(`Successfully loged in`);
        } else {
            $('#loginPassword').addClass("error-alert-border");
            $('.error-alert').text(`Wrong password entered`);
        };
    }  
};


function isValid(name) {
    const VALID_NAME_REGEX = /^[a-zA-Z\w\s]+$/;
    return name.match(VALID_NAME_REGEX);
}

$('#signupUsername').keyup(function (e) {
    let signupUsername = document.getElementById('signupUsername').value;

    if (localStorage.getItem(signupUsername)) {
        $('#signupUsername').addClass("error-alert-border");
        $('.error-alert').text(`Username ${signupUsername} already exists!`);
    }
    else if (signupUsername.length === 0) {
        $('#signupUsername').addClass("error-alert-border");
        $('.error-alert').text(`An username must be provided!`);
    }
    else if (!isValid(signupUsername)) {
        $('#signupUsername').addClass("error-alert-border");
        $('.error-alert').text(`Username must contain only characters, numeric digits and underscore!`);
    }
    else {
        $('#signupUsername').removeClass("error-alert-border");
        $('.error-alert').text("");
    }
})


$('#signupPassword').keyup(function (e) {
    let signupPassword = document.getElementById('signupPassword').value;

    if (signupPassword.length < 8) {
        $('#signupPassword').addClass("error-alert-border");
        $('.error-alert').text(`Password must contains at least 8 characters`);
    }
    else {
        $('#signupPassword').removeClass("error-alert-border");
        $('.error-alert').text("");
    }
})

$('#loginUsername').keyup(function (e) {
    $('#loginUsername').removeClass("error-alert-border");
    $('.error-alert').text("");
})

$('#loginPassword').keyup(function (e) {
    $('#loginPassword').removeClass("error-alert-border");
    $('.error-alert').text("");
})


