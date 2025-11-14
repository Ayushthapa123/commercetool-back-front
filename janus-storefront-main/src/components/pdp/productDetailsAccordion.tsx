"use client";

import BazaarVoiceWidgets from "@/components/bazaarVoiceWidgets";
import { TwoColumnRepairParts } from "@/components/pdp/twoColumnRepairParts";
import { PDPAccordionSkeleton } from "@/components/skeletons/pdpAccordionSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { localeLanguageLookup } from "@/constants";
import { downloadLinkClickEvent } from "@/lib/analytics";
import {
  MeasurementSystem,
  ProductModel,
  PTOItem,
} from "@/lib/models/productModel";
import {
  getLocaleDocuments,
  isMatchingLocale,
  isMatchingLocaleLanguageOnly,
} from "@/lib/pdp/getLocaleDocuments";
import { BazaarVoiceWidgetType } from "@/lib/pdp/pdpTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Suspense, use, useEffect, useState } from "react";

type Props = {
  product: ProductModel;
  segmentUrl: string;
  locale: string;
  ptoItems: Promise<PTOItem[]>;
  repairParts: Promise<ProductModel[]>;
  bazaarVoiceLocale: string[];
};

export function ProductDetailsAccordion({
  product,
  segmentUrl,
  locale,
  ptoItems,
  repairParts,
  bazaarVoiceLocale,
}: Readonly<Props>) {
  const [open, setOpen] = useState<string[]>([]);
  const t = useTranslations("ProductPage");
  const bom = use(ptoItems);
  const parts = use(repairParts);

  // Runs only on initial page render to check if a hash is included in the url.
  useEffect(() => {
    const hashValue = window?.location?.hash.replace("#", "") ?? "";
    if (hashValue) {
      setOpen([hashValue]);
      document.getElementById(hashValue)?.scrollIntoView();
    }
  }, []);

  // Captures hash changes via user navigation to open the correct accordion.
  useEffect(() => {
    const handleHashChange = () => {
      const value = window?.location?.hash.replace("#", "") ?? "";
      if (!open.includes(value)) {
        setOpen([...open, value]);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [open]);

  /** Predicate function to filter documents matching by selected locale */
  const documentsInLocale = getLocaleDocuments(product.documents, locale);

  const attributes =
    product.attributes?.filter(
      (attribute) =>
        attribute.measurement === MeasurementSystem.Global ||
        attribute.measurement === MeasurementSystem.Metric,
    ) ?? [];

  return (
    <Suspense fallback={<PDPAccordionSkeleton />}>
      <Accordion type="multiple" value={open} onValueChange={setOpen}>
        {documentsInLocale.length > 0 && (
          <AccordionSection
            id="manuals_documents"
            text={t("manualsAndDocuments")}
          >
            <div className="mx-4 flex flex-col gap-4 pb-6">
              <div className="font-roboto-condensed text-2xl">
                {t("manuals")}
              </div>
              <ul>
                {documentsInLocale.map((doc) => {
                  let document = doc.Documents.filter((document) =>
                    isMatchingLocale(document, locale),
                  )[0];
                  if (!document) {
                    document = doc.Documents.filter((document) =>
                      isMatchingLocaleLanguageOnly(document, locale),
                    )[0];
                  }
                  const localizedDocuments = doc.Documents.filter(
                    (document) =>
                      !isMatchingLocale(document, locale) &&
                      !isMatchingLocaleLanguageOnly(document, locale),
                  );

                  const extension = document.filePath.split(".").pop() || "";
                  const url = `/content/${document.filePath}`;
                  const handleClick = () =>
                    downloadLinkClickEvent(url, document.title, extension);

                  return (
                    <li
                      key={doc.manualNum}
                      className="odd:bg-neutral-black-3 flex flex-row gap-4 rounded-xs px-4 py-2"
                    >
                      <Image
                        src="/document.svg"
                        alt="Plus Icon"
                        width={24}
                        height={24}
                      />
                      <div className="flex flex-col gap-1">
                        <a
                          id={`document_${doc.manualNum}`}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-blue"
                          onClick={handleClick}
                        >
                          {document.title}
                        </a>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-neutral-black flex w-fit flex-row gap-1 text-sm hover:underline">
                            {localeLanguageLookup[locale]}
                            <Image
                              src="/triangle-down.svg"
                              alt="In Stock Icon"
                              width={16}
                              height={16}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="bg-neutral-black-70 rounded-sm text-white"
                          >
                            <ul className="mt-0.5 py-1">
                              {localizedDocuments.map((document) => (
                                <li
                                  key={document.language}
                                  className="hover:text-neutral-black font-roboto px-6 py-1 text-base hover:bg-white"
                                >
                                  <a href={document.filePath} target="_blank">
                                    {localeLanguageLookup[document.language]}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </AccordionSection>
        )}
        {attributes.length > 0 && (
          <AccordionSection id="specifications" text={t("specifications")}>
            <div className="pb-6">
              <div className="border-neutral-black-10 mx-4 overflow-hidden rounded-lg border">
                <table
                  id="specificationTable"
                  className="text-neutral-black-70 w-full text-sm"
                >
                  <tbody>
                    {attributes.map((attribute, index) => (
                      <tr
                        key={index}
                        className="border-b-neutral-black-10 block border-b-1 sm:table-row"
                      >
                        <td className="columnAttributeName bg-neutral-black-3 block w-full px-4 py-2 text-left font-bold sm:table-cell sm:w-1/2">
                          {attribute.name}
                        </td>
                        <td className="columnAttributeValue border-l-neutral-black-10 block w-full border-l-0 px-4 py-2 text-left sm:table-cell sm:w-1/2 sm:border-l-1">
                          {attribute.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AccordionSection>
        )}
        {(product.marketingText ||
          product.applicationText ||
          (product.bullets && product.bullets.length > 0)) && (
          <AccordionSection id="product_details" text={t("productDetails")}>
            <div className="text-neutral-black-70 mx-4 flex flex-col gap-6 pb-6 text-lg">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.marketingText ?? "",
                }}
              />
              <div
                dangerouslySetInnerHTML={{
                  __html: product.applicationText ?? "",
                }}
              />
              {product.bullets?.length > 0 && (
                <ul className="list-outside list-disc columns-2 gap-10 pl-5">
                  {product.bullets.map((bullet, index) => (
                    <li
                      key={index}
                      className="font-roboto text-base"
                      dangerouslySetInnerHTML={{
                        __html: bullet ?? "",
                      }}
                    ></li>
                  ))}
                </ul>
              )}
            </div>
          </AccordionSection>
        )}
        {product.bom.length > 0 && (
          <AccordionSection id="whats_included" text={t("whatsIncluded")}>
            <div className="border-neutral-black-10 mx-4 overflow-hidden rounded-lg border pb-6">
              <table className="text-neutral-black-70 w-full text-sm">
                <thead className="bg-neutral-black-3 border-b-neutral-black-10 border-b-1 font-bold">
                  <tr>
                    <td className="px-4 py-2">{t("partNo")}</td>
                    <td className="border-l-neutral-black-10 border-l-1 px-4 py-2">
                      {t("description")}
                    </td>
                    <td className="border-l-neutral-black-10 border-l-1 px-4 py-2">
                      {t("qty")}
                    </td>
                    <td className="border-l-neutral-black-10 border-l-1 px-4 py-2">
                      {t("unit")}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {bom.map((product, index) => (
                    <tr
                      key={index}
                      className={
                        index !== (product.bom.length || 0) - 1
                          ? "border-b-neutral-black-10 border-b-1"
                          : ""
                      }
                    >
                      <td className="font-roboto-condensed px-4 py-2 text-left">
                        <Link
                          className="text-primary-blue"
                          href={`/${product.linkAddress}.html`}
                        >
                          {product.sku}
                        </Link>
                      </td>
                      <td className="border-l-neutral-black-10 border-l-1 px-4 py-2 text-left">
                        Name
                      </td>
                      <td className="border-l-neutral-black-10 border-l-1 px-4 py-2 text-left">
                        {product.quantity}
                      </td>
                      <td className="border-l-neutral-black-10 border-l-1 px-4 py-2 text-left">
                        {t("ea")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionSection>
        )}
        {product.repairParts.length > 0 && (
          <AccordionSection id="repair_parts" text={t("repairParts")}>
            <div className="pb-6">
              <TwoColumnRepairParts
                parts={parts}
                segmentUrl={segmentUrl}
                t={t}
              />
            </div>
          </AccordionSection>
        )}
        {product?.sku && bazaarVoiceLocale.includes(locale) && (
          <>
            <AccordionSection id="reviews" text={t("reviews")}>
              <div className="pb-6">
                <BazaarVoiceWidgets
                  widget_type={BazaarVoiceWidgetType.Reviews}
                  productId={product.sku}
                />
              </div>
            </AccordionSection>
            <AccordionSection id="questions" text={t("questions")}>
              <div className="pb-6">
                <BazaarVoiceWidgets
                  widget_type={BazaarVoiceWidgetType.Questions}
                  productId={product.sku}
                />
              </div>
            </AccordionSection>
          </>
        )}
      </Accordion>
    </Suspense>
  );
}

type AccordionSectionIdTextProps = {
  id: string;
  text: string;
  children?: React.ReactNode;
};

function AccordionSection(props: Readonly<AccordionSectionIdTextProps>) {
  return (
    <AccordionItem
      id={props.id}
      value={props.id}
      className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
    >
      <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 font-roboto-condensed flex w-full px-4 py-6 text-2xl font-bold">
        {props.text}
      </AccordionTrigger>
      <AccordionContent>
        {props.children ?? "* Add documents here"}
      </AccordionContent>
    </AccordionItem>
  );
}
