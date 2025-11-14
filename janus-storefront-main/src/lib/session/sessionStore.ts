import anonymousLoginAction from "@/actions/anonymousLoginAction";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import {
  CART_ID_COOKIE,
  CART_VERSION_COOKIE,
  COOKIE_SECURE,
  CURRENCY,
} from "@/cookies";
import {
  CURRENCIES,
  CurrencyType,
  getDefaultCurrency,
} from "@/lib/i18n/currency";
import { MAX_AGE } from "@/lib/session/constants";
import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

export async function getOrCreateSessionId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const sessionId = session?.user.id;
  if (!sessionId) {
    return anonymousLoginAction();
  }

  return sessionId;
}

export async function getOrCreateSessionCurrency(): Promise<CurrencyType> {
  const sessionCurrency = await getSessionCurrency();
  if (sessionCurrency) return sessionCurrency;
  const locale = await getLocale();
  const defaultCurrency = await getDefaultCurrency(locale);
  await setSessionCurrency(defaultCurrency.isoCode);
  return defaultCurrency;
}

export async function getSessionCurrency(): Promise<CurrencyType> {
  const cookieStore = await cookies();
  const locale = await getLocale();
  const defaultCurrency = await getDefaultCurrency(locale);
  const currencyIso =
    cookieStore.get(CURRENCY)?.value ?? defaultCurrency.isoCode;
  return CURRENCIES[currencyIso] ?? defaultCurrency;
}

export async function setSessionCurrency(
  currencyIso: string,
): Promise<CurrencyType> {
  const cookieStore = await cookies();
  cookieStore.set(CURRENCY, currencyIso, {
    maxAge: MAX_AGE,
    httpOnly: false, // Can be accessed by client-side code
    secure: COOKIE_SECURE,
    sameSite: "lax", // Prevents CSRF in most cases
    path: "/",
  });
  return CURRENCIES[currencyIso];
}

export async function getSessionCartId(): Promise<string | undefined> {
  const currency = await getSessionCurrency();
  const cookieStore = await cookies();
  return cookieStore.get(`${CART_ID_COOKIE}-${currency.isoCode}`)?.value;
}

export async function setSessionCartId(cartId: string) {
  const currency = await getSessionCurrency();
  const cookieStore = await cookies();
  const localePath = await convertLocaleToPath();
  cookieStore.set(`${CART_ID_COOKIE}-${currency.isoCode}`, cartId, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: localePath,
  });
}

export async function removeSessionCartId() {
  const currency = await getSessionCurrency();
  await removeLocaleSpecificCookie(`${CART_ID_COOKIE}-${currency.isoCode}`);
}

export async function getSessionCartVersion(): Promise<number> {
  const currency = await getSessionCurrency();
  const cookieStore = await cookies();
  return Number(
    cookieStore.get(`${CART_VERSION_COOKIE}-${currency.isoCode}`)?.value,
  );
}

export async function setSessionCartVersion(cartVersion: string) {
  const currency = await getSessionCurrency();
  const cookieStore = await cookies();
  const localePath = await convertLocaleToPath();
  cookieStore.set(`${CART_VERSION_COOKIE}-${currency.isoCode}`, cartVersion, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: localePath,
  });
}

export async function removeSessionCartVersion() {
  const currency = await getSessionCurrency();
  await removeLocaleSpecificCookie(
    `${CART_VERSION_COOKIE}-${currency.isoCode}`,
  );
}

async function convertLocaleToPath() {
  const locale = await getLocale();
  if (!locale) {
    return "/";
  }
  const [language, region] = locale.split("-");
  if (!language || !region) {
    return "/";
  }
  return `/${region.toLowerCase()}/${language.toLowerCase()}`;
}

async function removeLocaleSpecificCookie(cookieName: string) {
  const cookieStore = await cookies();
  const currentValue = cookieStore.get(cookieName)?.value ?? "";
  const localePath = await convertLocaleToPath();

  cookieStore.set(cookieName, currentValue, {
    maxAge: 0,
    path: localePath,
  });
}
