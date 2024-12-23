const mainMenu = document.querySelector(".main_menu");

window.onload = function() {
    if (localStorage.getItem(currentAccount) !== null)
    {
        setUserData(JSON.parse(localStorage[localStorage[currentAccount]]));
        mainMenu.classList.add("display");   
    }
}

document.getElementById("checkbox").addEventListener("click", changeForm);

function changeForm()
{
    const login = document.getElementById("login_form");
    const signup = document.getElementById("signup_form");
    const msg = document.getElementById("message");

    login.classList.toggle("display");
    signup.classList.toggle("display");
    msg.classList.remove("display");

    clearInputs();
}

function clearInputs() 
{
    document.querySelectorAll("input").forEach(e => {
        e.value = "";
        e.classList.remove("uncorrect");
        
    });
    document.getElementById("message").innerHTML = "";
}

function writeMessage(msg, text) {
    msg.classList.remove("display");
    msg.innerHTML = text;
    msg.classList.add("display");
}

function setUserData(account)
{
    document.getElementById("icon").classList.add(`icon_${account.icon}`);
    document.getElementById("username").innerHTML = account.username;
    document.getElementById("reg").classList.toggle('display');
}

document.getElementById("btn-submit-login").addEventListener("click", (e) => {   
    e.preventDefault();

    let username = document.getElementById("username-login");
    let username_value = username.value.trim().toLowerCase();

    let password = document.getElementById("password-login");
    let msg = document.getElementById("message");

    if (localStorage.getItem(username_value) === null || username_value === currentAccount)
    {
        writeMessage(msg, "there is no such username");
        username.classList.add("uncorrect");
        password.classList.remove("uncorrect");
        password.value = "";
        return;
    }

    let account = JSON.parse(localStorage[username_value]);

    if (password.value !== account.password)
    {
        writeMessage(msg, "was entered an incorrect password");
        username.classList.remove("uncorrect");
        password.classList.add("uncorrect");
        password.value = "";
        return;
    }

    setUserData(account);
    mainMenu.classList.add("display");
    localStorage[currentAccount] = username_value;

    clearInputs();
});

document.getElementById("btn-submit-signup").addEventListener("click", (e) => {
    e.preventDefault();

    let username = document.getElementById("username-signup");
    let username_value = username.value.trim();

    let name, email, password = document.getElementById("password-signup"), data, msg = document.getElementById("message");

    if (localStorage.getItem(username_value) !== null || username_value == currentAccount)
    {
        writeMessage(msg, "this username already exists");
        username.classList.add('uncorrect');
        return;
    }

    if (password.value == "")
    {
        writeMessage(msg, "the password field is blank");
        password.classList.add('uncorrect');
        return;
    }

    name = document.getElementById("name-signup");
        email = document.getElementById("email-signup");
        password = document.getElementById("password-signup");

        data = {name: name.value, username: username_value, email: email.value, password: password.value, icon: Math.floor(Math.random() * 13) + 1, score: 0, currentLevel: 1};
        localStorage[username_value.toLowerCase()] = JSON.stringify(data);

        clearInputs();
        changeForm();
        document.getElementById("checkbox").checked = false;
        writeMessage(msg, "the account has been created")
});