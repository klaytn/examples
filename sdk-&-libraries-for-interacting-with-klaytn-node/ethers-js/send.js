const ethers = require('ethers');

const url = "RPC URL";

const provider = new ethers.JsonRpcProvider(url)
const privKey = "Paste private key"

const signer = new ethers.Wallet(privKey, provider)

async function sendTx() {
    const tx = await signer.sendTransaction({
               to: "Paste recipient address",
               value: 90000000000,
               maxFeePerGas: 250000000000,
               maxPriorityFeePerGas: 250000000000,
               gasLimit: 21000,
           })
    
    const receipt = await tx.wait()
    console.log(receipt);
    
}
// call the function
sendTx();