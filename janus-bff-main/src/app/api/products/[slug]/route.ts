import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from "@/lib/constants";
import { NotFoundError } from "@/lib/exception";
import { logger } from "@/lib/logger";
import { ProductModel } from "@/lib/models/productModel";
import { mapProductModel } from "@/lib/product";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { ProductProjectionPagedQueryResponse } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig, HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

/**
 * Returns the product matching the specified url slug.
 * @param request the request object
 * @param context the context object containing the product url slug
 * @returns a product model
 */
export async function GET(
  request: Request,
  context: RouteParams,
): APIResponse<ProductModel> {
  console.log("contextcontextcontextcontext", context);
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency") ?? DEFAULT_CURRENCY;
  const locale = request.headers.get("Accept-Language") ?? DEFAULT_LOCALE;
  const country = locale.split("-")[1] ?? DEFAULT_COUNTRY;
  console.log("slugslugslugslug", slug);

  const params = new URLSearchParams();
  const slugQuery = `slug(${locale}="${slug}")`;
  params.append("where", slugQuery);
  params.append("priceCurrency", currency);
  params.append("priceCountry", country);
  params.append("localeProjection", locale);

  const token = await getServiceAuthToken();
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
    console.log("optionsoptionsoptionsoptions", options);
    const { data } =
      await axios.request<ProductProjectionPagedQueryResponse>(options);

    if (data.count > 1 || data.count === 0) {
      const message = `Exact match for product with slug: ${slug} not found`;
      logger.warn(message);
      throw new NotFoundError(message);
    }
    console.log("dataaaaaaaaaaaaaaaaaa", data);

    const product = data.results[0];
    const result = mapProductModel(product, locale, currency);
    return NextResponse.json(result, { status: HttpStatusCode.Ok });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Unable to retrieve product with slug: ${slug}`,
    );
  }
}
