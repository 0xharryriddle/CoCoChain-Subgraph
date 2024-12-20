import { Address, BigInt } from "@graphprotocol/graph-ts";

export class AgriculturalProductDetail {
  tokenId: BigInt;
  cocoChainId: BigInt;
  farmer: Address;
  createdAt: BigInt;
  eventCount: BigInt;
  harvestCount: BigInt;
}

export const agriculturalProductDetailDefault: AgriculturalProductDetail = {
  tokenId: BigInt.zero(),
  cocoChainId: BigInt.zero(),
  farmer: Address.zero(),
  createdAt: BigInt.zero(),
  eventCount: BigInt.zero(),
  harvestCount: BigInt.zero(),
};
