import { ethers } from 'ethers';

const contractABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'string', name: 'ipfsHash', type: 'string' },
    ],
    name: 'FileAdded',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'string', name: 'ipfsHash', type: 'string' }],
    name: 'addFile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getFiles',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Новый адрес

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

export const addFileToContract = async (ipfsHash) => {
  console.log('Adding file to contract with IPFS hash:', ipfsHash);
  const contract = await getContract();
  try {
    const tx = await contract.addFile(ipfsHash);
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