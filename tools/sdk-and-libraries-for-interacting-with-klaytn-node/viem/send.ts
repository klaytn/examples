import { createWalletClient, http, parseEther } from 'viem'
import { klaytnBaobab } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const walletClient = createWalletClient({
  chain: klaytnBaobab,
  transport: http("https://klaytn-baobab-rpc.allthatnode.com:8551")
})
 
const account = privateKeyToAccount("0x0dc23f16517e271c5840706ec89c711c9e45d8244c12d58b90107eacf9032dba");


async function sendKlayToRecipient() {
  const hash = await walletClient.sendTransaction({ 
    account,
    to: '0x7b467A6962bE0ac80784F131049A25CDE27d62Fb',
    value: parseEther('0.01')
  })

  console.log(`Send KLAY tx hash is: ${hash}`);
}

sendKlayToRecipient();

