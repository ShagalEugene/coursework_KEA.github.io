const answerPlace = document.querySelector(".setAnswer");
const car = document.querySelector(".square");
const btnStart = document.querySelector(".start");
const scoreBlock = document.querySelector(".score");
const totalAttempts = 3;
const attemptsBlock = document.querySelector(".attempts");
const lvl = document.querySelector(".lvl");
const btnRestart = document.querySelector(".restart");
const inputTime = document.querySelector(".input_time");

paths = [
  "M8,56 C8,33,25,16,48,16 C48,16,105,16,108,66 C108,66,105,106,250,26",
  "M8,56 C8,33,25,16,48,86 C108,66,105,106,100,26 C100,26,105,6,250,26",
  "M8,56 C8,56,0,106,48,86 C108,66,105,106,120,66 C120,26,165,56,250,26"
];


function createPathFollower(svg, path, el) {
    const tl = path.getTotalLength();
    
    return function(pct) {
      const rect = svg.getBoundingClientRect();
      const l = pct / 100 * tl;
   
      const p0 = path.getPointAtLength(l - 1 >= 1 ? l - 1 : 0);
      const p1 = path.getPointAtLength(l + 1);
      const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
   
      let p = path.getPointAtLength(l);
      p = p.matrixTransform(svg.getScreenCTM());
      p.x = p.x - rect.left;
      p.y = p.y - rect.top;

      el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${radToDegree(angle) + 90}deg)`;
    }
}

function radToDegree(rad) {
  return rad * 180 / Math.PI;
}

document.querySelector('svg path').setAttribute("d", paths[parseInt(Math.random() * (paths.length - 0.01))]);

const follower = createPathFollower(
  document.querySelector('svg'),
  document.querySelector('svg path'),
  car
);

const wdt = 20, pct = 0, clr = "rgb(255, 255, 255)";
const loadBlock = document.querySelector(".loading");
let curWidth = wdt, curPct = pct, isLoaded = false, begin = generateBegin();
let curAttempt = 1;
follower(begin);

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && !isLoaded)
    {
        if (curWidth > 200) 
        {
            document.querySelector(".lvl").classList.toggle("display");
            document.querySelector(".description_game").classList.toggle("display");
            isLoaded = true;
            follower(begin);
        }

        curWidth *= 1.1;
        curPct += 0.05;
        loadBlock.style.width = `${curWidth}%`;
        loadBlock.style.backgroundColor = `rgb(80, 226, 51, ${curPct})`;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key == "Enter")
    {
        curWidth = wdt;
        curPct = pct;
        loadBlock.style.backgroundColor = clr;
        loadBlock.style.width = `${curWidth}%`;
    }
});


document.addEventListener('keydown', (event) => {
  if (event.key === "Escape") event.preventDefault();
});

answerPlace.addEventListener("submit", (e) => {
  let start = performance.now();
  let id = setInterval(moveCar, 10);
  let i = begin;
  const score = parseInt(scoreBlock.innerHTML);

  function moveCar()
  {
    i = i + 0.25;
    if (i >= 100)
    {
      car.classList.toggle("falling");
      scoreBlock.innerHTML = `${score}`;
      clearInterval(id);
      setTimeout(anotherAttempt, 500);
    }
    else if (performance.now() - start >= inputTime.value * 1000) 
    {
        clearInterval(id);
        anotherAttempt();
    }
    else {
      follower(i);
      scoreBlock.innerHTML = `${(score + getScore(i)).toFixed(0)}`;
    }
  }
});

function getScore(i) {
  return (i - begin) / (100 - begin) * 100;
}

function anotherAttempt()
{
  attemptsBlock.innerHTML = `${totalAttempts - curAttempt++} / ${totalAttempts}`;

  if (curAttempt <= totalAttempts)
  {
    begin = generateBegin();
    btnStart.disabled = false;
  }
  else
  {
    endGame();
  }
}

btnStart.addEventListener("click", (e) => {
  btnStart.disabled = true;
  inputTime.value = "";
  setTimeout(follower(begin), 500);
  car.classList.remove("falling");
  setTimeout(show, 2000);

  btnStart.innerHTML = "Продолжить";
});

function generateBegin()
{
  return Math.random() * 90;
}

function show()
{
  window.dialog.showModal();
}

function endGame()
{
  lvl.classList.toggle("display");

  const result = document.querySelector(".result");
  result.classList.toggle("display");
  result.innerHTML = scoreBlock.innerHTML;
  const scoreNum = parseInt(result.innerHTML);

  if (scoreNum >= 100)
  {
    let account = JSON.parse(localStorage[localStorage[currentAccount]]);
    account.score += scoreNum;

    account.currentLevel = Math.max(account.currentLevel, 3);
    localStorage[localStorage[currentAccount]] = JSON.stringify(account);
    result.classList.toggle("good");
  } else 
  {
    result.classList.toggle("bad");
    btnRestart.classList.toggle("display_restart");
  }
}

document.querySelector(".restart").addEventListener("click", () => { window.location.reload(); });