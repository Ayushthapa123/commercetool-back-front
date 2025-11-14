"use server";

import { getCartService } from "@/lib/bff/service/cartService";
import { StripeAddressDetails } from "@/lib/checkout/checkoutSchemas";
import { CartModel } from "@/lib/models/cartModel";
import { ProductModel } from "@/lib/models/productModel";

/**
 * Retrieve a cart from commercetools by id.
 * @param id the cart id
 * @returns the cart matching the provided id
 */
export async function getCart(id: string): Promise<CartModel> {
  return getCartService().getCart(id);
}

/**
 * Creates a cart in commercetools using session id as the anonymous id to
 * associate with the newly created cart.
 * @returns the created cart model
 */
export async function createCart(): Promise<CartModel> {
  return getCartService().createCart();
}

/**
 * Sets the tax mode of a cart to "Disabled".
 * @returns the updated cart
 */
export async function updateCartTaxMode(): Promise<CartModel> {
  return getCartService().updateTaxMode("Disabled");
}

/**
 * Adds a specified product with the given quantity to the commercetools cart.
 * @param productId the id of the product
 * @param quantity the quantity
 * @returns the updated cart
 */
export async function addToCart(
  productId: string,
  quantity: number,
): Promise<CartModel> {
  return getCartService().addToCart(productId, quantity);
}

/**
 * Changes quantity of a specified line item within a commercetools cart.
 * @param lineItemId the id of the line item
 * @param quantity the quantity
 * @returns the updated cart
 */
export async function updateLineItemQuantity(
  lineItemId: string,
  quantity: number,
): Promise<CartModel> {
  return getCartService().updateLineItemQuantity(lineItemId, quantity);
}

/**
 * Clears all line items from the commercetools cart.
 * @param cart the cart model
 * @returns the updated cart
 */
export async function clearCart(cart: CartModel) {
  return getCartService().clearCart(cart);
}

/**
 * Removes a line item from a commercetools cart.
 * @param lineItemId the id of the line item
 * @param cart the cart model
 * @returns the updated cart
 */
export async function removeLineItem(
  lineItemId: string,
  cart: CartModel,
): Promise<CartModel> {
  return getCartService().removeLineItem(lineItemId, cart);
}

/**
 * Deletes a commercetools cart matching on id.
 * @returns the deleted cart
 */
export async function deleteCart(): Promise<CartModel> {
  return getCartService().deleteCart();
}

export type SetShippingAddressAndPaymentToCartProps = {
  address: StripeAddressDetails;
  paymentId?: string;
};

/**
 * Sets the marketing consent custom field on a commercetools cart.
 * @param optIn the optIn consent flag
 * @returns the updated cart
 */
export async function setMarketingConsent(optIn: boolean): Promise<CartModel> {
  return getCartService().setMarketingConsent(optIn);
}

/**
 * Sets shipping address on a commercetools cart.
 * @param address the shipping address
 * @returns the updated cart
 */
export async function setShippingAddressAndPaymentToCart(
  props: SetShippingAddressAndPaymentToCartProps,
): Promise<CartModel> {
  return getCartService().setShippingAddressAndPayment(props);
}

/**
 * Sets the shipping method on a cart.
 * @param methodId the id of the shipping method
 * @returns the updated cart
 */
export async function setShippingMethod(methodId: string): Promise<CartModel> {
  return getCartService().setShippingMethod(methodId);
}

/**
 * Retrieves related or most viewed products based on cart contents.
 * @param cartId the id of the cart
 * @returns array of related or most viewed products
 */
export async function getRelatedProducts(
  cartId: string,
): Promise<ProductModel[]> {
  return getCartService().getRelatedProducts(cartId);
}

/**
 * Add discount code on a cart.
 * @param discountCode code to add to cart
 * @returns the updated cart
 */
export async function addDiscountCode(
  discountCode: string,
): Promise<CartModel> {
  return getCartService().addDiscountCode(discountCode);
}

/**
 * Remove discount code on a cart.
 * @param discountId the id of the discount code to remove from cart
 * @returns the updated cart
 */
export async function removeDiscountCode(
  discountId: string,
): Promise<CartModel> {
  return getCartService().removeDiscountCode(discountId);
}

export type SetOrderNumberBillingAddressAndFreezeCartProps = {
  addressDetails: StripeAddressDetails;
  email: string;
  orderNumber: string;
};

export async function setOrderNumberBillingAddressAndFreezeCart(
  props: SetOrderNumberBillingAddressAndFreezeCartProps,
): Promise<CartModel> {
  const updatedCart =
    await getCartService().setOrderNumberBillingAddressAndFreezeCart(props);
  return updatedCart;
}

/**
 * Unfreeze the cart
 * @returns the updated cart
 */
export async function unfreezeCart(): Promise<CartModel> {
  const updatedCart = await getCartService().unfreeze();
  return updatedCart;
}

/**
 * Remove cartId and cartVersion cookies.
 */
export async function removeCartCookies() {
  return getCartService().removeCartCookies();
}
