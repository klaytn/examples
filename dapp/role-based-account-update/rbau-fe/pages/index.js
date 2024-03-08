import Web3 from 'web3';
import React, { useState } from 'react' 
import { useToast } from '@chakra-ui/react'

import Web3Modal from '@klaytn/web3modal'
import { KaikasWeb3Provider } from '@klaytn/kaikas-web3-provider'
import { byteCode, abi, sampleContract } from './constants';
import { LinkIcon } from '@chakra-ui/icons';
const Caver = require('caver-js')
const caver = new Caver('https://public-en-baobab.klaytn.net/')

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const DEFAULT_ADDRESS_MESSAGE = "Creating RoleBased Wallet !";
  const [address, setAddress] = useState(DEFAULT_ADDRESS_MESSAGE);
  const [accountPrivateKey, setAccountPrivateKey] = useState('');
  const [newAccountPrivateKey, setNewAccountPrivateKey] = useState('');
  const [currentPrivateKey, setCurrentPrivateKey] = useState('');
  const [amount, setAmount] = useState(1);


  const [balance, setBalance] = useState(0);
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [web3Instance, setWeb3Instance] = useState();
  const [deployerOutput, setDeployerOutput] = useState('');
  const [deployedContract, setDeployedContract] = useState('');
  const [web3Modal, setWeb3Modal] = useState();
  const toast = useToast()
  const targetNetworkId = process.env.CHAINID || "1001";
  const API_BASEURL = process.env.API_BASEURL || "http://localhost:3001/api";
  const keyString = 'keyString';
  const valueString = 'valueString';
  const providerOptions = {
    kaikas: {
      package: KaikasWeb3Provider
    }
  };

  React.useEffect(() => {
    const _web3Modal = new Web3Modal({
      cacheProvider: false,
      disableInjectedProvider: false,
      providerOptions
    });
    
    setWeb3Modal(_web3Modal);
  }, [])

  const checkNetwork = (_currentChainId) => {
    return _currentChainId == targetNetworkId;
  }

  const reset = async () => {
    setAddress(DEFAULT_ADDRESS_MESSAGE);
    setBalance('0');
    setIsFeatureActive(false);
    setWeb3Instance(null);
    setDeployerOutput('');
    setDeployedContract('');
    setCurrentPrivateKey('');
    setAccountPrivateKey('');
    setNewAccountPrivateKey('');
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  }

  const disconnect = async () => {
    setIsFeatureActive(false);
    setUsername('');
    setPassword('');

    setAccountPrivateKey('');
    setCurrentPrivateKey('');
    setAddress(DEFAULT_ADDRESS_MESSAGE)

    reset();
    toast({
      title: 'Disconnected',
      description: "Disconnected from Baobab network",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const signDeployer = async () => {
    if(!byteCode) return toast({
      title: 'Error',
      description: "Please provide valid byteCode",
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    if(web3Instance.klay) {
      let data = byteCode + web3Instance.abi.encodeParameters(['string','string'], [keyString, valueString]).replace("0x", "");
      const txData = {
        type: 'FEE_DELEGATED_SMART_CONTRACT_DEPLOY',
        from: address,
        data,
        gas: 1000000,
        value: caver.utils.toPeb("0", 'KLAY')
      }

      const { rawTransaction } = await web3Instance.klay.signTransaction(txData)
      setDeployerOutput(rawTransaction);
      deployerOutput = rawTransaction;
      
      toast({
        title: 'Status',
        description: "Deployer Signed successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Error',
        description: "Please connect to valid Wallet",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const signFeePayer = () => {
    if(!deployerOutput) {
      toast({
        title: 'Error',
        description: "Deployer Signature invalid",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    let provider;
    if(web3Instance.klay) {
      provider = "kaikas";
    } else {
      toast({
        title: 'Error',
        description: "Not a valid provider",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }


  }

  const login = () => {
    setIsFeatureActive(true);
    toast({
      title: 'Status',
      description: "Requesting RoleBasedAccount Creation to Service Provider",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    
    fetch(API_BASEURL+'/register', requestOptions)
        .then(response => response.json())
        .then(data => {
          if(data.success) {
            toast({
              title: 'Status',
              description: "New RoleBasedAccount Created with Transaction Role",
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
            setAccountPrivateKey(data.userPrivKey);
            setAddress(data.userPubKey)
            setCurrentPrivateKey(data.userPrivKey)
          } else {
            toast({
              title: 'Status',
              description: "Problem in account creation : "+data.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          }
        }).catch(err => {
          toast({
            title: 'Status',
            description: "Problem in account creation : "+err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        });
  }

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const onCurrentPrivateKeyChange = (e) => {
    setCurrentPrivateKey(e.target.value);
  }

  const sendTransaction = async (e) => {
    try {
      const pubKey = address;
      const privKey = currentPrivateKey;
  
      const keyring = caver.wallet.keyring.create(pubKey, privKey);
  
      const senderAddress = keyring.address;
      const recipientAddress = keyring.address;
      
      caver.wallet.remove(keyring.address)
      caver.wallet.add(keyring)
      const vt = caver.transaction.valueTransfer.create({
          from: senderAddress,
          to: recipientAddress,
          value: caver.utils.toPeb(amount, 'KLAY'),
          gas: 1000000,
      })
      const signed = await caver.wallet.sign(senderAddress, vt)
      const rawTx = signed.getRawTransaction()
  
      // Send the transaction
      const vtReceipt = await caver.rpc.klay.sendRawTransaction(rawTx)
  
      toast({
        title: 'Status',
        description: "Value Transferred : "+vtReceipt.transactionHash,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      console.log(`Transaction Hash: ${vtReceipt.transactionHash}`);
    } catch(err) {
      toast({
        title: 'Status',
        description: "Value Transfer error : "+err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

  }

  const updateAccountRequest = (e) => {
    toast({
      title: 'Status',
      description: "Requested Change PrivateKey to Service Provider",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    
    fetch(API_BASEURL+'/updatePrivateKey', requestOptions)
        .then(response => response.json())
        .then(data => {
          if(data.success) {
            toast({
              title: 'Status',
              description: "New PrivateKey Provided",
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
            setNewAccountPrivateKey(data.userPrivKey);
            setAddress(data.userPubKey)
            setCurrentPrivateKey(data.userPrivKey)
          } else {
            toast({
              title: 'Status',
              description: "Problem in account renew: "+data.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          }
        }).catch(err => {
          toast({
            title: 'Status',
            description: "Problem in account  : "+err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        });
  }

  const refreshBalance = async () => {

    const pubKey = address;
    const privKey = currentPrivateKey;

    const keyring = caver.wallet.keyring.create(pubKey, privKey);

    // const accountKey = await caver.rpc.klay.getAccountKey(keyring.address)
    const hexBalance = await caver.rpc.klay.getBalance(keyring.address)
    setBalance(caver.utils.fromPeb(hexBalance, 'KLAY'))
  }


  return (
    <div>
      <div id="root">
        <div className="App">
          <div className="KlaytnPage">
            <header className="Nav">
              <div className="Nav__inner">
                <h1 className="Nav__logo">
                  <a href="/">
                    <img src="logo.png" alt="Dapp Kit"/>
                  </a>
                </h1>
                <div>
                  {isFeatureActive  &&
                    <span className="Nav__network" id="connectButton" onClick={disconnect} style={{ cursor: 'pointer' }}>
                      Disconnect
                    </span>
                  } 
                </div>
                
              </div>
            </header>
            <div className="KlaytnPage__main">
              { !isFeatureActive && <>
                  <h3>Login</h3>
                  <div className="Input">
                    <input id="from" type="text" name="from" placeholder="Username" className="Input__input" autoComplete="off" value={username} onChange={onUsernameChange} />
                  </div>
                  <div className="Input">
                    <input id="from" type="text" name="from" placeholder="Password" className="Input__input" autoComplete="off" value={password} onChange={onPasswordChange}/>
                  </div>
                  <button className="Button" onClick={login}>
                    <span>Submit</span>
                  </button>
                </>
              }
              { isFeatureActive &&
                <div className="WalletInfo">
                  <h2 className="WalletInfo__title">Wallet Information</h2>
                  <div className="WalletInfo__infoBox">
                    <div className="WalletInfo__info">
                      <span className="WalletInfo__label">Wallet Address</span><span id="addressSpan">{address}</span>
                    </div>
                    <div className="WalletInfo__info">
                      <span className="WalletInfo__label">Balance</span>
                      <span className="WalletInfo__balance" id="balanceSpan">{balance}</span>
                      <span className="WalletInfo__unit">KLAY</span>
                    </div>
                  </div>
                  <p className="WalletInfo__faucet">If you need small amount of Klay for testing<a className="WalletInfo__link" href="https://baobab.wallet.klaytn.foundation/faucet" target="_blank" rel="noreferrer noopener">Klay Faucet</a>
                  </p>
                  <br/>
                  <button className="Button" onClick={refreshBalance}>
                    <span>Refresh Balance</span>
                  </button>
                </div>
              }
              { isFeatureActive == true && <div className="KlaytnPage__content" id="feature">
                <div className="Dropdown KlaytnPage__dropdown">
                  <div className="Dropdown__title">Value Transfer (RoleBased - Transaction Role)</div>
                </div>
                <div className="KlaytnPage__txExample">
                  <h2 className="KlaytnPage__txExampleTitle">
                    <b>Service Generated Private Key:</b> <br/>
                    { !newAccountPrivateKey && <span style={{ color: '#FF4500' }}>{accountPrivateKey}</span> }
                    { newAccountPrivateKey && 
                      <>
                        <span style={{ color: 'grey' }}>{accountPrivateKey}</span> <br/>
                        <span style={{ color: '#FF4500' }}>{newAccountPrivateKey}</span> <br/>
                      </>
                    }
                  </h2>
                  
                  <div className="Input">
                    <input type="text" placeholder="" className="Input__input" autoComplete="off" value={currentPrivateKey} onChange={onCurrentPrivateKeyChange}/>
                  </div>
                  <h2 className="KlaytnPage__txExampleTitle"><b>Value Transfer (RoleBased - Transaction Role)</b></h2>
                  <div>
                    <h3>From Address</h3> 
                    <div className="Input">
                      <input type="text" disabled placeholder="From Address" className="Input__input" autoComplete="off" value={address}/>
                    </div>
                    <h3>To Address</h3> 
                    <div className="Input">
                      <input type="text" disabled placeholder="To Address" className="Input__input" autoComplete="off" value={address}/>
                    </div>
                    <h3>Amount</h3> 
                    <div className="Input">
                      <input type="text" disabled placeholder="Amount" className="Input__input" autoComplete="off" value={1}/>
                    </div>
                    <button className="Button" onClick={sendTransaction}>
                      <span>Send KLAY</span>
                    </button>
                    <br/><br/>
                    <button className="Button" onClick={updateAccountRequest}>
                      <span>Request Change PrivateKey</span>
                    </button>
                  </div>
                </div>
              </div> }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
