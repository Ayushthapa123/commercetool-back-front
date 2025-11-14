import { BadRequestError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { getStripe } from "@/lib/stripe";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { Cart } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * GET /api/payment-intent?paymentIntentId={paymentIntentId}
 * Purpose: Retrieve existing Stripe PaymentIntent client_secret
 * @param request the request object
 * @returns payment client secret information
 */
export async function GET(
  req: NextRequest,
): APIResponse<Stripe.PaymentIntent | null> {
  const searchParams = req.nextUrl.searchParams;
  const paymentIntentId = searchParams.get("paymentIntentId");
  try {
    if (!paymentIntentId) {
      const message = `paymentIntentId required`;
      logger.error(message);
      throw new BadRequestError(message);
    }

    const expandPaymentMethod =
      searchParams.get("expandPaymentMethod") === "true";

    const stripe = await getStripe();
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    if (expandPaymentMethod) {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ["payment_method"],
      });
    } else {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    }

    if (!paymentIntent) {
      const message = `Error retrieving PaymentIntent for paymentIntentId: ${paymentIntentId}`;
      logger.error(message);
      throw new BadRequestError(message);
    }

    return NextResponse.json(paymentIntent);
  } catch (error: unknown) {
    const message =
      `Error retrieving PaymentIntent for paymentIntentId: ${paymentIntentId}` +
      error;
    return errorResponse(error, message);
  }
}

/**
 * POST /api/payment-intent
 * Body: { cartId: string }
 * Purpose: Create a new Stripe PaymentIntent
 * @param request the request object
 * @returns payment client secret information
 */
export async function POST(
  req: NextRequest,
): APIResponse<Stripe.PaymentIntent> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;

  try {
    const token = await getServiceAuthToken();
    const { cartId } = await req.json();

    // Step 1: Get cart details
    const cartOptions: AxiosRequestConfig = {
      method: "GET",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/carts/${cartId}`,
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

    // Step 2: Create Stripe PaymentIntent
    const stripe = await getStripe();
    const intentParams: Stripe.PaymentIntentCreateParams = {
      amount: cartData.totalPrice.centAmount,
      currency: cartData.totalPrice.currencyCode,
      payment_method_types: ["card"],
      metadata: {
        "graco-cart-id": cartId,
      },
    };

    const paymentIntent = await stripe.paymentIntents.create(intentParams);

    if (!paymentIntent) {
      const message = `Unable to create payment intent for cartId: ${cartId}`;
      logger.error(message);
      throw new BadRequestError(message);
    }

    return NextResponse.json(paymentIntent);
  } catch (error: unknown) {
    return errorResponse(error, "Error creating PaymentIntent:" + error);
  }
}
