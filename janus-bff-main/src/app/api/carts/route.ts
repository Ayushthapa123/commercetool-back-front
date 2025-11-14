import { getCartExpansionParameters, mapCartModel } from "@/lib/cart";
import { CartModel } from "@/lib/models/cartModel";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { Cart, CartDraft } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

/**
 * Creates a new cart in commerce tools
 * @param request the request object
 * @return the created cart
 */
export async function POST(request: Request): APIResponse<CartModel> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const draft = (await request.json()) as CartDraft;
  const token = await getServiceAuthToken();
  const params = getCartExpansionParameters();

  const options: AxiosRequestConfig<CartDraft> = {
    method: "POST",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/carts`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: draft,
    params: params,
  };

  try {
    const { data, status } = await axios.request<Cart>(options);
    const cart = await mapCartModel(data);
    return NextResponse.json(cart, { status: status });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Error creating cart for anonymous id: ${draft.anonymousId}`,
    );
  }
}
