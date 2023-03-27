const ethers = require('ethers');

const url = 'https://klaytn-baobab-rpc.allthatnode.com:8551/qtKkeUE8ZEPI2cs0OHloJ6seI4Wfy36N';

const provider = new ethers.JsonRpcProvider(url)
const account = "0x8B93b7d7Ed0960e9A0090851334e19b3c451E4E9"


async function getBlockNumber() {

    const blocknumber  = await provider.getBlockNumber()
    console.log("blocknumber", blocknumber)
    
}

async function getKlayBalance() {

    const klayBalance  = await provider.getBalance(account)
    const formatBalance = ethers.formatEther(klayBalance)
    console.log(`You have ${formatBalance} KLAY`)
    
}

getBlockNumber();
getKlayBalance();