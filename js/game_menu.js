const levels = document.querySelectorAll(".level");
const account = JSON.parse(localStorage[localStorage[currentAccount]]);
const idUnlockedLevel = account.currentLevel;

levels.forEach(level => {
    if (level.id != idUnlockedLevel)
    {
        level.classList.add("disable");

        if (level.id > idUnlockedLevel)
            level.children[0].classList.add("closed");
        else level.children[0].classList.add("done");
    }
});