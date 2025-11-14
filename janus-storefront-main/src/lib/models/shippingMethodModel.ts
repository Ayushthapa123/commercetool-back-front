import {
  emptyPrice,
  PriceModel,
  PriceModelSchema,
} from "@/lib/models/priceModel";
import z from "zod";

export const STANDARD_SHIPPING = "standard-shipping";

export type ShippingMethodModel = {
  id: string;
  deliveryCost: PriceModel;
  description: string;
  name: string;
  freeShipLevel: PriceModel;
};

export const ShippingMethodModelSchema = z.object({
  id: z.string(),
  deliveryCost: PriceModelSchema,
  description: z.string(),
  name: z.string(),
  freeShipLevel: PriceModelSchema,
});

export function emptyShippingMethod(): ShippingMethodModel {
  const priceModel = emptyPrice();
  return {
    id: "",
    deliveryCost: priceModel,
    description: "",
    name: "",
    freeShipLevel: priceModel,
  };
}
