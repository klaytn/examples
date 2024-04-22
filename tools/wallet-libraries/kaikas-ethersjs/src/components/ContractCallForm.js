import { Contract, parseEther } from "ethers";

import { formatError } from "../utils";

import { TxHash, setTxHash } from "./TxHash";
import connection from "../connection";

const id = "contract-call-form";
const tx_hash_id = "contract-call-form-tx-hash";

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

    if (!connection.ethers) {
      alert("Connect Wallet first");
      return;
    }

    const form_data = new FormData(ev.currentTarget);
    const amount = form_data.get("amount");
    if (!amount) return;
    const value = parseEther(amount.toString());

    let signer;
    try {
      signer = await connection.ethers.getSigner();
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
      setTxHash(tx_hash_id, receipt.hash);
    } else {
      logger.error("Transaction failed");
    }
  });
}
