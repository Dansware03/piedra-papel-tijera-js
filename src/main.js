const modeSelection = document.getElementById('modeSelection');
const difficultySelection = document.getElementById('difficultySelection');
const gameArea = document.getElementById('gameArea');
const vsComputerBtn = document.getElementById('vsComputerBtn');
const vsPlayerBtn = document.getElementById('vsPlayerBtn');
const playerChoices = document.getElementById('playerChoices');
const result = document.getElementById('result');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const currentPlayerElement = document.getElementById('currentPlayer');
const backButton = document.getElementById('backButton');

let gameMode = '';
let difficulty = '';
let currentPlayer = 1;
let scores = [0, 0];
let player1Choice = '';
let player2Choice = '';

vsComputerBtn.addEventListener('click', () => {
  gameMode = 'computer';
  modeSelection.classList.add('hidden');
  difficultySelection.classList.remove('hidden');
});

vsPlayerBtn.addEventListener('click', () => {
  startGame('player');
});

difficultySelection.addEventListener('click', (e) => {
  if (e.target.classList.contains('difficulty')) {
    difficulty = e.target.dataset.difficulty;
    startGame('computer');
  }
});

backButton.addEventListener('click', () => {
  gameArea.classList.add('hidden');
  modeSelection.classList.remove('hidden');
  resetGame();
});

function startGame(mode) {
  gameMode = mode;
  modeSelection.classList.add('hidden');
  difficultySelection.classList.add('hidden');
  gameArea.classList.remove('hidden');
  resetGame();
}

function resetGame() {
  currentPlayer = 1;
  scores = [0, 0];
  player1Choice = '';
  player2Choice = '';
  result.textContent = '';
  updateScoreDisplay();
  updateCurrentPlayerDisplay();
}

playerChoices.addEventListener('click', (e) => {
  const choiceButton = e.target.closest('.choice');
  if (choiceButton) {
    const playerChoice = choiceButton.querySelector('img').alt.toLowerCase();
    playRound(playerChoice);
  }
});

async function playRound(playerChoice) {
  if (gameMode === 'computer') {
    try {
      const response = await fetch('/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerChoice, difficulty }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      updateResult(playerChoice, data.computerChoice, data.result);
    } catch (error) {
      console.error('Error:', error);
      result.textContent = 'Error al jugar. Intenta de nuevo.';
    }
  } else {
    if (currentPlayer === 1) {
      player1Choice = playerChoice;
      currentPlayer = 2;
      updateCurrentPlayerDisplay();
    } else {
      player2Choice = playerChoice;
      determineWinner();
    }
  }
}

function updateResult(player1Choice, player2Choice, gameResult) {
  const resultMessages = {
    tie: '¡Empate!',
    player: '¡Ganaste!',
    computer: '¡La computadora gana!',
  };

  result.textContent = `${resultMessages[gameResult]} (${player1Choice} vs ${player2Choice})`;

  if (gameResult === 'player') {
    scores[0]++;
  } else if (gameResult === 'computer') {
    scores[1]++;
  }

  updateScoreDisplay();
}

function determineWinner() {
  const choices = ['piedra', 'papel', 'tijera'];
  const player1Index = choices.indexOf(player1Choice);
  const player2Index = choices.indexOf(player2Choice);
  
  let gameResult;
  if (player1Index === player2Index) {
    gameResult = 'tie';
  } else if ((player1Index + 1) % 3 === player2Index) {
    gameResult = 'player2';
  } else {
    gameResult = 'player1';
  }

  const resultMessages = {
    tie: '¡Empate!',
    player1: '¡Jugador 1 gana!',
    player2: '¡Jugador 2 gana!',
  };

  result.textContent = `${resultMessages[gameResult]} (${player1Choice} vs ${player2Choice})`;

  if (gameResult === 'player1') {
    scores[0]++;
  } else if (gameResult === 'player2') {
    scores[1]++;
  }

  updateScoreDisplay();
  currentPlayer = 1;
  updateCurrentPlayerDisplay();
}

function updateScoreDisplay() {
  player1ScoreElement.textContent = `Jugador 1: ${scores[0]}`;
  player2ScoreElement.textContent = gameMode === 'computer' ? `Computadora: ${scores[1]}` : `Jugador 2: ${scores[1]}`;
}

function updateCurrentPlayerDisplay() {
  if (gameMode === 'player') {
    currentPlayerElement.textContent = `Jugador ${currentPlayer}, elige tu jugada:`;
  } else {
    currentPlayerElement.textContent = 'Elige tu jugada:';
  }
}