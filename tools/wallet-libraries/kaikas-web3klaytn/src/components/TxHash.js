import env from "../env";

/**
 * @param {TxHashProps}
 *
 * @typedef {{
 *   id: string
 * }} TxHashProps
 */
export function TxHash({ id }) {
  return `
    <a id="${id}" class="text-klaytn-orange underline" rel="noreferrer" target="_blank"></a>
  `;
}

/**
 * @param {string} id
 * @param {string} tx_hash
 */
export function setTxHash(id, tx_hash) {
  const el = document.getElementById(id);
  if (el) {
    el.href = `${env.EXPLORER_URL}/tx/${tx_hash}`;
    el.textContent = tx_hash;
  }
}
