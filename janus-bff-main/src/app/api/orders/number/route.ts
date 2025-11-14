import { generateOrderNumber } from "@/lib/db/orderNumber";
import { OrderNumberModel } from "@/lib/models/orderModel";
import { APIResponse } from "@/lib/types";
import { errorResponse } from "@/lib/utils";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

/**
 * Creates a new order number
 * @returns order number
 */
export async function POST(): APIResponse<OrderNumberModel> {
  try {
    const orderNumber = await generateOrderNumber();
    const json: OrderNumberModel = { orderNumber: orderNumber };
    return NextResponse.json(json, { status: HttpStatusCode.Ok });
  } catch (error: unknown) {
    return errorResponse(error, "Unable to create order number");
  }
}
