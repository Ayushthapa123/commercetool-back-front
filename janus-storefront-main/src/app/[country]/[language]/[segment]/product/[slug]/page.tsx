import AdobeAnalyticsPushComponent from "@/components/AdobeAnalyticsPushComponent";
import BazaarVoiceScript from "@/components/bazaarVoiceScript";
import BazaarVoiceWidgets, {
  BazaarVoiceScrollButtonHandler,
} from "@/components/bazaarVoiceWidgets";
import { Breadcrumb } from "@/components/breadcrumb";
import { BrightEdgeLinks } from "@/components/brightEdge/brightEdgeLinks";
import BrightEdgeScript from "@/components/brightEdge/brightEdgeScript";
import { CartSuspense } from "@/components/cartSuspense";
import { CheckIcon } from "@/components/icons/checkIcon";
import { MultiAddToCartButton } from "@/components/multiAddToCartButton";
import { BrightcoveSection } from "@/components/pdp/brightcoveSection";
import { PDPContactUs } from "@/components/pdp/pdpContactUs";
import { PdpPageView } from "@/components/pdp/pdpPageView";
import { ProductDetailsAccordion } from "@/components/pdp/productDetailsAccordion";
import { ProductMediaCarousel } from "@/components/pdp/productMediaCarousel";
import { RecommendedAccessories } from "@/components/pdp/recommendedAccessories";
import { RelatedProducts } from "@/components/pdp/relatedProducts";
import { MediaCarouselSkeleton } from "@/components/skeletons/mediaCarouselSkeleton";
import PDPKeySpecsSkeleton from "@/components/skeletons/pdpKeySpecsSkeleton";
import { ProductDetailsSkeleton } from "@/components/skeletons/productDetailsSkeleton";
import { RecommendedAccessorySkeleton } from "@/components/skeletons/recomendedAccessorySkeleton";
import { RelatedProductsSkeleton } from "@/components/skeletons/relatedProductsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductViewEvent } from "@/lib/analytics";
import { getProduct, getProducts } from "@/lib/bff/product";
import { getShippingMethod } from "@/lib/bff/shippingMethods";
import { fetchCapsuleData } from "@/lib/brightEdgeUtil";
import baseUrl from "@/lib/i18n/navigation";
import {
  AttributeModel,
  MeasurementSystem,
  ProductModel,
  PTOItem,
  Video,
} from "@/lib/models/productModel";
import { STANDARD_SHIPPING } from "@/lib/models/shippingMethodModel";
import { getVideoById } from "@/lib/pdp/brightcove";
import { getLocaleDocuments } from "@/lib/pdp/getLocaleDocuments";
import { BazaarVoiceWidgetType } from "@/lib/pdp/pdpTypes";
import { getSessionCurrency } from "@/lib/session/sessionStore";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Head from "next/head";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productModel = await getProduct(slug);
  if (!productModel) {
    return {
      title: "404",
    };
  }
  return {
    title: productModel.name,
  };
}

type CapsuleData = {
  nodes: Array<{
    feature_group: string;
    content: string;
  }>;
};

export type VideoInfo = {
  video: Video;
  thumbnail: string;
};

