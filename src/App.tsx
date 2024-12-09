import React, { useEffect } from 'react';
import { BlockchainVisualizer } from './components/BlockchainVisualizer';
import { Header } from './components/Header';
import { BranchInfo } from './components/BranchInfo';
import { useBlockchain } from './hooks/useBlockchain';
import { createBlock } from './utils/blockchain';

const initialProtocolRules = {
  name: 'Standard Protocol',
  blockSize: 1,
  consensusMechanism: 'PoW',
  validationRules: ['Standard validation'],
};

const alternativeProtocolRules = {
  name: 'Enhanced Protocol',
  blockSize: 2,
  consensusMechanism: 'PoS',
  validationRules: ['Enhanced validation', 'Additional security'],
};

function App() {
  const {
    branches,
    selectedBlock,
    handleBlockSelect,
    addBlock,
    createNewBranchWithBlock,
    clearBlockchain,
    setBranches
  } = useBlockchain(initialProtocolRules, alternativeProtocolRules);

  useEffect(() => {
    const initializeGenesisBlock = async () => {
      const mainBranch = branches[0];
      const firstBlock = await createBlock(null, 'Genesis Block', initialProtocolRules, mainBranch.id);
      setBranches(prev => {
        const newBranches = [...prev];
        newBranches[0].blocks = [firstBlock];
        return newBranches;
      });
    };

    if (branches[0].blocks.length === 0) {
      initializeGenesisBlock();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Header onClear={clearBlockchain} />
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Blockchain Visualization</h2>
          <BlockchainVisualizer 
            branches={branches} 
            onBlockSelect={handleBlockSelect}
            selectedBlockHash={selectedBlock?.block.hash}
            onAddBlock={addBlock}
            onCreateBranch={createNewBranchWithBlock}
            selectedBranchIndex={selectedBlock?.branchIndex}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <BranchInfo key={branch.id} branch={branch} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;