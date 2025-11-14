import { getCart } from "@/lib/bff/cart";
import { logError } from "@/lib/logger";
import { CartModel } from "@/lib/models/cartModel";
import { getOrCreateSessionId } from "@/lib/session/sessionStore";
import { getBffAuth } from "@/lib/utils";
import { Payment, PaymentDraft } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig, HttpStatusCode } from "axios";
import Stripe from "stripe";

export class PaymentService {
  private readonly bffUrl: string;
  private readonly auth: string;

  constructor(bffUrl: string, auth: string) {
    this.bffUrl = bffUrl;
    this.auth = auth;
  }

  async createPayment(
    cartId: string,
    stripePaymentIntentId: string,
  ): Promise<string> {
    const cart = await getCart(cartId);
    const anonymousId = await getOrCreateSessionId();

    const paymentDraft: PaymentDraft = {
      anonymousId: anonymousId,
      interfaceId: stripePaymentIntentId,
      amountPlanned: {
        centAmount: cart.netPrice.value,
        currencyCode: cart.netPrice.currencyIso,
      },
      paymentMethodInfo: {
        paymentInterface: "stripe",
      },
      paymentStatus: {
        interfaceCode: "open",
      },
    };

    const options: AxiosRequestConfig<PaymentDraft> = {
      url: `${this.bffUrl}/payments`,
      method: "POST",
      headers: {
        Authorization: `Basic ${this.auth}`,
        Accept: "application/json",
      },
      data: paymentDraft,
    };

    const response = await axios.request<Payment>(options);
    return response.data.id;
  }

  async getPaymentIntent(
    paymentIntentId: string,
    expandPaymentMethod?: boolean,
  ): Promise<Stripe.PaymentIntent | null> {
    try {
      const searchParams: Record<string, string> = {
        paymentIntentId: paymentIntentId,
      };
      if (expandPaymentMethod) {
        searchParams.expandPaymentMethod = "true";
      }
      const params = new URLSearchParams(searchParams);

      const response = await axios.get<Stripe.PaymentIntent>(
        `${this.bffUrl}/payment-intent`,
        {
          headers: {
            Authorization: `Basic ${this.auth}`,
          },
          params,
        },
      );

      return response.data;
    } catch (error) {
      logError(
        error,
        `No payment intent for paymentIntentId: ${paymentIntentId}`,
      );
      return null;
    }
  }

  async createPaymentIntent(
    cartId: string,
  ): Promise<Stripe.PaymentIntent | null> {
    try {
      const response = await axios.post<Stripe.PaymentIntent>(
        `${this.bffUrl}/payment-intent`,
        { cartId },
        {
          headers: {
            Authorization: `Basic ${this.auth}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      logError(error, `Error creating payment intent for cartId: ${cartId}`);
      return null;
    }
  }

  async updatePaymentIntent(cartId: string, orderNumber: string) {
    try {
      const response = await axios.post<CartModel>(
        `${this.bffUrl}/payment-intent/update`,
        { cartId, orderNumber },
        {
          headers: {
            Authorization: `Basic ${this.auth}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status !== HttpStatusCode.NoContent) {
        throw new Error(
          `update payment intent returned an unexpected response.status: ${response.status}`,
        );
      }
    } catch (error) {
      logError(error, `Error updating payment intent for cartId: ${cartId}`);
      return false;
    }
  }
}

let instance: PaymentService | null = null;

export function getPaymentService(): PaymentService {
  if (!instance) {
    const { BFF_URL } = process.env;
    if (!BFF_URL) {
      throw new Error("Missing BFF_URL in environment variables");
    }

    const auth = getBffAuth();
    instance = new PaymentService(BFF_URL, auth);
  }

  return instance;
}
