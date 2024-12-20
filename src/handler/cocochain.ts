import { Bytes, log } from "@graphprotocol/graph-ts";
import {
  FarmerAdded,
  FarmerBanned,
  FarmerRequested,
  ProductRegistered,
  ProductStopped,
  ProductUpdated,
} from "../../generated/CoCoChain/CoCoChain";
import { CoCoChainProduct } from "../../generated/schema";
import {
  createOrBuildCoCoChainProduct,
  getCoCoChainProductDetail,
  getCoCoChainProductId,
} from "../module/cocoChainProduct";
import { createOrBuildRequest } from "../module/request";
import { createOrBuildFarmer, getFarmerDetail } from "../module/farmer";

export function handleProductRegistered(event: ProductRegistered): void {
  const productId = event.params.productId; // This id is the index of product in the CoCoChain contract

  log.info("Registering product with productId: {}", [productId.toString()]);
  const cocoChainDetail = getCoCoChainProductDetail(productId);
  let cocoChainProduct = createOrBuildCoCoChainProduct(productId);
  cocoChainProduct.cocoChainId = productId;
  cocoChainProduct.metadata = cocoChainDetail.metadata.toString();
  cocoChainProduct.active = cocoChainDetail.active;

  cocoChainProduct.save();
}

export function handleProductStopped(event: ProductStopped): void {
  const productId = event.params.productId;

  let cocoChainProduct = createOrBuildCoCoChainProduct(productId);
  cocoChainProduct.active = false;

  cocoChainProduct.save();
}

export function handleProductUpdated(event: ProductUpdated): void {
  const productId = event.params.productId;

  const cocoChainDetail = getCoCoChainProductDetail(productId);
  let cocoChainProduct = createOrBuildCoCoChainProduct(productId);
  cocoChainProduct.cocoChainId = productId;
  cocoChainProduct.metadata = cocoChainDetail.metadata.toString();
  cocoChainProduct.active = cocoChainDetail.active;

  cocoChainProduct.save();
}

export function handleFarmerRequested(event: FarmerRequested): void {
  const productId = event.params.productId;
  const farmerAddress = event.transaction.from;

  let cocoChainProduct = createOrBuildCoCoChainProduct(productId);

  const farmerDetail = getFarmerDetail(productId, farmerAddress);
  let farmer = createOrBuildFarmer(cocoChainProduct, farmerAddress);
  farmer.walletAddress = farmerAddress;
  farmer.metadata = farmerDetail.metadata;
  farmer.active = false;
  farmer.save();

  if (cocoChainProduct.farmers == null) {
    cocoChainProduct.farmers = [farmer.id];
  } else {
    cocoChainProduct.farmers.push(farmer.id);
  }

  cocoChainProduct.save();

  let request = createOrBuildRequest(farmer, cocoChainProduct.cocoChainId);
  request.save();
}

export function handleFarmerAdded(event: FarmerAdded): void {
  const farmerAddress = event.params.farmerAddress;
  const productId = event.params.productId;

  let cocoChainProduct = createOrBuildCoCoChainProduct(productId);
  let farmer = createOrBuildFarmer(cocoChainProduct, farmerAddress);
  farmer.active = true;
  farmer.save();
  let request = createOrBuildRequest(farmer, productId);
  request.accepted = true;
  request.save();
}

export function handleFarmerBanned(event: FarmerBanned): void {
  const farmerAddress = event.params.farmerAddress;
  const productId = event.params.productId;

  let cocoChainProduct = createOrBuildCoCoChainProduct(productId);
  let farmer = createOrBuildFarmer(cocoChainProduct, farmerAddress);
  farmer.active = false;
  farmer.save();
}
