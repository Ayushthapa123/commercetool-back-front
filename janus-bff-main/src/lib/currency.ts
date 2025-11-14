export type Country = "GB" | "DE" | "BE" | "FR" | "NL" | "ES" | "IT";
export type CurrencyIso = "EUR" | "GBP";

export const currencies: CurrencyIso[] = ["EUR", "GBP"];

export const currencyToCountries: Record<CurrencyIso, Country[]> = {
  EUR: ["DE", "BE", "FR", "NL", "ES", "IT"],
  GBP: ["GB"],
};
