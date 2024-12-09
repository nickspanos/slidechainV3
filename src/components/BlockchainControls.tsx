import React from 'react';

interface BlockchainControlsProps {
  onClear: () => void;
  onReset: () => void;
  zoom: number;
}

export const BlockchainControls: React.FC<BlockchainControlsProps> = ({ onClear, onReset, zoom }) => {
  return (
    <div className="absolute top-4 right-4 flex space-x-2 z-10">
      <button
        onClick={onReset}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
      >
        Reset View
      </button>
      <div className="bg-white rounded shadow px-2 py-1 text-sm text-gray-600">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};