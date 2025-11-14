import { expect, test } from "vitest";
import { CURRENCIES, CurrencyEnumSchema } from "./currency";

test("currency validation schema matches available currencies", () => {
  expect(Object.keys(CurrencyEnumSchema.enum)).toStrictEqual(
    Object.keys(CURRENCIES),
  );
});
