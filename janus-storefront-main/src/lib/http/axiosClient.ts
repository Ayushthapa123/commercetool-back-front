import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { logger } from "@/lib/logger";

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

// --- Fetch CSRF Token (only once) ---
async function fetchCsrfToken(): Promise<string> {
  try {
    const res = await axios.get(`${process.env.BFF_URL}/csrf-token`, {
      withCredentials: true, // if your CSRF cookie is HttpOnly
    });
    return res.data.csrfToken;
  } catch (err) {
    logger.error("Failed to fetch CSRF token", err);
    throw err;
  }
}

// --- Getter that ensures token is loaded once ---
async function getOrLoadCsrfToken() {
  if (csrfToken) return csrfToken;

  if (!csrfPromise) {
    csrfPromise = fetchCsrfToken().then((token) => {
      csrfToken = token;
      csrfPromise = null;
      return token;
    });
  }

  return csrfPromise;
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // Skip CSRF injection for the CSRF endpoint itself
    if (config.url?.includes("/auth/csrf")) {
      return config;
    }

    // Load CSRF token if not loaded
    const token = await getOrLoadCsrfToken();

    config.headers = {
      ...config.headers,
      "x-csrf-token": token,
    };

    return config;
  },
  (error) => {
    logger.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error("Axios Response Error:", {
      status: error?.response?.status,
      url: error?.config?.url,
      data: error?.response?.data,
    });

    return Promise.reject(error);
  }
);

export default axiosClient;
