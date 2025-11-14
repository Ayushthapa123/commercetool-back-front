import { BadRequestError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { getStripe } from "@/lib/stripe";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { Cart } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig, HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

/**
 * Updates Stripe's payment intent with the latest information from the cart.
 * @param req cartId, orderNumber
 * @returns status 204 if successful
 */
export async function POST(req: NextRequest): APIResponse<any> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;

  try {
    const token = await getServiceAuthToken();
    const { cartId, orderNumber } = await req.json();

    // Step 1: Fetch cart
    const cartOptions: AxiosRequestConfig = {
      method: "GET",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/carts/${cartId}?expand=paymentInfo.payments[*]`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data: cartData } = await axios.request<Cart>(cartOptions);
    if (!cartData) {
      const message = `Unable to retrieve cart data for cartId: ${cartId}`;
      logger.error(message);
      throw new BadRequestError(message);
    }

    const payments = cartData?.paymentInfo?.payments || [];
    if (payments.length === 0) {
      const message = `No existing payments found on cartId: ${cartId}`;
      logger.error(message);
      throw new BadRequestError(message);
    }

    const existingPayment = payments[0];
    const stripePaymentIntentId = existingPayment?.obj?.interfaceId;
    if (!stripePaymentIntentId) {
      const message = `Existing payment does not have interfaceId for cartId: ${cartId}`;
      logger.error(message);
      throw new BadRequestError(message);
    }

    // Step 2: Update Stripe PaymentIntent
    const stripe = await getStripe();
    const updatedPaymentIntent = await stripe.paymentIntents.update(
      stripePaymentIntentId,
      {
        amount: cartData.totalPrice.centAmount,
        currency: cartData.totalPrice.currencyCode,
        metadata: {
          "graco-order-num": orderNumber,
          "graco-cart-id": cartId,
        },
      },
    );

    if (!updatedPaymentIntent) {
      const message = `Failed to retrieve client secret from updated PaymentIntent for cartId: ${cartId}`;
      logger.error(message);
      throw new BadRequestError(message);
    }

    return new NextResponse(null, { status: HttpStatusCode.NoContent });
  } catch (error: unknown) {
    return errorResponse(error, "Error updating payment intent: " + error);
  }
}
