import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('dist'));

const choices = ['rock', 'paper', 'scissors'];
const winConditions = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

function getComputerChoice(difficulty, playerChoice) {
  const randomChoice = () => choices[Math.floor(Math.random() * choices.length)];
  
  switch (difficulty) {
    case 'easy':
      // 60% chance of choosing a losing move, 40% random
      return Math.random() < 0.6 ? winConditions[playerChoice] : randomChoice();
    case 'normal':
      // Completely random choice
      return randomChoice();
    case 'hard':
      // 60% chance of choosing a winning move, 40% random
      return Math.random() < 0.6 ? choices.find(choice => winConditions[choice] === playerChoice) : randomChoice();
    default:
      return randomChoice();
  }
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return 'tie';
  if (winConditions[playerChoice] === computerChoice) return 'player';
  return 'computer';
}

app.post('/play', (req, res) => {
  const { playerChoice, difficulty } = req.body;
  const computerChoice = getComputerChoice(difficulty, playerChoice);
  const result = determineWinner(playerChoice, computerChoice);
  
  res.json({ computerChoice, result });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});