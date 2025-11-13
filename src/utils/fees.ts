import { PLATFORM_FEE_PERCENTAGE } from "../config";

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

export const calculatePlatformFee = (priceNOK: number) =>
  roundToTwo(priceNOK * PLATFORM_FEE_PERCENTAGE);

export const calculateSellerRevenue = (priceNOK: number) =>
  roundToTwo(priceNOK - calculatePlatformFee(priceNOK));

