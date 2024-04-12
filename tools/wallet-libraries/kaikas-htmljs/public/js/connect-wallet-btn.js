import env from "./env.js";

async function switchChain() {
  return window.klaytn.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${env.CHAIN_ID.toString(16)}` }],
  });
}

const connect_wallet_btn = document.getElementById("connect-wallet-btn");
let connected = false;
async function connect() {
  if (window?.klaytn?._kaikas.isEnabled()) {
    connect_wallet_btn.innerText = "Connecting...";
    const accounts = await window.klaytn.enable();
    if (window.klaytn.networkVersion !== env.CHAIN_ID) {
      try {
        await switchChain();
      } catch (e) {
        alert(`Please switch network to ${env.CHAIN_LABEL}`);
        connect_wallet_btn.innerText = "Connect Wallet";
        return;
      }
    }

    connected = true;
    connect_wallet_btn.innerText = "Disconnect";
  }
}
async function disconnect() {
  connect_wallet_btn.innerText = "Connect Wallet";
  connected = false;
}
async function onClick() {
  return connected ? disconnect() : connect();
}
connect_wallet_btn.addEventListener("click", onClick);
