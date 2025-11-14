import {
  SetOrderNumberBillingAddressAndFreezeCartProps,
  SetShippingAddressAndPaymentToCartProps,
} from "@/lib/bff/cart";
import { StripeAddressDetails } from "@/lib/checkout/checkoutSchemas";
import { logError, logger } from "@/lib/logger";
import { CartModel, emptyCart } from "@/lib/models/cartModel";
import { ProductModel } from "@/lib/models/productModel";
import {
  getOrCreateSessionId,
  getSessionCartId,
  getSessionCartVersion,
  getSessionCurrency,
  removeSessionCartId,
  removeSessionCartVersion,
  setSessionCartId,
  setSessionCartVersion,
} from "@/lib/session/sessionStore";
import { getBffAuth } from "@/lib/utils";
import {
  AddressDraft,
  CartAddDiscountCodeAction,
  CartAddLineItemAction,
  CartAddPaymentAction,
  CartChangeLineItemQuantityAction,
  CartChangeTaxModeAction,
  CartDraft,
  CartFreezeCartAction,
  CartRemoveDiscountCodeAction,
  CartRemoveLineItemAction,
  CartSetBillingAddressAction,
  CartSetCustomTypeAction,
  CartSetKeyAction,
  CartSetShippingAddressAction,
  CartSetShippingMethodAction,
  CartUnfreezeCartAction,
  CartUpdate,
  CartUpdateAction,
  DiscountCodeReference,
  FieldContainer,
  ShippingMethodResourceIdentifier,
  TaxMode,
} from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig, HttpStatusCode, isAxiosError } from "axios";
import { getLocale } from "next-intl/server";

type CustomTypeKey = "custom-order-fields";

class CartService {
  private readonly baseUrl: string;
  private readonly auth: string;

  constructor(bffUrl: string, auth: string) {
    this.baseUrl = `${bffUrl}/carts`;
    this.auth = auth;
  }

  async getCart(id: string): Promise<CartModel> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const response = await axios.get<CartModel>(url, {
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      const notFound = isAxiosError(error)
        ? error.response?.status === HttpStatusCode.NotFound
        : false;

      if (notFound) {
        await removeSessionCartId();
        await removeSessionCartVersion();
      }
      logError(error, `Error retrieving cart with id: ${id}`);
      return emptyCart();
    }
  }

