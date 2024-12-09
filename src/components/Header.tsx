import React from 'react';

interface HeaderProps {
  onClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClear }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Multibranch Blockchain Demonstration</h1>
      <button
        onClick={onClear}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Clear Blockchain
      </button>
    </div>
  );
};