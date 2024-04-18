import connection from "../connection";

import { TxHash, setTxHash } from "./TxHash";

const id = "transfer-form";
const tx_hash_id = "transfer-form-tx-hash";

export const transfer_form = `
  <form id="${id}" class="flex flex-col gap-0.5">
    <button class="text-start" type="submit">
      <h2 class="text-lg underline font-mono">transfer</h2>
    </button>
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
    <article>
      <header>Transaction Hash:</header>
      ${TxHash({ id: tx_hash_id })}
    </article>
  </form>
`;

export function setupTransferForm() {
  /**
   * @type {HTMLFormElement}
   */
  const el = document.getElementById(id);

  el.addEventListener("submit", async function (ev) {
    ev.preventDefault();

    if (!connection.caver) {
      alert("Connect Wallet first");
      return;
    }

    const from = connection.account;

    const form_data = new FormData(ev.currentTarget);
    const to = form_data.get("to");
    if (typeof to !== "string" || !to.startsWith("0x")) return;
    const amount = form_data.get("amount");
    if (!amount) return;
    const value = connection.caver.utils.convertFromPeb(amount.toString());

    // Estimate gas
    const params = {
      from,
      to,
      value,
    };
    const gas = await connection.caver.rpc.klay.estimateGas(params);
    params.gas = gas;

    connection.caver.rpc.klay
      .sendTransaction(params)
      .once("transactionHash", function (tx_hash) {
        setTxHash(tx_hash_id, tx_hash);
      })
      .once("error", function (e) {
        alert(e.message);
      });
  });
}
