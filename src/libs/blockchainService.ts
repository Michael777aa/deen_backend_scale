import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// ABI for our simple contract that stores hashes
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "sessionId",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
    ],
    name: "storeSessionHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "sessionId",
        type: "string",
      },
    ],
    name: "getSessionHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const storeHashOnBlockchain = async (
  sessionId: string
): Promise<string> => {
  try {
    const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS!,
      contractABI,
      wallet
    );

    // Create a hash of the session ID
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(sessionId));

    // Store on blockchain
    const tx = await contract.storeSessionHash(sessionId, dataHash);
    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error("Error storing hash on blockchain:", error);
    throw new Error("Failed to store hash on blockchain");
  }
};
