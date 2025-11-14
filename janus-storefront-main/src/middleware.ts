import { LOCALE } from "@/cookies";
// do not import sessionStore, the middleware runtime can't handle it
import { getBffAuth } from "@/lib/utils";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

export async function middleware(request: NextRequest) {
  const split = request.nextUrl.pathname.split("/");
  const country = split[1]?.toUpperCase();
  const language = split[2]?.toLowerCase();
  const urlLocale = `${language}-${country}`;
  const remainingPath = split.slice(3).join("/");
  const localeCookie = request.cookies.get(LOCALE);
  const url = request.nextUrl;
  const response = NextResponse.next();
  response.headers.set("x-pathname", url.pathname + url.search);

  if (!localeCookie) {
    const { BFF_URL } = process.env;
    const url = `${BFF_URL}/geoip`;
    const auth = getBffAuth();
    const ip = getClientIP(request);

    const ipResponse = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "x-forwarded-for": ip,
      },
    });

    const data = await ipResponse.json();

    const countryLocale = mapCountryToLocale(data);

    response.cookies.set(createLocaleCookie(countryLocale));
    if (countryLocale !== urlLocale) {
      // Redirect to the correct locale path
      const newUrl = new URL(request.url);
      const countryLocaleSplit = countryLocale.split("-");
      newUrl.pathname = `/${countryLocaleSplit[1].toLowerCase()}/${countryLocaleSplit[0]}/${remainingPath}`;
      return NextResponse.redirect(newUrl);
    }
  } else {
    response.cookies.set(createLocaleCookie(urlLocale));
  }

  return response;
}

function createLocaleCookie(value: string): ResponseCookie {
  return {
    name: LOCALE,
    value: value,
    httpOnly: false,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
  };
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Fallback for local development
  console.warn("x-forwarded-for header not found, using fallback IP");
  return "127.0.0.1";
}

function mapCountryToLocale(data: {
  continent: string;
  country: string;
}): string {
  // Map locale to cookie value if needed

  switch (data.continent) {
    case "EU":
    case "AF":
      switch (data.country) {
        case "GB":
          return "en-GB";
        case "DE":
          return "de-DE";
        case "FR":
          return "fr-FR";
        case "ES":
          return "es-ES";
        case "IT":
          return "it-IT";
        case "BE":
          return "nl-BE";
        case "RU":
          return "ru-RU";
        case "PL":
          return "pl-PL";
        case "SV":
          return "sv-SE";
        case "TR":
          return "tr-TR";
        case "CS":
          return "cs-CZ";
        case "DA":
          return "da-DK";
        case "SA":
          return "ar-SA";
        default:
          return "en-GB";
      }
    case "AS":
    case "OC":
      switch (data.country) {
        case "CN":
          return "zh-CN";
        case "JP":
          return "ja-JP";
        case "KR":
          return "ko-KR";
        default:
          return "en-AU";
      }
    case "NA":
      switch (data.country) {
        case "US":
          return "en-US";
        case "CA":
          return "fr-CA";
        case "MX":
          return "es-MX";
        default:
          return "en-US";
      }
    case "SA":
      switch (data.country) {
        case "CO":
          return "es-CO";
        default:
          return "pt-BR";
      }
  }
  return "en-GB";
}
