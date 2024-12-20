import { AgriculturalProduct } from "../../generated/AgriculturalProduct/AgriculturalProduct";
import { CoCoChain } from "../../generated/CoCoChain/CoCoChain";
import { agriculturalAddress, cocoChainAddress } from "./addresses";

// export const CoCoChainContract = CoCoChain.bind(addresses.cocoChainAddress);

export const CoCoChainContract = CoCoChain.bind(cocoChainAddress);

// export const AgriculturalProductContract = AgriculturalProduct.bind(
//   addresses.agriculturalAddress
// );

export const AgriculturalProductContract = AgriculturalProduct.bind(
  agriculturalAddress
);
