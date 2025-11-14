import { PaymentStatus } from "@/constants";
import baseUrl from "@/lib/i18n/navigation";
import { redirect } from "next/navigation";

/**
 * Handles stripe payment processing and redirects to order confirmation page.
 * @param param0 query parameters from the url
 * @returns a redirect to another url
 */
export default async function StripeRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const urlBase = await baseUrl();

  const redirectStatus = params?.redirect_status;
  const cartId = params?.cartId;

  let redirectUrl = `${urlBase}/checkout?error=UNKNOWN`;

  if (redirectStatus === PaymentStatus.SUCCEEDED) {
    redirectUrl = `${urlBase}/order/confirmation.html/${cartId}`;
  }

  return redirect(redirectUrl);
}
