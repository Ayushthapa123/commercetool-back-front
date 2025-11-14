"use server";

import { logError } from "@/lib/logger";
import { ProductModel } from "@/lib/models/productModel";
import { getSessionCurrency } from "@/lib/session/sessionStore";
import { getBffAuth } from "@/lib/utils";
import axios, { AxiosRequestConfig } from "axios";
import { getLocale } from "next-intl/server";

export async function getProducts(
  offset: number,
  limit: number,
  skus: string[] = [],
): Promise<ProductModel[]> {
  const auth = getBffAuth();
  const locale = await getLocale();
  const currency = await getSessionCurrency();
  const { BFF_URL } = process.env;

  try {
    const params = new URLSearchParams();
    params.append("limit", String(limit));
    params.append("offset", String(offset));
    params.append("currency", currency.isoCode);
    if (skus.length > 0) {
      skus.forEach((sku) => params.append("skus", sku));
    }

    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${BFF_URL}/products`,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Accept-Language": locale,
      },
      params: params,
    };

    const response = await axios.request<ProductModel[]>(options);
    return response.data;
  } catch (error) {
    logError(error, "Error fetching all products");
    return [];
  }
}

export async function getProduct(id: string): Promise<ProductModel | null> {
  const auth = getBffAuth();
  const locale = await getLocale();
  const currency = await getSessionCurrency();
  const { BFF_URL } = process.env;

  try {
    const params = new URLSearchParams();
    params.append("currency", currency.isoCode);

    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${BFF_URL}/products/${id}`,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Accept-Language": locale,
      },
      params: params,
    };

    const response = await axios.request<ProductModel>(options);
    return response.data;
  } catch (error) {
    logError(error, `Could not fetch product with id: ${id}`);
    return null;
  }
}
