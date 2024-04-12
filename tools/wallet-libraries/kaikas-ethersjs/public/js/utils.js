import env from "./env.js";

export function formatError(e, handlers = {}) {
  console.error(e);
  let e_msg = "Internal error";

  if (e instanceof Error) {
    if ("code" in e) {
      const code = e.code;
      if (code in handlers) {
        const handler = handlers[code];
        e_msg = handler(e);
      }
    }
  }

  console.error(e_msg);
  return e_msg;
}

export function setTxHash(id, tx_hash) {
  const el = document.getElementById(id);
  if (el) {
    el.href = `${env.EXPLORER_URL}/tx/${tx_hash}`;
    el.textContent = tx_hash;
  }
}
