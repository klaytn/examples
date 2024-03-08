import { createPublicClient, createWalletClient, http } from 'viem'
import { klaytnBaobab } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
 
const client = createPublicClient({ 
  chain: klaytnBaobab, 
  transport: http("https://klaytn-baobab-rpc.allthatnode.com:8551"), 
}) 

const walletClient = createWalletClient({
  chain: klaytnBaobab,
  transport: http("https://klaytn-baobab-rpc.allthatnode.com:8551")
})
 
const account = privateKeyToAccount("PASTE PRIVATE KEY");

const abi =  [
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


async function readFromContract() {
  const retrieve = await client.readContract({
    // contract address
    address: "0x472a1226796b6a0918DC78d40b87d750881fdbDC",
    abi: abi,
    functionName: 'retrieve'
  })

  console.log(`Value read from contract is: ${retrieve}`);
}

async function writeToContract() {

  const { request } = await client.simulateContract({
    // contract address
    address: "0x472a1226796b6a0918DC78d40b87d750881fdbDC",
    abi: abi,
    functionName: "store",
    account: account,
    args: [694n],
  })

  const hash = await walletClient.writeContract(request)

  console.log(`Hash from writing to a contract: ${hash}`);
}


readFromContract();
writeToContract();
