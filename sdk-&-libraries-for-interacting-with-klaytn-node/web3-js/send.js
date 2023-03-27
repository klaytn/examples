const Web3 = require('web3');

const url = 'https://klaytn-baobab-rpc.allthatnode.com:8551/qtKkeUE8ZEPI2cs0OHloJ6seI4Wfy36N' 
const web3 = new Web3(url);

const privateKey = "8ff402b64ba12bd71b286ff679754fbfc01f74bc0294456857b8ee71eefcf773";


async function sendTx() {
    const tx = await web3.eth.accounts.signTransaction({
        to: "0x8B93b7d7Ed0960e9A0090851334e19b3c451E4E9",
        value: 90000000000,
        maxFeePerGas: 250000000000,
        maxPriorityFeePerGas: 250000000000,
        gas: 21000,
    }, privateKey)

const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction)
console.log(receipt);
}

sendTx();