  async createCart(): Promise<CartModel> {
    const sessionId = await getOrCreateSessionId();

    try {
      const locale = await getLocale();
      const currency = await getSessionCurrency();
      const country = locale?.split("-")[1];
      const draft: CartDraft = {
        anonymousId: sessionId,
        currency: currency.isoCode,
        country: country,
        locale: locale,
      };

      const options: AxiosRequestConfig<CartDraft> = {
        url: this.baseUrl,
        method: "POST",
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
        },
        data: draft,
      };

      const response = await axios.request<CartModel>(options);
      const cart = response.data;
      await setSessionCartId(cart.id);
      await setSessionCartVersion(cart.version.toString());

      return cart;
    } catch (error) {
      logError(error, `Error creating cart for anonymous id: ${sessionId}`);
      return emptyCart();
    }
  }

  async deleteCart(): Promise<CartModel> {
    const id = await getSessionCartId();
    const version = await getSessionCartVersion();

    try {
      const url = `${this.baseUrl}/${id}?version=${version}`;
      const response = await axios.delete<CartModel>(url, {
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
        },
      });

      await removeSessionCartId();
      await removeSessionCartVersion();

      return response.data;
    } catch (error) {
      logError(error, `Error deleting cart with id: ${id}`);
      return emptyCart();
    }
  }

  async getRelatedProducts(cartId: string): Promise<ProductModel[]> {
    const locale = await getLocale();
    const currency = await getSessionCurrency();

    try {
      const params = new URLSearchParams();
      params.append("currency", currency.isoCode);
      params.append("cartId", cartId);

      const options: AxiosRequestConfig = {
        method: "GET",
        url: `${this.baseUrl}/related-products`,
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
          "Accept-Language": locale,
        },
        params: params,
      };

      const response = await axios.request<ProductModel[]>(options);
      return response.data;
    } catch (error) {
      logError(error, `Error retrieving related products with id: ${cartId}`);
      return [];
    }
  }

  async removeCartCookies() {
    await removeSessionCartId();
    await removeSessionCartVersion();
  }

  async addDiscountCode(discountCode: string): Promise<CartModel> {
    const action = CartUpdateActionUtil.mapAddDiscountCodeAction(discountCode);
    return this.updateCart([action]);
  }

  async addToCart(productId: string, quantity: number): Promise<CartModel> {
    const action = CartUpdateActionUtil.mapAddToCartAction(productId, quantity);
    return this.updateCart([action]);
  }

  async removeLineItem(
    lineItemId: string,
    cart: CartModel,
  ): Promise<CartModel> {
    const cartUpdateActions: CartUpdateAction[] = [
      CartUpdateActionUtil.mapRemoveLineItemAction(lineItemId),
    ];
    if (cart.entries.length === 1) {
      cartUpdateActions.push(...this.removeCartDiscountAndShipping(cart));
    }
    return this.updateCart(cartUpdateActions);
  }

  async clearCart(cart: CartModel): Promise<CartModel> {
    const lineItemActions = cart.entries.map((entry) =>
      CartUpdateActionUtil.mapRemoveLineItemAction(entry.id),
    );

    const discountAndShippingActions: CartUpdateAction[] =
      this.removeCartDiscountAndShipping(cart);

    const clearCartActions: CartUpdateAction[] = [
      ...lineItemActions,
      ...discountAndShippingActions,
    ];

    return this.updateCart(clearCartActions);
  }

  // Helper to build optional clear actions (discount, shipping method)
  private removeCartDiscountAndShipping(cart: CartModel): CartUpdateAction[] {
    const actions: CartUpdateAction[] = [];

    if (cart?.discountId) {
      actions.push(CartUpdateActionUtil.mapRemoveDiscountCode(cart.discountId));
    }
    if (cart?.shippingMethod?.id) {
      actions.push(CartUpdateActionUtil.mapRemoveShippingMethod());
    }

    return actions;
  }

  async updateLineItemQuantity(
    lineItemId: string,
    quantity: number,
  ): Promise<CartModel> {
    const action = CartUpdateActionUtil.mapChangeLineItemQuantity(
      lineItemId,
      quantity,
    );
    return this.updateCart([action]);
  }

  async removeDiscountCode(discountId: string): Promise<CartModel> {
    const action = CartUpdateActionUtil.mapRemoveDiscountCode(discountId);
    return this.updateCart([action]);
  }

  async setOrderNumberBillingAddressAndFreezeCart(
    props: SetOrderNumberBillingAddressAndFreezeCartProps,
  ): Promise<CartModel> {
    const setOrderNumberAction = CartUpdateActionUtil.mapSetOrderNumberCart(
      props.orderNumber,
    );

    const setBillingAddressAction =
      CartUpdateActionUtil.mapSetBillingAddressAction(
        props.addressDetails,
        props.email,
      );

    // FREEZE ACTION
    const freezeAction: CartFreezeCartAction = {
      action: "freezeCart",
    };
    return this.updateCart([
      setOrderNumberAction,
      setBillingAddressAction,
      freezeAction,
    ]);
  }

  async unfreeze(): Promise<CartModel> {
    const action: CartUnfreezeCartAction = {
      action: "unfreezeCart",
    };
    return this.updateCart([action], true);
  }

  async setShippingAddressAndPayment(
    props: SetShippingAddressAndPaymentToCartProps,
  ): Promise<CartModel> {
    const actions: CartUpdateAction[] = [];
    actions.push(
      CartUpdateActionUtil.mapSetShippingAddressAction(props.address),
    );
    if (props.paymentId) {
      actions.push(CartUpdateActionUtil.mapAddPaymentAction(props.paymentId));
    }
    return this.updateCart(actions);
  }

  async setShippingMethod(methodId: string): Promise<CartModel> {
    const action = CartUpdateActionUtil.mapSetShippingMethod(methodId);
    return this.updateCart([action]);
  }

  async updateTaxMode(taxMode: TaxMode): Promise<CartModel> {
    const action = CartUpdateActionUtil.mapChangeTaxModeAction(taxMode);
    return this.updateCart([action]);
  }

  async setMarketingConsent(optIn: boolean): Promise<CartModel> {
    const key: CustomTypeKey = "custom-order-fields";
    const fields: FieldContainer = {
      marketingConsent: optIn,
    };

    const action = CartUpdateActionUtil.mapSetCustomType(key, fields);
    return this.updateCart([action]);
  }

  /**
   * Issues the request to the BFF to perform the specified array of update
   * actions to the current users cart in commercetools.
   * @param actions array of cart update actions to perform
   * @returns the updated cart
   */
  async updateCart(
    actions: CartUpdateAction[],
    refreshBeforeUpdate?: boolean,
  ): Promise<CartModel> {
    const id = await getSessionCartId();
    const version = await getSessionCartVersion();
    const locale = await getLocale();
    const currency = await getSessionCurrency();

    try {
      const update: CartUpdate = {
        version: version,
        actions: actions,
      };

      const searchParams: Record<string, string> = {
        currency: currency.isoCode,
      };
      if (refreshBeforeUpdate) {
        searchParams.refreshBeforeUpdate = "true";
      }
      const params = new URLSearchParams(searchParams);

      const url = `${this.baseUrl}/${id}`;
      const options: AxiosRequestConfig<CartUpdate> = {
        url: url,
        method: "POST",
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
          "Accept-Language": locale,
        },
        data: update,
        params,
      };

      logger.debug(`before cart update, cart version: ${version}`);
      const response = await axios.request<CartModel>(options);
      const cart = response.data;

      await setSessionCartId(cart.id);
      logger.debug(
        `after cart update, cart version: ${cart.version.toString()}`,
      );
      await setSessionCartVersion(cart.version.toString());

      return cart;
    } catch (error) {
      logError(error, `Error performing update to cart: ${id}`);
      return emptyCart();
    }
  }
}

