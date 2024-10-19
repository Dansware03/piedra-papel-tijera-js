import React from 'react';

type PlayerNameInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ingresa el nombre del jugador"
      />
    </div>
  );
};

export default PlayerNameInput;