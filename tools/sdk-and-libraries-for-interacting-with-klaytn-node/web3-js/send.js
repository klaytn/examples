const Web3 = require('web3');

const url = "RPC URL"  
const web3 = new Web3(url);

const privateKey = "Paste private key";

async function sendTx() {
    const tx = await web3.eth.accounts.signTransaction({
        to: "Paste recipient address",
        value: 90000000000,
        maxFeePerGas: 250000000000,
        maxPriorityFeePerGas: 250000000000,
        gas: 21000,
    }, privateKey)
    
const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction)
console.log(receipt);
}

// call function
sendTx();
Footer
