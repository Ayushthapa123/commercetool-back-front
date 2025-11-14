import { CartModel } from "@/lib/models/cartModel";
import { Cart, CartDraft, CartStateValues } from "@commercetools/platform-sdk";
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

describe("POST handler", () => {
  const baseUrl = `http://localhost:4000/api/carts`;
  const draft: CartDraft = {
    locale: "en-GB",
    currency: "GBP",
    country: "UK",
    anonymousId: "asdf-1234",
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
    const axios = (await import("axios")).default;
    const mockCart: Cart = {
      id: "asdf-1234",
      version: 1,
      createdAt: "2025-08-11T17:25:11.909Z",
      lastModifiedAt: "2025-08-11T17:25:11.909Z",
      locale: "en-GB",
      lineItems: [],
      cartState: "Active",
      totalPrice: {
        type: "centPrecision",
        currencyCode: "EUR",
        centAmount: 0,
        fractionDigits: 2,
      },
      shippingMode: "Single",
      shipping: [],
      customLineItems: [],
      discountCodes: [],
      directDiscounts: [],
      inventoryMode: "None",
      priceRoundingMode: "HalfEven",
      taxMode: "Platform",
      taxRoundingMode: "HalfEven",
      taxCalculationMode: "LineItemLevel",
      deleteDaysAfterLastModification: 30,
      refusedGifts: [],
      origin: "Customer",
      itemShippingAddresses: [],
    };

    // Mock commercetools API response
    vi.mocked(axios.request).mockResolvedValue({
      data: mockCart,
      status: 201,
    });

    const request = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(draft),
    });

    const response = await route.POST(request);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const result: CartModel = {
      id: "asdf-1234",
      version: 1,
      totalItems: 0,
      entries: [],
      freeShipLevel: 0,
      locale: "en-GB",
      subTotal: {
        currencyIso: "EUR",
        formattedValue: "€0.00",
        value: 0,
      },
      date: "11/08/2025",
      cartModifiedDate: "11/08/2025",
      netPrice: {
        currencyIso: "EUR",
        formattedValue: "€0.00",
        value: 0,
      },
      marketingConsent: false,
      state: CartStateValues.Active,
    };

    // JSON is not modified, simply passed through
    expect(json).toEqual(result);
    expect(response.status).toEqual(201);
  });

  it("error creating cart", async () => {
    const axios = (await import("axios")).default;
    const error = new Error("Error occurred.");
    vi.mocked(axios.request).mockRejectedValue(error);

    const request = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(draft),
    });

    const response = await route.POST(request);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    const message = `Error creating cart for anonymous id: ${draft.anonymousId}`;
    expect(json).toEqual({
      code: "Error",
      message: message,
      errors: [{}],
    });
    expect(response.status).toEqual(500);
  });
});
