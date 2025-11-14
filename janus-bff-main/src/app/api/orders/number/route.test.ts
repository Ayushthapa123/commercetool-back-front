import * as orderNumberLib from "@/lib/db/orderNumber";
import { OrderNumberModel } from "@/lib/models/orderModel";
import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const testOrderNumber = "555555555";

describe("POST /api/orders/number", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 and order number on success", async () => {
    vi.spyOn(orderNumberLib, "generateOrderNumber").mockResolvedValue(
      testOrderNumber,
    );
    const res = await POST();
    expect(res).toBeInstanceOf(NextResponse);
    const json: OrderNumberModel = await res.json();
    expect(json).toEqual({ orderNumber: testOrderNumber });
    expect(res.status).toBe(200);
  });
});
