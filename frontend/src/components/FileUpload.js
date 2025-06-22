import React, { useState } from 'react';
import { uploadFileToIPFS } from '../services/ipfs';
import { addFileToContract } from '../services/ethereum';

const FileUpload = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting file upload...');
    setUploading(true);
    try {
      console.log('Uploading to IPFS...');
      const ipfsHash = await uploadFileToIPFS(file);
      console.log('IPFS Hash:', ipfsHash);
      console.log('Adding to contract...');
      const tx = await addFileToContract(ipfsHash);
      console.log('Transaction:', tx);
      onFileUploaded();
      setFile(null);
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setUploading(false);
      console.log('Upload process finished');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
};

export default FileUpload;