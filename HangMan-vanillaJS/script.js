const wordDisplay = document.querySelector(".wort-anzeige");
const keyboardDiv = document.querySelector(".tastatur");
const hangmanImage = document.querySelector(".galgenmännchen-box img");
const guessesText = document.querySelector(".falsche-buchstaben-text b");
const gameModal = document.querySelector(".spiel-modal");
const playAgainBtn = document.querySelector(".neu-spielen");
const timerDisplay = document.querySelector(".timer");

/*const codingQuiz = [
  {
    word: "Variable",
    hint: "Ein Platzhalter für einen Wert."
  },
  {
    word: "Funktion",
    hint: "Ein Block von Code, der eine bestimmte Aufgabe ausführt."
  },
  {
    word: "Schleife",
    hint: "Eine Programmstruktur, die eine Sequenz von Anweisungen wiederholt, bis eine bestimmte Bedingung erfüllt ist."
  },
  {
    word: "Array",
    hint: "Eine Datenstruktur, die eine Sammlung von Elementen speichert."
  },
  {
    word: "Boolescher Wert",
    hint: "Ein Datentyp, der einen von zwei Werten haben kann: true oder false."
  },
  {
    word: "Bedingung",
    hint: "Eine Anweisung, die einen Block von Code ausführt, wenn eine bestimmte Bedingung wahr ist."
  },
  {
    word: "Parameter",
    hint: "Eine Variable in einer Methodendefinition."
  },
  {
    word: "Algorithmus",
    hint: "Ein schrittweises Verfahren oder eine Formel zur Lösung eines Problems."
  },
  {
    word: "Debugging",
    hint: "Der Prozess, Fehler im Code zu finden und zu beheben."
  },
  {
    word: "Syntax",
    hint: "Die Regeln, die die Struktur von Anweisungen in einer Programmiersprache bestimmen."
  }
];
*/

let currentWord, correctLetters, wrongGuessCount, timerInterval;
const maxGuesses = 6;
const gameTimeLimit = 30;

const resetGame = () => {
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = "https://media.geeksforgeeks.org/wp-content/uploads/20240215173028/0.png";
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  keyboardDiv.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="buchstabe"></li>`).join("");
  clearInterval(timerInterval);
  startTimer();
  gameModal.classList.remove("zeigen");
};

const getRandomWord = () => {
  const { word, hint } = codingQuiz[Math.floor(Math.random() * codingQuiz.length)];
  currentWord = word.toUpperCase();
  document.querySelector(".hinweis-text b").innerText = hint;
  resetGame();
};

const startTimer = () => {
  let timeLeft = gameTimeLimit;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Verbleibende Zeit: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver(false);
    }
  }, 1000);
};

const gameOver = (isVictory) => {
  setTimeout(() => {
    clearInterval(timerInterval);
    const modalText = isVictory ? ` Glückwunsch! Du hast das Wort gefunden:` : `Spiel verloren! Das richtige Wort war:`;
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("zeigen");
  }, 300);
};

const initGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("geraten");
      }
    });
  } else {
    wrongGuessCount++;
    if (wrongGuessCount <= maxGuesses) {
      hangmanImage.src = `https://media.geeksforgeeks.org/wp-content/uploads/202402151730${wrongGuessCount + 27}/${wrongGuessCount}.png`;
    }
  }

  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if (correctLetters.length === currentWord.length) return gameOver(true);
};

for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i).toUpperCase();
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i).toUpperCase()));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
