import { Address, BigInt } from "@graphprotocol/graph-ts";
import * as utils from "../../util/index";

export const EventTypeString = [
  "PLANT",
  "FERTILIZER",
  "SPRAY",
  "WATER",
  "HARVEST",
  "DELIVERY",
];

export enum EventType {
  PLANT,
  FERTILIZER,
  SPRAY,
  WATER,
  HARVEST,
  DELIVERY,
}

export class EventDetail {
  eventType: EventType;
  metadata: String;
  timestamp: BigInt;
  performer: Address;
  delivered: boolean;
}

export const eventDetailDefault: EventDetail = {
  eventType: EventType.PLANT,
  metadata: utils.constants.DEFAULT_METADATA,
  timestamp: BigInt.zero(),
  performer: Address.zero(),
  delivered: false,
};
