"use server";

import { addToCart, createCart, updateCartTaxMode } from "@/lib/bff/cart";
import { CartModel, emptyCart } from "@/lib/models/cartModel";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string({
    invalid_type_error: "Invalid part number",
  }),
  quantity: z.number().int().positive(),
  cartId: z.string().optional(),
});

export interface ActionResponse {
  cart: CartModel;
  message: string | undefined;
}

export default async function addToCartAction(
  state: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const validatedFields = addToCartSchema.safeParse({
    productId: formData.get("productId"),
    quantity: z.coerce.number().parse(formData.get("quantity")),
    cartId: formData.get("cartId")?.toString(),
  });

  if (!validatedFields.success) {
    const message = validatedFields.error.issues
      .map((zodIssue) => zodIssue.message)
      .flat()
      .join(", ");
    return {
      cart: emptyCart(),
      message: message,
    };
  }
  const { productId, quantity, cartId } = validatedFields.data;
  const addToCartFunction = () => addToCart(productId, quantity);

  const cart =
    state && cartId && cartId !== ""
      ? await addToCartFunction()
      : await createCart().then(updateCartTaxMode).then(addToCartFunction);

  return {
    cart: cart,
    message: "success",
  };
}
