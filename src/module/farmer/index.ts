import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { CoCoChainProduct, Farmer } from "../../../generated/schema";
import * as utils from "../../util/index";
import * as farmerTypes from "./type";

export function getFarmerId(
  cocoChainProductId: Bytes,
  farmerAddress: Address
): Bytes {
  return cocoChainProductId.concat(
    Bytes.fromHexString(farmerAddress.toHexString())
  );
}

export function createOrBuildFarmer(
  cocoChainProduct: CoCoChainProduct,
  farmerAddress: Address
): Farmer {
  const farmerId = getFarmerId(cocoChainProduct.id, farmerAddress);
  let farmer = Farmer.load(farmerId);

  if (farmer == null) {
    farmer = new Farmer(farmerId);
    farmer.product = cocoChainProduct.id;
    farmer.walletAddress = farmerAddress;
    farmer.metadata = utils.constants.DEFAULT_METADATA;
    farmer.active = true;
  }

  return farmer;
}

export function getFarmerDetail(
  productId: BigInt,
  farmerAddress: Address
): farmerTypes.FarmerDetail {
  const cocoChainContract = utils.contracts.CoCoChainContract;
  const farmerDetailCallResult = cocoChainContract.try_farmers(
    productId,
    farmerAddress
  );

  let farmerDetail: farmerTypes.FarmerDetail = farmerTypes.farmerDetailDefault;
  if (farmerDetailCallResult.reverted) {
    log.warning(
      "farmers() call reverted with productId: {} and farmerAddress: {}",
      [productId.toString(), farmerAddress.toHexString()]
    );
  } else {
    const value = farmerDetailCallResult.value;
    farmerDetail = {
      productId: value.getProductId(),
      farmerAddress: value.getFarmerAddress(),
      metadata: value.getMetadata(),
      active: value.getActive(),
    };
  }
  return farmerDetail;
}
