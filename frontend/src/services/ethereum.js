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

const CONTRACT_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'; // Новый адрес

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
  }
  try {
    console.log('Requesting MetaMask accounts...');
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts.length) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    console.log('Connected accounts:', accounts);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log('Signer address:', await signer.getAddress());
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    console.log('Contract initialized:', CONTRACT_ADDRESS);
    return contract;
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw new Error(`Failed to connect to MetaMask: ${error.message}`);
  }
};

export const addFileToContract = async (ipfsHash, fileName) => {
  console.log('Adding file to contract with IPFS hash:', ipfsHash, 'and fileName:', fileName);
  const contract = await getContract();
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

export const getUserFiles = async (userAddress) => {
  console.log('Fetching files for address:', userAddress);
  const contract = await getContract();
  try {
    const files = await contract.getFiles(userAddress);
    console.log('Files retrieved:', files);
    return files;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};