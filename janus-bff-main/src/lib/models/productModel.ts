import { DiscountModel, emptyDiscount } from "@/lib/models/discountModel";
import { emptyPrice, PriceModel } from "@/lib/models/priceModel";
import { MeasurementSystem } from "@/lib/pim/schema";
import { Optional } from "@/lib/types";

export type ProductPrice = {
  price: Optional<PriceModel>;
  discount: Optional<DiscountModel>;
};

export type PimData = {
  family: string;
  partNumber: string;
  WTB: string;
  educationLink: string;
  applicationText: string;
  marketingText: string;
  bullets: string[];
  videos: Video[];
  images: ImageData[];
  videoGalleryId: string;
  documents: DocumentList[];
  bom: BOMEntry[];
  upSell: string[];
  crossSell: string[];
  repairParts: string[];
  attributes: AttributeModel[];
  active: boolean;
  new: boolean;
};

export function emptyPimData(): PimData {
  return {
    family: "",
    partNumber: "",
    WTB: "",
    educationLink: "",
    applicationText: "",
    marketingText: "",
    bullets: [],
    videos: [],
    images: [],
    videoGalleryId: "",
    documents: [],
    bom: [],
    upSell: [],
    crossSell: [],
    repairParts: [],
    attributes: [],
    active: false,
    new: false,
  };
}

export type Video = {
  language: string;
  videoId: string;
};

export type ImageData = {
  url: string;
  caption: string;
  altText: string;
  representative: boolean;
};

export function emptyImageData(): ImageData {
  return {
    url: "/graco-logo-image.png",
    caption: "",
    altText: "",
    representative: false,
  };
}

export type ProductModel = {
  id: string;
  name: string;
  sku: string;
  active: boolean;
  key: string;
  videos: Video[];
  images: ImageData[];
  price?: PriceModel;
  discount?: DiscountModel;
  linkAddress: string;
  videoGalleryId: string;
  inStock: boolean;
  limit: number;
  family: string;
  attributes: AttributeModel[];
  bullets: string[];
  documents: DocumentList[];
  crossSell: string[];
  upSell: string[];
  repairParts: string[];
  bom: BOMEntry[];
  applicationText: string;
  marketingText: string;
  WTB: string;
  educationLink: string;
  commerceEnabled: boolean;
  new: boolean;
};

export function emptyProduct(): ProductModel {
  const price = emptyPrice();

  return {
    id: "",
    active: true,
    name: "",
    sku: "",
    key: "",
    price: price,
    discount: emptyDiscount(),
    videos: [],
    images: [],
    videoGalleryId: "",
    inStock: false,
    limit: 10,
    family: "",
    attributes: [],
    bullets: [],
    documents: [],
    linkAddress: "",
    crossSell: [],
    upSell: [],
    repairParts: [],
    bom: [],
    applicationText: "",
    marketingText: "",
    WTB: "",
    educationLink: "",
    commerceEnabled: false,
    new: false,
  };
}

export type AttributeModel = {
  name: string;
  value: string;
  measurement: MeasurementSystem;
  key?: string;
};

export type BOMEntry = {
  partNumber: string;
  quantity: number;
};

export type Document = {
  language: string;
  filePath: string;
  title: string;
};

export type DocumentList = {
  manualNum: string;
  Documents: Document[];
};
