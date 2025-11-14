import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { mapPriceModel } from "@/lib/models/utils";
import { ShippingMethod } from "@commercetools/platform-sdk";
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

const mockShippingMethodResponse: ShippingMethod = {
  id: "asdf-1234",
  version: 3,
  createdAt: "2025-08-07T19:39:39.178Z",
  lastModifiedAt: "2025-09-19T19:03:59.893Z",
  name: "Standard Shipping",
  localizedDescription: {
    "en-GB": "Standard Shipping",
    "fr-FR": "Standard Shipping",
  },
  key: "standard-shipping",
  taxCategory: {
    typeId: "tax-category",
    id: "asdf-1234",
  },
  zoneRates: [
    {
      zone: {
        typeId: "zone",
        id: "zone-1234",
      },
      shippingRates: [
        {
          price: {
            type: "centPrecision",
            centAmount: 999,
            currencyCode: "EUR",
            fractionDigits: 2,
          },
          tiers: [],
          freeAbove: {
            type: "centPrecision",
            centAmount: 7500,
            currencyCode: "EUR",
            fractionDigits: 2,
          },
        },
        {
          price: {
            type: "centPrecision",
            centAmount: 700,
            currencyCode: "GBP",
            fractionDigits: 2,
          },
          tiers: [],
          freeAbove: {
            type: "centPrecision",
            centAmount: 7500,
            currencyCode: "GBP",
            fractionDigits: 2,
          },
        },
      ],
    },
  ],
  active: true,
  isDefault: true,
};

describe("GET handler", () => {
  const key = "standard-shipping";
  const baseUrl = `http://localhost:4000/api/shipping-method/${key}`;
  const context = {
    params: Promise.resolve({ key: key }),
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

  it("happy path - GBP", async () => {
    // given
    const axios = (await import("axios")).default;
    vi.mocked(axios.request).mockResolvedValue({
      data: mockShippingMethodResponse,
      status: 200,
    });

    const url = `${baseUrl}?currency=GBP`;
    const request = new NextRequest(url, {
      method: "GET",
      headers: {
        "Accept-Language": "en-GB",
      },
    });

    // when
    const response = await route.GET(request, context);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const method: ShippingMethodModel = {
      id: "asdf-1234",
      deliveryCost: mapPriceModel("en-GB")("GBP")(700),
      description: "Standard Shipping",
      name: "Standard Shipping",
      freeShipLevel: mapPriceModel("en-GB")("GBP")(7500),
    };

    expect(response.status).toBe(200);
    expect(json).toEqual(method);
  });

  it("happy path - EUR", async () => {
    // given
    const axios = (await import("axios")).default;
    vi.mocked(axios.request).mockResolvedValue({
      data: mockShippingMethodResponse,
      status: 200,
    });

    const url = `${baseUrl}?currency=EUR`;
    const request = new NextRequest(url, {
      method: "GET",
      headers: {
        "Accept-Language": "fr-FR",
      },
    });

    // when
    const response = await route.GET(request, context);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const method: ShippingMethodModel = {
      id: "asdf-1234",
      deliveryCost: mapPriceModel("fr-FR")("EUR")(999),
      description: "Standard Shipping",
      name: "Standard Shipping",
      freeShipLevel: mapPriceModel("fr-FR")("EUR")(7500),
    };

    expect(response.status).toBe(200);
    expect(json).toEqual(method);
  });

  it("error - no currency provided", async () => {
    // given
    const axios = (await import("axios")).default;
    vi.mocked(axios.request).mockResolvedValue({
      data: mockShippingMethodResponse,
      status: 200,
    });

    const request = new NextRequest(baseUrl, { method: "GET" });

    // when
    const response = await route.GET(request, context);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const message = `Error getting shipping method with key: ${key}`;
    const errorMessage = "Currency is a required field";
    expect(json).toEqual({
      code: "RequiredFieldError",
      message: message,
      errors: [
        {
          field: "currency",
          name: "RequiredFieldError",
          message: errorMessage,
          statusCode: 400,
        },
      ],
    });
    expect(response.status).toEqual(400);
  });

  it("error retrieving shipping method", async () => {
    // given
    const axios = (await import("axios")).default;
    const error = new Error("Error occurred.");
    vi.mocked(axios.request).mockRejectedValue(error);
    const url = `${baseUrl}?currency=GBP`;
    const request = new NextRequest(url, { method: "GET" });

    // when
    const response = await route.GET(request, context);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const message = `Error getting shipping method with key: ${key}`;
    expect(json).toEqual({
      code: "Error",
      message: message,
      errors: [{}],
    });
    expect(response.status).toEqual(500);
  });
});
