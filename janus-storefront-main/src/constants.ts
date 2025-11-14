import { Appearance } from "@stripe/stripe-js";

export const StripeAppearance: Appearance = {
  theme: "stripe",
  variables: {
    fontSizeBase: "14px",
    fontFamily: "Roboto, Arial, sans-serif",
    fontWeightNormal: "400",
    borderRadius: "2px",
    colorDanger: "#BD2024",
    colorTextPlaceholder: "#767676",
  },
  rules: {
    ".Input": {
      boxShadow: "0px 0px 0px 0px",
      borderRadius: "2px",
      fontSize: "14px",
      fontFamily: "Roboto, Arial, sans-serif",
      fontWeight: "400",
    },
    ".Label": {
      fontSize: "14px",
      fontFamily: "Roboto, Arial, sans-serif",
      fontWeight: "400",
      color: "#0a0a0a",
      lineHeight: "100%",
    },
  },
};

export type Country = "GB" | "DE" | "BE" | "FR" | "NL" | "ES" | "IT";

export enum PaymentStatus {
  SUCCEEDED = "succeeded",
  NOT_INITIATED = "payment_not_initiated",
  PAID = "paid",
  FAILED = "payment_failed",
  ERROR = "error",
}

export enum ErrorStatus {
  UNKNOWN_PAYMENT_STATUS = "unknown_payment_status",
}

export enum SpecialFlag {
  NEXT_REDIRECT = "NEXT_REDIRECT",
  ORDER_PROCESSING_FAILED = "order_processing_failed",
}

export const ERROR_MESSAGE = "Unexpected payment status:";
export const localeLanguageLookup: Record<string, string> = {
  "en-AU": "English",
  "en-US": "English",
  "es-MX": "Español",
  "fr-CA": "Français",
  "pt-BR": "Português",
  "es-CO": "Español",
  "zh-CN": "中文",
  "ja-JP": "日本語",
  "ko-KN": "한국어",
  "en-GB": "English",
  "es-ES": "Español",
  "nl-BE": "Nederlands",
  "de-DE": "Deutsch",
  "fr-FR": "Français",
  "ru-RU": "Pусский",
  "it-IT": "Italiano",
  "pl-PL": "Polski",
  "sv-SE": "Svenska",
  "tr-TR": "Türkçe",
  "cs-CZ": "čeština",
  "da-DK": "Dansk",
  "ar-SA": "العربية",
  "nl-NL": "Nederlands",
};

export const eCommerceLocales = [
  "en-GB",
  "fr-FR",
  "it-IT",
  "es-ES",
  "de-DE",
  "nl-BE",
];
