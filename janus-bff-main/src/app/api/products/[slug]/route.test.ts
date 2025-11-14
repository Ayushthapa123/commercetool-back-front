import { ProductModel } from "@/lib/models/productModel";
import {
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from "@commercetools/platform-sdk";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as route from "./route";

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");

  return {
    HttpStatusCode: actual.HttpStatusCode,
    isAxiosError: vi.fn(),
    default: {
      request: vi.fn(),
    },
  };
});

vi.mock("@/lib/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/lib/utils", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/utils")>("@/lib/utils");

  return {
    ...actual,
    getServiceAuthToken: vi.fn(),
  };
});

const mockResponse: ProductProjectionPagedQueryResponse = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [
    {
      id: "asdf-1234",
      version: 12,
      productType: {
        typeId: "product-type",
        id: "type-id-123",
      },
      name: {
        "en-GB": "Product Name",
      },
      description: {
        "en-GB": "Product Description",
      },
      categories: [],
      categoryOrderHints: {},
      slug: {
        "en-GB": "dummy-slug-123",
      },
      masterVariant: {
        id: 1,
        sku: "100123",
        key: "100123",
        prices: [],
        images: [],
        attributes: [],
        price: {
          id: "price-id-123",
          value: {
            type: "centPrecision",
            currencyCode: "GBP",
            centAmount: 7500,
            fractionDigits: 2,
          },
          key: "100123-GB",
          country: "GB",
        },
        assets: [],
      },
      variants: [],
      searchKeywords: {},
      attributes: [],
      hasStagedChanges: false,
      published: true,
      key: "100123-key",
      taxCategory: {
        typeId: "tax-category",
        id: "category-id-123",
      },
      priceMode: "Standalone",
      createdAt: "",
      lastModifiedAt: "",
    },
  ],
};

describe("GET handler", () => {
  const slug = "asdf-1234";
  const baseUrl = `http://localhost:4000/api/product/${slug}`;
  const context = {
    params: Promise.resolve({ slug }),
  };

  const mockEnv = {
    CTP_API_URL: "https://api.example.com",
    CTP_PROJECT_KEY: "graco-ct-dev",
  };

  beforeEach(() => {
    process.env.CTP_API_URL = mockEnv.CTP_API_URL;
    process.env.CTP_PROJECT_KEY = mockEnv.CTP_PROJECT_KEY;
    vi.clearAllMocks();
  });

  it("happy path", async () => {
    // given
    const axios = (await import("axios")).default;
    // Mock commercetools API response
    vi.mocked(axios.request).mockResolvedValue({
      data: mockResponse,
      status: 200,
    });

    const url = `${baseUrl}?currency=GBP&locale=en-GB`;
    const request = new NextRequest(url, { method: "GET" });

    // when
    const response = await route.GET(request, context);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const product: ProductModel = {
      id: "asdf-1234",
      name: "Product Name",
      sku: "100123",
      active: false,
      key: "100123-key",
      videos: [],
      images: [],
      price: {
        currencyIso: "GBP",
        formattedValue: "£75.00",
        value: 7500,
      },
      linkAddress: "/homeowner/product/dummy-slug-123",
      videoGalleryId: "",
      inStock: true,
      limit: 10,
      family: "",
      attributes: [],
      bullets: [],
      documents: [],
      crossSell: [],
      upSell: [],
      repairParts: [],
      bom: [],
      applicationText: "",
      marketingText: "",
      WTB: "",
      educationLink: "",
      commerceEnabled: false,
      new: false,
    };

    expect(json).toEqual(product);
    expect(response.status).toEqual(200);
  });

  it("error - multiple results found", async () => {
    // given
    const mock: ProductProjectionPagedQueryResponse = {
      limit: 20,
      offset: 0,
      count: 2,
      total: 2,
      results: [{} as ProductProjection, {} as ProductProjection],
    };
    vi.mocked(axios.request).mockResolvedValue({
      data: mock,
      status: 200,
    });

    const url = `${baseUrl}?currency=GBP&locale=en-GB`;
    const request = new NextRequest(url, { method: "GET" });

    // when
    const response = await route.GET(request, context);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const message = `Unable to retrieve product with slug: ${slug}`;
    const errorMessage = `Exact match for product with slug: ${slug} not found`;
    expect(json).toEqual({
      code: "NotFoundError",
      message: message,
      errors: [
        { name: "NotFoundError", message: errorMessage, statusCode: 404 },
      ],
    });
    expect(response.status).toEqual(404);
  });

  it("error - no results found", async () => {
    // given
    const mock: ProductProjectionPagedQueryResponse = {
      limit: 20,
      offset: 0,
      count: 0,
      total: 0,
      results: [],
    };
    vi.mocked(axios.request).mockResolvedValue({
      data: mock,
      status: 200,
    });

    const url = `${baseUrl}?currency=GBP&locale=en-GB`;
    const request = new NextRequest(url, { method: "GET" });

    // when
    const response = await route.GET(request, context);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const message = `Unable to retrieve product with slug: ${slug}`;
    const errorMessage = `Exact match for product with slug: ${slug} not found`;
    expect(json).toEqual({
      code: "NotFoundError",
      message: message,
      errors: [
        { name: "NotFoundError", message: errorMessage, statusCode: 404 },
      ],
    });
    expect(response.status).toEqual(404);
  });
});
