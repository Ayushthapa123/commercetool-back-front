import z from "zod";

export type PriceModel = {
  currencyIso: string;
  formattedValue?: string;
  value: number;
};

export const PriceModelSchema = z.object({
  currencyIso: z.string(),
  formattedValue: z.string().optional(),
  value: z.number(),
});

export function emptyPrice(): PriceModel {
  return {
    currencyIso: "",
    formattedValue: "",
    value: 0,
  };
}
