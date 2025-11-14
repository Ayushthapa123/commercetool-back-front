import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    "ar-SA",
    "cs-CZ",
    "da-DK",
    "de-DE",
    "en-AU",
    "en-GB",
    "en-US",
    "es-CO",
    "es-ES",
    "es-MX",
    "fr-CA",
    "fr-FR",
    "it-IT",
    "ja-JP",
    "ko-KR",
    "nl-BE",
    "pl-PL",
    "pt-BR",
    "ru-RU",
    "sv-SE",
    "tr-TR",
    "zh-CN",
  ],
  // Used when no locale matches
  defaultLocale: "en-GB",
  localeCookie: {
    name: "locale",
  },
});
