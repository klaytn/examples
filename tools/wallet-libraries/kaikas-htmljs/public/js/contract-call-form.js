import {
  BrowserProvider,
  Contract,
  parseEther,
} from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

import { formatError, setTxHash } from "./utils.js";

/**
 * @see https://baobab.klaytnfinder.io/account/0x043c471bee060e00a56ccd02c0ca286808a5a436
 *
 * Source code: https://github.com/klaytn/canonical-wklay
 */
const contract = new Contract("0x043c471bee060e00a56ccd02c0ca286808a5a436", [
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
]);

const form = document.getElementById("contract-call-form");

async function onSubmit(ev) {
  ev.preventDefault();

  if (!window?.klaytn?._kaikas.isEnabled()) {
    alert("Connect Wallet first");
    return;
  }

  const form_data = new FormData(ev.currentTarget);
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
    const connected_contract = contract.connect(signer);
    response = await connected_contract.getFunction("deposit")({
      value,
    });
  } catch (e) {
    alert(formatError(e, { ACTION_REJECTED: (e) => "WKLAY.deposit was rejected" }));
    return;
  }

  const receipt = await response.wait();
  if (receipt) {
    setTxHash("contract-call-form-tx-hash", receipt.hash);
  } else {
    logger.error("Transaction failed");
  }
}
form.addEventListener("submit", onSubmit);
