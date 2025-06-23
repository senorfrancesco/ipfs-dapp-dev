import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import './App.css';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'; // Новый адрес
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "fileName", "type": "string" }
    ],
    "name": "FileAdded",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "internalType": "string", "name": "fileName", "type": "string" }
    ],
    "name": "addFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getFiles",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "ipfsHash", "type": "string" },
          { "internalType": "string", "name": "fileName", "type": "string" }
        ],
        "internalType": "struct FileStorage.File[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const App = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) {
        console.error('MetaMask is not available');
        alert('Please install MetaMask to use this dApp.');
        return;
      }

      try {
        console.log('Checking window.ethereum:', window.ethereum);
        console.log('MetaMask isMetaMask:', window.ethereum.isMetaMask);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        }

        if (!accounts.length) {
          console.log('Requesting MetaMask connection...');
          const newAccounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          setUserAddress(newAccounts[0]);
        }

        window.ethereum.on('accountsChanged', (newAccounts) => {
          console.log('Accounts changed:', newAccounts);
          setUserAddress(newAccounts[0] || null);
        });

        window.ethereum.on('chainChanged', () => {
          console.log('Chain changed, reloading...');
          window.location.reload();
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
        contract.on('FileAdded', (user, ipfsHash, fileName) => {
          console.log(`FileAdded event: User=${user}, IPFS Hash=${ipfsHash}, FileName=${fileName}`);
          if (user.toLowerCase() === userAddress?.toLowerCase()) {
            setRefresh((prev) => prev + 1);
          }
        });

        console.log('MetaMask initialized successfully');
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    };

    if (window.ethereum) {
      connectWallet();
    } else {
      window.addEventListener('ethereum#initialized', connectWallet, { once: true });
      setTimeout(connectWallet, 1000);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [userAddress]);

  const handleFileUploaded = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="App">
      <h1>File Storage dApp</h1>
      {userAddress ? (
        <>
          <p>Connected: {userAddress}</p>
          <FileUpload onFileUploaded={handleFileUploaded} />
          <FileList userAddress={userAddress} key={refresh} />
        </>
      ) : (
        <p>Please connect your MetaMask wallet.</p>
      )}
    </div>
  );
};

export default App;