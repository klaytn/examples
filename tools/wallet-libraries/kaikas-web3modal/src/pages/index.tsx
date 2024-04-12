import Head from "next/head";

import ConnectWalletBtn from "@/components/ConnectWalletBtn";
import ContractCallForm from "@/components/ContractCallForm";
import TransferForm from "@/components/TransferForm";

export default function App() {
  return (
    <div className="max-w-screen-md px-5 mt-10 flex flex-wrap mx-auto gap-8 overflow-hidden break-words">
      <Head>
        <title>Kaikas + Web3Modal</title>
      </Head>
      <ConnectWalletBtn />
      <div className="flex w-full flex-col gap-6">
        <TransferForm />
        <ContractCallForm />
      </div>
    </div>
  );
}
