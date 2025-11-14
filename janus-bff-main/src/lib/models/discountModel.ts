import { emptyPrice, PriceModel } from "@/lib/models/priceModel";

export type DiscountModel = {
  amount: PriceModel;
  percentage: number;
};

export function emptyDiscount(): DiscountModel {
  return {
    amount: emptyPrice(),
    percentage: 0,
  };
}
