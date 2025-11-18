// lib/http/getCsrfToken.ts
import axios from "axios";

/**
 * Fetch CSRF token from BFF.
 */
export async function getCsrfToken(auth: string): Promise<string> {
  const url = `${process.env.BFF_URL?.replace(/\/$/, "") ?? ""}/api/csrf-token`;

  if (!process.env.BFF_URL) {
    throw new Error("BFF_URL is not set in environment variables");
  }
  console.log("urlllllllllllllllllllllll", url, auth);

  const res = await axios.get(url, {
    withCredentials: true,
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },

  });
  const token = res?.data?.csrfToken;

  if (!token || typeof token !== "string") {
    throw new Error("Invalid response: missing csrfToken");
  }

  return token;
}
