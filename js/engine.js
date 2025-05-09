const emojis = [
  "🍎",
  "🍎",
  "🍕",
  "🍕",
  "🍔",
  "🍔",
  "🍟",
  "🍟",
  "🌭",
  "🌭",
  "🌮",
  "🌮",
  "🍣",
  "🍣",
  "🍦",
  "🍦",
];

let opencards = [];
let shuffledEmojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));

const game = document.querySelector(".game");
const timerDisplay = document.getElementById("timer");
let timeLeft = 60;
let timerInterval;
const backgroundMusic = document.getElementById("backgroundMusic");
const startGameButton = document.querySelector(".reset"); // Alterado para usar a classe
let gameStarted = false; // Variável para controlar se o jogo começou

function setupGame() {
  game.innerHTML = ""; // Limpa o jogo
  shuffledEmojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1)); // Rembaralha
  for (let i = 0; i < emojis.length; i++) {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = shuffledEmojis[i];
    box.onclick = handleClick;
    game.appendChild(box);
  }
  opencards = [];
  const matchedCards = document.querySelectorAll(".boxMatch");
  matchedCards.forEach((card) => card.classList.remove("boxMatch"));
  const openedCards = document.querySelectorAll(".boxOpen");
  openedCards.forEach((card) => card.classList.remove("boxOpen"));
}

function startTimer() {
  timeLeft = 60;
  timerDisplay.textContent = `Tempo restante: ${timeLeft}`;
  clearInterval(timerInterval); // Limpa qualquer intervalo anterior

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Tempo restante: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

function startGame() {
  gameStarted = true;
  setupGame();
  startTimer();
  if (backgroundMusic) {
    backgroundMusic.volume = 0.1; // Garante que o volume esteja baixo ao iniciar
    backgroundMusic
      .play()
      .catch((error) => console.error("Erro ao iniciar a música:", error));
  }
  startGameButton.removeEventListener("click", startGame);
  startGameButton.textContent = "RESET GAME";
  startGameButton.addEventListener("click", resetGame);
}

function resetGame() {
  gameStarted = false;
  timeLeft = 60;
  timerDisplay.textContent = `Tempo restante: ${timeLeft}`;
  clearInterval(timerInterval);
  setupGame();
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
  startGameButton.textContent = "START GAME";
  startGameButton.removeEventListener("click", resetGame);
  startGameButton.addEventListener("click", startGame);
}

// Inicialização: Configura o jogo e o estado inicial
setupGame();
timerDisplay.textContent = `Tempo restante: ${timeLeft}`; // Exibe o tempo inicial
if (backgroundMusic) {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}
startGameButton.textContent = "START GAME"; // Define o texto inicial do botão
startGameButton.addEventListener("click", startGame); // Adiciona listener para iniciar o jogo

function handleClick() {
  if (!gameStarted) return; // Impede cliques se o jogo não começou
  if (
    opencards.length < 2 &&
    !this.classList.contains("boxOpen") &&
    !this.classList.contains("boxMatch")
  ) {
    this.classList.add("boxOpen");
    opencards.push(this);
  }
  if (opencards.length === 2) {
    setTimeout(checkMatch, 500);
  }
  console.log(opencards);
}

function checkMatch() {
  if (!gameStarted) return;
  if (opencards[0].innerHTML === opencards[1].innerHTML) {
    opencards[0].classList.add("boxMatch");
    opencards[1].classList.add("boxMatch");
  } else {
    opencards[0].classList.remove("boxOpen");
    opencards[1].classList.remove("boxOpen");
  }
  opencards = [];

  if (document.querySelectorAll(".boxMatch").length === emojis.length) {
    clearInterval(timerInterval);

    const victorySound = document.getElementById("victorySound");
    if (victorySound) {
      victorySound.volume = 0.1;
      victorySound.play();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      let fadeInInterval = setInterval(() => {
        if (victorySound.volume < 1) {
          victorySound.volume += 0.1;
        } else {
          clearInterval(fadeInInterval);
        }
      }, 500 / 9);
      setTimeout(() => {
        let fadeOutInterval = setInterval(() => {
          if (victorySound.volume > 0.1) {
            victorySound.volume -= 0.1;
          } else {
            clearInterval(fadeOutInterval);
            victorySound.pause();
            victorySound.currentTime = 0;
          }
        }, 500 / 9);
      }, 4000);
      setTimeout(() => {
        alert("Parabéns! Você ganhou!");
        if (victorySound) {
          victorySound.pause();
          victorySound.currentTime = 0;
        }
        // Para a música de fundo ao vencer
        if (backgroundMusic && !backgroundMusic.paused) {
          backgroundMusic.pause();
          backgroundMusic.currentTime = 0;
        }
        window.location.reload(); // Recarrega a página ao vencer
      }, 6000);
    } else {
      setTimeout(() => {
        alert("Parabéns! Você ganhou!");
        startGame();
      }, 1000);
    }
  }
}

function gameOver() {
  if (!gameStarted) return;
  const failureSound = document.getElementById("failureSound");
  if (failureSound) {
    failureSound.play();
    setTimeout(() => {
      alert("Tempo esgotado! Game Over!");
      // Para a música de fundo ao perder
      if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
      window.location.reload(); // Recarrega a página ao perder
      failureSound.pause();
      failureSound.currentTime = 0;
    }, 500);
  } else {
    alert("Tempo esgotado! Game Over!");
    // Para a música de fundo ao perder (mesmo sem som de falha)
    if (backgroundMusic && !backgroundMusic.paused) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    window.location.reload(); // Recarrega a página ao perder (sem som)
  }
}
