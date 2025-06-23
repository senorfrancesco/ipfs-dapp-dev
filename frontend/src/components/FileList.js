import React, { useState, useEffect } from 'react';
import { getUserFiles } from '../services/ethereum';
import { getFileFromIPFS } from '../services/ipfs';

const FileList = ({ userAddress, privateKey = null, nodePort = 8545, useMetaMask = false }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log('Fetching files for:', userAddress, 'with nodePort:', nodePort);
        const userFiles = await getUserFiles(userAddress, nodePort, privateKey, useMetaMask);
        console.log('Fetched files:', userFiles);
        setFiles(userFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    if (userAddress) {
      fetchFiles();
    }
  }, [userAddress, nodePort, privateKey, useMetaMask]);

  const getMimeType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf',
      txt: 'text/plain',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };

  const handleDownload = async (ipfsHash, fileName) => {
    try {
      console.log(`Downloading file with CID: ${ipfsHash}, Name: ${fileName}`);
      const fileContent = await getFileFromIPFS(ipfsHash);
      const mimeType = getMimeType(fileName);
      const blob = new Blob([fileContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
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
          {files.map((file, index) => (
            <li key={index}>
              <a
                href={`http://127.0.0.1:8080/ipfs/${file.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.fileName}
              </a>
              {file.fileName.match(/\.(jpg|jpeg|png|gif)$/i) && (
                <img
                  src={`http://127.0.0.1:8080/ipfs/${file.ipfsHash}`}
                  alt={file.fileName}
                  style={{ maxWidth: '100px', marginLeft: '10px' }}
                />
              )}
              <button
                onClick={() => handleDownload(file.ipfsHash, file.fileName)}
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