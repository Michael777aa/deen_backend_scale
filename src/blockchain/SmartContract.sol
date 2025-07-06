// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MentalHealthRecords {
    mapping(string => bytes32) private sessionHashes;
    
    event HashStored(string indexed sessionId, bytes32 dataHash);
    
    function storeSessionHash(string memory sessionId, bytes32 dataHash) public {
        sessionHashes[sessionId] = dataHash;
        emit HashStored(sessionId, dataHash);
    }
    
    function getSessionHash(string memory sessionId) public view returns (bytes32) {
        return sessionHashes[sessionId];
    }
}