import { BaseError, ContractFunctionRevertedError } from "viem";

import logger from "../logger";

type ErrorType = Error & { name: string };

type ErrorHandlers<T extends ErrorType> = {
  [K in T["name"]]?: T extends { name: K } ? (e: T) => string : never;
};

export function formatError<T extends ErrorType = ErrorType>(
  e: unknown extends T ? T : unknown,
  handlers: ErrorHandlers<T> = {}
) {
  logger.error(e);
  let e_msg = "Internal error";

  if (e instanceof BaseError) {
    if (e.name in handlers) {
      const handler = handlers[e.name as T["name"]]!;
      e_msg = handler(e);
    }
  }

  logger.error(e_msg);
  return e_msg;
}

type ConstructorType = new (...args: any[]) => any;

type WalkErrorHandlers<ECs extends ConstructorType[]> = {
  [EC in keyof ECs]: [ECs[EC], (e: InstanceType<ECs[EC]>) => string];
};

export function formatWalkError<E extends BaseError, ECs extends ConstructorType[] = []>(
  e: E,
  handlers: WalkErrorHandlers<ECs>
) {
  for (const [ErrorClass, handler] of handlers) {
    const walked_e = e.walk((walking_e) => walking_e instanceof ErrorClass);
    if (walked_e instanceof ErrorClass) {
      logger.error(walked_e);
      return handler(walked_e);
    }
  }
  return "Internal error";
}

export function truncateAddress(address: string) {
  if (!address) return "No Account";
  const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}
