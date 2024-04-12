import {
  BrowserProvider,
  parseEther,
} from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

import { formatError, setTxHash } from "./utils.js";

const form = document.getElementById("transfer-form");

async function onSubmit(ev) {
  ev.preventDefault();

  if (!window?.klaytn?._kaikas.isEnabled()) {
    alert("Connect Wallet first");
    return;
  }

  const from = window.klaytn.selectedAddress;

  const form_data = new FormData(ev.currentTarget);
  const to = form_data.get("to");
  if (typeof to !== "string" || !to.startsWith("0x")) return;
  const amount = form_data.get("amount");
  if (!amount) return;
  const value = parseEther(amount.toString());

  const provider = new BrowserProvider(window.klaytn);
  let signer;
  try {
    signer = await provider.getSigner();
  } catch (e) {
    logger.error(e);
    alert("Failed to get signer");
    return;
  }

  let response;
  try {
    response = await signer.sendTransaction({ from, to, value });
  } catch (e) {
    alert(formatError(e, { ACTION_REJECTED: (e) => "sendTransaction was rejected" }));
    return;
  }

  const receipt = await response.wait();
  if (receipt) {
    setTxHash("transfer-form-tx-hash", receipt.hash);
  } else {
    logger.error("Transaction failed");
  }
}
form.addEventListener("submit", onSubmit);
