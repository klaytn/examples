const Web3 = require('web3');

const url = 'https://klaytn-baobab-rpc.allthatnode.com:8551/qtKkeUE8ZEPI2cs0OHloJ6seI4Wfy36N' 
const web3 = new Web3(url);

async function getLatestBlock() {
    const latestBlock = await web3.eth.getBlockNumber();
    console.log(latestBlock.toString());
}



async function getKlayBalance() {
    const klayBalance  = await web3.eth.getBalance("0x8B93b7d7Ed0960e9A0090851334e19b3c451E4E9")
    const formatBalance = await web3.utils.fromWei(klayBalance)
    console.log(`You have ${formatBalance} KLAY`)  
}

getLatestBlock();
getKlayBalance();