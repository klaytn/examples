const ethers = require('ethers');

const url = 'https://klaytn-baobab-rpc.allthatnode.com:8551/qtKkeUE8ZEPI2cs0OHloJ6seI4Wfy36N';

const provider = new ethers.JsonRpcProvider(url);

const privKey = "8ff402b64ba12bd71b286ff679754fbfc01f74bc0294456857b8ee71eefcf773"
const signer = new ethers.Wallet(privKey, provider)


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

const contractAddress = "0x472a1226796b6a0918DC78d40b87d750881fdbDC";

const contract = new ethers.Contract(contractAddress, abi, signer);

// For write-only contracts, provide a Signer object instead of a Provider object:

async function setValue(value) {
    const tx = await contract.store(value);
    console.log(tx.hash);
}

async function retrieveValue() {
    const value = await contract.retrieve();
    console.log(value);
}

setValue(25);
retrieveValue();