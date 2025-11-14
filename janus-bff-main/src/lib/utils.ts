import { isAPIError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { DiscountOnTotalPrice } from "@commercetools/platform-sdk";
import { LineItem } from "@commercetools/platform-sdk/dist/declarations/src/generated/models/cart";
import axios, { AxiosRequestConfig, HttpStatusCode, isAxiosError } from "axios";
import * as ipaddr from "ipaddr.js";
import { NextResponse } from "next/server";

type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

/**
 * Helper function to retrieve an access token from commercetools.
 * @returns an access token
 */
export async function getServiceAuthToken() {
  const { CTP_AUTH_URL, CTP_CLIENT_ID, CTP_CLIENT_SECRET } = process.env;
  const creds = `${CTP_CLIENT_ID}:${CTP_CLIENT_SECRET}`;
  const auth = Buffer.from(creds).toString("base64");

  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${CTP_AUTH_URL}/oauth/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      authorization: `Basic ${auth}`,
    },
    data: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  };

  const { data } = await axios.request<AuthResponse>(options);
  return data.access_token;
}

export type IError = {
  code: string;
  message: string;
  errors: Error[];
};

/**
 * Helper function to map an error response.
 * @param error the error object
 * @param message an error message
 * @param status the http status (defaults to HTTP 500)
 * @returns the response object
 */
export function errorResponse(
  error: unknown,
  message: string,
  status: HttpStatusCode = HttpStatusCode.InternalServerError,
): NextResponse<IError> {
  if (error instanceof Error) {
    const axiosError = isAxiosError(error);
    const logObject = axiosError ? error.response?.data : error;
    logger.error(logObject, message);

    const response: IError = {
      code: error.name,
      message: message,
      errors: [error],
    };

    if (axiosError) {
      const init: ResponseInit = { status: error.response?.status ?? status };
      return NextResponse.json(response, init);
    }

    if (isAPIError(error)) {
      return NextResponse.json(response, { status: error.statusCode });
    }

    return NextResponse.json(response, { status });
  }

  logger.error(error, message);
  const response: IError = {
    code: "unknown",
    message: message,
    errors: [],
  };
  return NextResponse.json(response, { status });
}

/** Log AxiosError if it is from Axios, otherwise log regular error */
export function logError(error: unknown, message: string): void {
  const logObject = isAxiosError(error) ? error.response?.data : error;
  logger.error(logObject, message);
}

const LOCALHOST = "127.0.0.1";
export function getClientIPFromReq(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : LOCALHOST;
}

export function isPublicIP(ip: string): boolean {
  try {
    const parsed = ipaddr.parse(ip);
    const range = parsed.range();

    return (
      parsed.kind() === "ipv4" &&
      range !== "private" &&
      range !== "loopback" &&
      range !== "reserved"
    );
  } catch {
    return false;
  }
}

/**
 * Calculate discount on cart level if available. Otherwise, calculate discount on lineItems.
 * Note: LineItem can have more than one discounts but only one discount is supported per lineItem
 * currently in Janus project. See "discountedPrice.includedDiscounts[0].discountedAmount.centAmount"
 */
export function calculateDiscount(
  discountOnTotalPrice: DiscountOnTotalPrice | undefined,
  lineItems: LineItem[],
): number {
  // return order discount if available
  if (discountOnTotalPrice) {
    return discountOnTotalPrice.discountedAmount.centAmount;
  }

  // calculate line item discounts (applied per quantity)
  let totalDiscountCentAmount = 0;

  lineItems.forEach((item) => {
    let cartDiscountedPriceSum = 0;

    if (
      item.discountedPricePerQuantity &&
      item.discountedPricePerQuantity.length > 0
    ) {
      cartDiscountedPriceSum = item.discountedPricePerQuantity.reduce(
        (acc, discountedPriceItem) => {
          return (
            acc +
            discountedPriceItem.discountedPrice.includedDiscounts[0]
              .discountedAmount.centAmount *
              discountedPriceItem.quantity
          );
        },
        0,
      );
    }

    totalDiscountCentAmount += cartDiscountedPriceSum;
  });

  return totalDiscountCentAmount;
}
