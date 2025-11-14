import { PriceModel } from "@/lib/models/priceModel";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { ShippingMethodPagedQueryResponse } from "@commercetools/platform-sdk";
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

describe("GET handler", () => {
  const cartId = "asdf-1234";
  const baseUrl = `http://localhost:4000/api/shipping-method?cartid=${cartId}`;
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
    const axios = (await import("axios")).default;
    const mockShippingMethodResponse: ShippingMethodPagedQueryResponse = {
      limit: 20,
      offset: 0,
      count: 1,
      total: 1,
      results: [
        {
          id: "asdf-1234",
          version: 3,
          name: "DHL",
          localizedDescription: {
            "en-GB": "Standard delivery",
          },
          taxCategory: {
            typeId: "tax-category",
            id: "5a21f15b-34f8-4b7f-9407-d1eb82a73eba",
          },
          zoneRates: [
            {
              zone: {
                typeId: "zone",
                id: "5cb532be-c680-43ab-ba14-b664bb03dc35",
              },
              shippingRates: [
                {
                  price: {
                    type: "centPrecision",
                    fractionDigits: 2,
                    currencyCode: "EUR",
                    centAmount: 570,
                  },
                  isMatching: true,
                  freeAbove: {
                    type: "centPrecision",
                    fractionDigits: 2,
                    currencyCode: "EUR",
                    centAmount: 7500,
                  },
                  tiers: [],
                },
              ],
            },
            {
              zone: {
                typeId: "zone",
                id: "ebe01381-82be-4e63-9993-d1eb8f8e588b",
              },
              shippingRates: [
                {
                  price: {
                    type: "centPrecision",
                    fractionDigits: 2,
                    currencyCode: "USD",
                    centAmount: 990,
                  },
                  tiers: [],
                },
              ],
            },
          ],
          active: true,
          isDefault: false,
          createdAt: "2015-01-21T09:22:04.320Z",
          lastModifiedAt: "2016-02-24T13:36:56.748Z",
        },
      ],
    };

    // Mock commercetools API response
    vi.mocked(axios.request).mockResolvedValue({
      data: mockShippingMethodResponse,
      status: 200,
    });

    const request = new NextRequest(baseUrl, { method: "GET" });
    const response = await route.GET(request);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const cost: PriceModel = {
      currencyIso: "EUR",
      formattedValue: "€5.70",
      value: 570,
    };
    const freeAbove: PriceModel = {
      currencyIso: "EUR",
      formattedValue: "€75.00",
      value: 7500,
    };

    const result: ShippingMethodModel = {
      id: "asdf-1234",
      deliveryCost: cost,
      description: "Standard delivery",
      name: "DHL",
      freeShipLevel: freeAbove,
    };

    // JSON is not modified, simply passed through
    expect(json).toEqual([result]);
    expect(response.status).toEqual(200);
  });

  it("error getting shipping methods for cart", async () => {
    const axios = (await import("axios")).default;
    const error = new Error("Error occurred.");
    vi.mocked(axios.request).mockRejectedValue(error);

    const request = new NextRequest(baseUrl, { method: "DELETE" });
    const response = await route.GET(request);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    const message = `Error getting shipping methods for cart with id: ${cartId}`;
    expect(json).toEqual({
      code: "Error",
      message: message,
      errors: [{}],
    });
    expect(response.status).toEqual(500);
  });
});
