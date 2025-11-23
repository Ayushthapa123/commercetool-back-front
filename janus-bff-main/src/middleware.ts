import { createCsrfMiddleware } from "@csrf-armor/nextjs";
import { NextRequest, NextResponse } from "next/server";

const csrfProtect = createCsrfMiddleware({
  strategy: "signed-double-submit",
  secret: process.env.CSRF_SECRET!,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // you can change sameSite if needed
    httpOnly: false,
    // you can also configure cookie name, path, maxAge, etc.
  },
});

// Basic auth credentials
const { BFF_USERNAME: USERNAME, BFF_PASSWORD: PASSWORD } = process.env;

// Function to validate basic auth credentials
function validateBasicAuth(authHeader: string | null): boolean {
  if (!USERNAME || !PASSWORD) {
    throw new Error(
      "Basic auth credentials are not set in environment variables."
    );
  }
  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");

  return username === USERNAME && password === PASSWORD;
}

function isComingFromBrowser(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const xreq = request.headers.get("x-requested-with");
  const authHeader = request.headers.get("authorization");

  // server calls using Basic Auth are NOT browser requests
  const hasBasicAuth =
    authHeader && authHeader.toLowerCase().startsWith("basic ");

  if (hasBasicAuth) return false;

  // Browser indicators
  if (origin) return true;
  if (referer) return true;
  if (xreq && xreq.toLowerCase() === "xmlhttprequest") return true;

  return false;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/health/liveness")) {
    return NextResponse.next();
  }

  // csrf protection/////////////////////////////
  const response = NextResponse.next();
  if (isComingFromBrowser(request)) {
    const result = await csrfProtect(request, response); // only checks post, put, delete requests

    if (!result.success) {
      // CSRF validation failed
      return NextResponse.json({ error: "Forbidden (CSRF)" }, { status: 403 });
    }
  }

  const authHeader = request.headers.get("authorization");

  if (!validateBasicAuth(authHeader)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Add security headers for all requests
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Add CORS headers for OPTIONS requests
  if (request.method === "OPTIONS") {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/api/:path*",
};
