import { Address, Bytes } from "@graphprotocol/graph-ts";

export const CoCoChainAddress: string =
  "0x5381672c5CE3D5E412f283Dd1976E7058461C6C5";

export const AgriculturalProductAddress: string =
  "0x18Dcd00069c1cb182aaA78458d7481b05ce7CDa8";

export const cocoChainAddress: Address = Address.fromBytes(
  Bytes.fromHexString(CoCoChainAddress)
);

export const agriculturalAddress: Address = Address.fromBytes(
  Bytes.fromHexString(AgriculturalProductAddress)
);
