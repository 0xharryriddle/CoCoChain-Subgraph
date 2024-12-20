import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Event,
  AgriculturalProduct,
  HarvestEvent,
} from "../../../generated/schema";
import { EventType, EventTypeString } from "./type";
import * as util from "../../util/index";

export function getEventId(productId: BigInt, eventId: BigInt): Bytes {
  return changetype<Bytes>(productId).concat(changetype<Bytes>(eventId));
}

export function createOrBuildEvent(
  agriculturalProduct: AgriculturalProduct,
  eventId: BigInt,
  timestamp: BigInt
): Event {
  const eventEntityId = getEventId(agriculturalProduct.tokenId, eventId);

  let event = Event.load(eventEntityId);
  if (event == null) {
    event = new Event(eventEntityId);
    event.product = agriculturalProduct.id;
    event.metadata = util.constants.DEFAULT_METADATA;
    event.eventType = EventTypeString[0];
    event.performer = Address.zero();
    event.createdAt = timestamp;
  }

  return event;
}

export function createOrBuildHarvestEvent(
  agriculturalProduct: AgriculturalProduct,
  eventId: BigInt,
  timestamp: BigInt
): HarvestEvent {
  const eventEntityId = getEventId(agriculturalProduct.tokenId, eventId);

  let event = HarvestEvent.load(eventEntityId);
  if (event == null) {
    event = new HarvestEvent(eventEntityId);
    event.product = agriculturalProduct.id;
    event.metadata = util.constants.DEFAULT_METADATA;
    event.eventType = event.eventType = EventTypeString[4];
    event.performer = Address.zero();
    event.delivered = false;
    event.createdAt = timestamp;
  }

  return event;
}
