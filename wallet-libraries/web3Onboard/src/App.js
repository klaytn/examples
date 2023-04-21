import { useState } from "react";

import Onboard from "@web3-onboard/core";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers} from "ethers";
import { truncateAddress, toHex } from "./utils";

const coinbaseWalletSdk = coinbaseWalletModule();
const walletConnect = walletConnectModule();
const injected = injectedModule();

const modules = [coinbaseWalletSdk, walletConnect, injected];

const MAINNET_RPC_URL = `https://ethereum-mainnet-rpc.allthatnode.com/1d322388ZEPI2cs0OHloJ6seI4Wfy36N`;
const KLAYTN_MAINNET_URL = `https://klaytn-mainnet-rpc.allthatnode.com:8551`
const KLAYTN_BAOBAB_URL = `https://klaytn-baobab-rpc.allthatnode.com:8551`

const onboard = Onboard({
  wallets: modules, // created in previous step
  chains: [
    {
      id: "0x1", // chain ID must be in hexadecimal
      token: "ETH",
      namespace: "evm",
      label: "Ethereum Mainnet",
      rpcUrl: MAINNET_RPC_URL
    },
    {
      id: "0x2019", // chain ID must be in hexadecimal
      token: "KLAY",
      namespace: "evm",
      label: "Klaytn Mainnet",
      rpcUrl: KLAYTN_MAINNET_URL
    },
    {
      id: "0x3e9", // chain ID must be in hexadecimel
      token: "KLAY",
      namespace: "evm",
      label: "Klaytn Testnet",
      rpcUrl: KLAYTN_BAOBAB_URL
    }
  ],
  appMetadata: {
    name: "Klaytn-web3-onboard-App",
    icon: "https://pbs.twimg.com/profile_images/1620693002149851137/GbBC5ZjI_400x400.jpg",
    logo: "https://pbs.twimg.com/profile_images/1620693002149851137/GbBC5ZjI_400x400.jpg",
    description: "Web3-onboard-klaytn",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" }
    ]
  }
});

function App() {


  const [provider, setProvider] = useState();
  // const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [txHash, setTxHash] = useState();
  const [contractTx, setContractTx] = useState();
  const [contractMessage, setContractMessage] = useState();

  const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      const { accounts, chains, provider } = wallets[0];
      setAccount(accounts[0].address);
      setChainId(chains[0].id);
      setProvider(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = async () => {
    const [primaryWallet] = await onboard.state.get().wallets;
    if (primaryWallet) await onboard.disconnectWallet({ label: primaryWallet.label });
    refreshState();
  };

  const refreshState = () => {
    setAccount("");
    setChainId("");
    setProvider();
    setTxHash("");
    setContractTx("");
    setContractMessage("")
  };

  const switchNetwork = async () => {
    await onboard.setChain({ chainId: toHex(1001) });

    // Testnet = 0x3e9 
    // Mainnet = 0x2019 
  };

  const sendKlay = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    const ethersProvider = new ethers.BrowserProvider(provider);

    const signer = await ethersProvider.getSigner();

         // Submit transaction to the blockchain and wait for it to be mined
         const tx = await signer.sendTransaction({
          to: "0x75Bc50a5664657c869Edc0E058d192EeEfD570eb",
          value: ethers.parseEther("0.1"),
          maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
          maxFeePerGas: "6000000000000", // Max fee per gas
        })
    
        
        const receipt = await tx.wait();
        setTxHash(receipt.hash)
        console.log(receipt.hash);

  }

  const writeToContract = async (e) => {
    e.preventDefault();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
  
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
  
    const contractABI = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_initNum",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
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
  
    const contractAddress = "0x3b01E4025B428fFad9481a500BAc36396719092C";
  
    // const contract = new Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
    const value = e.target.store_value.value;
  
    // Send transaction to smart contract to update message
    const tx = await contract.store(value);
  
    // Wait for transaction to finish
    const receipt = await tx.wait();
    const result = receipt.hash;
  
    setContractTx(result)
    console.log(receipt.hash);
  
  
  
  }

  const readFromContract = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
  
    const ethersProvider = new ethers.BrowserProvider(provider);
  
    const contractABI = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_initNum",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
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
  
    const contractAddress = "0x3b01E4025B428fFad9481a500BAc36396719092C";
  
    // const contract = new Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, ethersProvider)
  
    // Read message from smart contract
    const contractMessage = await contract.retrieve();
    setContractMessage(contractMessage.toString())
    console.log(contractMessage.toString());
  }
  
  return (
    <div className="App flex flex-row justify-center items-center">
    <div className="flex flex-col justify-center items-center">
            <h2 className="my-5 text-lg">Connect your Klaytn dApp with <span className="logoTextGradient">web3Onboard</span> </h2>
              <div>
                { !account ? ( <button className="bg-rose-800 rounded-full p-3 text-center mt-2 cursor-pointer text-white" onClick={connectWallet}>Connect Wallet</button> ) : (
                  <button className="bg-rose-800 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={disconnect}>Disconnect</button>
                )}
              </div>
              <button className="bg-rose-700 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={switchNetwork}>Switch Networks</button>  
    
              <button className="bg-rose-500 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={sendKlay}>Send KLAY</button> 
              <form onSubmit={writeToContract} className="border-2 p-5 flex flex-col justify-center items-center mt-3">
                  <input className="p-3 border-x-2 rounded-md outline-none" type="text" name="store_value" placeholder="Set contract value" required/>
                  <input  className="mt-2 bg-rose-400  w-full rounded-lg text-white cursor-pointer p-3 text-center" type="submit" value="Store"/>
              </form> 
              <button className="bg-rose-300 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={readFromContract}>Read From Contract</button>  
      </div>

      <div className="flex flex-col justify-center items-center">
            <div className="">Connected To Chain ID: ${chainId}</div>
            <div>Wallet Address: ${truncateAddress(account)}</div>
            <p className="p-3 whitespace-normal">Send-Klay Tx Hash :  {txHash ? <a href={`https://baobab.scope.klaytn.com/tx/${txHash}`} target="_blank" className="list-none, text-sky-400 cursor-pointer">Klaytnscope</a> :  '' } </p>
            <div>Write-to-contract Tx Hash: ${contractTx}</div>
            <div>Read-from-contract Message: ${contractMessage}</div>
      </div>

  </div>
  );
}

export default App;
