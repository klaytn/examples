import Web3 from 'web3';
import React, { useState } from 'react' 
import { useToast } from '@chakra-ui/react'

import Web3Modal from '@klaytn/web3modal'
import { KaikasWeb3Provider } from '@klaytn/kaikas-web3-provider'
import { byteCode, abi, sampleContract } from './constants';
import { LinkIcon } from '@chakra-ui/icons';

export default function Home() {
  const DEFAULT_ADDRESS_MESSAGE = "Connect with Wallet :)";
  const [address, setAddress] = useState(DEFAULT_ADDRESS_MESSAGE);
  const [balance, setBalance] = useState(0);
  const [connectButtonLabel, setConnectButtonLabel] = useState("Connect");
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [web3Instance, setWeb3Instance] = useState();
  const [deployerOutput, setDeployerOutput] = useState('');
  const [deployedContract, setDeployedContract] = useState('');
  const [web3Modal, setWeb3Modal] = useState();
  const toast = useToast()
  const targetNetworkId = process.env.CHAINID || "1001";
  const API_BASEURL = process.env.API_BASEURL || "http://localhost:3001";
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
    setConnectButtonLabel("Connect");
    setIsFeatureActive(false);
    setWeb3Instance(null);
    setDeployerOutput('');
    setDeployedContract('');
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  }

  const reload = async () => {
    let element = document.getElementsByClassName('web3modal-provider-wrapper');
    if(element.length > 1) {
      element[0].remove();
    }

    const provider = await web3Modal.connect();

    if(! checkNetwork(provider.networkVersion || provider.chainId)) {
      reset();
      throw new Error("Please select Baobab network");
    }



    let web3, _address, _balance = 0, _providerLabel = "";
    if(!provider.caver) {
      web3 = new Web3(provider);
      _address = provider.selectedAddress;
      _balance = await web3.eth.getBalance(_address);
      if(_balance) {
        _balance = web3.utils.fromWei(_balance, "ether").replace(/(\.\d\d\d).*/,"$1");
      }
      _providerLabel = "( Metamask )";
    } else if(provider.caver){
      web3 = provider.caver;
      let accounts = provider._addresses;
      _address = accounts[0];
      _balance = await web3.klay.getBalance(_address);
      if(_balance) {
        _balance = web3.utils.convertFromPeb(_balance, 'KLAY').replace(/(\.\d\d\d).*/,"$1");
      }
      _providerLabel = "( Kaikas )";
    }
    
    toast({
      title: 'Connected',
      description: "Connected to Baobab network",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    setAddress(_address.toLowerCase());
    setBalance(_balance.toString());
    setConnectButtonLabel("Baobab Network "+_providerLabel);
    setIsFeatureActive(true);
    setWeb3Instance(web3);
    return provider;
  }

  const disconnect = async () => {
    if (web3Instance && web3Instance.currentProvider && web3Instance.currentProvider.close) {
      await web3Instance.currentProvider.close()
    }
    reset();
    toast({
      title: 'Disconnected',
      description: "Disconnected from Baobab network",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const connect = async () => {
    if(!(connectButtonLabel == 'Connect')) {
      return false;
    }
    try {
      let provider = await reload();

      provider.on('accountsChanged', async (_accounts) => {
        setAddress(_accounts[0].toLowerCase());
        if(web3Instance.eth) {
          let _balance = await web3Instance.eth.getBalance(_accounts[0]);
          if(_balance) {
            _balance = web3Instance.utils.fromWei(_balance, "ether").replace(/(\.\d\d\d).*/,"$1");
            setBalance(_balance.toString());
          }
        } else if(web3Instance.klay){
          let _balance = await web3Instance.klay.getBalance(_accounts[0]);
          if(_balance) {
            _balance = web3Instance.utils.convertFromPeb(_balance, 'KLAY').replace(/(\.\d\d\d).*/,"$1");
            setBalance(_balance.toString());
          }
        }
      });

      provider.on('networkChanged', (_networkId) => {
        if(_networkId == targetNetworkId) {
          reload();
        } else {
          reset();
        }
      });
      
    } catch(err) {
      console.error("connection error "+ err.message || err);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
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

    toast({
      title: 'Status',
      description: "FeeDelegation inititated",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deployTx: deployerOutput })
    };
    
    fetch(API_BASEURL+'/feedelegation/', requestOptions)
        .then(response => response.json())
        .then(data => {
          if(data.success) {
            toast({
              title: 'Status',
              description: "FeeDelegation successful",
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
            setDeployedContract(data.contractAddress);
          } else {
            toast({
              title: 'Status',
              description: "Problem in feedelegation : "+data.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
            setDeployedContract('');
          }
        }).catch(err => {
          toast({
            title: 'Status',
            description: "Problem in feedelegation : "+err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          setDeployedContract('');
        });
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
                  <span className="Nav__network" id="connectButton" onClick={connect} style={{ cursor: 'pointer' }}>
                    {connectButtonLabel}
                  </span>
                  {connectButtonLabel != "Connect" ? 
                    <span className="Nav__network" id="connectButton" onClick={disconnect} style={{ cursor: 'pointer' }}>
                      Disconnect
                    </span>:
                    <></>
                  }
                </div>
                
              </div>
            </header>
            <div className="KlaytnPage__main">
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
              </div>
              { isFeatureActive == true && <div className="KlaytnPage__content" id="feature">
                <div className="Dropdown KlaytnPage__dropdown">
                  <div className="Dropdown__title">Smart Contract Deploy (Gasless Txn)</div>
                </div>
                <div className="KlaytnPage__txExample">
                  <h2 className="KlaytnPage__txExampleTitle">Smart Contract Deploy (Gasless Transaction)</h2>
                  <div>
                    <div className="CodeBlockExample">
                      <h3># contract example (Simple storage contract)</h3>
                      
                      <div className="CodeBlockExample__code">
                        {sampleContract}
                      </div>
                    </div>
                    <div className="CodeBlockExample">
                      <h3># abi example (Simple storage contract)</h3>
                      <div className="CodeBlockExample__code">{JSON.stringify(abi, null, 4)}</div>
                    </div>

                    <div className="CodeBlockExample">
                      <h3># bytecode example (Simple storage contract)</h3>
                      <div className="CodeBlockExample__code">{byteCode}</div>
                    </div>

                    <div className="CodeBlockExample">
                      <h3># input data (Simple storage contract)</h3>
                      <div className="CodeBlockExample__code">
                        key : {keyString} <br/>
                        value: {valueString}
                      </div>
                    </div>

                    <h3>Signer</h3>
                    <div className="Input">
                      <input id="from" type="text" name="from" disabled placeholder="Signer" className="Input__input" autoComplete="off" value={address} />
                    </div>
                    <button className="Button" onClick={signDeployer}>
                      <span>Sign Transaction</span>
                    </button>
                    { deployerOutput &&
                      <div className="CodeBlockExample">
                        <h3>signature</h3>
                        <div className="CodeBlockExample__code">{deployerOutput}</div>
                      </div>
                    }
                    { deployerOutput &&
                      <div className="Section">
                        <h3>Deploy Contract as Fee Payer</h3>
                        <button className="Button" onClick={signFeePayer}>
                          <span>Deploy</span>
                        </button>
                        { deployedContract && <div className="TxResult">
                          <h3 style={{cursor: 'pointer'}} onClick={() =>{
                            window.open('https://baobab.scope.klaytn.com/account/'+deployedContract,
                            '_blank');
                          }}>Deployed Contract Address <LinkIcon /></h3>
                          <div className="Input">
                            <input disabled type="text" placeholder="" className="Input__input" autoComplete="off" value={deployedContract}/>
                          </div>
                        </div>
                        }
                      </div>
                    }
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
