import {
  EventLogged,
  MetadataUpdate,
} from "../../generated/AgriculturalProduct/AgriculturalProduct";
import { createOrBuildCoCoChainProduct } from "../module/cocoChainProduct";
import {
  createOrBuildEvent,
  createOrBuildHarvestEvent,
  getEventId,
} from "../module/event";
import { EventType, EventTypeString } from "../module/event/type";
import { createOrBuildFarmer } from "../module/farmer";
import {
  createOrBuildAgriculturalProduct,
  getProductDetail,
} from "../module/agriculturalProduct";
import { Address, BigInt } from "@graphprotocol/graph-ts";

export function handleEventLogged(event: EventLogged): void {
  const productId = event.params.productId;
  const eventProduct = event.params.eventProduct;
  const cocoChainId = event.params.cocoChainId;
  const performer = event.transaction.from;
  const productDetail = getProductDetail(productId);
  const cocoChainProduct = createOrBuildCoCoChainProduct(cocoChainId);

  const farmerAddress: Address = productDetail.farmer;

  const farmer = createOrBuildFarmer(cocoChainProduct, farmerAddress);
  const product = createOrBuildAgriculturalProduct(
    cocoChainProduct,
    farmer,
    productDetail.tokenId
  );
  if (eventProduct.eventType == EventType.PLANT) {
    product.tokenId = productId;
    product.cocoChain = cocoChainProduct.id;
    product.farmer = farmer.id;
  }
  product.eventCount = productDetail.eventCount;
  product.harvestCount = productDetail.harvestCount;
  product.save();
  // latest
  const eventHarvestId = productDetail.harvestCount.equals(BigInt.zero())
    ? BigInt.zero()
    : productDetail.harvestCount.minus(BigInt.fromI64(1));
  const eventId = productDetail.eventCount.equals(BigInt.zero())
    ? BigInt.zero()
    : productDetail.eventCount.minus(BigInt.fromI64(1));
  if (eventProduct.eventType == EventType.HARVEST) {
    let eventEntity = createOrBuildHarvestEvent(
      product,
      eventHarvestId,
      event.block.timestamp
    );
    eventEntity.metadata = eventProduct.metadata;
    eventEntity.performer = eventProduct.performer;
    eventEntity.save();
  } else {
    let eventEntity = createOrBuildEvent(
      product,
      eventId,
      event.block.timestamp
    );
    eventEntity.eventType = EventTypeString[eventProduct.eventType];
    eventEntity.metadata = eventProduct.metadata;
    eventEntity.performer = eventProduct.performer;
    eventEntity.save();
    if (eventProduct.eventType == EventType.DELIVERY) {
      let eventEntity = createOrBuildHarvestEvent(
        product,
        eventHarvestId,
        event.block.timestamp
      );
      eventEntity.delivered = true;
      eventEntity.save();
    }
  }
}
