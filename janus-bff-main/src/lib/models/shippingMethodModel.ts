import { PriceModel } from "@/lib/models/priceModel";

export type ShippingMethodModel = {
  id: string;
  deliveryCost: PriceModel;
  description: string;
  name: string;
  freeShipLevel: PriceModel;
};
