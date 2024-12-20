import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  CoCoChainProduct,
  Farmer,
  AgriculturalProduct,
} from "../../../generated/schema";
import * as productTypes from "./type";
import * as util from "../../util/index";

export function getProductId(
  cocoChainProductId: Bytes,
  farmerWallet: Address
): Bytes {
  return cocoChainProductId.concat(
    Bytes.fromHexString(farmerWallet.toHexString())
  );
}

export function createOrBuildAgriculturalProduct(
  cocoChainProduct: CoCoChainProduct,
  farmer: Farmer,
  tokenId: BigInt
): AgriculturalProduct {
  const agriculturalProductId = getProductId(
    cocoChainProduct.id,
    Address.fromBytes(farmer.walletAddress)
  );
  let product = AgriculturalProduct.load(agriculturalProductId);
  if (product == null) {
    product = new AgriculturalProduct(agriculturalProductId);
    product.tokenId = tokenId;
    product.cocoChain = cocoChainProduct.id;
    product.farmer = farmer.walletAddress;
    product.eventCount = BigInt.zero();
    product.harvestCount = BigInt.zero();
  }

  return product;
}

export function getProductDetail(
  productId: BigInt
): productTypes.AgriculturalProductDetail {
  const agriculturalProductContract =
    util.contracts.AgriculturalProductContract;
  const productDetailCallResult = agriculturalProductContract.try_products(
    productId
  );

  let productDetail: productTypes.AgriculturalProductDetail =
    productTypes.agriculturalProductDetailDefault;
  if (productDetailCallResult.reverted) {
    log.warning("products() call reverted with productId: {}", [
      productId.toString(),
    ]);
  } else {
    const value = productDetailCallResult.value;
    productDetail = {
      tokenId: value.getTokenId(),
      cocoChainId: value.getCocoChainId(),
      farmer: changetype<Address>(value.getFarmer()),
      createdAt: value.getCreatedAt(),
      eventCount: value.getEventCount(),
      harvestCount: value.getHarvestCount(),
    };
  }
  return productDetail;
}
