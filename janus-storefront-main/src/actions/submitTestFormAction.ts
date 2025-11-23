"use server";

import { getCsrfToken } from "@/lib/http/getCsrfToken";
import { getBffAuth } from "@/lib/utils";
import axios, { AxiosRequestConfig } from "axios";
import { getLocale } from "next-intl/server";

type TestFormData = {
  name: string;
  email: string;
  message: string;
};

export async function submitTestFormAction(
  formData: TestFormData,
): Promise<{
  success: boolean;
  data: unknown;
  error: string | null;
}> {
  const { BFF_URL } = process.env;

  if (!BFF_URL) {
    return {
      success: false,
      data: null,
      error: "BFF_URL is not set in environment variables",
    };
  }

  const auth = getBffAuth();
  const locale = await getLocale();
  const csrfToken = await getCsrfToken(auth);

  try {
    console.log("csrfToken", csrfToken);

    // Now submit the form with CSRF token
    const submitOptions: AxiosRequestConfig = {
      method: "POST",
      url: `${BFF_URL}/test`,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
        Accept: "application/json",
        "Accept-Language": locale,
      },
      data: formData,
      withCredentials: true,
    };

    const response = await axios.request(submitOptions);
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to submit form";
    console.error("Error submitting test form:", err);
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}

