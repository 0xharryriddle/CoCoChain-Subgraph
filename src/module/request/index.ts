import { BigInt } from "@graphprotocol/graph-ts";
import { Farmer, Request } from "../../../generated/schema";

export function createOrBuildRequest(
  farmer: Farmer,
  cocoChainId: BigInt
): Request {
  const farmerId = farmer.id;

  let request = Request.load(farmerId);

  if (request == null) {
    request = new Request(farmerId);
    request.cocoChainId = cocoChainId;
    request.farmer = farmer.walletAddress;
    request.accepted = false;
  }

  return request;
}
