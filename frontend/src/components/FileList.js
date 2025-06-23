import React, { useState, useEffect } from 'react';
import { getUserFiles } from '../services/ethereum';
import { getFileFromIPFS } from '../services/ipfs';

const FileList = ({ userAddress }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log('Fetching files for:', userAddress);
        const userFiles = await getUserFiles(userAddress);
        setFiles(userFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    if (userAddress) {
      fetchFiles();
    }
  }, [userAddress]);

  const handleDownload = async (ipfsHash) => {
    try {
      console.log(`Downloading file with CID: ${ipfsHash}`);
      const fileContent = await getFileFromIPFS(ipfsHash);
      const blob = new Blob([fileContent]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = ipfsHash;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Check console for details.');
    }
  };

  return (
    <div>
      <h3>Your Files</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((ipfsHash, index) => (
            <li key={index}>
              <a
                href={`http://127.0.0.1:8080/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ipfsHash}
              </a>
              <button
                onClick={() => handleDownload(ipfsHash)}
                style={{ marginLeft: '10px' }}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;