import { DEFAULT_LOCALE } from "@/lib/constants";
import { RequiredFieldError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { mapMatchingRate, mapShippingMethodModel } from "@/lib/shipping-method";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { ShippingMethodPagedQueryResponse } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

/**
 * GETs options for shipping methods for a cart that has a shipping address added
 * @param request request with query parameters `cartid` and `authToken`
 * @returns commercetools shipping methods response
 */
export async function GET(
  request: Request,
): APIResponse<ShippingMethodModel[]> {
  const { searchParams } = new URL(request.url);
  const cartid = searchParams.get("cartid");
  const locale = searchParams.get("locale") || DEFAULT_LOCALE;
  const token = await getServiceAuthToken();

  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  if (!CTP_API_URL || !CTP_PROJECT_KEY) {
    const message =
      "Missing required environment variables (CTP_API_URL or CTP_PROJECT_KEY) for shipping method endpoint";
    logger.error(message);
    throw new Error(message);
  }

  try {
    if (!cartid) {
      logger.error(
        "No cartId provided in request for shipping method endpoint",
      );
      throw new RequiredFieldError("Cart ID is required", "cartid");
    }

    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/shipping-methods/matching-cart?cartId=${cartid}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data, status } =
      await axios.request<ShippingMethodPagedQueryResponse>(options);

    const results = data.results.map((method) => {
      const matchingRate = mapMatchingRate(method);
      return mapShippingMethodModel(method, matchingRate, locale);
    });

    return NextResponse.json(results, { status: status });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Error getting shipping methods for cart with id: ${cartid}`,
    );
  }
}
