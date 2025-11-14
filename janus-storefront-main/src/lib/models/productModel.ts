import { DiscountModel } from "@/lib/models/discountModel";
import { PriceModel } from "@/lib/models/priceModel";

export type ProductModel = {
  id: string;
  name: string;
  sku: string;
  active: boolean;
  key: string;
  videos: Video[];
  images: ImageData[];
  price: PriceModel;
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

type BOMEntry = {
  partNumber: string;
  quantity: number;
};

export type PTOItem = ProductModel & {
  quantity: number;
};

export enum MeasurementSystem {
  Imperial = "Imperial",
  Metric = "Metric",
  Global = "Global",
}

export type AttributeModel = {
  name: string;
  value: string;
  measurement:
    | MeasurementSystem.Imperial
    | MeasurementSystem.Metric
    | MeasurementSystem.Global;
  key?: string;
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
