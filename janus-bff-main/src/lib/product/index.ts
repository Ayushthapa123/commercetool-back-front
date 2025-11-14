import { DiscountModel } from "@/lib/models/discountModel";
import { ProductModel, ProductPrice } from "@/lib/models/productModel";
import {
  CurrencyFunction,
  mapDiscountModel,
  mapPriceModel,
  PricingFunction,
} from "@/lib/models/utils";
import { mapPIMData } from "@/lib/product/mapPIMData";
import { Optional } from "@/lib/types";
import {
  DiscountedPrice,
  LineItem,
  Price,
  ProductProjection,
} from "@commercetools/platform-sdk";

/**
 * Maps a product from commercetools to a clean {@link ProductModel}.
 * @param product the product object
 * @param currency the currency
 * @param country the country
 * @param locale the locale
 * @returns a product model
 */
export function mapProductModel(
  product: ProductProjection,
  locale: string,
  currency: string,
): ProductModel {
  const sku = product.masterVariant.sku ?? "";
  const productName = product.name[locale];
  const images = product.masterVariant.images ?? [];
  const heroImage =
    images.length > 0
      ? `${images[0].url.split(".").slice(0, -1).join(".")}.jpg`
      : "";

  const mapPricing = mapPriceModel(locale)(currency);
  const priceData = mapProductPrice(product.masterVariant.price, mapPricing);

  // Get raw PIM data from product attributes
  const pimAttribute =
    product.attributes.find((attr) => attr.name === "pim-content")?.value ?? "";
  const pimData = mapPIMData(pimAttribute, locale);

  // Add Hero image if available and remove placeholder
  const heroImagePresent = pimData.images.find(
    (imageData) => heroImage === imageData.url,
  );
  if (heroImage && !heroImagePresent) {
    pimData.images.unshift({
      url: heroImage,
      caption: "",
      altText: "",
      representative: false,
    });
  }

  const key = product.key ?? "";
  const slug = product.slug?.[locale] ?? "";
  const commerceEnabledAttr = product.attributes.find(
    (attr) => attr.name === "product-listing-enabled",
  );
  const enabled = commerceEnabledAttr?.value && priceData.price ? true : false;

  return {
    id: product.id,
    name: productName,
    sku: sku,
    active: pimData.active,
    key: key,
    videos: pimData.videos,
    images: [...new Set(pimData.images)],
    price: priceData.price,
    discount: priceData.discount,
    linkAddress: `/homeowner/product/${slug}`,
    videoGalleryId: pimData.videoGalleryId,
    inStock: true,
    limit: 10,
    family: pimData.family,
    attributes: pimData.attributes,
    bullets: pimData.bullets,
    documents: pimData.documents,
    crossSell: pimData.crossSell,
    upSell: pimData.upSell,
    repairParts: pimData.repairParts,
    bom: pimData.bom,
    applicationText: pimData.applicationText,
    marketingText: pimData.marketingText,
    WTB: pimData.WTB,
    educationLink: pimData.educationLink,
    commerceEnabled: enabled,
    new: pimData.new,
  };
}

/**
 * Maps a price from commercetools into a {@link ProductPrice} object.
 * @param price the commercetools price object
 * @param mapPricing a pricing function to map a price model
 * @returns a product price object containing price and discount information
 */
function mapProductPrice(
  price: Price | undefined,
  mapPricing: PricingFunction,
): ProductPrice {
  if (!price) {
    return {
      price: undefined,
      discount: undefined,
    };
  }

  if (!price.discounted) {
    return {
      price: mapPricing(price.value.centAmount),
      discount: undefined,
    };
  }

  const discountedAmount = price.discounted?.value.centAmount;
  const discount = mapDiscountModel(
    price.value.centAmount,
    discountedAmount ?? 0,
    mapPricing,
  );

  return {
    price: mapPricing(price.value.centAmount),
    discount: discount,
  };
}

/**
 * Maps a {@link LineItem} to a clean {@link ProductModel}.
 *
 * @param item the line item
 * @param locale the locale
 * @param formatCurrency a function to map a price to a {@link PriceModel}
 * @returns a product model
 */
export function mapProductModelFromLineItem(
  item: LineItem,
  locale: string,
  formatCurrency: CurrencyFunction,
): ProductModel {
  const mapPricing = formatCurrency(item.totalPrice.currencyCode);
  const discount = mapProductDiscount(item.price.discounted, formatCurrency);
  const pimContent =
    item.variant.attributes?.find((attr) => attr.name === "pim-content")
      ?.value ?? "";
  const pimData = mapPIMData(pimContent, locale);

  return {
    id: item.productId,
    name: item.name[locale],
    sku: item.variant.sku || "",
    active: pimData.active,
    key: item.productKey!, // should always be defined
    price: mapPricing(item.price.value.centAmount),
    discount: discount,
    videos: pimData.videos,
    images: pimData.images,
    videoGalleryId: pimData.videoGalleryId,
    inStock: true,
    limit: 10,
    family: pimData.family,
    attributes: pimData.attributes,
    bullets: pimData.bullets,
    documents: pimData.documents,
    linkAddress: `/homeowner/product/${item.productSlug?.[locale] ?? ""}`,
    crossSell: [],
    upSell: [],
    repairParts: [],
    bom: [],
    applicationText: pimData.applicationText,
    marketingText: pimData.marketingText,
    WTB: pimData.WTB,
    educationLink: pimData.educationLink,
    commerceEnabled: true,
    new: pimData.new,
  };
}

// TODO investigate better way to map/retrieve discount info - currently requires ref expansion.
function mapProductDiscount(
  discounted: Optional<DiscountedPrice>,
  formatCurrency: CurrencyFunction,
): Optional<DiscountModel> {
  if (discounted) {
    const currency = discounted.value.currencyCode;
    const amount = discounted.value.centAmount;
    const discountedPrice = formatCurrency(currency)(amount);

    const productDiscount = discounted.discount.obj;
    const percentage =
      productDiscount && productDiscount.value.type === "relative"
        ? (productDiscount.value.permyriad / 10000) * 100
        : 0;

    return {
      amount: discountedPrice,
      percentage: percentage,
    };
  }
}
