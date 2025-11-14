"use server";

import { getCart } from "@/lib/bff/cart";
import { CurrencyEnumSchema } from "@/lib/i18n/currency";
import { logger } from "@/lib/logger";
import { emptyCart } from "@/lib/models/cartModel";
import {
  getSessionCartId,
  setSessionCurrency,
} from "@/lib/session/sessionStore";

export default async function changeCurrencyAction(formData: FormData) {
  try {
    const validatedField = CurrencyEnumSchema.safeParse(
      formData.get("isoCode"),
    );
    if (validatedField.success) {
      await setSessionCurrency(validatedField.data);
    }
    const cartId = await getSessionCartId();
    if (cartId) {
      return getCart(cartId);
    } else {
      return emptyCart();
    }
  } catch (e) {
    logger.error({ err: e }, "Error when changing session currency");
  }
}
