import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("404");
  return (
    <div className="text-center">
      {/* TODO next/Image? */}
      <img
        src="/graco-logo-horiz-304x60.png"
        alt="Graco logo"
        width={304}
        height={60}
        className="mx-auto my-10"
      />
      <h2 className="font-roboto-condensed my-3 text-4xl font-black tracking-wider uppercase">
        {t("notFoundError")}
      </h2>
      <h4 className="font-roboto-condensed my-3 text-2xl font-black tracking-wider">
        {t("lookingForSomething")}
      </h4>
      <p className="my-3">{t("sorry")}</p>
      <h5 className="text-xl">
        <Link
          title="homepage"
          href="/"
          target="_self"
          rel="noopener noreferrer"
          className="text-blue-800 hover:underline"
        >
          {t("clickHereHomepage")}
        </Link>
      </h5>
    </div>
  );
}
