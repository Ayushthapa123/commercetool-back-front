import {
  BOMItem,
  CrossReference,
  DAMLinkDocument,
  DAMLinkDocumentInfo,
  DAMLinkImage,
  DAMLinkImageInfo,
  DynamicAttribute,
  emptyProductData,
  Manual,
  ProductData,
  Region,
  Taxonomy,
  TaxonomyAttribute,
} from "@/lib/pim/productData";
import {
  emptyPIMContent,
  Item,
  LocalizedValue,
  MeasurementSystem,
  PIMContent,
} from "@/lib/pim/schema";
import { Parser } from "@/lib/types";

export function isPIMContent(content: any): content is PIMContent {
  return (content as PIMContent).Root !== undefined;
}

export class PIMParser implements Parser<string, ProductData> {
  constructor() {}

  /**
   * Parses PIM content into a cleaned {@link ProductData} object.
   * @param content the stringified PIM content
   * @returns the object containing PIM data
   */
  parse(content: string): ProductData {
    const data = JSON.parse(content);
    const pimContent = isPIMContent(data) ? data : emptyPIMContent();

    const items: Item[] = this.getItems(pimContent);
    if (items.length === 0) {
      return emptyProductData();
    }

    // Should be single item stored in PIM content
    const item: Item = items[0];

    // Expecting individual taxonomy to be present
    const taxonomy: Taxonomy = item.Taxonomy_Property_to_Item.map(
      (property) => {
        const attributes: TaxonomyAttribute[] =
          property.Taxonomy_Property_to_Taxonomy_Attr_Prop.map((attr) => {
            const systemOfMeasurement: MeasurementSystem =
              attr.Attribute_Property_to_Taxonomy_Attr_Prop.filter(
                (prop) => prop["System of Measurement"].trim() !== "",
              ).map((prop) => prop["System of Measurement"])[0] ?? "Global";

            return {
              name: attr["Attribute Name"],
              group: attr["Attribute Group"],
              keySpec: attr["Key Spec"],
              measurementSystem: systemOfMeasurement,
            };
          });

        return {
          node: property["Taxonomy Node"],
          attributes: attributes,
        };
      },
    )[0];

    const targets: Region[] =
      item.Publishing?.map((region) => ({
        webTarget: region["Web Target"],
        effectiveDate: region["Web Target Effective Date"],
        addToCart: this.parsePIMBoolean(region["Add to Cart"]),
        excludedCountries: region["Add to Cart Excluded Countries"],
        badgeName: region["Badge Name"],
        badgeNameExpirationDate: region["Badge Name Expiration Date"],
        discontinued: this.parsePIMBoolean(region.Discontinued),
        status: this.parsePIMBoolean(region.Status),
      })) ?? [];

    const bullets: LocalizedValue[][] = [[]];
    [
      item["Bullet 1"],
      item["Bullet 2"],
      item["Bullet 3"],
      item["Bullet 4"],
      item["Bullet 5"],
      item["Bullet 6"],
      item["Bullet 7"],
      item["Bullet 8"],
      item["Bullet 9"],
      item["Bullet 10"],
    ].forEach((value) => this.append(value, bullets));

    const manuals: Manual[] =
      item.Tech_Docs_Link_NEW_Production?.map((link) => {
        const documents: DAMLinkDocument[] =
          link.Tech_Docs_to_DAM_Production.map((doc) => {
            const documentInfo: DAMLinkDocumentInfo[] =
              doc.DAMMaster_to_DAMLink?.map((info) => ({
                damHierarchy: info.DamHierarchy,
              })) ?? [];

            return {
              status: this.parsePIMBoolean(doc.DAMStatus),
              fileName: doc.FileName,
              context: doc["Image Context"],
              documentInfo: documentInfo,
            };
          });

        return {
          manualNumber: link["Document Master Manual"],
          partNumber: link["Document Part Number"],
          title: link["Document Title"],
          locale: link.LocaleCode,
          documents: documents,
        };
      }) ?? [];

    const images: DAMLinkImage[] =
      item.Item_to_DAM_Link_Production?.map((link) => {
        const imageInfo: DAMLinkImageInfo[] =
          link.DAMMaster_to_DAMLinkImage?.map((info) => ({
            caption: info.Caption,
            seoFriendlyDescription: info.SearchEngineFriendlyDescription,
            damHierarchy: info.DamHierarchy,
          })) ?? [];

        return {
          status: this.parsePIMBoolean(link.DAMStatus),
          fileName: link.FileName,
          context: link["Image Context"],
          representative: this.parsePIMBoolean(link["Representative Image"]),
          imageInfo: imageInfo,
        };
      }) ?? [];

    const videos: LocalizedValue[] = [];
    [item["Video 1 URL"], item["Video 2 URL"]]
      .flat()
      .forEach((value) => this.append(value, videos));

    const attributes: DynamicAttribute[] = item.dynamicAttr.map((attr) => ({
      name: attr.attrName,
      value: attr.attrValue,
    }));

    const references: CrossReference[] =
      item.Item_to_Cross_Reference_Item_Link__From_Part___Production?.map(
        (reference) => {
          const displayOrder = reference["Display Order"];
          const order = displayOrder.trim() === "" ? 0 : parseInt(displayOrder);
          return {
            partNumber: reference["To Part Number"],
            type: reference["Relationship Type"],
            displayOrder: order,
            ecommerceEnabled: this.parsePIMBoolean(
              reference["Ecommerce Enabled"],
            ),
            status: this.parsePIMBoolean(reference.Status),
          };
        },
      ) ?? [];

    const bom: BOMItem[] =
      item.Item_to_Item_BOM__Assembly_Item_?.map((assembly) => {
        const displayOrder = assembly["Display Order"];
        const order = displayOrder.trim() === "" ? 0 : parseInt(displayOrder);
        return {
          partNumber: assembly["Component Item"],
          quantity: parseInt(assembly["Component Quantity"]),
          displayOrder: order,
          relationshipType: assembly["Relationship Type"],
          status: this.parsePIMBoolean(assembly.Status),
        };
      }) ?? [];

    return {
      partNumber: item["Part Number"],
      itemId: item["Item ID"],
      taxonomy: taxonomy,
      upcCode: item["UPC Code"],
      webEnabled: this.parsePIMBoolean(item["Web Enabled"]),
      regions: targets,
      whereToBuyCode: item["Where To Buy Code"],
      description: item["Item Description"],
      longDescription: item["Long Description"] ?? [],
      applicationText: item["Application Text"] ?? [],
      marketingText: item["Marketing Text"] ?? [],
      bullets: bullets,
      model: item.Model,
      series: item.Series,
      educationLink: item["Education Center Link"],
      status: this.parsePIMBoolean(item.Status),
      manuals: manuals,
      images: images,
      videos: videos,
      videoGalleryId: item["Video Gallery ID"],
      attributes: attributes,
      crossReferences: references,
      bom: bom,
    };
  }

  private getItems(content: PIMContent): Item[] {
    if (content.Root.Item_Production.length > 0) {
      return content.Root.Item_Production;
    }

    if (content.Root.Item_Staging.length > 0) {
      return content.Root.Item_Staging;
    }

    return [];
  }

  /**
   * Parses a string value from the PIM into a boolean value.
   * @param value the string value to parse
   * @returns a boolean
   */
  private parsePIMBoolean(value: string): boolean {
    if (!value) {
      return false;
    }

    switch (value) {
      case "Active":
      case "Yes":
      case "yes":
      case "YES":
      case "Y":
      case "1":
      case "true":
        return true;
      case "Inactive":
      case "No":
      case "no":
      case "NO":
      case "N":
      case "0":
      case "false":
        return false;
      default:
        return false;
    }
  }

  private append<T>(value: T, arr: T[]) {
    if (value) arr.push(value);
  }
}
