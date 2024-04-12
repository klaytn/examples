import ConnectWalletBtn from "../components/ConnectWalletBtn";
import TransferForm from "@/components/TransferForm";
import Head from "next/head";
import ContractCallForm from "@/components/ContractCallForm";

export default function App() {
  return (
    <div className="max-w-screen-md px-5 mt-10 flex flex-wrap mx-auto gap-8 overflow-hidden break-words">
      <Head>
        <title>Kaikas + Web3-Onboard</title>
      </Head>
      <ConnectWalletBtn />
      <div className="flex w-full flex-col gap-6">
        <TransferForm />
        <ContractCallForm />
      </div>
    </div>
  );
}