let instance: CartService | null = null;
export function getCartService(): CartService {
  if (!instance) {
    const { BFF_URL } = process.env;
    if (!BFF_URL) {
      throw new Error("Missing required url for BFF");
    }

    const auth = getBffAuth();
    instance = new CartService(BFF_URL, auth);
  }

  return instance;
}

/**
 * Utility class used to build {@link CartUpdateAction}s
 */
class CartUpdateActionUtil {
  static mapAddDiscountCodeAction = (
    discountCode: string,
  ): CartAddDiscountCodeAction => ({
    action: "addDiscountCode",
    code: discountCode,
  });

  static mapAddToCartAction = (
    productId: string,
    quantity: number,
  ): CartAddLineItemAction => ({
    action: "addLineItem",
    productId: productId,
    quantity: quantity,
  });

  static mapChangeLineItemQuantity = (
    lineItemId: string,
    quantity: number,
  ): CartChangeLineItemQuantityAction => ({
    action: "changeLineItemQuantity",
    lineItemId: lineItemId,
    quantity: quantity,
  });

  static mapChangeTaxModeAction = (
    taxMode: TaxMode,
  ): CartChangeTaxModeAction => ({
    action: "changeTaxMode",
    taxMode: taxMode,
  });

  static mapRemoveDiscountCode(
    discountId: string,
  ): CartRemoveDiscountCodeAction {
    const discountCodeReference: DiscountCodeReference = {
      typeId: "discount-code",
      id: discountId,
    };
    return {
      action: "removeDiscountCode",
      discountCode: discountCodeReference,
    };
  }

  static mapSetOrderNumberCart(orderNumber: string): CartSetKeyAction {
    return {
      action: "setKey",
      key: orderNumber,
    };
  }

  static mapRemoveLineItemAction = (
    lineItemId: string,
  ): CartRemoveLineItemAction => ({
    action: "removeLineItem",
    lineItemId: lineItemId,
  });

  static mapSetBillingAddressAction(
    addressDetails: StripeAddressDetails,
    email: string,
  ): CartSetBillingAddressAction {
    const billingAddress: AddressDraft = {
      firstName: addressDetails.firstName,
      lastName: addressDetails.lastName,
      email: email,
      phone: addressDetails.phone,
      streetName: addressDetails.address.line1,
      additionalStreetInfo: addressDetails.address.line2 ?? undefined,
      city: addressDetails.address.city,
      state: addressDetails.address.state,
      country: addressDetails.address.country,
      postalCode: addressDetails.address.postal_code,
    };

    return {
      action: "setBillingAddress",
      address: billingAddress,
    };
  }

  static mapSetCustomType = (
    key: CustomTypeKey,
    fields: FieldContainer,
  ): CartSetCustomTypeAction => ({
    action: "setCustomType",
    type: {
      typeId: "type",
      key: key,
    },
    fields: fields,
  });

  static mapSetShippingAddressAction(
    address: StripeAddressDetails,
  ): CartSetShippingAddressAction {
    const shippingAddress: AddressDraft = {
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      streetName: address.address.line1,
      additionalStreetInfo: address.address.line2 ?? undefined,
      city: address.address.city,
      state: address.address.state,
      country: address.address.country,
      postalCode: address.address.postal_code,
    };

    return {
      action: "setShippingAddress",
      address: shippingAddress,
    };
  }

  static mapSetShippingMethod(methodId: string): CartSetShippingMethodAction {
    const shippingMethod: ShippingMethodResourceIdentifier = {
      typeId: "shipping-method",
      id: methodId,
    };
    return {
      action: "setShippingMethod",
      shippingMethod: shippingMethod,
    };
  }

  static mapRemoveShippingMethod(): CartSetShippingMethodAction {
    return {
      action: "setShippingMethod",
      shippingMethod: undefined,
    };
  }

  static mapAddPaymentAction(paymentId: string): CartAddPaymentAction {
    return {
      action: "addPayment",
      payment: { id: paymentId, typeId: "payment" },
    };
  }
}
