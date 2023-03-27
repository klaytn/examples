const ethers = require('ethers');

const url = "RPC URL";
const provider = new ethers.JsonRpcProvider(url)

const privKey = "Paste private key"
const signer = new ethers.Wallet(privKey, provider)

// replace with your contract ABI
const abi = [
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

// replace with your contract address
const contractAddress = "0x472a1226796b6a0918DC78d40b87d750881fdbDC";

// or write-only contracts, provide a Signer object instead of a Provider object:
const contract = new ethers.Contract(contractAddress, abi, signer);

// send transaction to smart contract
// modify contract
async function setValue(value) {
    const tx = await contract.store(value);
    console.log(tx.hash);
}

// read contract data
async function retrieveValue() {
    const value = await contract.retrieve();
    console.log(value);
}

// call the following functions
setValue(value)
retrieveValue()