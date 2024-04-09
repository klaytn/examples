import { type ErrorCode, type CodedEthersError } from "ethers";

import logger from "../logger";

type ErrorHandlers<T extends ErrorCode> = {
  [K in T]?: (e: CodedEthersError<K>) => string;
};

export function formatError<T extends ErrorCode>(e: unknown, handlers: ErrorHandlers<T> = {}) {
  logger.error(e);
  let e_msg = "Internal error";

  if (e instanceof Error) {
    if ("code" in e) {
      const code = e.code as T;
      if (code in handlers) {
        const handler = handlers[code]!;
        e_msg = handler(e as CodedEthersError<T>);
      }
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
