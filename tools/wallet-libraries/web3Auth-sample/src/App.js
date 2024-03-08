import { Web3Auth } from "@web3auth/modal";
import {  ContractFactory, ethers } from "ethers";
import { useState, useEffect } from "react";
import { truncateAddress } from "./utils";


function App() {

  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [signedMessage, setSignedMessage] = useState("");
  const [contractAddress, setContractAddress] = useState(null);
  const [contractMessage, setContractMessage] = useState(null);
  const [sendContractTx, setContractTx] = useState(null);

useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: "BO5aG1ZKZEEtM40YNQO8yQpo3_WFGnnb3caw_MQcHOn9U_b5yUm-oqBZrSJ2dUZvG_LAQr2eiVjSQdg34k1-pWU", // get it from Web3Auth Dashboard
          web3AuthNetwork: "cyan",
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x3e9", // hex of 1001, Klaytn Boabab testnet
            rpcTarget: "https://public-en-baobab.klaytn.net",
            // Avoid using public rpcTarget in production.
            // Use services like Infura, Quicknode etc
            displayName: "Klaytn Testnet",
            blockExplorer: "https://baobab.scope.klaytn.com/",
            ticker: "KLAY",
            tickerName: "KLAY",
          },
        })
        setWeb3auth(web3auth);
        await web3auth.initModal();
        setProvider(web3auth.provider);
      } catch (error) {
        console.error(error);
      }
    };

    init();
}, []);

const connectWallet = async() => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    console.log(web3authProvider);
    setProvider(web3authProvider);
    const ethersProvider = new ethers.BrowserProvider(web3authProvider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address =   signer.address;
    // Get user's balance in ether
    const balance = ethers.formatEther(
      await ethersProvider.getBalance(address) // Balance is in wei
    );
    console.table(address, balance);
    setAddress(address);
    setBalance(balance);
}

const disconnect = async () => {
  if (!web3auth) {
    console.log("web3auth not initialized yet");
    return;
  }

  await web3auth.logout();
  refreshState();
}

const switchChain = async () => {
  if (!web3auth) {
    console.log("web3auth not initialized yet");
    return;
  }

  // add chain 
  await web3auth.addChain({
    chainId: "0x2019",
    displayName: "Klaytn Cypress",
    chainNamespace: "eip155",
    tickerName: "Cypress",
    ticker: "KLAY",
    decimals: 18,
    rpcTarget: "https://klaytn-mainnet-rpc.allthatnode.com:8551",
    blockExplorer: "https://scope.klaytn.com",
  });

  // switch chain
  await web3auth.switchChain({chainId: "0x2019"});
}

const refreshState = () => {
  setAddress();
  setBalance();
  setTxHash();
  setSignedMessage();
  setUserData();
  setContractMessage();
  setContractAddress();
  setContractTx();
}

const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    setUserData(user);
    console.log(user);
};

const sendKlay = async () => {
  if (!provider) {
    console.log("provider not initialized yet");
    return;
  }

      const destination = "0x75Bc50a5664657c869Edc0E058d192EeEfD570eb";
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();
      
      // Submit transaction to the blockchain and wait for it to be mined
      const tx = await (await signer).sendTransaction({
        to: destination,
        value: ethers.parseEther("0.1"),
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      })
  
      
      const receipt = await tx.wait();
      console.log(receipt);
      setTxHash(receipt.hash)

}

const signMessage = async(e) => {
  e.preventDefault();
  if (!provider) {
    console.log("provider not initialized yet");
    return;
  }

  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();

  const originalMessage = e.target.message.value;
  const signedMessage =  signer.signMessage(originalMessage);
  const result = await signedMessage;
  console.log(result);
  setSignedMessage(result)  
}

const deployContract = async () => {
  if (!provider) {
    console.log("provider not initialized yet");
    return;
  }

  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer =  await ethersProvider.getSigner();

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

  const contractBytecode = '608060405234801561001057600080fd5b506040516102063803806102068339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b610150806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea26469706673582212200370e757ac1c15a024febfa9bf6999504ac6616672ad66bd654e87765f74813e64736f6c63430008120033'

  const contractFactory = new ContractFactory(contractABI, contractBytecode, signer);

  const contract = await contractFactory.deploy(400);

  // Wait for deployment to finish
  setContractAddress(contract.target)
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

const writeToContract = async (e) => {
  e.preventDefault()
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


return (
  
    <div className="App flex flex-row justify-center items-center">
      <div className="flex flex-col justify-center items-center">
              <h2 className="my-5 text-lg">Connect your Klaytn dApp with <span className="logoTextGradient">web3Auth</span> </h2>
                <div>
                  { !address ? ( <button className="bg-rose-800 rounded-full p-3 text-center mt-2 cursor-pointer text-white" onClick={connectWallet}>Connect Wallet</button> ) : (
                    <button className="bg-rose-800 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={disconnect}>Disconnect</button>
                  )}
                </div>
                <button className="bg-rose-700 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={getUserInfo}>Get UserInfo</button>  
                <form onSubmit={signMessage} className="border-2 p-5 flex flex-col justify-center items-center mt-3">
                    <input className="p-3 border-x-2 rounded-md outline-none" type="text" name="message" placeholder="Set message" required/>
                    <input  className="mt-2 bg-rose-600  w-full rounded-lg text-white cursor-pointer p-3 text-center" type="submit" value="Sign Message"/>
                </form> 
                <button className="bg-rose-700 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={deployContract}>Deploy pre-built storage contract</button>  
                <button className="bg-rose-700 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={switchChain}>Switch Chain</button>
                <button className="bg-rose-500 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={sendKlay}>Send KLAY</button> 
                <form onSubmit={writeToContract} className="border-2 p-5 flex flex-col justify-center items-center mt-3">
                    <input className="p-3 border-x-2 rounded-md outline-none" type="text" name="store_value" placeholder="Set contract value" required/>
                    <input  className="mt-2 bg-rose-400  w-full rounded-lg text-white cursor-pointer p-3 text-center" type="submit" value="Store"/>
                </form> 
                <button className="bg-rose-300 text-white rounded-full p-3 text-center mt-2 cursor-pointer" onClick={readFromContract}>Read From Contract</button>  
        </div>

        <div className="flex flex-col justify-center items-center">
              <div>Wallet Address: ${truncateAddress(address)} Balance: ${balance}</div>
              <p className="p-3 whitespace-normal"> { userData ? `User Email: ${userData.email}, User Name: ${userData.name}` :  ""} </p>
              <div>SignedMessage: ${signedMessage}</div>
              <p className="p-3  whitespace-normal">Contract Address: {contractAddress ? contractAddress : ''} </p>
              <p className="p-3 whitespace-normal">Send-Klay Tx Hash :  {txHash ? <a href={`https://baobab.scope.klaytn.com/tx/${txHash}`} target="_blank" className="list-none, text-sky-400 cursor-pointer">Klaytnscope</a> :  '' } </p>
              <div>Write-to-contract Tx Hash: ${sendContractTx}</div>
              <div>Read-from-contract Message: ${contractMessage}</div>
        </div>

    </div>
    
  );
}

export default App;
