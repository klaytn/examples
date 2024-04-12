import { isError, type ErrorCode, type CodedEthersError } from "ethers";

import logger from "../logger";

type ErrorHandler<K extends ErrorCode> = (e: CodedEthersError<K>) => string;

type ErrorHandlers = {
  [K in ErrorCode]?: ErrorHandler<K>;
};

export function formatError(e: unknown, handlers: ErrorHandlers = {}) {
  logger.error(e);
  let e_msg = "Internal error";

  for (const _code in handlers) {
    if (!Object.prototype.hasOwnProperty.call(handlers, _code)) continue;
    const code = _code as ErrorCode;
    const handler = handlers[code] as ErrorHandler<ErrorCode>;
    if (isError(e, code)) {
      e_msg = handler(e);
    }
  }

  logger.error(e_msg);
  return e_msg;
}

export function truncateAddress(address: string) {
  if (!address) return "No Account";
  const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}
