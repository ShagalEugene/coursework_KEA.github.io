let accounts = []
for(let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key != currentAccount)
        accounts.push(JSON.parse(localStorage[key]));
}

accounts.sort(function (a, b) {
    return b.score - a.score;
});

for (let i = 1; i <= Math.min(accounts.length, 3); i++)
{
    const user = accounts[i-1];
    let nameOfPlace;
    switch (i)
    {
        case 1:
            nameOfPlace = "first";
            break;
        case 2:
            nameOfPlace = "second";
            break;
        case 3:
            nameOfPlace = "third";
            break
    }

    const place = document.getElementById(nameOfPlace);

    place.children[0].style.backgroundImage = `url(../svg/icons/${user.icon}.svg)`;
    place.children[1].innerHTML = user.username;
    place.children[2].innerHTML = user.score;
}

function findByName()
{
    for (let i = 0; i < accounts.length; i++)
        if (accounts[i].username == localStorage[currentAccount])
            return i + 1;
}

const ourPosition = document.querySelector(".ourPosition");
ourPosition.innerHTML = `${findByName()} / ${accounts.length}`;