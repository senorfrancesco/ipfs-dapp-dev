import React, { useState, useEffect } from 'react';
import { getUserFiles } from '../services/ethereum';

const FileList = ({ userAddress }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
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
                href={`https://ipfs.io/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ipfsHash}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;