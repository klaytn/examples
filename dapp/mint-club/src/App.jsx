import { useState } from "react";
import { mintclub, wei } from "mint.club-v2-sdk";
import { curveData } from "./data";

export default function App() {
  const [buyTokensTxHash, setBuyTokensTxHash] = useState("");
  const [tokenDetails, setTokenDetails] = useState()
  const [createTokenTxHash, setCreateTokenTxHash] = useState("");
  const [approveTokensTxHash, setApproveTokensTxHash] = useState("");
  const [address, setAddress] = useState("");

  const handleConnectWallet = async () => {
    const address = await mintclub.wallet.connect();
    setAddress(address);
    console.log(address);
  };

  const handleDisconnectWallet = async () => {
    mintclub.wallet.disconnect();
    setAddress("");
  };

  const handleKkakdogBuyTokens = async (event) => {
    event.preventDefault();

    const _amount = event.target.amount.value;
    const _recipient = event.target.recipient.value;

    const result = await mintclub.network("klaytn").token("KKAKDOG").buy({
      amount: wei(_amount, 18),
      slippage: 0,
      recipient: _recipient,
    });
    console.log(result.transactionHash);
    setBuyTokensTxHash(result.transactionHash);
  };

  const handleCreateTokens = async (event) => {
    event.preventDefault();

    const _symbol = event.target.symbol.value;
    const _tname = event.target.tname.value;

    console.log(_symbol, _tname);

    await mintclub
      .network('klaytn')
      .token(_symbol)
      .create({
        name: _tname,
        reserveToken: {
          address: '0x19aac5f612f524b754ca7e7c41cbfa2e981a4432', // mainnet WKLAY token address 
          decimals: 18,
        }, 
        curveData,
        onSuccess: (receipt) => {
          console.log(receipt.transactionHash);
          setCreateTokenTxHash(receipt.transactionHash);
          
        },
        onError: (error) => {console.log(error);} 
      })
  };

  const handleApproveTokens = async (event) => {
    event.preventDefault();

    const _symbol = event.target.symbol.value;
    const _amount = event.target.amount.value;
    const _spender = event.target.spender.value;

    console.log(_symbol, _amount, _spender);

    try {
      const result = await mintclub
        .network("klaytn")
        .token(_symbol)
        .approve({
          amount: wei(_amount, 18),
          spender: _spender,
        });
      console.log(result.transactionHash);
      setApproveTokensTxHash(result.transactionHash);

    } catch (error) {
      console.log(error);
    }
  };

  const handleGetTokenDetails = async (event) => {
    event.preventDefault();

    const _symbol = event.target.symbol.value;

    console.log(_symbol);

    try {
      const detail = await mintclub.network('klaytn').token(_symbol).getDetail();
      console.log(detail.info);
      setTokenDetails(detail.info);

    } catch (error) {
      console.log(error);
    }

    // console.log(receipt.transactionHash);
    // setCreateTxHash(receipt.transactionHash);
  };

  return (
    <>
      <div className="flex flex-row justify-between p-5">
        <h3 className="font-semibold text-2xl">Mint-Club-Example</h3>
        {address ? (
          <button
            className="bg-black text-white p-2 rounded-md"
            onClick={handleDisconnectWallet}
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            className="bg-black text-white p-2 rounded-md"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {address && (
        <>
          {address && (
            <p className="text-center">Connected Address is: {address}</p>
          )}
          <div className="flex flex-row gap-2 w-fit m-auto py-5 my-5">
            <form
              onSubmit={handleCreateTokens}
              className="flex flex-col justify-items-center justify-center w-full m-auto bg-slate-200 shadow-md p-5 rounded-md"
            >
              <h2 className="p-2">Create Tokens</h2>
              <input
                type="text"
                placeholder="token symbol"
                name="symbol"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="text"
                placeholder="token name"
                name="tname"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="submit"
                placeholder="recipient"
                value="Create"
                className="text-2xl font-bold rounded-md border-2 border-black text-white bg-black m-3 p-2 w-4/4 cursor-pointer"
              />
            </form>
            <form
              onSubmit={handleApproveTokens}
              className="flex flex-col justify-items-center justify-center w-full m-auto bg-slate-200 shadow-md p-5 rounded-md"
            >
              <h2 className="p-2">Approve Tokens</h2>
              <input
                type="text"
                placeholder="token symbol"
                name="symbol"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="text"
                placeholder="token amount"
                name="amount"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="text"
                placeholder="token spender"
                name="spender"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="submit"
                placeholder="recipient"
                value="Approve"
                className="text-2xl font-bold rounded-md border-2 border-black text-white bg-black m-3 p-2 w-4/4 cursor-pointer"
              />
            </form>
            <form
              onSubmit={handleKkakdogBuyTokens}
              className="flex flex-col justify-items-center justify-center w-full m-auto bg-slate-200 shadow-md p-5 rounded-md"
            >
              <h2 className="p-2">Buy Details</h2>
              <input
                type="text"
                placeholder="amount"
                name="amount"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="text"
                placeholder="recipient"
                name="recipient"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="submit"
                placeholder="recipient"
                value="Buy"
                className="text-2xl font-bold rounded-md border-2 border-black text-white bg-black m-3 p-2 w-4/4 cursor-pointer"
              />
            </form>
            <form
              onSubmit={handleGetTokenDetails}
              className="flex flex-col justify-items-center justify-center w-full m-auto bg-slate-200 shadow-md p-5 rounded-md"
            >
              <h2 className="p-2">Get Tokens Details</h2>
              <input
                type="text"
                placeholder="token symbol"
                name="symbol"
                className="text-2xl font-bold rounded-md border-2 border-black text-black m-3 p-2 w-4/4"
              />
              <input
                type="submit"
                placeholder="recipient"
                value="Get Details"
                className="text-2xl font-bold rounded-md border-2 border-black text-white bg-black m-3 p-2 w-4/4 cursor-pointer"
              />
            </form>
          </div>

          <div className="flex flex-col w-fit m-auto justify-items-center justify-center">
            {buyTokensTxHash && <p className="text-center text-black">Buy Tx Hash: {buyTokensTxHash}</p>}
            {approveTokensTxHash && <p className="text-center text-black">Approval Tx Hash: {approveTokensTxHash}</p>}
            {createTokenTxHash && <p className="text-center text-black">Create Tokens Tx Hash: {createTokenTxHash}</p>}
            {tokenDetails && <p className="text-center text-black">Token Contract Address: {tokenDetails.token}</p>}
          </div>
        </>
      )}
    </>
  );
}
