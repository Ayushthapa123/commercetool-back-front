import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Safely merge tailwind classnames while also supporting conditional classes
 * @param inputs Classnames to merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to retrieve and encode the credentials for the BFF.
 * @returns base64 encoded string containing bff creds
 */
export function getBffAuth() {
  const { BFF_USERNAME, BFF_PASSWORD } = process.env;
  if (!BFF_USERNAME || !BFF_PASSWORD) {
    throw new Error("Missing credentials for bff");
  }
  return Buffer.from(`${BFF_USERNAME}:${BFF_PASSWORD}`).toString("base64");
}

/**
 * Performs currying for a 3 argument function to allow for partial application
 * of parameters in order to return a formatted localized string.
 * @param locale the locale
 * @param currency the ISO currency code
 * @returns a currying function to map a price to a formatted localized string
 */
export function formatCurrency(locale: string, currency: string) {
  return function (price: number, fractionDigits: number = 2) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: fractionDigits,
    }).format(price / 100);
  };
}
