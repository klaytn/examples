import { createPublicClient, http, formatEther } from 'viem'
import { klaytnBaobab } from 'viem/chains'
 
const client = createPublicClient({ 
  chain: klaytnBaobab, 
  transport: http("https://klaytn-baobab-rpc.allthatnode.com:8551"), 
}) 


async function getBlockNumber() {
    const blockNumber = await client.getBlockNumber() 
    console.log(`Current block number is: ${blockNumber}`);
}

async function getKlayBalance() {
  const balance = await client.getBalance({ 
    address: '0x75Bc50a5664657c869Edc0E058d192EeEfD570eb',
  })
  const formatBal = formatEther(balance);
  console.log(`Current KLAY balance is ${formatBal}`);  
}


getBlockNumber();
getKlayBalance();
