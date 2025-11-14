import { Checkout } from "@/components/checkout/checkout";
import { EditCartLink } from "@/components/checkout/editCartLink";
import baseUrl from "@/lib/i18n/navigation";
import { getSessionCartId } from "@/lib/session/sessionStore";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("Checkout.title")} | ${t("Metadata.title")}`,
  };
}

export default async function CheckoutPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Checkout" });
  const urlBase = await baseUrl();
  const cartId = await getSessionCartId();
  if (!cartId) {
    redirect(`${urlBase}/cart`);
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 pt-1 lg:pt-4">
        <h1 className="font-roboto-condensed grow text-3xl leading-14 font-bold lg:text-5xl">
          {t("checkout")}
        </h1>
        <EditCartLink urlBase={urlBase} label={t("editCart")} />
      </div>
      <div className="px-4">
        <Checkout urlBase={urlBase} />
      </div>
    </>
  );
}
