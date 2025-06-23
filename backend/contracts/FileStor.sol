// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FileStorage {
    struct File {
        string ipfsHash;
        string fileName;
    }
    mapping(address => File[]) private files;

    event FileAdded(address indexed user, string ipfsHash, string fileName);

    function addFile(string memory ipfsHash, string memory fileName) public {
        files[msg.sender].push(File(ipfsHash, fileName));
        emit FileAdded(msg.sender, ipfsHash, fileName);
    }

    function getFiles(address user) public view returns (File[] memory) {
        return files[user];
    }
}