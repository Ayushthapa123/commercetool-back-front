import { getCart, getCartExpansionParameters, mapCartModel } from "@/lib/cart";
import { UpdateActionValidator } from "@/lib/cart/validator";
import { RequiredFieldError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { CartModel } from "@/lib/models/cartModel";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { Cart, CartStateValues, CartUpdate } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig, HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * Returns the cart by ID
 * @param _ unused request object
 * @param context the context containing the url slug
 * @return the cart
 */
export async function GET(
  _: Request,
  context: RouteParams,
): APIResponse<CartModel> {
  const { id } = await context.params;

  try {
    const { cart, status } = await getCart(id);

    return NextResponse.json(cart, { status: status });
  } catch (error: unknown) {
    return errorResponse(error, `Unable to retrieve cart with id: ${id}`);
  }
}

/**
 * Returns the cart with requested changes
 * @param request the request object
 * @param context the context containing the url slug
 * @return the updated cart
 */
export async function POST(
  request: Request,
  context: RouteParams,
): APIResponse<CartModel> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency");
  const refreshBeforeUpdate =
    searchParams.get("refreshBeforeUpdate") === "true";
  const locale = request.headers.get("Accept-Language");
  let update = (await request.json()) as CartUpdate;
  const token = await getServiceAuthToken();
  const params = getCartExpansionParameters();

  try {
    if (refreshBeforeUpdate) {
      const { cart, status } = await getCart(id);
      if (status < HttpStatusCode.BadRequest) {
        if (update.version != cart.version) {
          logger.warn(
            `the cart appears to have been updated from version ${update.version} to ${cart.version}, so we're going to use that.`,
          );

          // if the action is unfreeze, only do the update when the cart is still frozen
          if (
            update.actions.length === 1 &&
            update.actions[0].action.includes("unfreeze") &&
            cart.state !== CartStateValues.Frozen
          ) {
            logger.warn(
              "skipping unfreeze given latest cart: ${id} is already unfrozen",
            );
            return NextResponse.json(cart, { status: status });
          }

          update = { version: cart.version, actions: update.actions };
        }
      } else {
        logger.warn(
          `could not get the latest cart info for cart: ${id} before updating, so just using data we already had`,
        );
      }
    }

    const validator = new UpdateActionValidator(locale, currency);
    update.actions.forEach((action) => validator.validate(action));

    const options: AxiosRequestConfig<CartUpdate> = {
      method: "POST",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/carts/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: update,
      params: params,
    };

    logger.debug(
      `carts POST, CART WILL BE UPDATED. cart version before update: ${update.version} for cartId: ${id}`,
    );

    const { data, status } = await axios.request<Cart>(options);
    const cart = await mapCartModel(data);

    logger.debug(
      `carts POST, CART IS UPDATED. cart version after update: ${cart.version} for cartId: ${id}`,
    );

    return NextResponse.json(cart, { status: status });
  } catch (error: unknown) {
    return errorResponse(error, `Unable to update cart with id: ${id}`);
  }
}

/**
 * Deletes the requested cart
 * @param request the request object
 * @param context the context with the url slug
 * @return the deleted cart
 */
export async function DELETE(
  request: Request,
  context: RouteParams,
): APIResponse<CartModel> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const version = searchParams.get("version");
  const token = await getServiceAuthToken();

  try {
    if (!version) {
      throw new RequiredFieldError(
        "Cart version is a required field",
        "version",
      );
    }

    const options: AxiosRequestConfig = {
      method: "DELETE",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/carts/${id}?version=${version}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data, status } = await axios.request<Cart>(options);
    const cart = await mapCartModel(data);
    return NextResponse.json(cart, { status: status });
  } catch (error: unknown) {
    return errorResponse(error, `Unable to delete cart with id: ${id}`);
  }
}
