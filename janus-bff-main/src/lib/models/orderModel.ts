import { AddressModel } from "@/lib/models/addressModel";
import { EntryModel } from "@/lib/models/cartModel";
import { PriceModel } from "@/lib/models/priceModel";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";

export type OrderNumberModel = {
  orderNumber: string;
};

/** Custom Type used by Order and Cart objects to store marketing consent */
export type MarketingConsent = {
  marketingConsent: boolean;
};

export type OrderModel = {
  id: string;
  version: number;
  date: string;
  orderNumber: string;
  purchaseOrderNumber?: string;
  email: string;
  marketingConsent: boolean;
  shippingAddress?: AddressModel;
  billingAddress?: AddressModel;
  shippingMethod?: ShippingMethodModel;
  subTotal: PriceModel;
  netPrice: PriceModel;
  discount?: PriceModel;
  discountCode?: string;
  entries: EntryModel[];
};
