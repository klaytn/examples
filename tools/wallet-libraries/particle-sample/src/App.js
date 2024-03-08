import React, { useState } from 'react';
import { ethers, ContractFactory } from 'ethers';
import { useParticleProvider, ConnectButton, useParticleConnect } from '@particle-network/connectkit';
import '@particle-network/connectkit/dist/index.css';
import { getUserInfo as getParticleUserInfo } from '@particle-network/auth-core';

function App() {

  const provider = useParticleProvider();

  const { disconnect } = useParticleConnect();

  const [balance, setBalance] = useState();
  const [address, setAddress] = useState();
  const [userData, setUserSocialData] = useState({});
  const [signedMessage, setSignedMessage] = useState("");
  const [txHash, setTxHash] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [contractTx, setContractTx] = useState("");
  const [contractMessage, setContractMessage] = useState("");

  const getUserSocialInfo = async () => {
      const userInfo = getParticleUserInfo();
      console.log(userInfo);
      setUserSocialData(userInfo);
  };

  const getWalletAndBalance = async() => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    // this guide uses ethers version 6.3.0.
      const ethersProvider = new ethers.BrowserProvider(provider);
      // for ethers version below 6.3.0.
      // const provider = new ethers.providers.Web3Provider(web3authProvider);

  
      const signer = await ethersProvider.getSigner();
  
      // Get user's Ethereum public address
      const address = signer.address;
  
      // Get user's balance in ether
      const balance = ethers.formatEther(
        await ethersProvider.getBalance(address) // balance is in wei
      );
  
      setAddress(address);
      setBalance(balance);
}

const sendKlay = async () => {
  if (!provider) {
    console.log("provider not initialized yet");
    return;
  }

      const destination = "0x75Bc50a5664657c869Edc0E058d192EeEfD570eb";
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();
      
      // Submit transaction to the blockchain and wait for it to be mined
      const tx = await signer.sendTransaction({
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

const refreshState = () => {
  setAddress("");
  setBalance("");
  setUserSocialData({});
  setSignedMessage("");
  setTxHash("");
  setContractAddress("");
  setContractTx("");
  setContractMessage("");
// make sure to add every other useState modifier function declared here.
}

const disconnectUser = async () => {
  await disconnect();
  refreshState();
}


  return (
      <div className="App flex flex-col justify-center p-8">
          <div className="flex flex-col">
              <div className='flex flex-row justify-between items-center gap-4'>
                <h2 className="my-5 text-lg">Connect your Klaytn dApp with <br/> <span className="logoTextGradient">Particle Network</span> </h2>
                <div>
                    <ConnectButton className="bg-rose-800 rounded-full p-3 text-center mt-2 cursor-pointer text-white" />
                </div>
              </div>

              <div className='flex flex-row gap-5 justify-center items-center mt-10'>
                <button className="bg-rose-700 text-white  p-3 text-center mt-2 cursor-pointer" onClick={getWalletAndBalance}>Get Wallet Account and Balance</button>  
                <button className="bg-rose-700 text-white  p-3 text-center mt-2 cursor-pointer" onClick={getUserSocialInfo}>Get User Social Info</button>  
                <form onSubmit={signMessage} className="border-2 p-5 flex flex-col justify-center items-center mt-3">
                    <input className="p-3 border-x-2 rounded-md outline-none" type="text" name="message" placeholder="Set message" required/>
                    <input className="mt-2 bg-rose-600  w-full  text-white cursor-pointer p-3 text-center" type="submit" value="Sign Message"/>
                </form> 
                <button className="bg-rose-700 text-white p-3 text-center mt-2 cursor-pointer" onClick={deployContract}>Deploy pre-built storage contract</button>  
                <button className="bg-rose-500 text-white p-3 text-center mt-2 cursor-pointer" onClick={sendKlay}>Send KLAY</button> 
                <form onSubmit={writeToContract} className="border-2 p-5 flex flex-col justify-center items-center mt-3">
                    <input className="p-3 border-x-2 rounded-md outline-none" type="text" name="store_value" placeholder="Set contract value" required/>
                    <input className="mt-2 bg-rose-400  w-full text-white cursor-pointer p-3 text-center" type="submit" value="Store"/>
                </form> 
                <button className="bg-rose-300 text-white p-3 text-center mt-2 cursor-pointer" onClick={readFromContract}>Read From Contract</button> 
                <button className="bg-rose-800 text-white p-3 text-center mt-2 cursor-pointer" onClick={disconnectUser}>Disconnect</button> 
              </div> 
          </div>

          <div className="flex flex-col justify-center items-center mt-20">
              <div>Wallet Address: ${address} Balance: ${balance}</div>
              <p className="p-3 whitespace-normal"> { userData ? `User Email: ${userData.google_email}` :  ""} </p>
              <div>SignedMessage: ${signedMessage}</div>
              <p className="p-3  whitespace-normal">Contract Address: {contractAddress ? contractAddress : ''} </p>
              <p className="p-3 whitespace-normal">Send-Klay Tx Hash :  {txHash ? <a href={`https://baobab.scope.klaytn.com/tx/${txHash}`} target="_blank" className="list-none, text-sky-400 cursor-pointer">Klaytnscope</a> :  '' } </p>
              <div>Write-to-contract Tx Hash: {contractTx}</div>
              <div>Read-from-contract Message: {contractMessage}</div>
          </div>
      </div>
  );

}

export default App;