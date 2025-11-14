import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from "@/lib/constants";
import { PimData, ProductModel } from "@/lib/models/productModel";
import { mapProductModel } from "@/lib/product";
import { mapPIMData } from "@/lib/product/mapPIMData";
import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken, logError } from "@/lib/utils";
import {
  Cart,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductsInStorePagedQueryResponse,
} from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

/**
 * Returns the related products for a specified cart id if present, otherwise
 * will return the most viewed products.
 * @param request the request object
 * @returns an array products
 */
export async function GET(request: Request): APIResponse<ProductModel[]> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const token = await getServiceAuthToken();
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId") ?? "";
  const currency = searchParams.get("currency") ?? DEFAULT_CURRENCY;
  const locale = request.headers.get("Accept-Language") ?? DEFAULT_LOCALE;

  const buildPredicateParams = mapParams(locale, currency);
  const cartProductIds: string[] = [];
  const mostViewedIds: string[] = [];
  const crossSellIds: Set<string> = new Set<string>();

  if (cartId !== "") {
    const cartOptions: AxiosRequestConfig = {
      method: "GET",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/carts/${cartId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data: cart } = await axios.request<Cart>(cartOptions);
      cart.lineItems.forEach((item) => cartProductIds.push(item.productId));

      // Array of PIM data pulled from each line item in the cart
      const cartPimData: PimData[] = cart.lineItems
        .map((item) => {
          const pimAttribute = item.variant.attributes?.find(
            (attribute) => attribute.name === "pim-content",
          );
          return pimAttribute ? pimAttribute.value : "";
        })
        .map((data) => mapPIMData(data, locale));

      const crossSellSkus = cartPimData.flatMap((data) => data.crossSell);
      const params = buildPredicateParams(crossSellSkus, "sku");
      const projections = await getProductsByParams(params);
      const crossSells = projections.map((product) =>
        mapProductModel(product, locale, currency),
      );

      crossSells.forEach((product) => crossSellIds.add(product.id));
    } catch (error: unknown) {
      logError(error, `Unable to retrieve cart with id: ${cartId}`);
    }
  }

  const mostViewedOptions: AxiosRequestConfig = {
    method: "GET",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/product-selections/key=most-viewed-products/products`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data: mostViewedData } =
      await axios.request<ProductsInStorePagedQueryResponse>(mostViewedOptions);

    mostViewedData.results.map((selection) =>
      mostViewedIds.push(selection.product.id),
    );
  } catch (error: unknown) {
    return errorResponse(
      error,
      "Unable to retrieve most viewed list of products",
    );
  }

  const combinedIds = [...new Set([...crossSellIds, ...mostViewedIds])];
  const filteredIds = combinedIds.filter((id) => !cartProductIds.includes(id));

  const params = buildPredicateParams(filteredIds, "id");
  const projections = await getProductsByParams(params);
  const products = projections.map((product) =>
    mapProductModel(product, locale, currency),
  );

  return NextResponse.json(products.slice(0, 5), { status: 200 });
}

type PredicateType = "sku" | "id";

type PredicateParamsFunction = (
  vars: string[],
  predicateType: PredicateType,
) => URLSearchParams;

/**
 * Returns a function to be used for mapping a query predicate and associated
 * vars to be included in commercetools product requests.
 * @param locale the locale
 * @param currency the currency iso code
 * @returns a function to build query params
 */
function mapParams(locale: string, currency: string): PredicateParamsFunction {
  return function (vars: string[], predicateType: PredicateType) {
    const country = locale?.split("-")[1] ?? DEFAULT_COUNTRY;

    const params = new URLSearchParams();
    params.append("priceCurrency", currency);
    params.append("priceCountry", country);
    params.append("localeProjection", locale);

    switch (predicateType) {
      case "sku": {
        params.append("where", "masterVariant(sku in :skus)");
        vars.forEach((sku) => params.append("var.skus", sku));
        break;
      }
      case "id": {
        params.append("where", "id in :ids");
        vars.forEach((id) => params.append("var.ids", id));
        break;
      }
    }

    return params;
  };
}

/**
 * Retrieve products from commercetools based on provided params.
 * @param params the query params to include
 * @returns a list of product models
 */
async function getProductsByParams(
  params: URLSearchParams,
): Promise<ProductProjection[]> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const token = await getServiceAuthToken();

  try {
    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/product-projections`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: params,
    };

    const { data } =
      await axios.request<ProductProjectionPagedQueryResponse>(options);

    return data.results;
  } catch (error: unknown) {
    logError(error, "Unable to retrieve products");
    return [];
  }
}
