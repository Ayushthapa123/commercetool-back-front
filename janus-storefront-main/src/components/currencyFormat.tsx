import { CURRENCY } from "@/cookies";
import { getOrCreateSessionCurrency } from "@/lib/session/sessionStore";
import { getLocale } from "next-intl/server";

type CurrencyFormat = {
  price: number;
};

export default async function CurrencyFormat({
  price,
}: Readonly<CurrencyFormat>) {
  const locale = await getLocale();
  const currency = await getOrCreateSessionCurrency();

  return (
    <>
      {new Intl.NumberFormat(locale, {
        style: CURRENCY,
        currency: currency.isoCode,
      }).format(price)}
    </>
  );
}
