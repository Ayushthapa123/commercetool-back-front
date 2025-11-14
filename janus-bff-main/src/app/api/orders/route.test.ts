import { OrderModel } from "@/lib/models/orderModel";
import { PriceModel } from "@/lib/models/priceModel";
import { Order, OrderFromCartDraft } from "@commercetools/platform-sdk";
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
  const baseUrl = "http://localhost:4000/api/orders";
  const data: OrderFromCartDraft = {
    cart: {
      typeId: "cart",
      key: "test-cart-123",
    },
    orderNumber: "555555555",
    version: 1,
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
    const mockOrder: Order = {
      id: "asdf-1234",
      version: 1,
      createdAt: "2017-01-04T19:54:49.797Z",
      lastModifiedAt: "2017-01-04T19:54:49.797Z",
      totalPrice: {
        type: "centPrecision",
        fractionDigits: 2,
        currencyCode: "EUR",
        centAmount: 1000,
      },
      orderState: "Open",
      orderNumber: "100000000",
      syncInfo: [],
      refusedGifts: [],
      lineItems: [
        {
          id: "7297c742-d8b0-484b-aadc-1d0ba1869dc9",
          productId: "c5c75935-595a-4cc3-a80e-24e9a9c55094",
          productKey: "product-key-123",
          name: {
            "en-GB": "MyProduct",
          },
          productType: {
            typeId: "product-type",
            id: "a5c7e173-9754-4f02-9b18-a600896ae0e1",
          },
          productSlug: {
            de: "neues-produkt-slug-1234678",
            en: "new-product-slug-12345678",
          },
          variant: {
            id: 1,
            sku: "some-sku-123",
            prices: [
              {
                value: {
                  type: "centPrecision",
                  fractionDigits: 2,
                  currencyCode: "EUR",
                  centAmount: 1000,
                },
                id: "6d36dc85-6131-495d-9f20-d00f411d4124",
              },
            ],
            images: [],
            attributes: [
              {
                name: "text",
                value: "attribute-value",
              },
              {
                name: "enum",
                value: {
                  key: "test",
                  label: "test",
                },
              },
            ],
            assets: [],
          },
          price: {
            id: "6d36dc85-6131-495d-9f20-d00f411d4124",
            value: {
              type: "centPrecision",
              fractionDigits: 2,
              currencyCode: "EUR",
              centAmount: 1000,
            },
          },
          quantity: 1,
          discountedPricePerQuantity: [],
          taxRate: {
            name: "Bla",
            amount: 0.1,
            includedInPrice: false,
            country: "DE",
            subRates: [],
          },
          state: [
            {
              quantity: 1,
              state: {
                typeId: "state",
                id: "7c2e2694-aefe-43d7-888e-6a99514caaca",
              },
            },
          ],
          priceMode: "Platform",
          lineItemMode: "Standard",
          totalPrice: {
            type: "centPrecision",
            fractionDigits: 2,
            currencyCode: "EUR",
            centAmount: 1000,
          },
          taxedPrice: {
            totalNet: {
              type: "centPrecision",
              fractionDigits: 2,
              currencyCode: "EUR",
              centAmount: 1000,
            },
            totalGross: {
              type: "centPrecision",
              fractionDigits: 2,
              currencyCode: "EUR",
              centAmount: 1100,
            },
            taxPortions: [
              {
                rate: 0.1,
                amount: {
                  type: "centPrecision",
                  currencyCode: "EUR",
                  centAmount: 634,
                  fractionDigits: 2,
                },
                name: "Bla",
              },
            ],
          },
          perMethodTaxRate: [],
          taxedPricePortions: [],
        },
      ],
      customLineItems: [],
      origin: "Customer",
      customerEmail: "john.doe@example.com",
      shipping: [],
      shippingMode: "Single",
    };

    // Mock commercetools API response
    vi.mocked(axios.request).mockResolvedValue({
      data: mockOrder,
      status: 201,
    });

    const request = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const response = await route.POST(request);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // then
    const price: PriceModel = {
      currencyIso: "EUR",
      formattedValue: "€10.00",
      value: 1000,
    };

    const result: OrderModel = {
      id: "asdf-1234",
      version: 1,
      date: "04/01/2017",
      orderNumber: "100000000",
      email: "john.doe@example.com",
      marketingConsent: false,
      subTotal: price,
      netPrice: price,
      entries: [
        {
          basePrice: {
            currencyIso: "EUR",
            formattedValue: "€10.00",
            value: 1000,
          },
          id: "7297c742-d8b0-484b-aadc-1d0ba1869dc9",
          netPrice: {
            currencyIso: "EUR",
            formattedValue: "€10.00",
            value: 1000,
          },
          product: {
            WTB: "",
            active: false,
            applicationText: "",
            attributes: [],
            bom: [],
            bullets: [],
            commerceEnabled: true,
            crossSell: [],
            documents: [],
            educationLink: "",
            family: "",
            id: "c5c75935-595a-4cc3-a80e-24e9a9c55094",
            videos: [],
            images: [],
            inStock: true,
            key: "product-key-123",
            limit: 10,
            linkAddress: "/homeowner/product/",
            marketingText: "",
            name: "MyProduct",
            new: false,
            price: {
              currencyIso: "EUR",
              formattedValue: "€10.00",
              value: 1000,
            },
            repairParts: [],
            sku: "some-sku-123",
            upSell: [],
            videoGalleryId: "",
          },
          quantity: 1,
        },
      ],
    };

    expect(json).toEqual(result);
    expect(response.status).toEqual(201);
  });

  it("error creating order from cart", async () => {
    const axios = (await import("axios")).default;
    const error = new Error("Error occurred.");
    vi.mocked(axios.request).mockRejectedValue(error);

    const request = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const response = await route.POST(request);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    const message = `Unable to create order from cart: ${data.cart?.id}`;
    expect(json).toEqual({
      code: "Error",
      message: message,
      errors: [{}],
    });
    expect(response.status).toEqual(500);
  });
});
