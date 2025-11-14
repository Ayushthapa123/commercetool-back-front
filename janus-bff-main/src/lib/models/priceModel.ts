export type PriceModel = {
  currencyIso: string;
  formattedValue?: string;
  value: number;
};

export function emptyPrice(): PriceModel {
  return {
    currencyIso: "",
    formattedValue: "",
    value: 0,
  };
}
