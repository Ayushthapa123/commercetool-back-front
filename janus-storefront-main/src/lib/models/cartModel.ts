import { AddressModel } from "@/lib/models/addressModel";
import { DiscountModel, emptyDiscount } from "@/lib/models/discountModel";
import { emptyPrice, PriceModel } from "@/lib/models/priceModel";
import { ProductModel } from "@/lib/models/productModel";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { CartState } from "@commercetools/platform-sdk";
import z from "zod";

export type CartModel = {
  id: string;
  version: number;
  totalItems: number;
  // TODO Move to single object to store discount code info (id + code, etc.)
  discountCode?: string;
  discountId?: string;
  locale: string;
  entries: EntryModel[];
  discount?: DiscountModel;
  subTotal: PriceModel;
  netPrice: PriceModel;
  email?: string;
  marketingConsent: boolean;
  date: string;
  cartModifiedDate: string;
  orderNumber: string;
  shippingAddress?: AddressModel;
  billingAddress?: AddressModel;
  shippingMethod?: ShippingMethodModel;
  // paymentMethod?: PaymentMethodModel;
  paymentIntentId?: string;
  state: CartState;
};

export type EntryModel = {
  id: string;
  product: ProductModel;
  quantity: number;
  basePrice: PriceModel;
  netPrice: PriceModel;
};

export const DiscountCodeSchema = z.object({
  discountCode: z.string(),
});

export type DiscountCodeForm = z.infer<typeof DiscountCodeSchema>;

export function emptyCart(): CartModel {
  const priceModel = emptyPrice();
  const discountModel = emptyDiscount();

  return {
    id: "",
    version: 0,
    totalItems: 0,
    locale: "en-GB",
    entries: [],
    discount: discountModel,
    subTotal: priceModel,
    netPrice: priceModel,
    marketingConsent: false,
    date: "",
    cartModifiedDate: "",
    orderNumber: "",
    state: "Active",
  };
}
