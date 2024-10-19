import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';

type GameProps = {
  gameMode: 'singleplayer' | 'multiplayer';
  difficulty: 'easy' | 'normal' | 'hard';
  player1Name: string;
  player2Name: string;
};

type Choice = 'rock' | 'paper' | 'scissors' | null;

const Game: React.FC<GameProps> = ({ gameMode, difficulty, player1Name, player2Name }) => {
  const [player1Choice, setPlayer1Choice] = useState<Choice>(null);
  const [player2Choice, setPlayer2Choice] = useState<Choice>(null);
  const [result, setResult] = useState<string>('');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [playerHistory, setPlayerHistory] = useState<Choice[]>([]);

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  useEffect(() => {
    if (player1Choice || player2Choice) {
      setPlayerHistory(prevHistory => [...prevHistory, player1Choice, player2Choice].filter(Boolean));
    }
 }, [player1Choice, player2Choice]);

  const getComputerChoice = (): Choice => {
    switch (difficulty) {
      case 'easy':
        return getEasyComputerChoice();
      case 'normal':
        return getNormalComputerChoice();
      case 'hard':
        return getHardComputerChoice();
      default:
        return choices[Math.floor(Math.random() * choices.length)];
    }
  };

  const getEasyComputerChoice = (): Choice => {
    // 60% random, 40% losing choice
    if (Math.random() < 0.6) {
      return choices[Math.floor(Math.random() * choices.length)];
    } else {
      const losingChoices = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
      };
      return losingChoices[player1Choice as keyof typeof losingChoices] as Choice;
    }
  };

  const getNormalComputerChoice = (): Choice => {
    // Use basic pattern recognition
    if (playerHistory.length < 3) {
      return choices[Math.floor(Math.random() * choices.length)];
    }

    const lastThreeChoices = playerHistory.slice(-3);
    const pattern = lastThreeChoices.join(',');

    // Check for simple patterns
    if (pattern === 'rock,paper,scissors') return 'rock';
    if (pattern === 'paper,scissors,rock') return 'paper';
    if (pattern === 'scissors,rock,paper') return 'scissors';

    // If no pattern, choose randomly
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const getHardComputerChoice = (): Choice => {
    if (playerHistory.length < 5) {
      return choices[Math.floor(Math.random() * choices.length)];
    }

    // Analyze player's choice frequency
    const frequency = playerHistory.reduce((acc, choice) => {
      if (choice) acc[choice] = (acc[choice] || 0) + 1;
      return acc;
   }, { rock: 0, paper: 0, scissors: 0 });


    playerHistory.forEach(choice => {
      if (choice) frequency[choice]++;
    });

    const mostFrequent = Object.entries(frequency).reduce((a, b) => a[1] > b[1] ? a : b)[0] as Choice;

    // Counter the most frequent choice
    const counterChoices = {
      rock: 'paper',
      paper: 'scissors',
      scissors: 'rock'
    };

    // 80% counter most frequent, 20% random
    if (Math.random() < 0.8) {
      return counterChoices[mostFrequent];
    } else {
      return choices[Math.floor(Math.random() * choices.length)];
    }
  };

  const determineWinner = (choice1: Choice, choice2: Choice): string => {
    if (choice1 === choice2) return 'Empate';
    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'paper' && choice2 === 'rock') ||
      (choice1 === 'scissors' && choice2 === 'paper')
    ) {
      return `${player1Name} gana`;
    }
    return `${player2Name} gana`;
  };

  const playRound = (choice: Choice) => {
    if (gameMode === 'singleplayer') {
      setPlayer1Choice(choice);
      const computerChoice = getComputerChoice();
      setPlayer2Choice(computerChoice);
      const roundResult = determineWinner(choice, computerChoice);
      setResult(roundResult);
      updateScores(roundResult);
    } else {
      if (currentPlayer === 1) {
        setPlayer1Choice(choice);
        setCurrentPlayer(2);
      } else {
        setPlayer2Choice(choice);
        const roundResult = determineWinner(player1Choice!, choice);
        setResult(roundResult);
        updateScores(roundResult);
        setCurrentPlayer(1);
      }
    }
  };

  const updateScores = (roundResult: string) => {
    setScores(prevScores => {
      if (roundResult === `${player1Name} gana`) {
        return { ...prevScores, player1: prevScores.player1 + 1 };
      } else if (roundResult === `${player2Name} gana`) {
        return { ...prevScores, player2: prevScores.player2 + 1 };
      }
      return prevScores;
    });
  };

  const renderChoice = (choice: Choice) => {
    switch (choice) {
      case 'rock':
        return <FontAwesomeIcon icon={faHandRock} className="text-4xl" />;
      case 'paper':
        return <FontAwesomeIcon icon={faHandPaper} className="text-4xl" />;
      case 'scissors':
        return <FontAwesomeIcon icon={faHandScissors} className="text-4xl" />;
      default:
        return null;
    }
  };

  const resetRound = () => {
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setResult('');
    setCurrentPlayer(1);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-semibold">{player1Name}</p>
          <p>Puntuación: {scores.player1}</p>
        </div>
        <div>
          <p className="font-semibold">{gameMode === 'singleplayer' ? 'Computadora' : player2Name}</p>
          <p>Puntuación: {scores.player2}</p>
        </div>
      </div>

      {(gameMode === 'singleplayer' || (gameMode === 'multiplayer' && currentPlayer === 1)) && (
        <div>
          <p className="mb-2">Turno de {gameMode === 'singleplayer' ? player1Name : (currentPlayer === 1 ? player1Name : player2Name)}:</p>
          <div className="flex justify-center space-x-4 mb-6">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => playRound(choice)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {renderChoice(choice)}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameMode === 'multiplayer' && currentPlayer === 2 && (
        <div>
          <p className="mb-2">Turno de {player2Name}:</p>
          <div className="flex justify-center space-x-4 mb-6">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => playRound(choice)}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                {renderChoice(choice)}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold">{result}</p>
          <div className="flex justify-center space-x-8 mt-2">
            <div>
              <p>{player1Name} eligió:</p>
              {renderChoice(player1Choice)}
            </div>
            <div>
              <p>{gameMode === 'singleplayer' ? 'Computadora' : player2Name} eligió:</p>
              {renderChoice(player2Choice)}
            </div>
          </div>
          <button
            onClick={resetRound}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Siguiente ronda
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;