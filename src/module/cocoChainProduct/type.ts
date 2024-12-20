import { BigInt } from "@graphprotocol/graph-ts";
import * as utils from "../../util/index";

export class CoCoChainProductDetail {
  id: BigInt;
  metadata: String;
  active: boolean;
}

export const coCoChainProductDetailDefault: CoCoChainProductDetail = {
  id: BigInt.zero(),
  metadata: utils.constants.DEFAULT_METADATA,
  active: true,
};
