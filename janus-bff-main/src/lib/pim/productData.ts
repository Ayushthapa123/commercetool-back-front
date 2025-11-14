import {
  CrossReferenceType,
  LocalizedValue,
  MeasurementSystem,
  WebTarget,
} from "@/lib/pim/schema";

export type ProductData = {
  partNumber: string;
  itemId: string;
  taxonomy: Taxonomy;
  upcCode: string;
  webEnabled: boolean;
  regions: Region[];
  whereToBuyCode: string[];
  description: string;
  longDescription: LocalizedValue[];
  applicationText: LocalizedValue[];
  marketingText: LocalizedValue[];
  bullets: LocalizedValue[][];
  model: string;
  series: string;
  educationLink: string;
  status: boolean;
  manuals: Manual[];
  images: DAMLinkImage[];
  videos: LocalizedValue[];
  videoGalleryId: string;
  attributes: DynamicAttribute[];
  crossReferences: CrossReference[];
  bom: BOMItem[];
};

export type Taxonomy = {
  node: string;
  attributes: TaxonomyAttribute[];
};

export type TaxonomyAttribute = {
  name: string;
  group: string;
  keySpec: string;
  measurementSystem: MeasurementSystem;
};

export type Region = {
  webTarget: WebTarget;
  effectiveDate: string;
  addToCart: boolean;
  excludedCountries: string[];
  badgeName: string;
  badgeNameExpirationDate: string;
  discontinued: boolean;
  status: boolean;
};

export type Manual = {
  manualNumber: string;
  partNumber: string;
  title: string;
  locale: string;
  documents: DAMLinkDocument[];
};

interface DAMLink {
  status: boolean;
  fileName: string;
  context: string;
}

export interface DAMLinkImage extends DAMLink {
  representative: boolean;
  imageInfo: DAMLinkImageInfo[];
}

export type DAMLinkImageInfo = {
  caption: LocalizedValue[];
  seoFriendlyDescription: LocalizedValue[];
  damHierarchy: string;
};

export interface DAMLinkDocument extends DAMLink {
  documentInfo: DAMLinkDocumentInfo[];
}

export type DAMLinkDocumentInfo = {
  damHierarchy: string;
};

export type DynamicAttribute = {
  name: string;
  value: string;
};

export type CrossReference = {
  partNumber: string;
  type: CrossReferenceType;
  displayOrder: number;
  ecommerceEnabled: boolean;
  status: boolean;
};

export type BOMItem = {
  partNumber: string;
  quantity: number;
  displayOrder: number;
  relationshipType: string;
  status: boolean;
};

export function emptyProductData(): ProductData {
  const taxonomy: Taxonomy = {
    node: "",
    attributes: [],
  };

  return {
    partNumber: "",
    itemId: "",
    taxonomy: taxonomy,
    upcCode: "",
    webEnabled: false,
    regions: [],
    whereToBuyCode: [],
    description: "",
    longDescription: [],
    applicationText: [],
    marketingText: [],
    bullets: [],
    model: "",
    series: "",
    educationLink: "",
    status: false,
    manuals: [],
    images: [],
    videos: [],
    videoGalleryId: "",
    attributes: [],
    crossReferences: [],
    bom: [],
  };
}
