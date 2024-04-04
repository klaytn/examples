import { BigInt, log } from "@graphprotocol/graph-ts";
import { MyToken, Transfer } from "./types/MySubgraph/MyToken";
import { User } from "./types/schema";

export function handleTransfer(event: Transfer): void {
  let user = User.load(event.params.from.toHex());
  if (user) {
    user.n_transfers = user.n_transfers.plus(BigInt.fromI32(1));
  } else {
    user = new User(event.params.from.toHex());
    user.n_transfers = BigInt.fromI32(1);
  }

  // Commit changes
  user.save();

  // Logging
  log.info("{} has transferred {} times so far", [
    event.params.from.toHex(),
    user.n_transfers.toString(),
  ]);
}
