import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

/**
 * Test endpoint that logs the incoming POST request
 * @param request the request object
 * @returns success response
 */
export async function POST(request: Request) {
  try {
    console.log('inside tttttttttttttttttttttttttt')
    const body = await request.json();
    const headers = Object.fromEntries(request.headers.entries());
    const url = request.url;

    logger.info(
      {
        url,
        method: "POST",
        headers,
        body,
      },
      "Test POST request received",
    );

    return NextResponse.json(
      {
        message: "Request logged successfully",
        received: {
          url,
          method: "POST",
          headers,
          body,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    logger.error({ error }, "Error processing test POST request");
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
