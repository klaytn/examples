import { FormEventHandler, useCallback } from "react";
import { useSendTransaction } from "wagmi";
import { Address, UserRejectedRequestError, parseEther } from "viem";

import { formatError, formatWalkError } from "@/utils/web3";

import TxHash from "./TxHash";

export default function TransferForm() {
  const { data: tx_hash, isPending, sendTransaction } = useSendTransaction();

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (ev) => {
    ev.preventDefault();

    const form_data = new FormData(ev.currentTarget);
    const to = form_data.get("to") as Address | null;
    if (typeof to !== "string" || !to.startsWith("0x")) return;
    const amount = form_data.get("amount");
    if (!amount) return;
    const value = parseEther(amount.toString());
    sendTransaction(
      { to, value },
      {
        onError: (e) => {
          const e_msg = formatError(e, {
            TransactionExecutionError: (e) => {
              return formatWalkError(e, [
                [UserRejectedRequestError, () => "sendTransaction was rejected"],
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
      <button disabled={isPending} className="text-start" type="submit">
        <h2 className="text-lg underline font-mono">transfer</h2>
      </button>
      <label>
        {"To: "}
        <input defaultValue="0x" name="to" pattern="0x[0-9A-Fa-f]{40}" required type="text" />
      </label>
      <label>
        {"Amount: "}
        <input defaultValue="0" name="amount" required type="number" />
        {" KLAY"}
      </label>

      <hr />
      <article>
        <header>Transaction Hash:</header>
        <TxHash>{tx_hash}</TxHash>
      </article>
    </form>
  );
}
