import {
  AttributeModel,
  BOMEntry,
  emptyPimData,
  ImageData,
  PimData,
  Video,
} from "@/lib/models/productModel";
import { PIMParser } from "@/lib/pim/pimParser";
import {
  DAMLinkImage,
  DynamicAttribute,
  TaxonomyAttribute,
} from "@/lib/pim/productData";
import { CrossReferenceType, LocalizedValue } from "@/lib/pim/schema";
import { sortImagesByContext } from "@/lib/product/sortImagesByContext";
import { transformDocuments } from "@/lib/product/transformDocumentsPIMData";
import { Nullable } from "@/lib/types";

/**
 * Maps PIM data from a string value stored on a Product attribute within
 * commercetools into a clean object.
 * @param content the PIM content as string
 * @param locale the locale
 * @returns an object containing PIM data
 */
export function mapPIMData(content: string, locale: string): PimData {
  if (content === "") {
    return emptyPimData();
  }

  const parser = new PIMParser();
  const productData = parser.parse(content);
  const lang = locale.split("-")[0] || "en";

  /** Function to retrieve localized value matching the current language. */
  const getLocalizedValue = (values: LocalizedValue[]) =>
    values
      .filter((value) => value !== null)
      .find((value) => value.lang === lang)?.content ?? "";

  /** Filter cross references by a given type. */
  const filterCrossReferences = (referenceType: CrossReferenceType) =>
    productData.crossReferences
      .filter((reference) => reference.type === referenceType)
      .filter((reference) => reference.status === true)
      .map((reference) => reference.partNumber);

  const bomItems: BOMEntry[] = productData.bom.map((item) => ({
    partNumber: item.partNumber,
    quantity: item.quantity,
  }));

  const publishedRegion = productData.regions.find(
    (region) => region.webTarget === "EMEA",
  );

  const taxonomyProperties = productData.taxonomy.attributes;
  const attributes: AttributeModel[] = productData.attributes
    .filter((attribute) => attribute.value.trim() !== "")
    .map((attribute) => mapAttributeModel(attribute, taxonomyProperties));

  const familyName = `${productData.model} ${productData.series}`;
  const bullets = productData.bullets
    .map((values) => getLocalizedValue(values))
    .filter((content) => content.trim() !== "");

  const images = sortImagesByContext(productData.images)
    .map((image) => mapImageData(image, getLocalizedValue))
    .filter((image) => image !== null);

  const videos: Video[] = productData.videos.map((value) => ({
    language: value.lang,
    videoId: value.content,
  }));

  const documents = transformDocuments(productData.manuals);

  return {
    family: familyName.trim(),
    partNumber: productData.partNumber.trim() || "",
    WTB: productData.whereToBuyCode[0].trim() || "",
    educationLink: productData.educationLink.trim() || "",
    applicationText: getLocalizedValue(productData.applicationText),
    marketingText: getLocalizedValue(productData.marketingText),
    bullets: bullets,
    images: images,
    videos: videos,
    videoGalleryId: productData.videoGalleryId.trim() || "",
    documents: documents,
    bom: bomItems,
    upSell: filterCrossReferences("Upsell"),
    crossSell: filterCrossReferences("Cross Sell"),
    repairParts: filterCrossReferences("Repair Part"),
    attributes: attributes,
    active: publishedRegion?.status ?? false,
    new: publishedRegion?.badgeName === "New",
  };
}

/**
 * Maps dynamic attributes from the PIM into clean attributes.
 * @param dynamicAttribute the dynamic attribute
 * @returns a clean attribute model
 */
function mapAttributeModel(
  dynamicAttribute: DynamicAttribute,
  taxonomyAttributes: TaxonomyAttribute[],
): AttributeModel {
  const taxonomyAttribute = taxonomyAttributes.find(
    (attribute) => attribute.name === dynamicAttribute.name,
  );

  const keySpec = taxonomyAttribute ? taxonomyAttribute.keySpec : "";
  const measurement = taxonomyAttribute
    ? taxonomyAttribute.measurementSystem
    : "Global";

  return {
    name: dynamicAttribute.name,
    value: dynamicAttribute.value,
    measurement,
    // TODO Figure out better way of parsing this value
    key: keySpec,
  };
}

type LocalizedValueFunction = (values: LocalizedValue[]) => string;

/**
 * Maps image content from the DAM into a clean representation of the image and
 * it's corresponding attributes.
 * @param image the image object
 * @param localizedValue function to retrieve localized values
 * @returns an clean image object or null if marked as inactive
 */
function mapImageData(
  image: DAMLinkImage,
  localizedValue: LocalizedValueFunction,
): Nullable<ImageData> {
  if (!image.status) {
    return null;
  }

  const fileNameParts = image.fileName.split(".");
  fileNameParts.pop();
  const fileNameNoExtension = fileNameParts.join(".");
  const info = image.imageInfo.length > 0 ? image.imageInfo[0] : null;

  return {
    url: `https://www.graco.com/content/${image.imageInfo[0].damHierarchy.replace(/\./g, "/").toLowerCase()}/${fileNameNoExtension}.jpg`,
    caption: localizedValue(info?.caption ?? []),
    altText: localizedValue(info?.seoFriendlyDescription ?? []),
    representative: image.representative,
  };
}
