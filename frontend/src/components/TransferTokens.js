import React, { useState } from 'react';
import { transferTokens, getAccountBalance } from '../services/ethereum';
import { ethers } from 'ethers';

const TransferTokens = ({ nodePort = 8545, privateKey = null, useMetaMask = false }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    const bal = await getAccountBalance(nodePort, privateKey, useMetaMask);
    setBalance(ethers.formatEther(bal));
  };

  const handleTransfer = async () => {
    try {
      await transferTokens(toAddress, amount, nodePort, privateKey, useMetaMask);
      alert('Transfer successful!');
      fetchBalance();
    } catch (error) {
      console.error('Error transferring tokens:', error);
      alert('Transfer failed.');
    }
  };

  return (
    <div>
      <h3>Transfer Tokens</h3>
      <button onClick={fetchBalance}>Check Balance</button>
      {balance && <p>Balance: {balance} ETH</p>}
      <input
        type="text"
        placeholder="To Address"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer} disabled={!toAddress || !amount}>
        Transfer
      </button>
    </div>
  );
};

export default TransferTokens;