import { DEFAULT_LOCALE } from "@/lib/constants";
import { RequiredFieldError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { mapMatchingRate, mapShippingMethodModel } from "@/lib/shipping-method";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { ShippingMethod } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ key: string }>;
};

/**
 * Returns a shipping method matching the provided key if present
 *
 * @param request the request object
 * @param context the context containing the key
 * @returns the shipping method matching the key if present
 */
export async function GET(
  request: Request,
  context: RouteParams,
): APIResponse<ShippingMethodModel> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const { key } = await context.params;
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency");
  const locale = request.headers.get("Accept-Language") ?? DEFAULT_LOCALE;

  try {
    // Shipping method does not include available rates - required for filtering
    if (!currency) {
      logger.error("No currency provided in request");
      throw new RequiredFieldError("Currency is a required field", "currency");
    }

    const token = await getServiceAuthToken();
    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/shipping-methods/key=${key}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data, status } = await axios.request<ShippingMethod>(options);
    const matchingRate = mapMatchingRate(data, currency);
    const shippingMethod = mapShippingMethodModel(data, matchingRate, locale);
    return NextResponse.json(shippingMethod, { status: status });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Error getting shipping method with key: ${key}`,
    );
  }
}
