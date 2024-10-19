import React from 'react';

type DifficultySelectorProps = {
  difficulty: 'easy' | 'normal' | 'hard';
  setDifficulty: (difficulty: 'easy' | 'normal' | 'hard') => void;
};

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty, setDifficulty }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Dificultad</h2>
      <div className="flex justify-center space-x-4">
        {['easy', 'normal', 'hard'].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level as 'easy' | 'normal' | 'hard')}
            className={`px-4 py-2 rounded ${
              difficulty === level
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {level === 'easy' ? 'Fácil' : level === 'normal' ? 'Normal' : 'Difícil'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;