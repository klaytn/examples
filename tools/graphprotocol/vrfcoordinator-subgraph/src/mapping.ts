import { log } from "@graphprotocol/graph-ts";
import {
  RandomWordsFulfilled,
  RandomWordsRequested,
} from "./types/VRFCoordinatorSubgraph/VRFCoordinator";
import { RandomWordsFulfillment } from "./types/schema";

export function handleRandomWordsRequested(event: RandomWordsRequested): void {
  const randomWordsFulfillment = new RandomWordsFulfillment(event.params.requestId.toHexString());
  randomWordsFulfillment.requestedTime = event.block.timestamp;
  randomWordsFulfillment.save();
}

export function handleRandomWordsFulfilled(event: RandomWordsFulfilled): void {
  const randomWordsFulfillment = RandomWordsFulfillment.load(event.params.requestId.toHexString());
  if (randomWordsFulfillment == null) {
    log.warning("RandomWordsFulfillment with requestId {} not found", [
      event.params.requestId.toHexString(),
    ]);
    return;
  }
  randomWordsFulfillment.fulfilledTime = event.block.timestamp;
  randomWordsFulfillment.success = event.params.success;
  randomWordsFulfillment.save();
}
