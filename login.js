//----------Silder Button------------------------
var loginForm = document.getElementById("login");
var signupForm = document.getElementById("signup");
var slide = document.getElementById("btn");

function signupSlider() {
    loginForm.style.left = "-600px";
    signupForm.style.left = '75px';
    slide.style.left = "155px";
    $('.error-alert').text("");
}

function loginSlider() {
    loginForm.style.left = "75px";
    signupForm.style.left = '675px';
    slide.style.left = "-5px";
    $('.error-alert').text("");
}

//-------- SignUp & LogIn Button --------------
function signUp() {
    let signupUsername = document.getElementById('signupUsername').value;
    let signupPassword = document.getElementById('signupPassword').value;

    if (signupUsername.length === 0 || signupPassword.length === 0) {
        $('#signupUsername').addClass("error-alert-border");
        $('.signup-alert').css('color', 'rgb(223, 106, 106)');
        $('.signup-alert').text(`User name and password must be provided!`);
    }
    else if (signupPassword.length < 6) {
        $('#signupPassword').addClass("error-alert-border");
        $('.signup-alert').css('color', 'rgb(223, 106, 106)');
        $('.signup-alert').text(`Password must contains at least 6 characters`);
    }
    else if (localStorage.getItem(signupUsername)) {
        $('#signupUsername').addClass("error-alert-border");
        $('.signup-alert').css('color', 'rgb(223, 106, 106)');
        $('.signup-alert').text(`User name "${signupUsername}" already exists!`);
    }
    else if (!isValidUsername(signupUsername)) {
        $('#signupUsername').addClass("error-alert-border");
        $('.signup-alert').css('color', 'rgb(223, 106, 106)');
        $('.signup-alert').text(`User name must contain only characters, numeric digits and/or underscore!`);
    }
    else {
        let user = new User(signupUsername, signupPassword);
        localStorage.setItem(signupUsername, JSON.stringify(user));
        $('#loginUsername').val(`${signupUsername}`);
        $('#loginPassword').focus();
        setTimeout(() => loginSlider(), 1000)
        $('.signup-alert').css('color', 'green');
        $('.signup-alert').text("Sign up successfully!");
    };
};

function logIn() {
    let loginUsername = document.getElementById('loginUsername').value;
    let loginPassword = document.getElementById('loginPassword').value;

    if (loginUsername.length === 0 || loginPassword.length === 0){
        $('.login-alert').text(`User name or password is missing!`);
        $('.login-alert').css('color', 'rgb(223, 106, 106)');
    }
    else {
        let userJSON = localStorage.getItem(loginUsername);
        if (!userJSON) {
            $('#loginUsername').addClass("error-alert-border");
            $('.login-alert').css('color', 'rgb(223, 106, 106)');
            $('.login-alert').text(`User name "${loginUsername}" not existed!`);
        } else {
            let user = JSON.parse(userJSON);
            if (loginUsername === user.userName && loginPassword === user.password) {
                localStorage.setItem('currentUser', userJSON);
                window.location = "main.html";
            } else {
                $('#loginPassword').addClass("error-alert-border");
                $('.login-alert').css('color', 'rgb(223, 106, 106)');
                $('.login-alert').text(`Incorrect password!`);
            };
        }
    }
};

//----------------------------------------------------------------------
function isValidUsername(name) {
    const VALID_NAME_REGEX = /^[\w]+$/;
    return name.match(VALID_NAME_REGEX);
}

$('#signupUsername').keyup(function (e) {
    let signupUsername = document.getElementById('signupUsername').value;

    if (!isValidUsername(signupUsername)) {
        $('#signupUsername').addClass("error-alert-border");
        $('.signup-alert').css('color', 'rgb(223, 106, 106)');
        $('.signup-alert').text(`User name must contain only characters, numeric digits and/or underscore!`);
    }
    else {
        $('#signupUsername').removeClass("error-alert-border");
        $('.signup-alert').text("");
    }
})

$('#signupPassword').keyup(function (e) {
    let signupPassword = document.getElementById('signupPassword').value;
    if (signupPassword.length >= 6) {
        $('#signupPassword').removeClass("error-alert-border");
        $('.signup-alert').text("");
    }
})

$('.toggle-btn').click(function () {
    $('#signupUsername').removeClass("error-alert-border");
    $('.signup-alert').text("");
    $('#signupPassword').removeClass("error-alert-border");
    $('.signup-alert').text("");
    $('#signupUsername').val('');
    $('#signupPassword').val('');
    $('#loginUsername').removeClass("error-alert-border");
    $('.login-alert').text("");
    $('#loginPassword').removeClass("error-alert-border");
    $('.login-alert').text("");
    $('#loginUsername').val('');
    $('#loginPassword').val('');
})