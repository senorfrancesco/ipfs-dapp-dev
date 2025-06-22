// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FileStorage {
    mapping(address => string[]) private files;

    event FileAdded(address indexed user, string ipfsHash);

    function addFile(string memory ipfsHash) public {
        files[msg.sender].push(ipfsHash);
        emit FileAdded(msg.sender, ipfsHash);
    }

    function getFiles(address user) public view returns (string[] memory) {
        return files[user];
    }
}