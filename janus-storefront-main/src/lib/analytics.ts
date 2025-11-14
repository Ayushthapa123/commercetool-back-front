import { CartModel, EntryModel } from "@/lib/models/cartModel";
import { ProductModel } from "@/lib/models/productModel";

declare global {
  interface Window {
    adobeDataLayer: AnalyticsEvent[];
    Visitor: Visitor;
  }
}

interface Visitor {
  getInstance: (id: string) => Visitor;
  getMarketingCloudVisitorID: () => string;
  [key: string]: unknown;
}

export type AnalyticsEvent =
  | CartEntryModificationEvent
  | CartExpandEvent
  | CartWorkflowEvent
  | CurrencySelectionEvent
  | DownloadLinkClickEvent
  | ExitLinkEvent
  | PageViewEvent
  | PlaceOrderClickEvent
  | ProductClickEvent
  | ProductViewEvent
  | RegionLanguageSelectionEvent
  | ViewRecommendedEvent
  | ClickRecommendedEvent
  | PurchaseEvent
  | ScrollDepthEvent;

interface IAnalyticsEvent {
  readonly event: string;
  readonly event_name: string;
}

type CartWorkflowEventType =
  | "addAddress"
  | "checkout"
  | "editCart"
  | "viewCart";

export type EntryModificationType = "addToCart" | "removeFromCart";

export type TrafficType = "internal" | "distributor" | "";

export type ClickLocationType =
  | "header_blackbar"
  | "header_whitebar"
  | "nav_shelf"
  | "nav_mobile"
  | "nav_subnav"
  | "content"
  | "footer_brightedge"
  | "footer_main";

export type ProductClickType =
  | "most viewed products"
  | "product list"
  | "recommended accessories"
  | "recommended products"
  | "related products"
  | "repair parts"
  | "whats included";

export type SectionType =
  | "Most Viewed Products"
  | "Recommended Accessories"
  | "Recommended Products";

export interface CartExpandEvent extends IAnalyticsEvent {
  readonly event: "cart_expand";
  readonly event_name: "cart_expand";
  readonly cartID: string;
  readonly cartItemsCount: number;
}

export interface CartWorkflowEvent extends IAnalyticsEvent {
  readonly event: CartWorkflowEventType;
  readonly event_name: CartWorkflowEventType;
  readonly cartID: string;
}

interface CartEntryModificationEvent extends IAnalyticsEvent {
  readonly event: EntryModificationType;
  readonly event_name: EntryModificationType;
  readonly cartID: string;
  readonly currencyCode: string;
  readonly products: Product[];
}

interface CurrencySelectionEvent extends IAnalyticsEvent {
  readonly event: "currencySelection";
  readonly event_name: "currencySelection";
  readonly currencyBeforeSelection: string;
  readonly currencyAfterSelection: string;
}

interface DownloadLinkClickEvent extends IAnalyticsEvent {
  readonly event: "downloadLinkClick";
  readonly event_name: "downloadLinkClick";
  readonly downloadLinkURL: string;
  readonly documentName: string;
  readonly downloadLinkExtension: string;
}

interface ExitLinkEvent extends IAnalyticsEvent {
  readonly event: "exitLinkClick";
  readonly event_name: "exitLinkClick";
  readonly exitLinkURL: string;
  readonly exitLinkText: string;
  readonly linkClasses: string;
  readonly linkID: string;
  readonly closestDivClass: string;
  readonly closestDivID: string;
}

export interface ClickRecommendedEvent extends IAnalyticsEvent {
  readonly event: "clickRecommended";
  readonly event_name: "clickRecommended";
  readonly sectionType: string;
  readonly positionInList: string;
  readonly cartID: string | null;
  readonly product: Product;
}
export interface PageViewEvent extends IAnalyticsEvent {
  readonly event: "pageView";
  readonly event_name: "pageView";
  readonly businessUnit: string;
  readonly campaignCode: string;
  readonly canonicalURL: string;
  readonly customerSegment: string;
  readonly ecid: string;
  readonly firstPublishDate: string;
  readonly modelGroupName: string;
  readonly modelGroupID: string;
  readonly modifiedDate: string;
  readonly newProduct: string;
  readonly webEnabled: string;
  readonly pageName: string;
  readonly pageReferrer: string;
  readonly pageSiteSection: string;
  readonly seoOptimized: string;
  readonly templateType: string;
  readonly wtbCode: string;
  readonly productSKU: string;
  readonly salesforceCID: string;
  readonly traffic_type: TrafficType;
  readonly cartID: string;
  readonly clickLocation: string;
  readonly graco_start: string;
  readonly pageTitle: string;
}

