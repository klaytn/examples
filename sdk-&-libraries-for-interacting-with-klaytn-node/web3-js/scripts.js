const Web3 = require('web3');

const url = 'https://klaytn-baobab-rpc.allthatnode.com:8551/qtKkeUE8ZEPI2cs0OHloJ6seI4Wfy36N' 
const web3 = new Web3(url);
const privateKey = "8ff402b64ba12bd71b286ff679754fbfc01f74bc0294456857b8ee71eefcf773";
const to = "0x8B93b7d7Ed0960e9A0090851334e19b3c451E4E9";
// const account = web3.eth.accounts.privateKeyToAccount(privateKey); 


async function getLatestBlock() {
    const latestBlock = await web3.eth.getBlockNumber();
    console.log(latestBlock.toString());
}



async function sendTx() {
    const tx = await web3.eth.accounts.signTransaction({
        to: to,
        value: 90000000000,
        maxFeePerGas: 250000000000,
        maxPriorityFeePerGas: 250000000000,
        gas: 21000,
    }, privateKey)

const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction)
console.log(receipt);
}


async function getKlayBalance() {

    const klayBalance  = await web3.eth.getBalance(account)
    const formatBalance = await web3.utils.fromWei(klayBalance)
    console.log(`You have ${formatBalance} KLAY`)
    
}


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

    const storeTx = contract.methods.store(10);

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
      console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);

      }

      async function retrieveValue() {
        // read from contract
        const tx = await contract.methods.retrieve().call();
        console.log(tx);
      }



// getLatestBlock()

// sendTx();

// getKlayBalance();

// setValue();

// retrieveValue();