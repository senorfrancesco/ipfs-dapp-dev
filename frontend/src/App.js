import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import TransferTokens from './components/TransferTokens';
import { getPublicAddress } from './services/ethereum';
import { ethers } from 'ethers';


function App() {
  const [nodePort, setNodePort] = useState(8545);
  const [useMetaMask, setUseMetaMask] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [account, setAccount] = useState(null);
  const [publicAddress, setPublicAddress] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (useMetaMask && window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => setAccount(accounts[0]));
    } else if (privateKey) {
      setPublicAddress(getPublicAddress(privateKey));
    } else {
      setPublicAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    }
  }, [useMetaMask, privateKey]);

  const handleFileUploaded = () => {
    setRefresh(prev => prev + 1);
    console.log('Refresh triggered, new value:', refresh + 1);
  };

  const handlePrivateKeyChange = (e) => {
  const key = e.target.value;
  try {
    ethers.Wallet.fromPhrase(key); // Проверка валидности
    setPrivateKey(key);
    setPublicAddress(getPublicAddress(key));
  } catch (error) {
    console.error('Invalid private key:', error);
    setPrivateKey('');
    setPublicAddress(null);
    alert('Invalid private key. Please enter a valid 64-character hex key.');
  }
};

  return (
    <div className="App">
      <h1>IPFS DApp</h1>
      <div>
        <label>Node Port: </label>
        <select value={nodePort} onChange={(e) => setNodePort(Number(e.target.value))}>
          <option value={8545}>Node 1 (8545)</option>
          <option value={8546}>Node 2 (8546)</option>
        </select>
        <label> Use MetaMask: </label>
        <input
          type="checkbox"
          checked={useMetaMask}
          onChange={(e) => {
            setUseMetaMask(e.target.checked);
            if (e.target.checked) setPrivateKey('');
          }}
        />
        {!useMetaMask && (
          <div>
            <label>Private Key: </label>
            <input
              type="text"
              value={privateKey}
              onChange={handlePrivateKeyChange}
              placeholder="Enter Private Key (e.g., 0x... or 64 hex chars)"
            />
            {publicAddress && <p>Public Address: {publicAddress}</p>}
          </div>
        )}
        {useMetaMask && account && <p>Connected: {account}</p>}
      </div>
      <FileUpload
        onFileUploaded={handleFileUploaded}
        nodePort={nodePort}
        privateKey={privateKey}
        useMetaMask={useMetaMask}
      />
      <FileList
        userAddress={publicAddress || account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
        nodePort={nodePort}
        privateKey={privateKey}
        useMetaMask={useMetaMask}
        key={refresh}
      />
      <TransferTokens
        nodePort={nodePort}
        privateKey={privateKey}
        useMetaMask={useMetaMask}
      />
    </div>
  );
}

export default App;