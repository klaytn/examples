import Web3 from 'web3';
import React, { useState } from 'react' 
import { useToast } from '@chakra-ui/react'

import Web3Modal from '@klaytn/web3modal'
import { KaikasWeb3Provider } from '@klaytn/kaikas-web3-provider'

export default function Home() {
  const DEFAULT_ADDRESS_MESSAGE = "Connect with Wallet :)";
  const [address, setAddress] = useState(DEFAULT_ADDRESS_MESSAGE);
  const [balance, setBalance] = useState(0);
  const [connectButtonLabel, setConnectButtonLabel] = useState("Connect");
  const [web3Instance, setWeb3Instance] = useState();
  const [web3Modal, setWeb3Modal] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const toast = useToast()

  const targetNetworkId = process.env.CHAINID || "1001";
  const API_BASEURL = process.env.API_BASEURL || "http://localhost:3001";

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
    if (web3Instance && web3Instance.currentProvider && web3Instance.currentProvider.close) {
      await web3Instance.currentProvider.close()
    }
    setAddress(DEFAULT_ADDRESS_MESSAGE);
    setBalance('0');
    setConnectButtonLabel("Connect");
    setWeb3Instance(null);
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    setIsLoggedIn(false);
    setJwtToken('');
  }

  const reload = async () => {
    const provider = await web3Modal.connect();
    if(! checkNetwork(provider.networkVersion || provider.chainId)) {
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
    setWeb3Instance(web3);
    return { provider, web3, _address: _address.toLowerCase() };
  }

  const disconnect = async () => {
    reset();
    toast({
      title: 'Status',
      description: "Logged Out",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const connect = async () => {
    if(!(connectButtonLabel == 'Connect')) {
      return;
    }
    try {
      let { provider, web3, _address} = await reload();

      provider.on('accountsChanged', async (_accounts) => {
        setAddress(_accounts[0].toLowerCase());
        if(web3Instance && web3Instance.eth) {
          let _balance = await web3Instance.eth.getBalance(_accounts[0]);
          if(_balance) {
            _balance = web3Instance.utils.fromWei(_balance, "ether").replace(/(\.\d\d\d).*/,"$1");
            setBalance(_balance.toString());
          }
        } else if(web3Instance && web3Instance.klay){
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

      return { web3, _address};
      
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

  const register = async (_address) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: _address })
      };
      try {
        let response = await fetch(API_BASEURL+'/auth/register', requestOptions);
        response = await response.json();
        if(response && response.success) {
          toast({
            title: 'Registered',
            description: "Registered successfully",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          throw new Error("Problem while registering");
        }
      } catch(err) {
        throw new Error("Problem while connecting to wallet");
      }
  }

  const login = async () => {
    try {
      debugger;
      // Connecting to wallet
      let {web3, _address} = await connect();
      // Registering the User
      await register(_address);
      // Requesting the nonce for user
      let result = await requestNonce(_address);
      if(result.success == false) {
        throw new Error("Problem while generating nonce");
      }
      let signature = await signMessage(result.data.nonce, web3, _address);
      // User login
      let _provider;
      if(web3.eth) {
        _provider = "metamask";
      } else if(web3.klay) {
        _provider = "kaikas";
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: _address, signature: signature, provider: _provider })
      };
      fetch(API_BASEURL+'/auth/login', requestOptions)
        .then(response => response.json())
        .then(data => {
          debugger;
          if(data.success) {
            setJwtToken(data.data.token)
            toast({
              title: 'Login Status',
              description: "Logged-in successfully",
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setIsLoggedIn(true);
          } else {
            reset();
            toast({
              title: 'Login Status',
              description: "Login failure "+data.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          }
        }).catch(err => {
          reset();
          toast({
            title: 'Login Status',
            description: "Problem while logging in"+err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        });
    } catch(err) {
      reset();
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const requestNonce = async (_address) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: _address })
    };
    return await fetch(API_BASEURL+'/auth/nonce', requestOptions).then(response => response.json())
  }

  const signMessage = async (_nonce, web3, _address) => {
    _nonce = `Nonce : ${_nonce}`
    if(!_nonce) return toast({
      title: 'Error',
      description: "Please provide valid message",
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    let _signature;
    if(web3.eth) {
      _signature = await window.ethereum.request({ method: 'personal_sign', params: [_address, _nonce] });
    } else if(web3.klay) {
      _signature = await web3.klay.sign(_nonce, _address);
    } else {
      toast({
        title: 'Error',
        description: "Please check the wallets properly",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    toast({
      title: 'Status',
      description: "Messsage Signed successfully",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    return _signature;
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
                    <img src="logo.png" alt="Klaytn Snap Tutorial"/>
                  </a>
                </h1>
                { connectButtonLabel != 'Connect' ? 
                  <div className="Nav__network" style={{cursor: 'pointer'}} id="connectButton" onClick={connect}>
                    {connectButtonLabel}
                  </div>: <></>
                }
              </div>
            </header>
            <div className="KlaytnPage__main">
              { isLoggedIn == false ?
              <div className="WalletInfo">
                <h2 className="WalletInfo__title">Authentication</h2>
                <div style={{width: "500px", margin: "20px auto"}}>
                  <button className="Button" onClick={login} style={{cursor: 'pointer'}}>
                    <span>Login With Wallet</span>
                  </button>
                </div>
                <p className="WalletInfo__faucet">If you need small amount of Klay for testing. <a className="WalletInfo__link" href="https://baobab.wallet.klaytn.foundation/faucet" target="_blank" rel="noreferrer noopener">Run Klay Faucet</a>
                </p>
              </div> :
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
                <p className="WalletInfo__faucet">If you need small amount of Klay for testing. <a className="WalletInfo__link" href="https://baobab.wallet.klaytn.foundation/faucet" target="_blank" rel="noreferrer noopener">Run Klay Faucet</a>
                </p>
              </div> }
              { isLoggedIn == true && <div className="KlaytnPage__content" id="feature">
                <div className="Dropdown KlaytnPage__dropdown">
                  <div className="Dropdown__title">Successfully Logged In</div>
                </div>
                <div className="CodeBlockExample">
                  <h3>JWT Token</h3>
                  <div className="CodeBlockExample__code">{jwtToken}</div>
                  <h3 style={{marginTop: "10px"}}>This JWT Token can be used for authentication of multiple api calls to the Backend</h3>
                </div>
                <div className="KlaytnPage__txExample">
                  <div>
                    <button className="Button" onClick={disconnect}>
                      <span>Logout</span>
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
