import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import './App.css';

const App = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const connectWallet = async () => {
      console.log('window.ethereum:', window.ethereum);
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          setUserAddress(accounts[0]);
        } catch (error) {
          console.error('Error connecting wallet:', error);
        }
      } else {
        console.error('MetaMask is not available');
      }
    };
    connectWallet();
  }, []);

  const handleFileUploaded = () => {
    setRefresh((prev) => prev + 1); // Триггерит обновление FileList
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