import { routing } from "@/lib/i18n/routing";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Typically corresponds to the `[locale]` segment
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("locale")?.value;
  const locale = hasLocale(routing.locales, cookieValue)
    ? cookieValue
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
