"use server";

import { getPaymentService } from "@/lib/bff/service/paymentService";
import Stripe from "stripe";

/**
 * Creates a payment object in commercetools to apply to a given cart/order. does not apply.
 * @param cartId the id of the cart
 * @param stripePaymentIntentId the payment intent from stripe
 * @returns a string of the CT payment id
 */
export async function createCTPayment(
  cartId: string,
  stripePaymentIntentId: string,
): Promise<string> {
  return getPaymentService().createPayment(cartId, stripePaymentIntentId);
}

/**
 * Get a Payment Intent object from Stripe given the Payment Intent Id
 * @param paymentIntentId the ID of the object to get
 * @returns the payment intent object
 */
export async function getPaymentIntent(
  paymentIntentId: string,
  expandPaymentMethod?: boolean,
): Promise<Stripe.PaymentIntent | null> {
  const paymentIntent = await getPaymentService().getPaymentIntent(
    paymentIntentId,
    expandPaymentMethod,
  );
  return paymentIntent;
}

/**
 * Create a payment intent in stripe given the current cart's data.
 * @param cartId the cart which has info to populate into the payment intent
 * @returns payment intent object
 */
export async function createPaymentIntent(
  cartId: string,
): Promise<Stripe.PaymentIntent | null> {
  const paymentIntent = await getPaymentService().createPaymentIntent(cartId);
  return paymentIntent;
}

/**
 * Update the payment intent that already exists with the latest data from the cart as well as the order number
 * @param cartId current cart
 * @param orderNumber order number for this upcoming order
 * @returns boolean success
 */
export async function updatePaymentIntent(
  cartId: string,
  orderNumber: string,
): Promise<boolean> {
  await getPaymentService().updatePaymentIntent(cartId, orderNumber);
  return true;
}
