import connection from "../connection";
import logger from "../logger";

import { TxHash, setTxHash } from "./TxHash";

const id = "contract-call-form";
const tx_hash_id = "contract-call-form-tx-hash";

/**
 * @see https://baobab.klaytnfinder.io/account/0x043c471bee060e00a56ccd02c0ca286808a5a436
 *
 * Source code: https://github.com/klaytn/canonical-wklay
 */
const contract_abi = [
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];
const contract_address = "0x043c471bee060e00a56ccd02c0ca286808a5a436";

export const contract_call_form = `
  <form id="${id}" class="flex flex-col gap-0.5">
    <button class="text-start" type="submit">
      <h2 class="text-lg underline">
        Contract Call (<span class="font-mono">WKLAY.deposit</span>)
      </h2>
    </button>
    <label>
      Amount:&nbsp;
      <input value="0" name="amount" required type="number" />
      &nbsp;KLAY
    </label>

    <hr />
    <section>
      <header>Transaction Hash:</header>
      ${TxHash({ id: tx_hash_id })}
    </section>
  </form>
`;

export function setupContractCallForm() {
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

    const contract = new connection.caver.klay.Contract(contract_abi, contract_address);

    const from = connection.account;

    const form_data = new FormData(ev.currentTarget);
    const amount = form_data.get("amount");
    if (!amount) return;
    const value = connection.caver.utils.convertFromPeb(amount.toString());

    // Estimate gas
    const params = {
      from,
      value,
    };
    const gas = await connection.caver.rpc.klay.estimateGas(params);
    params.gas = gas;

    contract.methods.deposit().send(params, function (e, tx_hash) {
      if (e) {
        alert(e.message);
        return;
      }
      setTxHash(tx_hash_id, tx_hash);
    });
  });
}
