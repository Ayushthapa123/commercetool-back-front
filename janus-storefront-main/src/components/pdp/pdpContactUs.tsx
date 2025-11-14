import { Mail } from "@/components/icons/mail";
import { Phone } from "@/components/icons/phone";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

type Props = {
  urlBase: string;
};

export async function PDPContactUs({ urlBase }: Readonly<Props>) {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: "ProductPage",
  });

  return (
    <section
      id="questionCtaSectionBlock"
      className="bg-primary-blue relative mx-0 ml-[calc(-50vw+50%)] flex w-screen max-w-screen flex-col items-center-safe overflow-hidden px-5 py-16 md:px-25"
    >
      {/* Contact Us Area */}
      <Image
        src="/g-outline.svg"
        alt="Graco G"
        width={683}
        height={592}
        className="absolute top-[12%] right-[11%] h-62 w-71 translate-x-1/2 -translate-y-1/2 opacity-25 sm:right-[-5%] sm:translate-x-0 md:top-[50%] md:h-148 md:w-171"
      />
      <div className="font-roboto-condensed z-10 container flex w-full flex-col gap-10 px-2 py-10 text-white md:px-0">
        <p className="text-5xl font-bold">{t("haveQuestions")}</p>
        <div className="flex w-full flex-col gap-10 md:flex-row">
          <div className="flex w-full flex-col items-baseline gap-4">
            <p className="text-2xl font-bold uppercase">{t("callSupport")}</p>
            <p className="font-roboto grow text-sm">{t("available247")}</p>
            <a href="tel:+1888-541-9788">
              <Button className="bg-primary-blue h-10.5 cursor-pointer border-white p-3 text-white hover:bg-white hover:text-black">
                <div className="flex flex-row items-center gap-2">
                  <Phone />
                  <span>{t("supportNumber")}</span>
                </div>
              </Button>
            </a>
          </div>
          <div className="flex w-full flex-col items-baseline gap-4">
            <p className="text-2xl font-bold uppercase">{t("emailSupport")}</p>
            <p className="font-roboto grow text-sm">{t("available247")}</p>
            <Link href={`${urlBase}/homeowner/support/contact-us.html`}>
              <Button className="bg-primary-blue h-10.5 cursor-pointer border-white p-3 text-white hover:bg-white hover:text-black">
                <div className="flex flex-row items-center gap-2">
                  <Mail />
                  <span>{t("sendAMessage")}</span>
                </div>
              </Button>
            </Link>
          </div>
          <div className="flex w-full flex-col items-baseline gap-4">
            <p className="text-2xl font-bold uppercase">{t("findARetailer")}</p>
            <p className="font-roboto grow text-sm">{t("getHelpChoosing")}</p>
            <Link href={`${urlBase}/homeowner/how-to-buy/find-a-retailer.html`}>
              <Button className="bg-primary-blue h-10.5 cursor-pointer border-white p-3 text-white hover:bg-white hover:text-black">
                {t("search")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
