import { ethers } from 'ethers';

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

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Обновите после деплоя

export const getContract = async (nodePort = 8545, privateKey = null, useMetaMask = false) => {
  let provider, signer;
  if (useMetaMask && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    console.log('Connected via MetaMask, signer address:', await signer.getAddress());
  } else if (privateKey) {
    provider = new ethers.JsonRpcProvider(`http://127.0.0.1:${nodePort || 8545}`);
    try {
      await provider.getNetwork();
      console.log(`Node at http://127.0.0.1:${nodePort || 8545} is reachable`);
    } catch (error) {
      throw new Error(`Node at http://127.0.0.1:${nodePort || 8545} is not reachable. Ensure it is running. Error: ${error.message}`);
    }
    signer = new ethers.Wallet(privateKey, provider);
    console.log('Using private key, signer address:', signer.address);
  } else {
    provider = new ethers.JsonRpcProvider(`http://127.0.0.1:${nodePort || 8545}`);
    try {
      await provider.getNetwork();
      console.log(`Node at http://127.0.0.1:${nodePort || 8545} is reachable`);
    } catch (error) {
      throw new Error(`Node at http://127.0.0.1:${nodePort || 8545} is not reachable. Ensure it is running. Error: ${error.message}`);
    }
    signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    console.log('Using default Hardhat account, signer address:', signer.address);
  }
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  console.log('Contract initialized:', CONTRACT_ADDRESS);
  return contract;
};

export const addFileToContract = async (ipfsHash, fileName, nodePort = 8545, privateKey = null, useMetaMask = false) => {
  console.log('Adding file to contract with IPFS hash:', ipfsHash, 'and fileName:', fileName);
  const contract = await getContract(nodePort, privateKey, useMetaMask);
  try {
    const tx = await contract.addFile(ipfsHash, fileName);
    console.log('Transaction sent:', tx.hash);
    await tx.wait();
    console.log('Transaction confirmed:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

export const getUserFiles = async (userAddress, nodePort = 8545, privateKey = null, useMetaMask = false) => {
  console.log('Fetching files for address:', userAddress, 'with nodePort:', nodePort);
  const contract = await getContract(nodePort, privateKey, useMetaMask);
  try {
    const files = await contract.getFiles(userAddress);
    console.log('Files retrieved:', files);
    return files.map(file => ({
      ipfsHash: file.ipfsHash,
      fileName: file.fileName
    }));
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

export const transferTokens = async (toAddress, amount, nodePort = 8545, privateKey = null, useMetaMask = false) => {
  let signer;
  if (useMetaMask && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    console.log('Using MetaMask signer:', await signer.getAddress());
  } else if (privateKey) {
    const provider = new ethers.JsonRpcProvider(`http://127.0.0.1:${nodePort || 8545}`);
    signer = new ethers.Wallet(privateKey, provider);
    console.log('Using private key signer:', signer.address);
  } else {
    const provider = new ethers.JsonRpcProvider(`http://127.0.0.1:${nodePort || 8545}`);
    signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    console.log('Using default Hardhat signer:', signer.address);
  }
  try {
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount.toString())
    });
    console.log('Transaction sent:', tx.hash);
    await tx.wait();
    console.log('Transaction confirmed:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

export const getAccountBalance = async (nodePort = 8545, privateKey = null, useMetaMask = false) => {
  let provider, address;
  if (useMetaMask && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    address = accounts[0];
    console.log('Using MetaMask account:', address);
  } else if (privateKey) {
    provider = new ethers.JsonRpcProvider(`http://127.0.0.1:${nodePort || 8545}`);
    const wallet = new ethers.Wallet(privateKey, provider);
    address = wallet.address;
    console.log('Using private key account:', address);
  } else {
    provider = new ethers.JsonRpcProvider(`http://127.0.0.1:${nodePort || 8545}`);
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    address = wallet.address;
    console.log('Using default Hardhat account:', address);
  }
  try {
    const balance = await provider.getBalance(address);
    console.log('Balance retrieved:', ethers.formatEther(balance));
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

export const getPublicAddress = (privateKey) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    console.log('Derived public address:', wallet.address);
    return wallet.address;
  } catch (error) {
    console.error('Invalid private key:', error);
    throw new Error('Invalid private key format');
  }
};