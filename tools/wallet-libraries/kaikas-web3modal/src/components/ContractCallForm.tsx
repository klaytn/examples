import { FormEventHandler, useCallback } from "react";
import { useWriteContract } from "wagmi";
import { UserRejectedRequestError, parseEther } from "viem";

import { formatError, formatWalkError } from "@/utils/web3";

import TxHash from "./TxHash";

/**
 * @see https://baobab.klaytnfinder.io/account/0x043c471bee060e00a56ccd02c0ca286808a5a436
 *
 * Source code: https://github.com/klaytn/canonical-wklay
 */
const contract_address = "0x043c471bee060e00a56ccd02c0ca286808a5a436";
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
] as const;

export default function ContractCallForm() {
  const { data: tx_hash, writeContract } = useWriteContract();

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (ev) => {
    ev.preventDefault();

    const form_data = new FormData(ev.currentTarget);
    const amount = form_data.get("amount");
    if (!amount) return;
    const value = parseEther(amount.toString());

    writeContract(
      {
        abi: contract_abi,
        address: contract_address,
        functionName: "deposit",
        value,
      },
      {
        onError: (e) => {
          const e_msg = formatError(e, {
            TransactionExecutionError: (e) => {
              return formatWalkError(e, [
                [UserRejectedRequestError, () => "WKLAY.deposit was rejected"],
              ]);
            },
          });
          alert(e_msg);
        },
      }
    );
  }, []);

  return (
    <form className="flex flex-col gap-0.5" onSubmit={onSubmit}>
      <button className="text-start" type="submit">
        <h2 className="text-lg underline">
          Contract Call (<span className="font-mono">WKLAY.deposit</span>)
        </h2>
      </button>
      <label>
        {"Amount: "}
        <input defaultValue="0" name="amount" required type="number" />
        {" KLAY"}
      </label>

      <hr />
      <section>
        <header>Transaction Hash:</header>
        <TxHash>{tx_hash}</TxHash>
      </section>
    </form>
  );
}
