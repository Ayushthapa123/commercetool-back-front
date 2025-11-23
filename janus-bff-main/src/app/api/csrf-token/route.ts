// import { generateCsrfToken } from "@/lib/csrf";
import { generateSignedToken } from "@csrf-armor/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Generate CSRF token
    const token = await generateSignedToken(process.env.CSRF_SECRET!);
    console.log("tokennnnnnnnnnnnnnnn", token);

    return NextResponse.json({ csrfToken: token }, { status: 200 });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 },
    );
  }
}
