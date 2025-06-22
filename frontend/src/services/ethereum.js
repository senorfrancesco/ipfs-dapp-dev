import { ethers } from 'ethers';

const contractABI = [
  {
    inputs: [{ name: 'ipfsHash', type: 'string' }],
    name: 'addFile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getFiles',
    outputs: [{ name: 'output', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { name: 'ipfsHash', type: 'string' },
    ],
    name: 'FileAdded',
    type: 'event',
  },
];

const CONTRACT_ADDRESS = '0x0165878A594ca255338adfa4d48449f69242Eb8F'; // Замените на ваш адрес контракта

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
  }
  try {
    console.log('Requesting MetaMask accounts...');
    // Запрашиваем аккаунты через window.ethereum
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
  const tx = await contract.addFile(ipfsHash);
  console.log('Transaction sent:', tx.hash);
  await tx.wait();
  console.log('Transaction confirmed:', tx.hash);
  return tx;
};

export const getUserFiles = async (userAddress) => {
  console.log('Fetching files for address:', userAddress);
  const contract = await getContract();
  const files = await contract.getFiles(userAddress);
  console.log('Files retrieved:', files);
  return files;
};