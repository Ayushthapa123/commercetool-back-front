import { AddressModel } from "@/lib/models/addressModel";
import { DiscountModel } from "@/lib/models/discountModel";
import { PriceModel } from "@/lib/models/priceModel";
import { ProductModel } from "@/lib/models/productModel";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { CartState } from "@commercetools/platform-sdk";

export type CartModel = {
  id: string;
  version: number;
  totalItems: number;
  orderNumber?: string;
  date: string;
  cartModifiedDate: string;
  entries: EntryModel[];
  discount?: DiscountModel;
  discountCode?: string;
  discountId?: string;
  locale: string;
  subTotal: PriceModel;
  netPrice: PriceModel;
  email?: string;
  marketingConsent: boolean;
  shippingAddress?: AddressModel;
  billingAddress?: AddressModel;
  shippingMethod?: ShippingMethodModel;
  // TODO Determine how to source the value for freeShipLevel on a cart and
  // possibly move to PriceModel to display formatted pricing info in storefront
  freeShipLevel?: number;
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