function getKeySpecs(attributes: AttributeModel[]): AttributeModel[] {
  const keySpecs = attributes
    .filter(
      (item) =>
        item.key !== undefined &&
        !isNaN(Number(item.key)) &&
        Number(item.key) >= 1 &&
        Number(item.key) <= 4,
    )
    .sort((a, b) => Number(a.key) - Number(b.key))
    .map((keySpec) => ({
      ...keySpec,
      // Replace semicolons that are followed by a non-whitespace -> commas for display purposes
      value: keySpec.value.replace(/;(?=\S)/g, ", "),
    }));

  return keySpecs;
}

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string; segment: string }>;
}) {
  const {
    BAZAARVOICE_SCRIPT_URL = "https://apps.bazaarvoice.com/deployments",
    BAZAARVOICE_CLIENT_NAME = "gracoconv",
    BAZAARVOICE_SITE_ID = "redesign_site",
    BAZAARVOICE_ENVIRONMENT = "production",
    BRIGHTEDGE_ACCOUNT_ID = "f00000000049795",
    BAZAARVOICE_LOCALES = "en-US,en-GB",
    TWITTER_CARD = "summary_large_image",
    TWITTER_SITE = "@GracoInc",
    TWITTER_CREATOR = "@GracoInc",
    FB_APP_ID = "300669523371209",
  } = process.env;
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const locale = await getLocale();
  const currency = await getSessionCurrency();
  const bazaarvoiceLocale = locale.replace("-", "_");
  const bvScriptUrl = `${BAZAARVOICE_SCRIPT_URL}/${BAZAARVOICE_CLIENT_NAME}/${BAZAARVOICE_SITE_ID}/${BAZAARVOICE_ENVIRONMENT}/${bazaarvoiceLocale}/bv.js`;
  const { slug, segment } = await params;
  const path = (await headersList).get("x-pathname") || `/product/${slug}`;
  const capsuleData: CapsuleData = await fetchCapsuleData(
    `${protocol}://${host}${path}`,
    BRIGHTEDGE_ACCOUNT_ID,
  );
  const brightEdgeHeadOpen =
    capsuleData?.nodes?.find((item) => item.feature_group === "_head_open")
      ?.content || "";

  const brightEdgeBody =
    capsuleData?.nodes?.find((item) => item.feature_group === "body_1")
      ?.content || "";

  const brightEdgeJson =
    brightEdgeBody?.trim() !== "" ? JSON.parse(brightEdgeBody) : {};

  const t = await getTranslations({
    locale,
    namespace: "ProductPage",
  });

  const productModel = await getProduct(slug);
  if (!productModel) {
    notFound();
  }
  const bazaarVoiceLocals = BAZAARVOICE_LOCALES.split(",").map((locale) =>
    locale.trim(),
  );

  const urlBase = await baseUrl();
  const segmentUrl = `${urlBase}/${segment}`;
  const brightcoveID = process.env.BRIGHTCOVE_ACCOUNT_ID;
  const standardShipping = await getShippingMethod(
    STANDARD_SHIPPING,
    currency.isoCode,
  );

  const educationCenterLabel = t("educationCenter");
  const quickOperationalVideosLabel = t("quickOperationalVideos");
  const checkOutAllVideosLabel = t("checkOutAllTheVideos", {
    product: "Cordless Connect",
  });

  const retrieveProducts = async (skus: string[]) => getProducts(0, 20, skus);
  const recommendedAccessories = retrieveProducts(productModel.crossSell);
  const relatedProducts = retrieveProducts(productModel.upSell);
  const repairParts = retrieveProducts(productModel.repairParts);
  const bomEntries = productModel.bom.map((entry) => entry.partNumber);
  const mapPTOItem = (product: ProductModel): PTOItem => {
    const match = productModel.bom.find(
      (part) => part.partNumber === product.sku,
    );
    return {
      ...product,
      quantity: match ? match.quantity : 1,
    };
  };
  const bom = retrieveProducts(bomEntries).then((products) =>
    products.map(mapPTOItem),
  );

  const productViewAnalytics: ProductViewEvent = {
    event: "productView",
    event_name: "productView",
    products: [
      {
        SKU: productModel.sku,
        name: productModel.name,
      },
    ],
    commerceEnabled: true,
  };

  const attributes =
    productModel.attributes?.filter(
      (attribute) =>
        attribute.measurement === MeasurementSystem.Global ||
        attribute.measurement === MeasurementSystem.Metric,
    ) ?? [];

  const documentsInLocale = getLocaleDocuments(productModel.documents, locale);
  const keySpecifications = getKeySpecs(attributes);

  const retrieveVideoData = async (videos: Video[]) => {
    const arr: VideoInfo[] = [];

    for (const video of videos) {
      const data = await getVideoById(video.videoId);

      if (data) {
        const info: VideoInfo = {
          video: video,
          thumbnail: data?.thumbnail || "/graco-logo-image.png",
        };
        arr.push(info);
      }
    }

    return arr;
  };

  const videos: VideoInfo[] = await retrieveVideoData(productModel.videos);

  const addToCartFallback = <Skeleton className="h-14 w-2/3 rounded-md" />;

  return (
    <>
      <Head>
        <meta name="twitter:card" content={TWITTER_CARD} />
        <meta name="twitter:site" content={TWITTER_SITE} />
        <meta name="twitter:creator" content={TWITTER_CREATOR} />
        <meta name="twitter:title" content={productModel.name} />
        <meta name="twitter:description" />
        <meta
          name="twitter:url"
          content={`${protocol}://${host}${urlBase}${productModel.linkAddress}.html`}
        />
        <meta property="og:title" content={productModel.name} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${protocol}://${host}${urlBase}${productModel.linkAddress}.html`}
        />
        <meta property="og:locale" content={locale.replace("-", "_")} />
        <meta property="og:image" content={productModel.images[0].url} />
        <meta property="fb:app_id" content={FB_APP_ID} />
      </Head>
      <BrightEdgeScript scriptHtml={brightEdgeHeadOpen} />
      <Breadcrumb
        segment={segment}
        page={productModel.name}
        baseURL={urlBase}
      />
      <BazaarVoiceScript scriptUrl={bvScriptUrl} />
      <AdobeAnalyticsPushComponent event={productViewAnalytics} />
      <PdpPageView product={productModel} />
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:gap-30 lg:p-16">
        <div className="hidden w-full flex-col pb-10 md:flex">
          <Suspense fallback={<MediaCarouselSkeleton />}>
            <ProductMediaCarousel
              brightcoveID={brightcoveID}
              images={productModel.images}
              videos={videos}
            />
          </Suspense>
        </div>
        <div className="flex w-full flex-col gap-6">
          <Suspense fallback={<ProductDetailsSkeleton />}>
            <div
              id="pdpInfoContainerBlock"
              className="flex w-full flex-col gap-4"
            >
              <div className="flex w-full flex-col gap-4 pt-4 md:pt-0">
                {/* New badge goes here */}
                {productModel.new && (
                  <div className="bg-tertiary-dark-green font-roboto-condensed flex h-6.5 w-14.5 items-center justify-center rounded-xs px-2 py-1 text-sm font-bold text-white uppercase">
                    {t("new")}
                  </div>
                )}
                <div className="flex w-full flex-col gap-2">
                  <div className="font-roboto-condensed font-bold">
                    {productModel.family}
                    {/* Product Family goes here */}
                  </div>
                  <div
                    id="productNameBlock"
                    className="font-roboto-condensed text-3xl"
                  >
                    {productModel.name}
                  </div>
                  <div
                    id="partNumberBlock"
                    className="font-roboto text-neutral-black-60 text-sm"
                  >
                    {t("partNumber", {
                      partNumber: productModel.sku ?? "",
                    })}
                  </div>
                  {productModel?.sku && (
                    <div>
                      <BazaarVoiceWidgets
                        widget_type={BazaarVoiceWidgetType.Summary}
                        productId={productModel.sku}
                      />
                      <BazaarVoiceScrollButtonHandler
                        targetClasses={[
                          "bv_button_buttonFull",
                          "bv_histogram_row_container",
                        ]}
                        scrollId="reviews"
                      />
                      <BazaarVoiceScrollButtonHandler
                        targetClasses={["bv_aaq_button"]}
                        scrollId="questions"
                        buttonToClickID="bv-question-btn"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col pb-10 md:hidden">
                <Suspense fallback={<MediaCarouselSkeleton />}>
                  <ProductMediaCarousel
                    brightcoveID={brightcoveID}
                    images={productModel.images}
                    videos={videos}
                  />
                </Suspense>
              </div>
              <hr className="hidden md:block" />
              <div className="flex w-full flex-col gap-2">
                {/* Price Area */}
                {productModel.discount &&
                productModel.discount.amount.value > 0 ? (
                  <div className="font-roboto text-neutral-black-60 text-sm">
                    {t("sale")}
                  </div>
                ) : null}
                {productModel.commerceEnabled && productModel.price ? (
                  <>
                    <div className="flex w-full flex-row items-center gap-2">
                      <div
                        id="productPriceBlock"
                        className="font-roboto-condensed text-3xl font-bold"
                      >
                        {productModel.discount?.amount.formattedValue ||
                          productModel.price.formattedValue}
                      </div>
                      {productModel.discount &&
                      productModel.discount.amount.value > 0 ? (
                        <>
                          <div className="font-roboto text-secondary-cyan text-sm">
                            {t("discounted")}
                          </div>
                          <div className="font-roboto text-neutral-black-60 flex flex-row gap-1 text-sm">
                            {t.rich("saved", {
                              savings: () => (
                                <span className="line-through">
                                  {productModel.price.formattedValue}
                                </span>
                              ),
                            })}
                          </div>

                          <div className="font-roboto text-tertiary-dark-cyan text-sm">
                            {t("save", {
                              percent: productModel.discount.percentage ?? 0,
                            })}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="font-roboto text-neutral-black-60 text-sm">
                      {t("vatMessage")}
                    </div>
                  </>
                ) : null}
              </div>
              {productModel.commerceEnabled === true && (
                <div className="flex w-full flex-row gap-2">
                  {/* CTA Area */}
                  <CartSuspense fallback={addToCartFallback}>
                    <MultiAddToCartButton
                      product={productModel}
                      // csrf={csrf}
                    />
                  </CartSuspense>
                </div>
              )}
              {/* In Stock Message */}
              {productModel.commerceEnabled === true &&
                (productModel.inStock && standardShipping !== null ? (
                  <div className="flex w-full flex-row gap-1">
                    <Image
                      src="/circle-check.svg"
                      alt="In Stock Icon"
                      width={16}
                      height={16}
                    />
                    <div className="font-roboto text-xs">
                      {standardShipping &&
                        t.rich("inStock", {
                          bold: (children) => <b>{children}</b>,
                          currencySymbol: currency.symbol,
                        })}
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-row gap-1">
                    <Image
                      src="/out-stock.svg"
                      alt="Out Stock Icon"
                      width={16}
                      height={16}
                    />
                    <div className="font-roboto text-tertiary-danger-red text-xs">
                      {t("outStock")}
                    </div>
                  </div>
                ))}
              {(productModel.commerceEnabled === false ||
                productModel.inStock === false) && (
                <a
                  href={`${segmentUrl}/how-to-buy/find-a-retailer.html?part-number=${productModel.sku}.html`}
                  className="bg-tertiary-dark-cyan hover:bg-secondary-cyan font-roboto-condensed flex h-10 w-73 items-center justify-center rounded-xs p-3 text-base font-bold text-white"
                >
                  {t("findARetailer")}
                </a>
              )}
            </div>
          </Suspense>
          <div id="productSpecs" className="flex w-full flex-col gap-6">
            {/* Key Specs Area */}
            {keySpecifications.length > 0 && (
              <Suspense fallback={<PDPKeySpecsSkeleton />}>
                <div id="productSpecsSection" className="flex flex-col gap-2">
                  {/* Loop through each key spec */}
                  {keySpecifications.map((spec, index) => (
                    <div
                      key={index}
                      id={index.toString()}
                      className="text-neutral-black flex w-full gap-2"
                    >
                      <CheckIcon
                        role="presentation"
                        className="w-4 fill-current"
                      />
                      <div
                        id={index.toString()}
                        className="font-roboto w-60 flex-1 text-sm font-bold"
                      >
                        {spec.name}:
                      </div>
                      <div
                        id={index.toString()}
                        className="font-roboto flex-1 text-sm"
                      >
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Suspense>
            )}
            <div className="border-neutral-black-10 flex w-full flex-row flex-wrap gap-4 border-t pt-4 md:flex-nowrap">
              {documentsInLocale.length > 0 && (
                <InnerPageNavLink
                  id="manuals_documents"
                  text={t("manualsAndDocuments")}
                />
              )}
              {attributes.length > 0 && (
                <InnerPageNavLink
                  id="specifications"
                  text={t("specifications")}
                />
              )}
              {(productModel.marketingText ||
                productModel.applicationText ||
                (productModel.bullets && productModel.bullets.length > 0)) && (
                <InnerPageNavLink
                  id="product_details"
                  text={t("productDetails")}
                />
              )}
            </div>
            {productModel.crossSell.length > 0 && (
              <div
                id="borderRecommendAccessories"
                className="border-neutral-black-10 flex flex-col gap-6 rounded-sm border-1 px-4 py-6 md:mt-6"
              >
                <p
                  id="labelRecommendAccessories"
                  className="font-roboto text-lg font-bold"
                >
                  {t("recommendedAccessories")}
                </p>
                <Suspense fallback={<RecommendedAccessorySkeleton />}>
                  <RecommendedAccessories
                    urlBase={urlBase}
                    promise={recommendedAccessories}
                  />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </section>

      {((productModel.videoGalleryId && productModel.videoGalleryId !== "") ||
        (productModel.educationLink && productModel.educationLink !== "")) && (
        <BrightcoveSection
          brightcoveID={brightcoveID ?? ""}
          videoGalleryID={productModel.videoGalleryId}
          educationLink={productModel.educationLink}
          educationCenterLabel={educationCenterLabel}
          quickOperationalVideosLabel={quickOperationalVideosLabel}
          checkOutAllVideosLabel={checkOutAllVideosLabel}
        />
      )}

      <section className="flex w-full flex-col py-16">
        <ProductDetailsAccordion
          product={productModel}
          segmentUrl={segmentUrl}
          locale={locale}
          ptoItems={bom}
          repairParts={repairParts}
          bazaarVoiceLocale={bazaarVoiceLocals}
        />
      </section>
      {productModel.upSell.length > 0 && (
        <section className="flex w-full flex-col gap-10 py-16">
          <p className="font-roboto-condensed text-3xl">
            {t("relatedProducts")}
          </p>
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <RelatedProducts urlBase={urlBase} promise={relatedProducts} />
          </Suspense>
        </section>
      )}
      <div>
        <PDPContactUs urlBase={urlBase} />
        <BrightEdgeLinks links={brightEdgeJson.links} />
      </div>
    </>
  );
}

type pdpSectionIdTextProps = {
  id: string;
  text: string;
};

function InnerPageNavLink(props: pdpSectionIdTextProps) {
  return (
    <a
      href={`#${props.id}`}
      className="hover:text-secondary-cyan flex flex-row justify-center gap-2 text-center md:w-full"
    >
      <p className="font-roboto-condensed text-base font-bold">{props.text}</p>
      <Image src="/arrow-down.svg" alt="Plus Icon" width={16} height={16} />
    </a>
  );
}
