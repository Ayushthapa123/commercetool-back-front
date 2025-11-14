import { RequiredFieldError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { OrderModel } from "@/lib/models/orderModel";
import { getOrderExpansionParameters, mapOrderModel } from "@/lib/order";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import {
  Order,
  OrderFromCartDraft,
  OrderPagedQueryResponse,
} from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

/**
 * Creates a new order from a cart in commercetools.
 * @param request the request object
 * @returns order information
 */
export async function POST(request: Request): APIResponse<OrderModel> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const draft = (await request.json()) as OrderFromCartDraft;

  try {
    if (!draft.orderNumber) {
      logger.error(
        `Expecting an order number but none provided. cartId: ${draft.cart?.id}`,
      );
      throw new RequiredFieldError(
        "Order number is a required field",
        "orderNumber",
      );
    }

    const token = await getServiceAuthToken();
    const params = getOrderExpansionParameters();

    const options: AxiosRequestConfig<OrderFromCartDraft> = {
      method: "POST",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/orders`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: draft,
      params: params,
    };

    const { data, status } = await axios.request<Order>(options);
    const order = mapOrderModel(data);
    return NextResponse.json(order, { status: status });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Unable to create order from cart: ${draft.cart?.id}`,
    );
  }
}

/**
 * Queries for orders from commercetools.
 * @param request the request object
 * @returns order information
 */
export async function GET(request: Request): APIResponse<OrderModel[]> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const { searchParams } = new URL(request.url);
  const anonymousId = searchParams.get("anonymousId");

  try {
    const token = await getServiceAuthToken();
    const params = getOrderExpansionParameters();
    if (anonymousId) {
      params.append("where", `anonymousId="${anonymousId}"`);
    }

    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/orders`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: params,
    };

    const { data, status } =
      await axios.request<OrderPagedQueryResponse>(options);
    const results = data.results.map(mapOrderModel);
    return NextResponse.json(results, { status: status });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Unable to retrieve orders for anonymousId: ${anonymousId}`,
    );
  }
}
