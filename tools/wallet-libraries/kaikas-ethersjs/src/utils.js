import logger from "./logger";

export function formatError(e, handlers = {}) {
  logger.error(e);
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

  logger.error(e_msg);
  return e_msg;
}