interface PlaceOrderClickEvent extends IAnalyticsEvent {
  readonly event: "place_order_click";
  readonly event_name: "place_order_click";
  readonly cartID: string;
  readonly totalAmount: string;
  readonly cartItemsCount: number;
}

interface ViewRecommendedEvent extends IAnalyticsEvent {
  readonly event: "viewRecommended";
  readonly event_name: "viewRecommended";
  readonly section: SectionType;
  readonly cartID: string | null;
  readonly products: Product[];
}

interface Product {
  readonly SKU: string;
  readonly name: string;
  readonly category?: string;
  readonly quantity?: number;
  readonly unitPrice?: string;
  readonly currencyCode?: string;
  readonly priceTotal?: string;
}

export interface ProductClickEvent extends IAnalyticsEvent {
  readonly event: "productClick";
  readonly event_name: "productClick";
  readonly products: Product[];
  readonly productClickFiltersApplied: string;
  readonly productClickRankNumber: string;
  readonly productClickType: ProductClickType;
}

export interface PurchaseEvent extends IAnalyticsEvent {
  readonly event: "purchase";
  readonly event_name: "purchase";
  readonly currencyCode: string;
  readonly discountAmount: string;
  readonly discountCode: string;
  readonly paymentType: string;
  readonly priceTotal: string;
  readonly paymentID: string;
  readonly shippingAmount: string;
  readonly transactionID: string;
  readonly taxAmount: string;
  readonly products: Product[];
}

export interface ProductViewEvent extends IAnalyticsEvent {
  readonly event: "productView";
  readonly event_name: "productView";
  readonly products: Product[];
  readonly commerceEnabled: boolean;
}

export interface RegionLanguageSelectionEvent extends IAnalyticsEvent {
  readonly event: "regionLanguageSelection";
  readonly event_name: "regionLanguageSelection";
  readonly regionSelected: string;
  readonly languageSelected: string;
}

interface ScrollDepthEvent extends IAnalyticsEvent {
  readonly event: "scrollDepthEvent";
  readonly event_name: "scrollDepthEvent";
  readonly scrollDepthPercentage: string;
}

/**
 * Push cart entry modification event (addToCart/removeFromCart) onto adobe
 * analytics data layer.
 *
 * @example
 * const { cart, setCart } = useCartContext();
 * const handleClick = () => {
 *   updateLineItemQuantity(entry.id, quantity).then(setCart);
 *   const diff = Math.abs(quantity - entry.quantity);
 *   cartEntryModificationEvent(cart, "addToCart", [entry], diff);
 * };
 *
 * @param cart the cart object
 * @param type the modification type
 * @param entries the entries added/removed
 * @param quantity the quantity change (optional)
 */
export function cartEntryModificationEvent(
  cart: CartModel,
  type: EntryModificationType,
  entries: EntryModel[],
  quantity?: number,
) {
  const mapPriceValue = (price: number) => (price / 100).toFixed(2);
  const products: Product[] = entries.map((entry) => ({
    SKU: entry.product.sku,
    name: entry.product.name,
    category: "", // TODO Include category information
    quantity: quantity ? quantity : entry.quantity,
    unitPrice: mapPriceValue(entry.basePrice.value),
    priceTotal: mapPriceValue(entry.netPrice.value),
  }));
  const event: CartEntryModificationEvent = {
    event: type,
    event_name: type,
    cartID: cart.id,
    currencyCode: cart.netPrice.currencyIso,
    products: products,
  };
  window.adobeDataLayer.push(event);
}

/**
 * Push cart expand event onto adobe analytics data layer.
 * @param cart the cart object
 */
export function cartExpandEvent(cart: CartModel) {
  const event: CartExpandEvent = {
    event: "cart_expand",
    event_name: "cart_expand",
    cartID: cart.id,
    cartItemsCount: cart.entries.length,
  };
  window.adobeDataLayer.push(event);
}

/**
 * Push a cart workflow event onto adobe analytics data layer.
 * @param type the type of workflow event
 * @param cartId the cart id
 */
export function cartWorkflowEvent(type: CartWorkflowEventType, cartId: string) {
  const event: CartWorkflowEvent = {
    event: type,
    event_name: type,
    cartID: cartId,
  };
  window.adobeDataLayer.push(event);
}

/**
 * Handles updating the cookie value for the `graco_clicklocation`.
 * @param this the html anchor element clicked
 */
