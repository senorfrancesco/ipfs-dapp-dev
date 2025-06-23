import React, { useState } from 'react';
import { uploadFileToIPFS } from '../services/ipfs';
import { addFileToContract } from '../services/ethereum';

const FileUpload = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      const ipfsHash = await uploadFileToIPFS(file);
      await addFileToContract(ipfsHash, file.name);
      alert('File uploaded successfully!');
      onFileUploaded();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Check console for details.');
    }
  };

  return (
    <div>
      <h3>Upload File</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload to IPFS
      </button>
    </div>
  );
};

export default FileUpload;