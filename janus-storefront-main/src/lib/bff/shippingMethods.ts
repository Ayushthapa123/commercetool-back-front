"use server";

import { logger } from "@/lib/logger";
import {
  ShippingMethodModel,
  ShippingMethodModelSchema,
} from "@/lib/models/shippingMethodModel";
import { getSessionCartId } from "@/lib/session/sessionStore";
import { getBffAuth } from "@/lib/utils";
import axios, { AxiosRequestConfig } from "axios";
import { getLocale } from "next-intl/server";
import { z } from "zod";

const responseSchema = z.array(ShippingMethodModelSchema);

/**
 * Retrieve shipping methods for the current cart from the BFF.
 * @returns a list of shipping methods available for the current cart
 */
export async function getShippingMethods(): Promise<ShippingMethodModel[]> {
  const cartId = await getSessionCartId();
  const locale = await getLocale();

  const { BFF_URL: URL } = process.env;
  const credentials = getBffAuth();
  if (!cartId) {
    logger.error("No cart ID found. expects one to already exist");
    throw new Error("Missing cart for bff");
  }

  try {
    const params = new URLSearchParams({ cartid: cartId });
    const options: AxiosRequestConfig = {
      url: `${URL}/shipping-method`,
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
        "Accept-Language": locale,
      },
      params: params,
    };

    const response = await axios.request<ShippingMethodModel[]>(options);

    if (!response.status?.toString()?.startsWith("2")) {
      logger.warn(
        response,
        `status code was not 2XX. actual code: ${response.status?.toString()}`,
      );
      return [];
    }

    logger.debug(response.data, "shipping methods response data");
    // TODO what to do if there's no shipping methods selectable?
    return responseSchema.parse(response.data);
  } catch (e) {
    logger.error({ err: e, cartId }, "Error related to shipping methods");
    return [];
  }
}

/**
 * Retrieve a shipping method by its key.
 * @param key the shipping method key
 * @param currency the currency code
 * @returns a shipping method matching the key if present, otherwise null
 */
export async function getShippingMethod(
  key: string,
  currency: string,
): Promise<ShippingMethodModel | null> {
  const { BFF_URL } = process.env;
  const credentials = getBffAuth();
  const locale = await getLocale();

  try {
    const params = new URLSearchParams({ currency });
    const options: AxiosRequestConfig = {
      url: `${BFF_URL}/shipping-method/${key}`,
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
        "Accept-Language": locale,
      },
      params: params,
    };

    const response = await axios.request<ShippingMethodModel>(options);
    return response.data;
  } catch (error) {
    logger.error(
      { error: error, key },
      "Error retrieving shipping method by key.",
    );
    return null;
  }
}
