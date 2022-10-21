const inpField = document.getElementById("input-field");
const text = document.querySelector(".wrapper p");
const countdown = document.getElementById("countdown");
const wpmEl = document.getElementById("wpm-el");
const mistakesEl = document.getElementById("mistakes-el");
const accuracyEl = document.getElementById("accuracy-el");
const timeEl = document.getElementById("time-taken-el");
const nextTestBtn = document.getElementById("next-test");

let timer;
let charIndex = 0;
let time = 60;
let mistakes = 0;
let isTyping = false;

function randomLyrics() {
  let randIndex = Math.floor(Math.random() * lyrics.length);
  lyrics[randIndex].split("").forEach((char) => {
    let spanTag = `<span>${char}</span>`;
    text.innerHTML += spanTag;
  });

  let firstChar = text.querySelectorAll("span")[0];
  firstChar.classList.add("active");

  document.addEventListener("keydown", () => inpField.focus());
  text.addEventListener("click", () => inpField.focus());
}

function initTimer() {
  if (time > 0) {
    time--;
    countdown.innerText = time;
  } else {
    clearInterval(timer);
    showResults();
  }

  time < 10 ? (countdown.innerText = `0${time}`) : (countdown.innerText = time);
}

function showResults() {
  document.querySelector(".content").style.display = "none";
  document.querySelector(".results").classList.add("active");

  let wpm = Math.round(((charIndex - mistakes) / 5 / (60 - time)) * 60);
  let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100);

  wpmEl.innerText = wpm;
  mistakesEl.innerText = mistakes;
  accuracyEl.innerText = accuracy;
  timeEl.innerText = 60 - time;
}

function initTyping(e) {
  let characters = text.querySelectorAll("span");
  let charTyped = inpField.value.split("")[charIndex];

  if (charIndex < characters.length - 1 && time > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (charTyped == null) {
      charIndex--;
      characters[charIndex].classList.remove(
        "correct",
        "incorrect",
        "incorrect__space"
      );
    } else {
      if (characters[charIndex].innerHTML === charTyped) {
        characters[charIndex].classList.add("correct");
      } else {
        characters[charIndex].classList.add("incorrect");
        mistakes++;

        if (
          characters[charIndex].innerHTML === " " &&
          characters[charIndex].classList.contains("incorrect")
        ) {
          characters[charIndex].classList.add("incorrect__space");
        }
      }
      charIndex++;
    }
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");
  } else {
    clearInterval(timer);
    showResults();
  }
}

function nextTest() {
  clearInterval(timer);
  charIndex = 0;
  mistakes = 0;
  time = 60;
  isTyping = false;
  text.innerHTML = "";
  inpField.value = "";
  randomLyrics();

  countdown.innerText = time;

  if (document.querySelector(".results").classList.contains("active")) {
    document.querySelector(".results").classList.remove("active");
    document.querySelector(".content").style.display = "block";
  }
}

randomLyrics();
inpField.addEventListener("input", initTyping);
nextTestBtn.addEventListener("click", nextTest);