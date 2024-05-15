import { Contract } from "ethers";
import { parseKlay } from "@klaytn/ethers-ext";

import { formatError } from "../utils";

import { SendBtn } from "./SendBtn";
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
    <section class="mb-2">
      <header>Transaction Hash:</header>
      ${TxHash({ id: tx_hash_id })}
    </section>

    ${SendBtn({ children: "Deposit" })}
  </form>
`;

export function setupContractCallForm() {
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

    const form_data = new FormData(ev.currentTarget);
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
      const connected_contract = contract.connect(signer);
      response = await connected_contract.functions["deposit"]({
        value,
      });
    } catch (e) {
      alert(formatError(e, { ACTION_REJECTED: (e) => "WKLAY.deposit was rejected" }));
      return;
    }

    const receipt = await response.wait();
    if (receipt) {
      setTxHash(tx_hash_id, receipt.transactionHash);
    } else {
      logger.error("Transaction failed");
    }
  });
}
