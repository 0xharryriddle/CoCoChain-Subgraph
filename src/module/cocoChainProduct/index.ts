import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { CoCoChainProduct } from "../../../generated/schema";
import * as cocoChainTypes from "./type";
import * as utils from "../../util/index";

export function getCoCoChainProductId(cocoChainId: BigInt): Bytes {
  return changetype<Bytes>(cocoChainId);
}

export function getCoCoChainProductDetail(
  productId: BigInt
): cocoChainTypes.CoCoChainProductDetail {
  const cocoChainContract = utils.contracts.CoCoChainContract;
  const cocoChainDetailCallResult = cocoChainContract.try_products(productId);
  let cocoChainDetail: cocoChainTypes.CoCoChainProductDetail =
    cocoChainTypes.coCoChainProductDetailDefault;
  if (cocoChainDetailCallResult.reverted) {
    log.warning("products() call reverted for productId: {}", [
      productId.toString(),
    ]);
  } else {
    const value = cocoChainDetailCallResult.value;
    cocoChainDetail = {
      id: value.getId(),
      metadata: value.getMetadata(),
      active: value.getActive(),
    };
  }

  return cocoChainDetail;
}

export function createOrBuildCoCoChainProduct(
  cocoChainId: BigInt
): CoCoChainProduct {
  const cocoChainProductId = getCoCoChainProductId(cocoChainId);
  let cocoChain = CoCoChainProduct.load(cocoChainProductId);
  if (cocoChain == null) {
    cocoChain = new CoCoChainProduct(cocoChainProductId);
    cocoChain.cocoChainId = cocoChainId;
    cocoChain.metadata = utils.constants.DEFAULT_METADATA;
    cocoChain.active = true;
    cocoChain.farmers = [];
  }
  return cocoChain;
}
