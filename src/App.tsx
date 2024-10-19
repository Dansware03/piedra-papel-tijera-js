import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';
import Game from './components/Game';
import DifficultySelector from './components/DifficultySelector';
import PlayerNameInput from './components/PlayerNameInput';
import InstallPrompt from './components/InstallPrompt';

function App() {
  const [gameMode, setGameMode] = useState<'singleplayer' | 'multiplayer'>('singleplayer');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [player1Name, setPlayer1Name] = useState('Jugador 1');
  const [player2Name, setPlayer2Name] = useState('Jugador 2');

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Piedra, Papel o Tijera</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-center space-x-4 mb-6">
          <FontAwesomeIcon icon={faHandRock} className="text-4xl text-gray-700" />
          <FontAwesomeIcon icon={faHandPaper} className="text-4xl text-gray-700" />
          <FontAwesomeIcon icon={faHandScissors} className="text-4xl text-gray-700" />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Modo de juego</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setGameMode('singleplayer')}
              className={`px-4 py-2 rounded ${
                gameMode === 'singleplayer'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Un jugador
            </button>
            <button
              onClick={() => setGameMode('multiplayer')}
              className={`px-4 py-2 rounded ${
                gameMode === 'multiplayer'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Dos jugadores
            </button>
          </div>
        </div>

        {gameMode === 'singleplayer' && (
          <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
        )}

        <PlayerNameInput
          label="Jugador 1"
          value={player1Name}
          onChange={setPlayer1Name}
        />

        {gameMode === 'multiplayer' && (
          <PlayerNameInput
            label="Jugador 2"
            value={player2Name}
            onChange={setPlayer2Name}
          />
        )}

        <Game
          gameMode={gameMode}
          difficulty={difficulty}
          player1Name={player1Name}
          player2Name={player2Name}
        />
      </div>
      <InstallPrompt />
    </div>
  );
}

export default App;