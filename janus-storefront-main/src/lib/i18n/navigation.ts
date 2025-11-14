import { getLocale } from "next-intl/server";

export default async function baseUrl(): Promise<string> {
  const locale = await getLocale();
  const split = locale.split("-");
  const language = split[0].toLowerCase();
  const country = split[1].toLowerCase();
  return `/${country}/${language}`;
}
