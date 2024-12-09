import { useState, useCallback } from 'react';
import { Branch, Block, ProtocolRules } from '../types/blockchain';
import { createBlock, createBranch } from '../utils/blockchain';

export const useBlockchain = (initialProtocolRules: ProtocolRules, alternativeProtocolRules: ProtocolRules) => {
  const [branches, setBranches] = useState<Branch[]>(() => {
    const mainBranch = createBranch('Main Branch', initialProtocolRules);
    return [mainBranch];
  });

  const [selectedBlock, setSelectedBlock] = useState<{
    block: Block;
    branchIndex: number;
  } | null>(null);

  const handleBlockSelect = useCallback((block: Block, branchIndex: number) => {
    setSelectedBlock(prev => 
      prev?.block.hash === block.hash ? null : { block, branchIndex }
    );
  }, []);

  const addBlock = useCallback(async (_: number) => {
    if (!selectedBlock) return;

    const targetBranch = branches.find(branch => 
      branch.blocks.some(block => block.hash === selectedBlock.block.hash)
    );

    if (!targetBranch) return;

    const targetBranchIndex = branches.indexOf(targetBranch);
    const blockIndex = targetBranch.blocks.findIndex(block => block.hash === selectedBlock.block.hash);
    
    const newBlock = await createBlock(
      selectedBlock.block,
      `Block ${blockIndex + 2}`,
      targetBranch.protocolRules,
      targetBranch.id
    );

    setBranches(prevBranches => {
      const newBranches = [...prevBranches];
      const branch = newBranches[targetBranchIndex];
      branch.blocks = branch.blocks.slice(0, blockIndex + 1);
      branch.blocks.push(newBlock);
      return newBranches;
    });
    
    setSelectedBlock(null);
  }, [branches, selectedBlock]);

  const createNewBranchWithBlock = useCallback(async () => {
    if (!selectedBlock) return;

    const { block, branchIndex } = selectedBlock;
    const parentBranch = branches[branchIndex];
    
    const blockIndex = parentBranch.blocks.findIndex(b => b.hash === block.hash);
    const newBranchName = `Branch from Block ${blockIndex}`;
    
    const newBranch = createBranch(
      newBranchName,
      alternativeProtocolRules,
      block
    );

    const firstBlock = await createBlock(
      block,
      `Block 1`,
      alternativeProtocolRules,
      newBranch.id
    );

    newBranch.blocks.push(firstBlock);

    setBranches(prev => [...prev, newBranch]);
    setSelectedBlock(null);
  }, [branches, selectedBlock, alternativeProtocolRules]);

  const clearBlockchain = useCallback(async () => {
    const mainBranch = createBranch('Main Branch', initialProtocolRules);
    const genesisBlock = await createBlock(null, 'Genesis Block', initialProtocolRules, mainBranch.id);
    mainBranch.blocks = [genesisBlock];
    setBranches([mainBranch]);
    setSelectedBlock(null);
  }, [initialProtocolRules]);

  return {
    branches,
    selectedBlock,
    handleBlockSelect,
    addBlock,
    createNewBranchWithBlock,
    clearBlockchain,
    setBranches
  };
};