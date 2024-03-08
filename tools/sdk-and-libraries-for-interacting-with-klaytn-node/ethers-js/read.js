const ethers = require('ethers');

const url = "RPC URL";
const provider = new ethers.JsonRpcProvider(url)

const privKey = "Paste Privatekey"
const signer = new ethers.Wallet(privKey, provider)

async function getBlockNumber() {
    const blocknumber = await provider.getBlockNumber()
    console.log("blocknumber", blocknumber) 
}

async function getKlayBalance() {
    const klayBalance  = await provider.getBalance("paste wallet address")
    const formatBalance = ethers.formatEther(klayBalance)
    console.log(`You have ${formatBalance} KLAY`)
}
// call the functions below:
getBlockNumber()
getKlayBalance()