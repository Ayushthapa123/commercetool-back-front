import { AddressModel, emptyAddress } from "@/lib/models/addressModel";
import { EntryModel } from "@/lib/models/cartModel";
import { PaymentMethodModel } from "@/lib/models/paymentMethodModel";
import { emptyPrice, PriceModel } from "@/lib/models/priceModel";
import {
  emptyShippingMethod,
  ShippingMethodModel,
} from "@/lib/models/shippingMethodModel";

export type OrderNumberModel = {
  orderNumber: string;
};

export type OrderModel = {
  id: string;
  version: number;
  date: string;
  orderNumber: string;
  purchaseOrderNumber?: string;
  email: string;
  marketingConsent: boolean;
  shippingAddress: AddressModel;
  billingAddress: AddressModel;
  shippingMethod: ShippingMethodModel;
  subTotal: PriceModel;
  netPrice: PriceModel;
  discount?: PriceModel;
  discountCode?: string;
  entries: EntryModel[];
  paymentMethod?: PaymentMethodModel;
};

export function emptyOrder(): OrderModel {
  const price = emptyPrice();
  const address = emptyAddress();

  return {
    id: "",
    version: 0,
    date: "",
    orderNumber: "",
    email: "",
    marketingConsent: false,
    shippingAddress: address,
    billingAddress: address,
    shippingMethod: emptyShippingMethod(),
    subTotal: price,
    netPrice: price,
    discountCode: "",
    entries: [],
  };
}
