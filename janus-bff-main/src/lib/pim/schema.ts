type Repository =
  | "Item_Staging"
  | "Item_Production"
  | "ItemBOM_Staging"
  | "ItemBOM_Production"
  | "ItemOrg_Staging"
  | "ItemOrg_Production"
  | "DAMLink"
  | "Technical_Documents_Staging"
  | "Technical_Documents_Production"
  | "Publishing_Production"
  | "HierarchyCatalogItem Production"
  | "TaxonomyAttributeProperty_Staging"
  | "TaxonomyAttributeProperty_Production"
  | "Cross Reference Item Link Production";

interface PIMRecord {
  repo: Repository;
}

export type PIMContent = {
  Root: Root;
};

export function emptyPIMContent(): PIMContent {
  const dataModel: DataModel = {
    repo: [],
  };

  const root: Root = {
    dataModel: dataModel,
    Item_Production: [],
    Item_Staging: [],
  };

  return {
    Root: root,
  };
}

type Root = {
  dataModel?: DataModel;
  Item_Production: Item[];
  Item_Staging: Item[];
};

type DataModel = {
  repo: Repo[];
};

type Repo = {
  name: string;
  profile: string;
};

export interface Item extends PIMRecord {
  repo: "Item_Staging" | "Item_Production";
  "Part Number": string;
  "Item ID": string;
  "Taxonomy Assignment": string;
  "EBS Application": string;
  "Pricing Region": string[];
  "UPC Code": string;
  "Web Enabled": string;
  "Website URL": string;
  "Where To Buy Code": string[];
  "Item Description": string;
  "Long Description": LocalizedValue[];
  "Application Text": LocalizedValue[];
  "Marketing Text": LocalizedValue[];
  "Bullet 1": LocalizedValue[];
  "Bullet 2": LocalizedValue[];
  "Bullet 3": LocalizedValue[];
  "Bullet 4": LocalizedValue[];
  "Bullet 5": LocalizedValue[];
  "Bullet 6": LocalizedValue[];
  "Bullet 7": LocalizedValue[];
  "Bullet 8": LocalizedValue[];
  "Bullet 9": LocalizedValue[];
  "Bullet 10": LocalizedValue[];
  Model: string;
  Series: string;
  "Product Series": string;
  "Education Center Link": string;
  "Send to Bazaarvoice": string;
  Status: string;
  "Video 1 URL": LocalizedValue[];
  "Video 2 URL": LocalizedValue[];
  "Video Gallery ID": string;
  dynamicAttr: DynamicAttr[];
  Item_to_Item_BOM__Assembly_Item_: BOMAssemblyItem[];
  Item_org: OperatingUnitData[];
  Item_to_DAM_Link_Production: DAMImage[];
  Tech_Docs_Link_NEW_Production: TechDocLink[];
  Publishing: PublishedRegion[];
  Item_to_HierarchyCatalogItem: HierarchyCatalogItem[];
  Taxonomy_Property_to_Item: TaxonomyProperty[];
  Item_to_Cross_Reference_Item_Link__From_Part___Production: ItemCrossReference[];
}

export type LocalizedValue = {
  lang: string;
  content: string;
};

type DynamicAttr = {
  attrName: string;
  attrValue: string;
};

interface BOMAssemblyItem extends PIMRecord {
  repo: "ItemBOM_Staging" | "ItemBOM_Production";
  "Component Item": string;
  "Component Quantity": string;
  "Display Order": string;
  "Relationship Type": string;
  Status: string;
}

interface OperatingUnitData extends PIMRecord {
  repo: "ItemOrg_Staging" | "ItemOrg_Production";
  "Operating Unit ID": string;
  "Country of Origin": string;
  "Item Weight": string;
  "Unit Height": string;
  "Unit Length": string;
  "Unit Volume": string;
  "Unit Width": string;
  "Dimension UOM Code": string;
  "Primary UOM Code": string;
  "Volume UOM Code": string;
  "Weight UOM Code": string;
}

interface DAMLinkItem extends PIMRecord {
  repo: "DAMLink";
  DAMStatus: string;
  FileName: string;
  "Image Context": string;
}

interface DAMImage extends DAMLinkItem {
  "Representative Image": string;
  DAMMaster_to_DAMLinkImage: DAMImageInfo[];
}

type DAMImageInfo = {
  Caption: LocalizedValue[];
  SearchEngineFriendlyDescription: LocalizedValue[];
  DamHierarchy: string;
};

interface TechDocLink extends PIMRecord {
  repo: "Technical_Documents_Staging" | "Technical_Documents_Production";
  "Document Master Manual": string;
  "Document Part Number": string;
  "Document Title": string;
  LocaleCode: string;
  Tech_Docs_to_DAM_Production: DAMTechDoc[];
}

interface DAMTechDoc extends DAMLinkItem {
  DAMMaster_to_DAMLink: DAMTechDocInfo[];
}

type DAMTechDocInfo = {
  DamHierarchy: string;
};

interface PublishedRegion extends PIMRecord {
  repo: "Publishing_Production";
  "Add to Cart": string;
  "Add to Cart Excluded Countries": string[];
  "Badge Name": string;
  "Badge Name Expiration Date": string;
  Discontinued: string;
  "Web Target": WebTarget;
  "Web Target Effective Date": string;
  Status: string;
}

export type WebTarget =
  | "Asia Pacific"
  | "EMEA"
  | "North America"
  | "South & Central America";

interface HierarchyCatalogItem extends PIMRecord {
  repo: "HierarchyCatalogItem Production";
  NodeValue: string;
  "Hierarchy Name": string;
  SequenceNum: string;
  Status: string;
}

type TaxonomyProperty = {
  "Taxonomy Node": string;
  Taxonomy_Property_to_Taxonomy_Attr_Prop: TaxonomyAttributeProperty[];
};

interface TaxonomyAttributeProperty extends PIMRecord {
  repo:
    | "TaxonomyAttributeProperty_Staging"
    | "TaxonomyAttributeProperty_Production";
  "Attribute Name": string;
  "Attribute Group": string;
  "Key Spec": string;
  Attribute_Property_to_Taxonomy_Attr_Prop: AttributeProperty[];
}

type AttributeProperty = {
  "System of Measurement": MeasurementSystem;
};

export type MeasurementSystem = "Imperial" | "Metric" | "Global";

interface ItemCrossReference extends PIMRecord {
  repo: "Cross Reference Item Link Production";
  "To Part Number": string;
  "Relationship Type": CrossReferenceType;
  "Display Order": string;
  "Ecommerce Enabled": string;
  Status: string;
}

export type CrossReferenceType = "Upsell" | "Cross Sell" | "Repair Part";
