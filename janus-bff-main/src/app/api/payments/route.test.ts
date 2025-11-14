import { PaymentDraft } from "@commercetools/platform-sdk";
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
    errorResponse: actual.errorResponse,
    getServiceAuthToken: vi.fn(),
  };
});

describe("POST handler", () => {
  const baseUrl = "http://localhost:4000/api/payments";
  const draft: PaymentDraft = {
    anonymousId: "asdf-1234",
    amountPlanned: {
      centAmount: 10000,
      currencyCode: "EUR",
    },
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
    // Mock commercetools API response
    vi.mocked(axios.request).mockResolvedValue({
      data: { test: "value" },
      status: 201,
    });

    const request = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(draft),
    });

    const response = await route.POST(request);
    const json =
      response instanceof NextResponse ? await response.json() : response;

    // JSON is not modified, simply passed through
    expect(json).toEqual({ test: "value" });
    expect(response.status).toEqual(201);
  });

  it("error creating payment", async () => {
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

    const message = `Unable to create payment for anonymous id: ${draft.anonymousId}`;
    expect(json).toEqual({
      code: "Error",
      message: message,
      errors: [{}],
    });
    expect(response.status).toEqual(500);
  });
});
