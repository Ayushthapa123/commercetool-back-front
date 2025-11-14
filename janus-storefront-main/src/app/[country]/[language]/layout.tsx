import "@/app/globals.css";
import { AdobeAnalyticsScriptInclude } from "@/components/adobeAnalyticsScriptInclude";
import ScrollDepthTracker from "@/components/AdobeAnalyticsScrollTracker";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { OnetrustScriptInclude } from "@/components/onetrustScriptInclude";
import { CartProvider } from "@/lib/context/cartContext";
import { CurrencyProvider } from "@/lib/context/currencyContext";
import baseUrl from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import {
  getSessionCartId,
  getSessionCurrency,
} from "@/lib/session/sessionStore";
import { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Roboto, Roboto_Condensed } from "next/font/google";
import { notFound } from "next/navigation";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const urlBase = await baseUrl();
  const t = await getTranslations({ locale, namespace: "Navigation" });

  const cartId = await getSessionCartId();
  const currency = await getSessionCurrency();

  return (
    <html className="scroll-smooth" lang={locale}>
      <OnetrustScriptInclude />
      <AdobeAnalyticsScriptInclude />
      <body
        className={`${roboto.variable} ${robotoCondensed.variable} w-full overflow-x-hidden scroll-smooth antialiased`}
      >
        <NextIntlClientProvider>
          <CartProvider cartId={cartId} locale={locale}>
            <CurrencyProvider value={currency} locale={locale}>
              <div className="font-roboto block min-h-screen w-full grid-rows-[auto_1fr_auto] justify-items-start gap-3 lg:grid lg:justify-items-center">
                <Navigation urlBase={urlBase} locale={locale} />
                <ScrollDepthTracker />
                <main className="flex max-w-full grow flex-col gap-[0.5rem] px-5 md:container md:mx-auto lg:px-0">
                  {children}
                </main>
                <Footer t={t} />
              </div>
            </CurrencyProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
