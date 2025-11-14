import { logger } from "@/lib/logger";
import { DAMLinkImage } from "@/lib/pim/productData";

const getImageContextPriority = (context: string): [number, number] => {
  const lowerContext = context.toLowerCase();
  if (lowerContext === "main") return [0, 0];

  const altMatch = lowerContext.match(/^alt (\d+)$/);
  if (altMatch) return [1, parseInt(altMatch[1], 10)];

  const appMatch = lowerContext.match(/^application (\d+)$/);
  if (appMatch) return [2, parseInt(appMatch[1], 10)];

  return [3, 0]; // fallback for unknown contexts
};

const sortByImageContext = (a: DAMLinkImage, b: DAMLinkImage): number => {
  const aPriority = getImageContextPriority(a.context);
  const bPriority = getImageContextPriority(b.context);
  return aPriority[0] - bPriority[0] || aPriority[1] - bPriority[1];
};

export const sortImagesByContext = (images: DAMLinkImage[]): DAMLinkImage[] => {
  if (images) {
    return images.slice().sort(sortByImageContext);
  } else {
    logger.warn("no images, can't sort");
    return [];
  }
};
