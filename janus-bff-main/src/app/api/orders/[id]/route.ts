import { OrderModel } from "@/lib/models/orderModel";
import { getOrderExpansionParameters, mapOrderModel } from "@/lib/order";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { Order, OrderUpdate } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * Performs updates for an order in commercetools.
 * @param request the request object
 * @param context the context containing the url slug
 * @returns order information
 */
export async function POST(
  request: Request,
  context: RouteParams,
): APIResponse<OrderModel> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const { id } = await context.params;
  const update = (await request.json()) as OrderUpdate;
  const token = await getServiceAuthToken();
  const params = getOrderExpansionParameters();

  const options: AxiosRequestConfig<OrderUpdate> = {
    method: "POST",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/orders/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: update,
    params: params,
  };

  try {
    const { data, status } = await axios.request<Order>(options);
    const order = mapOrderModel(data);
    return NextResponse.json(order, { status: status });
  } catch (error: unknown) {
    return errorResponse(error, `Unable to update order with id: ${id}`);
  }
}

/**
 * Retrieves an order from commercetools by id.
 * @param _ the request object
 * @param context the context containing the url slug
 * @returns order information
 */
export async function GET(
  _: Request,
  context: RouteParams,
): APIResponse<OrderModel> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const { id } = await context.params;
  const token = await getServiceAuthToken();
  const params = getOrderExpansionParameters();

  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/orders/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  try {
    const { data, status } = await axios.request<Order>(options);
    const order = mapOrderModel(data);
    return NextResponse.json(order, { status: status });
  } catch (error: unknown) {
    return errorResponse(error, `Unable to retrieve order with id: ${id}`);
  }
}
