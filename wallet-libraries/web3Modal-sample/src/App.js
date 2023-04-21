import { useState, useEffect } from "react";

import Web3Modal from "@klaytn/web3modal";
import { ethers } from "ethers";

import { toHex, truncateAddress } from "./utils";

import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { KaikasWeb3Provider } from "@klaytn/kaikas-web3-provider";
import { KlipWeb3Provider } from "@klaytn/klip-web3-provider"

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Klaytn_coinbase_app", // Required
      infuraId: "2GRIlYZcPcjuJFU79rzmWlhtst4", // Required
      rpc: "https://klaytn-mainnet-rpc.allthatnode.com:8551", // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1001, // Optional. It defaults to 1 if not provided
      darkMode: false // Optional. Use dark theme, defaults to false
    }
  },

  klip: {
    package: KlipWeb3Provider, //required
    options: {
        bappName: "web3Modal Klaytn dApp", //required
        rpcUrl: "https://klaytn-mainnet-rpc.allthatnode.com:8551" //required
    }
},
  kaikas: {
    package: KaikasWeb3Provider // required
  }
};

function App() {
  
  const [provider, setProvider] = useState();
  // const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  // const [balance, setBalance] = useState();
  const [chainId, setChainId] = useState();
  const [signedMessage, setSignedMessage] = useState();
  const [txHash, setTxHash] = useState();
  const [contractTx, setContractTx] = useState();
  const [contractMessage, setContractMessage] = useState();

  const  web3Modal = new Web3Modal( {
    cacheProvider: true,
    providerOptions,
  } )

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts);
      };
  
      const handleChainChanged = (chainId) => {
        setChainId(chainId);
      };
  
      const handleDisconnect = () => {
        disconnect();
      };
  
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);
  
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  const connectWallet = async () => {
    try {
      const web3ModalProvider = await web3Modal.connect();
      const ethersProvider = new ethers.BrowserProvider(web3ModalProvider);
      const accounts = await ethersProvider.listAccounts();
      const network = await ethersProvider.getNetwork();
      setProvider(web3ModalProvider);
      // setLibrary(ethersProvider);
      if (accounts) setAccount(accounts[0].address);

      // const balance = ethers.formatEther(
      //   await web3ModalProvider.getBalance(accounts[0].address) // Balance is in wei
      // );
      setChainId(network.chainId.toString());
      // setBalance(balance);
    } catch (error) {
        console.log(error);
    }
  }

  const refreshState = () => {
    setAccount();
    setChainId();
    // setBalance();
    setSignedMessage();
    setTxHash();
    setContractMessage();
    setContractTx();
  };

  
  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
      refreshState();
  };

  const switchNetwork = async () => {
    if (!provider) return;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(8217) }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: toHex(8217),
                chainName: "Klaytn TestNet",
                rpcUrls: ["https://klaytn-mainnet-rpc.allthatnode.com:8551"],
                blockExplorerUrls: ["https://baobob.scope.com/"],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      }
    }
  };

  const signMessage =  async (e) => {
    e.preventDefault()
    if (!provider) return;
    const message = e.target.message.value;
    try {
      const signature = await provider.request({
        method: "personal_sign",
        params: [message, account]
      });
      // setSignedMessage(message);
      setSignedMessage(signature);
      console.log(signature);
    } catch (error) {
      console.log(error);
    }
  }

  const sendKlay = async ()  => {
    if (!provider) return;

    const ethersProvider = new ethers.BrowserProvider(provider);

    const signer = await ethersProvider.getSigner();

         // Submit transaction to the blockchain and wait for it to be mined
         const tx = await signer.sendTransaction({
          to: "0x1C42aCcd92d491DB8b083Fa953B5E3D9A9E42aD5",
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
    if (!provider) return;

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
    if (!provider) return;

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
              <h2 className="my-5 text-lg">Connect your Klaytn dApp with <span className="logoTextGradient">web3Modal</span> </h2>
                <div>
                  { !account ? ( <button className="bg-rose-800 rounded-full p-3 text-center mt-2 cursor-pointer text-white" onClick={connectWallet}>Connect Wallet</button> ) : (
                    <button className="bg-rose-800 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={disconnect}>Disconnect</button>
                  )}
                </div>
                <button className="bg-rose-700 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={switchNetwork}>Switch Networks</button>  
                <form onSubmit={signMessage} className="border-2 p-5 flex flex-col justify-center items-center mt-3">
                    <input className="p-3 border-x-2 rounded-md outline-none" type="text" name="message" placeholder="Set message" required/>
                    <input  className="mt-2 bg-rose-600  w-full rounded-lg text-white cursor-pointer p-3 text-center" type="submit" value="Sign Message"/>
                </form> 
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
              <div>SignedMessage: ${signedMessage}</div>
              <p className="p-3 whitespace-normal">Send-Klay Tx Hash :  {txHash ? <a href={`https://baobab.scope.klaytn.com/tx/${txHash}`} target="_blank" className="list-none, text-sky-400 cursor-pointer">Klaytnscope</a> :  '' } </p>
              <div>Write-to-contract Tx Hash: ${contractTx}</div>
              <div>Read-from-contract Message: ${contractMessage}</div>
        </div>

    </div>
  );
}

export default App;
