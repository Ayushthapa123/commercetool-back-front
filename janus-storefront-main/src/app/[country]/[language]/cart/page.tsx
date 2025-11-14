import AdobeAnalyticsPushComponent from "@/components/AdobeAnalyticsPushComponent";
import { Cart } from "@/components/cart/cart";
import { CartHeader } from "@/components/cart/cartHeader";
import { RecommendedProducts } from "@/components/cart/recommendedProducts";
import { YourOrder } from "@/components/cart/yourOrder";
import { RelatedProductsSkeleton } from "@/components/skeletons/relatedProductsSkeleton";
import { CartWorkflowEvent } from "@/lib/analytics";
import baseUrl from "@/lib/i18n/navigation";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("Cart.title")} | ${t("Metadata.title")}`,
  };
}

export default async function CartPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Cart" });
  const urlBase = await baseUrl();
  const cookieStore = await cookies();
  const currency = cookieStore.get("currency")?.value ?? "GBP";
  const cartId = cookieStore.get(`cartId-${currency}`)?.value ?? "";

  const viewCartAnalytics: CartWorkflowEvent = {
    event: "viewCart",
    event_name: "viewCart",
    cartID: cartId,
  };

  return (
    <>
      <CartHeader />
      <AdobeAnalyticsPushComponent event={viewCartAnalytics} />
      <div className="flex flex-col gap-25 pt-6 pb-16 md:flex-row">
        <div className="flex min-w-0 grow flex-col gap-16">
          <div>
            <Cart urlBase={urlBase} />
          </div>
          <div className="hidden md:block">
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RecommendedProducts cartId={cartId} urlBase={urlBase} />
            </Suspense>
          </div>
          <div className="md:hidden">
            <YourOrder urlBase={urlBase} />
          </div>
        </div>
        <div>
          <div className="hidden h-full md:block">
            <YourOrder urlBase={urlBase} />
          </div>
          <div className="md:hidden">
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RecommendedProducts cartId={cartId} urlBase={urlBase} />
            </Suspense>
          </div>
        </div>
      </div>
      <div
        id="contactUsBlock"
        className="bg-neutral-black-3 ml-[calc(-50vw+50%)] flex w-screen max-w-screen justify-center px-5 py-6 align-middle"
      >
        <p className="font-roboto text-center text-lg">
          {t.rich("needHelp", {
            contactUs: (chunks) => (
              <a className="text-primary-blue underline" href="#">
                {chunks}
              </a>
            ),
            retailer: (chunks) => (
              <a className="text-primary-blue underline" href="#">
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </>
  );
}