export async function clickLocationEventListener(this: HTMLAnchorElement) {
  // Map of CSS selector to corresponding click location type
  const selectorClickLocationMap = new Map<string, ClickLocationType>([
    ["section#utility-bar", "header_blackbar"],
    ["section#header-primary", "header_whitebar"],
    ["section#cmp-navigation", "nav_shelf"],
    ["section#cmp-navigation-mobile", "nav_mobile"],
    ["div#breadcrumb", "nav_subnav"],
    ["main.container", "content"],
    ["tbd", "footer_brightedge"], // TODO Update selector once brightedge has been implemented
    ["footer", "footer_main"],
  ]);

  const key =
    selectorClickLocationMap
      .keys()
      .find((selector) => this.closest(selector) !== null) ?? "";

  const clickLocation = selectorClickLocationMap.get(key);
  if (clickLocation) {
    const value = `${clickLocation} : ${this.text}`;
    await cookieStore.set("graco_clicklocation", value);
  }
}

/**
 * Configures event listeners on click for tracking general click locations.
 */
export function configureClickLocationListeners() {
  const selector = 'a:not([target="_blank"])';
  const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);
  anchors.forEach((link) =>
    link.addEventListener("click", clickLocationEventListener),
  );
}

/**
 * Push currency selection change event onto adobe analytics data layer.
 * @param before previous selected currency value
 * @param after new selected currency value
 */
export function currencySelectionEvent(before: string, after: string) {
  const event: CurrencySelectionEvent = {
    event: "currencySelection",
    event_name: "currencySelection",
    currencyBeforeSelection: before,
    currencyAfterSelection: after,
  };
  window.adobeDataLayer.push(event);
}

/**
 * Push download link click event onto adobe analytics data layer.
 * @param url the download link url
 * @param documentName the name of the document
 * @param extension the file extension
 */
export function downloadLinkClickEvent(
  url: string,
  documentName: string,
  extension: string,
) {
  const event: DownloadLinkClickEvent = {
    event: "downloadLinkClick",
    event_name: "downloadLinkClick",
    downloadLinkURL: url,
    documentName: documentName,
    downloadLinkExtension: extension,
  };
  window.adobeDataLayer.push(event);
}

/**
 * Push exit link event onto adobe analytics data layer.
 * @param element selected anchor element
 */
export function exitLinkEvent(element: HTMLAnchorElement) {
  const closestDiv = element.closest("div");
  const event: ExitLinkEvent = {
    event: "exitLinkClick",
    event_name: "exitLinkClick",
    exitLinkURL: element.href,
    exitLinkText: element.text.trim(),
    linkClasses: element.className,
    linkID: element.id,
    closestDivClass: closestDiv?.className ?? "",
    closestDivID: closestDiv?.id ?? "",
  };
  window.adobeDataLayer.push(event);
}

type PageViewCookie = "traffic_type" | "graco_start";

/**
 * Retrieve cookie value for provided identifier.
 * @returns the value of the cookie or undefined if not found
 */
