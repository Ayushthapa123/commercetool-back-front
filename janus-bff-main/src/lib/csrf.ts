import csrf from "csrf";

// Use CSRF_SECRET from environment
const secret = process.env.CSRF_SECRET || "default-secret-change-in-production";

// Initialize CSRF tokens instance with the secret
const tokens = new csrf();

// Generate a CSRF token
export function generateCsrfToken(): string {
  return tokens.create(secret);
}

// Validate CSRF token
export function validateCsrfToken(token: string): boolean {
  try {
    return tokens.verify(secret, token);
  } catch (error) {
    console.error("CSRF validation error:", error);
    return false;
  }
}

