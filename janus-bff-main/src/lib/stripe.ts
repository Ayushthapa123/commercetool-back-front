import Stripe from "stripe";

export async function getStripe() {
  const { STRIPE_SECRET_KEY } = process.env;
  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe API key is missing in the environment variables");
  }

  return new Stripe(STRIPE_SECRET_KEY);
}
