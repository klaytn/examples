import connection from "../connection";
import logger from "../logger";

const id = "connect-wallet-btn";
const innerText_enum = {
  CONNECT: "Connect Wallet",
  CONNECTING: "Connecting...",
  DISCONNECT: "Disconnect Wallet",
};

export const connect_wallet_btn = `
  <button id="${id}" class="btn-kaikas">${innerText_enum.CONNECT}</button>
`;

export function setupConnectWalletBtn() {
  /**
   * @type {HTMLButtonElement}
   */
  const el = document.getElementById(id);

  async function connect() {
    el.innerText = innerText_enum.CONNECTING;
    try {
      await connection.connect();
      el.innerText = innerText_enum.DISCONNECT;
    } catch (e) {
      logger.error(e);
      el.innerText = innerText_enum.CONNECT;
    }
  }

  function disconnect() {
    connection.disconnect();
    el.innerText = innerText_enum.CONNECT;
  }

  el.addEventListener("click", function () {
    if (!window?.klaytn) {
      alert("Please install Kaikas extension");
      return;
    }

    if (connection.ethers) {
      disconnect();
    } else {
      connect();
    }
  });

  // Eager connect
  if (window?.klaytn?._kaikas.isApproved()) {
    connect().catch(logger.error);
  }
}
