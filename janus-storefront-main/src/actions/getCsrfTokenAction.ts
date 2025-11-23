"use server";

import { getBffAuth } from "@/lib/utils";
import axios, { AxiosRequestConfig } from "axios";
import { getLocale } from "next-intl/server";

export async function getCsrfTokenAction(): Promise<{
  csrfToken: string | null;
  error: string | null;
}> {
  const { BFF_URL } = process.env;

  if (!BFF_URL) {
    return {
      csrfToken: null,
      error: "BFF_URL is not set in environment variables",
    };
  }
  const auth = getBffAuth();
  const locale = await getLocale();

  try {
    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${BFF_URL}/csrf-token`,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Accept-Language": locale,
      },
      withCredentials: true,
    };

    const response = await axios.request<{ csrfToken: string }>(options);
    return {
      csrfToken: response.data.csrfToken,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch CSRF token";
    console.error("Error fetching CSRF token:", err);
    return {
      csrfToken: null,
      error: errorMessage,
    };
  }
}
