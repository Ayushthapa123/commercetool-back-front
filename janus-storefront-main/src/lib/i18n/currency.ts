import { Country } from "@/constants";
import { z } from "zod";

export type CurrencyType = {
  isoCode: string;
  symbol: string;
};

interface CurrencyMap {
  [key: string]: CurrencyType;
}

export const CURRENCIES: CurrencyMap = {
  EUR: { isoCode: "EUR", symbol: "€" },
  GBP: { isoCode: "GBP", symbol: "£" },
} as const;

export async function getDefaultCurrency(
  locale: string,
): Promise<CurrencyType> {
  return locale === "en-GB" ? CURRENCIES.GBP : CURRENCIES.EUR;
}

const currencyIsoValues = [
  CURRENCIES.EUR.isoCode,
  CURRENCIES.GBP.isoCode,
] as const;

export const CurrencyEnumSchema = z.enum(currencyIsoValues);

type CurrencyIso = (typeof currencyIsoValues)[number];

export const currencyToCountries: Record<CurrencyIso, Country[]> = {
  GBP: ["GB"],
  EUR: ["DE", "BE", "FR", "NL", "ES", "IT"],
} as const;
