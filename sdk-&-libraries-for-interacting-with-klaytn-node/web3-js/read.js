const Web3 = require('web3');

const url = "RPC URL"  
const web3 = new Web3(url);

const privateKey = "Paste private key";

async function getLatestBlock() {
    const latestBlock = await web3.eth.getBlockNumber();
    console.log(latestBlock.toString());
}

async function getKlayBalance() {
    const klayBalance  = await web3.eth.getBalance("Paste wallet address")
    const formatBalance = await web3.utils.fromWei(klayBalance)
    console.log(`You have ${formatBalance} KLAY`)  
}

// call the following functions
getLatestBlock();
getKlayBalance();