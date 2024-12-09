import React from 'react';
import { Branch } from '../types/blockchain';

interface BranchInfoProps {
  branch: Branch;
}

export const BranchInfo: React.FC<BranchInfoProps> = ({ branch }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-2">{branch.name}</h3>
      <p className="text-sm text-gray-600 mb-4">
        Protocol: {branch.protocolRules.name}
      </p>
    </div>
  );
};