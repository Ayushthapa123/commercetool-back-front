import { NextRequest, NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    logger.info("hello get");
    // Generate CSRF token
    const token = generateCsrfToken();
    console.log("tokennnnnnnnnnnnnnnn", token);

    return NextResponse.json({ csrfToken: token }, { status: 200 });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}

