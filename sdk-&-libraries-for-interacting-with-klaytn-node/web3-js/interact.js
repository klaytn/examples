const Web3 = require('web3');

const url = 'https://klaytn-baobab-rpc.allthatnode.com:8551/qtKkeUE8ZEPI2cs0OHloJ6seI4Wfy36N' 
const web3 = new Web3(url);

const privateKey = "8ff402b64ba12bd71b286ff679754fbfc01f74bc0294456857b8ee71eefcf773";


// interacting with smart contract

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
    
    const contractAddress = "0x472a1226796b6a0918DC78d40b87d750881fdbDC"
    
    const contract = new web3.eth.Contract(abi, contractAddress);

    const storeTx = contract.methods.store(80);

    async function setValue() {
        
            // Sign Tx with PK
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data: storeTx.encodeABI(),
          gas: await storeTx.estimateGas(),
        },
        privateKey
      );
    
      // Send Tx and Wait for Receipt
      const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
      console.log(`Tx hash: ${createReceipt.transactionHash}`);

      }

      async function retrieveValue() {
        // read from contract
        const tx = await contract.methods.retrieve().call();
        console.log(tx);
      }

      // setValue();
      retrieveValue();