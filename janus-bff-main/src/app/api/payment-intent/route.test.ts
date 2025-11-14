import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as route from "./route";

// Mocks
vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  return {
    ...actual,
    default: {
      request: vi.fn(),
    },
  };
});

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
}));

vi.mock("@/lib/utils", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/utils")>("@/lib/utils");
  return {
    ...actual,
    getServiceAuthToken: vi.fn(),
  };
});

vi.mock("@/lib/cart", () => ({
  mapCartModel: vi.fn((cart) => cart), // mock passthrough
}));

describe("Payment Intent API", () => {
  const cartId = "test-cart-id";
  const mockToken = "fake-token";
  const baseUrl = "http://localhost/api/payment-intent";

  const mockCartData = {
    id: cartId,
    version: 1,
    anonymousId: "anon-1",
    totalPrice: {
      centAmount: 10000,
      currencyCode: "EUR",
    },
  };

  // const mockPaymentIntent = {
  //   id: "pi_123",
  //   amount: 10000,
  //   currency: "EUR",
  //   client_secret: "secret_123",
  // };

  // const mockPayment = {
  //   id: "payment-123",
  // };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CTP_API_URL = "https://api.example.com";
    process.env.CTP_PROJECT_KEY = "my-project";
  });

  // ======== POST ========
  // it("POST: should create Stripe intent and associate payment (happy path)", async () => {
  //   const axios = (await import("axios")).default;
  //   const { getStripe } = await import("@/lib/stripe");
  //   const { getServiceAuthToken } = await import("@/lib/utils");
  //   const { mapCartModel } = await import("@/lib/cart");

  //   vi.mocked(getServiceAuthToken).mockResolvedValue(mockToken);
  //   vi.mocked(getStripe).mockResolvedValue({
  //     paymentIntents: {
  //       create: vi.fn().mockResolvedValue(mockPaymentIntent),
  //     },
  //   } as unknown as Stripe);

  //   // Step 1: Get cart
  //   vi.mocked(axios.request).mockResolvedValueOnce({ data: mockCartData });

  //   // Step 2: Create payment
  //   vi.mocked(axios.request).mockResolvedValueOnce({ data: mockPayment });

  //   // Step 3: Add payment to cart
  //   vi.mocked(axios.request).mockResolvedValueOnce({ data: mockCartData });

  //   const req = new NextRequest(baseUrl, {
  //     method: "POST",
  //     body: JSON.stringify({ cartId }),
  //   });

  //   const res = await route.POST(req);
  //   const json = await res.json();

  //   expect(res.status).toBe(200);
  //   expect(json.paymentIntentData.client_secret).toBe(
  //     mockPaymentIntent.client_secret,
  //   );
  //   expect(json.cart).toEqual(mockCartData);
  //   expect(mapCartModel).toHaveBeenCalled();
  // });

  it("POST: should return 500 on Stripe failure", async () => {
    const axios = (await import("axios")).default;
    const { getStripe } = await import("@/lib/stripe");
    const { getServiceAuthToken } = await import("@/lib/utils");

    vi.mocked(getServiceAuthToken).mockResolvedValue(mockToken);

    // Cart fetch
    vi.mocked(axios.request).mockResolvedValueOnce({ data: mockCartData });

    // Stripe create failure
    vi.mocked(getStripe).mockResolvedValue({
      paymentIntents: {
        create: vi.fn().mockRejectedValue(new Error("Stripe failed")),
      },
    } as unknown as Stripe);

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify({ cartId }),
    });

    const res = await route.POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toContain("Error creating PaymentIntent");
  });

  // ======== GET ========
  // it("GET: should return paymentIntentData if payment exists", async () => {
  //   const axios = (await import("axios")).default;
  //   const { getStripe } = await import("@/lib/stripe");
  //   const { getServiceAuthToken } = await import("@/lib/utils");

  //   vi.mocked(getServiceAuthToken).mockResolvedValue(mockToken);

  //   // Mock GET cart with payment
  //   vi.mocked(axios.request).mockResolvedValueOnce({
  //     data: {
  //       paymentInfo: {
  //         payments: [
  //           {
  //             obj: {
  //               interfaceId: mockPaymentIntent.id,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   });

  //   // Retrieve intent
  //   vi.mocked(getStripe).mockResolvedValue({
  //     paymentIntents: {
  //       retrieve: vi.fn().mockResolvedValue(mockPaymentIntent),
  //     },
  //   } as unknown as Stripe);

  //   const url = new URL(`${baseUrl}?cartId=${cartId}`);
  //   const req = new NextRequest(url, { method: "GET" });

  //   const res = await route.GET(req);
  //   const json = await res.json();

  //   expect(res.status).toBe(200);
  //   expect(json.paymentIntentData.client_secret).toBe(
  //     mockPaymentIntent.client_secret,
  //   );
  // });

  // it("GET: should return 400 if no interfaceId in payment", async () => {
  //   const axios = (await import("axios")).default;
  //   const { getServiceAuthToken } = await import("@/lib/utils");

  //   vi.mocked(getServiceAuthToken).mockResolvedValue(mockToken);

  //   vi.mocked(axios.request).mockResolvedValueOnce({
  //     data: {
  //       paymentInfo: {
  //         payments: [{ obj: {} }],
  //       },
  //     },
  //   });

  //   const url = new URL(`${baseUrl}?cartId=${cartId}`);
  //   const req = new NextRequest(url, { method: "GET" });

  //   const res = await route.GET(req);
  //   const json = await res.json();

  //   expect(res.status).toBe(400);
  //   expect(json.message).toContain("interfaceId");
  // });
});
