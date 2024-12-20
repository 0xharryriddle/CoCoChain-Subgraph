import { Address, BigInt } from "@graphprotocol/graph-ts";
import { DEFAULT_METADATA } from "../../util/constants";

export class FarmerDetail {
  productId: BigInt;
  farmerAddress: Address;
  metadata: string;
  active: boolean;
}

export const farmerDetailDefault: FarmerDetail = {
  productId: BigInt.zero(),
  farmerAddress: Address.zero(),
  metadata: DEFAULT_METADATA,
  active: false,
};
