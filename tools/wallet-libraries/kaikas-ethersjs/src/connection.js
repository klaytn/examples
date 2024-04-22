import { BrowserProvider } from "ethers";

import env from "./env";
import logger from "./logger";

const CHAIN_ID_HEX = `0x${env.CHAIN_ID.toString(16)}`;

const connection = {
  /**
   * @type {BrowserProvider|undefined}
   */
  ethers: undefined,

  async connect() {
    await window.klaytn.enable();
    await this.maybeSwitchNetwork(window.klaytn.networkVersion);

    // Add event listeners
    try {
      for (const key in this.on) {
        window.klaytn.on(key, this.on[key].bind(this));
      }
    } catch (e) {
      logger.error(e);
    }

    this.ethers = new BrowserProvider(window.klaytn);
  },

  disconnect() {
    this.ethers = undefined;

    try {
      // Remove event listeners
      for (const key in this.on) {
        window.klaytn.off(key, this.on[key]);
      }
    } catch (e) {
      logger.error(e);
    }
  },

  /**
   * @param {number} network_id
   */
  async maybeSwitchNetwork(network_id) {
    if (network_id !== env.CHAIN_ID) {
      try {
        await window.klaytn.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_ID_HEX }],
        });
      } catch (e) {
        this.disconnect();
        alert(`Please switch network to ${env.CHAIN_LABEL}`);
        throw e;
      }
    }
  },

  /**
   * @type {string|undefined}
   */
  get account() {
    return window.klaytn.selectedAddress;
  },
  /**
   * Event handlers
   * @see https://docs.kaikas.io/02_api_reference/01_klaytn_provider#klaytn.on-eventname-callback
   */
  on: {
    async networkChanged(network_id) {
      try {
        await this.maybeSwitchNetwork(network_id);
      } catch (e) {
        logger.error(e);
      }
    },
    async disconnected() {
      this.disconnect();
    },
  },
};

export default connection;
