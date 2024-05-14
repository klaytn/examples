import { parseKlay } from "@klaytn/ethers-ext";

import connection from "../connection";
import { formatError } from "../utils";

import { SendBtn } from "./SendBtn";
import { TxHash, setTxHash } from "./TxHash";

const id = "transfer-form";
const tx_hash_id = "transfer-form-tx-hash";

export const transfer_form = `
  <form id="${id}" class="flex flex-col gap-0.5">
    <header class="text-start" type="submit">
      <h2 class="text-lg underline font-mono">transfer</h2>
    </header>
    <label>
      To:&nbsp;
      <input value="0x" name="to" pattern="0x[0-9A-Fa-f]{40}" required type="text" />
    </label>
    <label>
      Amount:&nbsp;
      <input value="0" name="amount" required type="number" />
      &nbsp;KLAY
    </label>
    <hr />
    <article class="mb-2">
      <header>Transaction Hash:</header>
      ${TxHash({ id: tx_hash_id })}
    </article>
    ${SendBtn({ children: "Transfer" })}
  </form>
`;

export function setupTransferForm() {
  /**
   * @type {HTMLFormElement}
   */
  const el = document.getElementById(id);

  el.addEventListener("submit", async function (ev) {
    ev.preventDefault();

    if (!connection.web3klaytn) {
      alert("Connect Wallet first");
      return;
    }

    const from = connection.account;

    const form_data = new FormData(ev.currentTarget);
    const to = form_data.get("to");
    if (typeof to !== "string" || !to.startsWith("0x")) return;
    const amount = form_data.get("amount");
    if (!amount) return;
    const value = parseKlay(amount.toString());

    let signer;
    try {
      signer = await connection.web3klaytn.getSigner();
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
      setTxHash(tx_hash_id, receipt.transactionHash);
    } else {
      alert("Transaction failed");
    }
  });
}