function getCookieValue(type: PageViewCookie): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${type}=`))
    ?.split("=")[1];
}

/**
 * Retrieve the adobe experience cloud id.
 * @returns the adobe experience cloud id
 */
function getEcidValue(): string {
  return (
    window.Visitor?.getInstance(
      "546E780B55CA69517F000101@AdobeOrg",
    )?.getMarketingCloudVisitorID() ?? ""
  );
}

/**
 * Push page view event onto adobe analytics data layer.
 * @param cartId the cart id
 * @param pathname the current full pathname
 * @param product the product object (optional)
 */
export function pageViewEvent(
  cartId: string,
  pathname: string,
  product?: ProductModel,
) {
  const split = pathname.split("/").slice(1);
  const pagePath = split.join(" | ");
  const siteSection = split.slice(0, -1).join(" | ");
  const entryPage = getCookieValue("graco_start") ?? "";
  const trafficType = (getCookieValue("traffic_type") as TrafficType) ?? "";
  const clickLocation =
    document.cookie
      .split("; ")
      .find((value) => value.startsWith("graco_clicklocation="))
      ?.split("=")[1] ?? "";

  // TODO Investigate moving out product specific info into Product View event.
  const event: PageViewEvent = {
    event: "pageView",
    event_name: "pageView",
    businessUnit: "",
    campaignCode: "",
    canonicalURL: window.location.href,
    customerSegment: "",
    ecid: getEcidValue(),
    firstPublishDate: "",
    modelGroupName: "",
    modelGroupID: "",
    modifiedDate: "",
    newProduct: product ? String(product.new) : "",
    webEnabled: product ? String(product.commerceEnabled) : "",
    pageName: pagePath,
    pageReferrer: document.referrer,
    pageSiteSection: siteSection,
    seoOptimized: "no",
    templateType: product ? "commerceTools/productDetailPage" : "",
    wtbCode: product?.WTB ?? "",
    productSKU: product?.sku ?? "",
    salesforceCID: "",
    traffic_type: trafficType,
    cartID: cartId,
    clickLocation: clickLocation,
    graco_start: entryPage,
    pageTitle: document.title,
  };
  window.adobeDataLayer.push(event);
}

/**
 * Push place order click event onto adobe analytics data layer.
 * @param cart the cart object
 */
export function placeOrderClickEvent(cart: CartModel) {
  const event: PlaceOrderClickEvent = {
    event: "place_order_click",
    event_name: "place_order_click",
    cartID: cart.id,
    totalAmount: cart.netPrice.formattedValue!,
    cartItemsCount: cart.entries.length,
  };
  window.adobeDataLayer.push(event);
}

/**
 * Push scroll depth event onto adobe analytics data layer.
 * @param percentage scroll depth percentage
 */
export function scrollDepthEvent(percentage: string) {
  const event: ScrollDepthEvent = {
    event: "scrollDepthEvent",
    event_name: "scrollDepthEvent",
    scrollDepthPercentage: percentage,
  };
  window.adobeDataLayer.push(event);
}
/**
 * Pushes a "viewRecommended" event to the Adobe Analytics data layer when recommended products are shown.
 *
 * @param section The section of recommended products (e.g., 'Recommended Products', 'Most Viewed Products').
 * @param cartId the cart object.
 * @param products Array of recommended products with SKU, name, category, and price.
 */
export function viewRecommendedEvent(
  section: SectionType,
  cartId: string,
  products: ProductModel[],
) {
  const event: ViewRecommendedEvent = {
    event: "viewRecommended",
    event_name: "viewRecommended",
    section: section,
    // PDP rule: null if no cartId present
    cartID: cartId.length > 0 ? cartId : null,
    products: products.map((p) => ({
      SKU: p.sku,
      name: p.name,
      category: "homeowner",
      unitPrice: p.price?.value ? (p.price?.value / 100).toFixed(2) : "",
    })),
  };
  window.adobeDataLayer.push(event);
}

/**
 * Pushes a "clickRecommended" event to the Adobe Analytics data layer when a user clicks on a recommended product.
 *
 * @param product The recommended product that was clicked, containing SKU, name, category, and price.
 * @param positionInList The position of the product in the recommended list (e.g., '1', '2', '3').
 * @param sectionType The section where the product is displayed (e.g., 'Recommended Products', 'Most Viewed Products').
 * @param cartId The cart ID if available, otherwise null.
 */
export function clickRecommendedEvent(
  product: ProductModel,
  positionInList: string,
  sectionType: string,
  cartId: string | null,
) {
  const event: ClickRecommendedEvent = {
    event: "clickRecommended",
    event_name: "clickRecommended",
    sectionType,
    positionInList,
    cartID: cartId ? cartId : null,
    product: {
      SKU: product.sku,
      name: product.name,
      category: "homeowner",
      unitPrice: (product.price?.value / 100).toFixed(2),
    },
  };
  window.adobeDataLayer.push(event);
}
/**
 * Push place order click event onto adobe analytics data layer.
 * @param cart the cart object
 */
export function purchaseEvent(cart: CartModel) {
  const mapPriceValue = (price: number) => (price / 100).toFixed(2);
  const products: Product[] = cart.entries.map((entry) => ({
    SKU: entry.product.sku,
    name: entry.product.name,
    category: "homeowner", // TODO remove homeowner to Include category information
    quantity: entry.quantity,
    currencyCode: entry.netPrice.currencyIso,
    priceTotal: mapPriceValue(entry.netPrice.value),
  }));
  const event: PurchaseEvent = {
    event: "purchase",
    event_name: "purchase",
    currencyCode: cart.netPrice.currencyIso,
    discountAmount: cart.discount?.amount.formattedValue || "",
    discountCode: cart.discountCode || "",
    paymentType: "", // TODO include
    priceTotal: mapPriceValue(cart.netPrice.value) || "",
    paymentID: "", // TODO do we really need this? ref JBP1-1008. If needed, maybe add to cart model via cart.paymentInfo?.payments[0].id
    shippingAmount: cart.shippingMethod?.deliveryCost.formattedValue || "",
    transactionID: "", // TODO Include transaction id
    taxAmount: "", // TODO Include tax amount
    products: products,
  };
  window.adobeDataLayer.push(event);
}

export function pushToAdobeDataLayer(data: AnalyticsEvent) {
  window.adobeDataLayer.push(data);
}
