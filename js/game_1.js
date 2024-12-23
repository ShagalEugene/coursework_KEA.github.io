const btnStart = document.querySelector(".start");
const attemptsBlock = document.querySelector(".attempts");
const answerPlace = document.querySelector(".setAnswer");
const scoreBlock = document.querySelector(".score");
const wdt = 20, pct = 0, clr = "rgb(255, 255, 255)";
const loadBlock = document.querySelector(".loading");
const levelBlock = document.querySelector(".lvl");
const descriptionBlock = document.querySelector(".description_game");
const totalAttempts = 3;
const timeBlock = document.querySelector(".time");
const btnRestart = document.querySelector(".restart");

const paths = [
  "M8, 56 C8, 33, 25, 16, 48, 16 L200, 96 C200, 96, 248, 100, 248, 56 C248, 56, 250, 20, 200, 16 L48, 96 C25, 96, 8, 78, 8, 56 Z",
  "M8,56 C8,33 25,16 48,16 C70,16 88,33 88,56 C88,78 105,92 128,92 C150,92 160,72 160,56 C160,40 148,24 128,24 C108,24 96,40 96,56 C96,72 105,92 128,92 C154,93 168,78 168,56 C168,33 185,16 208,16 C230,16 248,33 248,56 C248,78 230,96 208,96 L48,96 C25,96 8,78 8,56 Z",
  "M8, 56 C8, 33, 25, 16, 48, 16 L 200, 16 C230, 16, 248, 33, 248, 56 C248, 78, 230, 96, 208, 96 L48, 96 C25, 96, 8, 78, 8, 56 Z"
];

var start, end;

let begin = Math.random() * 100;
let curAttempt = 1;
let curWidth = wdt, curPct = pct, isLoaded = false;


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
  document.querySelector('.square')
);

btnStart.addEventListener("click", () => {
  btnStart.disabled = true;
  attemptsBlock.innerHTML = `${totalAttempts - curAttempt++} / ${totalAttempts}`;
  timeBlock.style.filter = 'blur(10px)';
  var i = begin, id = setInterval(frame, 1);
  var iteration = 0, end_it = Math.floor(Math.random() * 1250 + 250);
  start = performance.now();

  function frame() {
    i = (i + 0.05) % 100; 
    follower(i);   
    iteration++;  
    timeBlock.innerHTML = ((performance.now() - start)/1000).toFixed(3);
    if (iteration == end_it) 
    {
      clearInterval(id);   
      end = performance.now();
      window.dialog.showModal();
      begin = i;
    }
  }
})

answerPlace.addEventListener("submit", (e) => {
  const inputTime = e.target.querySelector(".input_time");
  timeComparison(inputTime.value * 1000);
  inputTime.value = "";
  isGameEnded();
})

dialog.addEventListener("keydown", (e) => { 
  if (e.key === "Escape")
  {
    e.preventDefault();
  }
});

function timeComparison(userTime) {
  const rightTime = end - start;
  const scoreValue = parseFloat(scoreBlock.innerHTML);
  const curScore = Math.pow(Math.E, -Math.pow((userTime - rightTime)/1000, 2)) * 100;

  scoreBlock.innerHTML = (scoreValue + curScore).toFixed(0);
} 

function isGameEnded() {
  timeBlock.style.filter = 'blur(0px)';
  if (curAttempt <= totalAttempts)  
  {
    btnStart.disabled = false;
  }      
  else setTimeout(endGame, 2000);
}

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && !isLoaded)
    {
        if (curWidth > 200) 
        {
            levelBlock.classList.toggle("display");
            descriptionBlock.classList.toggle("display");
            follower(begin);
            isLoaded = true;
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
 
function endGame()
{
  levelBlock.classList.toggle("display");

  const result = document.querySelector(".result");
  result.classList.toggle("display");
  result.innerHTML = scoreBlock.innerHTML;
  const scoreNum = parseInt(result.innerHTML);

  if (scoreNum >= 100)
  {
    let account = JSON.parse(localStorage[localStorage[currentAccount]]);
    account.score += scoreNum;

    account.currentLevel = Math.max(account.currentLevel, 2);
    localStorage[localStorage[currentAccount]] = JSON.stringify(account);
    result.classList.toggle("good");
  } else 
  {
    result.classList.toggle("bad");
    btnRestart.classList.toggle("display_restart");
  }

}

document.querySelector(".restart").addEventListener("click", () => { window.location.reload(); });