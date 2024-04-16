import "./style.css";
import { connect_wallet_btn, setupConnectWalletBtn } from "./components/ConnectWalletBtn";
import { setupTransferForm, transfer_form } from "./components/TransferForm";
import { contract_call_form, setupContractCallForm } from "./components/ContractCallForm";

document.getElementById("app").innerHTML = `
  <div class="max-w-screen-md px-5 mt-10 flex flex-wrap mx-auto gap-8 overflow-hidden break-words">
    ${connect_wallet_btn}
    <div class="flex w-full flex-col gap-6">
      ${transfer_form}
      ${contract_call_form}     
    </div>
  </div>
`;

setupConnectWalletBtn();
setupTransferForm();
setupContractCallForm();
