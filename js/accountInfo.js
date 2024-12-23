const currentAccount = "current";

window.onload = function() {
    if (localStorage.getItem(currentAccount) !== null)
    {
        setUserData(JSON.parse(localStorage[localStorage[currentAccount]]));
    }
}

function setUserData(account)
{
    document.getElementById("icon").classList.add(`icon_${account.icon}`);
    document.getElementById("username").innerHTML = account.username;
}

function changeUserMenu() {
    document.querySelector("nav").classList.toggle("opacity");
    document.querySelector("nav").classList.toggle("top");
    document.getElementById("user").classList.toggle("active_user");
};

document.getElementById("user").onblur = function() {
    setTimeout(changeUserMenu, 200);
};
document.getElementById("user").onclick = changeUserMenu; 

document.getElementById("clear").addEventListener("click", () => {
    localStorage.clear();
    if (window.location.href.includes("/index.html")) window.location.reload();
    else window.location.replace("../index.html");
});

document.getElementById("exit").addEventListener("click", () => {
    localStorage.removeItem(currentAccount);
    // if (window.location.href.includes("/index.html")) window.location.reload();
    // else window.location.replace("../index.html");
    try {
        window.location.replace("../index.html");
    }
    catch {
        window.location.replace("index.html");
    }
});
