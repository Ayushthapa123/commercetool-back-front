import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from "@/lib/constants";
import { ProductModel } from "@/lib/models/productModel";
import { mapProductModel } from "@/lib/product";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { ProductProjectionPagedQueryResponse } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

type PagedResponse = {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: ProductModel[];
};

/**
 * Returns an array of products from commercetools.
 * @param request the request object
 * @returns an array of products
 */
export async function GET(request: Request): APIResponse<ProductModel[]> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const token = await getServiceAuthToken();
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ?? 10;
  const offset = searchParams.get("offset") ?? 0;
  const currency = searchParams.get("currency") ?? DEFAULT_CURRENCY;
  const skus = searchParams.getAll("skus");
  const locale = request.headers.get("Accept-Language") ?? DEFAULT_LOCALE;
  const country = locale?.split("-")[1] ?? DEFAULT_COUNTRY;

  const params = new URLSearchParams();
  params.append("limit", String(limit));
  params.append("offset", String(offset));
  params.append("priceCurrency", currency);
  params.append("priceCountry", country);
  params.append("localeProjection", locale);

  if (skus.length > 0) {
    params.append("where", "masterVariant(sku in :skus)");
    skus.forEach((sku) => params.append("var.skus", sku));
  }

  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/product-projections`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  try {
    const { data, status } =
      await axios.request<ProductProjectionPagedQueryResponse>(options);

    const products = data.results.map((product) =>
      mapProductModel(product, locale, currency),
    );

    const response: PagedResponse = {
      ...data,
      results: products,
    };

    return NextResponse.json(response.results, { status: status });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Error querying products with provided parameters: ${searchParams}`,
    );
  }
}
