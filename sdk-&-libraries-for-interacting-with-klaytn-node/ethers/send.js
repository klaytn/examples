const ethers = require('ethers');

const url = 'https://klaytn-baobab-rpc.allthatnode.com:8551/qtKkeUE8ZEPI2cs0OHloJ6seI4Wfy36N';

const provider = new ethers.JsonRpcProvider(url);

const privKey = "8ff402b64ba12bd71b286ff679754fbfc01f74bc0294456857b8ee71eefcf773"
const signer = new ethers.Wallet(privKey, provider)


async function sendTx() {

    const tx = await signer.sendTransaction({
               to: "0x8B93b7d7Ed0960e9A0090851334e19b3c451E4E9",
               value: 90000000000,
               maxFeePerGas: 250000000000,
               maxPriorityFeePerGas: 250000000000,
               gasLimit: 21000,
           })
    
    const receipt = await tx.wait()
    console.log(receipt);
    
}

sendTx();
